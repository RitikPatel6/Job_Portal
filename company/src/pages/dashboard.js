import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    rejected: 0
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const company = JSON.parse(sessionStorage.getItem("company") || "{}");
  const companyId = company.Company_id || company.id;

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await axios.get(
          `http://localhost:1337/api/companyDashboard/${companyId}`
        );
        const recentRes = await axios.get(
          `http://localhost:1337/api/recentApplications/${companyId}`
        );

        setStats({
          totalJobs: statsRes.data?.totalJobs || 0,
          totalApplications: statsRes.data?.totalApplications || 0,
          shortlisted: statsRes.data?.shortlisted || 0,
          rejected: statsRes.data?.rejected || 0
        });

        setRecent(recentRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (!companyId) {
    return <div className="dashboard-message">Please Login First</div>;
  }

  if (loading) {
    return <div className="dashboard-message">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Company Dashboard</h1>

      {/* ===== KPI CARDS ===== */}
      <div className="dashboard-cards">
        <div className="kpi-card kpi-indigo">
          <h3>Total Jobs</h3>
          <p>{stats.totalJobs}</p>
        </div>
        <div className="kpi-card kpi-blue">
          <h3>Applications</h3>
          <p>{stats.totalApplications}</p>
        </div>
        <div className="kpi-card kpi-green">
          <h3>Shortlisted</h3>
          <p>{stats.shortlisted}</p>
        </div>
        <div className="kpi-card kpi-red">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      {/* ===== RECENT APPLICATIONS TABLE ===== */}
      <h2 className="dashboard-subtitle">Recent Applications</h2>
      <table className="applications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recent.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-data">No Data</td>
            </tr>
          ) : (
            recent.map((item, i) => (
              <tr key={i}>
                <td>{item.Name}</td>
                <td>{item.job_title}</td>
                <td className={`status-badge ${item.Status?.toLowerCase()}`}>
                  {item.Status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
