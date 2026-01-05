const mongoose = require('mongoose');

const lessonCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  classId: {
    type: Number,
    required: true
  },
  chapterId: {
    type: Number,
    required: true
  },
  lessonNumber: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  quizAnswers: {
    type: Array,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

lessonCompletionSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const LessonCompletion = mongoose.model('LessonCompletion', lessonCompletionSchema);

module.exports = LessonCompletion;
