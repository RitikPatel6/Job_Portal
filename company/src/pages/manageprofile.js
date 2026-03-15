import React from "react";
import "./manageprofile.css";

function JobProfile() {

  const job = {
    title: "Full Stack Developer",
    company: "Tech Solutions Pvt Ltd",
    location: "Ahmedabad",
    salary: "₹4 - 6 LPA",
    experience: "1 - 3 Years",
    skills: "React, JavaScript, HTML, CSS",
    jobType: "Full Time",
    description:
      "We are looking for a Full Stack Developer responsible for building user-friendly web applications. You will work closely with our team to deliver top-quality software solutions.",
  };

  const handleApply = () => {
    const btn = document.getElementById("applyBtn");
    btn.innerText = "Applied";
    btn.disabled = true;
    btn.classList.add("applied");
    alert("You have successfully applied for this job!");
  };

  return (
    <div className="jobprofile-page">
      <div className="jobprofile-card">

        <div className="jobprofile-header">
          <h2>{job.title}</h2>
          <p className="company-name">{job.company}</p>
        </div>

        <div className="jobprofile-details">
          <div className="detail-item">
            <strong>Location:</strong> {job.location}
          </div>
          <div className="detail-item">
            <strong>Salary:</strong> {job.salary}
          </div>
          <div className="detail-item">
            <strong>Experience:</strong> {job.experience}
          </div>
          <div className="detail-item">
            <strong>Job Type:</strong> {job.jobType}
          </div>
          <div className="detail-item full-width">
            <strong>Skills:</strong> {job.skills}
          </div>
        </div>

        <div className="job-description">
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>

        <button
          id="applyBtn"
          className="apply-btn"
          onClick={handleApply}
        >
          Apply Now
        </button>

      </div>
    </div>
  );
}

export default JobProfile;
