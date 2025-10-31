import React from 'react'

import { Link , useNavigate} from 'react-router-dom'


const SelectPage: React.FC = () => {
const navigate=useNavigate()
    return (

        <div>

            <div>

                <h3>Join JobNest</h3>

                <h5>Choose your account type to get started</h5>

            </div>

            <div className='container mt-5 mb-2 d-flex justify-content-center gap-5' >

                <div className="card shadow-lg p-5" style={{width:"30%"}}>

                    <h5 className='card-title pb-1'>Job Seeker</h5>

                    <p>Find your dream job. Showcase your skills and connect with top employees</p>

                    <div className='card-body text-start'>  

                        <p>Create professional profile</p>

                        <p>Upload Resume</p>

                        <p>Take personality assessment</p>

                        <p>Get Job recommendations</p>

                    </div>

                    <button className='btn btn-primary' onClick={()=>navigate('/jsp')}>Continue as Job Seeker</button>

                </div>

                <div className="card shadow-lg p-5" style={{width:"30%"}}>

                    <h5 className='card-title pb-1'>Employer</h5>

                    <p>Find your dream job. Showcase your skills and connect with top employees</p>

                   <div className='card-body text-start'>

                        <p>Create professional profile</p>

                        <p>Upload Resume</p>

                        <p>Take personality assessment</p>

                        <p>Get Job recommendations</p>

                    </div>

                    <button className='btn btn-success' onClick={()=>{navigate('/cp')}}>Continue as Employer</button>

                </div>  

            </div>

            <p>Already have an account <Link to='/signin'>Login here</Link></p>

        </div>

    )

}


 

export default SelectPage