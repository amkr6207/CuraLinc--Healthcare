import express from 'express';
import Publication from '../models/Publication.js';
import { protect } from '../middleware/auth.js';
import { pubMedService } from '../services/externalAPIs.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// @route   GET /api/publications
// @desc    Search publications
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, condition } = req.query;

        let query = {};
        if (condition) query.relatedConditions = { $in: [condition] };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { abstract: { $regex: search, $options: 'i' } }
            ];
        }

        const publications = await Publication.find(query).limit(50).sort({ publishedDate: -1 });

        res.status(200).json({
            success: true,
            count: publications.length,
            data: { publications }
        });
    } catch (error) {
        console.error('Search publications error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/publications/search-external
// @desc    Search publications from PubMed
// @access  Public
router.get('/search-external', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query parameter required' });
        }

        const publications = await pubMedService.searchPublications(query);

        res.status(200).json({
            success: true,
            count: publications.length,
            data: { publications }
        });
    } catch (error) {
        console.error('External search error:', error);
        res.status(500).json({ success: false, message: 'Failed to search PubMed' });
    }
});

// @route   GET /api/publications/recommendations
// @desc    Get personalized publication recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
    try {
        const publications = await Publication.find().limit(100);
        const recommendations = await aiService.getRecommendations(req.user.profile, publications, 'publication');

        res.status(200).json({
            success: true,
            data: { publications: recommendations }
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/publications/:id
// @desc    Get publication details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }

        res.status(200).json({
            success: true,
            data: { publication }
        });
    } catch (error) {
        console.error('Get publication error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
