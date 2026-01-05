const mongoose = require('mongoose');

/**
 * GameResult Model - Lưu chi tiết kết quả từng lần chơi game
 */
const gameResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  gameId: {
    type: String,
    required: true,
    index: true
  },
  grade: {
    type: Number,
    required: true,
    enum: [6, 7, 8, 9, 10, 11, 12]
  },
  chapter: {
    type: Number,
    required: true
  },
  // Kết quả game
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 100
  },
  stars: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  // Trạng thái hoàn thành
  completed: {
    type: Boolean,
    default: false
  },
  // Thời gian chơi (giây)
  playTime: {
    type: Number,
    default: 0
  },
  // Số lần thử
  attempts: {
    type: Number,
    default: 1
  },
  // Chi tiết bổ sung tùy theo loại game
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  collection: 'game_results',
  timestamps: true
});

// Compound indexes
gameResultSchema.index({ userId: 1, gameId: 1 });
gameResultSchema.index({ userEmail: 1, gameId: 1 });
gameResultSchema.index({ userId: 1, grade: 1 });
gameResultSchema.index({ userEmail: 1, grade: 1, chapter: 1 });

/**
 * Lưu hoặc cập nhật kết quả game
 */
gameResultSchema.statics.saveResult = async function(data) {
  const {
    userId,
    userEmail,
    gameId,
    grade,
    chapter,
    score,
    maxScore,
    playTime,
    details,
    completed
  } = data;

  // Tính số sao dựa trên điểm
  const percentage = (score / maxScore) * 100;
  let stars = 0;
  if (percentage >= 90) stars = 3;
  else if (percentage >= 70) stars = 2;
  else if (percentage >= 50) stars = 1;

  // Tìm record hiện tại để cập nhật attempts
  const existingResult = await this.findOne({ userId, gameId });
  const attempts = existingResult ? existingResult.attempts + 1 : 1;

  // Chỉ cập nhật nếu kết quả mới tốt hơn hoặc chưa có record
  const updateData = {
    userId,
    userEmail,
    gameId,
    grade,
    chapter,
    attempts,
    details,
    updatedAt: new Date()
  };

  // Luôn cập nhật các trường này nếu kết quả tốt hơn
  if (!existingResult || score > existingResult.score) {
    updateData.score = score;
    updateData.maxScore = maxScore;
    updateData.stars = stars;
    updateData.playTime = playTime;
  }

  // Đánh dấu hoàn thành nếu đạt >= 50%
  if (completed || percentage >= 50) {
    updateData.completed = true;
    if (!existingResult?.completedAt) {
      updateData.completedAt = new Date();
    }
  }

  const result = await this.findOneAndUpdate(
    { userId, gameId },
    { $set: updateData },
    { upsert: true, new: true }
  );

  return result;
};

/**
 * Lấy kết quả game theo gameId
 */
gameResultSchema.statics.getResult = async function(userId, gameId) {
  return await this.findOne({ userId, gameId });
};

/**
 * Lấy tất cả kết quả của user theo grade
 */
gameResultSchema.statics.getResultsByGrade = async function(userId, grade) {
  const results = await this.find({ userId, grade }).sort({ chapter: 1 });
  
  // Convert to map for easy lookup
  const resultMap = {};
  results.forEach(r => {
    resultMap[r.gameId] = {
      score: r.score,
      maxScore: r.maxScore,
      stars: r.stars,
      completed: r.completed,
      playTime: r.playTime,
      attempts: r.attempts,
      completedAt: r.completedAt
    };
  });
  
  return resultMap;
};

/**
 * Lấy danh sách game đã hoàn thành
 */
gameResultSchema.statics.getCompletedGames = async function(userId, grade) {
  const results = await this.find({ 
    userId, 
    grade, 
    completed: true 
  }).select('gameId');
  
  return results.map(r => r.gameId);
};

/**
 * Lấy thống kê tổng hợp
 */
gameResultSchema.statics.getStats = async function(userId) {
  const results = await this.find({ userId });
  
  const stats = {
    totalGamesPlayed: results.length,
    totalCompleted: results.filter(r => r.completed).length,
    totalStars: results.reduce((sum, r) => sum + r.stars, 0),
    totalPlayTime: results.reduce((sum, r) => sum + r.playTime, 0),
    byGrade: {}
  };
  
  // Group by grade
  results.forEach(r => {
    if (!stats.byGrade[r.grade]) {
      stats.byGrade[r.grade] = {
        played: 0,
        completed: 0,
        stars: 0
      };
    }
    stats.byGrade[r.grade].played++;
    if (r.completed) stats.byGrade[r.grade].completed++;
    stats.byGrade[r.grade].stars += r.stars;
  });
  
  return stats;
};

module.exports = mongoose.model('GameResult', gameResultSchema);
