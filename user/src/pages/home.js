import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./home.css";

function Home() {

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const[showAll,setShowAll] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

useEffect(() => {
  fetchCompanies();
  fetchCandidates();
}, []);

  const [filters, setFilters] = useState({
    keyword: "",
    Company_id: "",
    location: ""
  });

  // ================= GET USER =================
  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const user = JSON.parse(data);
      setUserId(user.id);
    }
  }, []);

  // ================= FETCH FILTER DATA =================
  useEffect(() => {
    fetchCompanies();
    fetchLocations();
    fetchCategories();
  }, []);

  const fetchCompanies = async () => {
  try {
    const res = await Axios.get("http://localhost:1337/api/companies");

    //  Handle all possible API formats
    const data = res.data.data || res.data || [];

    //  Ensure always array
    setCompanies(Array.isArray(data) ? data : []);

  } catch (err) {
    console.log("Company Fetch Error:", err);

    //  fallback to empty
    setCompanies([]);
  }
};
  const fetchLocations = async () => {
    try {
      const res = await Axios.get("http://localhost:1337/api/locations");
      const data = res.data.data || res.data || [];
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await Axios.get("http://localhost:1337/api/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH JOBS =================
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:1337/api/joblist");
      let data = res.data.data || res.data || [];
      if (!Array.isArray(data)) data = [];

      const today = new Date();
      const activeJobs = data.filter(job => {
        if (!job.end_date) return true;
        const endDate = new Date(job.end_date);
        endDate.setHours(23, 59, 59, 999);
        return today <= endDate;
      });

      setJobs(activeJobs);
    } catch (err) {
      console.log("Job Error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH APPLIED JOBS =================
  useEffect(() => {
    if (userId) {
      fetchAppliedJobs();
      fetchRecommendedJobs();
    }
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
      console.log("Applied Jobs Error:", err);
    }
  };

  const fetchRecommendedJobs = async () => {
    if (!userId) return;
    try {
      console.log("Fetching recommended jobs for User ID:", userId);
      const res = await Axios.get(`http://localhost:1337/api/recommended-jobs/${userId}`);
      console.log("Recommended Jobs Result:", res.data);
      if (res.data.success) {
        setRecommendedJobs(res.data.data);
      }
    } catch (err) {
      console.log("Recommended Jobs Error:", err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await Axios.get("http://localhost:1337/api/jobseekers?isTop=true");
      if (res.data.status === "success") {
        // Filter active candidates
        const activeCandidates = res.data.data.filter(c => c.status === 1);
        setCandidates(activeCandidates);
      }
    } catch (err) {
      console.log("Candidate Fetch Error:", err);
    }
  };

  // ================= HANDLE FILTER =================
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // ================= SEARCH =================
  const searchJobs = () => {
    navigate('/browsejob', { state: { searchFilters: filters } });
  };

  // ================= APPLY JOB =================
  const applyJob = async (job) => {

    if (!userId) {
      alert("Please login first ");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await Axios.post(
        "http://localhost:1337/api/apply",
        {
          Job_id: job.Job_id,
          User_id: userId,
          Company_id: job.Company_id
        }
      );

      if (res.data.success) {
        alert("Applied Successfully ");
        setAppliedJobs((prev) => [...prev, Number(job.Job_id)]);
      } else {
        alert(res.data.message || "Already Applied ");
      }

    } catch (err) {
      console.log("Apply Error:", err);
      alert("Error ");
    }
  };

  // ================= FILE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert("Selected file: " + file.name);
    }
  };

  // ================= PLACEHOLDER IMAGES & CANDIDATES =================
  const images = ["/img/svg_icon/1.svg","/img/svg_icon/2.svg","/img/svg_icon/3.svg","/img/svg_icon/4.svg"];
  
  // Static fallback if no candidates yet (optional, but good for design)
  const defaultCandidates = [
    { id: 1, Name: "Markary Jondon", Post: "Software Engineer", Upload_photo: null },
    { id: 2, Name: "John Smith", Post: "UI/UX Designer", Upload_photo: null },
    { id: 3, Name: "Emily Watson", Post: "Web Developer", Upload_photo: null },
    { id: 4, Name: "David Miller", Post: "Data Analyst", Upload_photo: null }
  ];

  const displayCandidates = candidates;

  const testimonials = [
    {
      text: "Working in conjunction with humanitarian aid agencies, we have supported programmes to help alleviate human suffering through animal welfare when people might depend on livestock as their only source of income or food.",
      author: "Micky Mouse"
    },
    {
      text: "Animal welfare programs not only help livestock but also strengthen the local economy and improve community health.",
      author: "Donald Duck"
    },
    {
      text: "By supporting communities in need, we create a sustainable environment for both humans and animals.",
      author: "Goofy"
    }
  ];
  const displayedCategories = showAll ? categories : categories.slice(0, 4);
  const activeCompanies = companies.filter(company => jobs.some(job => Number(job.Company_id) === Number(company.Company_id)));

  return (
    <>
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".pdf,.doc,.docx" onChange={handleFileChange} />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text">
            <h5>4500+ Jobs Available</h5>
            <h1>Find Your Dream Job Today</h1>
            <p>Discover thousands of job opportunities with all the information you need. It's your future.</p>
            <div className="hero-buttons">
              {/* <Link to="/uploadresume"><button className="Btn-Primary">Upload Resume</button></Link> */}
              <Link to="/browsejob"><button className="BTN-Secondary">Browse Jobs</button></Link>
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
          <input type="text" name="keyword" placeholder="Job title or keyword" onChange={handleChange} />

          {/* Company Dynamic */}
          <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.Jobcat_id} value={cat.Jobcat_id}>
              {cat.Jobcat_name}
            </option>
          ))}
        </select>

          {/* Location Dynamic */}
          <select name="location" value={filters.location} onChange={handleChange}>
            <option value="">Location</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.location}</option>
            ))}
          </select>

          <button className="btn-search" onClick={searchJobs}>Find Job</button>
        </div>
      </section>
 {/* JOB LIST */}
    <section className="featured-jobs-section">
  <div className="container">

    <h2 className="latest">Latest Jobs</h2>

    {loading ? (
      <p>Loading...</p>
    ) : jobs.length > 0 ? (

      jobs.slice(0, 4).map((job, index) => {

        const isApplied = appliedJobs.includes(Number(job.Job_id));

        return (
          <div className="job-card" key={job.Job_id}>

            <div className="job-left">
              <img src={images[index % images.length]} alt="logo" />
               <div> <h4
                          onClick={() => navigate('/browsejob', { state: { singleJobId: job.Job_id } })}
                          style={{
                            cursor: "pointer",
                            color: "#007bff"
                          }}
                        >
                          {job.Job_title}
                        </h4><p>{job.Jobcat_name} | {job.location} | {job.jobtype} | {job.end_date ? new Date(job.end_date).toLocaleDateString('en-GB') : "N/A"}</p></div>
            </div>

            {isApplied ? (
              <button className="btn-applied" disabled>
                Applied 
              </button>
            ) : (
              <button
                className="btn-apply"
                onClick={() => navigate('/browsejob', { state: { singleJobId: job.Job_id } })}
              >
                Apply Now
              </button>
            )}

          </div>
        );
      })

    ) : (
      <p>No Jobs Found</p>
    )}

  </div>
