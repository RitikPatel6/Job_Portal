import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import Swal from "sweetalert2";
import Axios from "axios";

function Signup() {

  const [experience, setExperience] = useState("0");

  function Userregister(e) {
    e.preventDefault();

    const Name = document.getElementById("Name").value;
    const Contact_no = document.getElementById("Contact_no").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const Address = document.getElementById("Address").value;
    const Education = document.getElementById("Education").value;
    const Skills = document.getElementById("Skills").value;
    const Experience = document.getElementById("Experience").value;
    const Upload_photo = document.getElementById("Upload_photo").files[0];

    const Company_name = document.getElementById("Company_name")?.value;
    const Post = document.getElementById("Post")?.value;
    const Duration = document.getElementById("Duration")?.value;
    const Work_description = document.getElementById("Work_description")?.value;
    const Extra_section = document.getElementById("Extra_section")?.value;

    if (!Name || !Contact_no || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill required fields!"
      });
      return;
    }

    const formData = new FormData();

    formData.append("Name", Name);
    formData.append("Contact_no", Contact_no);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("Address", Address);
    formData.append("Education", Education);
    formData.append("Skills", Skills);
    formData.append("Experience", Experience);
    formData.append("Upload_photo", Upload_photo);

    if (experience !== "0") {
      formData.append("Company_name", Company_name);
      formData.append("Post", Post);
      formData.append("Duration", Duration);
      formData.append("Work_description", Work_description);
    }

    formData.append("Extra_section", Extra_section || "");

    Axios.post("http://localhost:1337/api/usersignup", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "User Registered Successfully!"
          }).then(() => {
            window.location.href = "/login";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: response.data.message || response.data.error || "Signup Failed"
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Server Error"
        });
      });
  }

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* LEFT */}
        <div className="signup-left">
          <h1>Job Portal</h1>
          <p>Find your dream job with thousands of opportunities.</p>
        </div>

        {/* RIGHT */}
        <div className="signup-right">
          <h2>Candidate Registration</h2>

          <form onSubmit={Userregister}>

            <label>Name*</label>
            <input type="text" id="Name" required />

            <label>Contact Number*</label>
            <input type="number" id="Contact_no" required />

            <label>Email*</label>
            <input type="email" id="email" required />

            <label>Password*</label>
            <input type="password" id="password" required />

            <label>Address*</label>
            <textarea id="Address"></textarea>

            <label>Education*</label>
            <textarea id="Education"></textarea>

            <label>Skills*</label>
            <textarea id="Skills"></textarea>

            <label>Experience Details*</label>
            <textarea id="Experience"></textarea>

            

            {/* Experience Dropdown */}
            <label>Experience (Years)*</label>
            <select class="form-control"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
            <br></br>

            {/* CONDITIONAL FIELDS */}
            {experience !== "0" && (
              <>
                <label>Company Name*</label>
                <input type="text" id="Company_name" />

                <label>Post*</label>
                <input type="text" id="Post" />

                <label>Duration*</label>
                <input type="text" id="Duration" />

                <label>Work Description*</label>
                <textarea id="Work_description"></textarea>
              </>
            )}

            <label> Projects/Achievements</label>
            <textarea id="Extra_section" placeholder="e.g. Other Projects, Achievements, etc."></textarea>

            <label>Upload Photo*</label>
            <input type="file" id="Upload_photo" />

            <button type="submit" className="signup-btn">
              Register
            </button>

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;