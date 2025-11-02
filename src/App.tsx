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
import Apply from './components/jobseeker/apply';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import JobRecommendations from './components/jobseeker/jobRecommendations';
import Chat from './components/chat';
import Createjob from './components/company/createJob';
// Component-level AppWrapper to use navigation inside props
function AppWrapper() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SelectPage />} />
        <Route path="/jsp" element={<JobSeekerProfile />} />
       <Route path="/cp" element={<CompanyProfile/>} />
       <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="recommendations" element={<JobRecommendations />}/>
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat/>}/>
          <Route path='post-a-job' element={<Createjob/>}/>
        </Route>
       <Route path="apply/:id" element={<Apply/>}/>
        <Route
          path="/assessment"
          element={
            <PersonalityAssessment
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
