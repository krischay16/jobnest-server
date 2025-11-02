import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaCheckCircle, FaStar, FaSearch, FaChartLine } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to login/signup with search query
      if (localStorage.getItem('token')) {
        navigate(`/dashboard/recommendations`);
      } else {
      navigate(`/signin`);
    }
  }
};

  return (
    <div>
      {/* Hero Section with Tagline and Search */}
      <section className="py-5 mt-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '60vh' }}>
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-10 mx-auto text-center text-white">
              <h1 className="display-3 fw-bold mb-3">Your Career Starts Here</h1>
              <p className="lead mb-5">
                Discover opportunities that match your skills. Connect with top employers today.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mx-auto" style={{ maxWidth: '600px' }}>
                <div className="input-group input-group-lg shadow">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for jobs, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-warning" type="submit">
                    <FaSearch className="me-2" />
                    Search Jobs
                  </button>
                </div>
                <small className="text-white d-block mt-2 opacity-75">
                  Sign in to apply for jobs and track your applications
                </small>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Cards */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Our Services</h2>
            <p className="text-muted">Everything you need for your job search journey</p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '70px', height: '70px' }}>
                    <FaBriefcase className="text-success" style={{ fontSize: '2rem' }} />
                  </div>
                  <h5 className="fw-semibold mb-2">Job Listings</h5>
                  <p className="text-muted small mb-0">
                    Browse hundreds of job openings from verified employers across various industries
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '70px', height: '70px' }}>
                    <FaChartLine className="text-warning" style={{ fontSize: '2rem' }} />
                  </div>
                  <h5 className="fw-semibold mb-2">Skill Matching</h5>
                  <p className="text-muted small mb-0">
                    Get matched with jobs based on your skills, experience, and career preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '70px', height: '70px' }}>
                    <FaStar className="text-info" style={{ fontSize: '2rem' }} />
                  </div>
                  <h5 className="fw-semibold mb-2">Skill Assessment</h5>
                  <p className="text-muted small mb-0">
                    Take quizzes to rate your skills and improve your profile visibility to employers
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '70px', height: '70px' }}>
                    <FaCheckCircle className="text-danger" style={{ fontSize: '2rem' }} />
                  </div>
                  <h5 className="fw-semibold mb-2">Application Tracking</h5>
                  <p className="text-muted small mb-0">
                    Track all your applications and get real-time updates on your application status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">How It Works</h2>
            <p className="text-muted">Get started in 3 simple steps</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="mb-3">
                <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  1
                </div>
              </div>
              <h5 className="fw-semibold mb-2">Sign Up</h5>
              <p className="text-muted">Create your account as a job seeker or employer</p>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <div className="rounded-circle bg-warning text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  2
                </div>
              </div>
              <h5 className="fw-semibold mb-2">Build Profile</h5>
              <p className="text-muted">Add your skills, experience, and take skill assessments</p>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <div className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  3
                </div>
              </div>
              <h5 className="fw-semibold mb-2">Get Hired</h5>
              <p className="text-muted">Apply to jobs and connect with employers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
            <p className="text-muted">Choose how you want to join our platform</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="card border-0 shadow h-100">
                <div className="card-body text-center p-5">
                  <FaUsers className="text-success mb-4" style={{ fontSize: '4rem' }} />
                  <h4 className="fw-semibold mb-3">For Job Seekers</h4>
                  <p className="text-muted mb-4">
                    Find your dream job, track applications, and showcase your skills
                  </p>
                  <Link to="/jsp" className="btn btn-success btn-lg w-100 mb-3">
                    Sign Up as Job Seeker
                  </Link>
                  <small className="text-muted">
                    Already have an account? <Link to="/signin" className="text-success">Login</Link>
                  </small>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="card border-0 shadow h-100">
                <div className="card-body text-center p-5">
                  <FaBriefcase className="text-warning mb-4" style={{ fontSize: '4rem' }} />
                  <h4 className="fw-semibold mb-3">For Employers</h4>
                  <p className="text-muted mb-4">
                    Post jobs, find qualified candidates, and build your team
                  </p>
                  <Link to="/cp" className="btn btn-warning btn-lg w-100 mb-3">
                    Sign Up as Employer
                  </Link>
                  <small className="text-muted">
                    Already have an account? <Link to="/signin" className="text-warning">Login</Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white text-center">
        <div className="container">
          <p className="mb-0">&copy; 2025 JobPortal. Connecting talent with opportunity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
