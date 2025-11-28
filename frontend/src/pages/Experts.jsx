import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, MapPin, Star, User } from 'lucide-react';

const Experts = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const response = await api.get('/experts');
            setExperts(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching experts:', error);
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get(`/experts/search?query=${searchTerm}&specialty=${specialtyFilter}`);
            setExperts(response.data.data);
        } catch (error) {
            console.error('Error searching experts:', error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Find Health Experts</h1>
                <p className="mt-2 text-gray-600">Connect with top researchers and medical professionals.</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Search by name, specialty, or hospital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                        >
                            <option value="">All Specialties</option>
                            <option value="Oncology">Oncology</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Pediatrics">Pediatrics</option>
                        </select>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Experts List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {experts.length > 0 ? (
                        experts.map((expert) => (
                            <div key={expert._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-5 flex-1">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                            <User className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">{expert.name}</h3>
                                            <p className="text-sm text-primary-600">{expert.specialty}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {expert.hospital}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Star className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-400" />
                                            {expert.rating} ({expert.reviews} reviews)
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-3">{expert.bio}</p>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <User className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No experts found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Experts;
