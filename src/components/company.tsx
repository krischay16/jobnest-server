import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link , useNavigate} from 'react-router-dom'
import axios from "axios";
import { FaBuilding } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
interface companyData {
  companyname: string;
  email: string;
  description:string;
  phoneNumber:string;
  password: string;
  industry:string;
}


const industryList = [
  "Technology",
  "Healthcare",
  "Finance",
  "Marketing",
  "Education",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Consulting",
];

const CompanySignUp: React.FC = () => {
    
  const [formData, setFormData] = useState<companyData>({
    companyname: "",
    email: "",
    password: "",
    description:"",
    phoneNumber:"",
    industry:""
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

    if (!formData.companyname.trim()) newErrors.companyname = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.industry)
      newErrors.industry = "Please select your industry type";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
    } else {
      setErrors({});
      setSuccessMessage("Signup successful!");
      
      setTimeout(async()=>{
      await axiosInstance.post('/employer/signup', {...formData,userType:'employer'})
      navigate('/signin');
    },1000)
      console.log("Signup Data:", formData);
      // Simulate API call or navigate
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6 p-4 shadow rounded bg-light">
          <h2 className="mb-4 text-center text-primary" style={{color:'#764ba2'}}>Create Company Profile</h2>
          <div>
            <FaBuilding size={50} color='#764ba2'/>
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
              <label htmlFor="companyname" className="form-label" >
                Company Name
              </label>
              <input
                type="text"
                id="companyname"
                name="companyname"
                className={`form-control ${errors.companyname ? "is-invalid" : ""}`}
                value={formData.companyname}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.companyname && (
                <div className="invalid-feedback">{errors.companyname}</div>
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
              {/*Description*/}
              <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Company Description
              </label>
              <input
                type="text"
                id="description"  
                name="description"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter company description"
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
              </div>
              {/*Phone Number*/}
              <div className="mb-3">  
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
              </div>
            {/* Job Preference */}
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">
                Industry Type
              </label>
              <select
                id="industry"
                name="industry"
                className={`form-select ${errors.industry ? "is-invalid" : ""}`}
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select Industry Type</option>
                {industryList.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <div className="invalid-feedback">{errors.industry}</div>
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

export default CompanySignUp;
