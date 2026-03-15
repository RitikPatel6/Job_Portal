import React, { useState } from "react";
import "./scheduleinterview.css";

function ScheduleInterview() {
  const [interviews, setInterviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    job: "",
    date: "",
    time: "",
    mode: "Online",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.job ||
      !formData.date ||
      !formData.time ||
      !formData.location
    ) {
      alert("Please fill all fields");
      return;
    }

    const newInterview = {
      id: Date.now(),
      ...formData,
      status: "Scheduled",
    };

    setInterviews([...interviews, newInterview]);

    setFormData({
      name: "",
      job: "",
      date: "",
      time: "",
      mode: "Online",
      location: "",
    });
  };

  const deleteInterview = (id) => {
    setInterviews(interviews.filter((item) => item.id !== id));
  };

  return (
    <div className="interview-wrapper">
      <div className="glass-card">
        <h2>Schedule Interview</h2>

        <form onSubmit={handleSubmit} className="modern-form">
          <input type="text" name="name" placeholder="Candidate Name"
            value={formData.name} onChange={handleChange} />

          <input type="text" name="job" placeholder="Job Title"
            value={formData.job} onChange={handleChange} />

          <input type="date" name="date"
            value={formData.date} onChange={handleChange} />

          <input type="time" name="time"
            value={formData.time} onChange={handleChange} />

          <select name="mode"
            value={formData.mode} onChange={handleChange}>
            <option>Online</option>
            <option>Offline</option>
          </select>

          <input type="text" name="location"
            placeholder="Meeting Link / Address"
            value={formData.location} onChange={handleChange} />

          <button type="submit" className="neon-btn">
            Schedule
          </button>
        </form>
      </div>

      <div className="glass-card">
        <h2>Interview List</h2>

        <table className="modern-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Job</th>
              <th>Date</th>
              <th>Time</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">
                  No Interviews Yet
                </td>
              </tr>
            ) : (
              interviews.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.job}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.mode}</td>
                  <td className="status">{item.status}</td>
                  <td>
                    <button
                      className="delete-modern"
                      onClick={() => deleteInterview(item.id)}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleInterview;
