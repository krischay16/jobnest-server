import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Job {
  _id: string;
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  type: string;
}

interface Application {
  _id: string;
  job: string; // ObjectId reference
  user: string;
  status: string;
}

interface ApplicationWithJob extends Application {
  jobDetails?: Job;
}

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('id');
      const res = await axiosInstance.get(`/api/applications/${userId}`);
      console.log('Applications data:', res.data);
      
      // Fetch job details for each application
      const applicationsWithJobs = await Promise.all(
        res.data.map(async (app: Application) => {
          try {
            const jobRes = await axiosInstance.get(`/api/jobbyid/${app.job}`);
            return { ...app, jobDetails: jobRes.data };
          } catch (err) {
            console.error(`Failed to load job ${app.job}:`, err);
            return { ...app, jobDetails: null };
          }
        })
      );
      
      setApplications(applicationsWithJobs);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    try {
      await axiosInstance.delete(`/api/application/${applicationId}`);
      alert('✅ Application withdrawn successfully');
      fetchApplications(); // Refresh list
    } catch (err) {
      console.error('Failed to withdraw:', err);
      alert('❌ Failed to withdraw application');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'badge bg-primary';
      case 'reviewing':
        return 'badge bg-info';
      case 'accepted':
        return 'badge bg-success';
      case 'rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

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
      <h2 className="mb-4">My Applications</h2>

      {applications.length === 0 ? (
        <div className="alert alert-info">
          No applications yet. Start applying to jobs!
        </div>
      ) : (
        <div className="row g-3">
          {applications.map((app) => (
            <div key={app._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{app.jobDetails?.title || 'Job Title'}</h5>
                  <h6 className="text-primary mb-3">{app.jobDetails?.company || 'Company'}</h6>
                  
                  <div className="mb-2">
                    <small className="text-muted">📍 {app.jobDetails?.location || 'N/A'}</small>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">💰 {app.jobDetails?.salaryRange || 'N/A'}</small>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">🕒 {app.jobDetails?.type || 'N/A'}</small>
                  </div>

                  <div className="mb-3">
                    <span className={getStatusBadge(app.status)}>
                      {app.status || 'Applied'}
                    </span>
                  </div>

                  {app.status?.toLowerCase() !== 'accepted' && 
                   app.status?.toLowerCase() !== 'rejected' && (
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => handleWithdraw(app._id)}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
