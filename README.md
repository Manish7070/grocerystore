# GreenBasket – Online Grocery Store

A responsive MERN grocery storefront with an original GreenBasket identity, 240-item catalog, persistent light/dark mode, JWT authentication, watchlist, cart, delivery profile, Cash on Delivery, Razorpay verification, and order history.

## Highlights

- Original GreenBasket logo and code-generated category artwork; the UI does not depend on third-party product photos.
- 240 GreenBasket products across 16 categories, stored in MongoDB Atlas.
- Mobile-first layouts for phones, tablets, laptops, and wide screens.
- Light/dark theme switch with saved preference and system-theme fallback.
- Server-authoritative prices: checkout totals are rebuilt from MongoDB products.
- Razorpay signatures are verified on the server before an order becomes `paid`.
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

## Payments

- COD works without gateway credentials.
- Online payment is enabled only when `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are present.
- After Razorpay returns a payment, `POST /api/orders/:razorpayOrderId/verify` validates the HMAC signature and changes `paymentStatus` from `pending` to `paid`.
- Keep Razorpay secrets only in `backend/.env`; the frontend receives only the public key ID.

## Verification

```powershell
cd frontend
npm run lint
npm run build

cd ../backend
npm run test:smoke
```

The smoke test checks products, all categories, signup, signin, authenticated profile access, COD creation, stored order artwork metadata, and order history. Test accounts/orders are removed afterward.

To also validate configured Razorpay test credentials by creating a test-mode gateway order (no payment is captured), run:

```powershell
cd backend
$env:SMOKE_RAZORPAY='1'
npm run test:smoke
```

## Vercel deployment

Deploy `backend` and `frontend` as two Vercel projects.

1. In the backend project, set the Root Directory to `backend` and add `MONGO_URI`, `JWT_SECRET`, `CATALOG_ADMIN_KEY`, `CORS_ORIGIN`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` as environment variables. Deploy it first and verify `https://YOUR-BACKEND/api/health`.
2. In the frontend project, set the Root Directory to `frontend` and add `VITE_BACKEND_URL=https://YOUR-BACKEND` without a trailing `/api`. The included `vercel.json` keeps React Router pages working on refresh.
3. Set the backend `CORS_ORIGIN` to the final frontend URL (and any explicit preview URL you want to allow), then redeploy the backend.

Keep Razorpay test keys while validating checkout. Replace both Razorpay environment variables together with live-mode keys only when the Razorpay account is production-ready, then redeploy the backend.
