import React, { useState } from "react";
import "./candidates.css";
import { useNavigate } from "react-router-dom";

function Candidates() {

  const navigate = useNavigate();

  const candidatesData = [
    { id: 1, name: "Markary Jondon", job: "Software Engineer", img: "/img/candiateds/1.png", skills: "React, Node.js", exp: "3 Years", email: "markary@gmail.com", location: "USA" },
    { id: 2, name: "John Smith", job: "UI/UX Designer", img: "/img/candiateds/2.png", skills: "Figma, Adobe XD", exp: "2 Years", email: "john@gmail.com", location: "UK" },
    { id: 3, name: "Emily Watson", job: "Web Developer", img: "/img/candiateds/3.png", skills: "HTML, CSS, JS", exp: "4 Years", email: "emily@gmail.com", location: "Canada" },
    { id: 4, name: "David Miller", job: "Data Analyst", img: "/img/candiateds/4.png", skills: "Python, SQL", exp: "3 Years", email: "david@gmail.com", location: "Germany" },
    { id: 5, name: "Sophia Lee", job: "Frontend Developer", img: "/img/candiateds/5.png", skills: "React, Tailwind", exp: "2 Years", email: "sophia@gmail.com", location: "India" },
    { id: 6, name: "James Brown", job: "Backend Developer", img: "/img/candiateds/6.png", skills: "Node, Express", exp: "5 Years", email: "james@gmail.com", location: "USA" },
    { id: 7, name: "Olivia Taylor", job: "Product Manager", img: "/img/candiateds/7.png", skills: "Agile, Scrum", exp: "6 Years", email: "olivia@gmail.com", location: "Australia" },
    { id: 8, name: "Michael Scott", job: "Software Engineer", img: "/img/candiateds/8.png", skills: "Java, Spring", exp: "4 Years", email: "michael@gmail.com", location: "USA" }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 4;

  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentCandidates = candidatesData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(candidatesData.length / candidatesPerPage);

  return (
    <div className="candidates-page">

      <section className="candidates-banner">
        <h1>Top Candidates</h1>
      </section>

      <section className="candidates-container container">

        <div className="candidates-grid">
          {currentCandidates.map((candidate) => (
            <div className="candidate-card" key={candidate.id}>

              <div className="candidate-thumb">
                <img src={candidate.img} alt={candidate.name} />
              </div>

              <h4>{candidate.name}</h4>
              <p>{candidate.job}</p>

              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/candidate/${candidate.id}`, {
                    state: candidate // ✅ full object passed
                  })
                }
              >
                View Profile
              </button>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            «
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            »
          </button>
        </div>

      </section>
    </div>
  );
}

export default Candidates;