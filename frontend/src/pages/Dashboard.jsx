import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, MessageSquare, FileText, User } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Welcome back, {user ? user.profile?.name : 'Guest'}!
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {user?.userType === 'patient' ? 'Manage your health journey and find clinical trials.' :
                            user?.userType === 'researcher' ? 'Manage your research and connect with patients.' :
                                'Explore the platform.'}
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Clinical Trials */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Search className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Clinical Trials</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">Find Matches</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link to="/trials" className="font-medium text-primary-700 hover:text-primary-900">
                                View all trials
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Card 2: Health Experts */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Health Experts</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">Connect with Pros</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link to="/experts" className="font-medium text-primary-700 hover:text-primary-900">
                                Find experts
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Card 3: Forums */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <MessageSquare className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Forums</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">Community</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link to="/forums" className="font-medium text-primary-700 hover:text-primary-900">
                                Join discussions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Card 4: Profile (Placeholder) */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <User className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Profile</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">My Settings</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link to="/profile" className="font-medium text-primary-700 hover:text-primary-900">
                                Edit profile
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
