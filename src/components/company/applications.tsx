import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import exp from 'constants';

const Applications: React.FC = () => {
    return(
        <div className='card'>
            <h1 className='card-title mb-3'>Job applications</h1>
            <div className='card-body mb-3'>
                <div></div>
            </div>
        </div>
    )
}
export default Applications;