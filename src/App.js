import './App.css';
import LoginSignup from './component/login/loginSignup.jsx';
import HomePage from './component/homepage/HomePage.jsx';
import ProfilePage from './component/profile/ProfilePage.jsx';
import Artikel from './component/artikel/artikel.jsx';
import Pohonku from './component/pohonku/pohonku.jsx';
import Navbar from './component/navbar/Navbar.jsx';
import Lokasi from './component/lokasi/Lokasi.jsx';
import Faq from './component/faq/Faq.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute'; // Impor ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for HomePage with Navbar (no login required) */}
        <Route path="/" element={<HomepageLayoutWithNavbar />} />  {/* Homepage layout with Navbar */}

        {/* Route for Login */}
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/login#signup" element={<LoginSignup />} />

        {/* Route with Navbar for other pages, protected by ProtectedRoute */}
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
        <HomePage /> {/* Directly render the homepage */}
      </div>
    </div>
  );
}

// Layout with Navbar for other pages (protected)
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
        <Outlet /> {/* This will render the content of child routes */}
      </div>
    </div>
  );
}

export default App;
