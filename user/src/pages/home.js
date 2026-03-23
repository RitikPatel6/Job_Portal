import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "./home.css";


function Home() {
 const fileInputRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const user_id = 1; // same as Browsejob
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  

useEffect(() => {
  Axios.get("http://localhost:1337/api/getemployers")
    .then((res) => setCompanies(res.data))
    .catch((err) => console.log(err));
}, []);
  
  

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs(); // ✅ NEW
  fetchCategories(); // ✅ NEW
  }, []);
  const fetchCategories = () => {
  Axios.get("http://localhost:1337/api/categories")
    .then((res) => {
      setCategories(res.data || []);
    })
    .catch((err) => console.log(err));
};

  // ================= FETCH JOBS =================
  const fetchJobs = () => {
    setLoading(true);
    Axios.get("http://localhost:1337/api/joblist")
      .then((res) => {
        setJobs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // ================= FETCH APPLIED JOBS =================
  const fetchAppliedJobs = () => {
    Axios.get(`http://localhost:1337/api/applied/${user_id}`)
      .then((res) => {
        const ids = res.data.map(
          (job) => job.Job_id || job.job_id
        );
        setAppliedJobs(ids);
      })
      .catch((err) => console.log(err));
  };

  // ================= APPLY JOB =================
  const applyJob = (job) => {
    Axios.post("http://localhost:1337/api/apply", {
      job_id: job.Job_id,
      user_id: user_id,
      company_id: job.Company_id || 1
    })
      .then((res) => {

        if (res.data.success) {
          alert("Applied Successfully ✅");

          // ✅ UPDATE UI instantly
          setAppliedJobs((prev) => [...prev, job.Job_id]);
        } else {
          alert("Already Applied ❌");
        }

      })
      .catch((err) => {
        console.log(err);
        alert("Error ❌");
      });
  };

  // ================= FILE UPLOAD =================
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert("Selected file: " + file.name);
    }
  };

// Images array
const images = [
  "/img/svg_icon/1.svg",
  "/img/svg_icon/2.svg",
  "/img/svg_icon/3.svg",
  "/img/svg_icon/4.svg"
];
  const candidates = [
    { id: 1, name: "Markary Jondon", job: "Software Engineer", img: "/img/candiateds/1.png" },
    { id: 2, name: "John Smith", job: "UI/UX Designer", img: "/img/candiateds/2.png" },
    { id: 3, name: "Emily Watson", job: "Web Developer", img: "/img/candiateds/3.png" },
    { id: 4, name: "David Miller", job: "Data Analyst", img: "/img/candiateds/4.png" }
  ];

  return (
    <>
    {/* ✅ Hidden File Input */}
      <input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  accept=".pdf,.doc,.docx"
  onChange={handleFileChange}
/>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">

          <div className="hero-text">
            <h5>4500+ Jobs Available</h5>
            <h1>Find Your Dream Job Today</h1>

            <p>
              Discover thousands of job opportunities with all the information
              you need. It's your future.
            </p>

            <div className="hero-buttons">
             <Link to="/uploadresume">
              <button className="Btn-Primary">Upload Resume</button>
             </Link>

             <Link to="/browsejob">
             <button className="btn-secondary">Browse Jobs</button>
             </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src="/img/banner/illustration.png" alt="banner" />
          </div>

        </div>
      </section>

      {/* JOB SEARCH */}
      <section className="job-search-section">
        <div className="container job-search-container">

          <input type="text" placeholder="Job title or keyword" />

          <select>
            <option>Location</option>
            <option>Ahmedabad</option>
            <option>Vadodara</option>
            <option>Surat</option>
          </select>

          <select>
            <option>Category</option>
            <option>Design</option>
            <option>Development</option>
            <option>Marketing</option>
          </select>

          <button className="btn-search">Find Job</button>

        </div>
      </section>

      {/* POPULAR CATEGORIES */}
     <section className="categories-section">
  <div className="container">

    <h2 className="section-title">Popular Categories</h2>

    <div className="categories-grid">

      {categories.length > 0 ? (
        categories.map((cat, index) => {

          const icons = ["🎨","📈","💻","⚙️","📊","🛒","📞","🏥"];

          return (
            <div className="category-card" key={cat.Jobcat_id}>

              <div className="icon">
                {icons[index % icons.length]}
              </div>

              <h4>{cat.Jobcat_name}</h4>

              <p>{cat.total_jobs} Jobs Available</p>

            </div>
          );
        })
      ) : (
        <p>No Categories Found</p>
      )}

    </div>

  </div>
</section>
     {/* JOB LIST */}
      <section className="featured-jobs-section">
        <div className="container">

          <h2 className="section-title">Jobs Listing</h2>

          {loading ? (
            <p>Loading jobs...</p>

          ) : jobs.length > 0 ? (

            jobs.slice(0, 4).map((job, index) => (

              <div className="job-card" key={job.Job_id}>

                <div className="job-left">

                  <img src={images[index % images.length]} alt="logo" />

                  <div>
                    <h4>{job.Job_title}</h4>

                    <p>
                      {job.company_name} • {job.location} • {job.jobtype}
                    </p>

                    <p>₹{job.salary}</p>
                    <p>Skills :{job.skill}</p>
                    <p>Description:{job.description}</p>
                  </div>

                </div>

                {/* ✅ FIXED BUTTON */}
                {appliedJobs.includes(job.Job_id) ? (
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

            ))

          ) : (
            <p>No Jobs Available</p>
          )}

          {/* VIEW ALL */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/browsejob">
              <button className="Bttn-Secondary">View All Jobs</button>
            </Link>
          </div>

        </div>
      </section>
{/* TOP COMPANIES */}
        <section className="companies-section">
  <div className="container">

    <div className="companies-header">
      <h2 className="Section-title">Top Companies</h2>

      {/* ✅ React Router use karo instead of <a> */}
      <Link to="/browsejob" className="browse-btn">
        Browse More Jobs
      </Link>
    </div>

    <div className="companies-grid">

      {companies.length > 0 ? (
        companies.slice(0, 4).map((company, index) => {

          const icons = [
            "/img/svg_icon/1.svg",
            "/img/svg_icon/2.svg",
            "/img/svg_icon/3.svg",
            "/img/svg_icon/4.svg",
            "/img/svg_icon/5.svg",
          ];

          return (
            <div className="company-card" key={company.Company_id}>

              {/* ✅ Dynamic Image OR fallback icon */}
              <img
                src={company.logo || icons[index % icons.length]}
                alt="company"
              />

              <h4>{company.Company_name}</h4>

              <p>
                <span>{company.openings || 0}</span> Available positions
              </p>

            </div>
          );
        })
      ) : (
        <p>No Companies Found</p>
      )}

    </div>

  </div>
</section>

      {/* TOP CANDIDATES */}
     <section className="candidate-section">
  <div className="container">

    <div className="section-header">
      <h2 className="section-title">Top Candidates</h2>
      <p className="section-subtitle">
        Discover skilled professionals ready to work
      </p>
    </div>

    <div className="candidate-grid">

      {candidates.length > 0 ? (
        candidates.map((item) => (
          <div className="candidate-card" key={item.id}>

            {/* Image */}
            <div className="candidate-img">
              <img
                src={item.img}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/candidates/default.png";
                }}
              />
            </div>

            {/* Info */}
            <div className="candidate-info">
              <h4>{item.name}</h4>
              <p>{item.job}</p>

              <button className="btn-view">
                View Profile
              </button>
            </div>

          </div>
        ))
      ) : (
        <p className="no-data">No Candidates Found</p>
      )}

    </div>

  </div>
</section>

      {/* TESTIMONIAL AREA */}
<section className="testimonial_area">
  <div className="container">

    <div className="section_title text-center">
      <h3>Testimonial</h3>
    </div>

    <div className="testimonial_grid">

      <div className="single_testimonial">
        <div className="testimonial_content">

          <div className="thumb">
            <img src="/img/testmonial/author.png" alt="author" />
          </div>

          <div className="info">
            <p>
              "Working in conjunction with humanitarian aid agencies, we have
              supported programmes to help alleviate human suffering through
              animal welfare when people might depend on livestock as their
              only source of income or food."
            </p>
            <span>- Micky Mouse</span>
          </div>

        </div>
      </div>

      <div className="single_testimonial">
        <div className="testimonial_content">

          <div className="thumb">
            <img src="/img/testmonial/author.png" alt="author" />
          </div>

          <div className="info">
            <p>
              "Working in conjunction with humanitarian aid agencies, we have
              supported programmes to help alleviate human suffering through
              animal welfare when people might depend on livestock as their
              only source of income or food."
            </p>
            <span>- Micky Mouse</span>
          </div>

        </div>
      </div>

      <div className="single_testimonial">
        <div className="testimonial_content">

          <div className="thumb">
            <img src="/img/testmonial/author.png" alt="author" />
          </div>

          <div className="info">
            <p>
              "Working in conjunction with humanitarian aid agencies, we have
              supported programmes to help alleviate human suffering through
              animal welfare when people might depend on livestock as their
              only source of income or food."
            </p>
            <span>- Micky Mouse</span>
          </div>

        </div>
      </div>

    </div>

  </div>
</section>


    </>
  );
}

export default Home;