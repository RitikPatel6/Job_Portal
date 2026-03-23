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
    <div className="profile-page container">

      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <div className="profile-card">

        <img
          src={candidate.img}
          alt={candidate.name}
          onError={(e) => {
            e.target.src = "/img/candidates/default.png";
          }}
        />

        <h2>{candidate.name}</h2>
        <p><strong>Job:</strong> {candidate.job}</p>
        <p><strong>Experience:</strong> {candidate.exp}</p>
        <p><strong>Skills:</strong> {candidate.skills}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Location:</strong> {candidate.location}</p>

      </div>
    </div>
  );
}

export default Candidatedetails;