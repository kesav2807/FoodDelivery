# 🍽️ Food Delivery System

**Live Demo:** [https://fooddelivery-45c1.onrender.com](https://fooddelivery-45c1.onrender.com)

A full-stack Food Delivery application with **User, Admin, and Delivery Partner modules**, built with **React.js, Node.js, Express, MongoDB, and JWT authentication**. The system includes restaurant management, menu management, cart and order management, payment processing, reviews & ratings, coupons, notifications, and analytics dashboard.

---

## 🚀 Features

### 1. Authentication & User Management (JWT)
**User Functions:**
- User Registration (Sign Up)
- User Login (JWT Token)
- Logout
- Forgot / Reset Password
- Refresh Token
- Email / Phone Verification (OTP – optional)
- Update Profile & Change Password
- Save Multiple Addresses

**Admin Functions:**
- Admin Login & Logout
- Admin Dashboard
- Admin Profile Management

---

### 2. Restaurant / Shop Management
**Admin:**
- Add, Edit, Delete Restaurants
- Activate / Deactivate Restaurants
- Upload Restaurant Images
- Add Restaurant Categories (Veg/Non-Veg/etc)
- Set Delivery Time & Ratings

**User:**
- View All Restaurants
- View Single Restaurant Details
- Search by Name or Location
- Filter Restaurants (Ratings, Price, Distance)

---

### 3. Menu / Food Item Management
**Admin:**
- Add, Edit, Delete Food Items
- Upload Food Images
- Set Price & Category
- Add Food Type (Veg/Non-Veg/Egg)
- Set Availability (In Stock / Out of Stock)

**User:**
- View Menu Items
- Filter Food by Category
- Search Food Items
- View Food Details

---

### 4. Cart Management
- Add Item to Cart
- Increase / Decrease Quantity
- Remove Item from Cart
- View Cart Total
- Apply Coupons
- Clear Cart

---

### 5. Order Management
**User:**
- Place Order
- Choose Delivery Address & Payment Method (COD / Online)
- View Order History
- Track Order Status

**Admin:**
- View All Orders
- Update Order Status (Pending → Preparing → Out for Delivery → Delivered → Cancelled)

---

### 6. Payment System
- Cash on Delivery (COD)
- Online Payments (Razorpay / Stripe)
- Payment Success / Failure Handling
- Save Payment History
- Generate Invoice

---

### 7. Delivery Partner Module
- Delivery Partner Login
- View Assigned Orders
- Update Order Status
- Mark Order Delivered
- View Earnings

---

### 8. Ratings & Reviews
**User:**
- Rate Restaurants & Food Items
- Write, Edit, Delete Reviews

**Admin:**
- View Reviews
- Delete Fake / Spam Reviews

---

### 9. Offers & Coupons
**Admin:**
- Create & Manage Coupons
- Set Discount & Expiry
- Enable / Disable Coupons

**User:**
- View Available Offers
- Apply Coupons in Cart

---

### 10. Notifications
- Push Notifications (Order Updates)
- Email Notifications
- SMS Notifications (Optional)

---

### 11. Admin Dashboard & Analytics
- Total Users Count
- Total Orders
- Total Revenue
- Top Selling Items
- Restaurant Performance Analytics

---

### 12. Search & Filter System
- Global Search (Food, Restaurant)
- Filters by Price, Rating, Delivery Time, Veg/Non-Veg

---

### 13. Technical Features (Backend)
- REST APIs (CRUD)
- JWT Middleware
- Role-Based Access Control (User/Admin/Delivery)
- Error Handling Middleware
- Input Validation
- File Upload (Multer / Cloudinary)
- MongoDB Aggregation Pipelines

---

### 14. Extra Advanced Features (Optional)
- Real-time Order Tracking (Socket.io)
- Live Chat with Delivery Partner
- AI-based Food Recommendation
- Dark / Light Theme
- Multi-language Support

---

## 🧩 Tech Stack

**Frontend:**
- React.js
- Redux / Context API
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB + Mongoose

**Security:**
- JWT Authentication
- Bcrypt Password Hashing

---
## PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

## ⚡ Installation

```bash
# Clone repository
git clone https://github.com/yourusername/food-delivery.git
cd food-delivery

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Run Backend
npm run server

# Run Frontend
npm start
