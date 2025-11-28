import express from 'express';
import Forum from '../models/Forum.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/forums
// @desc    Get all forum categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const forums = await Forum.find({ isActive: true })
            .populate('createdBy', 'profile.name userType')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: forums.length,
            data: { forums }
        });
    } catch (error) {
        console.error('Get forums error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/forums/:id
// @desc    Get forum posts
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.id)
            .populate('createdBy', 'profile.name userType')
            .populate('posts.author', 'profile.name userType')
            .populate('posts.replies.author', 'profile.name userType');

        if (!forum) {
            return res.status(404).json({ success: false, message: 'Forum not found' });
        }

        res.status(200).json({
            success: true,
            data: { forum }
        });
    } catch (error) {
        console.error('Get forum error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/forums
// @desc    Create new forum (researcher only)
// @access  Private (Researcher)
router.post('/', protect, restrictTo('researcher'), async (req, res) => {
    try {
        const { category, title, description, tags } = req.body;

        const forum = await Forum.create({
            category,
            title,
            description,
            tags,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: { forum }
        });
    } catch (error) {
        console.error('Create forum error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/forums/:id/post
// @desc    Create post in forum
// @access  Private
router.post('/:id/post', protect, async (req, res) => {
    try {
        const { content } = req.body;

        const forum = await Forum.findById(req.params.id);
        if (!forum) {
            return res.status(404).json({ success: false, message: 'Forum not found' });
        }

        forum.posts.push({
            author: req.user._id,
            authorType: req.user.userType,
            content
        });

        await forum.save();

        res.status(201).json({
            success: true,
            data: { forum }
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/forums/:forumId/posts/:postId/reply
// @desc    Reply to post (researcher only)
// @access  Private (Researcher)
router.post('/:forumId/posts/:postId/reply', protect, restrictTo('researcher'), async (req, res) => {
    try {
        const { content } = req.body;

        const forum = await Forum.findById(req.params.forumId);
        if (!forum) {
            return res.status(404).json({ success: false, message: 'Forum not found' });
        }

        const post = forum.posts.id(req.params.postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.replies.push({
            author: req.user._id,
            authorType: 'researcher',
            content
        });

        await forum.save();

        res.status(201).json({
            success: true,
            data: { forum }
        });
    } catch (error) {
        console.error('Reply error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
