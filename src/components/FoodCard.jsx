import { FiPlus, FiMinus, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodCard({ food }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, cart, updateQuantity } = useCart();

  const cartItem = cart?.items?.find(item => item.foodItem?._id === food._id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(food._id, 1);
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (cartItem) {
      await updateQuantity(cartItem._id, newQuantity);
    }
  };

  return (
    <div className="food-card">
      <div className="food-image">
        <img 
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'} 
          alt={food.name} 
        />
        <span className={`food-type ${food.foodType}`}>
          {food.foodType === 'veg' ? '🟢' : food.foodType === 'non-veg' ? '🔴' : '🟡'}
        </span>
        {!food.isAvailable && <span className="unavailable-badge">Out of Stock</span>}
      </div>
      <div className="food-info">
        <h4>{food.name}</h4>
        <p className="food-description">{food.description}</p>
        <div className="food-meta">
          {food.rating > 0 && (
            <span className="rating"><FiStar /> {food.rating.toFixed(1)}</span>
          )}
          <span className="prep-time">{food.preparationTime}</span>
        </div>
        <div className="food-footer">
          <span className="price">${food.price.toFixed(2)}</span>
          {food.isAvailable && (
            cartItem ? (
              <div className="quantity-controls">
                <button onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}>
                  <FiMinus />
                </button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}>
                  <FiPlus />
                </button>
              </div>
            ) : (
              <button className="add-btn" onClick={handleAddToCart}>
                <FiPlus /> Add
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
