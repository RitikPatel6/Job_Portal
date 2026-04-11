import React, { useEffect, useState } from "react";
import "./browsejob.css";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

function Browsejob() {

  const navigate = useNavigate();
  const location = useLocation();
  const [companyFilter, setCompanyFilter] = useState(location.state?.companyId || location.state?.searchFilters?.Company_id || null);
  const [categoryFilter, setCategoryFilter] = useState(location.state?.categoryId || location.state?.searchFilters?.category || null);
  const [locationFilter, setLocationFilter] = useState(location.state?.searchFilters?.location || null);
  const [singleJobFilter, setSingleJobFilter] = useState(location.state?.singleJobId || null);

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(location.state?.searchFilters?.keyword || "");
  const [userId, setUserId] = useState(null);

  /* ===== IMAGES ===== */
  const images = [
    "/img/svg_icon/1.svg",
    "/img/svg_icon/2.svg",
    "/img/svg_icon/3.svg",
    "/img/svg_icon/4.svg"
  ];

  /* ===== GET USER ===== */
  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const user = JSON.parse(data);
      setUserId(user?.id);
    }
  }, []);

  /* ===== FETCH JOBS ===== */
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await Axios.get("http://localhost:1337/api/joblist");

      console.log("JOB LIST:", res.data); // DEBUG

      let jobList = [];
      if (Array.isArray(res.data)) {
        jobList = res.data;
      } else if (res.data.success) {
        jobList = res.data.data;
      }

      const today = new Date();
      const activeJobs = jobList.filter(job => {
        if (!job.end_date) return true;
        const endDate = new Date(job.end_date);
        endDate.setHours(23, 59, 59, 999);
        return today <= endDate;
      });

      setJobs(activeJobs);

    } catch (err) {
      console.log("ERROR:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== FETCH APPLIED JOBS ===== */
  useEffect(() => {
    if (userId) fetchAppliedJobs();
  }, [userId]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:1337/api/applied/${userId}`
      );

      const data = res.data.data || res.data || [];

      const ids = data.map((item) => Number(item.Job_id));

      setAppliedJobs(ids);

    } catch (err) {
      console.log(err);
    }
  };

  /* ===== APPLY JOB ===== */
  const applyJob = async (job) => {

    if (!userId) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    try {
      const res = await Axios.post(
        "http://localhost:1337/api/apply",
        {
          Job_id: job.Job_id,
          User_id: userId,
          Company_id: job.Company_id,
          description: job.description
        }
      );

      if (res.data.success) {

        alert("Applied Successfully ✅");

        setAppliedJobs(prev =>
          prev.includes(Number(job.Job_id))
            ? prev
            : [...prev, Number(job.Job_id)]
        );

      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  /* ===== FILTER ===== */
  const filteredJobs = jobs.filter((job) => {
    let matchCompany = true;
    if (companyFilter) {
      matchCompany = Number(job.Company_id) === Number(companyFilter);
    }
    
    let matchCategory = true;
    if (categoryFilter) {
      matchCategory = Number(job.Jobcat_id) === Number(categoryFilter);
    }

    let matchLocation = true;
    if (locationFilter) {
      matchLocation = job.location === locationFilter;
    }

    let matchSingleJob = true;
    if (singleJobFilter) {
      matchSingleJob = Number(job.Job_id) === Number(singleJobFilter);
    }

    const matchSearch =
      job.Job_title?.toLowerCase().includes(search.toLowerCase()) ||
      job.skill?.toLowerCase().includes(search.toLowerCase());

    return matchCompany && matchCategory && matchLocation && matchSearch && matchSingleJob;
  });

  /* ===== UI ===== */
  return (
    <div>

      {/* ===== BANNER ===== */}
      <div className="browsejob-banner">
        <h1>Find Your Dream Job</h1>
        <p>{filteredJobs.length} Jobs Available</p>
      </div>

      <div className="container browsejob-container">

        {/* ===== SIDEBAR ===== */}
        <div className="filter-sidebar">
          <h3>Search Jobs</h3>

          <input
            type="text"
            placeholder="Search by title or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn-reset"
            onClick={() => {
              setSearch("");
              setCompanyFilter(null);
              setCategoryFilter(null);
              setLocationFilter(null);
              setSingleJobFilter(null);
            }}
          >
            Reset
          </button>
        </div>

        {/* ===== JOB LIST ===== */}
        <div className="job-listing">

          <div className="job-listing-header">
            <h2 className="Available">Available Jobs</h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredJobs.length > 0 ? (

            <div className="job-cards">

              {filteredJobs.map((job, index) => {

                const isApplied = appliedJobs.includes(Number(job.Job_id));

                return (
                  <div key={job.Job_id} className="job-card">

                    {/* LEFT SIDE */}
                    <div className="job-card-left">
                      <img
                        src={images[index % images.length]}
                        alt="company"
                      />

                      <div>
                        {/* ✅ CLICK ONLY TITLE */}
                        <h4
                          onClick={() => navigate(`/jobdetails/${job.Job_id}`)}
                          style={{
                            cursor: "pointer",
                            color: "#007bff"
                          }}
                        >
                          {job.Job_title}
                        </h4>

                        <p>
                          {job.Jobcat_name} | {job.location} | {job.jobtype} | {job.end_date ? new Date(job.end_date).toLocaleDateString('en-GB') : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>
                      {isApplied ? (
                        <button className="btn-applied" disabled>
                          Applied ✅
                        </button>
                      ) : (
                        <button
                          className="btn-apply"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyJob(job);
                          }}
                        >
                          Apply Now
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

          ) : (
            <p>No Jobs Found ❌</p>
          )}

        </div>

      </div>
    </div>
  );
}

export default Browsejob;