import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import "./editcategory.css";
import { useLocation, useNavigate } from "react-router-dom";

function Editcategory() {

  const location = useLocation();
  const navigate = useNavigate();

  const Jobcat_id = location.state?.Jobcat_id;

  const [categoryData, setCategoryData] = useState({
    Jobcat_name: "",
    Jobcat_description: ""
  });

  /* ================= LOAD CATEGORY ================= */

  useEffect(() => {

    if (!Jobcat_id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Category ID missing"
      });

      navigate("/viewcategory");
      return;
    }

    Axios.post("http://localhost:1337/api/editcategory", {
      Jobcat_id: Jobcat_id
    })
      .then((response) => {

        if (response.data) {

          setCategoryData({
            Jobcat_name: response.data.Jobcat_name || "",
            Jobcat_description: response.data.Jobcat_description || ""
          });

        }

      })
      .catch((err) => {
        console.log(err);
      });

  }, [Jobcat_id, navigate]);



  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setCategoryData((prev) => ({
      ...prev,
      [name]: value
    }));

  };



  /* ================= UPDATE CATEGORY ================= */
const handleSubmit = (e) => {

  e.preventDefault();

  Axios.put("http://localhost:1337/api/updatecategory", {
    Jobcat_id: Jobcat_id,
    Jobcat_name: categoryData.Jobcat_name,
    Jobcat_description: categoryData.Jobcat_description
  })
  .then((res) => {

    if (res.data.success) {

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category Updated Successfully",
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/viewjob");
      }, 1500);

    } else {

      Swal.fire("Error", "Update Failed", "error");

    }

  })
  .catch((err) => {

    console.log(err);

    Swal.fire("Error", "Server Error", "error");

  });

};
  /* ================= UI ================= */

  return (

    <div className="container mt-4">

      <div className="card shadow p-4">

        <h3 className="mb-4">Edit Job Category</h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Job Category Name
            </label>

            <input
              type="text"
              name="Jobcat_name"
              className="form-control"
              value={categoryData.Jobcat_name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Description
            </label>

            <textarea
              name="Jobcat_description"
              className="form-control"
              rows="4"
              value={categoryData.Jobcat_description}
              onChange={handleChange}
            ></textarea>

          </div>


          <button
            type="submit"
            className="btn btn-success"
          >
            Update Category
          </button>

        </form>

      </div>

    </div>

  );

}

export default Editcategory;