import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from './store/useAuthStore';

const GuestRoute = () => {
  const { user } = useAuthStore();

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;
