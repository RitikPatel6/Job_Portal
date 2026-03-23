import React, { useState } from "react";
import axios from "axios";
import "./uploadresume.css";

function Uploadresume() {

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadResume = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:1337/uploadresume", // ✅ FIXED URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.status === "success") {
        alert(res.data.message);
        setFile(null); // reset file
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="upload-container">

      <h2>Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      <button onClick={uploadResume}>
        Upload Resume
      </button>

    </div>
  );
}

export default Uploadresume;