# Comfywon Checkout Backend

FastAPI service that creates Shopify Storefront API carts and returns a hosted Shopify checkout URL.

This backend never collects card or payment data. Shopify handles checkout, payment, order confirmation, and the manually configured Shopify MCF app handles fulfillment via Amazon MCF.

## Local setup

1. Create and activate a virtualenv:

   ```bash
   cd backend
   python -m venv .venv

   # Windows
   .venv\Scripts\activate

   # macOS/Linux/WSL
   source .venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in your Shopify values:

   ```bash
   cp .env.example .env
   ```

   Required values:

   - `SHOPIFY_STORE_DOMAIN` — e.g. `your-store.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — Storefront API access token
   - `SHOPIFY_API_VERSION` — defaults to `2026-04`
   - `FRONTEND_ORIGINS` — comma-separated allowed origins for CORS
   - `MAX_CHECKOUT_QUANTITY` — default `5`

4. Update the `ALLOWED_VARIANTS` dict in `app/config.py` with your real Shopify ProductVariant GIDs.

5. Run the server:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   - Health: <http://localhost:8000/>
   - Checkout: `POST http://localhost:8000/api/create-checkout`

## Endpoints

### `GET /`

Returns:

```json
{ "status": "ok" }
```

### `POST /api/create-checkout`

Request body:

```json
{
  "items": [
    { "variantId": "gid://shopify/ProductVariant/1234567890", "quantity": 1 }
  ]
}
```

Response body:

```json
{ "checkoutUrl": "https://your-store.myshopify.com/cart/c/..." }
```

Validation:

- empty cart → 400
- variant not in allowlist → 400
- quantity outside `1..MAX_CHECKOUT_QUANTITY` → 400
- Shopify call failure → 502
- missing Shopify config → 500

## Security notes

- Never commit `.env`.
- Frontend sends only `variantId` and `quantity` — never price or product names.
- Backend re-validates every variant against `ALLOWED_VARIANTS` and never trusts the frontend.
- Production CORS should list only your real frontend domains, not wildcards.

## Deploy to Fly.io

The included `Dockerfile` and `.dockerignore` are ready for Fly.io. `fly.toml` is generated once you choose an app name (see step 1).

### One-time setup

1. Install the Fly CLI: <https://fly.io/docs/flyctl/install/>
2. From the `backend/` directory:

   ```bash
   fly auth login
   fly launch --no-deploy --copy-config --name comfywon-backend --region iad
   ```

   - `--no-deploy` lets you set secrets before the first deploy.
   - `--copy-config` reuses the `fly.toml` already in this folder.
   - The included `fly.toml` already pins `min_machines_running = 1` so the first checkout request after idle isn't slowed by a cold start. If you want to optimize for cost over latency, lower it to `0` and let Fly auto-stop the machine.

3. Set Fly secrets (these never leave Fly's vault and are not visible in the repo):

   ```bash
   fly secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   fly secrets set SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
   fly secrets set SHOPIFY_API_VERSION=2026-04
   # Pre-launch: only the Vercel preview URL.
   fly secrets set FRONTEND_ORIGINS=https://comfywon.vercel.app

   # After custom domain is wired up:
   # Current production origins:
   fly secrets set FRONTEND_ORIGINS=https://shopcomfywon.com,https://www.shopcomfywon.com,https://comfywon-comfytemp-project.vercel.app
   fly secrets set MAX_CHECKOUT_QUANTITY=5
   ```

   **Production CORS should list only your real frontend domains** — never `*` and never `localhost` in production.

### Deploy / redeploy

```bash
cd backend
fly deploy
```

After deploy:

- Health: `https://comfywon-backend.fly.dev/` should return `{"status":"ok"}`
- Checkout endpoint: `POST https://comfywon-backend.fly.dev/api/create-checkout`

### Useful Fly commands

```bash
fly status         # show app health
fly logs           # tail container logs
fly secrets list   # see which secrets are set (not their values)
fly machines list  # see running machines
```

## Manual Shopify / MCF setup (required, not handled by this code)

This codebase **never** calls Amazon MCF, SP-API, or any Amazon service. Fulfillment is handled by a Shopify-installed app you configure manually:

1. **Shopify Admin → Apps → Shopify App Store** → install the **Amazon MCF (Multi-Channel Fulfillment)** app you've selected.
2. Authenticate the app to your Amazon Seller Central account.
3. **Map every Shopify SKU to its matching Amazon/FBA/MCF SKU** in the app's mapping screen. Mismatched SKUs are the most common reason MCF orders silently fail.
4. Pick fulfillment defaults (shipping speed, packing slip, etc.).
5. Place a test order through the live Shopify checkout and confirm:
   - Shopify shows the order under **Orders**.
   - The MCF app picks it up and creates an Amazon fulfillment request.
   - Amazon ships it and tracking syncs back to Shopify.
   - The customer receives Shopify's confirmation and shipping emails.

Until step 3 is done correctly, paid Shopify orders will not be fulfilled by Amazon.

## Final testing checklist

### Backend

- [ ] `GET /` returns `{ "status": "ok" }`
- [ ] `POST /api/create-checkout` rejects empty cart (400)
- [ ] `POST /api/create-checkout` rejects unknown variant (400)
- [ ] `POST /api/create-checkout` rejects quantity > `MAX_CHECKOUT_QUANTITY` (400)
- [ ] Valid request returns a real Shopify `checkoutUrl` (200)
- [ ] No database service is running anywhere
- [ ] No Amazon SDK / MCF / SP-API code is present (verified via repo grep)

### Production (after Fly deploy)

- [ ] `https://comfywon-backend.fly.dev/` returns `{ "status": "ok" }`
- [ ] `fly secrets list` shows all five Shopify env vars
- [ ] CORS preflight from your real frontend domain succeeds; `*` and stray `localhost` origins are not allowed
- [ ] Frontend production build has `VITE_API_URL` pointing at Fly URL
- [ ] Customer-facing checkout button on the production site redirects to a real Shopify hosted checkout
- [ ] No `.env` files were committed (`git log --all -- backend/.env` returns nothing)

### Shopify / MCF

- [ ] Shopify store has been published (or test password is shared with the QA tester)
- [ ] Shopify ProductVariant GIDs in `app/config.py` `ALLOWED_VARIANTS` match the live products
- [ ] Shopify SKUs match Amazon/FBA/MCF SKUs in the MCF app's mapping screen
- [ ] One end-to-end test order: cart → checkout → payment → Shopify order → MCF app → Amazon fulfillment → tracking back in Shopify
