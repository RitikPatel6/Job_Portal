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

      setLoading(true);

      const res = await axios.get("http://localhost:1337/api/joblist");

      setJobs(res.data);

      setLoading(false);

    } catch (error) {

      console.error("Error fetching jobs:", error);
      setLoading(false);

    }
  };

  /* ================= DELETE JOB ================= */

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
                    <td>{job.skill}</td>
                    <td>{job.description}</td>

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