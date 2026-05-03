import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SHOPIFY_STORE_DOMAIN: str = os.getenv("SHOPIFY_STORE_DOMAIN", "")
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: str = os.getenv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "")
    SHOPIFY_API_VERSION: str = os.getenv("SHOPIFY_API_VERSION", "2026-04")

    FRONTEND_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            "http://localhost:5173,http://localhost:3000",
        ).split(",")
        if origin.strip()
    ]

    MAX_CHECKOUT_QUANTITY: int = int(os.getenv("MAX_CHECKOUT_QUANTITY", "5"))

    ALLOWED_VARIANTS: dict[str, str] = {
        "gid://shopify/ProductVariant/42387049185315": "Pink variant",
        "gid://shopify/ProductVariant/42387049218083": "White variant",
    }


settings = Settings()
