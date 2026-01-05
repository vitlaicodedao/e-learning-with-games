import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { ArrowLeft, BookOpen, Trophy, Lock } from 'lucide-react';
import { physicsLessons, getLessonStats } from '../data/physicsLessons';

const PhysicsClassDashboard = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userEmail = user?.id || user?.email;
        if (userEmail) {
          const response = await axios.get(`${API_BASE_URL}/lesson-completions/class/${classId}`, {
            params: {
              userId: userEmail
            }
          });
          
          if (response.data) {
            const progressObj = {};
            response.data.forEach(completion => {
              const lessonKey = `${completion.classId}-${completion.chapterId}-${completion.lessonNumber}`;
              if (completion.completed) {
                progressObj[lessonKey] = 'completed';
              }
            });
            setUserProgress(progressObj);
          }
        }
      } catch (error) {
        console.error('Error fetching completed lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, [classId]);

  const currentGrade = physicsLessons[classId];
  const stats = currentGrade ? getLessonStats(classId, userProgress) : { total: 0, completed: 0 };

  const handleLessonClick = (chapterId, lessonId) => {
    // Navigate to lesson page
    navigate(`/physics-lesson/${classId}/${chapterId}/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚛️</div>
          <h2 className="text-2xl font-bold text-gray-700">Đang tải dữ liệu...</h2>
        </div>
      </div>
    );
  }

  if (!currentGrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy lớp học</h2>
            <button
              onClick={() => navigate('/program/physics/dashboard')}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
            >
              Quay lại chọn lớp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/program/physics/dashboard')}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại chọn lớp
          </button>
          
          <div className="flex items-center mb-4">
            <div className="text-5xl mr-4">
              {classId == 6 ? '🔭' : classId == 7 ? '🌟' : classId == 8 ? '⚙️' : classId == 9 ? '🔌' : classId == 10 ? '🚀' : classId == 11 ? '⚡' : classId == 12 ? '🌌' : '⚛️'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {currentGrade.title}
              </h1>
              <p className="text-gray-600">
                {currentGrade.description}
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                  <p className="text-sm text-gray-600">Tổng số bài</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-gray-600">Đã hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total - stats.completed}
                  </p>
                  <p className="text-sm text-gray-600">Chưa học</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-6">
          {currentGrade.chapters.map((chapter) => {
            const chapterCompleted = chapter.lessons.filter(lesson => {
              const lessonKey = `${classId}-${chapter.id}-${lesson.id}`;
              return userProgress[lessonKey] === 'completed';
            }).length;
            const chapterTotal = chapter.lessons.length;
            const progress = chapterTotal > 0 ? (chapterCompleted / chapterTotal) * 100 : 0;

            return (
              <div key={chapter.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {chapter.title}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {chapterCompleted}/{chapterTotal} bài
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Lessons */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.lessons.map((lesson) => {
                    const lessonKey = `${classId}-${chapter.id}-${lesson.id}`;
                    const isCompleted = userProgress[lessonKey] === 'completed';

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(chapter.id, lesson.id)}
                        className={`rounded-xl p-4 transition-all cursor-pointer border-2 ${
                          isCompleted
                            ? 'bg-green-50 border-green-300 hover:border-green-400'
                            : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            isCompleted
                              ? 'bg-gradient-to-br from-green-400 to-green-600'
                              : 'bg-gradient-to-br from-blue-400 to-blue-600'
                          }`}>
                            {isCompleted ? '✓' : lesson.id}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{lesson.title}</p>
                            <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                              {isCompleted ? 'Đã hoàn thành' : 'Chưa học'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <p className="text-blue-800">
            <strong>📝 Lưu ý:</strong> Tính năng học bài theo chương đang được phát triển. 
            Hiện tại bạn có thể trải nghiệm các game vật lý tương tác tại phần{' '}
            <button
              onClick={() => navigate('/advanced-physics-challenge')}
              className="font-bold underline hover:text-blue-600"
            >
              Thử thách
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysicsClassDashboard;
