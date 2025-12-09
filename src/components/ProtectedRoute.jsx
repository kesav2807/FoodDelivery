import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children, adminOnly = false, deliveryOnly = false }) {
  const { isAuthenticated, isAdmin, isDelivery, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (deliveryOnly && !isDelivery) {
    return <Navigate to="/" />;
  }

  return children;
}
