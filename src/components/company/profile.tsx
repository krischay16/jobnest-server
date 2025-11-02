import React, { useEffect, useState, ChangeEvent } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaLinkedin, FaGlobe, FaIndustry } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


interface Employer {
  _id: string;
  companyname: string;
  email: string;
  phoneNumber?: string;
  description?: string;
  industry?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}

const EmployerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Employer | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const employerId = localStorage.getItem('id');
      
      if (!employerId) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const res = await axiosInstance.get(`/api/employer/${employerId}`);
      console.log('Employer data:', res.data);
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const employerId = localStorage.getItem('id');
      await axiosInstance.put(`/api/employer/${employerId}`, formData);
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      
      alert('✅ Logged out successfully!');
      navigate('/login');
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
                {profile.companyname?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="ms-4">
                {editMode ? (
                  <input
                    type="text"
                    name="companyname"
                    className="form-control"
                    value={formData.companyname}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />
                ) : (
                  <>
                    <h3 className="mb-1">{profile.companyname || 'N/A'}</h3>
                    <p className="text-muted mb-0">Employer</p>
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
                <FaIndustry className="text-primary me-2" />
                <strong>Industry</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="industry"
                  className="form-control"
                  placeholder="e.g., IT Services, Healthcare"
                  value={formData.industry || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>{profile.industry || 'N/A'}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaBuilding className="text-primary me-2" />
                <strong>Location</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g., Bangalore, India"
                  value={formData.location || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>{profile.location || 'N/A'}</div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">
              <strong>Company Description</strong>
            </label>
            {editMode ? (
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Tell us about your company..."
                value={formData.description || ''}
                onChange={handleChange}
              />
            ) : (
              <div className="text-muted">
                {profile.description || 'No description provided'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="mb-3">Company Links</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaGlobe className="text-primary me-2" style={{ fontSize: '1.2rem' }} />
                <strong>Website</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="website"
                  className="form-control"
                  placeholder="https://www.yourcompany.com"
                  value={formData.website || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                      Visit Website
                    </a>
                  ) : (
                    <span className="text-muted">Not provided</span>
                  )}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaLinkedin className="text-primary me-2" style={{ fontSize: '1.2rem' }} />
                <strong>LinkedIn</strong>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="linkedin"
                  className="form-control"
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  {profile.linkedin ? (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View LinkedIn
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

      
    </div>
  );
};

export default EmployerProfile;
