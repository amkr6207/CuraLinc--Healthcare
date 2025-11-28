import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.profile?.name || '',
        institution: user?.profile?.institution || '',
        bio: user?.profile?.bio || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement profile update API call
        alert('Profile update feature coming soon!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button
                onClick={() => navigate('/dashboard')}
                className="mb-6 flex items-center text-primary-600 hover:text-primary-700"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </button>

            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center mb-6">
                        <User className="h-8 w-8 text-primary-600 mr-3" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Profile Settings
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user?.email || ''}
                                disabled
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div>
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <input
                                type="text"
                                name="userType"
                                id="userType"
                                value={user?.userType || ''}
                                disabled
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm capitalize"
                            />
                        </div>

                        {user?.userType === 'researcher' && (
                            <>
                                <div>
                                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                                        Institution
                                    </label>
                                    <input
                                        type="text"
                                        name="institution"
                                        id="institution"
                                        value={formData.institution}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        id="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
