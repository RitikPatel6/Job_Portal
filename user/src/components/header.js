import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {

  const navigate = useNavigate();
  const user = sessionStorage.getItem("userData");

  const Logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header-area">
      <div className="main-header-area">

        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/img/logo.png" alt="logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="main-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/aboutas">About Us</Link></li>
            <li><Link to="/browsejob">Browse Job</Link></li>
             <li><Link to="/application">Application</Link></li>
            <li><Link to="/candidates">Candidates</Link></li>

            {/* <li className="dropdown">
              <span>Blog</span>
              <ul className="submenu">
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/singleblog">Single Blog</Link></li>
              </ul>
            </li> */}

            <li><Link to="/contact">Contact</Link></li>
            {user && (
              <li><Link to="/notifications">🔔 Notifications</Link></li>
            )}
          </ul>
        </nav>

        {/* Buttons */}
        <div className="header-buttons">

          {user ? (
            <>
              <Link to="/resume" className="Resume-btn">
              Resume
              </Link>

              <button className="login-btn" onClick={Logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/signup" className="signup-btn">
                Signup
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;