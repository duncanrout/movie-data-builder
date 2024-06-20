import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/" className="nav-link">Home</a>
      </div>
      <div className="nav-right">
        <a href="/about" className="nav-link">About</a>
      </div>
    </nav>
  );
};

export default Navbar;
