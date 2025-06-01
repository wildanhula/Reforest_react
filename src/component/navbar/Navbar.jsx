import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/user';

const Navbar = ({ activePage }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const profilePhoto = user?.user_image?.image_url || '../assets/profile-placeholder.png';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Reforest Logo" className="navbar-logo" />
      </div>
      <ul className="navbar-menu">
        {!isLandingPage && (
          <>
            <li className={`navbar-item ${activePage === 'home' ? 'active' : ''}`}>
              <Link to="/home">Home</Link>
            </li>
            <li className={`navbar-item ${activePage === 'lokasi' ? 'active' : ''}`}>
              <Link to="/lokasi">Lokasi</Link>
            </li>
            <li className={`navbar-item ${activePage === 'pohonku' ? 'active' : ''}`}>
              <Link to="/pohonku">Pohonku</Link>
            </li>
            <li className={`navbar-item ${activePage === 'artikel' ? 'active' : ''}`}>
              <Link to="/artikel">Artikel</Link>
            </li>
            <li className={`navbar-item ${activePage === 'faq' ? 'active' : ''}`}>
              <Link to="/faq">FAQs</Link>
            </li>
            <li className="navbar-profile">
              <Link to="/profile" className="profile-link">
                <img src={profilePhoto} alt="Profile" className="profile-pic" />
              </Link>
            </li>
          </>
        )}

        {isLandingPage && (
          <div className="auth-buttons">
            <Link to="/login" className="auth-button">Login</Link>
            <Link to="/login#signup" className="auth-button">Sign Up</Link>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
