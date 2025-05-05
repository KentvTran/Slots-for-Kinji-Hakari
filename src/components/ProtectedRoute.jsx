import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading... </div>; // Spinner?
    }

    return user ? children : <Navigate to ="/login-page" replace/>
};

export default ProtectedRoute;