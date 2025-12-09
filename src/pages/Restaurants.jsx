import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import Loading from '../components/Loading';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    rating: ''
  });

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

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !filters.category || r.categories?.includes(filters.category);
    const matchesRating = !filters.rating || r.rating >= parseFloat(filters.rating);
    return matchesSearch && matchesCategory && matchesRating;
  });

  if (loading) return <Loading />;

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1>All Restaurants</h1>
        <p>{filteredRestaurants.length} restaurants available</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No restaurants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
