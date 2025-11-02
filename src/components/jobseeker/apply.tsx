import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

interface Skill {
  skill: string;
  value: number;
}

interface Job {
  _id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  experience: number;
  skills: string[];
}

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [userExperience, setUserExperience] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch job details
        const jobRes = await axiosInstance.get(`/job/${id}`);
        console.log(id,jobRes.data.skills);
        setJob(jobRes.data);

        // ✅ Fetch logged-in jobseeker details
        const userRes = await axiosInstance.get("/api/jobseeker");
        const data = userRes.data;

        setUserSkills(data.score || []); // [{ skill: "JavaScript", value: 4 }]
        setUserExperience(parseInt(data.experience) || 0);
      } catch (err) {
        console.error("Error fetching job or user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-4">Loading job details...</div>;
  if (!job) return <div className="p-4 text-danger">Job not found</div>;

  console.log("job skill:", job.skills);
    console.log("User skills:", userSkills);
  const matchedSkills = (job.skills || []).map((skillName) => {
    
    const userSkill = userSkills.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    const score = userSkill ? (userSkill.value / 5) * 100 : 0;
    return {
      name: skillName,
      score: Math.round(score),
      matched: score >= 60,
      userValue: userSkill ? userSkill.value : 0,
    };
  });

  // ✅ Eligibility check
  const skillsEligible = matchedSkills.every((s) => s.matched);
  const experienceEligible = userExperience >= job.experience;
  const eligible = skillsEligible && experienceEligible;

  const handleApply = async() => {
    if (!eligible) return;
    try{
      await axiosInstance.post('/api/application/apply', {
        job: job._id,
        user: localStorage.getItem('id'),
        status: 'Applied'
      });
    alert("✅ Application submitted successfully!");
    }
    catch(err){
      console.error("Application failed:", err);
      alert("❌ Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4 rounded-3">
        {/* Job Header */}
        <div className="mb-3">
          <h3 className="fw-bold text-dark">{job.title}</h3>
          <h5 className="text-muted mb-1">{job.company}</h5>
          <p className="text-secondary">{job.location}</p>
        </div>
        <hr />

        {/* Description */}
        <p className="fs-6 text-dark">{job.description}</p>

        {/* Eligibility Section */}
        <div className="mt-4">
          <h5 className="fw-semibold text-primary mb-3">
            <i className="bi bi-check2-circle me-2"></i>Eligibility Criteria
          </h5>

          <div className="card bg-light border-0 shadow-sm p-3">
            {/* Experience */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1 fw-semibold text-dark">Experience</h6>
                <small className="text-muted">
                  Required: {job.experience} years
                </small>
              </div>
              <span
                className={`badge fs-6 ${
                  experienceEligible ? "bg-success" : "bg-danger"
                }`}
              >
                You: {userExperience} yrs
              </span>
            </div>

            <hr className="my-2" />

            {/* Skills */}
            <h6 className="fw-semibold text-dark mb-2">Skills Match</h6>
            {matchedSkills.length === 0 ? (
              <p className="text-muted">No skill data available</p>
            ) : (
              <div className="row">
                {matchedSkills.map((skill) => (
                  <div key={skill.name} className="col-md-6 mb-2">
                    <div
                      className={`border rounded p-2 d-flex justify-content-between align-items-center ${
                        skill.matched
                          ? "border-success bg-white"
                          : "border-danger bg-white"
                      }`}
                    >
                      <div>
                        <span className="fw-semibold">{skill.name}</span>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {skill.userValue}/5 rating
                        </div>
                      </div>
                      <span
                        className={`fw-semibold ${
                          skill.matched ? "text-success" : "text-danger"
                        }`}
                      >
                        {skill.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eligibility Summary */}
          <div
            className={`alert mt-4 text-center fw-semibold ${
              eligible ? "alert-success" : "alert-warning"
            }`}
          >
            {eligible
              ? "✅ You are eligible to apply for this job!"
              : "⚠️ You do not meet the eligibility criteria."}
          </div>
        </div>

        {/* Apply Button */}
        <div className="text-end mt-3">
          <button
            className={`btn ${eligible ? "btn-primary" : "btn-secondary"} px-4`}
            disabled={!eligible}
            onClick={handleApply}
          >
            {eligible ? "Apply Now" : "Eligibility Not Met"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
