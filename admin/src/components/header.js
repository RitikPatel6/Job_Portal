import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {

  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ✅ CHECK SESSION
  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    setAdmin(null);
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo-section">
          <p className="logo">
            <span className="logo-primary">Job</span>Portal
          </p>
        </div>

        {/* MENU */}
        <div className="header-menu">

          {/* 🔥 IF NOT LOGGED IN */}
          {!admin && (
            <Link to="/login" className="header-link">
              Login
            </Link>
          )}

          {/* 🔥 IF LOGGED IN */}
          {admin && (
            <button className="header-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;