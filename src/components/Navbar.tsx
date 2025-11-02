import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsBriefcaseFill } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserType(storedUserType || '');
    }
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      localStorage.removeItem('id');
      
      setIsLoggedIn(false);
      navigate('/signin');
      window.location.reload();
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" 
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/home">
          <BsBriefcaseFill size={28} className="me-2" />
          <span className="fs-4">JobNest</span>
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {/* Home Link */}
            <li className="nav-item">
              <Link 
                className="nav-link px-3" 
                to="/home"
                style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}
              >
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>

            {/* Jobs Link - Only for logged-in job seekers */}
            {isLoggedIn && userType === 'jobseeker' && (
              <li className="nav-item">
                <Link 
                  className="nav-link px-3" 
                  to="/dashboard/recommendations"
                  style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}
                >
                  <i className="bi bi-briefcase me-1"></i>
                  Find Jobs
                </Link>
              </li>
            )}

            {/* Post Job Link - Only for employers */}
            {isLoggedIn && userType === 'employer' && (
              <li className="nav-item">
                <Link 
                  className="nav-link px-3" 
                  to="/dashboard/post-a-job"
                  style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Post Job
                </Link>
              </li>
            )}

            {/* Conditional: Show Sign In / Sign Up OR Profile */}
            {!isLoggedIn ? (
              <>
                {/* Sign In Link */}
                <li className="nav-item">
                  <Link 
                    className="nav-link px-3" 
                    to="/signin"
                    style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Sign In
                  </Link>
                </li>

                {/* Sign Up Button */}
                <li className="nav-item">
                  <Link 
                    className="btn btn-light px-4 rounded-pill shadow-sm" 
                    to="/signup"
                    style={{ color: '#667eea', fontWeight: 600 }}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Dashboard Link */}
                <li className="nav-item">
                  <Link 
                    className="nav-link px-3" 
                    to='/dashboard/recommendations'
                    style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>

                {/* Profile Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent px-2"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: '36px', height: '36px' }}
                    >{localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
                      <i className="bi bi-person-fill" style={{ color: '#667eea', fontSize: '20px' }}></i>
                    </div>
                    <span className="text-white d-none d-lg-inline fw-semibold">
                      {localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </button>
                  <ul 
                    className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
                    style={{ minWidth: '220px' }}
                    aria-labelledby="profileDropdown"
                  >
                    <li className="px-3 py-2 border-bottom">
                      <small className="text-muted d-block">Signed in as</small>
                      <strong className="d-block text-truncate">{username}</strong>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item py-2" 
                        to={userType === 'employer' ? '/eprofile' : '/cprofile'}
                      >
                        <i className="bi bi-person me-2 text-primary"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/applications">
                        <i className="bi bi-file-earmark-text me-2 text-success"></i>
                        My Applications
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/settings">
                        <i className="bi bi-gear me-2 text-secondary"></i>
                        Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button 
                        className="dropdown-item py-2 text-danger"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
