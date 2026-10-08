# GreenBasket – Online Grocery Store

A responsive MERN grocery storefront with an original GreenBasket identity, 240-item catalog, persistent light/dark mode, JWT authentication, watchlist, cart, delivery profile, Cash on Delivery, Razorpay verification, and order history.

## Highlights

- Original GreenBasket logo and a bundled, AI-generated 16-category photo sheet with image fallback. These are representative category images, not individual product/packaging photographs. Valid product image URLs take precedence.
- 240 GreenBasket products across 16 categories, stored in MongoDB Atlas.
- Mobile-first layouts for phones, tablets, laptops, and wide screens.
- Light/dark theme switch with saved preference and system-theme fallback.
- Server-authoritative prices: checkout totals are rebuilt from MongoDB products.
- Razorpay signatures, captured status, amount, currency and order reference are checked before an order becomes `paid`.
- Checkout collects a delivery contact and address, validates them on the server, and saves a snapshot with each order.
- Payment and delivery statuses are shown separately, so a paid order can still have a pending delivery.
- Cash on Delivery orders clearly show `due on delivery` instead of appearing as a failed payment.

## Local setup

Requirements: Node.js 18+ and npm.

1. Configure the backend:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

   Set `MONGO_URI`, a long `JWT_SECRET`, `CORS_ORIGIN`, and optional Razorpay keys in `backend/.env`. Never commit that file.

2. Start the API:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. Start the storefront in a second terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. The Vite development proxy forwards `/api` calls to `http://localhost:5000`.

## Database and catalog

The first `GET /api/products` request safely upserts the curated GreenBasket catalog. To refresh the catalog explicitly, send the private `CATALOG_ADMIN_KEY` as `x-admin-key`:

```text
POST /api/products/seed
x-admin-key: your-private-catalog-admin-key
```

The seeded database should contain 240 products, 16 categories, `brand: GreenBasket`, `source: greenbasket-original`, and no external photo URLs.

The storefront shows 12 products per page (20 pages for the full catalog), with numbered controls. Category, search and page are encoded in the URL, so refresh and back navigation retain the selection. Changing a filter resets the page.

All 240 seed products have a distinct AI-generated illustrative image, mapped by `externalId` (and by name for older cart/order snapshots). Optimized local image atlases and generation prompts are under `frontend/src/assets/products/`. Supplied product image URLs still take priority. These illustrations are not photographs of actual stock or packaging.

## Payments

- COD works without gateway credentials.
- Both checkout methods require a valid sign-in session. Expired/invalid sessions now clear stale login data and send the customer to sign in, returning to checkout afterward. Keep `JWT_SECRET` stable across server restarts/deployments; changing it invalidates old sessions. Cart data and per-account checkout drafts survive re-login. Completed Razorpay callbacks are retained for confirmation retry, without charging again.
- Online payment is enabled only when `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are present.
- After Razorpay returns a payment, `POST /api/orders/:razorpayOrderId/verify` validates the HMAC signature and fetches the payment from Razorpay. Only an exactly matching, captured payment changes `paymentStatus` to `paid`; an authorized payment stays pending.
- Configure automatic capture in the Razorpay Dashboard. The checkout can retry confirmation without starting another payment. Your orders also has a status check which recovers a captured payment even if the checkout tab was closed.
- Configure `https://YOUR-BACKEND/api/orders/webhook` in Razorpay for `payment.captured` and `order.paid`, using a separate secret saved as `RAZORPAY_WEBHOOK_SECRET` on the backend. The endpoint verifies the exact raw request body; repeated events are safe. Without this configuration, automatic background confirmation is unavailable, but manual status checks still work.
- Keep Razorpay secrets only in `backend/.env`; the frontend receives only the public key ID.

Payment behavior follows [Razorpay's Standard Checkout documentation](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).

## Verification

```powershell
cd frontend
npm test
npm run lint
npm run build

cd ../backend
npm test
npm run test:smoke
```

Unit and isolated HTTP tests cover address/cart validation, server prices, stock limits, captured versus authorized payments, ownership checks, webhook tampering, duplicate events and payment recovery. Start the local backend before running the database smoke test; it checks the catalog, signup/signin, profile, COD address persistence, images and order history. Its uniquely named test accounts/orders are removed afterward.

Alternatively, `cd backend` then `npm run test:local` starts an isolated API port, runs the Mongo-backed smoke suite and closes the server automatically. This uses the database configured in `backend/.env`.

To also validate configured Razorpay test credentials by creating a test-mode gateway order (no payment is captured), run:

```powershell
cd backend
$env:SMOKE_RAZORPAY='1'
npm run test:smoke
```

## Vercel deployment

See [STATUS.md](STATUS.md) for the latest verification results and remaining release steps.

Deploy `backend` and `frontend` as two Vercel projects.

1. In the backend project, set the Root Directory to `backend` and add `MONGO_URI`, `JWT_SECRET`, `CATALOG_ADMIN_KEY`, `CORS_ORIGIN`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` as environment variables. Deploy it first and verify `https://YOUR-BACKEND/api/health`.
2. In the frontend project, set the Root Directory to `frontend` and add `VITE_BACKEND_URL=https://YOUR-BACKEND` without a trailing `/api`. The included `vercel.json` keeps React Router pages working on refresh.
3. Set the backend `CORS_ORIGIN` to the final frontend URL (and any explicit preview URL you want to allow), then redeploy the backend.

Keep Razorpay test keys while validating checkout. Complete a test payment in the actual browser and confirm the stored order becomes paid. Replace both Razorpay environment variables together with live-mode keys only when the Razorpay account is production-ready, then redeploy the backend and configure the live-mode webhook separately. Never put secrets in `VITE_*` variables.

For the existing projects, the frontend URL is `https://grocery-store-kappa-seven.vercel.app` and its backend URL is `https://grocery-store-fu3o.vercel.app`. Set `VITE_BACKEND_URL` to that backend origin. Local `.env` changes are not automatically uploaded to Vercel; configure the backend project environment there and redeploy.
