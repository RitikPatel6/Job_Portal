import React, { useEffect, useState } from "react";
import "./browsejob.css";
import Axios from "axios";

function Browsejob() {

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const user_id = 1;

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:1337/api/joblist");
      setJobs(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH APPLIED =================
  const fetchAppliedJobs = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:1337/api/applied/${user_id}`
      );

      const ids = res.data.map(
        (job) => job.Job_id || job.job_id
      );

      setAppliedJobs(ids);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= APPLY =================
  const applyJob = async (job) => {
    try {
      const res = await Axios.post(
        "http://localhost:1337/api/apply",
        {
          job_id: job.Job_id,
          user_id: user_id,
          company_id: job.Company_id || 1
        }
      );

      if (res.data.success) {
        alert("Applied Successfully ✅");
        setAppliedJobs((prev) => [...prev, job.Job_id]);
      } else {
        alert("Already Applied ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  // ================= FILTER =================
  const filteredJobs = jobs.filter((job) =>
    job.Job_title?.toLowerCase().includes(search.toLowerCase()) ||
    job.skill?.toLowerCase().includes(search.toLowerCase())
  );

  const images = [
    "/img/svg_icon/1.svg",
    "/img/svg_icon/2.svg",
    "/img/svg_icon/3.svg",
    "/img/svg_icon/4.svg"
  ];

  return (
    <div className="browsejob-page">

      {/* Banner */}
      <section className="browsejob-banner">
        <h1>{filteredJobs.length}+ Jobs Available</h1>
      </section>

      <div className="container browsejob-container">

        {/* Sidebar */}
        <aside className="filter-sidebar">
          <h3>Filter Jobs</h3>

          <input
            type="text"
            placeholder="Search job or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </aside>

        {/* Jobs */}
        <section className="job-listing">
          <h2>Job Listings</h2>

          <div className="job-cards">

            {loading ? (
              <p>Loading jobs...</p>
            ) : filteredJobs.length > 0 ? (

              filteredJobs.map((job, index) => {

                const isApplied = appliedJobs.includes(job.Job_id);

                return (
                  <div className="job-card" key={job.Job_id}>

                    {/* LEFT */}
                    <div className="job-card-left">

                      <img
                        src={images[index % images.length]}
                        alt="logo"
                        className="job-img"
                      />

                      <div className="job-info">

                        <h4>{job.Job_title}</h4>

                        <p>
                          {job.location} • {job.jobtype} • ₹{job.salary}
                        </p>

                        <p>
                          <strong>Skills:</strong> {job.skill || "N/A"}
                        </p>

                        {job.Jobcat_description && (
                          <p className="job-category">
                            {job.Jobcat_description}
                          </p>
                        )}

                        {job.description && (
                          <p className="job-desc">
                            <strong>Description:</strong> {job.description}
                          </p>
                        )}

                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="job-card-right">
                      {isApplied ? (
                        <button className="btn-applied">
                          Applied ✅
                        </button>
                      ) : (
                        <button
                          className="btn-apply"
                          onClick={() => applyJob(job)}
                        >
                          Apply Now
                        </button>
                      )}
                    </div>

                  </div>
                );
              })

            ) : (
              <p>No Jobs Found</p>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}

export default Browsejob;