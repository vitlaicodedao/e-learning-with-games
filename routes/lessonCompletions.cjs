const express = require('express');
const router = express.Router();
const LessonCompletion = require('../models/LessonCompletion.cjs');
const User = require('../models/User.cjs');


// Get lesson completion status for a specific lesson
router.get('/', async (req, res) => {
    try {
        const { userId, lessonId } = req.query;
        const user = await User.findOne({ $or: [{ email: userId }, { _id: userId }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const completion = await LessonCompletion.findOne({ userId: user._id, lessonId });
        res.json(completion);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all completed lessons for a user in a class
router.get('/class/:classId', async (req, res) => {
    try {
        const { userId } = req.query;
        const { classId } = req.params;
        const user = await User.findOne({ $or: [{ email: userId }, { _id: userId }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const completions = await LessonCompletion.find({ userId: user._id, classId, completed: true });
        res.json(completions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Submit lesson completion
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            lessonId,
            classId,
            chapterId,
            lessonNumber,
            completed,
            score,
            totalQuestions,
            quizAnswers
        } = req.body;

        // find user by email or id
        const user = await User.findOne({ $or: [{ email: userId }, { _id: userId }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const completionData = {
            userId: user._id,
            lessonId,
            classId,
            chapterId,
            lessonNumber,
            completed,
            score,
            totalQuestions,
            quizAnswers
        };

        const completion = await LessonCompletion.findOneAndUpdate(
            { userId: user._id, lessonId },
            completionData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(completion);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
