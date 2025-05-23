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

function App() {
  return (
    <Router>
      <Routes>
        {/* Route tanpa navbar */}
        <Route path="/" element={<LoginSignup />} />
        
        {/* Route dengan navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/lokasi" element={<Lokasi />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/pohonku" element={<Pohonku />} />  {/* Route baru untuk Pohonku */}
        </Route>
      </Routes>
    </Router>
  );
}

// Layout yang mengandung navbar
function LayoutWithNavbar() {
  const location = useLocation();

  const getActivePage = () => {
    if (location.pathname === '/home') return 'home';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/artikel') return 'artikel';
    if (location.pathname === '/lokasi') return 'lokasi';
    if (location.pathname === '/faq') return 'faq';
    if (location.pathname === '/pohonku') return 'pohonku';  // pastikan key ini sesuai Navbar
    return '';
  };

  return (
    <div className="app-layout">
      <Navbar activePage={getActivePage()} />
      <div className="content">
        <Outlet /> {/* Ini akan merender child route */}
      </div>
    </div>
  );
}

export default App;