</section>
{/* ✅ MOVE OUTSIDE MAP */}
   <div className="About-CTA">
  <Link to="/browsejob">
    <button className="BTN-Secondary">Browse Jobs</button>
  </Link>
</div>

  {/* ⭐ RECOMMENDED JOBS */}
  {userId && (
    <section className="featured-jobs-section">
      <div className="container">
        <h2 className="latest">⭐ Recommended Jobs</h2>
        {recommendedJobs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No matching jobs found at the moment based on your skills.</p>
        ) : (
          recommendedJobs.slice(0, 5).map((job, index) => {
            const isApplied = appliedJobs.includes(Number(job.Job_id));
            return (
              <div className="job-card" key={job.Job_id}>
                <div className="job-left">
                  <img src={images[index % images.length]} alt="logo" />
                  <div>
                    <h4
                      onClick={() => navigate('/browsejob', { state: { singleJobId: job.Job_id } })}
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {job.Job_title}  
                    </h4>
                    <p>
                      {job.Jobcat_name} | {job.location} | {job.jobtype} |{" "}
                      {job.end_date
                        ? new Date(job.end_date).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {isApplied ? (
                  <button className="btn-applied" disabled>
                    Applied 
                  </button>
                ) : (
                  <button
                    className="btn-apply"
                    onClick={() => navigate('/browsejob', { state: { singleJobId: job.Job_id } })}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  )}
      {/* POPULAR CATEGORIES */}
      <section className="categories-section">
        <div className="container">
          <h2 className="Section-Title">Popular Categories</h2>
          <div className="categories-grid">
           {displayedCategories.length > 0 ? displayedCategories.map((cat, index) => {
              const icons = ["💻","📈","🎨","⚙️","📊","🛒","📞","🏥"];
              return (
                <div 
                  className="category-card" 
                  key={cat.Jobcat_id}
                  onClick={() => navigate('/browsejob', { state: { categoryId: cat.Jobcat_id } })}
                  style={{ cursor: "pointer" }}
                >
                  <div className="icon">{icons[index % icons.length]}</div>
                  <h4>{cat.Jobcat_name}</h4>
                  <p>{cat.total_jobs} Jobs Available</p>
                </div>
              );
            }) : <p>No Categories Found</p>}
          </div>
          <div className="view-btn-container">
        {!showAll ? (
          <span className="View-btn" onClick={() => setShowAll(true)}>
            View All →
          </span>
        ) : (
          <span className="View-btn" onClick={() => setShowAll(false)}>
            Show Less →
          </span>
        )}
       </div>
        </div>
      </section>

      {/* TOP COMPANIES */}
<section className="companies-section">
  <div className="container">

    <div className="companies-header">
      <h2 className="Section-title">Top Companies</h2>
    </div>

    <div className="companies-grid">
      {activeCompanies.length > 0 ? (
        activeCompanies.slice(0, 4).map((company, index) => {

          const icons = [
            "/img/svg_icon/1.svg",
            "/img/svg_icon/2.svg",
            "/img/svg_icon/3.svg",
            "/img/svg_icon/4.svg"
          ];

          return (
            <div 
              className="company-card" 
              key={company.Company_id}
              onClick={() => navigate('/browsejob', { state: { companyId: company.Company_id } })}
              style={{ cursor: "pointer" }}
            >

              <img
                src={company.logo || icons[index % icons.length]}
                alt={company.Company_name}
              />

              {/*  THIS IS YOUR DYNAMIC NAME */}
              <h4>{company.Company_name}</h4>

              {/* OPTIONAL */}
              <p>{company.location}</p>

            </div>
          );
        })
      ) : (
        <p>No Companies Found</p>
      )}
    </div>

  </div>
</section>

{/* candidate */}
{displayCandidates.length > 0 && (
      <section className="candidate-section">
        <div className="container">
          <div className="section-header">
            <h2 className="Section-Title">Top Candidates</h2>
            <p className="section-subtitle">Discover skilled professionals ready to work</p>
          </div>
          <div className="candidate-grid">
            {displayCandidates.slice(0, 4).map((item, index) => (
              <div className="candidate-card" key={item.id}>
                <div className="candidate-badge">Available</div>
                <div className="candidate-img">
                  <img 
                    src={item.Upload_photo ? `http://localhost:1337/uploads/${item.Upload_photo}` : `/img/candiateds/${(index % 4) + 1}.png`} 
                    alt={item.Name} 
                    onError={e => { e.target.onerror=null; e.target.src="/img/candiateds/1.png";}} 
                  />
                </div>
                <div className="candidate-info">
                  <h4>{item.Name}</h4>
                  <p className="candidate-post">{item.Post || "Job Seeker"}</p>
                  <div className="candidate-skills">
                    {(item.Skills || "React, Node, JS").split(",").slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} className="skill-badge">{skill.trim()}</span>
                    ))}
                  </div>
                  <button className="btn-view" onClick={() => navigate(`/candidate/${item.id}`, { state: item })}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* TESTIMONIAL AREA */}
      {/* <section className="testimonial_area">
        <div className="container">
          <div className="section_title text-center"><h3>Testimonials</h3></div>
          <div className="testimonial_grid">
            {testimonials.map((item,index) => (
              <div className="single_testimonial" key={index}>
                <div className="testimonial_content">
                  <div className="thumb"><img src="/img/testmonial/author.png" alt="author"/></div>
                  <div className="info">
                    <p>{item.text}</p>
                    <span>- {item.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

    </>
  );
}

export default Home;