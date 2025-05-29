import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; // Import gambar logo

const Navbar = ({ activePage }) => {
  const location = useLocation(); // Get current route

  // Check if the current route is the landing page ("/")
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="navbar">
      {/* Logo as a local image */}
      <div className="navbar-brand">
        <img 
          src={logo} 
          alt="Reforest Logo" 
          className="navbar-logo"
        />
      </div>
      
      <ul className="navbar-menu">
        {/* Show this for all routes except landing page */}
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
          </>
        )}

        {/* Show profile link only if not on landing page */}
        {!isLandingPage && (
          <li className="navbar-profile">
            <Link to="/profile" className="profile-link">
              <img 
                src="../assets/profile-placeholder.png" 
                alt="Profile" 
                className="profile-pic"
              />
            </Link>
          </li>
        )}

        {/* Display Login and Signup buttons only on the landing page */}
        {isLandingPage && (
          <div className="auth-buttons">
            <Link to="/login" className="auth-button">Login</Link>
            <Link to="/login#signup" className="auth-button">Sign Up</Link>
            {/* Counter is removed from here */}
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
