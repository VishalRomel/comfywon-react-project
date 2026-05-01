# Agent Instructions — React + FastAPI + Shopify Checkout

## Goal

Add a secure checkout integration to the existing React ecommerce frontend.

Use this architecture:

```txt
React frontend
→ Python FastAPI backend
→ Shopify Storefront API cartCreate
→ Shopify hosted checkout
→ Shopify order
→ Manually configured Shopify MCF app
→ Amazon MCF fulfillment
```

Important: **do not build any Amazon MCF API integration.** The user/developer will manually install and configure the Shopify MCF app inside Shopify Admin. That app will send paid Shopify orders to Amazon MCF.

---

## Core rules

1. Preserve the existing frontend design unless a change is required for checkout.
2. Do not redesign, rewrite, or replace large parts of the frontend.
3. Do not add a database for version 1.
4. Do not collect card/payment details in React or Python.
5. Do not store customer data.
6. Do not expose secrets in frontend code.
7. Do not call Amazon MCF, Amazon SP-API, or any Amazon API.
8. Shopify is the source of truth for products, orders, customer data, payment status, confirmation emails, fulfillment status, and tracking.

---

## Ask the user when required

If a required value, token, domain, app setup, or manual action is missing, **stop and ask the user clearly**. Do not waste time guessing, generating fake values, or trying multiple random approaches.

Ask the user for these when needed:

```txt
Shopify store domain
Shopify Storefront API access token
Shopify ProductVariant GIDs for each variant
Production frontend domain
Fly.io app name
Whether cart supports one item or multiple items
Final Shopify SKU ↔ Amazon/FBA/MCF SKU mapping
Confirmation that the Shopify MCF app is manually installed/configured
```

Do not ask the user to paste secrets into public code. Tell them where to place secrets locally and how to set them on Fly.io.

---

## Required 3-phase execution plan

The agent must complete this project in exactly 3 phases.

After each phase, stop and tell the user what was completed, how to test it, and what command/message to send to continue. Do **not** continue into the next phase until the user explicitly says to continue, for example:

```txt
Continue to Phase 2
```

or:

```txt
Continue to Phase 3
```

If something is missing during a phase, stop and ask the user for the specific missing value or manual action. Do not guess.

### Phase 1 — Backend foundation and local Shopify checkout creation

Goal: create the FastAPI backend and prove it can create a Shopify checkout URL locally.

Work to complete:

```txt
Create backend folder if missing
Add FastAPI app structure
Add requirements.txt
Add .env.example
Add backend .gitignore
Add health endpoint: GET /
Add checkout endpoint: POST /api/create-checkout
Add Shopify Storefront API cartCreate logic
Add backend variant allowlist placeholder
Add quantity validation
Add CORS for local frontend origins
Add Dockerfile for future Fly.io deploy
Add backend README/local setup notes
```

Required user-provided values for this phase:

```txt
Shopify store domain
Shopify Storefront API access token
Shopify ProductVariant GIDs
Allowed quantity limit if different from 5
```

If these values are missing, ask the user before trying to fully test Shopify checkout creation.

Phase 1 test requirements:

```txt
Backend runs locally on http://localhost:8000
GET / returns { "status": "ok" }
POST /api/create-checkout rejects empty cart
POST /api/create-checkout rejects invalid variant ID
POST /api/create-checkout rejects quantity above max
Valid request returns Shopify checkoutUrl
No database added
No Amazon MCF/API code added
No secrets committed
```

Stop after Phase 1 and wait for user testing/approval.

### Phase 2 — Frontend cart flow and local React-to-backend integration

Goal: connect the existing React cart/checkout UX to the local backend without changing the site design.

Work to complete:

```txt
Add frontend checkout API utility
Use VITE_API_URL for backend URL
Add/update frontend .env example if needed
Wire Add to Cart to local cart state/localStorage
Show popup/modal after Add to Cart
Popup has Go to Checkout and Continue Shopping
Go to Checkout calls backend and redirects to Shopify checkoutUrl
Cart icon opens cart drawer/page
Checkout inside cart drawer/page calls backend and redirects
Buy Now does not checkout; it routes/scrolls to product listing/product section
Add loading state to checkout buttons
Prevent duplicate checkout clicks
Add friendly checkout error message
```

Phase 2 test requirements:

```txt
Frontend runs locally
Backend runs locally
Add to Cart stores selected variant/quantity
Popup/modal appears after Add to Cart
Continue Shopping closes popup and keeps item in cart
Go to Checkout calls backend
Cart icon opens cart drawer/page
Cart checkout button calls backend
Checkout buttons show loading state
Duplicate checkout clicks are prevented
Buy Now does not call checkout
Successful checkout redirects to Shopify checkout
No frontend secrets exposed
Existing frontend design is preserved
```

Stop after Phase 2 and wait for user testing/approval.

### Phase 3 — Production setup, Fly.io deployment support, and final documentation

Goal: prepare the backend/frontend for production deployment and document the manual Shopify/MCF setup.

Work to complete:

