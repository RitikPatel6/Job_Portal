import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ CHECK LOGIN STATUS
  useEffect(() => {
    const company = sessionStorage.getItem("company");
    setIsLoggedIn(!!company); // true/false
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    sessionStorage.removeItem("company");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-primary">Job</span>Portal
          </Link>
        </div>

        {/* MENU */}
        <div className="header-menu">

          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="header-link">
                Sign Up
              </Link>

              <Link to="/login" className="header-link">
                Login
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="header-link logout-btn">
              Logout <i className="icon-logout"></i>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;