import React, { useEffect, useState } from 'react';
import { FaUser, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  experience?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
}

interface Application {
  _id: string;
  job: string;  // Job ID from API
  user: string; // User ID from API
  status: string;
  userDetails?: User;  // ✅ Add this
  jobDetails?: Job;    // ✅ Add this
}

const Applicants: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const employerId = localStorage.getItem('id');
      
      // Get applications (contains user IDs)
      const res = await axiosInstance.get(`/api/myapplicants/${employerId}`);
      console.log('Applications with IDs:', res.data);
      
      // Fetch full user details for each application
      const applicationsWithUsers = await Promise.all(
        res.data.map(async (app: any) => {
          try {
            console.log(app)
            // Fetch user details using user ID
            const userRes = await axiosInstance.get(`/api/jobseeker/${app.user}`);
            const jobRes = await axiosInstance.get(`/api/jobbyid/${app.job}`);
            
            return {
              ...app,
              userDetails: userRes.data,  // Full user object
              jobDetails: jobRes.data     // Full job object
            };
          } catch (err) {
            console.error(`Failed to load details for application ${app._id}:`, err);
            return {
              ...app,
              userDetails: null,
              jobDetails: null
            };
          }
        })
      );
      
      console.log('Applications with full details:', applicationsWithUsers);
      setApplications(applicationsWithUsers);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    try {
      await axiosInstance.put(`/api/application/${applicationId}`, {
        status: 'shortlisted'
      });
      fetchApplications(); // Refresh list
    } catch (err) {
      console.error('Failed to accept application:', err);
      alert('❌ Failed to shortlist applicant');
    }
  };

  // Separate applications
  const pendingApplications = applications.filter(
    app => app.status !== 'shortlisted' && app.status !== 'rejected'
  );
  const shortlistedApplications = applications.filter(
    app => app.status === 'shortlisted'
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* TOP SECTION - New Applications */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>New Applications</h4>
          <span className="badge bg-primary">{pendingApplications.length}</span>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="alert alert-info">No new applications</div>
        ) : (
          <div className="row g-3">
            {pendingApplications.map((app) => (
              <div key={app._id} className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">
                          <FaUser className="me-2 text-primary" />
                          {app.userDetails?.fullname || 'N/A'}
                        </h6>
                        <small className="text-muted">{app.userDetails?.email || 'N/A'}</small>
                      </div>
                    </div>

                    <div className="mb-2">
                      <strong>Job:</strong> {app.jobDetails?.title || 'N/A'}
                    </div>

                    {app.userDetails?.experience && (
                      <small className="text-muted d-block mb-2">
                        Experience: {app.userDetails.experience} years
                      </small>
                    )}

                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => handleAccept(app._id)}
                    >
                      <FaCheckCircle className="me-1" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* BOTTOM SECTION - Shortlisted */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Shortlisted Candidates</h4>
          <span className="badge bg-success">{shortlistedApplications.length}</span>
        </div>

        {shortlistedApplications.length === 0 ? (
          <div className="alert alert-secondary">No shortlisted candidates yet</div>
        ) : (
          <div className="row g-3">
            {shortlistedApplications.map((app) => (
              <div key={app._id} className="col-md-6">
                <div className="card border-success">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">
                          <FaUser className="me-2 text-success" />
                          {app.userDetails?.fullname || 'N/A'}
                        </h6>
                        <small className="text-muted">{app.userDetails?.email || 'N/A'}</small>
                      </div>
                      <span className="badge bg-success">✓ Shortlisted</span>
                    </div>

                    <div className="mb-2">
                      <strong>Job:</strong> {app.jobDetails?.title || 'N/A'}
                    </div>

                    {app.userDetails?.experience && (
                      <small className="text-muted d-block">
                        Experience: {app.userDetails.experience} years
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
