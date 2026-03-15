import React, { useState } from "react";
import "./contact.css";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Message Sent Successfully!");
  };

  return (
    <div className="contact-page">

      {/* Banner */}
      <section className="contact-banner">
        <h1>Contact Us</h1>
        <p>We would love to hear from you</p>
      </section>

      <div className="container contact-container">

        {/* Contact Info */}
        <div className="contact-info">

          <div className="info-card">
            <h3>Address</h3>
            <p>Vadodara, Gujarat, India</p>
          </div>

          <div className="info-card">
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-card">
            <h3>Email</h3>
            <p>support@jobportal.com</p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="contact-form">

          <h2>Send Message</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="contact-btn">
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;