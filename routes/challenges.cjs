const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge.cjs');

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ id: 1 });
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
});

// Get challenges with unlock status for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User.cjs');
    
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all challenges
    const challenges = await Challenge.find().sort({ id: 1 });
    
    // Get all completed lessons from all programs
    const completedLessons = user.programs.reduce((acc, program) => {
      if (program.progress && program.progress.completedLessons) {
        return acc.concat(program.progress.completedLessons);
      }
      return acc;
    }, []);
    
    // Debug log
    console.log('🔍 Checking unlock status for user:', userId);
    console.log('📚 Completed lessons:', completedLessons);
    console.log('📊 Completed lessons types:', completedLessons.map(l => typeof l));
    
    // Check unlock status for each challenge
    const challengesWithStatus = challenges.map(challenge => {
      const challengeObj = challenge.toObject();
      
      // If no prerequisite, challenge is unlocked
      if (!challenge.prerequisite || !challenge.prerequisite.classId || !challenge.prerequisite.lessonId) {
        challengeObj.isUnlocked = true;
        return challengeObj;
      }
      
      // Calculate unique lesson ID: classId * 1000 + lessonId
      const requiredLessonId = challenge.prerequisite.classId * 1000 + challenge.prerequisite.lessonId;
      
      // Check if user has completed the required lesson (convert both to numbers for comparison)
      const isUnlocked = completedLessons.some(lessonId => Number(lessonId) === Number(requiredLessonId));
      challengeObj.isUnlocked = isUnlocked;
      
      console.log(`🎯 Challenge ${challenge.id} (${challenge.name}): requires ${requiredLessonId}, unlocked: ${isUnlocked}`);
      challengeObj.prerequisiteInfo = {
        classId: challenge.prerequisite.classId,
        lessonId: challenge.prerequisite.lessonId,
        requiredLessonId: requiredLessonId,
        isCompleted: completedLessons.includes(requiredLessonId)
      };
      
      return challengeObj;
    });
    
    res.json(challengesWithStatus);
  } catch (error) {
    console.error('Error fetching challenges for user:', error);
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ id: parseInt(req.params.id) });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Error fetching challenge', error: error.message });
  }
});

// Create new challenge (admin only - you can add authentication later)
router.post('/', async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
});

// Update challenge
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Error updating challenge', error: error.message });
  }
});

// Delete challenge
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Error deleting challenge', error: error.message });
  }
});

module.exports = router;
