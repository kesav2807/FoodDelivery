import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import foodRoutes from './routes/food.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import couponRoutes from './routes/coupons.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();
connectDB();

const app = express();

/* ✅ EJS setup */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ✅ Middlewares */
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* ✅ API Routes */
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);

/* ✅ EJS Health Route */
app.get('', (req, res) => {
  res.render('health', {
    status: 'ok',
    message: 'Food Delivery API is running',
    time: new Date().toLocaleString()
  });
});

/* ✅ Error Handler */
app.use(errorHandler);

/* ✅ Server Start */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
