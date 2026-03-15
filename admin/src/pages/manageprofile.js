import React, { useState } from "react";
import "./manageprofile.css";

function Manageprofile() {

  const [profile, setProfile] = useState({
    name: "Ritik Patel",
    email: "ritik@gmail.com",
    phone: "9876543210",
    location: "Ahmedabad",
    skills: "React, Node.js, MySQL"
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Manage Profile</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="update-btn">
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}

export default Manageprofile;
