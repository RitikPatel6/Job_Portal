import React, { useState } from "react";
import "./viewjob.css";

function ViewJob() {

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "React Developer",
      category: "IT",
      location: "Remote",
      salary: "6 LPA",
      experience: "2 Years",
      type: "Full Time",
      status: "Active"
    },
    {
      id: 2,
      title: "HR Executive",
      category: "HR",
      location: "Mumbai",
      salary: "4 LPA",
      experience: "1 Year",
      type: "Full Time",
      status: "Active"
    }
  ]);

  const deleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <div className="job-container">
      <div className="job-card">
        <div className="job-header">Job List</div>

        <div className="job-table-wrapper">
          <table className="job-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Experience</th>
                <th>Type</th>
                <th>Status</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.category}</td>
                  <td>{job.location}</td>
                  <td>{job.salary}</td>
                  <td>{job.experience}</td>
                  <td>{job.type}</td>

                  <td>
                    <span className="status-active">
                      {job.status}
                    </span>
                  </td>

                  <td className="action-column">
                    <div className="action-buttons">
                      <button className="btn-edit">Edit</button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewJob;
