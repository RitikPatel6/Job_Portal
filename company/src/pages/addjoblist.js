import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./addjoblist.css";

function Addjoblist() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({//formdata-value hold,setformdata-update value,usestate-react hook
    Jobcat_id: "",
    Job_title: "",
    skill: "",
    end_date: "",
    description: "",
    location: "",
    salary: "",
    jobtype: "fulltime",   // ✅ FIXED
  });

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get("http://localhost:1337/api/jobcategories");
        setCategories(res.data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD JOB =================
  const Addjob = async () => {
    const {
      Jobcat_id,
      Job_title,
      skill,
      end_date,
      description,
      location,
      salary,
      jobtype,
    } = formData;

    if (
      !Jobcat_id ||
      !Job_title ||
      !skill ||
      !end_date ||
      !description ||
      !location ||
      !salary ||
      !jobtype
    ) {
      return Swal.fire("Error", "Fill all required details", "error");
    }

    try {
      await Axios.post("http://localhost:1337/api/joblist", formData);

      Swal.fire("Success", "Job added successfully", "success");

      // Clear form
      setFormData({
        Jobcat_id: "",
        Job_title: "",
        skill: "",
        end_date: "",
        description: "",
        location: "",
        salary: "",
        jobtype: "fulltime",   // ✅ FIXED
      });

    } catch (err) {
      console.log("Insert error:", err.response?.data || err.message);
      Swal.fire("Error", "Error during data insert", "error");
    }
  };

  return (
    <div className="addjob-page">
      <div className="form-card">
        <div className="form-header">Add New Job</div>

        <div className="form-grid">

          {/* Job Title */}
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="Job_title"
              value={formData.Job_title}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <select
              name="Jobcat_id"
              value={formData.Jobcat_id}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.Jobcat_id} value={cat.Jobcat_id}>
                  {cat.Jobcat_name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Salary */}
          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label>Job Type *</label>
            <select
              name="jobtype"
              value={formData.jobtype}
              onChange={handleChange}
            >
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* End Date */}
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          {/* Skills */}
          <div className="form-group full-width">
            <label>Skills *</label>
            <input
              type="text"
              name="skill"
              placeholder="React, Node, MySQL"
              value={formData.skill}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>Job Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="submit-btn" onClick={Addjob}>
            Add Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default Addjoblist;