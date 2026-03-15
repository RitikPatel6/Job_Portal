import React from "react";
import "./login.css";
import Swal from "sweetalert2";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const loginadd = () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("Password").value;

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all fields",
      });
      return;
    }

    Axios.post("http://localhost:1337/api/companylogin", {
      email: email,
      password: password,
    })
    .then((response) => {

      if (!response.data.success) {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });

      } else {

        const company = response.data.company;

        const data = {
          Company_id: company.Company_id,
          email: company.email,
        };

        sessionStorage.setItem("companyData", JSON.stringify(data));

        Swal.fire({
          icon: "success",
          title: "Login Successfully",
          text: `Welcome ${company.Company_name}`,
        }).then(() => {

          navigate("/dashboard");   // ✅ redirect

        });

      }

    })
    .catch(() => {

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });

    });

  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h3>Company Login</h3>

        <div className="form-group">
          <input type="email" placeholder="Email" id="email" />
        </div>

        <div className="form-group">
          <input type="password" placeholder="Password" id="Password" />
        </div>

        <button className="login-btn" onClick={loginadd}>
          Login
        </button>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>

      </div>
    </div>
  );
}

export default Login;