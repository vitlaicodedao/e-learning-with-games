const express = require('express');
const router = express.Router();
const GameResult = require('../models/GameResult.cjs');
const PhysicsGameProgress = require('../models/PhysicsGameProgress.cjs');
const User = require('../models/User.cjs');

/**
 * Tìm user theo nhiều cách
 */
const findUser = async (userId) => {
  let user = await User.findOne({
    $or: [
      { email: userId },
      { firebaseUid: userId }
    ]
  });

  if (!user && userId.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(userId);
  }

  return user;
};

/**
 * POST /api/game-results/save
 * Lưu kết quả game
 */
router.post('/save', async (req, res) => {
  try {
    const {
      userId,
      gameId,
      grade,
      chapter,
      score,
      maxScore,
      playTime,
      details,
      completed
    } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId and gameId'
      });
    }

    // Tìm user
    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Lưu kết quả game
    const result = await GameResult.saveResult({
      userId: user._id,
      userEmail: user.email,
      gameId,
      grade: parseInt(grade),
      chapter: parseInt(chapter),
      score: score || 0,
      maxScore: maxScore || 100,
      playTime: playTime || 0,
      details: details || {},
      completed: completed || false
    });

    // Nếu game hoàn thành, cập nhật PhysicsGameProgress
    if (result.completed) {
      // Lấy danh sách game đã hoàn thành
      const completedGames = await GameResult.getCompletedGames(user._id, parseInt(grade));
      
      // Cập nhật progress
      await PhysicsGameProgress.saveProgress(
        user._id,
        user.email,
        parseInt(grade),
        completedGames,
        null // current game sẽ được xác định bởi frontend
      );
    }

    res.json({
      success: true,
      message: 'Game result saved successfully',
      result: {
        gameId: result.gameId,
        score: result.score,
        stars: result.stars,
        completed: result.completed,
        attempts: result.attempts
      }
    });

  } catch (error) {
    console.error('❌ Save game result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/game-results/:userId/:gameId
 * Lấy kết quả của một game cụ thể
 */
router.get('/:userId/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await GameResult.getResult(user._id, gameId);

    res.json({
      success: true,
      result: result || null
    });

  } catch (error) {
    console.error('❌ Get game result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/game-results/:userId/grade/:grade
 * Lấy tất cả kết quả của user theo grade
 */
router.get('/:userId/grade/:grade', async (req, res) => {
  try {
    const { userId, grade } = req.params;

    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const results = await GameResult.getResultsByGrade(user._id, parseInt(grade));
    const completedGames = await GameResult.getCompletedGames(user._id, parseInt(grade));

    res.json({
      success: true,
      grade: parseInt(grade),
      results,
      completedGames
    });

  } catch (error) {
    console.error('❌ Get game results by grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/game-results/:userId/stats
 * Lấy thống kê tổng hợp của user
 */
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = await GameResult.getStats(user._id);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Get game stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/game-results/complete
 * Đánh dấu game hoàn thành (simplified endpoint)
 */
router.post('/complete', async (req, res) => {
  try {
    const {
      userId,
      gameId,
      grade,
      chapter,
      score,
      maxScore,
      playTime,
      details
    } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Lưu kết quả với completed = true
    const result = await GameResult.saveResult({
      userId: user._id,
      userEmail: user.email,
      gameId,
      grade: parseInt(grade),
      chapter: parseInt(chapter),
      score: score || 100,
      maxScore: maxScore || 100,
      playTime: playTime || 0,
      details: details || {},
      completed: true
    });

    // Cập nhật PhysicsGameProgress
    const completedGames = await GameResult.getCompletedGames(user._id, parseInt(grade));
    
    await PhysicsGameProgress.saveProgress(
      user._id,
      user.email,
      parseInt(grade),
      completedGames,
      null
    );

    // Cập nhật XP cho user
    const xpGained = result.stars * 20; // 20 XP per star
    if (xpGained > 0) {
      user.xp = (user.xp || 0) + xpGained;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Game completed successfully',
      result: {
        gameId: result.gameId,
        score: result.score,
        stars: result.stars,
        completed: result.completed,
        xpGained
      },
      completedGames
    });

  } catch (error) {
    console.error('❌ Complete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/game-results/:userId/progress/:grade
 * Lấy progress đầy đủ cho game journey
 */
router.get('/:userId/progress/:grade', async (req, res) => {
  try {
    const { userId, grade } = req.params;

    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Lấy kết quả chi tiết
    const results = await GameResult.getResultsByGrade(user._id, parseInt(grade));
    const completedGames = await GameResult.getCompletedGames(user._id, parseInt(grade));

    // Lấy progress từ PhysicsGameProgress
    const progress = await PhysicsGameProgress.getProgress(user._id, parseInt(grade));

    res.json({
      success: true,
      grade: parseInt(grade),
      progress: {
        completed: completedGames,
        current: progress.current,
        totalTrophies: progress.totalTrophies
      },
      gameResults: results
    });

  } catch (error) {
    console.error('❌ Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
