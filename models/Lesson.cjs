const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  // classId: represents 'lớp' or learning path grouping (optional - kept for flexibility)
  classId: {
    type: Number,
    required: false
  },
  // chapterId: represents 'chương' within a class
  chapterId: {
    type: Number,
    required: false
  },
  // lessonId: bài học identifier inside chapter
  lessonId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  // Theory content (HTML/Markdown) shown in lesson theory tab
  theory: {
    type: String
  },

  // Legacy content field kept for backward compatibility (optional)
  content: {
    type: String
  },

  // Game object containing quizzes / interactive content
  game: {
    // Quiz array - single level (new structure)
    quizzes: [{
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'ordering', 'drag-drop', 'molecule-assembly'],
        required: true
      },
      question: {
        type: String,
        required: true
      },
      options: [String],
      pairs: [{
        left: String,
        right: String
      }],
      correctOrder: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      inline: Boolean,
      slots: [{
        id: Number,
        label: String,
        correct: String,
        value: String
      }],
      explanation: String,
      points: {
        type: Number,
        default: 10
      },
      hint: String
    }],
    // Legacy structure - kept for backward compatibility
    basic: [{
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'ordering', 'drag-drop', 'molecule-assembly'],
        required: true
      },
      question: {
        type: String,
        required: true
      },
      options: [String],
      pairs: [{
        left: String,
        right: String
      }],
      correctOrder: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      inline: Boolean,
      slots: [{
        id: Number,
        label: String,
        correct: String,
        value: String
      }],
      explanation: String,
      points: {
        type: Number,
        default: 10
      },
      hint: String
    }],
    intermediate: [{
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'ordering', 'drag-drop', 'molecule-assembly'],
        required: true
      },
      question: {
        type: String,
        required: true
      },
      options: [String],
      pairs: [{
        left: String,
        right: String
      }],
      correctOrder: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      inline: Boolean,
      slots: [{
        id: Number,
        label: String,
        correct: String,
        value: String
      }],
      explanation: String,
      points: {
        type: Number,
        default: 15
      },
      hint: String
    }],
    advanced: [{
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'ordering', 'drag-drop', 'molecule-assembly'],
        required: true
      },
      question: {
        type: String,
        required: true
      },
      options: [String],
      pairs: [{
        left: String,
        right: String
      }],
      correctOrder: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      inline: Boolean,
      slots: [{
        id: Number,
        label: String,
        correct: String,
        value: String
      }],
      explanation: String,
      points: {
        type: Number,
        default: 20
      },
      hint: String
    }]
  },
  order: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
