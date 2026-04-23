import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeStorage } from './utils/storage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Completed from './pages/Completed';
import Apply from './pages/Apply';
import About from './pages/About';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageTournaments from './pages/admin/ManageTournaments';
import ManageNews from './pages/admin/ManageNews';
import Applications from './pages/admin/Applications';
import Settings from './pages/admin/Settings';

// ── Protected Route ─────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout wrapper for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      {/* ✅ ВАЖНО: basename для GitHub Pages */}
      <Router basename="/miracletour">
        <ScrollToTop />
        <div className="min-h-screen bg-black">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="tournaments" element={<ManageTournaments />} />
              <Route path="tournaments/:id" element={<ManageTournaments />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="news/:id" element={<ManageNews />} />
              <Route path="applications" element={<Applications />} />
            </Route>

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <PublicLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route path="/tournaments/:id" element={<TournamentDetail />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/completed" element={<Completed />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </PublicLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
