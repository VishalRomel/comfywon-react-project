# ComfyWon React Storefront

React + Vite landing page for ComfyWon, with a separate FastAPI backend that creates secure Shopify checkouts via the Storefront API. Customers are redirected to Shopify's hosted checkout for payment, and a Shopify-installed Amazon MCF app handles fulfillment.

```
React frontend (Vite)
  → FastAPI backend (Fly.io)
    → Shopify Storefront API cartCreate
      → Shopify hosted checkout
        → Shopify order
          → Shopify MCF app (manually installed)
            → Amazon MCF fulfillment
```

No payment data, customer data, or prices are handled by the React app or the backend. Shopify is the source of truth.

## Project layout

```text
.
├── src/
│   ├── App.jsx          ComfyWon landing page + cart UI
│   ├── api/checkout.js  Frontend → backend HTTP utility
│   ├── main.jsx
│   └── index.css
├── backend/             FastAPI app — see backend/README.md
├── public/              Static assets
├── .env.example         VITE_API_URL template (frontend)
├── index.html
├── vite.config.js
└── package.json
```

## Run locally

You need two terminals — one for the frontend, one for the backend.

### Backend

See [backend/README.md](backend/README.md) for full details. Short version:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux/WSL
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env       # then fill in real Shopify values
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: <http://localhost:8000/> → `{"status":"ok"}`.

### Frontend

```bash
npm install
cp .env.example .env       # contains VITE_API_URL=http://localhost:8000
npm run dev
```

Open the URL Vite prints (default <http://localhost:5173>).

## Deploy to production

### Backend → Fly.io (`comfywon-backend`)

See [backend/README.md](backend/README.md#deploy-to-flyio) for the full walk-through. After `fly deploy`, the backend is reachable at:

```text
https://comfywon-backend.fly.dev
```

Set Fly secrets **before** the first deploy:

```bash
cd backend
fly secrets set SHOPIFY_STORE_DOMAIN=comfywon.myshopify.com
fly secrets set SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
fly secrets set SHOPIFY_API_VERSION=2026-04
fly secrets set FRONTEND_ORIGINS=https://comfywon.vercel.app
fly secrets set MAX_CHECKOUT_QUANTITY=5
```

`FRONTEND_ORIGINS` is a comma-separated allowlist. Production CORS must list **only** your real frontend origins — never `*`, never `localhost`. Update it (and re-deploy is **not** needed — `fly secrets set` triggers a restart) every time you add a domain:

```bash
# After Vercel assigns the project URL:
fly secrets set FRONTEND_ORIGINS=https://comfywon.vercel.app

# Once you buy comfywon.com and point it at Vercel:
fly secrets set FRONTEND_ORIGINS=https://comfywon.com,https://www.comfywon.com,https://comfywon.vercel.app
```

### Frontend → Vercel

1. Push this repo to GitHub (private is fine).
2. <https://vercel.com/new> → Import the repo.
3. Vercel auto-detects Vite. In **Settings → Environment Variables** add:

   | Name           | Value                                | Environments              |
   | -------------- | ------------------------------------ | ------------------------- |
   | `VITE_API_URL` | `https://comfywon-backend.fly.dev`   | Production, Preview, Development |

4. Click **Deploy**. Vercel builds and gives you a URL like `https://comfywon.vercel.app`.
5. Copy that URL into the backend's `FRONTEND_ORIGINS` Fly secret (above) so CORS allows it.
6. Test checkout on the live Vercel URL — it should redirect to Shopify and back.

`VITE_API_URL` is injected at **build time**. Any change to it requires a rebuild (Vercel auto-rebuilds when you push to `main` or change env vars).

### Custom domain (whenever you're ready)

You don't need a custom domain to launch — `comfywon.vercel.app` works for real customers and real Shopify checkouts. When you're ready to use `comfywon.com`:

1. Buy it from any registrar (Namecheap, Cloudflare, Porkbun, Google Domains successor, etc.).
2. In Vercel → **Settings → Domains** → Add `comfywon.com` and `www.comfywon.com`. Vercel shows you the DNS records to set at your registrar.
3. Set DNS at the registrar (Vercel's instructions are exact). Propagation: a few minutes to a few hours.
4. Update Fly's `FRONTEND_ORIGINS` to add the new domains (see the second `fly secrets set` example above).
5. Test checkout from the new domain.

No frontend code changes needed.

## Manual Shopify / Amazon MCF setup (required before launch)

This codebase contains **zero** Amazon SDK / MCF / SP-API code. Fulfillment is handled by an app you install in Shopify Admin.

**Status:** MCF app to be installed before launch. Shopify and Amazon SKUs already match for both pink and white variants — confirmed by the store owner.

Pre-launch steps:

1. Install an **Amazon MCF (Multi-Channel Fulfillment)** app from the Shopify App Store (e.g. "Amazon MCF" by ByteStand or the official Amazon connector — pick one and stick with it).
2. Authenticate it against your Amazon Seller Central account.
3. Re-confirm SKU mapping inside the MCF app's mapping screen (Shopify SKU → Amazon SKU). They should already match, but the app needs each pairing acknowledged.
4. Pick fulfillment defaults (shipping speed, packaging, packing slip).
5. **Place a real test order** through the live Vercel → Shopify checkout (use Shopify's Bogus Gateway or a low-value real payment) and verify:
   - Shopify shows the order under **Orders**
   - The MCF app picks it up and creates an Amazon fulfillment request
   - Amazon ships it and tracking syncs back to Shopify
   - The customer (you) receives Shopify's confirmation and shipping emails
6. Disable Shopify's password protection: **Online Store → Preferences → Password protection → uncheck**.

Until step 3 is done, paid Shopify orders will not be fulfilled by Amazon. Until step 6, the public can't reach checkout.

## What this project does NOT do

- No custom payment handling. Shopify owns the entire checkout, payment, and order-confirmation flow.
- No database. Cart state lives only in the user's browser (`localStorage`).
- No customer data is stored on the backend.
- No Amazon API calls. The Shopify-installed MCF app does all of that.
- No frontend secrets. Only `VITE_API_URL` (a public URL) is used in the React bundle.

## Tech

- React + Vite, Tailwind CSS, Framer Motion (frontend)
- FastAPI + httpx + Pydantic (backend)
- Shopify Storefront API `cartCreate` mutation
- Fly.io (backend hosting; replaceable with any container host)

## Final pre-launch checklist

See [backend/README.md → Final testing checklist](backend/README.md#final-testing-checklist) for the full list of items to verify before going live.
