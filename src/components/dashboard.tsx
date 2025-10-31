// DashboardLayout.tsx

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Dashboard: React.FC= () => {
  const location = useLocation();

  // Define items per user role
  const jobSeekerNav = [
    { path: '/dashboard/recommendations', label: 'Job Recommendations', icon: 'bi-briefcase' },
    { path: '/dashboard/applications', label: 'My Applications', icon: 'bi-file-text' },
    { path: '/dashboard/network', label: 'Network', icon: 'bi-people' },
    { path: '/dashboard/profile', label: 'Profile', icon: 'bi-person' }
  ];

  const employerNav = [
    { path: '/dashboard/jobs', label: 'Posted Jobs', icon: 'bi-list-task' },
    { path: '/dashboard/create-job', label: 'Create Job', icon: 'bi-plus-circle' },
    { path: '/dashboard/applications', label: 'Applications', icon: 'bi-inbox' },
    { path: '/dashboard/profile', label: 'Company Profile', icon: 'bi-building' }
  ];

  const userType=localStorage.getItem("userType");
  const navItems = userType === 'jobseeker' ? jobSeekerNav : employerNav;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="bg-white border-end" style={{ width: 280 }}>
        <div className="p-4">
          <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '80px', height: '80px', fontSize: '32px', fontWeight: 'bold' }}
            >
              DU
            </div>
            <h5 className="mb-1">Demo User</h5>
            <small className="text-muted">demo@jobnest.com</small>
          {/* Profile section ... */}
          <nav className="nav flex-column">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link d-flex align-items-center py-3 px-3 mb-1 rounded ${
                  isActive(item.path)
                    ? 'bg-primary bg-opacity-10 text-primary fw-semibold'
                    : 'text-dark'
                }`}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </Link>
            ))}
            <Link to="/logout" className="nav-link text-danger py-3 px-3 mt-3">
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-grow-1" style={{ background: '#f8f9fa' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
