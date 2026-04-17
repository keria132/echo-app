import { Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Layout from './Layout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { ThemeProvider } from './components/ui/ThemeProvider';

function App() {
  const { user, authenticate, isAuthenticated } = useAuthStore();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (!isAuthenticated) return <p>Loading...</p>;

  console.log(user);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="echo-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
