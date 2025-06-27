import './App.css';
import LoginSignup from './component/login/loginSignup.jsx';
import HomePage from './component/homepage/HomePage.jsx';
import ProfilePage from './component/profile/ProfilePage.jsx';
import Artikel from './component/artikel/artikel.jsx';
import Pohonku from './component/pohonku/pohonku.jsx';
import Navbar from './component/navbar/Navbar.jsx';
import Lokasi from './component/lokasi/Lokasi.jsx';
import Faq from './component/faq/Faq.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomepageLayoutWithNavbar />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/login#signup" element={<LoginSignup />} />

        {/* Protected routes */}
        <Route element={<LayoutWithNavbar />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lokasi"
            element={
              <ProtectedRoute>
                <Lokasi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artikel"
            element={
              <ProtectedRoute>
                <Artikel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <Faq />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pohonku"
            element={
              <ProtectedRoute>
                <Pohonku />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback untuk semua rute tak dikenal */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Layout for homepage with Navbar (no login required)
function HomepageLayoutWithNavbar() {
  return (
    <div className="app-layout">
      <Navbar activePage="home" />
      <div className="content">
        <HomePage />
      </div>
    </div>
  );
}

// Layout with Navbar for protected pages
function LayoutWithNavbar() {
  const location = useLocation();

  const getActivePage = () => {
    if (location.pathname === '/home') return 'home';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/artikel') return 'artikel';
    if (location.pathname === '/lokasi') return 'lokasi';
    if (location.pathname === '/faq') return 'faq';
    if (location.pathname === '/pohonku') return 'pohonku';
    return '';
  };

  return (
    <div className="app-layout">
      <Navbar activePage={getActivePage()} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
