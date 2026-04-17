import React, { useState, useEffect } from "react";
import "./candidates.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Candidates() {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:1337/api/jobseekers");
      if (res.data.status === "success") {
        // Filter active candidates
        const activeCandidates = res.data.data.filter(c => c.status === 1);
        setCandidates(activeCandidates);
      }
    } catch (err) {
      console.log("Candidate Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 8; // Increased for better view on full page

  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  return (
    <div className="candidates-page">

      <section className="candidates-banner">
        <h1>Top Candidates</h1>
      </section>

      <section className="candidates-container container">

        <div className="candidates-grid">
          {loading ? (
            <p>Loading candidates...</p>
          ) : currentCandidates.length > 0 ? (
            currentCandidates.map((candidate, index) => (
              <div className="candidate-card" key={candidate.id}>
                <div className="candidate-badge">Available</div>
                <div className="candidate-thumb">
                  <img 
                    src={candidate.Upload_photo ? `http://localhost:1337/uploads/${candidate.Upload_photo}` : `/img/candiateds/${(index % 4) + 1}.png`} 
                    alt={candidate.Name} 
                    onError={e => { e.target.onerror=null; e.target.src="/img/candiateds/1.png";}} 
                  />
                </div>

                <h4>{candidate.Name}</h4>
                <p className="candidate-post">{candidate.Post || "Job Seeker"}</p>

                <div className="candidate-skills">
                  {(candidate.Skills || "React, Node, JS").split(",").slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="skill-badge">{skill.trim()}</span>
                  ))}
                </div>

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
            ))
          ) : (
            <p>No candidates found.</p>
          )}
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