import './App.css';
import LoginSignup from './component/login/loginSignup.jsx';
import HomePage from './component/homepage/HomePage.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import ProfilePage from './component/profile/ProfilePage.jsx';
import Artikel from './component/artikel/artikel.jsx';
import Navbar from './component/navbar/Navbar.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route tanpa navbar */}
        <Route path="/" element={<LoginSignup />} />
        
        {/* Route dengan navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/artikel" element={<Artikel />} />
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
    if (location.pathname === '/profile') return 'pohonku';
    if (location.pathname === '/artikel') return 'artikel';
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