import express from 'express';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user (patient or researcher)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { userType, email, password, profile } = req.body;

        // Validation
        if (!userType || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide userType, email, and password'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            userType,
            email,
            password,
            profile: profile || {}
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from output
        user.password = undefined;

        res.status(200).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { profile } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { profile } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/orcid
// @desc    Redirect to ORCID login
// @access  Public
router.get('/orcid', (req, res) => {
    const clientId = process.env.ORCID_CLIENT_ID;
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/orcid/callback`; // Frontend callback route
    // For sandbox use: https://sandbox.orcid.org/oauth/authorize
    // For production use: https://orcid.org/oauth/authorize
    const orcidUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${redirectUri}`;
    res.json({ url: orcidUrl });
});

// @route   POST /api/auth/orcid/callback
// @desc    Handle ORCID callback
// @access  Public
router.post('/orcid/callback', async (req, res) => {
    try {
        const { code } = req.body;
        const clientId = process.env.ORCID_CLIENT_ID;
        const clientSecret = process.env.ORCID_CLIENT_SECRET;
        const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/orcid/callback`;

        // Exchange code for token
        const tokenResponse = await axios.post('https://orcid.org/oauth/token',
            new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri
            }), {
            headers: { 'Accept': 'application/json' }
        }
        );

        const { orcid, name } = tokenResponse.data;

        // Find or create user
        let user = await User.findOne({ orcidId: orcid });

        if (!user) {
            // Create new researcher user
            user = await User.create({
                userType: 'researcher',
                email: `${orcid}@orcid.org`, // Placeholder email
                password: Math.random().toString(36).slice(-8), // Random password
                orcidId: orcid,
                profile: {
                    name: name || 'ORCID User',
                    orcidId: orcid
                }
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('ORCID auth error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'ORCID authentication failed'
        });
    }
});

export default router;
