const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Dễ', 'Trung bình', 'Khó', 'Rất khó']
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  difficultyColor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['molecule', 'experiment', 'electrochemistry', 'solution', 'reaction', 'structure', 'game'],
    default: 'experiment'
  },
  grade: {
    type: Number,
    required: true,
    enum: [8, 9, 10, 11, 12],
    default: 8
  },
  time: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'coming-soon', 'locked'],
    default: 'available'
  },
  link: {
    type: String,
    required: false
  },
  features: [{
    type: String,
    required: true
  }],
  // Prerequisites to unlock this challenge
  prerequisite: {
    classId: {
      type: Number,
      required: false,
      enum: [8, 9, 10, 11, 12]
    },
    lessonId: {
      type: Number,
      required: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
