import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./dashboard.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [data, setData] = useState({ totalCompanies: 0, totalJobs: 0, totalApplications: 0, totalInterviews: 0 });
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const admin = JSON.parse(sessionStorage.getItem("admin") || "{}");

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:1337/api/adminDashboard");
        if (isMounted.current) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted.current = false; };
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading Dashboard...</p>;

  const chartData = {
    labels: ["Companies", "Jobs", "Applications", "Interviews"],
    datasets: [{
      label: "Metrics",
      data: [data.totalCompanies, data.totalJobs, data.totalApplications, data.totalInterviews],
      backgroundColor: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"],
      borderRadius: 8
    }]
  };

  const options = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p style={{ textAlign: "center" }}>Welcome, {admin.admin_name || "Admin"}</p>

      <div className="dashboard-cards">
        <div className="card"><h3>Companies</h3><p>{data.totalCompanies}</p></div>
        <div className="card"><h3>Jobs</h3><p>{data.totalJobs}</p></div>
        <div className="card"><h3>Applications</h3><p>{data.totalApplications}</p></div>
        <div className="card"><h3>Interviews</h3><p>{data.totalInterviews}</p></div>
      </div>

      <div className="chart-section">
        <h2>Platform Metrics</h2>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;