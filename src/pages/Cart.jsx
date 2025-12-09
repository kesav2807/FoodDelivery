import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  if (loading) return <Loading />;

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some delicious food to get started!</p>
        <button className="btn-primary" onClick={() => navigate('/restaurants')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {}
  };

  const handleCheckout = () => {
    if (!user.addresses || user.addresses.length === 0) {
      toast.error('Please add a delivery address in your profile first');
      navigate('/profile');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.restaurant && (
            <div className="cart-restaurant">
              <p>Ordering from: <strong>{cart.restaurant.name}</strong></p>
            </div>
          )}

          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.foodItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} 
                  alt={item.foodItem?.name} 
                />
              </div>
              <div className="item-details">
                <h4>{item.foodItem?.name}</h4>
                <p className="item-price">${item.foodItem?.price?.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                  <FiMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                  <FiPlus />
                </button>
              </div>
              <div className="item-total">
                ${item.itemTotal?.toFixed(2)}
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="coupon-section">
            <div className="coupon-input">
              <FiTag />
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>
            {cart.couponApplied && (
              <div className="applied-coupon">
                <span>Coupon: {cart.couponApplied.code}</span>
                <button onClick={removeCoupon}>Remove</button>
              </div>
            )}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.subtotal?.toFixed(2)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-${cart.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${cart.deliveryFee?.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cart.total?.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
