import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./candidatedetails.css";

function Candidatedetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidate = location.state;

  if (!candidate) {
    return <h2>No Candidate Data Found</h2>;
  }

  return (
    <div className="profile-page">
      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      <div className="profile-card">
        <img
          src={candidate.Upload_photo ? `http://localhost:1337/uploads/${candidate.Upload_photo}` : "/img/candiateds/1.png"}
          alt={candidate.Name}
          onError={(e) => {
            e.target.src = "/img/candiateds/1.png";
          }}
        />

        <h2>{candidate.Name}</h2>
        <span className="post-title">{candidate.Post || "Job Seeker"}</span>

        <div className="info-grid">
          <div className="info-item">
            <strong>Experience</strong>
            <p>{candidate.Experience || "N/A"}</p>
          </div>
          <div className="info-item">
            <strong>Skills</strong>
            <p>{candidate.Skills || "N/A"}</p>
          </div>
          <div className="info-item">
            <strong>Email</strong>
            <p>{candidate.email}</p>
          </div>
          <div className="info-item">
            <strong>Contact</strong>
            <p>{candidate.Contact_no || "N/A"}</p>
          </div>
          {candidate.Extra_section && (
            <div className="info-item" style={{ gridColumn: "1 / -1" }}>
              <strong>Additional Information</strong>
              <p>{candidate.Extra_section}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Candidatedetails;