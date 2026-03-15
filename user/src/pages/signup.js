import React from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import Swal from "sweetalert2";
import Axios from "axios";

function Signup() {

  function Userregister(e) {

    e.preventDefault();

    const Name = document.getElementById("Name").value;
    const Contact_no = document.getElementById("Contact_no").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const Address = document.getElementById("Address").value;
    const Education = document.getElementById("Education").value;
    const Experience = document.getElementById("Experience").value;
    const Projects = document.getElementById("Projects").value;

    const Upload_photo = document.getElementById("Upload_photo").files[0];

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
    formData.append("Experience", Experience);
    formData.append("Projects", Projects);
    formData.append("Upload_photo", Upload_photo);

    Axios.post("http://localhost:1337/api/usersignup", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
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
          title: response.data.message
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

            <label>Name</label>
            <input type="text" id="Name" placeholder="Enter Name" required />

            <label>Contact Number</label>
            <input type="number" id="Contact_no" placeholder="Contact Number" required />

            <label>Email</label>
            <input type="email" id="email" placeholder="Enter Email" required />

            <label>Password</label>
            <input type="password" id="password" placeholder="Enter Password" required />

            <label>Address</label>
            <textarea id="Address" placeholder="Enter Address"></textarea>

            <label>Education</label>
            <textarea id="Education" placeholder="Enter Education"></textarea>

            <label>Experience</label>
            <textarea id="Experience" placeholder="Enter Experience"></textarea>

            <label>Projects</label>
            <textarea id="Projects" placeholder="Enter Projects"></textarea>

            <label>Upload Photo</label>
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
