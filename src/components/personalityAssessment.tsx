import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  question: string;
  options: string[];
}

interface AssessmentProps {
  questions: Question[];
  onSubmit: (answers: string[]) => void;
}

const PersonalityAssessment: React.FC<AssessmentProps> = ({ questions, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const navigate = useNavigate();
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

  const handleSubmit = () => {
    if (answers.every((ans) => ans !== "")) {
      onSubmit(answers);
      setTimeout(()=>{
      navigate('/dashboard');
    },1000)}
    else {
      alert("Please answer all the questions before submitting.");
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Personality Assessment</h2>
            <p className="text-muted">Help us find the perfect job matches for you</p>
          </div>

          {/* Card Container */}
          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <span className="badge bg-info px-4 py-2 fs-6">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-4">
                <h5 className="fw-semibold mb-4">
                  {questions[currentQuestion].question}
                </h5>

                {/* Answer Options */}
                <div className="d-grid gap-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option}
                      className={`border rounded-3 p-3 ${
                        answers[currentQuestion] === option
                          ? "border-info border-2 bg-info bg-opacity-10"
                          : "border-secondary"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => handleOptionChange(option)}
                    >
                      <div className="form-check m-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${currentQuestion}`}
                          id={`${currentQuestion}-${option}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleOptionChange(option)}
                        />
                        <label
                          className="form-check-label ms-2 w-100"
                          htmlFor={`${currentQuestion}-${option}`}
                          style={{ cursor: "pointer" }}
                        >
                          {option}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
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
                  >
                    Submit
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
