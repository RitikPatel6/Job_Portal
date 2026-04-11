import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./application.css";

function Application() {
  const [applications, setApplications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH USER
  useEffect(() => {
    try {
      const data = sessionStorage.getItem("userData");

      if (data) {
        const user = JSON.parse(data);
        setUserId(user.id || user.User_id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  // ✅ FETCH APPLICATIONS
  useEffect(() => {
    if (userId) fetchApplications();
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await Axios.get(
        `http://localhost:1337/api/my-applications/${userId}`
      );

      if (res.data.success) {
        setApplications(res.data.data || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.log(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FORMAT DATE + TIME
  const formatDateTime = (date, time) => {
    if (!date || !time) return "-";

    const cleanDate = String(date).split("T")[0];
    const d = new Date(`${cleanDate}T${time}`);

    return (
      d.toLocaleDateString("en-GB") +
      " | " +
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
  <div className="applications-wrapper">
  <div className="container">

    {/* Banner */}
    <div className="browse-banner">
      <h2>Scheduled Interviews</h2>
    </div>

    {/* Cards */}
    <div className="glass-card">
      {loading ? (
        <p>Loading...</p>
      ) : applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((app) => (
            <div className="application-card" key={app.id}>
              
              {/* LEFT */}
              <div className="app-left">
                <div className="app-icon">🏢</div>

                <div className="app-info">
                  <h3>{app.job_title}</h3>
                  <p><strong>Company:</strong> {app.company_name}</p>

                  <p>
                    <strong>Interview:</strong>{" "}
                    {formatDateTime(app.intv_date, app.intv_time)}
                  </p>

                  <p><strong>Mode:</strong> {app.intv_mode}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="app-right">
                <span className={`status ${app.status?.toLowerCase()}`}>
                  {app.status}
                </span>

                {app.intv_mode === "Online" ? (
                  <a
                    href={app.intv_location}
                    target="_blank"
                    rel="noreferrer"
                    className="join-btn"
                  >
                    Join
                  </a>
                ) : (
                  <p className="location">{app.intv_location}</p>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <p>No scheduled interviews found.</p>
      )}
    </div>

  </div>
</div>
  );
}

export default Application;