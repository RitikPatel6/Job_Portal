import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./scheduleinterview.css";

function ScheduleInterview() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  const [formData, setFormData] = useState({
    candidateId: "",
    name: "",
    job: "",
    date: "",
    time: "",
    mode: "Online",
    location: "",
  });

  useEffect(() => {
    const data = sessionStorage.getItem("company");
    if (data) {
      const company = JSON.parse(data);
      setCompanyId(company?.Company_id || company?.id);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchShortlisted();
      fetchInterviews();
    }
  }, [companyId]);

  const fetchShortlisted = async () => {
    try {
      const res = await Axios.get(`http://localhost:1337/api/shortlisted-candidates/${companyId}`);
      if (res.data.success) setCandidates(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await Axios.get(`http://localhost:1337/api/interviews/${companyId}`);
      if (res.data.success) {
        console.log("Fetched Interviews:", res.data.data);
        setInterviews(res.data.data);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  const handleCandidateChange = (e) => {
    const selectedId = e.target.value;
    const selected = candidates.find(c => (c.applied_id || c.id) == selectedId);
    setFormData({
      ...formData,
      candidateId: selectedId,
      name: selected?.name || "",
      job: selected?.Job_title || ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time) return alert("Fill all fields");

    try {
      await Axios.post("http://localhost:1337/api/add-interview", { ...formData, companyId });
      fetchInterviews();
      setFormData({
        candidateId: "",
        name: "",
        job: "",
        date: "",
        time: "",
        mode: "Online",
        location: "",
      });
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  const deleteInterview = async (id) => {
    await Axios.delete(`http://localhost:1337/api/delete-interview/${id}`);
    fetchInterviews();
  };

  // ===== Format date/time for display =====
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return { formattedDate: "-", formattedTime: timeStr || "-" };
    
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        // Fallback for manual parsing strings like YYYY-MM-DD
        const [year, month, day] = String(dateStr).split('T')[0].split("-").map(Number);
        const [hours, minutes] = String(timeStr || "00:00").split(":").map(Number);
        const altDate = new Date(year, month - 1, day, hours, minutes);
        if (isNaN(altDate.getTime())) return { formattedDate: dateStr, formattedTime: timeStr || "-" };
        
        return {
          formattedDate: altDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          formattedTime: altDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
        };
      }

      return {
        formattedDate: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        formattedTime: timeStr ? timeStr : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      };
    } catch (e) {
      return { formattedDate: dateStr, formattedTime: timeStr || "-" };
    }
  };

  return (
    <div className="interview-wrapper">
      <div className="glass-card">
        <h2>Schedule Interview</h2>
        <form onSubmit={handleSubmit} className="modern-form">
          <select value={formData.candidateId} onChange={handleCandidateChange}>
            <option value="">Select Candidate</option>
            {candidates.map(c => {
              const cId = c.applied_id || c.id;
              return <option key={cId} value={cId}>{c.name} - {c.Job_title}</option>
            })}
          </select>

          <input type="text" value={formData.name} readOnly />
          <input type="text" value={formData.job} readOnly />
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          <input type="time" name="time" value={formData.time} onChange={handleChange} />
          <select name="mode" value={formData.mode} onChange={handleChange}>
            <option>Online</option>
            <option>Offline</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Meeting Link / Address"
            value={formData.location}
            onChange={handleChange}
          />
        <button type="submit" className="neon-btn">Schedule</button>
        </form>
      </div>

      <div className="glass-card">
        <h2>Scheduled Interviews</h2>
        <div className="table-wrapper">
          <table className="interviews-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">No interviews scheduled yet.</td>
                </tr>
              ) : (
                interviews.map((intv) => {
                  const { formattedDate, formattedTime } = formatDateTime(intv.date, intv.time);
                  return (
                    <tr key={intv.id}>
                      <td>{intv.name}</td>
                      <td>{intv.job}</td>
                      <td>{formattedDate}</td>
                      <td>{formattedTime}</td>
                      <td>{intv.mode}</td>
                      <td>{intv.location}</td>
                      <td>
                        <button 
                          className="Delete" 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this schedule?")) {
                              deleteInterview(intv.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleInterview;