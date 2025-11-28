import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, User, Clock, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Forums = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchForums();
    }, []);

    const fetchForums = async () => {
        try {
            const response = await api.get('/forums');
            setForums(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching forums:', error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Community Forums</h1>
                    <p className="mt-2 text-gray-600">Join the discussion and share your experiences.</p>
                </div>
                {user && (
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <Plus className="h-5 w-5 mr-2" />
                        New Discussion
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {forums.length > 0 ? (
                            forums.map((forum) => (
                                <li key={forum._id}>
                                    <a href="#" className="block hover:bg-gray-50 transition-colors">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-primary-600 truncate">{forum.title}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {forum.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        {forum.author?.name || 'Anonymous'}
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        <MessageSquare className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        {forum.posts ? forum.posts.length : 0} replies
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>
                                                        Last active {new Date(forum.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-12 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions yet</h3>
                                <p className="mt-1 text-sm text-gray-500">Be the first to start a conversation!</p>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Forums;
