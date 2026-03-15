import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./resume.css";

function Resume() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const id = localStorage.getItem("userid");

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

  if (!user) {
    return <h2 style={{textAlign:"center"}}>Loading Resume...</h2>;
  }

  return (

    <div className="resume-container">

      <div className="resume">

        <h1>{user.Name}</h1>

         <p><b>Name:</b> {user.Name}</p>

        <p><b>Email:</b> {user.email}</p>
        <p><b>Contact:</b> {user.Contact_no}</p>
        <p><b>Address:</b> {user.Address}</p>

        <h2>Education</h2>
        <p>{user.Education}</p>

        <h2>Experience</h2>
        <p>{user.Experience}</p>

        <h2>Projects</h2>
        <p>{user.Projects}</p>
         <h2>Upload Photo</h2>
        <p>{user.Upload_photo}</p>


        <button
          className="download-btn"
          onClick={() => window.print()}
        >
          Download Resume
        </button>

      </div>

    </div>

  );

}

export default Resume;