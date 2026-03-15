import React from "react";
import "./logout.css";

function Logout() {
  return (
    <div className="logout-page">

      <div className="logout-card">
        <h2>Logout</h2>

        <p>
          Are you sure you want to logout from your account?
        </p>

        <div className="logout-buttons">
          <button className="btn-confirm">
            Yes, Logout
          </button>

          <button className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
}

export default Logout;
