import React from "react";
import { Link } from "react-router-dom";
import "./home.css";


function Home() {

  const candidates = [
    { id: 1, name: "Markary Jondon", job: "Software Engineer", img: "/img/candiateds/1.png" },
    { id: 2, name: "John Smith", job: "UI/UX Designer", img: "/img/candiateds/2.png" },
    { id: 3, name: "Emily Watson", job: "Web Developer", img: "/img/candiateds/3.png" },
    { id: 4, name: "David Miller", job: "Data Analyst", img: "/img/candiateds/4.png" }
  ];

  return (
    <>

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
              <button className="btn-primary">Upload Resume</button>
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

            <div className="category-card">
              <h4>Design & Creative</h4>
              <p>120 Jobs Available</p>
            </div>

            <div className="category-card">
              <h4>Marketing</h4>
              <p>85 Jobs Available</p>
            </div>

            <div className="category-card">
              <h4>Software Development</h4>
              <p>200 Jobs Available</p>
            </div>

            <div className="category-card">
              <h4>Engineering</h4>
              <p>95 Jobs Available</p>
            </div>

          </div>

        </div>
      </section>

      {/* JOB LIST */}
      <section className="featured-jobs-section">
        <div className="container">

          <h2 className="section-title">Jobs Listing</h2>

          <div className="job-card">
            <div className="job-left">
              <img src="/img/svg_icon/1.svg" alt="" />
              <div>
                <h4>Software Engineer</h4>
                <p>Tech Corp  • California • Part-Time</p>
              </div>
            </div>

            <button className="btn-apply">Apply Now</button>
          </div>

          <div className="job-card">
            <div className="job-left">
              <img src="/img/svg_icon/2.svg" alt="" />
              <div>
                <h4>Digital Marketer</h4>
                <p>Marketing Ltd  •  New York • Full Time</p>
              </div>
            </div>

            <button className="btn-apply">Apply Now</button>
          </div>
           <div className="job-card">
            <div className="job-left">
              <img src="/img/svg_icon/3.svg" alt="" />
              <div>
                <h4>Wordpress Developer</h4>
                <p>Web Studio • Texas •Part-time</p>
              </div>
            </div>

            <button className="btn-apply">Apply Now</button>
          </div>
           <div className="job-card">
            <div className="job-left">
              <img src="/img/svg_icon/4.svg" alt="" />
              <div>
                <h4>Visual Designer</h4>
                <p>Creative Agency •  Los Angeles• Full Time</p>
              </div>
            </div>

            <button className="btn-apply">Apply Now</button>
          </div>

        </div>
      </section>
{/* TOP COMPANIES */}
        <section className="companies-section">
        <div className="container">

            <div className="companies-header">
            <h2 className="Section-title">Top Companies</h2>
            <a href="jobs.html" className="browse-btn">Browse More Jobs</a>
            </div>

            <div className="companies-grid">

            <div className="company-card">
                <img src="/img/svg_icon/5.svg" alt="" />
                <h4>Snack Studio</h4>
                <p><span>50</span> Available positions</p>
            </div>

            <div className="company-card">
                <img src="/img/svg_icon/4.svg" alt="" />
                <h4>Snack Studio</h4>
                <p><span>50</span> Available positions</p>
            </div>

            <div className="company-card">
                <img src="/img/svg_icon/3.svg" alt="" />
                <h4>Snack Studio</h4>
                <p><span>50</span> Available positions</p>
            </div>

            <div className="company-card">
                <img src="/img/svg_icon/1.svg" alt="" />
                <h4>Snack Studio</h4>
                <p><span>50</span> Available positions</p>
            </div>

            </div>

        </div>
        </section>

      {/* TOP CANDIDATES */}
      <section className="candidate-section">
        <div className="container">

          <h2 className="section-title">Top Candidates</h2>

          <div className="candidate-grid">

            {candidates.map((item) => (
              <div className="candidate-card" key={item.id}>

                <img src={item.img} alt={item.name} />

                <h4>{item.name}</h4>

                <p>{item.job}</p>

              </div>
            ))}

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

      {/* CALL TO ACTION */}
      <section className="cta-section">

        <div className="container cta-box">

          <h2>Looking for a Job?</h2>

          <p>Upload your resume and start applying today.</p>

          <button className="btn-primary">
            Upload Resume
          </button>

        </div>

      </section>

    </>
  );
}

export default Home;