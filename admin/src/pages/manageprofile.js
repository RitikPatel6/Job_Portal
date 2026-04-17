import React, { useState, useEffect } from "react";
import "./manageprofile.css";

function Manageprofile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    photo: ""
  });

  // ===== LOAD DATA FROM LOCALSTORAGE =====
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // default data
      setProfile({
        name: "Ritik Patel",
        email: "ritik@gmail.com",
        phone: "9876543210",
        location: "Ahmedabad",
        skills: "React, Node.js, MySQL",
        photo: ""
      });
    }
  }, []);

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // ===== HANDLE IMAGE (BASE64 SAVE) =====
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfile({
          ...profile,
          photo: reader.result // ✅ base64 (permanent)
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // ===== SAVE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("profile", JSON.stringify(profile));

    alert("Profile Updated & Saved ✅");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>Manage Profile</h2>

        {/* ===== PROFILE IMAGE ===== */}
        <div className="profile-image">
          <img
            src={
              profile.photo
                ? profile.photo
                : "https://via.placeholder.com/100"
            }
            alt="Profile"
          />
          <input type="file" onChange={handleImageChange} />
        </div>

        {/* ===== FORM ===== */}
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

          <button type="submit" className="update-btn">
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}

export default Manageprofile;