import React, { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./signup.css";

function Signup() {

  const [formData, setFormData] = useState({
    Company_name: "",
    contact_no: "",
    email: "",
    id_proof: null,
    location: "",
    website_URL: "",
    description: "",
    password: "",
    company_person_name: "",
    company_person_contact: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      id_proof: e.target.files[0]
    });
  };

  const Addsignup = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("Company_name", formData.Company_name);
    data.append("contact_no", formData.contact_no);
    data.append("email", formData.email);
    data.append("location", formData.location);
    data.append("website_URL", formData.website_URL);
    data.append("description", formData.description);
    data.append("password", formData.password);
    data.append("company_person_name", formData.company_person_name);
    data.append("company_person_contact", formData.company_person_contact);
    data.append("id_proof", formData.id_proof);

    Axios.post("http://localhost:1337/api/signup", data)
      .then((res) => {

        if (res.data.success) {

          Swal.fire({
            title: "Success",
            text: res.data.message,
            icon: "success"
          }).then(() => {

            // Redirect to login page
            window.location.href = "/login";

          });

        } else {

          Swal.fire({
            title: "Warning",
            text: res.data.message,
            icon: "warning"
          });

        }

      })
      .catch((err) => {

        console.log(err);

        Swal.fire({
          title: "Error",
          text: "Server Error",
          icon: "error"
        });

      });
  };

  return (
    <div className="form-page">
      <div className="form-card">

        <div className="form-header">
          Company Registration
        </div>

        <form className="company-form" onSubmit={Addsignup}>

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
              <label>Email</label>
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
                type="password"
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
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>ID Proof</label>
              <input
                type="file"
                name="id_proof"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company Person Name</label>
              <input
                type="text"
                name="company_person_name"
                value={formData.company_person_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company Person Contact</label>
              <input
                type="tel"
                name="company_person_contact"
                value={formData.company_person_contact}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button type="submit" className="submit-btn">
            Register Company
          </button>

        </form>

      </div>
    </div>
  );
}

export default Signup;