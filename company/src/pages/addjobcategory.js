import React from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./addjobcategory.css"; // make sure this file exists  
function AddJobCategory() {

function jobcatadd() {
  
  const Jobcat_name = document.getElementById("Jobcat_name").value;
  
  const Jobcat_description = document.getElementById("Jobcat_description").value;

  if (!Jobcat_name || !Jobcat_description) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "All fields are required!",
    });
    return;
  }
  
  Axios.post("http://localhost:1337/api/jobcategories", {
    Jobcat_name: Jobcat_name,
    Jobcat_description: Jobcat_description
  }).then((response) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: response.data.message,
      confirmButtonText: "OK",
    }).then(() => {
      // Clear form fields after successful submission
      window.location = "/addjobcategory"; // Redirect to the same page to clear the form
    });
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response ? error.response.data.message : "An error occurred while adding the job category.",
    });
  });

}
  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Add Job Category</h3>
        
          <div className="mb-3">
            <label className="form-label">Job Category Name</label>
            <input
              type="text"
              name="jobcat_name"
              id="Jobcat_name"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="jobcat_description"
              id="Jobcat_description"
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success" onClick={jobcatadd}>
            Add Category
          </button>
       
      </div>
    </div>
  );
}

export default AddJobCategory;