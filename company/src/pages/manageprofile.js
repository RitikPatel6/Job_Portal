import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import "./manageprofile.css";

function ManageProfile() {
  const [formData, setFormData] = useState({
    Company_name: "",
    contact_no: "",
    email: "",
    password: "",
    id_proof: null,
    location: "",
    website_URL: "",
    description: "",
    company_person_name: "",
    company_person_contact: ""
  });

  const [fileName, setFileName] = useState("");
  
  // ✅ Get company ID from session
  const companyData = JSON.parse(sessionStorage.getItem("company") || "{}");
  const company_id = companyData.Company_id;

  // ✅ Fetch Data
  useEffect(() => {
    if (company_id) {
      Axios.get(`http://localhost:1337/api/company/${company_id}`)
        .then((res) => {
          // Ensure all fields are present even if null in DB
          setFormData({
            ...formData,
            ...res.data,
            password: res.data.password || "" // Include password as requested
          });
          setFileName(res.data.id_proof || "");
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
        });
    }
  }, [company_id]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        id_proof: file
      });
      setFileName(file.name);
    }
  };

  // ✅ Update Profile
  const handleUpdate = (e) => {
    e.preventDefault();

    const data = new FormData();
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'id_proof') {
        data.append(key, formData[key]);
      }
    });
    
    // Append file if it's a new file object
    if (formData.id_proof instanceof File) {
      data.append("id_proof", formData.id_proof);
    }

    Axios.put(`http://localhost:1337/api/company/update/${company_id}`, data)
      .then((res) => {
        if (res.data.success) {
          // Update local session storage with new data
          const updatedCompany = { ...companyData, ...formData };
          // Don't store the File object in session storage, keep old filename if it didn't change
          if (formData.id_proof instanceof File) {
            updatedCompany.id_proof = fileName; 
          }
          sessionStorage.setItem("company", JSON.stringify(updatedCompany));

          Swal.fire({
            title: "Success",
            text: "Profile Updated Successfully",
            icon: "success",
            confirmButtonColor: "#4f46e5"
          }).then(() => {
            window.location.reload(); // Reload to refresh all dynamic components like Sidebar
          });
        } else {
          Swal.fire("Error", res.data.message || "Update Failed", "error");
        }
      })
      .catch((err) => {
        console.error("Update Error:", err);
        Swal.fire("Error", "Server Error", "error");
      });
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          Manage Company Profile
        </div>

        <form className="company-form" onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text" 
                name="Company_name"
                value={formData.Company_name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input 
                type="tel" 
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="text" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input 
                type="text" 
                name="website_URL"
                value={formData.website_URL}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group full-width">
              <label>Company Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Contact Person Name</label>
              <input 
                type="text" 
                name="company_person_name"
                value={formData.company_person_name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Contact Person Mobile</label>
              <input 
                type="tel" 
                name="company_person_contact"
                value={formData.company_person_contact}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group full-width" style={{ marginTop: '15px' }}>
            <label>ID Proof (Upload new to change)</label>
            <input type="file" onChange={handleFileChange} />
            {fileName && (
              <p className="file-name">Current File: {fileName}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">Update Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ManageProfile;