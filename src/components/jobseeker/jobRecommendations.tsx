// ...existing code...
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  skills: string[];
  salaryRange?: string;
  type?: string;
  applied?: boolean;
}

const JobRecommendations: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get<Job[]>('/api/job/')
      // Ensure applied flag exists
      const data = (response.data || []).map(j => ({ ...j, applied: !!j.applied }));
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      // optimistic UI update
      setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, applied: true } : j)));
      await axios.post(
        `/api/jobs/${jobId}/apply`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      // Optionally refetch or rely on optimistic update
    } catch (err) {
      console.error('Apply failed:', err);
      // revert optimistic update on failure
      setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, applied: false } : j)));
      setError('Failed to apply to the job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(
    j =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Job Recommendations</h2>
        <div className="input-group" style={{ width: 320 }}>
          <span className="input-group-text bg-white">
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search jobs, companies or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search jobs"
          />
        </div>
      </div>

      {loading && <div className="text-center py-4">Loading jobs...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredJobs.length === 0 && <div>No matching jobs found.</div>}

      <div className="row g-3">
        {filteredJobs.map(job => (
          <div key={job.id} className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="mb-2 d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">{job.title}</h5>
                    <p className="text-muted mb-0">{job.company}{job.location ? ` • ${job.location}` : ''}</p>
                  </div>
                  <div className="text-end">
                    {job.salaryRange && <div className="text-success fw-bold">{job.salaryRange}</div>}
                    {job.type && <small className="badge bg-secondary">{job.type}</small>}
                  </div>
                </div>

                <p className="card-text mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </p>

                <div className="mb-3">
                  {job.skills.map(skill => (
                    <span key={skill} className="badge bg-light text-dark me-2 mb-2" style={{ fontSize: 12 }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <small className="text-muted">Job ID: {job.id}</small>
                  <button
                    className={`btn btn-sm ${job.applied ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => !job.applied && handleApply(job.id)}
                    disabled={job.applied}
                  >
                    {job.applied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;