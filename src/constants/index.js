// Learning paths configuration
export const LEARNING_PATHS = [
  {
    id: 1,
    title: 'Cơ bản',
    level: 'Beginner',
    description: 'Nền tảng cơ bản của Hóa học',
    color: 'from-green-400 to-green-600',
    lessons: [
      { id: 1, title: 'Nguyên tử và phân tử' },
      { id: 2, title: 'Bảng tuần hoàn các nguyên tố' },
      { id: 3, title: 'Liên kết hóa học cơ bản' },
      { id: 4, title: 'Phản ứng hóa học đơn giản' },
    ]
  },
  {
    id: 2,
    title: 'Trung cấp',
    level: 'Intermediate',
    description: 'Kiến thức nâng cao hơn',
    color: 'from-blue-400 to-blue-600',
    lessons: [
      { id: 5, title: 'Cân bằng hóa học' },
      { id: 6, title: 'Động học phản ứng' },
      { id: 7, title: 'Nhiệt hóa học' },
      { id: 8, title: 'Dung dịch và nồng độ' },
    ]
  },
  {
    id: 3,
    title: 'Nâng cao',
    level: 'Advanced',
    description: 'Chuyên sâu và phức tạp',
    color: 'from-purple-400 to-purple-600',
    lessons: [
      { id: 9, title: 'Hóa học hữu cơ' },
      { id: 10, title: 'Điện hóa học' },
      { id: 11, title: 'Phức chất' },
      { id: 12, title: 'Hóa học phân tích' },
    ]
  },
];

// Chemistry topics for home page
export const CHEMISTRY_TOPICS = [
  { title: 'Nguyên tử', color: 'bg-blue-500' },
  { title: 'Bảng tuần hoàn', color: 'bg-purple-500' },
  { title: 'Liên kết hóa học', color: 'bg-green-500' },
  { title: 'Phản ứng hóa học', color: 'bg-red-500' },
  { title: 'Dung dịch', color: 'bg-yellow-500' },
  { title: 'Hóa hữu cơ', color: 'bg-pink-500' },
  { title: 'Điện hóa', color: 'bg-indigo-500' },
  { title: 'Động học', color: 'bg-teal-500' },
];

// Achievement definitions
export const ACHIEVEMENTS = [
  { id: 1, title: '7 ngày liên tục', icon: '🔥', requirement: 'streak', value: 7 },
  { id: 2, title: 'Hoàn thành 5 bài', icon: '⭐', requirement: 'lessons', value: 5 },
  { id: 3, title: '100% một bài', icon: '🏆', requirement: 'perfect', value: 1 },
  { id: 4, title: 'Hoàn thành cấp Cơ bản', icon: '🎓', requirement: 'path', value: 1 },
  { id: 5, title: '14 ngày liên tục', icon: '💪', requirement: 'streak', value: 14 },
  { id: 6, title: '1000 điểm', icon: '💎', requirement: 'points', value: 1000 },
  { id: 7, title: 'Hoàn thành 20 bài', icon: '🌟', requirement: 'lessons', value: 20 },
  { id: 8, title: '30 ngày liên tục', icon: '🔥🔥', requirement: 'streak', value: 30 },
];

// Point values
export const POINTS = {
  QUIZ_CORRECT: 10,
  LESSON_COMPLETE: 50,
  PERFECT_SCORE: 100,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10,
};

// Quiz types
export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  FILL_IN_BLANK: 'fill-in-blank',
};

// Pass threshold
export const PASS_THRESHOLD = 0.7; // 70%
