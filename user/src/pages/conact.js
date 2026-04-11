import React, { useEffect, useState } from "react";
import "./contact.css";
import Axios from "axios";
import Swal from "sweetalert2";

function Contact() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    id: userData ? userData.id : "",
    name: userData ? userData.Name || userData.user_name : "",
    email: userData ? userData.email : "",
    subject: "",
    message: "",
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await Axios.get("http://localhost:1337/api/companies");
      const data = res.data.data || res.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const selectCompany = (comp) => {
    setSelectedCompany(comp);
    fetchMessages(formData.name, comp.Company_name);
  };

  const fetchMessages = async (user, company) => {
    if (!user || !company) return;
    try {
      const res = await Axios.get(`http://localhost:1337/api/company-messages?company=${company}`);
      if (res.data.success) {
        setMessages(res.data.data.filter((m) => m.sender === user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return Swal.fire("Error", "Please login first", "error");
    if (!selectedCompany) return Swal.fire("Warning", "Please select a company", "warning");

    try {
      const res = await Axios.post("http://localhost:1337/api/send-message", {
        sender: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        company: selectedCompany.Company_name,
        job: "General Inquiry",
        type: "chat"
      });

      if (res.data.success) {
        Swal.fire("Success", "Message Sent!", "success");
        setFormData({ ...formData, subject: "", message: "" });
        fetchMessages(formData.name, selectedCompany.Company_name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="contact-basic-page">
      {/* SIMPLE BANNER */}
      <section className="simple-contact-banner">
        <h1>Contact Companies</h1>
        <p>Direct communication with your future employers</p>
      </section>

      <div className="container basic-contact-container">
        
        {/* RECIPIENT LIST */}
        <div className="company-selection-sidebar">
          {/* USER INFO BLOCK */}
          <div className="user-direct-info">
            <p><strong>Name:</strong> {userData?.Name || userData?.user_name}</p>
            <p><strong>Gmail:</strong> {userData?.email}</p>
          </div>

          <h3>Choose Company</h3>
          <div className="comp-list-wrapper">
            {companies.map((comp) => (
              <div 
                key={comp.Company_id} 
                className={`basic-comp-card ${selectedCompany?.Company_id === comp.Company_id ? "active" : ""}`}
                onClick={() => selectCompany(comp)}
              >
                <div className="comp-initial">{comp.Company_name[0]}</div>
                <div className="comp-info-text">
                  <h4>{comp.Company_name}</h4>
                  <p>{comp.location}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedCompany && (
            <div className="comp-quick-details">
              <h4>Contact Info</h4>
              <p>📍 {selectedCompany.location}</p>
              <p>📧 {selectedCompany.email}</p>
              <p>📞 {selectedCompany.contact_no}</p>
            </div>
          )}
        </div>

        {/* MESSAGE AREA */}
        <div className="message-interaction-area">
          {!selectedCompany ? (
            <div className="no-selection-msg">
              <i className="chat-icon">💬</i>
              <h3>Start a Conversation</h3>
              <p>Select a company from the left to send them a direct message or view your history.</p>
            </div>
          ) : (
            <div className="chat-interface">
              <div className="chat-header">
                <h3>Conversation with {selectedCompany.Company_name}</h3>
              </div>

              {/* MESSAGE THREAD */}
              <div className="simple-chat-box">
                {messages.length === 0 ? (
                  <p className="no-msg">No messages yet. Send your first query below.</p>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className="basic-msg-thread">
                      <div className="user-text-bubble">
                        <p>{m.message}</p>
                        <span className="time-stamp">{new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {m.reply && (
                        <div className="company-text-bubble">
                          <small>Response from {selectedCompany.Company_name}:</small>
                          <p>{m.reply}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* REPLY FORM */}
              <form className="basic-message-form" onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  placeholder="Subject of your message" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required 
                />
                <textarea 
                  placeholder="Write your message here..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required 
                  rows="3"
                ></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Contact;