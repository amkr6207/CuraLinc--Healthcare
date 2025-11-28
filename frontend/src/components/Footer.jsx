import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center">
                            <Activity className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">CuraLink</span>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            Connecting patients with life-changing clinical trials and top health experts.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Platform</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/trials" className="text-base text-gray-500 hover:text-gray-900">Clinical Trials</Link></li>
                            <li><Link to="/experts" className="text-base text-gray-500 hover:text-gray-900">Health Experts</Link></li>
                            <li><Link to="/forums" className="text-base text-gray-500 hover:text-gray-900">Forums</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/about" className="text-base text-gray-500 hover:text-gray-900">About Us</Link></li>
                            <li><Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                            <li><Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
                        <div className="flex space-x-6 mt-4">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} CuraLink. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
