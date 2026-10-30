# GroceryStore – Smart Grocery Shopping Platform

GroceryStore is a MERN stack-based grocery shopping platform designed to make online grocery shopping and inventory management easier. The application allows customers to browse products, purchase groceries, select delivery slots, and track their orders.

Along with the shopping experience, the platform also includes inventory management, batch-wise expiry tracking, recipe-based grocery bundles, and delivery verification. The main goal is to build a system that handles both customer-side shopping and the day-to-day operations of a grocery store.

## 1. Main Features

### 1.1 Inventory and Food Waste Management

The platform includes a separate section for managing grocery stock and reducing food waste.

- **Batch-wise inventory tracking:** Products can be managed in separate batches with harvest dates, stock quantities, and expiry dates.
- **FEFO inventory system:** The system follows First-Expired, First-Out to prioritize products that are closer to their expiry date.
- **Discount management:** Inventory managers can apply discounts of 10%–50% to products that need to be sold before expiry.
- **Waste records:** Damaged, spoiled, and expired products can be recorded with reasons and financial details.
- **Waste reports:** Store administrators can review inventory losses and the amount saved through markdowns.

### 1.2 Recipe-Based Grocery Bundles

Customers can purchase multiple ingredients together through ready-made recipe bundles instead of adding every item individually.

Available bundles include:

- **Palak Paneer Kit:** Spinach, paneer, ghee, ginger-garlic paste, and spices.
- **Hyderabadi Dum Biryani Kit:** Basmati rice, whole spices, ghee, mint, and saffron.
- **Green Smoothie Kit:** Banana, spinach, chia seeds, and almond milk.

Each bundle includes ingredient details, cooking instructions, preparation time, and serving information. Customers can add the complete bundle to their cart in one click.

### 1.3 Farm Details and Product Freshness

Product pages provide additional information about where the grocery items come from and how fresh they are.

- Farm and supplier information.
- Harvest date and product details.
- Freshness score based on available product data.
- Storage instructions for different grocery items.
- PIN code-based delivery availability checking.

This feature helps customers understand more about the products they are purchasing.

### 1.4 Order Tracking and Delivery Verification

The application includes an order tracking system with OTP-based delivery verification.

- Every order receives a unique order number, such as `TD-2026-XXXX`.
- Customers can view their order status and delivery progress.
- A four-digit delivery OTP is generated for order verification.
- Delivery partners must enter the correct OTP before completing an order.
- The system validates the OTP on the backend to prevent unauthorized delivery completion.

### 1.5 Role-Based Dashboards

The platform supports different user roles, with separate functionality for each.

**Customer**
- Browse and search grocery products.
- Filter products by category, price, and availability.
- Manage cart and wishlist.
- Apply discount coupons.
- Select delivery slots.
- Place orders and track deliveries.
- Submit product reviews.

**Administrator**
- View sales and order information.
- Manage customers and products.
- Monitor low-stock products.
- Update order statuses.
- Access store performance information.

**Inventory Manager**
- Manage product batches.
- Monitor expiry dates.
- Apply discounts to near-expiry stock.
- Record damaged and wasted inventory.
- Review waste management reports.

**Delivery Partner**
- View assigned deliveries.
- Access customer delivery addresses.
- Open navigation links.
- Verify delivery using the customer's OTP.

## 2. Project Design and User Interface

The application uses a clean and responsive design that works across desktop, tablet, and mobile devices.

Some of the UI features include:

- Custom GroceryStore logo and branding.
- Dark and light theme support.
- Responsive product cards and navigation.
- Product search and category filters.
- Interactive cart and checkout pages.
- Toast notifications for user actions.
- Smooth transitions and micro-interactions.
- Consistent styling across all dashboards.

**Brand Name:** GroceryStore  
**Tagline:** The Fresh Standard

## 3. Technology Stack

| Part | Technologies |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Routing | React Router DOM |
| Styling | Vanilla CSS, CSS Variables |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, bcrypt |
| Payments | Razorpay, Cash on Delivery |
| API | REST API |

### Authentication and Security

The application uses JWT-based authentication and role-based access control.

- Passwords are hashed using bcrypt.
- Protected API routes require valid authentication.
- Different roles have access to their respective operations.
- Payment signatures are verified on the backend using Razorpay HMAC-SHA256.
- Order totals are recalculated on the server to avoid trusting prices sent by the frontend.

## 4. Database Structure

The application uses MongoDB Atlas with Mongoose models.

The main collections include:

| Model | Purpose |
|---|---|
| User | User accounts, roles, addresses, and profile information |
| Product | Grocery details, pricing, farm information, and freshness data |
| Order | Order number, items, payment details, delivery slot, and status |
| InventoryBatch | Batch quantities, harvest dates, expiry dates, and discounts |
| Coupon | Coupon codes, discount values, and usage conditions |
| WasteLog | Records of damaged, spoiled, and expired inventory |
| Review | Customer ratings and product feedback |

The product catalog is designed to support around 240 grocery products.

## 5. Installation and Setup

### Requirements

- Node.js 18 or later
- npm
- MongoDB Atlas account
- Git

### Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend API runs at:

`http://localhost:5000`

Configure the MongoDB connection string and other required environment variables in the backend `.env` file.

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs at:

`http://localhost:5173`

Configure the API base URL or Vite proxy according to the backend setup.

## 6. Testing and Build

The project includes backend tests, database integration checks, and frontend production build verification.

Run backend tests:

```bash
cd backend
npm test
```

Run MongoDB integration tests:

```bash
npm run test:local
```

Create the frontend production build:

```bash
cd frontend
npm run build
```

## 7. Application Routes

| Route | Description |
|---|---|
| `/` | Customer homepage |
| `/shop` | Grocery product listing |
| `/bundles` | Recipe-based grocery bundles |
| `/product/:id` | Product details and farm information |
| `/cart` | Shopping cart |
| `/checkout` | Address, delivery slot, and payment |
| `/track` | Order tracking and delivery OTP |
| `/waste-center` | Inventory and expiry management |
| `/admin` | Administrator dashboard |
| `/delivery` | Delivery partner dashboard |

## 8. Available Coupons

| Coupon | Discount | Minimum Order |
|---|---|---|
| WELCOME50 | ₹50 off | ₹299 |
| TAAZA20 | 20% off, up to ₹150 | ₹499 |
| SAVER100 | ₹100 off | ₹999 |

## 9. Project Objective

The objective of GroceryStore is to develop more than a basic online grocery shopping website. It combines grocery ordering with inventory tracking, expiry management, recipe bundles, product sourcing information, and secure delivery verification.

The project focuses on practical problems faced by grocery stores, such as managing perishable stock, reducing product wastage, handling orders, and maintaining transparency between customers and store operations.

---

**GroceryStore – The Fresh Standard**  
A grocery shopping and management platform built using the MERN stack.
