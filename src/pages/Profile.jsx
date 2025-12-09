import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/addresses', addressForm);
      setAddresses(res.data.addresses);
      setShowAddAddress(false);
      setAddressForm({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
      toast.success('Address added!');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await axios.delete(`/api/auth/addresses/${addressId}`);
      setAddresses(res.data.addresses);
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-sections">
        <div className="profile-section">
          <div className="section-header">
            <h2><FiUser /> Personal Information</h2>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FiEdit2 /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <p><FiUser /> <strong>Name:</strong> {user?.name}</p>
              <p><FiMail /> <strong>Email:</strong> {user?.email}</p>
              <p><FiPhone /> <strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
            </div>
          )}
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2><FiMapPin /> Saved Addresses</h2>
            <button className="add-btn" onClick={() => setShowAddAddress(true)}>
              <FiPlus /> Add Address
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Label</label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    Set as default
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Add Address</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddAddress(false)}>Cancel</button>
              </div>
            </form>
          )}

          {addresses.length > 0 ? (
            <div className="addresses-list">
              {addresses.map(address => (
                <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  <div className="address-content">
                    <strong>{address.label} {address.isDefault && <span className="default-badge">Default</span>}</strong>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteAddress(address._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-addresses">No addresses saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
