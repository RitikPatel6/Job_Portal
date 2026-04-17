import React, { useEffect, useState } from "react";
import axios from "axios";
import "./viewjob.css";

/* ================= EXPANDABLE TEXT COMPONENT ================= */
const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "250px"
        }}
      >
        {text}
      </div>

      {text && text.length > 60 && (
        <span
          onClick={() => setExpanded(!expanded)}
          style={{
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600"
          }}
        >
          {expanded ? "▲ Show Less" : "▼ Read More"}
        </span>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
function Viewjob() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:1337/api/joblist");

      if (res.data.success) {
        setJobs(res.data.data);
      } else {
        setJobs([]);
      }

    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:1337/api/deletejob/${id}`);
        setJobs(jobs.filter((job) => job.Job_id !== id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

    const getStatus = (endDate) => {
    if (!endDate) return <span className="status-active">Active</span>;
    const today = new Date();
    const jobEndDate = new Date(endDate);
    jobEndDate.setHours(23, 59, 59, 999);

    if (today > jobEndDate) {
      return <span className="status-closed">Closed</span>;
    }
    return <span className="status-active">Active</span>;
  };

  return (
    <div className="job-container">

      {/* 🔥 TOP TITLE */}
      <div className="page-title">All Job List</div>

      <div className="job-card">
        <div className="job-table-wrapper">

          <table className="job-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Job Type</th>
                <th>End Date</th>
                <th>Skills</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length > 0 ? (

                jobs.map((job, index) => (
                  <tr key={job.Job_id}>
                    <td>{index + 1}</td>
                    <td>{job.Job_title}</td>
                    <td>{job.Jobcat_name}</td>
                    <td>{job.location}</td>
                    <td>₹ {job.salary}</td>
                    <td>{job.jobtype}</td>
                    <td>{formatDate(job.end_date)}</td>

                    {/* 🔥 EXPANDABLE SKILLS */}
                    <td>
                      <ExpandableText text={job.skill} />
                    </td>

                    {/* 🔥 EXPANDABLE DESCRIPTION */}
                    <td>
                      <ExpandableText text={job.description} />
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {getStatus(job.end_date)}
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No Jobs Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}

export default Viewjob;