```txt
Create/update fly.toml only after user gives Fly.io app name
Confirm Dockerfile works for Fly.io
Document Fly.io secrets setup
Document frontend production VITE_API_URL setup
Document local and production run steps
Document manual Shopify MCF app setup reminder
Confirm no Amazon MCF/API code exists
Confirm no database exists
Confirm no .env files are committed
Add final testing checklist to README
```

Required user-provided values/manual actions for this phase:

```txt
Fly.io app name
Production frontend domain
Confirmation of frontend host/deployment method
Confirmation that Shopify MCF app is manually installed/configured in Shopify Admin
Shopify SKU ↔ Amazon/FBA/MCF SKU mapping confirmation
```

Phase 3 test requirements:

```txt
Fly backend deploys successfully
Fly health endpoint works
Fly secrets are set
Production CORS only allows intended frontend domains
Frontend production VITE_API_URL points to Fly backend
Production checkout reaches Shopify checkout
Shopify MCF app is manually configured by user/developer
Test order routes through Shopify and the installed MCF app
No direct MCF/API/SP-API code was added
```

Stop after Phase 3 and provide final summary.

---

## Customer checkout flow

Primary flow:

```txt
Customer selects variant/quantity
Customer clicks Add to Cart
Item is added to local cart state/localStorage
Popup/modal opens
Popup has: Go to Checkout + Continue Shopping
Go to Checkout calls backend and redirects to Shopify checkout
Continue Shopping closes popup and keeps item in cart
```

Cart icon flow:

```txt
Customer clicks cart icon in header/nav
Cart drawer/page opens
Customer clicks Checkout
React sends current cart to backend
Backend creates Shopify cart
React redirects to Shopify checkoutUrl
```

Button behavior:

```txt
Add to Cart = add item locally and open popup/modal
Go to Checkout = create Shopify checkout and redirect
Cart icon = open cart drawer/page
Checkout inside cart = create Shopify checkout and redirect
Buy Now = do NOT checkout; route/scroll to product listing/product section
```

---

## Backend requirements

Create a separate backend if one does not exist:

```txt
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   └── shopify.py
├── .env.example
├── .gitignore
├── requirements.txt
├── Dockerfile
└── README.md
```

Use:

```txt
Python 3.12+
FastAPI
Uvicorn
httpx
pydantic
python-dotenv
Dockerfile for Fly.io deployment
```

Required endpoint:

```txt
POST /api/create-checkout
```

Expected request:

```json
{
  "items": [
    {
      "variantId": "gid://shopify/ProductVariant/1234567890",
      "quantity": 1
    }
  ]
}
```

Expected response:

```json
{
  "checkoutUrl": "https://..."
}
```

Health endpoint:

```txt
GET /
```

Expected response:

```json
{
  "status": "ok"
}
```

Backend behavior:

1. Receive cart items from React.
2. Reject empty carts.
3. Validate every variant ID against a backend allowlist.
4. Validate quantity, default max 5 unless user says otherwise.
5. Use Shopify Storefront API `cartCreate`.
6. Return Shopify `checkoutUrl`.
7. Return clean customer-safe errors.

Do not create orders manually. Do not use Shopify Admin API for checkout creation. Do not collect shipping address or payment info in the custom frontend.

---

## Security requirements

Never expose private values in React.

Frontend must only contain public values like:

```env
VITE_API_URL=http://localhost:8000
```

Backend-only env values:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=replace_me
SHOPIFY_API_VERSION=2026-04
FRONTEND_ORIGINS=http://localhost:5173,https://yourdomain.com
MAX_CHECKOUT_QUANTITY=5
```

Do not commit `.env` files.

Backend `.gitignore` must include:

```txt
.env
.venv
__pycache__/
*.pyc
```

Frontend must not send price to backend. Send only variant IDs and quantity.

Backend must use a variant allowlist:

```python
ALLOWED_VARIANTS = {
    "gid://shopify/ProductVariant/1234567890": "Pink Heating Pad",
    "gid://shopify/ProductVariant/9876543210": "Beige Heating Pad",
}
```

Replace placeholders with real Shopify ProductVariant GIDs from the user.

CORS:

```txt
Local allowed origins:
http://localhost:5173
http://localhost:3000

Production allowed origins:
https://actual-domain.com
https://www.actual-domain.com
```

Do not use wildcard CORS in production.

Do not log sensitive customer info, addresses, payment details, or full Shopify responses.

Allowed logs:

```txt
checkout creation started
checkout creation succeeded/failed
variant validation failed
Shopify API status/error summary
```

---

## Frontend requirements

Add a checkout API utility, for example:

```txt
src/api/checkout.js
```

Example:

```js
export async function createCheckout(items) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error("Could not create checkout");
  }

  return response.json();
}
```

Connect this only to:

```txt
Go to Checkout button in add-to-cart popup/modal
Checkout button inside cart drawer/page
```

Do not connect `Buy Now` buttons to checkout.

Checkout button UX:

```txt
Normal: Checkout Securely
Loading: Redirecting to secure checkout...
Error: Checkout failed. Please try again.
```

Requirements:

1. Disable checkout button while loading.
2. Prevent duplicate checkout clicks.
3. Show friendly error messages.
4. Redirect with `window.location.href = data.checkoutUrl`.
5. Do not redirect if cart is empty.
6. Do not expose secrets.

Cart storage:

```txt
Use React state for active cart.
Use localStorage only if cart should persist after refresh.
Store variantId, quantity, and simple UI display data.
Do not treat stored price as trusted.
```

---

## Local development

Frontend env:

```env
VITE_API_URL=http://localhost:8000
```

Run backend:

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux/WSL
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Expected local URLs:

```txt
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

