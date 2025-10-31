import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsBriefcaseFill } from "react-icons/bs";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark" 
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-briefcase-fill fs-4 me-2"></i>
          <span></span>
          <span className="fs-4"><BsBriefcaseFill size={25} />  JobNest</span>
          
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
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {/* Home Link */}
            <li className="nav-item">
              <Link 
                className="nav-link px-3 fw-semibold" 
                to="/"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>

            {/* Sign In Link */}
            <li className="nav-item">
              <Link 
                className="nav-link px-3 fw-semibold" 
                to="/signin"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
              </Link>
            </li>

            {/* Sign Up Button */}
            <li className="nav-item">
              <Link 
                className="btn btn-light px-4 fw-semibold rounded-pill shadow-sm" 
                to="/signup"
                style={{ color: '#667eea' }}
              >
                <i className="bi bi-person-plus me-1"></i>Sign Up
              </Link>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div 
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-person-fill" style={{ color: '#667eea', fontSize: '20px' }}></i>
                </div>
              </button>
              <ul 
                className="dropdown-menu dropdown-menu-end shadow border-0 mt-2"
                style={{ minWidth: '200px' }}
                aria-labelledby="profileDropdown"
              >
                <li>
                  <Link className="dropdown-item py-2" to="/profile">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/settings">
                    <i className="bi bi-gear me-2"></i>Settings
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item py-2 text-danger" to="/logout">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
