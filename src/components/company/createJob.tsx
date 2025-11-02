import React, { useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const skillsList = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS'];

interface JobData {
  title: string;
  company: string;
  salaryRange: string;
  skills: string[];
  description: string;
  type: string;
  experience: string;
  location: string;
}

const PostJob: React.FC = () => {
  const [formData, setFormData] = useState<JobData>({
    title: '',
    company: '',
    salaryRange: '',
    skills: [],
    description: '',
    type: '',
    experience: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'skills' && e.target instanceof HTMLSelectElement) {
      const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
      setFormData((prev) => ({ ...prev, skills: selected }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.skills.length === 0) {
      alert('Please select at least one skill');
      return;
    }

    try {
      setLoading(true);
      const employerId = localStorage.getItem('id');

      await axiosInstance.post('/api/job/post', {
        ...formData,
        employer: employerId
      });

      alert('✅ Job posted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        salaryRange: '',
        skills: [],
        description: '',
        type: '',
        experience: '',
        location: ''
      });
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('❌ Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 bg-white border" style={{ maxWidth: '800px' }}>
      <h3 className="mb-4">Post a Job</h3>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Title */}
          <div className="col-md-6">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g., Senior Developer"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Company */}
          <div className="col-md-6">
            <label className="form-label">Company *</label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="e.g., TechCorp India"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Title */}
          <div className="col-12">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="jobtitle"
              className="form-control"
              placeholder="e.g., Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location & salaryRange */}
          <div className="col-md-6">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g., Bangalore"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">salaryRange *</label>
            <input
              type="text"
              name="salaryRange"
              className="form-control"
              placeholder="e.g., ₹8-12 LPA"
              value={formData.salaryRange}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Type & Experience */}
          <div className="col-md-6">
            <label className="form-label">Job Type *</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Experience (years) *</label>
            <input
              type="text"
              name="experience"
              className="form-control"
              placeholder="e.g., 2-4"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          {/* Skills */}
          <div className="col-12">
            <label className="form-label">Skills * <small>(Ctrl+Click for multiple)</small></label>
            <select
              name="skills"
              className="form-select"
              value={formData.skills}
              onChange={handleChange}
              multiple
              size={4}
              required
            >
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            {formData.skills.length > 0 && (
              <div className="mt-1">
                {formData.skills.map((skill) => (
                  <span key={skill} className="badge bg-primary me-1">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Job description..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