---

## Fly.io backend deployment

Use Fly.io unless the user chooses another backend host.

Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Only create `fly.toml` after the user gives the Fly app name or asks for deployment scaffolding.

Suggested `fly.toml`:

```toml
app = "YOUR-FLY-APP-NAME"
primary_region = "iad"

[http_service]
  internal_port = 8000
  force_https = true
  auto_start_machines = true
  auto_stop_machines = false
  min_machines_running = 1
  processes = ["app"]
```

Use `min_machines_running = 1` for production checkout speed unless the user chooses lower cost over cold-start avoidance.

Set Fly secrets:

```bash
fly secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
fly secrets set SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
fly secrets set SHOPIFY_API_VERSION=2026-04
fly secrets set FRONTEND_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
fly secrets set MAX_CHECKOUT_QUANTITY=5
```

Deploy:

```bash
cd backend
fly deploy
```

---

## Shopify / Amazon MCF rules

The user/developer will manually install and configure the Shopify MCF app in Shopify Admin.

The codebase must not:

```txt
call Amazon MCF API
call Amazon SP-API
create Amazon fulfillment requests
add Amazon SDKs
add Amazon API credentials
send order data directly to Amazon
```

The manually configured Shopify app handles:

```txt
sending paid Shopify orders to Amazon MCF
SKU mapping
fulfillment request creation
tracking sync
fulfillment status sync
customer shipping/tracking notifications through Shopify
```

Make sure Shopify SKUs match Amazon/FBA/MCF SKUs when possible. If SKU mapping info is missing, ask the user.

---

## Confirmation and email behavior

Do not build a custom payment confirmation system for version 1.

After purchase:

```txt
Shopify shows Thank You / Order Status page
Shopify sends order confirmation email
Shopify sends shipping/tracking emails if configured
Shopify MCF app handles fulfillment/tracking sync
```

If the user asks for a custom React thank-you page, make it generic unless a secure order lookup flow is added later. Do not fake exact order details.

---

## Do not do these

```txt
Do not build custom credit card checkout.
Do not store customer payment data.
Do not add a database without user approval.
Do not expose Shopify secrets in React.
Do not send prices from React to backend.
Do not trust frontend prices/product names.
Do not use wildcard CORS in production.
Do not redesign the frontend without permission.
Do not rewrite the whole frontend.
Do not add large unnecessary libraries.
Do not add authentication unless requested.
Do not build Amazon MCF/API/SP-API code.
Do not add fake order confirmation details.
Do not commit .env files.
Do not log sensitive customer details.
```

---

## Testing checklist

Before claiming completion, verify:

Backend:

```txt
GET / returns { "status": "ok" }
POST /api/create-checkout rejects empty cart
POST /api/create-checkout rejects invalid variant ID
POST /api/create-checkout rejects quantity above max
Valid request returns checkoutUrl
```

Frontend:

```txt
Add to Cart stores selected variant/quantity locally
Add-to-cart popup/modal appears
Continue Shopping closes modal and keeps cart item
Go to Checkout calls backend
Cart icon opens cart drawer/page
Cart checkout button calls backend
Checkout buttons show loading state
Checkout buttons prevent duplicate clicks
Buy Now does not call checkout
Customer redirects to Shopify only from checkout actions
No secrets appear in browser source/devtools
```

Production:

```txt
Fly backend deploys successfully
Fly health endpoint works
CORS only allows intended frontend domains
Frontend VITE_API_URL points to Fly backend
Production checkout reaches Shopify checkout
```

Shopify/MCF manual checks:

```txt
Shopify product variants exist
Variant IDs match backend allowlist
Shopify SKUs match Amazon/FBA/MCF SKUs when possible
User/developer manually installed/configured Shopify MCF app
Test order routes through Shopify and the installed MCF app
No direct MCF API calls were added
```

---

## README requirements

Add/update README with:

```txt
How to run frontend locally
How to run backend locally
How to create backend .env from .env.example
What Shopify values the user must provide
How to set Fly.io secrets
How to deploy backend to Fly.io
How to set frontend production VITE_API_URL
Manual reminder: install/configure Shopify MCF app in Shopify Admin
```

Keep README practical and beginner-friendly.

---

## Final deliverable

The finished work should provide:

```txt
React-to-FastAPI communication
Secure Shopify checkout creation
No custom database
Local development support
Fly.io backend deployment support
.env.example files
README setup instructions
Preserved frontend design
Fast checkout UX
No Amazon MCF API/code integration
```

If a required value is missing, ask the user. Do not invent it.

