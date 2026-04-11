// Viewjoblist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./viewjoblist.css";

function Viewjoblist() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const companyData = JSON.parse(sessionStorage.getItem("company"));
      if (!companyData || !companyData.Company_id) {
        setJobs([]);
        return;
      }

      setLoading(true);

      const res = await axios.get(
        `http://localhost:1337/api/joblist?Company_id=${companyData.Company_id}`
      );

      if (res.data.success) {
        // Add 'expanded' flags for description and skills
        const jobsWithFlags = res.data.data.map((job) => ({
          ...job,
          descriptionExpanded: false,
          skillsExpanded: false,
        }));
        setJobs(jobsWithFlags);
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

  const toggleDescription = (id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.Job_id === id ? { ...j, descriptionExpanded: !j.descriptionExpanded } : j
      )
    );
  };

  const toggleSkills = (id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.Job_id === id ? { ...j, skillsExpanded: !j.skillsExpanded } : j
      )
    );
  };

  return (
    <div className="job-container">
      <div className="job-card">
        <div className="job-header">Job List</div>

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
                <th>Action</th>
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

                    {/* Skills column */}
                    <td>
                      <div className="desc-container">
                        <p className={`desc-text ${job.skillsExpanded ? "expanded" : ""}`}>
                          {job.skill || "-"}
                        </p>
                        {job.skill && job.skill.length > 30 && (
                          <span
                            className="toggle-desc"
                            onClick={() => toggleSkills(job.Job_id)}
                          >
                            {job.skillsExpanded ?"▲ Show Less" : "▼ Read More"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Description column */}
                    <td>
                      <div className="desc-container">
                        <p className={`desc-text ${job.descriptionExpanded ? "expanded" : ""}`}>
                          {job.description || "-"}
                        </p>
                        {job.description && job.description.length > 100 && (
                          <span
                            className="toggle-desc"
                            onClick={() => toggleDescription(job.Job_id)}
                          >
                            {job.descriptionExpanded ? "▲ Show Less" : "▼ Read More"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {/* EDIT BUTTON */}
                      <Link
                        to="/editjoblist"
                        state={{ Job_id: job.Job_id }}
                        className="btn-edit"
                      >
                        Edit
                      </Link>

                      {/* DELETE BUTTON */}
                      <button
                        className="btn-delete"
                        onClick={() => deleteJob(job.Job_id)}
                      >
                        Delete
                      </button>
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

export default Viewjoblist;