import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./addjoblist.css";

function Addjoblist() {

  const [categories, setCategories] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Jobcat_id: "",
    Job_title: "",
    skill: "",
    end_date: "",
    description: "",
    location: "",
    salary: "",
    jobtype: "fulltime",
  });

  // ✅ GET COMPANY ID FROM SESSION
  useEffect(() => {
    const companyData = sessionStorage.getItem("company");

if (companyData) {
  const company = JSON.parse(companyData);
  setCompanyId(company.Company_id); // ✅ correct
}
 else {
      Swal.fire("Error", "Please login first", "error");
    }
  }, []);

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    if (companyId) {
      Axios.get(`http://localhost:1337/api/jobcategories?Company_id=${companyId}`)
        .then((res) => setCategories(res.data))
        .catch((err) => console.log("Category Error:", err));
    }
  }, [companyId]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ ADD JOB
  const Addjob = async () => {

    if (!companyId) {
      return Swal.fire("Error", "Company not logged in", "error");
    }

    if (loading) return;

    const {
      Jobcat_id,
      Job_title,
      skill,
      end_date,
      description,
      location,
      salary,
      jobtype
    } = formData;

    // ✅ Validation
    if (
      !Jobcat_id ||
      !Job_title.trim() ||
      !skill.trim() ||
      !end_date ||
      !description.trim() ||
      !location.trim() ||
      !salary
    ) {
      return Swal.fire("Error", "Fill all required details", "error");
    }

    const payload = {
      Jobcat_id: parseInt(Jobcat_id),
      Job_title: Job_title.trim(),
      skill: skill.trim(),
      end_date,
      description: description.trim(),
      location: location.trim(),
      salary: parseFloat(salary) || 0,
      jobtype,
      Company_id: companyId, // ✅ FIXED (dynamic)
    };

    console.log("Sending Payload:", payload); // 🔍 Debug

    try {
      setLoading(true);

      const res = await Axios.post(
        "http://localhost:1337/api/joblist",
        payload
      );
      

      if (res.data.success) {
        Swal.fire("Success", "Job added successfully", "success");

        // ✅ Reset form
        setFormData({
          Jobcat_id: "",
          Job_title: "",
          skill: "",
          end_date: "",
          description: "",
          location: "",
          salary: "",
          jobtype: "fulltime",
        });

      } else {
        Swal.fire("Error", res.data.error || "Failed to add job", "error");
      }

    } catch (err) {
      console.log("Server Error:", err);
      Swal.fire("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addjob-page">
      <div className="form-card">

        <div className="form-header">Add New Job</div>

        <div className="form-grid">

          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="Job_title"
              value={formData.Job_title}
              onChange={handleChange}
            />
          </div>

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

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

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

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Skills *</label>
            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

        </div>

        <div className="form-actions">
          <button
            className="submit-btn"
            onClick={Addjob}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Job"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Addjoblist;