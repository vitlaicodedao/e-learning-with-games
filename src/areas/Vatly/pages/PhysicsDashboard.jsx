import { useNavigate } from 'react-router-dom';
import { physicsGrades } from '../data/physicsGames';

const PhysicsDashboard = () => {
  const navigate = useNavigate();

  const handleSelectGrade = (grade) => {
    if (grade.type === 'challenge') {
      navigate('/physics-games/grades');
    } else {
      navigate(`/physics-class/${grade.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Chọn lớp học của bạn
          </h1>
          <p className="text-xl text-gray-600">
            Bắt đầu hành trình học Vật lý từ lớp 6 đến lớp 10
          </p>
        </div>

        {/* Grade Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {physicsGrades.map((grade, index) => (
            <div
              key={grade.id}
              onClick={() => handleSelectGrade(grade)}
              className="cursor-pointer animate-slide-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`bg-gradient-to-br ${grade.color} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-white h-full`}>
                {/* Icon */}
                <div className="text-6xl mb-4 text-center">
                  {grade.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-2">
                  {grade.title}
                </h2>

                {/* Description */}
                <p className="text-center text-white/90 mb-4">
                  {grade.description}
                </p>

                {/* Topics */}
                <div className="space-y-2">
                  {grade.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                {/* Action Hint */}
                <div className="mt-6 text-center">
                  <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    {grade.type === 'challenge' ? 'Chơi ngay →' : 'Bắt đầu học →'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/program/physics')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysicsDashboard;
