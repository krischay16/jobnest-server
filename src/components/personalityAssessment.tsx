import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface Question {
  question: string;
  options: string[];
}

const PersonalityAssessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🧭 Fetch quiz questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get("/quiz"); // ✅ Fetch from backend
        setQuestions(res.data);
        setAnswers(Array(res.data.length).fill(""));
      } catch (error) {
        console.error("Failed to load quiz questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion]) {
      setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const handlePrev = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  // 🚀 Submit Quiz
  const handleSubmit = async () => {
    if (!answers.every((ans) => ans !== "")) {
      alert("Please answer all the questions before submitting.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Get JWT token from local storage
      const token = localStorage.getItem("token");

      // ✅ Send answers to backend
      const res = await axiosInstance.post(
        "/api/submit",
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Assessment submitted successfully!");

      console.log("Server Response:", res.data);

      // Optional: Navigate to dashboard or result page
      setTimeout(() => navigate("/dashboard/recommendations"), 1000);
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert(
        error.response?.data?.error || "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) {
    return <p className="text-center mt-5">Loading quiz questions...</p>;
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Skill Assessment</h2>
            <p className="text-muted">
              Answer honestly — this helps us match you with the right jobs!
            </p>
          </div>

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <span className="badge bg-info px-4 py-2 fs-6">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>

                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-4">
                  {questions[currentQuestion].question}
                </h5>

                <div className="d-grid gap-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option}
                      className={`border rounded-3 p-3 ${
                        answers[currentQuestion] === option
                          ? "border-info border-2 bg-info bg-opacity-10"
                          : "border-secondary"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOptionChange(option)}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestion}`}
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() => handleOptionChange(option)}
                      />
                      <label className="ms-2">{option}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    className="btn btn-info text-white px-4"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-info text-white px-4"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityAssessment;
