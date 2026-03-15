import React from "react";
import { useNavigate } from "react-router-dom";

import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="job-container">

      <div className="job-card">

        <div className="job-header">
          Dashboard Overview
        </div>

        <div className="dashboard-content">

          {/* Welcome Section */}
          <div className="welcome-box">
            <h3>Welcome Back, Ritik 👋</h3>
            <p>Here is what’s happening with your job portal today.</p>
          </div>

          {/* Stats Section */}
          <div className="dashboard-stats">

            <div className="stat-card blue">
              <h4>Total Jobs</h4>
              <p>18</p>
            </div>

            <div className="stat-card green">
              <h4>Active Jobs</h4>
              <p>12</p>
            </div>

            <div className="stat-card orange">
              <h4>Total Applications</h4>
              <p>56</p>
            </div>

            <div className="stat-card purple">
              <h4>Interviews Scheduled</h4>
              <p>7</p>
            </div>

          </div>

          {/* Recent Jobs Table */}
          <div className="recent-table-card">
            <h3>Recent Jobs</h3>

            <table className="recent-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>React Developer</td>
                  <td>IT</td>
                  <td>Remote</td>
                  <td><span className="status active">Active</span></td>
                </tr>

                <tr>
                  <td>HR Executive</td>
                  <td>HR</td>
                  <td>Mumbai</td>
                  <td><span className="status inactive">Inactive</span></td>
                </tr>
              </tbody>

            </table>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
        <button 
        className="action-btn"
        onClick={() => navigate("/viewjob")}
        >
        View Job
      </button>

      <button className="action-btn outline"
      onClick={() => navigate("/viewemployer")}>
      Manage Employer
   </button>
</div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
