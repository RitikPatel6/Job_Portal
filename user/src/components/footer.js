import React from "react";
import "./footer.css";

function Footer() {
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
            <li><a href="/jobs">Browse Jobs</a></li>
            <li><a href="/candidate">Candidates</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-box">
          <h3>Categories</h3>
          <ul>
            <li><a href="#">Software</a></li>
            <li><a href="#">Marketing</a></li>
            <li><a href="#">Design</a></li>
            <li><a href="#">Engineering</a></li>
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