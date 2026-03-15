import React from "react";
import "./jobdetails.css";

function Jobdetails() {
  return (
    <div className="job-details-page">

      {/* Banner */}
      <section className="job-banner">
        <h1>Software Engineer</h1>
      </section>

      {/* Main Content */}
      <section className="job-details-container container">
        <div className="job-layout">

          {/* LEFT SIDE */}
          <div className="job-left">

            {/* Job Header */}
            <div className="job-header-card">
              <div className="job-header-left">
                <div className="job-thumb">
                  <img src="/img/svg_icon/1.svg" alt="job icon" />
                </div>
                <div className="job-info">
                  <h2>Software Engineer</h2>
                  <p>📍 California, USA • ⏰ Part-time</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="job-description">
              <div className="job-section">
                <h3>Job Description</h3>
                <p>
                  There are many variations of passages of Lorem Ipsum available,
                  but the majority have suffered alteration in some form.
                </p>
              </div>

              <div className="job-section">
                <h3>Responsibilities</h3>
                <ul>
                  <li>Experience in the relevant field.</li>
                  <li>Strong analytical thinking.</li>
                  <li>Good communication skills.</li>
                  <li>Problem solving ability.</li>
                </ul>
              </div>

              <div className="job-section">
                <h3>Qualifications</h3>
                <ul>
                  <li>Bachelor Degree in Computer Science</li>
                  <li>2+ years experience</li>
                  <li>Team collaboration skills</li>
                </ul>
              </div>
            </div>

            {/* Apply Form */}
            <div className="apply-job">
              <h3>Apply for the Job</h3>
              <form className="apply-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Email Address" />
                <input type="text" placeholder="Portfolio Link" />
                <input type="file" />
                <textarea rows="5" placeholder="Cover Letter"></textarea>
                <button className="apply-btn">Apply Now</button>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="job-right">
            <div className="job-summary-card">
              <h3>Job Summary</h3>
              <ul>
                <li>Published on: <span>12 Nov 2019</span></li>
                <li>Vacancy: <span>2 Positions</span></li>
                <li>Salary: <span>50k - 120k / year</span></li>
                <li>Location: <span>California, USA</span></li>
                <li>Job Nature: <span>Full Time</span></li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Jobdetails;