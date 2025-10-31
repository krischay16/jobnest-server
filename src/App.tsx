import React from 'react';
import Navbar from './components/Navbar';
import SelectPage from './components/select';
import Login from './components/sigin';
import PersonalityAssessment from './components/personalityAssessment';
import JobSeekerProfile from './components/jobseeker';
import Dashboard from './components/dashboard';
import CompanyProfile from './components/company';
import MyApplications from './components/jobseeker/myApplications';
import Applications from './components/company/applications';
import Profile from './components/jobseeker/profile';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import JobRecommendations from './components/jobseeker/jobRecommendations';

// Component-level AppWrapper to use navigation inside props
function AppWrapper() {
  const navigate = useNavigate();

  // 10 personality assessment questions
  const questions = [
    {
      question: "I prefer working in team environments",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I am comfortable taking leadership roles",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I work best under tight deadlines",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I prefer detailed instructions over creative freedom",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I enjoy networking and meeting new people",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I am comfortable with public speaking",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I prefer routine tasks over varied work",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I am good at managing multiple projects simultaneously",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I work better independently than in groups",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    {
      question: "I am comfortable with frequent changes in priorities",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
  ];

  // Handle the submission from PersonalityAssessment
  const handleAssessmentSubmit = (answers: string[]) => {
    console.log("Assessment submitted:", answers);

    // You can perform analysis or API submission here
    // Example: send results to backend
    // await axios.post('/api/assessment', { answers, userId });

    alert("Assessment completed! Redirecting to your dashboard...");
    navigate('/jsp'); // redirect to job seeker profile/dashboard
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SelectPage />} />
        <Route path="/jsp" element={<JobSeekerProfile />} />
       <Route path="/cp" element={<CompanyProfile/>} />
       <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="recommendations" element={<JobRecommendations />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} /> 
          
        </Route>
       <Route path='/dashboard/recommendations' element={<JobRecommendations/>}></Route>
        <Route
          path="/assessment"
          element={
            <PersonalityAssessment
              questions={questions}
              onSubmit={handleAssessmentSubmit}
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
