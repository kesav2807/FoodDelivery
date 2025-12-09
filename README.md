# 🍽️ Food Delivery System

**Live Demo:** [https://fooddelivery-45c1.onrender.com](https://fooddelivery-45c1.onrender.com)
**backend:** [https://fooddelivery-1-nxvg.onrender.com](https://fooddelivery-1-nxvg.onrender.com).

A full-stack Food Delivery application with **User, Admin, and Delivery Partner modules**, built with **React.js, Node.js, Express, MongoDB, and JWT authentication**. The system includes restaurant management, menu management, cart and order management, payment processing, reviews & ratings, coupons, notifications, and analytics dashboard.
---
## Frontend Img
### Home
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/197c40ed-a295-4d9b-8aef-687d78f6c056" />
### Restaurants
<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/733dce5c-11e1-4345-9b30-22e101ce2a74" />
### Login
<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/befff80b-3210-4cf4-938f-5c99b1cdbce3" />
### Sign Up
<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/d4f07994-3ef4-4e1e-bbdc-cab1719872ac" />
### Admin Login Home
<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/9b5417a7-500e-46ca-9bdb-62e17533db21" />
### Admin Dashboard
<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/839492b2-ed50-4cc1-96ef-13dc4b696979" />
### Restaurants
<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/fda3b2b6-38e0-496a-8396-ba82a020f51c" />
### New Restaurants add
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/12f6ed59-bb90-4cd2-85b2-21daea77edc5" />
### Orders
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f61d93ba-c0f7-4798-b474-56dbb9ddeb07" />
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/8955790f-d42a-45ee-8c1d-19552277e89a" />
<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/c90eaabc-1eda-4255-8a49-46cd257ccc83" />
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/89e64bf5-4512-4812-b3ce-5130a76a4969" />
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/a3c45931-9196-4f4e-bb06-d376c4b9694a" />
### use Profile
<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/6c6a4987-73cd-4308-a144-9f7b0910fe58" />
### User and Admin Roll change in Backend database change to the role 
<img width="1552" height="857" alt="image" src="https://github.com/user-attachments/assets/b5cd8fe9-8811-40d5-868f-d618768458eb" />

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
## .env
- PORT=5000
- MONGODB_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- JWT_REFRESH_SECRET=your_refresh_secret

## ⚡ Installation

```bash
# Clone repository
git clone [https://github.com/yourusername/food-delivery.git](https://github.com/kesav2807/FoodDelivery.git)
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
