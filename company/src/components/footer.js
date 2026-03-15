import React from "react";
import "./footer.css";  

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <p>
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
