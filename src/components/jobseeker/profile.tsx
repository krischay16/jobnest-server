import React, { useEffect, useState, ChangeEvent } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaStar, FaEdit, FaSave, FaTimes, FaLinkedin, FaGithub, FaCode } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Skill {
  skill: string;
  value: number;
  _id?: string;
}

interface JobSeeker {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  experience?: string;
  skill?: string[];
  score?: Skill[];
  jobpreference?: string[];
  linkedin?: string;
  github?: string;
  leetcode?: string;
}

const skillsList = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const JobSeekerProfile: React.FC = () => {
  const [profile, setProfile] = useState<JobSeeker | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<JobSeeker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/jobseeker');
      console.log('Profile data:', res.data);
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'skill' && e.target instanceof HTMLSelectElement) {
      const selected = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => prev ? { ...prev, skill: selected } : null);
      return;
    }

    if (name === 'jobpreference' && e.target instanceof HTMLSelectElement) {
      const selected = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => prev ? { ...prev, jobpreference: selected } : null);
      return;
    }

    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSkillRatingChange = (skillName: string, value: number) => {
    setFormData(prev => {
      if (!prev) return null;
      
      const updatedScore = prev.score ? [...prev.score] : [];
      const existingIndex = updatedScore.findIndex(s => s.skill === skillName);
      
      if (existingIndex >= 0) {
        updatedScore[existingIndex].value = value;
      } else {
        updatedScore.push({ skill: skillName, value });
      }
      
      return { ...prev, score: updatedScore };
    });
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      await axiosInstance.put('/api/jobseeker', formData);
      alert('✅ Profile updated successfully!');
      setProfile(formData);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('❌ Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-inline-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-warning' : 'text-muted'}
            size={16}
          />
        ))}
      </div>
    );
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

  if (!profile || !formData) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      {/* Header Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {profile.fullname?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ms-4">
                {editMode ? (
                  <input
                    type="text"
                    name="fullname"
                    className="form-control"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                ) : (
                  <>
                    <h3 className="mb-1">{profile.fullname || 'N/A'}</h3>
                    <p className="text-muted mb-0">Job Seeker</p>
                  </>
                )}
              </div>
            </div>

            {!editMode ? (
              <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>
                <FaEdit className="me-1" /> Edit Profile
              </button>
            ) : (
              <div>
                <button className="btn btn-success me-2" onClick={handleSave}>
                  <FaSave className="me-1" /> Save
                </button>
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                  <FaTimes className="me-1" /> Cancel
                </button>
              </div>
            )}
          </div>

          <hr />

          {/* Contact Info */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaEnvelope className="text-primary me-2" />
                <strong>Email</strong>
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <div>{profile.email || 'N/A'}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaPhone className="text-primary me-2" />
                <strong>Phone</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>{profile.phoneNumber || 'N/A'}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaBriefcase className="text-primary me-2" />
                <strong>Experience (years)</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={formData.experience || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>{profile.experience || 'N/A'}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="mb-3">Social Media Profiles</h5>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">
                <FaLinkedin className="text-primary me-2" style={{ fontSize: '1.2rem' }} />
                <strong>LinkedIn</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="linkedin"
                  className="form-control"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  {profile.linkedin ? (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View Profile
                    </a>
                  ) : (
                    <span className="text-muted">Not provided</span>
                  )}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                <FaGithub className="text-dark me-2" style={{ fontSize: '1.2rem' }} />
                <strong>GitHub</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="github"
                  className="form-control"
                  placeholder="https://github.com/yourusername"
                  value={formData.github || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  {profile.github ? (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-dark">
                      View Profile
                    </a>
                  ) : (
                    <span className="text-muted">Not provided</span>
                  )}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                <FaCode className="text-warning me-2" style={{ fontSize: '1.2rem' }} />
                <strong>LeetCode</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="leetcode"
                  className="form-control"
                  placeholder="https://leetcode.com/yourusername"
                  value={formData.leetcode || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  {profile.leetcode ? (
                    <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="text-warning">
                      View Profile
                    </a>
                  ) : (
                    <span className="text-muted">Not provided</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="mb-3">Skills</h5>

          {editMode ? (
            <>
              <label className="form-label">Select Skills (Ctrl+Click for multiple)</label>
              <select
                name="skill"
                className="form-select mb-3"
                value={formData.skill || []}
                onChange={handleChange}
                multiple
                size={5}
              >
                {skillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>

              {formData.skill && formData.skill.length > 0 && (
                <>
                  <h6 className="mt-4 mb-3">Rate Your Skills:</h6>
                  <div className="row">
                    {formData.skill.map((skillName, idx) => {
                      const currentRating = formData.score?.find(s => s.skill === skillName)?.value || 0;
                      return (
                        <div key={idx} className="col-md-6 mb-3">
                          <div className="border rounded p-3">
                            <label className="form-label fw-semibold">{skillName}</label>
                            <select
                              className="form-select"
                              value={currentRating}
                              onChange={(e) => handleSkillRatingChange(skillName, parseInt(e.target.value))}
                            >
                              <option value={0}>Select rating</option>
                              <option value={1}>1 - Beginner</option>
                              <option value={2}>2 - Elementary</option>
                              <option value={3}>3 - Intermediate</option>
                              <option value={4}>4 - Advanced</option>
                              <option value={5}>5 - Expert</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {profile.skill && profile.skill.length > 0 ? (
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Listed Skills:</h6>
                  <div>
                    {profile.skill.map((skillName, idx) => (
                      <span key={idx} className="badge bg-light text-dark me-2 mb-2">
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted">No skills listed</p>
              )}

              {profile.score && profile.score.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-muted mb-3">Skill Ratings:</h6>
                  <div className="row">
                    {profile.score.map((item, idx) => (
                      <div key={idx} className="col-md-6 mb-3">
                        <div className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>{item.skill}</strong>
                            <span className="badge bg-primary">{item.value}/5</span>
                          </div>
                          <div className="mt-2">{renderStars(item.value)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Job Preferences */}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h5 className="mb-3">Job Preferences</h5>

          {editMode ? (
            <select
              name="jobpreference"
              className="form-select"
              value={formData.jobpreference || []}
              onChange={handleChange}
              multiple
              size={4}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          ) : (
            <>
              {profile.jobpreference && profile.jobpreference.length > 0 ? (
                <div>
                  {profile.jobpreference.map((pref, idx) => (
                    <span key={idx} className="badge bg-success me-2 mb-2">
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No preferences set</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
