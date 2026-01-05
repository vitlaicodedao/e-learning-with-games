const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Thông tin tài khoản
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String // Để trống nếu đăng nhập bằng Google
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // Cho phép null
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Cho phép null
  },
  displayName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Profile information
  profile: {
    grade: Number, // Lớp học hiện tại sau khi làm placement test
    bio: String,
    avatar: String
  },
  
  // XP và Level
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Chương trình học
  programs: [{
    programId: {
      type: String,
      required: true,
      enum: ['chemistry', 'physics', 'biology', 'math']
    },
    programName: String,
    currentClass: Number, // Lớp đang học (8, 9, 10, 11, 12)
    // currentLesson: Number, // Bài đang học (removed - progress tracked in progress.completedLessons)
    isActive: {
      type: Boolean,
      default: true
    },
    placementTestCompleted: {
      type: Boolean,
      default: false
    },
    placementTestScore: Number,
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      completedLessons: [Number], // Danh sách ID các bài đã hoàn thành
      lessonStars: {
        type: Map,
        of: Number,
        default: new Map() // Key: uniqueLessonId, Value: số sao (1-3)
      },
      totalScore: {
        type: Number,
        default: 0
      },
      lastStudyDate: Date
    }
  }],
  
  // Physics Games Progress - Tiến độ hành trình game Vật lý theo lớp
  physicsGameProgress: {
    type: Map,
    of: {
      type: Object,
      default: () => ({
        completed: [],  // Danh sách ID game đã hoàn thành
        current: null   // Game đang chơi
      })
    },
    default: new Map() // Key: grade (6, 7, 8, 9, 10, 11, 12), Value: { completed, current }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware tự động cập nhật updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Methods - Authentication
userSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Methods - XP & Level
userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  const newLevel = Math.floor(this.xp / 100) + 1;
  const leveledUp = newLevel > this.level;
  this.level = newLevel;
  
  return { xp: this.xp, level: this.level, leveledUp };
};

// Methods - Program
userSchema.methods.enrollProgram = function(programId, programName, currentClass = null) {
  const existing = this.programs.find(p => p.programId === programId);
  if (existing) return existing;

    const newProgram = {
    programId,
    programName,
    currentClass: currentClass, // Lớp được chọn khi đăng ký
    enrolledAt: new Date(),
    progress: {
      completedLessons: [],
      totalScore: 0,
      lastStudyDate: null
    }
  };

  this.programs.push(newProgram);
  return newProgram;
};

userSchema.methods.updateProgramProgress = function(programId, classId, lessonId, score) {
  let program = this.programs.find(p => p.programId === programId);
  
  // Nếu chưa có program, tự động tạo mới
  if (!program) {
    const programNames = {
      chemistry: 'Hóa học',
      physics: 'Vật lý',
      biology: 'Sinh học',
      math: 'Toán học'
    };
    
    const newProgram = {
      programId: programId,
      programName: programNames[programId] || programId,
      currentClass: parseInt(classId),
      isActive: true,
      placementTestCompleted: false,
      enrolledAt: new Date(),
      progress: {
        completedLessons: [],
        totalScore: 0,
        lastStudyDate: null
      }
    };
    
    this.programs.push(newProgram);
    // Lấy lại reference từ array sau khi push
    program = this.programs[this.programs.length - 1];
    console.log('✅ Auto-created program:', programId, 'with lesson:', lessonId);
  }

  // Cập nhật lớp và bài hiện tại
  program.currentClass = parseInt(classId);
  
  console.log('📝 Updating program:', {
    programId,
    currentClass: program.currentClass
  });
  
  // Tạo unique ID cho bài học: classId * 1000 + lessonId
  // Ví dụ: Lớp 8, Bài 1 -> 8001, Lớp 9, Bài 1 -> 9001
  const uniqueLessonId = parseInt(classId) * 1000 + parseInt(lessonId);
  
  // Thêm bài đã hoàn thành (kiểm tra trùng)
  if (!program.progress.completedLessons) {
    program.progress.completedLessons = [];
  }
  
  if (lessonId && !program.progress.completedLessons.includes(uniqueLessonId)) {
    program.progress.completedLessons.push(uniqueLessonId);
    console.log('✅ Added completed lesson:', uniqueLessonId);
  }
  
  // Cập nhật điểm
  if (score) {
    program.progress.totalScore = (program.progress.totalScore || 0) + score;
  }
  
  program.progress.lastStudyDate = new Date();
  
  // Đánh dấu programs array đã thay đổi để Mongoose lưu đúng
  this.markModified('programs');
  
  return program;
};

// Update lesson stars based on score percentage
userSchema.methods.updateLessonStars = function(programId, classId, lessonId, percentage) {
  const program = this.programs.find(p => p.programId === programId);
  if (!program) return null;

  const uniqueLessonId = parseInt(classId) * 1000 + parseInt(lessonId);
  
  // Initialize lessonStars Map if not exists
  if (!program.progress.lessonStars) {
    program.progress.lessonStars = new Map();
  }

  // Calculate stars: >=50%: 1 star, >=80%: 2 stars, 100%: 3 stars
  let stars = 0;
  if (percentage >= 100) {
    stars = 3;
  } else if (percentage >= 80) {
    stars = 2;
  } else if (percentage >= 50) {
    stars = 1;
  }

  // Only update if new stars are better than existing
  const currentStars = program.progress.lessonStars.get(uniqueLessonId.toString()) || 0;
  if (stars > currentStars) {
    program.progress.lessonStars.set(uniqueLessonId.toString(), stars);
    console.log(`⭐ Updated lesson ${uniqueLessonId} stars: ${currentStars} → ${stars}`);
  }

  this.markModified('programs');
  return stars;
};

userSchema.methods.getProgram = function(programId) {
  return this.programs.find(p => p.programId === programId);
};

// Methods - Physics Games Progress
userSchema.methods.savePhysicsGameProgress = function(grade, completed, current) {
  if (!this.physicsGameProgress) {
    this.physicsGameProgress = new Map();
  }
  
  const gradeStr = grade.toString();
  this.physicsGameProgress.set(gradeStr, {
    completed: completed || [],
    current: current || null,
    lastUpdated: new Date()
  });
  
  this.markModified('physicsGameProgress');
  return this.physicsGameProgress.get(gradeStr);
};

userSchema.methods.getPhysicsGameProgress = function(grade) {
  if (!this.physicsGameProgress) {
    return { completed: [], current: null };
  }
  
  const gradeStr = grade.toString();
  return this.physicsGameProgress.get(gradeStr) || { completed: [], current: null };
};

userSchema.methods.getAllPhysicsGameProgress = function() {
  if (!this.physicsGameProgress) {
    return {};
  }
  
  const result = {};
  this.physicsGameProgress.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

module.exports = mongoose.model('User', userSchema);
