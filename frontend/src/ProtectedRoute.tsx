import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
