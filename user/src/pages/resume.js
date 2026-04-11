import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./resume.css";

function Resume() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let id = null;
    const data = sessionStorage.getItem("userData");
    if(data) {
      id = JSON.parse(data).id;
    }

    if (!id) {
      alert("Please login first");
      window.location = "/login";
      return;
    }

    Axios.get("http://localhost:1337/api/getuser/" + id)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          alert("User not found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // <-- Guard to avoid reading properties on null
  if (!user) {
    return <h2 style={{ textAlign: "center" }}>Loading Resume...</h2>;
  }

  return (
    <div className="resume-container">
      <div className="resume">

        {/* LEFT SIDEBAR */}
        <div className="resume-left">
          {user.Upload_photo ? (
            <img
              src={`http://localhost:1337/uploads/${user.Upload_photo}`}
              alt="User"
            />
          ) : (
            <p>No photo uploaded</p>
          )}
          <h2 class="name1">{user.Name}</h2>
          <p class="name">{user.email}</p>
          <p class="name">{user.Contact_no}</p>
          <p class="name">{user.Address}</p>
        </div>

        {/* RIGHT MAIN SECTION */}
        <div className="resume-right">
          <h1>{user.Name}'s Resume</h1>

          <div className="section">
            <h3>Education</h3>
            <p>{user.Education}</p>
          </div>

          <div className="section">
            <h3>Skills</h3>
            <p>{user.Skills}</p>
          </div>

          <div className="section">
            <h3>Experience</h3>
            <p>{user.Experience}</p>
          </div>

          <div className="section">
            <h3>Company_name</h3>
            <p>{user.Company_name}</p>
          </div>
          <div className="section">
            <h3>Post</h3>
            <p>{user.Post}</p>
          </div>
          <div className="section">
            <h3>Duration</h3>
            <p>{user.Duration}</p>
          </div>
          <div className="section">
            <h3>Work_description</h3>
            <p>{user.Work_description}</p>
          </div>

          <button
            className="download-btn"
            onClick={() => window.print()}
          >
            Download Resume
          </button>
          <button  
          className="edit-btn"
          onClick={() => window.location="/editresume"}>
          Edit Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default Resume;