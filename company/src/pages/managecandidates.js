import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./managecandidates.css";

function ManageCandidates() {

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);

  /* ===== GET COMPANY FROM SESSION ===== */
  useEffect(() => {
    const data = sessionStorage.getItem("company");

    if (data) {
      const company = JSON.parse(data);

      // ✅ handle both Company_id and id
      const id = company?.Company_id || company?.id;

      console.log("Company Data:", company);
      console.log("Company ID:", id);

      setCompanyId(id);
    }
  }, []);

  /* ===== FETCH ALL CANDIDATES ===== */
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const res = await Axios.get(
        "http://localhost:1337/api/manage-candidates"
      );

      console.log("API Data:", res.data);

      if (res.data.success) {
        setCandidates(res.data.data);
      } else {
        setCandidates([]);
      }

    } catch (err) {
      console.log("Error:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== UPDATE STATUS ===== */
  const updateStatus = async (id, status) => {
    await Axios.put(
      `http://localhost:1337/api/update-status/${id}`,
      { status }
    );
    fetchCandidates();
  };

  /* ===== DELETE ===== */
  const deleteCandidate = async (id) => {
    await Axios.delete(
      `http://localhost:1337/api/delete-application/${id}`
    );
    fetchCandidates();
  };

  /* ===== FILTER BY COMPANY ===== */
  const filteredCandidates = candidates.filter(
    (c) => Number(c.Company_id) === Number(companyId)
  );

  return (
    <div className="manage-page">
      <h2 className="manage-title">Manage Candidates</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Job</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.Job_title}</td>

                    <td>
                      <span className={`status ${c.status}`}>
                        {c.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn shortlist"
                        onClick={() => updateStatus(c.id, "Shortlisted")}
                      >
                        Shortlist
                      </button>

                      <button
                        className="btn reject"
                        onClick={() => updateStatus(c.id, "Rejected")}
                      >
                        Reject
                      </button>

                      <button
                        className="btn delete"
                        onClick={() => deleteCandidate(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No Candidates Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageCandidates;