import React from "react";
import { Link, Outlet, useLocation , useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate=useNavigate()
  // Define items per user role
  const jobSeekerNav = [
    { path: "/dashboard/recommendations", label: "Job Recommendations", icon: "bi-briefcase" },
    { path: "/dashboard/applications", label: "My Applications", icon: "bi-file-text" },
    { path: "/dashboard/chat", label: "Chat", icon: "bi-people" },
    { path: "/dashboard/cprofile", label: "Profile", icon: "bi-person" },
  ];

  const employerNav = [
    { path: "/dashboard/posted-jobs", label: "Posted Jobs", icon: "bi-list-task" },
    { path: "/dashboard/post-a-job", label: "Post a Job", icon: "bi-plus-circle" },
    { path: "/dashboard/applicants", label: "Your Applicants", icon: "bi-inbox" },
    { path: "/dashboard/chat", label: "Chat", icon: "bi-people" },
    { path: "/dashboard/eprofile", label: "Company Profile", icon: "bi-building" },
  ];

  const userType = localStorage.getItem("userType");
  const navItems = userType === "jobseeker" ? jobSeekerNav : employerNav;
  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="d-flex" style={{ width: "100vw", minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        className="bg-white border-end d-flex flex-column justify-content-between shadow-sm"
        style={{
          width: "20vw",
          minWidth: "260px",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Profile Section */}
        <div className="p-4 text-center border-bottom">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
            style={{
              width: "90px",
              height: "90px",
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            {localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
          </div>
          <h5 className="mb-0 fw-semibold">{localStorage.getItem('name')||"User"}</h5>
          <small className="text-muted">{localStorage.getItem('username')}</small>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column px-3 py-4 flex-grow-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link d-flex align-items-center py-3 px-3 mb-2 rounded-3 ${
                isActive(item.path)
                  ? "bg-primary bg-opacity-10 text-primary fw-semibold"
                  : "text-dark"
              }`}
            >
              <i className={`bi ${item.icon} me-3 fs-5`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

<div className="p-3 border-top">
  <div
    onClick={handleLogout}
    className="nav-link text-danger d-flex align-items-center justify-content-center fw-semibold py-2"
    style={{ cursor: 'pointer' }}
  >
    <i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout
  </div>
</div>
</div>


      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          width: "80vw",
          background: "#f8f9fa",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
