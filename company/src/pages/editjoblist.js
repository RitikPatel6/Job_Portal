import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./addjoblist.css";
import { useLocation, useNavigate } from "react-router-dom";

function Editjoblist() {

  const location = useLocation();
  const navigate = useNavigate();

  const Job_id = location.state?.Job_id;

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    Jobcat_id: "",
    Job_title: "",
    skill: "",
    end_date: "",
    description: "",
    location: "",
    salary: "",
    jobtype: "fulltime"
  });

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    Axios.get("http://localhost:1337/api/jobcategories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /* ================= LOAD JOB DATA ================= */

  useEffect(() => {

    if (!Job_id) return;

    Axios.post("http://localhost:1337/api/editjoblist", { Job_id })
      .then((res) => {

        const job = res.data;

        setFormData({
          Jobcat_id: job.Jobcat_id || "",
          Job_title: job.Job_title || "",
          skill: job.skill || "",
          end_date: job.end_date?.split("T")[0] || "",
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          jobtype: job.jobtype || "fulltime"
        });

      })
      .catch((err) => {
        console.log(err);
      });

  }, [Job_id]);

  /* ================= HANDLE INPUT CHANGE ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ================= UPDATE JOB ================= */

  const updateJob = async () => {

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

    if (
      !Jobcat_id ||
      !Job_title ||
      !skill ||
      !end_date ||
      !description ||
      !location ||
      !salary
    ) {
      return Swal.fire("Error", "Fill all required fields", "error");
    }

    try {

      await Axios.post("http://localhost:1337/api/updatejoblist", {
        Job_id,
        ...formData
      });

      Swal.fire("Success", "Job Updated Successfully", "success");

      navigate("/viewjoblist");

    } catch (err) {

      console.log(err);

      Swal.fire("Error", "Update Failed", "error");

    }

  };

  return (
    <div className="addjob-page">
      <div className="form-card">
        <div className="form-header">Edit Job</div>

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
          <button
            type="button"
            className="submit-btn"
            onClick={updateJob}
          >
            Update Job
          </button>
        </div>

      </div>
    </div>
  );
}

export default Editjoblist;