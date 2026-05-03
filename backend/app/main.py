import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .schemas import CreateCheckoutRequest, CreateCheckoutResponse
from .shopify import ShopifyConfigError, ShopifyError, create_cart

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("api")

app = FastAPI(title="Comfywon Checkout API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/api/create-checkout", response_model=CreateCheckoutResponse)
async def create_checkout(payload: CreateCheckoutRequest) -> CreateCheckoutResponse:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    max_qty = settings.MAX_CHECKOUT_QUANTITY
    allowed = settings.ALLOWED_VARIANTS

    for item in payload.items:
        if item.variantId not in allowed:
            logger.warning("variant validation failed")
            raise HTTPException(status_code=400, detail="Invalid product selected")
        if item.quantity < 1 or item.quantity > max_qty:
            raise HTTPException(
                status_code=400,
                detail=f"Quantity must be between 1 and {max_qty}",
            )

    try:
        checkout_url = await create_cart(
            [{"variantId": i.variantId, "quantity": i.quantity} for i in payload.items]
        )
    except ShopifyConfigError:
        logger.error("Shopify configuration missing")
        raise HTTPException(status_code=500, detail="Checkout service not configured")
    except ShopifyError:
        logger.error("checkout creation failed")
        raise HTTPException(status_code=502, detail="Could not create checkout")

    return CreateCheckoutResponse(checkoutUrl=checkout_url)
