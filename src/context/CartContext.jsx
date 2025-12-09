import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (foodItemId, quantity = 1, customizations = []) => {
    try {
      const res = await axios.post('/api/cart', { foodItemId, quantity, customizations });
      setCart(res.data.cart);
      toast.success('Added to cart!');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(itemId);
      }
      const res = await axios.put(`/api/cart/items/${itemId}`, { quantity });
      setCart(res.data.cart);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/items/${itemId}`);
      setCart(res.data.cart);
      toast.success('Item removed from cart');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCart({ items: [], subtotal: 0, total: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await axios.post('/api/cart/apply-coupon', { code });
      setCart(res.data.cart);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await axios.delete('/api/cart/remove-coupon');
      setCart(res.data.cart);
      toast.success('Coupon removed');
      return res.data;
    } catch (error) {
      toast.error('Failed to remove coupon');
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
