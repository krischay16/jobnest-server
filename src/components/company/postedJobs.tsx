import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';

interface Job {
  _id: string;
  title: string;
  company: string;
  jobtitle: string;
  location: string;
  salary: string;
  preference: string;
  experience: string;
  skills: string[];
  description: string;
}

const PostedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const employerId = localStorage.getItem('id');
      console.log(employerId)
      const res = await axiosInstance.get(`/api/jobsbyemployee/${employerId}`);
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/job/${jobId}`);
      alert('✅ Job deleted successfully');
      fetchJobs(); // Refresh list
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('❌ Failed to delete job');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Posted Jobs</h3>
        <span className="badge bg-primary">{jobs.length} Jobs</span>
      </div>

      {jobs.length === 0 ? (
        <div className="alert alert-info">
          <FaBriefcase className="me-2" />
          No jobs posted yet. Start posting to attract candidates!
        </div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div key={job._id} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{job.title || job.jobtitle}</h5>
                      <h6 className="text-primary mb-2">{job.company}</h6>
                      
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <small className="text-muted">
                            <FaMapMarkerAlt className="me-1" />
                            {job.location}
                          </small>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">💰 {job.salary}</small>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">🕒 {job.preference}</small>
                        </div>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">Experience: {job.experience} years</small>
                      </div>

                      <div className="mb-2">
                        {job.skills?.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="badge bg-light text-dark me-1 mb-1">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 5 && (
                          <span className="badge bg-light text-dark">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>

                      <p className="text-muted small mb-0">
                        {job.description.substring(0, 150)}
                        {job.description.length > 150 && '...'}
                      </p>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm ms-3"
                      onClick={() => handleDelete(job._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
