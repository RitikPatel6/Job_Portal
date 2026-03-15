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

      <p className="menu-title">Company</p>

      <ul className="menu">

        <li>
          <Link className="icon-home" to="/dashboard">Dashboard</Link>
        </li>

        {/* Manage Job Category */}
        <li>
          <div
            className="manage icon-list"
            onClick={() => toggleDropdown("jobCategoryMenu")}
          >
            Manage Job Category
          </div>

          <ul className="submenu" id="jobCategoryMenu">
            <li>
              <Link to="/addjobcategory">Add Job Category</Link>
            </li>
            <li>
              <Link to="/viewjob">View Category</Link>
            </li>
          </ul>
        </li>

        {/* Manage Job List */}
        <li>
          <div
            className="managejob icon-list"
            onClick={() => toggleDropdown("jobListMenu")}
          >
            Manage Job List
          </div>

          <ul className="submenu" id="jobListMenu">
            <li>
              <Link to="/addjoblist">Add Job List</Link>
            </li>
            <li>
              <Link to="/viewjoblist">View Job </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link className="icon-list" to="/managecandidates">Manage Candidates</Link>
        </li>

        <li>
          <Link className="icon-user" to="/scheduleinterview">Schedule Interview</Link>
        </li>

        <li>
          <Link className="icon-user" to="/chatwithjobseeker">Chat With Job Seeker</Link>
        </li>

        <li>
          <Link className="icon-settings" to="/profile">Manage Profile</Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;
