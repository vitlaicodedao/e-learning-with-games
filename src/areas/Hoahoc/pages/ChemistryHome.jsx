import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { BookOpen, Trophy, Target, Clock, Star, Flame, Zap, Award, TrendingUp, Play, LogOut, ChevronDown } from 'lucide-react';
import api from '../../../config/api';

const ChemistryHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [programData, setProgramData] = useState(null);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computedStats, setComputedStats] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const availablePrograms = [
    { id: 'chemistry', name: 'Hóa học', icon: '🧪', path: '/program/chemistry', available: true },
    { id: 'physics', name: 'Vật lý', icon: '⚛️', path: '/program/physics', available: true },
    { id: 'biology', name: 'Sinh học', icon: '🧬', path: '/program/biology', available: false },
    { id: 'math', name: 'Toán học', icon: '📐', path: '/program/math', available: false }
  ];

  const handleProgramChange = (program) => {
    if (!program.available) {
      alert(`Chương trình ${program.name} sắp ra mắt!`);
      return;
    }

    // Kiểm tra xem user đã đăng ký chương trình này chưa
    const hasProgram = user.programs?.some(p => p.programId === program.id && p.isActive);
    
    if (hasProgram) {
      navigate(program.path);
    } else {
      // Chưa đăng ký -> chuyển đến placement test
      navigate(`/placement-test/${program.id}`);
    }
    setShowProgramDropdown(false);
  };

  // Topic mapping for each grade
  const topicMapping = {
    8: {
      topics: ['Chất - Nguyên tử - Phân tử', 'Phản ứng hóa học', 'Mol và tính toán', 'Oxi - Không khí', 'Hiđro - Nước', 'Dung dịch'],
      icon: '⚗️'
    },
    9: {
      topics: ['Phi kim', 'Kim loại', 'Hợp chất hữu cơ', 'Hóa học và cuộc sống'],
      icon: '🔬'
    },
    10: {
      topics: ['Nguyên tử', 'Bảng tuần hoàn', 'Liên kết hóa học', 'Phản ứng oxi hóa khử'],
      icon: '⚛️'
    },
    11: {
      topics: ['Sự điện li', 'Nhóm Halogen', 'Nhóm Oxi', 'Tốc độ phản ứng', 'Nitơ - Photpho'],
      icon: '🧪'
    },
    12: {
      topics: ['Este - Lipit', 'Cacbohiđrat', 'Amin - Amino axit', 'Polime', 'Kim loại', 'Hóa học hữu cơ tổng hợp'],
      icon: '🧬'
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Kiểm tra xem user đã đăng ký chương trình Hóa học chưa
      if (!user) {
        navigate('/login');
        return;
      }

      const chemistryProgram = user.programs?.find(p => p.programId === 'chemistry' && p.isActive);
      if (!chemistryProgram) {
        // Chưa đăng ký -> chuyển đến placement test
        navigate('/placement-test/chemistry');
        return;
      }

      setProgramData(chemistryProgram);

      // Fetch user progress from API
      try {
        setLoading(true);
        const userUid = user?.firebaseUid || user?.uid;
        
        // Fetch actual user progress
        const userResponse = await api.get(`/users/firebase/${userUid}`);
        const userData = userResponse.data;
        
        // Find chemistry program progress
        const chemProgram = userData.programs?.find(p => p.programId === 'chemistry');
        
        // Fetch grades statistics
        const response = await api.get('/lessons/statistics');
        
        // Normalize response – support multiple shapes: [] | { data: [] } | { grades: [] }
        const raw = response.data;
        const list = Array.isArray(raw) ? raw : (raw.data || raw.grades || []);

        // Calculate user's completed lessons per class from chemistry program
        const completedLessonsByClass = {};
        const lessonStarsMap = chemProgram?.progress?.lessonStars || {};
        
        if (chemProgram && chemProgram.progress && chemProgram.progress.completedLessons) {
          chemProgram.progress.completedLessons.forEach(uniqueId => {
            // uniqueId format: classId * 1000 + lessonId
            const lessonClassId = Math.floor(uniqueId / 1000);
            if (!completedLessonsByClass[lessonClassId]) {
              completedLessonsByClass[lessonClassId] = 0;
            }
            completedLessonsByClass[lessonClassId]++;
          });
        }

        // Map and normalize each grade object (ensure numeric grade and expected keys)
        const gradesWithTopics = list.map(g => {
          const gradeNum = Number(g.grade ?? g.class ?? g.classId);
          const completedForThisClass = completedLessonsByClass[gradeNum] || 0;
          
          return {
            // keep original fields, but normalize names commonly used in UI
            grade: Number.isNaN(gradeNum) ? 0 : gradeNum,
            chapters: g.chapters ?? g.totalChapters ?? 0,
            lessons: g.lessons ?? g.totalLessons ?? 0,
            completedLessons: completedForThisClass,
            completedChapters: g.completedChapters ?? 0,
            totalStars: g.totalStars ?? g.stars ?? 0,
            totalPoints: g.totalPoints ?? g.points ?? 0,
            totalTimeSpent: g.totalTimeSpent ?? g.timeSpent ?? 0,
            topics: topicMapping[Number(g.grade ?? g.class ?? g.classId)]?.topics || [],
            icon: topicMapping[Number(g.grade ?? g.class ?? g.classId)]?.icon || '📚',
            // include other original data if needed
            ...g
          };
        });

        setGrades(gradesWithTopics);

        // Compute actual user stats from chemistry program
        if (chemProgram && chemProgram.progress) {
          const completedCount = chemProgram.progress.completedLessons?.length || 0;
          const totalScore = chemProgram.progress.totalScore || 0;
          
          // Calculate total stars from lessonStars map
          const totalStars = Object.values(lessonStarsMap).reduce((sum, stars) => sum + (stars || 0), 0);
          
          const userStats = {
            totalLessons: gradesWithTopics.reduce((sum, g) => sum + Number(g.lessons || 0), 0),
            completedLessons: completedCount,
            totalStars: totalStars,
            totalPoints: totalScore,
            averageScore: completedCount > 0 ? Math.round(totalScore / completedCount) : 0,
            totalTimeSpent: 0 // TODO: implement time tracking
          };
          
          setComputedStats(userStats);
        } else {
          // Fallback if no progress data
          const aggregated = gradesWithTopics.reduce((acc, g) => {
            acc.totalLessons += Number(g.lessons || 0);
            return acc;
          }, { totalLessons: 0, completedLessons: 0, totalStars: 0, totalPoints: 0, averageScore: 0, totalTimeSpent: 0 });

          setComputedStats(aggregated);
        }

       } catch (error) {
         console.error('Error fetching grades data:', error);
         // Fallback to empty array if error
         setGrades([]);
         setComputedStats({ totalLessons: 0, completedLessons: 0, totalStars: 0, totalPoints: 0, averageScore: 0, totalTimeSpent: 0 });
       } finally {
         setLoading(false);
       }
     };

     initializeData();
   }, [user, navigate]);

  if (!programData || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Prefer program-provided statistics; fallback to computedStats (from grades) if missing
  const programStats = programData.programProgress?.statistics || null;
  const stats = programStats || computedStats || {
    totalLessons: 0,
    completedLessons: 0,
    totalStars: 0,
    totalPoints: 0,
    averageScore: 0,
    totalTimeSpent: 0
  };

  // Get current class from programData.currentClass (set by placement test)
  const currentClassId = Number(programData.currentClass ?? 8);
  const currentClass = { classId: currentClassId, className: `Lớp ${currentClassId}` };
  
  // Get current class data from grades
  const currentGradeData = grades.find(g => Number(g.grade) === Number(currentClassId));
  const currentClassTotalLessons = currentGradeData?.lessons || 0;
  const currentClassCompletedLessons = currentGradeData?.completedLessons || 0;
  
  // Calculate completion rate for current class based on actual user progress
  const completionRate = currentClassTotalLessons > 0 
    ? Math.round((currentClassCompletedLessons / currentClassTotalLessons) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            {/* Program Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className="flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                <span className="text-2xl">🧪</span>
                <span>Hóa học</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showProgramDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProgramDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProgramDropdown(false)}
                  ></div>
                  
                  {/* Dropdown Content */}
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                        Chọn chương trình học
                      </p>
                      {availablePrograms.map((program) => {
                        const isActive = program.id === 'chemistry';
                        const isEnrolled = user.programs?.some(p => p.programId === program.id && p.isActive);
                        
                        return (
                          <button
                            key={program.id}
                            onClick={() => handleProgramChange(program)}
                            disabled={!program.available && !isEnrolled}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                              isActive 
                                ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                                : program.available
                                ? 'hover:bg-gray-50 text-gray-700'
                                : 'opacity-50 cursor-not-allowed text-gray-400'
                            }`}
                          >
                            <span className="text-2xl">{program.icon}</span>
                            <div className="flex-1 text-left">
                              <p className="font-semibold">{program.name}</p>
                              {isActive && (
                                <p className="text-xs text-blue-600">Đang học</p>
                              )}
                              {!program.available && !isActive && (
                                <p className="text-xs">Sắp ra mắt</p>
                              )}
                              {isEnrolled && !isActive && (
                                <p className="text-xs text-green-600">Đã đăng ký</p>
                              )}
                            </div>
                            {isActive && (
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl font-medium transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 mb-6 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                      🧪
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-1">
                        Chào mừng trở lại, {user?.displayName || user?.username || 'Học sinh'}! 👋
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Tiếp tục hành trình khám phá Hóa học cùng chúng tôi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Progress */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Đang học</p>
                    <p className="text-2xl font-bold">{currentClass.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm mb-1">Tiến độ</p>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-sm text-blue-100">
                  <span>{currentClassCompletedLessons} / {currentClassTotalLessons} bài học</span>
                  <span>{stats.totalStars} ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +{Math.floor(Math.random() * 5) + 1} tuần này
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.completedLessons}</p>
              <p className="text-sm text-gray-600">Bài đã hoàn thành</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalStars}</p>
              <p className="text-sm text-gray-600">Sao tích lũy</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600">Điểm thành tích</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {Math.floor(stats.totalTimeSpent / 60)}
              </p>
              <p className="text-sm text-gray-600">Phút học tập</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => navigate('/program/chemistry/dashboard')}
              className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7" />
                </div>
                <svg className="w-6 h-6 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Tiếp tục học</h3>
              <p className="text-blue-100 text-sm">Học tiếp bài học gần nhất</p>
            </button>

            <button
              onClick={() => navigate('/advanced-challenge')}
              className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <svg className="w-6 h-6 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Thử thách</h3>
              <p className="text-purple-100 text-sm">Làm bài tập nâng cao</p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="group bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <svg className="w-6 h-6 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Hồ sơ</h3>
              <p className="text-emerald-100 text-sm">Xem thành tích của bạn</p>
            </button>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              Lộ trình học tập
            </h2>
            <p className="text-gray-600">Chương trình Hóa học từ lớp 8 đến lớp 12</p>
          </div>

          <div className="space-y-4">
            {grades.map(({ grade, topics, chapters, lessons, icon, completedLessons = 0 }) => {
              const isCurrentGrade = currentClass.classId === grade;
              const isPastGrade = grade < currentClass.classId;
              const classProgress = programData.programProgress?.classProgress?.find(c => c.classId === grade);
              // Past grades should always be unlocked for review
              const isUnlocked = classProgress?.isUnlocked || grade <= currentClass.classId || isPastGrade;
              const isCompleted = classProgress?.completedAt || isPastGrade;
              let progress = 0;
              if (classProgress) {
                progress = Math.round((classProgress.chapters?.filter(ch => ch.completedAt).length || 0) / (chapters || 1) * 100);
              } else {
                // Fallback: compute progress from completedLessons (count) vs total lessons
                progress = lessons > 0 ? Math.round((completedLessons || 0) / lessons * 100) : 0;
              }
              // If this is a past grade (lower than current), treat as 100% complete for display
              const displayProgress = isPastGrade ? 100 : progress;

              return (
                <div 
                  key={grade}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    !isUnlocked ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`p-6 ${
                    isCurrentGrade 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' 
                      : ''
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                          isCurrentGrade 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                            : isUnlocked
                            ? 'bg-gradient-to-br from-gray-100 to-gray-200'
                            : 'bg-gray-100'
                        }`}>
                          {icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-gray-800">
                              Lớp {grade}
                            </h3>
                            {isCurrentGrade && (
                              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                Đang học
                              </span>
                            )}
                            {isCompleted && (
                              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Hoàn thành
                              </span>
                            )}
                            {!isUnlocked && (
                              <span className="bg-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Khóa
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {chapters} chương
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{lessons} bài học</span>
                            {isUnlocked && !isCompleted && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-blue-600 font-medium">{progress}% hoàn thành</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {isUnlocked && (
                        <button
                          onClick={() => navigate(`/class/${grade}`)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          {isCurrentGrade ? 'Học tiếp' : (isPastGrade ? 'Xem lại' : 'Xem chi tiết')}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {isUnlocked && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${displayProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic, idx) => (
                        <span 
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isUnlocked 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Tại sao chọn chương trình Hóa học của chúng tôi?
            </h2>
            <p className="text-gray-600 text-lg">
              Phương pháp học hiện đại, hiệu quả cao
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Học theo trình độ</h3>
              <p className="text-gray-600 leading-relaxed">
                Nội dung được thiết kế phù hợp với từng lớp học, từ cơ bản đến nâng cao, 
                giúp học sinh tiếp thu kiến thức một cách logic và hiệu quả.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                🔬
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Thực hành tương tác</h3>
              <p className="text-gray-600 leading-relaxed">
                Thí nghiệm ảo 3D và bài tập thực hành đa dạng giúp học sinh trải nghiệm 
                và hiểu sâu các hiện tượng hóa học một cách sinh động.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Theo dõi tiến độ</h3>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống đánh giá và báo cáo chi tiết giúp học sinh và phụ huynh 
                theo dõi quá trình học tập và điều chỉnh phương pháp phù hợp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ChemistryHome;
