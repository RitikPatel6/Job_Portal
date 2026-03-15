import React, { useState } from "react";
import "./managecandidates.css";

function ManageCandidates() {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit@gmail.com",
      job: "React Developer",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCandidate = {
      id: candidates.length + 1,
      ...formData,
    };

    setCandidates([...candidates, newCandidate]);

    setFormData({
      name: "",
      email: "",
      job: "",
      status: "Pending",
    });
  };

  const updateStatus = (id, status) => {
    const updated = candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, status } : candidate
    );
    setCandidates(updated);
  };

  const deleteCandidate = (id) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  return (
    <div className="managecandidates-page">
      <h2>Manage Candidates</h2>

      {/* Add Candidate Form */}
      <div className="form-card">
        <h3>Add Candidate</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="job"
              placeholder="Job"
              value={formData.job}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Shortlisted</option>
              <option>Rejected</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Candidate
          </button>
        </form>
      </div>

      {/* Candidate Table */}
      <div className="table-card">
        <h3>Candidate List</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Job</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.job}</td>
                <td>
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-shortlist"
                    onClick={() => updateStatus(c.id, "Shortlisted")}
                  >
                    Shortlist
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => updateStatus(c.id, "Rejected")}
                  >
                    Reject
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => deleteCandidate(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCandidates;
