// MonitoringJobSeeker.jsx
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import "./monitoringjobseeker.css";

function MonitoringJobSeeker() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await Axios.get("http://localhost:1337/api/jobseekers");
      // Add expanded flag for Skills
      const usersWithFlag = (res.data.data || []).map(u => ({ ...u, skillsExpanded: false }));
      setUsers(usersWithFlag);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user status
  const toggleStatus = async (id) => {
    try {
      const res = await Axios.post("http://localhost:1337/api/toggleUserStatus", { id });
      if (res.data.status === "success") {
        Swal.fire("Updated", "Status changed successfully", "success");

        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 1 ? 0 : 1 } : u));
      } else {
        Swal.fire("Error", res.data.message || "Could not update status", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const toggleSkills = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, skillsExpanded: !u.skillsExpanded } : u
      )
    );
  };

  const filteredUsers = users.filter(user => 
    user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="loading-text">Loading Job Seekers...</p>;

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <h2>Monitoring Job Seekers</h2>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th className="admin">#</th>
              <th className="admin">Name</th>
              <th className="admin">Email</th>
              <th className="admin">Contact</th>
              <th className="admin">Skills</th>
              <th className="admin">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Candidates Found</td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => {
                const isActive = Number(user.status) === 1;
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.Name}</td>
                    <td>{user.email}</td>
                    <td>{user.Contact_no || "N/A"}</td>

                    {/* Skills with expand/collapse */}
                    <td>
                      <div className="desc-container">
                        <p className={`desc-text ${user.skillsExpanded ? "expanded" : ""}`}>
                          {user.Skills || "N/A"}
                        </p>
                        {user.Skills && user.Skills.length > 30 && (
                          <span
                            className="toggle-desc"
                            onClick={() => toggleSkills(user.id)}
                          >
                            {user.skillsExpanded ? "▲ Show Less" : "▼ Read More"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="status-cell">
                        <span className={`status-badge ${isActive ? "active" : "blocked"}`}>
                          {isActive ? "Active" : "Blocked"}
                        </span>
                        <button
                          className={`btn-toggle ${isActive ? "block" : "unblock"}`}
                          onClick={() => toggleStatus(user.id)}
                        >
                          {isActive ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MonitoringJobSeeker;