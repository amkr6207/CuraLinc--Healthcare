import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/favorites
// @desc    Get user favorites
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites.trials')
            .populate('favorites.publications')
            .populate('favorites.experts');

        res.status(200).json({
            success: true,
            data: { favorites: user.favorites }
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/favorites
// @desc    Add to favorites
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, itemId } = req.body; // type: 'trials', 'publications', 'experts'

        if (!['trials', 'publications', 'experts'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        const user = await User.findById(req.user._id);

        // Check if already in favorites
        if (user.favorites[type].includes(itemId)) {
            return res.status(400).json({ success: false, message: 'Already in favorites' });
        }

        user.favorites[type].push(itemId);
        await user.save();

        res.status(200).json({
            success: true,
            data: { favorites: user.favorites }
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/favorites/:type/:itemId
// @desc    Remove from favorites
// @access  Private
router.delete('/:type/:itemId', protect, async (req, res) => {
    try {
        const { type, itemId } = req.params;

        if (!['trials', 'publications', 'experts'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        const user = await User.findById(req.user._id);
        user.favorites[type] = user.favorites[type].filter(id => id.toString() !== itemId);
        await user.save();

        res.status(200).json({
            success: true,
            data: { favorites: user.favorites }
        });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
