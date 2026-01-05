import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const ProgramSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const programs = [
    {
      id: 'chemistry',
      name: 'Hóa học',
      icon: '🧪',
      description: 'Khám phá thế giới của các nguyên tố, phản ứng và các hợp chất hóa học qua các bài học tương tác và thí nghiệm ảo.',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700',
      available: true,
      grades: [8, 9, 10, 11, 12],
      totalLessons: 150,
      highlights: ['Thí nghiệm ảo', 'Bảng tuần hoàn tương tác', 'Bài tập tự động chấm']
    },
    {
      id: 'physics',
      name: 'Vật lý',
      icon: '⚛️',
      description: 'Tìm hiểu về các định luật cơ bản của vũ trụ, từ chuyển động, năng lượng cho đến các hiện tượng điện từ và quang học.',
      gradient: 'from-green-500 to-teal-600',
      hoverGradient: 'from-green-600 to-teal-700',
      available: true,
      grades: [6, 7, 8, 9, 10, 11, 12],
      totalLessons: 200,
      highlights: ['Mô phỏng vật lý', 'Game tương tác', 'Thí nghiệm ảo']
    },
    {
      id: 'biology',
      name: 'Sinh học',
      icon: '🧬',
      description: 'Khám phá sự sống từ tế bào đến sinh thái, hiểu về cơ thể người, di truyền học và đa dạng sinh học.',
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'from-emerald-600 to-green-700',
      available: false,
      grades: [8, 9, 10, 11, 12],
      totalLessons: 130,
      highlights: ['Hình ảnh 3D', 'Video sinh học', 'Thực hành quan sát']
    },
    {
      id: 'math',
      name: 'Toán học',
      icon: '📐',
      description: 'Phát triển tư duy logic và giải quyết vấn đề qua đại số, hình học, giải tích và xác suất thống kê.',
      gradient: 'from-purple-500 to-pink-600',
      hoverGradient: 'from-purple-600 to-pink-700',
      available: false,
      grades: [8, 9, 10, 11, 12],
      totalLessons: 160,
      highlights: ['Công cụ vẽ đồ thị', 'Bài tập tự luyện', 'Lời giải chi tiết']
    }
  ];

  const handleProgramSelect = (program) => {
    if (!program.available) {
      alert(`Chương trình ${program.name} sắp ra mắt!`);
      return;
    }

    if (!user) {
      // Chưa đăng nhập -> chuyển đến trang login
      // Nếu là vật lý thì chuyển đến trang vật lý, còn không thì đến placement test
      const redirectPath = program.id === 'physics' 
        ? `/program/${program.id}` 
        : `/placement-test/${program.id}`;
      navigate('/login', { state: { from: redirectPath } });
      return;
    }

    // Đặc biệt cho môn Vật lý: vào thẳng trang Vật lý, không qua placement test
    if (program.id === 'physics') {
      navigate(`/program/${program.id}`);
      return;
    }

    // Kiểm tra xem user đã đăng ký chương trình này chưa (áp dụng cho các môn khác)
    const userProgram = user.programs?.find(p => p.programId === program.id);
    
    if (userProgram && userProgram.placementTestCompleted) {
      // Đã làm placement test và đăng ký -> chuyển đến trang học
      navigate(`/program/${program.id}`);
    } else {
      // Chưa làm placement test -> chuyển đến placement test
      navigate(`/placement-test/${program.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Chọn chương trình học của bạn
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Bắt đầu hành trình chinh phục kiến thức với các môn học yêu thích
          </p>
          {user && user.programs && user.programs.length > 0 && (
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <p className="text-lg">
                📚 Bạn đã đăng ký {user.programs.filter(p => p.isActive).length} chương trình học
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {programs.map((program) => {
            const isEnrolled = user?.programs?.some(p => p.programId === program.id && p.isActive);
            
            return (
              <div
                key={program.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                  !program.available ? 'opacity-75' : ''
                }`}
              >
                <div className="p-8">
                  {/* Icon and Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center text-white text-5xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {program.icon}
                    </div>
                    {isEnrolled && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Đã đăng ký
                      </span>
                    )}
                    {!program.available && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Sắp ra mắt
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-3 text-gray-800">
                    {program.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 h-20 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>📚</span>
                      <span>{program.totalLessons}+ bài học</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎓</span>
                      <span>Lớp {program.grades[0]}-{program.grades[program.grades.length - 1]}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {program.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleProgramSelect(program)}
                    className={`w-full bg-gradient-to-r ${program.gradient} hover:${program.hoverGradient} text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      !program.available ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={!program.available}
                  >
                    {!program.available ? (
                      'Sắp ra mắt'
                    ) : isEnrolled ? (
                      `Tiếp tục học ${program.name} →`
                    ) : (
                      `Bắt đầu học ${program.name}`
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Tại sao chọn nền tảng của chúng tôi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Học theo cấp độ</h3>
              <p className="text-gray-600">
                Nội dung được phân chia theo từng lớp học, phù hợp với trình độ của bạn
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📊
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Theo dõi tiến độ</h3>
              <p className="text-gray-600">
                Hệ thống đánh giá và thống kê giúp bạn nắm rõ quá trình học tập
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Gamification</h3>
              <p className="text-gray-600">
                Hệ thống điểm, sao và thành tích giúp việc học trở nên thú vị hơn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for login/register if not logged in */}
      {!user && (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Bạn chưa đăng nhập?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Hãy đăng nhập hoặc tạo tài khoản để lưu lại tiến trình học tập và truy cập đầy đủ các tính năng
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/login">
                <Button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-700 text-white border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg">
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProgramSelection;
