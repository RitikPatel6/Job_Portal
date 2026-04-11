import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./companyindex.css";

function CompanyInbox() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");

  const companyData = JSON.parse(sessionStorage.getItem("company"));
  const companyName = companyData ? companyData.Company_name : "";

  const fetchMessages = async () => {
    if (!companyName) return;
    try {
      const res = await Axios.get(`http://localhost:1337/api/company-messages?company=${companyName}&type=chat`);
      const data = res.data.data || res.data || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [companyName]);

  const sendReply = async (id) => {
    if (!replyText) return alert("Please enter your reply message.");
    try {
      await Axios.post("http://localhost:1337/api/reply", { id, reply: replyText });
      setReplyText("");
      fetchMessages();
      setSelectedMsg(prev => ({ ...prev, reply: replyText }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="company-inbox-page">
      {/* SIMPLE HEADER AREA */}
      <section className="inbox-banner-header">
        <div className="container">
          <h2>Candidate Inquiry Center</h2>
          <p>Logged in as: <strong>{companyName}</strong></p>
        </div>
      </section>

      <div className="container basic-inbox-grid">
        
        {/* LEFT: RECENT MESSAGES LIST */}
        <div className="inbox-sidebar-list">
          <div className="sidebar-list-top">
            <h3>Recent Messages</h3>
            <span className="msg-total-badge">{messages.length}</span>
          </div>
          <div className="msg-scroll-container">
            {messages.length === 0 ? (
              <p className="no-msgs">No messages received yet.</p>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`msg-preview-card ${selectedMsg?.id === msg.id ? "active" : ""} ${msg.reply ? "replied" : ""}`}
                  onClick={() => { setSelectedMsg(msg); setReplyText(""); }}
                >
                  <div className="sender-row">
                    <span className="name-bold">{msg.sender}</span>
                    <span className="date-dim">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="subject-line-text">{msg.subject}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: DETAILED MESSAGE VIEW */}
        <div className="message-reading-pane">
          {selectedMsg ? (
            <div className="thread-master-container">
              <div className="reading-header">
                <h3>{selectedMsg.subject}</h3>
                <div className="meta-row">
                  <span><strong>From:</strong> {selectedMsg.sender} ({selectedMsg.email})</span>
                </div>
              </div>

              <div className="thread-conversation-body">
                <div className="received-message-bubble">
                  <p>{selectedMsg.message}</p>
                </div>

                {selectedMsg.reply && (
                  <div className="sent-response-bubble">
                    <div className="resp-label">Response sent on {new Date(selectedMsg.updated_at || selectedMsg.created_at).toLocaleDateString()}</div>
                    <p>{selectedMsg.reply}</p>
                  </div>
                )}
              </div>

              {!selectedMsg.reply && (
                <div className="reply-composer-footer">
                  <textarea 
                    placeholder="Enter your reply message here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="4"
                  ></textarea>
                  <button className="inbox-reply-btn" onClick={() => sendReply(selectedMsg.id)}>
                    Submit Direct Reply
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-inbox-view">
              <span className="big-icon">📬</span>
              <h3>No Message Selected</h3>
              <p>Click on any message from the left list to view the full conversation and reply.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CompanyInbox;