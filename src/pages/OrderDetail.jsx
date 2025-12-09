import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiBox } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const statusSteps = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOne(id);
      setOrder(res.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancel(id, 'Customer requested cancellation');
      toast.success('Order cancelled');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className="not-found">Order not found</div>;

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p className="order-date">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        {['pending', 'confirmed'].includes(order.status) && (
          <button className="cancel-btn" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        )}
      </div>

      {!isCancelled ? (
        <div className="order-progress">
          <h3>Order Status</h3>
          <div className="progress-steps">
            {statusSteps.map((step, index) => (
              <div 
                key={step} 
                className={`progress-step ${index <= currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'current' : ''}`}
              >
                <div className="step-icon">
                  {index < currentStepIndex ? <FiCheckCircle /> : 
                   step === 'pending' ? <FiClock /> :
                   step === 'confirmed' ? <FiCheckCircle /> :
                   step === 'preparing' ? <FiBox /> :
                   step === 'out-for-delivery' ? <FiTruck /> :
                   <FiCheckCircle />}
                </div>
                <span className="step-label">{step.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="order-cancelled">
          <FiXCircle />
          <span>Order Cancelled</span>
        </div>
      )}

      <div className="order-detail-content">
        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="order-items-list">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-qty">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.itemTotal?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="total-row discount">
                <span>Discount</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee?.toFixed(2)}</span>
            </div>
            <div className="total-row final">
              <span>Total</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="order-info-section">
          <div className="info-card">
            <h4>Delivery Address</h4>
            <p><FiMapPin /> {order.deliveryAddress?.label}</p>
            <p>{order.deliveryAddress?.street}</p>
            <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}</p>
          </div>

          <div className="info-card">
            <h4>Restaurant</h4>
            <p>{order.restaurant?.name}</p>
            {order.restaurant?.phone && <p><FiPhone /> {order.restaurant.phone}</p>}
          </div>

          <div className="info-card">
            <h4>Payment</h4>
            <p>Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p>Status: {order.paymentStatus}</p>
          </div>

          {order.deliveryPartner && (
            <div className="info-card">
              <h4>Delivery Partner</h4>
              <p>{order.deliveryPartner.name}</p>
              <p><FiPhone /> {order.deliveryPartner.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
