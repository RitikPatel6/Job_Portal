import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import ritikImage from "./ritik.jpeg";

function Sidebar() {

  const toggleDropdown = (id) => {
    const menu = document.getElementById(id);
    menu.classList.toggle("show");
  };

  return (
    <div className="sidebar">
      <div className="profile-section">
        <img
  src={ritikImage}
  alt="profile"
  className="profile-img"
/>

        <div>
          <h3>Ritik Patel</h3>
          <p>Frontend Developer</p>
        </div>
      </div>
      <p className="menu-title">Admin</p>

      <ul className="menu">

        <li>
          <Link className="icon-home" to="/dashboard">Dashboard</Link>
        </li>

        {/* Manage Job Category */}
        <li>
          <div
            className="manage icon-list"
            onClick={() => toggleDropdown("manageEmployerMenu")}
          >
            Manage Employer
          </div>

          <ul className="submenu" id="manageEmployerMenu">
            <li>
              <Link to="/Viewemployer">View Employer</Link>
            </li>
          </ul>
        </li>

        {/* Manage Job List */}
        <li>
          <div
            className="managejob icon-list"
            onClick={() => toggleDropdown("managejobpost")}
          >
            Manage Jobpost
          </div>

          <ul className="submenu" id="managejobpost">
            <li>
              <Link to="/viewjob">View Job</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link className="icon-list" to="/monitoringjobseeker">Monitoring Job Seeker</Link>
        </li>

        <li>
          <Link className="icon-settings" to="/manageprofile">Manage Profile</Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;
