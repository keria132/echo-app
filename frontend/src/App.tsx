import { Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthLayout from './components/auth/AuthLayout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { ThemeProvider } from './components/ui/ThemeProvider';
import MainLayout from './components/MainLayout';
import ProfilePage from './pages/ProflePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { authenticate, isAuthenticated } = useAuthStore();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (!isAuthenticated) return <p>Loading...</p>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="echo-theme">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
