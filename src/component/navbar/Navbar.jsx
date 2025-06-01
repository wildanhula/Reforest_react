import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; // Logo
const profilePic = require('../assets/profile-placeholder.png');

const Navbar = ({ activePage, userName }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Reforest Logo" className="navbar-logo" />
      </div>
      
      <ul className="navbar-menu">
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
        <li className="navbar-name">
          <Link to="/profile" className="profile-link">
          {userName && <span className="profile-name">{userName}</span>}
          </Link>
        </li>
        <li className="navbar-profile">
          <Link to="/profile" className="profile-link">
            <img src={profilePic} alt="Profile" className="profile-pic" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
