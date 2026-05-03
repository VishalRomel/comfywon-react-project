from pydantic import BaseModel, Field


class CartItem(BaseModel):
    variantId: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=1)


class CreateCheckoutRequest(BaseModel):
    items: list[CartItem]


class CreateCheckoutResponse(BaseModel):
    checkoutUrl: str
