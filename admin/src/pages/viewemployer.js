import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./viewemployer.css";
import Swal from "sweetalert2";

const ViewEmployer = () => {
  const [employers, setEmployers] = useState([]);

  // Fetch data
  const fetchData = () => {
    Axios.get("http://localhost:1337/api/getemployers")
      .then((res) => {
        setEmployers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      Axios.delete(`http://localhost:1337/api/deleteemployer/${id}`)
        .then(() => {
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // EDIT (simple prompt method)
  const handleEdit = (item) => {
    const newName = prompt("Enter Company Name:", item.Company_name);
    const newContact = prompt("Enter Contact No:", item.contact_no);
    const newEmail = prompt("Enter Email:", item.email);
    const newLocation = prompt("Enter Location:", item.location);

    if (newName && newContact && newEmail && newLocation) {
      Axios.put(
        `http://localhost:1337/api/updateemployer/${item.Company_id}`,
        {
          Company_name: newName,
          contact_no: newContact,
          email: newEmail,
          location: newLocation,
        }
      )
        .then(() => {
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

const handleApprove = (Company_id) => {

  Axios.post("http://localhost:1337/api/approveemployer", {
    Company_id: Company_id
  })
  .then((response) => {

    Swal.fire({
      icon: "success",
      title: "Success",
      text: response.data.message || "Employer approved successfully",
      confirmButtonText: "OK"
    }).then(() => {
      fetchData();   // refresh table
    });

  })
  .catch((error) => {
    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong"
    });
  });

};
const handleReject = (Company_id) => {

  Axios.post("http://localhost:1337/api/rejectemployer", {
    Company_id: Company_id
  })
  .then((response) => {

    Swal.fire({
      icon: "warning",
      title: "Rejected",
      text: response.data.message || "Employer rejected successfully",
      confirmButtonText: "OK"
    }).then(() => {
      fetchData();   // refresh table
    });

  })
  .catch((error) => {
    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong"
    });
  });

};
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h2>View Employers</h2>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th>Contact No</th>
                <th>Email</th>
                <th>Location</th>
                <th>ID Proof</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employers.map((item, index) => (
                <tr key={item.Company_id}>
                  <td>{index + 1}</td>
                  <td>{item.Company_name}</td>
                  <td>{item.contact_no}</td>
                  <td>{item.email}</td>
                  <td>{item.location}</td>

                  <td>
                    {item.id_proof ? (
                      <img
                        src={`http://localhost:1337/uploads/${item.id_proof}`}
                        alt="ID Proof"
                        width="60"
                        height="60"
                        style={{
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>

                  {/* 🔥 Action Buttons */}
               <td>
  {item.status === 0 ? (
    <>
      <button
        onClick={() => handleApprove(item.Company_id)}
        className="btn btn-success"
      >
        Approve
      </button>

      <button
        onClick={() => handleReject(item.Company_id)}
        className="btn btn-danger"
        style={{ marginLeft: "10px" }}
      >
        Reject
      </button>
    </>
  ) : item.status === 1 ? (
    <span className="text-success">Approved</span>
  ) : item.status === 2 ? (
    <span className="text-danger">Rejected</span>
  ) : null}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployer;