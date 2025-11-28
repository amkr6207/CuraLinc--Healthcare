import express from 'express';
import HealthExpert from '../models/HealthExpert.js';
import MeetingRequest from '../models/MeetingRequest.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/experts
// @desc    Search health experts (patient view) or collaborators (researcher view)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { specialty, search, location } = req.query;

        let query = {};
        if (specialty) query.specialties = { $in: [specialty] };
        if (location) query['location.country'] = location;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }

        const experts = await HealthExpert.find(query)
            .populate('userId', 'email profile')
            .limit(50);

        res.status(200).json({
            success: true,
            count: experts.length,
            data: { experts }
        });
    } catch (error) {
        console.error('Search experts error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/experts/:id
// @desc    Get expert details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const expert = await HealthExpert.findById(req.params.id)
            .populate('userId', 'email profile')
            .populate('publications');

        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
        }

        res.status(200).json({
            success: true,
            data: { expert }
        });
    } catch (error) {
        console.error('Get expert error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/experts/meeting-request
// @desc    Request meeting with expert (patient only)
// @access  Private (Patient)
router.post('/meeting-request', protect, restrictTo('patient'), async (req, res) => {
    try {
        const { expertId, message, contactInfo, preferredDates } = req.body;

        const expert = await HealthExpert.findById(expertId);
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
        }

        const meetingRequest = await MeetingRequest.create({
            patientId: req.user._id,
            expertId,
            message,
            contactInfo,
            preferredDates,
            status: expert.isRegistered ? 'pending' : 'admin_review'
        });

        res.status(201).json({
            success: true,
            data: { meetingRequest }
        });
    } catch (error) {
        console.error('Meeting request error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/experts/meeting-requests
// @desc    Get meeting requests (for researchers)
// @access  Private (Researcher)
router.get('/meeting-requests', protect, restrictTo('researcher'), async (req, res) => {
    try {
        // Find expert profile for this researcher
        const expert = await HealthExpert.findOne({ userId: req.user._id });
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert profile not found' });
        }

        const requests = await MeetingRequest.find({ expertId: expert._id })
            .populate('patientId', 'email profile')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { requests }
        });
    } catch (error) {
        console.error('Get meeting requests error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
