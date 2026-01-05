import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Gamepad2, Star, Trophy } from 'lucide-react';
import { physicsGames } from '../data/physicsGames';
import { grade6Games } from '../data/grade6Games';
import { grade7Games } from '../data/grade7Games';
import { grade8Games } from '../data/grade8Games';
import { grade9Games } from '../data/grade9Games';
import { grade10Games } from '../data/grade10Games';

const PhysicsGradeSelector = () => {
  const navigate = useNavigate();

  const grades = [
    { id: 6, name: 'Lớp 6', color: 'from-purple-400 to-purple-600', icon: '📚', description: 'Cơ học & Nhiệt học cơ bản' },
    { id: 7, name: 'Lớp 7', color: 'from-blue-400 to-blue-600', icon: '🔬', description: 'Ánh sáng & Âm thanh' },
    { id: 8, name: 'Lớp 8', color: 'from-green-400 to-green-600', icon: '⚡', description: 'Điện học cơ bản' },
    { id: 9, name: 'Lớp 9', color: 'from-yellow-400 to-yellow-600', icon: '🌊', description: 'Điện từ & Sóng' },
    { id: 10, name: 'Lớp 10', color: 'from-orange-400 to-orange-600', icon: '🎯', description: 'Động học & Nhiệt động' },
    { id: 11, name: 'Lớp 11', color: 'from-red-400 to-red-600', icon: '🔥', description: 'Dao động & Sóng điện từ' },
    { id: 12, name: 'Lớp 12', color: 'from-pink-400 to-pink-600', icon: '⚛️', description: 'Vật lý hiện đại' },
  ];

  // Đếm số game cho mỗi lớp
  const getGameCount = (gradeId) => {
    switch (gradeId) {
      case 6:
        return grade6Games.length;
      case 7:
        return grade7Games.length;
      case 8:
        return grade8Games.length;
      case 9:
        return grade9Games.length;
      case 10:
        return grade10Games.length;
      case 11:
        return 0; // Chưa có games
      case 12:
        return 0; // Chưa có games
      default:
        return 0;
    }
  };

  // Tính tổng số game tất cả các lớp
  const totalGames = grade6Games.length + grade7Games.length + grade8Games.length + grade9Games.length + grade10Games.length;

  const handleGradeClick = (gradeId) => {
    navigate(`/physics-games/grade/${gradeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/program/physics/dashboard')}
            className="flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                🎮 Game Vật Lý Theo Lớp
              </h1>
              <p className="text-xl text-white/90">
                Chọn lớp học để khám phá các game tương tác thú vị
              </p>
            </div>
            <div className="hidden md:block text-8xl opacity-80">
              🚀
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-white/80">Cấp lớp</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <Gamepad2 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalGames}</p>
              <p className="text-sm text-white/80">Tổng game</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-white/80">Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Chọn lớp học
          </h2>
          <p className="text-gray-600">
            Mỗi lớp học có các game phù hợp với chương trình học
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {grades.map((grade, index) => {
            const gameCount = getGameCount(grade.id);
            return (
              <div
                key={grade.id}
                onClick={() => handleGradeClick(grade.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${grade.color} p-6 relative overflow-hidden h-32`}>
                  <div className="absolute top-0 right-0 text-7xl opacity-20 transform rotate-12">
                    {grade.icon}
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="text-4xl">{grade.icon}</div>
                    <div className="text-white">
                      <h3 className="text-2xl font-bold">{grade.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    {grade.description}
                  </p>

                  {/* Game Count Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Gamepad2 className="w-4 h-4" />
                      <span className="font-medium">{gameCount} game</span>
                    </div>
                    {gameCount > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        Sẵn sàng
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Tiến độ</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${grade.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>

                  {/* Play Button */}
                  <button 
                    className={`w-full bg-gradient-to-r ${grade.color} hover:opacity-90 text-white py-3 rounded-xl font-medium transition-all transform group-hover:scale-105 shadow-md hover:shadow-lg`}
                  >
                    Khám phá ngay →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Game tương tác</h3>
            </div>
            <p className="text-white/90">
              Mỗi game được thiết kế dựa trên chương trình học, giúp bạn hiểu sâu hơn về các khái niệm vật lý qua trải nghiệm thực tế.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Theo dõi tiến độ</h3>
            </div>
            <p className="text-white/90">
              Hoàn thành các game để mở khóa nội dung mới và theo dõi sự tiến bộ của bạn qua từng cấp độ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsGradeSelector;
