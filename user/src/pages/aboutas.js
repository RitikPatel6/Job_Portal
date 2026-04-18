import React from "react";
import { Link } from "react-router-dom";
import "./aboutas.css";

function Aboutas() {

  const features = [
    {
      id:1,
      title:"Search Jobs",
      desc:"Find thousands of job opportunities from top companies worldwide."
    },
    {
      id:2,
      title:"Apply Easily",
      desc:"Apply to jobs quickly with our easy and simple application process."
    },
    {
      id:3,
      title:"Top Companies",
      desc:"Connect with leading companies looking for talented professionals."
    },
    {
      id:4,
      title:"Career Growth",
      desc:"Build your career with better opportunities and professional growth."
    }
  ];

  const team = [
    {
      id:1,
      name:"Ritik Patel",
      role:"Project Developer",
      img:"/img/candiateds/12.png"
    },
    {
      id:2,
      name:"Kunjal Patel",
      role:"UI Designer",
      img:"/img/candiateds/11.png"
    },
    {
      id:3,
      name:"Raj Patel",
      role:"Marketing Head",
      img:"/img/candiateds/3.png"
    }
  ];

  return (
    <div className="about-page">

      {/* Banner */}
      <section className="About-Banner">
        <h1>About Our Job Portal</h1>
        <p>Connecting talent with opportunity</p>
      </section>

      <div className="container about-container">

        {/* About Intro */}
        <section className="about-intro">
          <h2>Who We Are</h2>
          <p>
            Our Job Portal platform helps job seekers find their dream jobs and
            companies discover talented professionals. We aim to simplify the
            recruitment process and connect employers with skilled candidates.
          </p>

          <p>
            With thousands of jobs available across multiple industries,
            our platform provides a seamless experience for both recruiters
            and job seekers.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="about-mission">
          <div className="mission-box">
            <h3>🎯 Our Mission</h3>
            <p>
              To empower job seekers by providing access to the best career
              opportunities and helping companies hire the right talent quickly.
            </p>
          </div>

          <div className="vision-box">
            <h3>🚀 Our Vision</h3>
            <p>
              To become the leading job portal platform that bridges the gap
              between talent and opportunity across the globe.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h2>8+</h2>
              <p>Jobs Available</p>
            </div>

            <div className="stat-card">
              <h2>2+</h2>
              <p>Companies</p>
            </div>

            <div className="stat-card">
              <h2>3+</h2>
              <p>Job Seekers</p>
            </div>

            <div className="stat-card">
              <h2>95%</h2>
              <p>Success Rate</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="about-features">
          <h2>Our Features</h2>

          <div className="feature-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.id}>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="about-why">
          <h2>Why Choose Us</h2>

          <ul className="why-list">
            <li>✔ Easy and fast job search</li>
            <li>✔ Trusted by top companies</li>
            <li>✔ Secure and reliable platform</li>
            <li>✔ Free resume upload</li>
            <li>✔ 24/7 support</li>
          </ul>
        </section>

        {/* Team */}
        <section className="about-team">
          <h2>Our Team</h2>

          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.id}>
                <img src={member.img} alt={member.name} />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Start Your Career Journey Today 🚀</h2>
          <p>Join thousands of job seekers and find your dream job now.</p>
            <Link to="/browsejob">
             <button className="btn-secondary">Browse Jobs</button>
             </Link>
        </section>

      </div>

      {/* Footer Note */}
      <footer className="about-footer">
        <p>© 2026 Job Portal. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Aboutas;