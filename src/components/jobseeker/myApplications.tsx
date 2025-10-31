// pages/jobseeker/MyApplications.tsx
import React from 'react';
import axios from 'axios';

const MyApplications: React.FC = () => {
  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">My Applications</h2>
      <div className="row g-3">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <p>Your applications will appear here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
