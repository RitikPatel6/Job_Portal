import React from "react";
import "./candidates.css";

function Candidates() {
  const candidates = [
    { id: 1, name: "Markary Jondon", job: "Software Engineer", img: "/img/candiateds/1.png" },
    { id: 2, name: "John Smith", job: "UI/UX Designer", img: "/img/candiateds/2.png" },
    { id: 3, name: "Emily Watson", job: "Web Developer", img: "/img/candiateds/3.png" },
    { id: 4, name: "David Miller", job: "Data Analyst", img: "/img/candiateds/4.png" },
    { id: 5, name: "Sophia Lee", job: "Frontend Developer", img: "/img/candiateds/5.png" },
    { id: 6, name: "James Brown", job: "Backend Developer", img: "/img/candiateds/6.png" },
    { id: 7, name: "Olivia Taylor", job: "Product Manager", img: "/img/candiateds/7.png" },
    { id: 8, name: "Michael Scott", job: "Software Engineer", img: "/img/candiateds/8.png" }
  ];

  return (
    <div className="candidates-page">

      {/* Banner */}
      <section className="candidates-banner">
        <h1>Candidates</h1>
      </section>

      {/* Candidates Grid */}
      <section className="candidates-container container">
        <div className="candidates-grid">
          {candidates.map(candidate => (
            <div className="candidate-card" key={candidate.id}>
              <div className="candidate-thumb">
                <img src={candidate.img} alt={candidate.name} />
              </div>
              <h4>{candidate.name}</h4>
              <p>{candidate.job}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <ul>
            <li><a href="#">«</a></li>
            <li><a href="#">01</a></li>
            <li><a href="#">02</a></li>
            <li><a href="#">»</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Candidates;