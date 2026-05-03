from pydantic import BaseModel, ConfigDict, Field


VARIANT_ID_PATTERN = r"^gid://shopify/ProductVariant/\d{1,32}$"


class CartItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    variantId: str = Field(..., pattern=VARIANT_ID_PATTERN, max_length=128)
    quantity: int = Field(..., ge=1, le=1000)


class CreateCheckoutRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: list[CartItem] = Field(..., max_length=20)


class CreateCheckoutResponse(BaseModel):
    checkoutUrl: str
