# 🛍️ Multivendor Shop Frontend

This is the frontend for the **Multivendor E-commerce Platform** built with **Vite**, **React**, and **Tailwind CSS v4** (with **DaisyUI v5**). It supports three user roles: **Customer**, **Vendor**, and **Admin** — with dedicated layouts and navigation for each.

---

## 🚀 Features

### 🧑‍💻 Customer Features
- Browse products by category, search, or filters
- Add items to cart (stored in localStorage/context)
- Checkout with **Stripe**
- View order history and statuses
- Leave/edit/delete product reviews

### 👨‍🍳 Vendor Dashboard
- Role-based access to manage products
- Upload product images to **Cloudinary**
- View vendor orders
- Track earnings and analytics

### 🧑‍💼 Admin Panel
- Approve/reject vendors
- Moderate products and reviews
- View all orders, users, and platform stats

---

## 🧰 Tech Stack

| Tool / Library      | Purpose                              |
|---------------------|---------------------------------------|
| **Vite**            | Fast React bundler                   |
| **React**           | UI library                          |
| **React Router**    | Client-side routing                  |
| **Tailwind CSS v4** | Utility-first CSS framework          |
| **DaisyUI v5**      | Pre-styled components for Tailwind   |
| **axios**           | API communication                    |
| **Stripe.js**       | Stripe Checkout integration          |
| **Cloudinary**      | Image hosting                        |

---

## 🔐 Authentication

- JWT-based login/register system
- Token stored in localStorage
- Protected routes by role:
  - `/vendor/*` – Vendor only
  - `/admin/*` – Admin only
  - `/checkout`, `/orders` – Customer only

---

## 🌗 Dark Mode Support

- Fully responsive and dark mode compatible using **Tailwind** + **DaisyUI**
- Toggle handled automatically based on OS preference or DaisyUI `data-theme`

---

## 📦 Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
---

## 🔌 Environment Variables

Create a `.env` file in the root of your frontend project and include:

VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key


---

## 🧪 Testing Payments Locally

Make sure Stripe webhook forwarding is set up correctly to handle payment confirmation:

```bash
stripe listen --forward-to localhost:5000/webhook
