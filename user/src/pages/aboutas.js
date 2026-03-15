import React from "react";
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
      img:"/img/candiateds/1.png"
    },
    {
      id:2,
      name:"John Smith",
      role:"UI Designer",
      img:"img/candiateds/2.png"
    },
    {
      id:3,
      name:"Sara Johnson",
      role:"Marketing Head",
      img:"img/candiateds/3.png"
    }
  ];

  return (
    <div className="about-page">

      {/* Banner */}
      <section className="about-banner">
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

      </div>
    </div>
  );
}

export default Aboutas;