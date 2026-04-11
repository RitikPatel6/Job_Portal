// JobDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./jobdetails.css"; // new CSS file

function Jobdetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchJob();
    else setLoading(false);
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:1337/api/job/${id}`);
      if (res.data.success) setJob(res.data.data);
      else if (Array.isArray(res.data)) setJob(res.data[0]);
      else setJob(null);
    } catch (err) {
      console.error(err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3 className="jd-loading">Loading...</h3>;
  if (!job) return <h3 className="jd-error">Invalid Job ❌</h3>;

  return (
    <div className="jd-wrapper">

      <button className="jd-back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="jd-card">

        <h2 className="jd-title">{job.Job_title}</h2>

        <p className="jd-info"><b>Location:</b> {job.location}</p>
        <p className="jd-info"><b>Salary:</b> ₹{job.salary}</p>
        <p className="jd-info"><b>Job Type:</b> {job.jobtype}</p>

        <hr />

        <h3 className="jd-section-header">Company Information</h3>
        <p className="jd-company"><b>Name:</b> {job.Company_name}</p>
        <p className="jd-company"><b>Email:</b> {job.Company_email}</p>
        <p className="jd-company"><b>Contact:</b> {job.Company_contact}</p>
        {job.website_URL && (
          <p className="jd-company">
            <b>Website:</b> <a href={job.website_URL} target="_blank" rel="noreferrer">{job.website_URL}</a>
          </p>
        )}

        <h3 className="jd-section-header">Skills</h3>
        <p className="jd-skills">{job.skill}</p>

        <hr />

        <h3 className="jd-section-header">Description</h3>
        <p className="jd-desc">{job.description}</p>

      </div>

    </div>
  );
}

export default Jobdetails;