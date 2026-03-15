import React, { useState, useEffect} from "react";
import Axios from "axios";
import "./viewjob.css";
import {Link} from "react-router-dom";

function Viewjob() {
 function deleteJobCategory(id) {
  Axios.delete(`http://localhost:1337/api/deletejobcategory/${id}`)
    .then((res) => {
      alert("Job category deleted successfully");
      setList(list.filter((item) => item.Jobcat_id !== id));
    })
    .catch((err) => {
      console.log(err);
    });
}
  const [list, setList] = useState([]);

  // GET DATA
  useEffect(() => {
  Axios.get("http://localhost:1337/api/jobcategories")
    .then((response) => {
      setList(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);   // IMPORTANT

  return (
    <div className="job-container">
      <div className="job-card">
        <div className="job-header">Job List</div>

        <div className="job-table-wrapper">
          <table className="job-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((Val, index) => (
               <tr key={Val["Jobcat_id"]}>
                  <td>{index + 1}</td>
                  <td>{Val.Jobcat_name}</td>
                  <td>{Val.Jobcat_description}</td>
                  <td>
                    <Link to ='/editcategory'state={{Jobcat_id:Val.Jobcat_id}} class="btn-success">Edit</Link>

                    <button
                      className="delete-btn"
                      onClick={() => deleteJobCategory(Val.Jobcat_id)}
                    >
                      Delete
                    </button>
                  </td>
                  
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="4">No Categories Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Viewjob;
