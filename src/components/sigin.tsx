import React, { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaLock, FaBriefcase } from 'react-icons/fa';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      const { token, user } = response.data;
      
      // Store JWT in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userType", user.userType);
      localStorage.setItem("username", user.email);
      localStorage.setItem("id", user._id);

      window.location.href = "/dashboard/recommendations"; 
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'white' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg border-0 overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Branding */}
                <div className="col-md-5 text-white p-5 d-flex flex-column justify-content-center"
                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="mb-4">
                    <FaBriefcase style={{ fontSize: '4rem', opacity: 0.9 }} />
                  </div>
                  <h2 className="fw-bold mb-3">Welcome to JobNest</h2>
                  <p className="mb-4 opacity-90">
                    Sign in to discover your next career opportunity and connect with top employers.
                  </p>
                  <div className="mt-auto">
                    <p className="mb-2">Don't have an account?</p>
                    <a href="/signup" className="btn btn-light btn-sm">
                      Sign Up Now
                    </a>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-7 p-5">
                  <div className="mb-4">
                    <h3 className="fw-bold mb-2">Welcome Back</h3>
                    <p className="text-muted">Enter your credentials to access your account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                    {/* Email */}
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <input
                          type="email"
                          id="email"
                          className="form-control border-start-0 ps-0"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          id="password"
                          className="form-control border-start-0 ps-0"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" />
                        <label className="form-check-label text-muted small" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                      <a href="/forgot-password" className="text-decoration-none small">
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn w-100 text-white py-2 fw-semibold"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="position-relative my-4">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                      OR
                    </span>
                  </div>

                  {/* Signup Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-decoration-none fw-semibold" style={{ color: '#667eea' }}>
                        Sign up here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
