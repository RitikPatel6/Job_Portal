import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import "./sendmessage.css";

function SendMessage() {
  const [interviews, setInterviews] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alreadySentSet, setAlreadySentSet] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMassMode, setIsMassMode] = useState(false);
  const [massStatusFilter, setMassStatusFilter] = useState("All");

  const companyData = JSON.parse(sessionStorage.getItem("company"));
  const companyId = companyData?.Company_id || companyData?.id;
  const companyName = companyData?.Company_name || "";

  useEffect(() => {
    if (companyId) {
      fetchInterviewed();
      fetchAlreadySent();
    }
  }, [companyId]);

  const fetchInterviewed = async () => {
    try {
      const res = await Axios.get(`http://localhost:1337/api/interviews/${companyId}`);
      if (res.data.success) setInterviews(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAlreadySent = async () => {
    try {
      const res = await Axios.get(`http://localhost:1337/api/company-messages?company=${encodeURIComponent(companyName)}&type=notification`);
      if (res.data.success) {
        // Store as "email|job" (lowercase/trimmed) to permit robust matching
        const companyNameLower = (companyName || "").trim().toLowerCase();
        const sentKeys = res.data.data
          .filter(m => (m.sender || "").trim().toLowerCase() === companyNameLower)
          .map(m => `${(m.email || "").trim().toLowerCase()}|${(m.job || "").trim().toLowerCase()}`);
        setAlreadySentSet(new Set(sentKeys));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectCandidate = (intv) => {
    setSelectedCandidate(intv);
    setSelectedJob(null);
    setIsMassMode(false);
    setSubject("");
    setMessage("");
  };

  const handleSelectJob = (jobName, candidates) => {
    setSelectedJob(jobName);
    setSelectedCandidate(null);
    setIsMassMode(true);
    setSubject(`Update regarding ${jobName} Interview`);
    setMessage(`Dear Candidates,\n\nThis is a mass update regarding your scheduled interview for the ${jobName} position at ${companyName}.\n\n[Your Message Here]\n\nRegards,\n${companyName} HR Team`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isMassMode && !selectedCandidate) return Swal.fire("Warning", "Please select a candidate", "warning");
    if (isMassMode && (!selectedJob || !groupedInterviews[selectedJob])) return Swal.fire("Warning", "Please select a job", "warning");
    if (!subject || !message) return Swal.fire("Warning", "Please fill all fields", "warning");

    try {
      if (isMassMode) {
        // MASS MESSAGE LOGIC
        const allTargets = groupedInterviews[selectedJob];
        const targets = massStatusFilter === "All" 
          ? allTargets 
          : allTargets.filter(t => t.candidateStatus?.toLowerCase() === massStatusFilter.toLowerCase());
          
        if (targets.length === 0) return Swal.fire("Info", "No candidates found matching the selected status filter.", "info");
        
        let sentCount = 0;

        for (const target of targets) {
          const email = (target.candidateEmail || "").trim().toLowerCase();
          const jobKey = `${email}|${(selectedJob || "").trim().toLowerCase()}`;
          if (!email || alreadySentSet.has(jobKey)) continue;

          await Axios.post("http://localhost:1337/api/send-message", {
            sender: companyName,
            email: email, 
            subject: subject.replace(/\${name}/g, target.name),
            message: message.replace(/\${name}/g, target.name),
            company: companyName,
            job: selectedJob,
            type: "notification"
          });
          sentCount++;
        }

        Swal.fire("Success", `Mass message sent to ${sentCount} candidates.`, "success");
        fetchAlreadySent();
      } else {
        // INDIVIDUAL MESSAGE LOGIC
        const candidateEmail = (selectedCandidate.candidateEmail || "").trim().toLowerCase();
        const candJob = (selectedCandidate.job || "").trim().toLowerCase();
        const jobKey = `${candidateEmail}|${candJob}`;

        if (!candidateEmail) {
          return Swal.fire("Error", "Candidate email not found. Please delete and re-schedule this interview to fix the record.", "error");
        }

        if (alreadySentSet.has(jobKey)) {
          return Swal.fire("Already Sent", "You have already sent a message to this candidate for this job.", "info");
        }

        const res = await Axios.post("http://localhost:1337/api/send-message", {
          sender: companyName,
          email: candidateEmail,
          subject: subject,
          message: message,
          company: companyName,
          job: selectedCandidate.job,
          type: "notification"
        });

        if (res.data.success) {
          Swal.fire("Sent!", "Message sent to candidate successfully.", "success");
          setAlreadySentSet(prev => new Set([...prev, jobKey]));
          setSubject("");
          setMessage("");
        }
      }
    } catch (err) {
      Swal.fire("Error", "Failed to send message", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview schedule?")) return;
    try {
      const res = await Axios.delete(`http://localhost:1337/api/delete-interview/${id}`);
      if (res.data.success) {
        setInterviews(prev => prev.filter(i => i.id !== id));
        if (selectedCandidate?.id === id) setSelectedCandidate(null);
        Swal.fire("Deleted", "Interview schedule removed", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  const isSent = !isMassMode && selectedCandidate
    ? !!selectedCandidate.candidateEmail && alreadySentSet.has(`${(selectedCandidate.candidateEmail || "").trim().toLowerCase()}|${(selectedCandidate.job || "").trim().toLowerCase()}`)
    : false;

  const groupedInterviews = interviews.reduce((acc, current) => {
    const jobName = current.job || "Other";
    if (!acc[jobName]) acc[jobName] = [];
    acc[jobName].push(current);
    return acc;
  }, {});

  return (
    <div className="sendmsg-page">
      <section className="sendmsg-banner">
        <div className="container">
          <h2>Send Message to Candidate</h2>
          <p>Send interview notifications or updates to shortlisted candidates</p>
        </div>
      </section>

      <div className="container sendmsg-layout">

        {/* LEFT: CANDIDATE LIST */}
        <div className="candidate-msg-sidebar">
          <h3>Jobs with Interviews</h3>
          <div className="cand-scroll-list">
            {Object.keys(groupedInterviews).length === 0 ? (
              <p className="no-cand">No interviews scheduled yet.</p>
            ) : (
              Object.keys(groupedInterviews).map((jobName) => (
                <div key={jobName} className="job-group-section">
                  <div 
                    className={`job-group-header ${selectedJob === jobName ? "active" : ""}`}
                    onClick={() => handleSelectJob(jobName, groupedInterviews[jobName])}
                  >
                    <span>{jobName}</span>
                    <span className="count-badge">{groupedInterviews[jobName].length}</span>
                  </div>
                  
                  <div className="job-candidates-list">
                    {groupedInterviews[jobName].map((intv) => {
                      const emailKey = (intv.candidateEmail || "").trim().toLowerCase();
                      const jobKey = (intv.job || "").trim().toLowerCase();
                      const sentAlready = !!emailKey && alreadySentSet.has(`${emailKey}|${jobKey}`);
                      return (
                        <div
                          key={intv.id}
                          className={`cand-card sm-card ${selectedCandidate?.id === intv.id ? "active" : ""} ${sentAlready ? "msg-sent" : ""}`}
                          onClick={(e) => { e.stopPropagation(); handleSelectCandidate(intv); }}
                        >
                          <div className="cand-initial">{intv.name ? intv.name[0] : "?"}</div>
                          <div className="cand-info">
                            <h4>{intv.name}</h4>
                            <div className="cand-sub-info">
                              <small>📅 {intv.date} &nbsp; 🕐 {intv.time}</small>
                              <span className={`status-badge ${intv.candidateStatus?.toLowerCase()}`}>
                                {intv.candidateStatus || "Unknown"}
                              </span>
                            </div>
                            {sentAlready && <span className="sent-indicator">✅ Sent</span>}
                          </div>
                            <button 
                              className="sm-delete-btn" 
                              onClick={(e) => { e.stopPropagation(); handleDelete(intv.id); }}
                              title="Delete Schedule"
                            >
                              🗑️
                            </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: MESSAGE COMPOSE */}
        <div className="msg-compose-area">
          {!selectedCandidate && !selectedJob ? (
            <div className="no-selection">
              <span className="big-mail-icon">📨</span>
              <h3>Select a job or candidate</h3>
              <p>Choose a job category to send mass messages or select a single candidate.</p>
            </div>
          ) : isMassMode ? (
            <div className="compose-box">
              <div className="compose-header mass-theme">
                <h3>Mass Message: {selectedJob}</h3>
                <p>Sending to {groupedInterviews[selectedJob]?.length} candidates</p>
              </div>
              <form className="compose-form" onSubmit={handleSend}>
                <div className="info-alert">
                  <strong>Tip:</strong> Use <code>{"${name}"}</code> in your message to automatically include candidate name.
                </div>
                <div className="form-row">
                  <label>Filter Candidates by Status</label>
                  <select 
                    value={massStatusFilter} 
                    onChange={(e) => setMassStatusFilter(e.target.value)}
                    className="status-filter-select"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Shortlisted">Only Shortlisted</option>
                    <option value="Rejected">Only Rejected</option>
                    {/* <option value="Interview Scheduled">Only Interview Scheduled</option> */}
                  </select>
                </div>
                <div className="form-row">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Message Content</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="10"
                    placeholder="Write your mass message..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="send-msg-btn mass-btn">
                  🚀 Send to All Candidates
                </button>
              </form>
            </div>
          ) : isSent ? (
            <div className="already-sent-view">
              <span className="sent-icon">✅</span>
              <h3>Message Already Sent</h3>
              <p>You have already sent a message to <strong>{selectedCandidate.name}</strong>.</p>
              <p>Only one message can be sent per candidate.</p>
            </div>
          ) : (
            <div className="compose-box">
              <div className="compose-header">
                <h3>To: {selectedCandidate.name}</h3>
                <p>Job Applied: {selectedCandidate.job}</p>
              </div>

              <form className="compose-form" onSubmit={handleSend}>
                <div className="form-row">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                    required
                  />
                </div>

                <div className="form-row">
                  <label>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="10"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>

                {/* QUICK TEMPLATES */}
                <div className="quick-templates">
                  <p>Quick Templates:</p>

                  <button
                    type="button"
                    className="tmpl-btn tmpl-success"
                    onClick={() => {
                      setSubject(`Congratulations! You are Shortlisted - ${selectedCandidate.job}`);
                      setMessage(`Dear ${selectedCandidate.name},\n\nWe are pleased to inform you that you have been SHORTLISTED for the ${selectedCandidate.job} position at ${companyName}.\n\nWe will contact you shortly with further details.\n\nCongratulations!\n\nBest Regards,\n${companyName} HR Team`);
                    }}
                  >
                    🎉 Congratulations (Shortlisted)
                  </button>

                  {/* <button
                    type="button"
                    className="tmpl-btn"
                    onClick={() => {
                      setSubject(`Interview Schedule - ${selectedCandidate.job}`);
                      setMessage(`Dear ${selectedCandidate.name},\n\nYour interview has been scheduled:\n\nJob: ${selectedCandidate.job}\nDate: ${selectedCandidate.date}\nTime: ${selectedCandidate.time}\nMode: ${selectedCandidate.mode}\nVenue/Link: ${selectedCandidate.location}\n\nPlease be on time.\n\nRegards,\n${companyName}`);
                    }}
                  >
                    📅 Interview Details
                  </button> */}

                  <button
                    type="button"
                    className="tmpl-btn tmpl-offer"
                    onClick={() => {
                      setSubject(`Job Offer - ${selectedCandidate.job} at ${companyName}`);
                      setMessage(`Dear ${selectedCandidate.name},\n\nWe are delighted to offer you the position of ${selectedCandidate.job} at ${companyName}.\n\nPlease reply to confirm your acceptance.\n\nCongratulations and welcome to the team!\n\nBest Regards,\n${companyName} HR Team`);
                    }}
                  >
                    🏆 Job Offer
                  </button>

                  <button
                    type="button"
                    className="tmpl-btn tmpl-reject"
                    onClick={() => {
                      setSubject(`Application Update - ${selectedCandidate.job} at ${companyName}`);
                      setMessage(`Dear ${selectedCandidate.name},\n\nThank you for applying for the ${selectedCandidate.job} position at ${companyName} and for your time during the interview process.\n\nAfter careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe encourage you to apply for future openings that match your profile.\n\nWe wish you all the best in your career.\n\nBest Regards,\n${companyName} HR Team`);
                    }}
                  >
                    ❌ Rejected (Not Selected)
                  </button>
                </div>

                <button type="submit" className="send-msg-btn">
                  📤 Send Message
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SendMessage;
