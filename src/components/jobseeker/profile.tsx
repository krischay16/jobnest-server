import React, { useState, ChangeEvent } from "react";
import { FaUserCircle } from "react-icons/fa";

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

interface UserData {
  name: string;
  email: string;
  jobPreference: string;
  skill: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    jobPreference: "",
    skill: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Profile updated successfully!");
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Profile</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            {/* Left section */}
            <div className="col-4 d-flex flex-column align-items-center justify-content-center border-end">
              <FaUserCircle size={80} className="text-secondary mb-2" />
              <p className="fw-semibold">I am the User</p>
            </div>

            {/* Right section */}
            <div className="col-4">
              <form className="form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={userData.name}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                  />
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
                    className="form-control"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Job Preference */}
                <div className="mb-3">
                  <label htmlFor="jobPreference" className="form-label">
                    Job Preference
                  </label>
                  <select
                    id="jobPreference"
                    name="jobPreference"
                    className="form-select"
                    value={userData.jobPreference}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Type</option>
                    {jobTypes.map((jobType) => (
                      <option key={jobType} value={jobType}>
                        {jobType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <label htmlFor="skill" className="form-label">
                    Skill
                  </label>
                  <select
                    id="skill"
                    name="skill"
                    className="form-select"
                    value={userData.skill}
                    onChange={handleChange}
                  >
                    <option value="">Select Skill</option>
                    {skillsList.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary mt-3">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
