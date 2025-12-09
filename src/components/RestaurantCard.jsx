import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-image">
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} 
          alt={restaurant.name} 
        />
        {!restaurant.isActive && <span className="closed-badge">Closed</span>}
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="cuisine">{restaurant.cuisine?.join(', ') || 'Multi-cuisine'}</p>
        <div className="restaurant-meta">
          <span className="rating">
            <FiStar /> {restaurant.rating?.toFixed(1) || '4.0'} ({restaurant.totalRatings || 0})
          </span>
          <span className="delivery-time">
            <FiClock /> {restaurant.deliveryTime || '30-45 mins'}
          </span>
        </div>
        <div className="restaurant-location">
          <FiMapPin /> {restaurant.address?.city || 'Location'}
        </div>
        {restaurant.minOrderAmount > 0 && (
          <p className="min-order">Min. order: ${restaurant.minOrderAmount}</p>
        )}
      </div>
    </Link>
  );
}
