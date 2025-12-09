import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';
import { restaurantAPI, foodAPI, orderAPI, couponAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await orderAPI.getStats();
        setStats(res.data.stats);
      } else if (activeTab === 'restaurants') {
        const res = await restaurantAPI.getAll();
        setRestaurants(res.data.restaurants);
      } else if (activeTab === 'food') {
        const res = await foodAPI.getAll();
        setFoodItems(res.data.foodItems);
      } else if (activeTab === 'orders') {
        const res = await orderAPI.getAll();
        setOrders(res.data.orders);
      } else if (activeTab === 'coupons') {
        const res = await couponAPI.getAll();
        setCoupons(res.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button className={activeTab === 'restaurants' ? 'active' : ''} onClick={() => setActiveTab('restaurants')}>
            Restaurants
          </button>
          <button className={activeTab === 'food' ? 'active' : ''} onClick={() => setActiveTab('food')}>
            Food Items
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            Orders
          </button>
          <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}>
            Coupons
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <FiPackage />
                <div>
                  <h3>{stats?.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <FiDollarSign />
                <div>
                  <h3>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <FiPackage />
                <div>
                  <h3>{stats?.pendingOrders || 0}</h3>
                  <p>Pending Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <FiPackage />
                <div>
                  <h3>{stats?.deliveredOrders || 0}</h3>
                  <p>Delivered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Restaurants</h1>
              <button className="btn-primary" onClick={() => openModal('restaurant')}>
                <FiPlus /> Add Restaurant
              </button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(r => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.address?.city}</td>
                      <td>{r.rating?.toFixed(1)}</td>
                      <td>
                        <span className={`status ${r.isActive ? 'active' : 'inactive'}`}>
                          {r.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => openModal('restaurant', r)}><FiEdit2 /></button>
                        <button onClick={async () => {
                          await restaurantAPI.toggleStatus(r._id);
                          fetchData();
                        }}>
                          {r.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Food Items</h1>
              <button className="btn-primary" onClick={() => openModal('food')}>
                <FiPlus /> Add Food Item
              </button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Restaurant</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodItems.map(f => (
                    <tr key={f._id}>
                      <td>{f.name}</td>
                      <td>{f.restaurant?.name}</td>
                      <td>${f.price?.toFixed(2)}</td>
                      <td>{f.category}</td>
                      <td>
                        <span className={`status ${f.isAvailable ? 'active' : 'inactive'}`}>
                          {f.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => openModal('food', f)}><FiEdit2 /></button>
                        <button onClick={async () => {
                          await foodAPI.toggleAvailability(f._id);
                          fetchData();
                        }}>
                          {f.isAvailable ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Orders</h1>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>{o.user?.name}</td>
                      <td>{o.restaurant?.name}</td>
                      <td>${o.total?.toFixed(2)}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <span className="order-date">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Coupons</h1>
              <button className="btn-primary" onClick={() => openModal('coupon')}>
                <FiPlus /> Add Coupon
              </button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Valid Until</th>
                    <th>Used</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c._id}>
                      <td>{c.code}</td>
                      <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                      <td>{new Date(c.validUntil).toLocaleDateString()}</td>
                      <td>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
                      <td>
                        <span className={`status ${c.isActive ? 'active' : 'inactive'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AdminModal
          type={modalType}
          item={editItem}
          restaurants={restaurants}
          onClose={closeModal}
          onSave={() => { closeModal(); fetchData(); }}
        />
      )}
    </div>
  );
}

function AdminModal({ type, item, restaurants, onClose, onSave }) {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'restaurant') {
        if (item) {
          await restaurantAPI.update(item._id, formData);
        } else {
          await restaurantAPI.create(formData);
        }
      } else if (type === 'food') {
        if (item) {
          await foodAPI.update(item._id, formData);
        } else {
          await foodAPI.create(formData);
        }
      } else if (type === 'coupon') {
        if (item) {
          await couponAPI.update(item._id, formData);
        } else {
          await couponAPI.create(formData);
        }
      }
      toast.success(`${type} saved successfully`);
      onSave();
    } catch (error) {
      toast.error(`Failed to save ${type}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{item ? 'Edit' : 'Add'} {type}</h2>
        <form onSubmit={handleSubmit}>
          {type === 'restaurant' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={formData.address?.city || ''} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Cuisine (comma-separated)</label>
                <input type="text" value={formData.cuisine?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value.split(',').map(c => c.trim()) })} />
              </div>
              <div className="form-group">
                <label>Delivery Time</label>
                <input type="text" value={formData.deliveryTime || ''} onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Min Order Amount</label>
                <input type="number" value={formData.minOrderAmount || 0} onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Delivery Fee</label>
                <input type="number" value={formData.deliveryFee || 0} onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })} />
              </div>
            </>
          )}

          {type === 'food' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Restaurant</label>
                <select value={formData.restaurant || ''} onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })} required>
                  <option value="">Select Restaurant</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  <option value="starters">Starters</option>
                  <option value="main-course">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                  <option value="sides">Sides</option>
                  <option value="combos">Combos</option>
                </select>
              </div>
              <div className="form-group">
                <label>Food Type</label>
                <select value={formData.foodType || ''} onChange={(e) => setFormData({ ...formData, foodType: e.target.value })} required>
                  <option value="">Select Type</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="egg">Egg</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </>
          )}

          {type === 'coupon' && (
            <>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Discount Type</label>
                <select value={formData.discountType || ''} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} required>
                  <option value="">Select Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value</label>
                <input type="number" value={formData.discountValue || ''} onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Min Order Amount</label>
                <input type="number" value={formData.minOrderAmount || 0} onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Valid Until</label>
                <input type="date" value={formData.validUntil?.split('T')[0] || ''} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Usage Limit</label>
                <input type="number" value={formData.usageLimit || ''} onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })} />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
