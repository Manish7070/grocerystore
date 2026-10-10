# 🥬 TaazaDaily — Smart Farm-to-Fork Grocery Platform

**TaazaDaily** is an advanced, production-grade MERN grocery commerce platform engineered with a **zero-dummy data** policy, live **MongoDB Atlas** integration, and unique industry-first features that set it apart from ordinary grocery clones.

---

## 🌟 What Makes TaazaDaily Different? ("Isme Kya Naya Hai?")

If someone asks: *"Why is this different from standard grocery websites like Blinkit, Zepto, or generic clones?"*, here are the five core innovations built into TaazaDaily:

### 1. 📉 Freshness & Food Waste Reduction Radar (`/waste-center`)
- **FEFO (First-Expired, First-Out) Inventory Engine:** Tracks individual warehouse batches with harvest dates, intake timestamps, and exact expiry countdowns.
- **Dynamic Automated Markdowns:** Inventory managers can apply 10%–50% flash markdowns on near-expiry batches to rescue fresh produce from going to waste.
- **Zero-Waste Audit Ledger:** Built-in write-off logging (`WasteLog`) with reason tracking (spoilage, damaged packaging, quality failure) calculating exact financial waste prevention metrics.

### 2. 🍲 1-Click Recipe Cook Kits (`/bundles`)
- Rather than searching for 8 individual ingredients to cook a dish, customers can click once to add proportional, authentic recipe kits directly to their cart:
  - **Authentic Palak Paneer Kit** (Spinach, Fresh Paneer, Desi Ghee, Ginger-Garlic paste, Spices).
  - **Hyderabadi Dum Biryani Kit** (Basmati Rice, Whole Spices, Ghee, Mint & Saffron).
  - **Morning Energy Green Smoothie Kit** (Bananas, Spinach, Chia Seeds, Almond Milk).
- Includes step-by-step chef instructions, cook time, and serving sizes.

### 3. 🚜 Farm Provenance & Real-Time Freshness Score
- Every farm item features an **Origin Provenance Card** (e.g. *Nashik Valley Farm*, *Himachal Orchards*).
- **Harvest-to-Door Transparency:** Shows exact harvest date and a calculated **Freshness Score (e.g., 98% Grade A+)**.
- Built-in **PIN Code Delivery Serviceability Checker** and recommended storage instructions on every product detail page.

### 4. 🔐 Doorstep Security OTP Handover
- Every placed order automatically generates a unique 4-digit **Delivery Verification PIN (OTP)** displayed only in the customer's secure tracking screen (`/track/TD-2026-XXXX`).
- Delivery partners cannot mark an order as "Delivered" in the Delivery Terminal (`/delivery`) without entering and verifying this customer OTP, eliminating false delivery claims.

### 5. 👥 Multi-Role Ecosystem & Live Dashboards
- **Customer Storefront:** Full catalog search, category filters, price range sliders, organic badges, customer reviews, dynamic ₹499 free delivery progress bar, and slot selector.
- **Store Administrator Hub (`/admin`):** Real-time MongoDB metrics (total revenue, active orders, low-stock alerts, customer database, and status pipeline).
- **Freshness Inventory Manager (`/waste-center`):** Batch queue, expiry radar, markdown triggers, and spoilage ledger.
- **Delivery Partner Terminal (`/delivery`):** Dispatched orders queue, customer address cards, navigation links, and OTP verification prompt.

---

## 🎨 Unique Brand Identity

- **Brand:** **TaazaDaily** *(The Fresh Standard)*
- **Logo Lockup:** Custom SVG emblem uniting an organic produce basket, a budding green sprout, and a golden harvest droplet.
- **Visual Design:** Premium, responsive UI with dark/light mode toggle, micro-interactions, smooth toasts, and zero placeholder assets.

---

## 🛠️ Tech Stack & Database Architecture

- **Frontend:** React 18, Vite, React Router DOM, Lucide Icons, Vanilla CSS design tokens.
- **Backend:** Node.js, Express.js (REST API architecture with modular routers).
- **Database:** **MongoDB Atlas (Live Cloud Cluster)** using Mongoose ODM.
- **Authentication:** Stateless JWT with `Bearer` authorization and role-based permissions (`customer`, `admin`, `inventory_manager`, `delivery`).
- **Payment Verification:** Razorpay HMAC-SHA256 signature verification + Cash on Delivery (COD) with server-side price recalculation.

### MongoDB Schemas:
1. `User`: Role-based profiles, saved addresses, wishlist, order history.
2. `Product`: 240 catalog items, MRP, selling price, farm provenance, harvest date, freshness score, storage tips.
3. `Order`: Unique `orderNumber` (`TD-2026-XXXX`), delivery slot, 4-digit OTP, coupon discount, live status timeline.
4. `InventoryBatch`: Batch tracking, harvest dates, expiry dates, markdown rates, stock quantities.
5. `Coupon`: Live discount coupon engine (`TAAZA20`, `WELCOME50`, `SAVER100`).
6. `WasteLog`: Waste mitigation ledger recording write-offs, reasons, and prevented losses.
7. `Review`: Verified buyer ratings and customer feedback.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm installed.
- Internet connection (for live MongoDB Atlas connection).

### 1. Backend Setup
```powershell
cd backend
npm install
npm run dev
```
> The API server will start on `http://localhost:5000` and automatically connect to the live MongoDB Atlas cluster.

### 2. Frontend Setup
Open a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
> The storefront will run on `http://localhost:5173` with automatic API proxying.

---

## 🧪 Verification & Testing

Run all unit tests and live MongoDB smoke tests:

```powershell
# 1. Backend Unit Tests (21 automated tests)
cd backend
npm test

# 2. Live MongoDB Atlas Integration Smoke Test
npm run test:local

# 3. Frontend Production Build
cd ../frontend
npm run build
```

---

## 📋 Key Routes & Exploration Guide

| Route | Role / Purpose | Key Highlights |
|---|---|---|
| `/` | Customer Home | Hero banner, categories, recipe kits showcase, waste reduction banner |
| `/shop` | Customer Catalog | Live search, price slider, in-stock & organic filters, pagination |
| `/bundles` | 1-Click Cook Kits | Palak Paneer, Dum Biryani, Smoothie with 1-click bundle add |
| `/product/:id` | Product Details | Farm source, Freshness score, PIN checker, customer reviews |
| `/cart` | Shopping Cart | ₹499 Free Delivery progress bar, instant quantity updates |
| `/checkout` | Checkout | Delivery slot picker, Promo code (`WELCOME50`), COD / Razorpay |
| `/track` | Live Tracking | Enter `TD-2026-XXXX` to see the 5-step timeline and secure OTP |
| `/waste-center` | Inventory Manager | Batch expiry radar, markdown triggers, food waste reduction log |
| `/admin` | Store Admin | Live revenue metrics, low-stock warnings, order advancement |
| `/delivery` | Delivery Partner | Assigned deliveries, customer address cards, OTP verification |

---

## 👥 Demo Test Coupons
- `WELCOME50` — ₹50 off on orders above ₹299
- `TAAZA20` — 20% discount up to ₹150 on orders above ₹499
- `SAVER100` — ₹100 flat discount on orders above ₹999

---

© 2026 **TaazaDaily** — Engineered for Excellence. Zero Dummy Elements.
