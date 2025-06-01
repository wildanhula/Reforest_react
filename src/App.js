import './App.css';
import LoginSignup from './component/login/loginSignup.jsx';
import LandingPage from './component/landingpage/LandingPage.jsx';
import HomePage from './component/homepage/HomePage.jsx';
import ProfilePage from './component/profile/ProfilePage.jsx';
import Artikel from './component/artikel/artikel.jsx';
import Pohonku from './component/pohonku/Pohonku.jsx';
import Navbar from './component/navbar/Navbar.jsx';
import Lokasi from './component/lokasi/Lokasi.jsx';
import Faq from './component/faq/Faq.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// Layout yang mengandung navbar
function LayoutWithNavbar() {
  const location = useLocation();

  const getActivePage = () => {
    if (location.pathname.includes('/home')) return 'home';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/artikel') return 'artikel';
    if (location.pathname === '/lokasi') return 'lokasi';
    if (location.pathname === '/faq') return 'faq';
    if (location.pathname === '/pohonku') return 'pohonku';
    return '';
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user ? user.name : null;

  return (
    <div className="app-layout">
      <Navbar activePage={getActivePage()} userName={userName}/>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

// Komponen proteksi akses user
const ProtectedHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const urlUserId = location.pathname.split('/')[2]; // ambil dari '/home/:userId'

  if (!user || user.id.toString() !== urlUserId) {
    return <Navigate to="/" replace />;
  }

  return <HomePage />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Tanpa Navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:actionType" element={<LoginSignup />} />

        {/* Dengan Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/home/:userId" element={<ProtectedHome />} />
          <Route path="/lokasi" element={<Lokasi />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/pohonku" element={<Pohonku />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
