import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      Swal.fire("Warning", "Please fill all fields", "warning");
      return;
    }

    try {
      const res = await Axios.post("http://localhost:1337/api/userlogin", form);

      if (res.data.success) {
        // Save session
        sessionStorage.setItem("userData", JSON.stringify(res.data.data));

        Swal.fire("Success", `Welcome ${res.data.data.Name}`, "success").then(() => {
          navigate("/"); // Redirect after login
        });
      } else {
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <h1>Job Portal</h1>
          <p>Find your dream job with thousands of opportunities.</p>
        </div>

        <div className="login-right">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="login-btn">Login</button>

            <p className="register-link">
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;