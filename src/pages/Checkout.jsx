import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.find(a => a.isDefault)?._id || user?.addresses?.[0]?._id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    const address = user.addresses.find(a => a._id === selectedAddress);
    if (!address) {
      toast.error('Invalid address selected');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        deliveryAddress: {
          label: address.label,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode
        },
        paymentMethod,
        specialInstructions
      };

      const res = await orderAPI.create(orderData);
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-sections">
          <div className="checkout-section">
            <h2><FiMapPin /> Delivery Address</h2>
            {user?.addresses?.length > 0 ? (
              <div className="address-options">
                {user.addresses.map(address => (
                  <label key={address._id} className={`address-option ${selectedAddress === address._id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      checked={selectedAddress === address._id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    />
                    <div className="address-content">
                      <strong>{address.label}</strong>
                      <p>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="no-address">
                <p>No addresses found. Please add one in your profile.</p>
                <button onClick={() => navigate('/profile')}>Add Address</button>
              </div>
            )}
          </div>

          <div className="checkout-section">
            <h2><FiCreditCard /> Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <FiDollarSign />
                <span>Cash on Delivery</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <FiCreditCard />
                <span>Online Payment</span>
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Special Instructions</h2>
            <textarea
              placeholder="Any special requests for your order..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        <div className="order-summary-checkout">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.items.map(item => (
              <div key={item._id} className="summary-item">
                <span>{item.quantity}x {item.foodItem?.name}</span>
                <span>${item.itemTotal?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
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
          </div>
          <button 
            className="place-order-btn" 
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
