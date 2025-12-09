import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import Loading from '../components/Loading';

const statusIcons = {
  pending: <FiClock />,
  confirmed: <FiCheckCircle />,
  preparing: <FiClock />,
  'out-for-delivery': <FiTruck />,
  delivered: <FiCheckCircle />,
  cancelled: <FiXCircle />
};

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  'out-for-delivery': '#10b981',
  delivered: '#22c55e',
  cancelled: '#ef4444'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/order/${order._id}`} key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-number">#{order.orderNumber}</span>
                <span 
                  className="order-status"
                  style={{ backgroundColor: statusColors[order.status] }}
                >
                  {statusIcons[order.status]} {order.status.replace('-', ' ')}
                </span>
              </div>
              <div className="order-details">
                <p className="restaurant-name">{order.restaurant?.name}</p>
                <p className="order-items">
                  {order.items?.length} item(s) - ${order.total?.toFixed(2)}
                </p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      )}
    </div>
  );
}
