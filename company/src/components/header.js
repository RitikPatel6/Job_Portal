import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* Logo Section */}
        <div className="logo-section">
          <p to="/" className="logo">
            <span className="logo-primary">Job</span>Portal
          </p>
        </div>


        {/* Right Menu */}
        <div className="header-menu">
          <Link to="/signup" className="header-link">
            Sign Up
          </Link>

          <Link to="/login" className="header-link">
            Login
          </Link>

          <Link to="/login" className="header-link logout-btn">
           Logout <i className="icon-logout"></i> 
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Header;
