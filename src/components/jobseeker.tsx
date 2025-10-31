import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link , useNavigate} from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

interface JobSeekerSignupData {
  fullname: string;
  email: string;
  password: string;
  jobpreference: string;
  skill: string;
  userType:string
}

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];


const skillsList = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "Product Management",
  "UX Design",
  "Data Science",
];

const JobSeekerSignup: React.FC = () => {
    
  const [formData, setFormData] = useState<JobSeekerSignupData>({
    fullname: "",
    email: "",
    password: "",
    jobpreference: "",
    skill:"",
    userType:""
  });

  const navigate=useNavigate()
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullname.trim()) newErrors.fullname = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.jobpreference)
      newErrors.jobpreference = "Please select your preferred job type";
    if (!formData.skill) newErrors.skill = "Please select your primary skill";

    return newErrors;
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
    } else {
      setErrors({});
      setSuccessMessage("Signup successful!");
      console.log("Signup Data:", formData);
      // Simulate API call or navigate
      alert("taking you to assessment")
      setTimeout(async()=>{
        const url=`/jobseeker/signup`
        await axiosInstance.post(url, {...formData,userType:'jobseeker'})
        navigate('/assessment')
      },1000)
    
    }

    
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6 p-4 shadow rounded bg-light">
          <h2 className="mb-4 text-center " style={{color:'#764ba2'}}>Create Job Seeker Profile</h2>
        <div className="d-flex justify-content-center mb-4">
              <FaUser size={50} color='#764ba2'/>
            </div>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              Please fix the errors below.
            </div>
          )}

          <form className="text-start" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.fullname && (
                <div className="invalid-feedback">{errors.fullname}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* Job Preference */}
            <div className="mb-3">
              <label htmlFor="jobpreference" className="form-label">
                Job Preferences
              </label>
              <select
                id="jobpreference"
                name="jobpreference"
                className={`form-select ${errors.jobpreference ? "is-invalid" : ""}`}
                value={formData.jobpreference}
                onChange={handleChange}
              >
                <option value="">Select Job Type</option>
                {jobTypes.map((jobType) => (
                  <option key={jobType} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </select>
              {errors.jobpreference && (
                <div className="invalid-feedback">{errors.jobpreference}</div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-3">
              <label htmlFor="skill" className="form-label">
                Skills
              </label>
              <select
                id="skill"
                name="skill"
                className={`form-select ${errors.skill ? "is-invalid" : ""}`}
                value={formData.skill}
                onChange={handleChange}
              >
                <option value="">Select Skill</option>
                {skillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {errors.skill && (
                <div className="invalid-feedback">{errors.skill}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerSignup;
