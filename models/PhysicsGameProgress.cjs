const mongoose = require('mongoose');

const physicsGameProgressSchema = new mongoose.Schema({
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
  grade: {
    type: Number,
    required: true,
    enum: [6, 7, 8, 9, 10, 11, 12],
    index: true
  },
  completedGames: {
    type: [String], // Array of game IDs
    default: []
  },
  currentGame: {
    type: String, // Current game ID
    default: null
  },
  totalScore: {
    type: Number,
    default: 0
  },
  totalTrophies: {
    type: Number,
    default: 0
  },
  lastPlayedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  collection: 'physics_game_progress',
  timestamps: true 
});

// Index for finding user's progress across all grades
physicsGameProgressSchema.index({ userId: 1, grade: 1 }, { unique: true });
physicsGameProgressSchema.index({ userEmail: 1, grade: 1 }, { unique: true });

// Methods
physicsGameProgressSchema.statics.saveProgress = async function(userId, userEmail, grade, completed, current) {
  try {
    const record = await this.findOneAndUpdate(
      { userId, grade },
      {
        userId,
        userEmail,
        grade,
        completedGames: completed || [],
        currentGame: current || null,
        totalTrophies: (completed || []).length,
        lastPlayedAt: new Date(),
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );
    return record;
  } catch (error) {
    console.error('Error saving physics game progress:', error);
    throw error;
  }
};

physicsGameProgressSchema.statics.getProgress = async function(userId, grade) {
  try {
    const record = await this.findOne({ userId, grade });
    if (record) {
      return {
        completed: record.completedGames || [],
        current: record.currentGame || null,
        totalScore: record.totalScore || 0,
        totalTrophies: record.totalTrophies || 0
      };
    }
    return {
      completed: [],
      current: null,
      totalScore: 0,
      totalTrophies: 0
    };
  } catch (error) {
    console.error('Error getting physics game progress:', error);
    throw error;
  }
};

physicsGameProgressSchema.statics.getProgressByEmail = async function(userEmail, grade) {
  try {
    const record = await this.findOne({ userEmail, grade });
    if (record) {
      return {
        completed: record.completedGames || [],
        current: record.currentGame || null,
        totalScore: record.totalScore || 0,
        totalTrophies: record.totalTrophies || 0
      };
    }
    return {
      completed: [],
      current: null,
      totalScore: 0,
      totalTrophies: 0
    };
  } catch (error) {
    console.error('Error getting physics game progress by email:', error);
    throw error;
  }
};

physicsGameProgressSchema.statics.getAllProgress = async function(userId) {
  try {
    const records = await this.find({ userId }).sort({ grade: 1 });
    const result = {};
    records.forEach(record => {
      result[record.grade.toString()] = {
        completed: record.completedGames || [],
        current: record.currentGame || null,
        totalScore: record.totalScore || 0,
        totalTrophies: record.totalTrophies || 0
      };
    });
    return result;
  } catch (error) {
    console.error('Error getting all physics game progress:', error);
    throw error;
  }
};

module.exports = mongoose.model('PhysicsGameProgress', physicsGameProgressSchema);
