import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiTruck } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import Loading from '../components/Loading';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await restaurantAPI.getAll({ isActive: true });
      setRestaurants(res.data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food, Delivered Fast</h1>
          <p>Order from your favorite restaurants and get it delivered to your doorstep</p>
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <FiMapPin className="feature-icon" />
          <h3>Track Your Order</h3>
          <p>Real-time order tracking</p>
        </div>
        <div className="feature">
          <FiClock className="feature-icon" />
          <h3>Fast Delivery</h3>
          <p>30-45 minutes delivery</p>
        </div>
        <div className="feature">
          <FiTruck className="feature-icon" />
          <h3>Free Delivery</h3>
          <p>On orders above $30</p>
        </div>
      </section>

      <section className="restaurants-section">
        <div className="section-header">
          <h2>Popular Restaurants</h2>
          <Link to="/restaurants" className="view-all">View All</Link>
        </div>
        
        {loading ? (
          <Loading />
        ) : filteredRestaurants.length > 0 ? (
          <div className="restaurants-grid">
            {filteredRestaurants.slice(0, 6).map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No restaurants found. {!search && 'Add some restaurants from the admin panel!'}</p>
          </div>
        )}
      </section>
    </div>
  );
}
