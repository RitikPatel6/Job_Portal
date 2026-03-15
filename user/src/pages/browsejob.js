import React from "react";
import "./browsejob.css";

function Browsejob() {

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "California",
      type: "Part-time",
      logo: "/img/svg_icon/1.svg"
    },
    {
      id: 2,
      title: "Digital Marketer",
      company: "Marketing Ltd",
      location: "New York",
      type: "Full-time",
      logo: "/img/svg_icon/2.svg"
    },
    {
      id: 3,
      title: "Wordpress Developer",
      company: "Web Studio",
      location: "Texas",
      type: "Part-time",
      logo: "/img/svg_icon/3.svg"
    },
    {
      id: 4,
      title: "Visual Designer",
      company: "Creative Agency",
      location: "Los Angeles",
      type: "Full-time",
      logo: "/img/svg_icon/4.svg"
    }
  ];

  return (
    <div className="browsejob-page">

      {/* Banner */}
      <section className="browsejob-banner">
        <h1>4536+ Jobs Available</h1>
      </section>

      <div className="container browsejob-container">

        {/* Sidebar Filter */}
        <aside className="filter-sidebar">
          <h3>Filter Jobs</h3>

          <input type="text" placeholder="Search keyword" />

          <select>
            <option>Location</option>
            <option>India</option>
            <option>USA</option>
          </select>

          <select>
            <option>Category</option>
            <option>IT</option>
            <option>Marketing</option>
          </select>

          <select>
            <option>Experience</option>
            <option>Fresher</option>
            <option>1-3 Years</option>
          </select>

          <select>
            <option>Job Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
          </select>

          <button className="btn-reset">Reset</button>
        </aside>

        {/* Job Listing */}
        <section className="job-listing">
          <div className="job-listing-header">
            <h2>Job Listings</h2>
            <select>
              <option>Most Recent</option>
            </select>
          </div>

          <div className="job-cards">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-left">
                  <img src={job.logo} alt={job.company} />
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <p>{job.company} • {job.location} • {job.type}</p>
                  </div>
                </div>
                <button className="btn-apply">Apply Now</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Browsejob;