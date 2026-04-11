import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./addjobcategory.css";

function Addjobcategory() {
  const [formData, setFormData] = useState({
    Jobcat_name: "",
    Jobcat_description: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ CHECK LOGIN
  useEffect(() => {
    const company = JSON.parse(sessionStorage.getItem("company"));

    if (!company) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ ADD CATEGORY
  const addCategory = async () => {
    if (loading) return;

    const companyData = JSON.parse(sessionStorage.getItem("company"));

    if (!companyData || !companyData.Company_id) {
      return Swal.fire("Error", "Please login first", "error");
    }

    const name = formData.Jobcat_name.trim();
    const description = formData.Jobcat_description.trim();

    if (!name || !description) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      setLoading(true);

      console.log("Sending Data:", {
        Jobcat_name: name,
        Jobcat_description: description,
        Company_id: companyData.Company_id
      });

      const res = await axios.post(
        "http://localhost:1337/api/add-category",
        {
          Jobcat_name: name,
          Jobcat_description: description,
          Company_id: companyData.Company_id
        }
      );

      if (res.data.success) {
        Swal.fire("Success", "Category Added Successfully", "success");

        setFormData({
          Jobcat_name: "",
          Jobcat_description: ""
        });
      } else {
        Swal.fire("Error", res.data.error, "error");
      }

    } catch (err) {
      console.log("ERROR:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Server not responding",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-page">
      <div className="category-card">
        <h2>Add Job Category</h2>

        <label>Job Category Name</label>
        <input
          type="text"
          name="Jobcat_name"
          value={formData.Jobcat_name}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="Jobcat_description"
          value={formData.Jobcat_description}
          onChange={handleChange}
        />

        <button onClick={addCategory} disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </button>
      </div>
    </div>
  );
}

export default Addjobcategory;