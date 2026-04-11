import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire("Error", "Fill all fields", "error");
      return;
    }

    try {

      const res = await Axios.post(
        "http://localhost:1337/api/adminlogin",
        form
      );

      if (res.data.status === "success") {

        // ✅ SAVE SESSION
        sessionStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );

        Swal.fire("Success", "Login Successful", "success")
          .then(() => {
            navigate("/dashboard");
          });

      } else {
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <button>Login</button>

        </form>

      </div>

    </div>
  );
}

export default Login;