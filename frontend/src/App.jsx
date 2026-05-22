import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import NotFound from './pages/NotFound';

// Route protégée — redirige vers /auth si non connecté
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f5f0]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#1d6a40] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#9a9a8a] font-mono">Chargement...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
};

// Route publique — redirige vers /dashboard si déjà connecté
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/p/:username" element={<PublicPortfolio />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a14', color: '#fff', fontSize: '0.85rem', borderRadius: '10px' },
            success: { iconTheme: { primary: '#25a058', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
