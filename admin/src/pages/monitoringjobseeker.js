import React, { useState } from "react";
import "./monitoringjobseeker.css";

function Monitoringjobseeker() {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      appliedJob: "React Developer",
      experience: "2 Years",
      status: "Applied",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@gmail.com",
      phone: "9123456780",
      appliedJob: "HR Executive",
      experience: "1 Year",
      status: "Interview",
    },
  ]);

  const deleteCandidate = (id) => {
    if (window.confirm("Are you sure you want to remove this candidate?")) {
      setCandidates(candidates.filter((cand) => cand.id !== id));
    }
  };

  const updateStatus = (id) => {
    setCandidates(
      candidates.map((cand) =>
        cand.id === id
          ? {
              ...cand,
              status:
                cand.status === "Applied"
                  ? "Interview"
                  : cand.status === "Interview"
                  ? "Selected"
                  : "Rejected",
            }
          : cand
      )
    );
  };

  return (
    <div className="candidate-container">
      <div className="candidate-card">
        <div className="candidate-header">Monitoring Job Seeker</div>

        <div className="candidate-table-wrapper">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied Job</th>
                <th>Experience</th>
                <th>Status</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {candidates.map((cand) => (
                <tr key={cand.id}>
                  <td>{cand.id}</td>
                  <td>{cand.name}</td>
                  <td>{cand.email}</td>
                  <td>{cand.phone}</td>
                  <td>{cand.appliedJob}</td>
                  <td>{cand.experience}</td>

                  <td>
                    <span
                      className={`status ${cand.status.toLowerCase()}`}
                      onClick={() => updateStatus(cand.id)}
                    >
                      {cand.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => deleteCandidate(cand.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {candidates.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-data">
                    No Candidates Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Monitoringjobseeker;
