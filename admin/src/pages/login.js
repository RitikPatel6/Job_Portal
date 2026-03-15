import React from "react";
import "./login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Company Login</h3>

        <form action="/managejoblist">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
