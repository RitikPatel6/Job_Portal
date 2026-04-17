import React from "react";
import "./footer.css";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate("/browsejob", { state: { categoryId } });
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Logo + About */}
        <div className="footer-box">
          <h2 className="footer-logo">JobPortal</h2>
          <p>
            Find your dream job easily. Connect with top companies and
            build your career with us.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/browsejob">Browse Jobs</a></li>
            <li><a href="/candidates">Candidates</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-box">
          <h3>Categories</h3>
          <ul className="footer-categories">
            <li><span onClick={() => handleCategoryClick(10)}>Software</span></li>
            <li><span onClick={() => handleCategoryClick(7)}>Marketing</span></li>
            <li><span onClick={() => handleCategoryClick(8)}>Design</span></li>
            <li><span onClick={() => handleCategoryClick(6)}>Engineering</span></li>
            <li><span onClick={() => handleCategoryClick(9)}>Support</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-box">
          <h3>Subscribe</h3>
          <p>Get latest job updates.</p>

          <div className="footer-newsletter">
            <input type="email" placeholder="Enter Email" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 JobPortal. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;