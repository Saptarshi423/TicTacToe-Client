import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ProtectedRouteType } from '../constants';


const ProtectedRoute: React.FC<ProtectedRouteType> = ({ isAuthenticated, loggedIn, children }) => {
    const navigate : NavigateFunction = useNavigate();
    
    if (!loggedIn && !isAuthenticated) {
        navigate('/');
    }

    // Logged in but no oAuth
    if(!loggedIn && isAuthenticated){
        return children
    }
    // Logged in using oAuth
    if(loggedIn && !isAuthenticated){
        return children
    }
    return children
}

export default ProtectedRoute