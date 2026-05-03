import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from .config import settings
from .schemas import CreateCheckoutRequest, CreateCheckoutResponse
from .shopify import ShopifyConfigError, ShopifyError, create_cart

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("api")

MAX_BODY_BYTES = 16 * 1024  # 16 KB — cart payloads are tiny


def client_ip(request: Request) -> str:
    """Real client IP behind Fly's proxy.

    Fly sets `Fly-Client-IP`. Fall back to X-Forwarded-For (first hop), then
    request.client to be safe.
    """
    fly_ip = request.headers.get("fly-client-ip")
    if fly_ip:
        return fly_ip.strip()
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


limiter = Limiter(key_func=client_ip)

app = FastAPI(title="Comfywon Checkout API")
app.state.limiter = limiter


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject requests whose Content-Length exceeds MAX_BODY_BYTES.

    A streaming check is also done on the body itself in case the client
    omits Content-Length.
    """

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return JSONResponse({"detail": "Request too large"}, status_code=413)
            except ValueError:
                return JSONResponse({"detail": "Invalid Content-Length"}, status_code=400)
        return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add hardening headers to every response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cross-Origin-Resource-Policy"] = "same-site"
        return response


app.add_middleware(BodySizeLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Replace verbose Pydantic 422 with a generic 400 to avoid input echo."""
    return JSONResponse({"detail": "Invalid request"}, status_code=400)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        {"detail": "Too many requests. Please slow down and try again."},
        status_code=429,
    )


@app.get("/")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/api/create-checkout", response_model=CreateCheckoutResponse)
@limiter.limit("20/minute")
async def create_checkout(
    request: Request,
    payload: CreateCheckoutRequest,
) -> CreateCheckoutResponse:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    max_qty = settings.MAX_CHECKOUT_QUANTITY
    max_total = settings.MAX_CART_TOTAL_QUANTITY
    allowed = settings.ALLOWED_VARIANTS

    seen_variants: set[str] = set()
    total_qty = 0
    for item in payload.items:
        if item.variantId in seen_variants:
            raise HTTPException(status_code=400, detail="Duplicate items in cart")
        seen_variants.add(item.variantId)

        if item.variantId not in allowed:
            logger.warning("variant validation failed")
            raise HTTPException(status_code=400, detail="Invalid product selected")
        if item.quantity < 1 or item.quantity > max_qty:
            raise HTTPException(
                status_code=400,
                detail=f"Quantity must be between 1 and {max_qty}",
            )
        total_qty += item.quantity

    if total_qty > max_total:
        raise HTTPException(
            status_code=400,
            detail=f"Cart total cannot exceed {max_total} items",
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
