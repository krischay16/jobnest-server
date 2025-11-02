// ...existing code...
import React, { useState, ChangeEvent, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

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
  fullname: string;
  email: string;
  skill: string[];
  jobpreference: string;
  test: boolean;
  score: { skill: string; value: number }[];
  experience: string;
  resume: string;
  phoneNumber: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    email: "",
    skill: [],
    jobpreference: "",
    test: false,
    score: [],
    experience: "",
    resume: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url=`/api/jobseeker`
        const res = await axiosInstance.get<UserData>(url);
        if (res?.data) setUserData(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "skill" && e.target instanceof HTMLSelectElement) {
      // handle multi-select
      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
      setUserData((prev) => ({ ...prev, skill: selected }));
      return;
    }
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/jobseeker", userData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    }
  };

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
            <div className="col-8">
              <form className="form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="fullname" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    value={userData.fullname}
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
                  <label htmlFor="jobpreference" className="form-label">
                    Job Preference
                  </label>
                  <select
                    id="jobpreference"
                    name="jobpreference"
                    className="form-select"
                    value={userData.jobpreference}
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

                {/* Skills (multi-select) */}
                <div className="mb-3">
                  <label htmlFor="skill" className="form-label">
                    Skills
                  </label>
                  <select
                    id="skill"
                    name="skill"
                    className="form-select"
                    value={userData.skill}
                    onChange={handleChange}
                    multiple
                    size={Math.min(6, skillsList.length)}
                  >
                    {skillsList.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// ...existing code...