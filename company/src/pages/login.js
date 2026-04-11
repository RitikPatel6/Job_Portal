import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      const res = await axios.post(
        "http://localhost:1337/api/companylogin",
        formData
      );

      if (res.data.success) {
        // Store company session
       sessionStorage.setItem("company", JSON.stringify(res.data.company));

        Swal.fire("Success", "Login Successful", "success");

        // Redirect to dashboard
        navigate("/dashboard");

      } else {
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Server Error", "error");
    }
  };

  return (
  <div className="login-page">
    <div className="login-box">
      <h2>Company Login</h2>
      <p className="login-subtitle">Welcome back! Please login to your account.</p>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Login</button>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>

      </form>
    </div>
  </div>
);
}

export default Login;