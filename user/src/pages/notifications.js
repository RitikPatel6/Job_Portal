import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./notifications.css";

function Notifications() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userEmail = userData?.email;
  const userName = userData?.Name || userData?.user_name;

  useEffect(() => {
    if (userEmail) fetchMessages();
  }, [userEmail]);

  const fetchMessages = async () => {
    try {
      // Fetch by email (company→user messages stored with user's email)
      const res = await Axios.get(`http://localhost:1337/api/user-messages?email=${userEmail}&type=notification`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Tag type based on subject keywords
  const getTagType = (subject = "") => {
    const s = subject.toLowerCase();
    if (s.includes("shortlist") || s.includes("congratulations")) return { label: "🎉 Shortlisted", cls: "tag-shortlist" };
    if (s.includes("interview")) return { label: "📅 Interview", cls: "tag-interview" };
    if (s.includes("offer")) return { label: "🏆 Job Offer", cls: "tag-offer" };
    if (s.includes("reject")) return { label: "❌ Rejected", cls: "tag-reject" };
    return { label: "📩 Message", cls: "tag-msg" };
  };

  return (
    <div className="notif-page">
      {/* BANNER */}
      <section className="notif-banner">
        <h1>My Notifications</h1>
        <p>Messages and updates from companies you applied to</p>
      </section>

      <div className="container notif-layout">

        {/* LEFT: MESSAGE LIST */}
        <div className="notif-sidebar">
          <div className="notif-sidebar-top">
            <h3>Company Messages</h3>
            <span className="notif-badge">{messages.length}</span>
          </div>

          <div className="notif-scroll-list">
            {messages.length === 0 ? (
              <div className="no-notif">
                <span>📭</span>
                <p>No messages from companies yet.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const tag = getTagType(msg.subject);
                return (
                  <div
                    key={msg.id}
                    className={`notif-card ${selectedMsg?.id === msg.id ? "active" : ""}`}
                    onClick={() => setSelectedMsg(msg)}
                  >
                    <div className="notif-card-top">
                      <div className="company-notif-initial">{msg.sender?.[0] || "C"}</div>
                      <div className="notif-card-info">
                        <h4>{msg.sender}</h4>
                        <small>{new Date(msg.created_at).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <p className="notif-subject">{msg.subject}</p>
                    <span className={`notif-tag ${tag.cls}`}>{tag.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: MESSAGE DETAIL */}
        <div className="notif-detail-pane">
          {selectedMsg ? (
            <div className="notif-thread">
              <div className="notif-thread-header">
                <div className="thread-header-top">
                  <div className="company-big-avatar">{selectedMsg.sender?.[0]}</div>
                  <div>
                    <h3>{selectedMsg.subject}</h3>
                    <p>From: <strong>{selectedMsg.sender}</strong></p>
                    <small>{new Date(selectedMsg.created_at).toLocaleString()}</small>
                  </div>
                </div>
                <span className={`notif-tag ${getTagType(selectedMsg.subject).cls}`}>
                  {getTagType(selectedMsg.subject).label}
                </span>
              </div>

              <div className="notif-message-body">
                <pre className="msg-pre-text">{selectedMsg.message}</pre>
              </div>

              {selectedMsg.reply && (
                <div className="notif-reply-area">
                  <h4>Your Reply:</h4>
                  <p>{selectedMsg.reply}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="notif-empty-view">
              <span className="big-bell">🔔</span>
              <h3>Select a notification to read</h3>
              <p>All messages from companies will appear here — interview calls, job offers, and updates.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Notifications;
