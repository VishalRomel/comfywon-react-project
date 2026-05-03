import logging
import httpx

from .config import settings

logger = logging.getLogger("shopify")

CART_CREATE_MUTATION = """
mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
"""


class ShopifyError(Exception):
    pass


class ShopifyConfigError(ShopifyError):
    pass


def _endpoint() -> str:
    if not settings.SHOPIFY_STORE_DOMAIN:
        raise ShopifyConfigError("SHOPIFY_STORE_DOMAIN is not configured")
    if not settings.SHOPIFY_STOREFRONT_ACCESS_TOKEN:
        raise ShopifyConfigError("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured")
    return (
        f"https://{settings.SHOPIFY_STORE_DOMAIN}"
        f"/api/{settings.SHOPIFY_API_VERSION}/graphql.json"
    )


async def create_cart(items: list[dict]) -> str:
    """Create a Shopify cart via the Storefront API and return checkoutUrl.

    items: list of {"variantId": "...", "quantity": int}
    """
    url = _endpoint()
    payload = {
        "query": CART_CREATE_MUTATION,
        "variables": {
            "input": {
                "lines": [
                    {
                        "merchandiseId": item["variantId"],
                        "quantity": item["quantity"],
                    }
                    for item in items
                ]
            }
        },
    }
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": settings.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    }

    logger.info("checkout creation started")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, json=payload, headers=headers)
    except httpx.HTTPError as exc:
        logger.error("Shopify API request failed: %s", exc.__class__.__name__)
        raise ShopifyError("Could not reach Shopify") from exc

    if response.status_code >= 400:
        logger.error("Shopify API status: %s", response.status_code)
        raise ShopifyError("Shopify rejected the checkout request")

    data = response.json()

    if data.get("errors"):
        logger.error("Shopify GraphQL errors present")
        raise ShopifyError("Shopify returned a GraphQL error")

    cart_create = (data.get("data") or {}).get("cartCreate") or {}
    user_errors = cart_create.get("userErrors") or []
    if user_errors:
        logger.error("Shopify userErrors count: %d", len(user_errors))
        raise ShopifyError("Could not create checkout for these items")

    cart = cart_create.get("cart") or {}
    checkout_url = cart.get("checkoutUrl")
    if not checkout_url:
        logger.error("Shopify cartCreate returned no checkoutUrl")
        raise ShopifyError("Shopify did not return a checkout URL")

    logger.info("checkout creation succeeded")
    return checkout_url
