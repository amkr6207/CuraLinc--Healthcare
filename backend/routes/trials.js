import express from 'express';
import ClinicalTrial from '../models/ClinicalTrial.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { clinicalTrialsService } from '../services/externalAPIs.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// @route   GET /api/trials
// @desc    Search clinical trials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { condition, location, status, search } = req.query;

        // Build query
        let query = {};
        if (condition) query.conditions = { $in: [condition] };
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const trials = await ClinicalTrial.find(query).limit(50).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: trials.length,
            data: { trials }
        });
    } catch (error) {
        console.error('Search trials error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/trials/search-external
// @desc    Search clinical trials from ClinicalTrials.gov
// @access  Public
router.get('/search-external', async (req, res) => {
    try {
        const { condition, location, status } = req.query;
        const trials = await clinicalTrialsService.searchTrials({ condition, location, status });

        res.status(200).json({
            success: true,
            count: trials.length,
            data: { trials }
        });
    } catch (error) {
        console.error('External search error:', error);
        res.status(500).json({ success: false, message: 'Failed to search external trials' });
    }
});

// @route   GET /api/trials/recommendations
// @desc    Get personalized trial recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
    try {
        const trials = await ClinicalTrial.find().limit(100);
        const recommendations = await aiService.getRecommendations(req.user.profile, trials, 'trial');

        res.status(200).json({
            success: true,
            data: { trials: recommendations }
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/trials/:id
// @desc    Get trial details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const trial = await ClinicalTrial.findById(req.params.id);
        if (!trial) {
            return res.status(404).json({ success: false, message: 'Trial not found' });
        }

        res.status(200).json({
            success: true,
            data: { trial }
        });
    } catch (error) {
        console.error('Get trial error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/trials
// @desc    Add new clinical trial (researcher only)
// @access  Private (Researcher)
router.post('/', protect, restrictTo('researcher'), async (req, res) => {
    try {
        const trialData = { ...req.body, addedBy: req.user._id };

        // Generate AI summary if description exists
        if (trialData.description) {
            trialData.aiSummary = await aiService.generateSummary(trialData.description, 'trial');
        }

        const trial = await ClinicalTrial.create(trialData);

        res.status(201).json({
            success: true,
            data: { trial }
        });
    } catch (error) {
        console.error('Create trial error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/trials/:id
// @desc    Update clinical trial (researcher only)
// @access  Private (Researcher)
router.put('/:id', protect, restrictTo('researcher'), async (req, res) => {
    try {
        const trial = await ClinicalTrial.findById(req.params.id);

        if (!trial) {
            return res.status(404).json({ success: false, message: 'Trial not found' });
        }

        if (trial.addedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updatedTrial = await ClinicalTrial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: { trial: updatedTrial }
        });
    } catch (error) {
        console.error('Update trial error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
