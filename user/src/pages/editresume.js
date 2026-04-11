import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./editresume.css";

function Editresume() {
  const [user, setUser] = useState({
    Name: "",
    email: "",
    Contact_no: "",
    Address: "",
    Education: "",
    Skills: "",
    Experience: "",
    Company_name: "",
    Post: "",
    Duration: "",
    Work_description: "",
  });

  const [file, setFile] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");

    if (data) {
      const userId = JSON.parse(data).id;
      setId(userId);

      Axios.get(`http://localhost:1337/api/getuser/${userId}`)
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data);
          }
        })
        .catch(() => alert("Error loading data"));
    } else {
      alert("Please login first");
      window.location = "/login";
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, user[key] || "");
    });

    if (file) {
      formData.append("Upload_photo", file);
    }

    try {
      const res = await Axios.post(
        `http://localhost:1337/api/updateuser/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        alert("Updated Successfully");
        window.location = "/resume";
      } else {
        alert(res.data.msg || "Update Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="editresume-container">
      <form className="editresume-card" onSubmit={handleSubmit}>

        <div className="editresume-left">
          <input type="file" onChange={handleFile} />

          <input type="text" name="Name" value={user.Name || ""} onChange={handleChange} />
          <input type="email" name="email" value={user.email || ""} onChange={handleChange} />
          <input type="text" name="Contact_no" value={user.Contact_no || ""} onChange={handleChange} />
          <input type="text" name="Address" value={user.Address || ""} onChange={handleChange} />
        </div>

        <div className="editresume-right">
          <h2>Edit Resume</h2>

          <textarea name="Education" value={user.Education || ""} onChange={handleChange} />
          <textarea name="Skills" value={user.Skills || ""} onChange={handleChange} />
          <textarea name="Experience" value={user.Experience || ""} onChange={handleChange} />

          <input type="text" name="Company_name" value={user.Company_name || ""} onChange={handleChange} />
          <input type="text" name="Post" value={user.Post || ""} onChange={handleChange} />
          <input type="text" name="Duration" value={user.Duration || ""} onChange={handleChange} />

          <textarea name="Work_description" value={user.Work_description || ""} onChange={handleChange} />

          <button type="submit" className="editresume-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Resume"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default Editresume;