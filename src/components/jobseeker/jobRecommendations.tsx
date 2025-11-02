// JobRecommendations.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaCheck,
} from "react-icons/fa";

interface Job {
  id: string;
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  skills?: string[];
  salaryRange?: string;
  type?: string;
  applied?: boolean;
}

const JobRecommendations: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<Job[]>("/api/jobs/");
      const data = (response.data || []).map((j) => ({
        ...j,
        applied: !!j.applied,
      }));
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load job recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j))
      );
      console.log("Applying to job ID:", jobId);
      Navigate(`/apply/${jobId}`);
    } catch (err) {
      console.error("Apply failed:", err);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, applied: false } : j))
      );
      setError("Failed to apply to the job. Please try again.");
    }
  };

  // ✅ Fix: safe filter using optional chaining and default values
  const filteredJobs = jobs.filter((j) => {
    const title = j.title?.toLowerCase() || "";
    const company = j.company?.toLowerCase() || "";
    const skills = Array.isArray(j.skills)
      ? j.skills.join(" ").toLowerCase()
      : "";
    const query = searchQuery.toLowerCase();
    return (
      title.includes(query) || company.includes(query) || skills.includes(query)
    );
  });

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary mb-0">Recommended Jobs For You</h3>
        <div className="input-group shadow-sm" style={{ width: 340 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by title, company or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading and Errors */}
      {loading && (
        <div className="text-center py-4 fw-semibold">Loading jobs...</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredJobs.length === 0 && (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-briefcase fs-1 mb-2 d-block"></i>
          <p>No matching jobs found.</p>
        </div>
      )}

      {/* Job Cards */}
      <div className="row g-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="col-lg-4 col-md-6">
            <div
              className="card border-0 shadow-sm h-100 job-card"
              style={{
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="card-body d-flex flex-column">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-semibold mb-1 text-dark">
                      {job.title || "Untitled Job"}
                    </h5>
                    <p className="text-muted mb-0">
                      {job.company || "Unknown Company"}
                    </p>
                  </div>
                  {job.type && (
                    <span className="badge bg-primary-subtle text-primary">
                      <FaBriefcase className="me-1" />
                      {job.type}
                    </span>
                  )}
                </div>

                {/* Job Meta */}
                <ul className="list-unstyled small text-muted mb-3">
                  {job.location && (
                    <li className="mb-1">
                      <FaMapMarkerAlt className="me-2 text-danger" />
                      {job.location}
                    </li>
                  )}
                  {job.salaryRange && (
                    <li>
                      <FaDollarSign className="me-2 text-success" />
                      {job.salaryRange}
                    </li>
                  )}
                </ul>

                {/* Description */}
                <p
                  className="card-text text-secondary mb-3"
                  style={{
                    minHeight: "60px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {job.description || "No description provided."}
                </p>

                {/* Skills */}
                <div className="mb-3">
                  {Array.isArray(job.skills) && job.skills.length > 0 ? (
                    job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge bg-light text-dark border me-2 mb-2"
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: "20px",
                          padding: "5px 10px",
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">No skills listed</span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <small className="text-muted">Job ID: {job.id}</small>
                  <button
                    className={`btn btn-sm ${
                      job.applied ? "btn-success" : "btn-primary"
                    }`}
                    onClick={() => !job.applied && handleApply(job.id)}
                    disabled={job.applied}
                    style={{ minWidth: "90px" }}
                  >
                    {job.applied ? (
                      <>
                        <FaCheck className="me-1" /> Applied
                      </>
                    ) : (
                      "Apply"
                    )}
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
