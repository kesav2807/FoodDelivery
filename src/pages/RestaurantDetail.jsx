import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiPhone } from 'react-icons/fi';
import { restaurantAPI, foodAPI, reviewAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import Loading from '../components/Loading';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [restaurantRes, menuRes, reviewsRes] = await Promise.all([
        restaurantAPI.getOne(id),
        foodAPI.getMenu(id),
        reviewAPI.getAll({ restaurantId: id, targetType: 'restaurant' })
      ]);
      setRestaurant(restaurantRes.data.restaurant);
      setMenu(menuRes.data.menu);
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!restaurant) return <div className="not-found">Restaurant not found</div>;

  const categories = Object.keys(menu);
  const allItems = Object.values(menu).flat();
  const displayItems = activeCategory === 'all' ? allItems : menu[activeCategory] || [];

  return (
    <div className="restaurant-detail">
      <div className="restaurant-header">
        <div className="restaurant-banner">
          <img 
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
            alt={restaurant.name} 
          />
        </div>
        <div className="restaurant-info-detail">
          <h1>{restaurant.name}</h1>
          <p className="cuisine">{restaurant.cuisine?.join(', ')}</p>
          <div className="meta-info">
            <span><FiStar /> {restaurant.rating?.toFixed(1)} ({restaurant.totalRatings} reviews)</span>
            <span><FiClock /> {restaurant.deliveryTime}</span>
            <span><FiMapPin /> {restaurant.address?.city}</span>
            {restaurant.phone && <span><FiPhone /> {restaurant.phone}</span>}
          </div>
          {restaurant.minOrderAmount > 0 && (
            <p className="min-order">Minimum order: ${restaurant.minOrderAmount}</p>
          )}
        </div>
      </div>

      <div className="menu-section">
        <div className="category-tabs">
          <button
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => setActiveCategory('all')}
          >
            All ({allItems.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.replace('-', ' ')} ({menu[cat].length})
            </button>
          ))}
        </div>

        {displayItems.length > 0 ? (
          <div className="food-grid">
            {displayItems.map(item => (
              <FoodCard key={item._id} food={item} />
            ))}
          </div>
        ) : (
          <div className="no-items">
            <p>No menu items available yet.</p>
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Reviews</h2>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <span className="reviewer">{review.user?.name}</span>
                  <span className="rating"><FiStar /> {review.rating}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
