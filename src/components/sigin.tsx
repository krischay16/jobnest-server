import React, { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
    
      const response = await axios.post('http://localhost:3000/login', { email, password });
    
      const {token,user}= response.data;
      
      // Store JWT in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userType",user.userType);
      localStorage.setItem("username", user.email);
      localStorage.setItem("id",user._id);

      window.location.href = "/dashboard/recommendations"; 
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-start flex-column"
      style={{ minHeight: "100vh", background: "#f5f6fa" }}
    >
      <div className="flex-grow-1 d-flex justify-content-center align-items-center w-100" style={{ minHeight: 'calc(100vh - 62px)' }}>
        <div className="shadow rounded bg-white p-4" style={{
          minWidth: 350,
          maxWidth: 390,
          margin: "60px auto",
          width: "100%"
        }}>
          <div className="text-center fw-semibold fs-4 mb-2 mt-1" style={{ color: "#234e33" }}>
            Welcome Back
          </div>
          <div className="text-center mb-4 text-muted" style={{ fontSize: "1rem" }}>
            Login to your JobNest account
          </div>
          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label fw-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-4 text-start">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                background: "#1a56da",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1.08rem",
                borderRadius: 6,
                boxShadow: "0 2px 8px 0 #eee"
              }}
            >
              Login
            </button>
            <div className="text-center mt-3 mb-1" style={{ fontSize: "1rem" }}>
              Don't have an account?{" "}
              <a className="text-success text-decoration-none" href="/signup">
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
