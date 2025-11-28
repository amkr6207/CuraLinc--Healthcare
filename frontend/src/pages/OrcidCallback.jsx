import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrcidCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might need a custom setAuth method, but login usually just sets state

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handleCallback(code);
        }
    }, [searchParams]);

    const handleCallback = async (code) => {
        try {
            const response = await api.post('/auth/orcid/callback', { code });
            localStorage.setItem('token', response.data.data.token);
            // Force a reload or use a context method to update user state
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('ORCID callback error:', error);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-gray-600">Authenticating with ORCID...</span>
        </div>
    );
};

export default OrcidCallback;
