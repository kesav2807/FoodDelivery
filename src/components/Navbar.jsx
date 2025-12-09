import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🍔</span>
          <span>FoodDelivery</span>
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/restaurants" className="nav-link" onClick={() => setIsOpen(false)}>Restaurants</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link" onClick={() => setIsOpen(false)}>My Orders</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>Admin</Link>
              )}
              <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
                <FiUser /> {user?.name}
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated && (
            <Link to="/cart" className="cart-icon">
              <FiShoppingCart />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
