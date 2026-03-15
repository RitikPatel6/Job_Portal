import React from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Axios from "axios";
import Swal from "sweetalert2";

function Login() {

  function handleLogin(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields"
      });
      return;
    }

    Axios.post("http://localhost:1337/api/userlogin", {
      email: email,
      password: password
    })

    .then((response) => {

      // LOGIN SUCCESS
      if (response.data.success) {

        const user = response.data.data[0];

        // save user id
        localStorage.setItem("userid", user.id);

        // optional session data
        const data = {
          id: user.id,
          email: user.email,
          Name: user.Name
        };

        sessionStorage.setItem("mydata", JSON.stringify(data));

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome ${user.Name}`
        }).then(() => {
          window.location.href = "/";
        });

      }

      // LOGIN FAILED
      else {

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message
        });

      }

    })

    .catch(() => {

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong"
      });

    });

  }

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
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

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