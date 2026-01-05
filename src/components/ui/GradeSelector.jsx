import { useNavigate } from 'react-router-dom';

const GradeSelector = () => {
  const navigate = useNavigate();

  const grades = [
    {
      id: 8,
      title: 'Lớp 8',
      description: 'Khởi đầu môn Hóa học',
      color: 'from-blue-400 to-blue-600',
      icon: '🧪',
      topics: ['Chất', 'Nguyên tử', 'Phân tử', 'Phản ứng hóa học'],
      type: 'class'
    },
    {
      id: 9,
      title: 'Lớp 9',
      description: 'Hóa học vô cơ nâng cao',
      color: 'from-green-400 to-green-600',
      icon: '⚗️',
      topics: ['Oxit', 'Axit - Bazơ', 'Muối', 'Kim loại'],
      type: 'class'
    },
    {
      id: 10,
      title: 'Lớp 10',
      description: 'Hóa học hữu cơ cơ bản',
      color: 'from-purple-400 to-purple-600',
      icon: '🔬',
      topics: ['Ankan', 'Anken', 'Ankin', 'Benzen'],
      type: 'class'
    },
    {
      id: 11,
      title: 'Lớp 11',
      description: 'Hóa học nâng cao',
      color: 'from-orange-400 to-orange-600',
      icon: '⚛️',
      topics: ['Điện li', 'Tốc độ phản ứng', 'Cân bằng hóa học', 'Liên kết hóa học'],
      type: 'class'
    },
    {
      id: 12,
      title: 'Lớp 12',
      description: 'Ôn thi THPT Quốc gia',
      color: 'from-pink-400 to-pink-600',
      icon: '🎓',
      topics: ['Este', 'Lipit', 'Glucide', 'Protein'],
      type: 'class'
    },
    {
      id: 'challenge',
      title: 'Thử thách',
      description: 'Trò chơi Hóa học',
      color: 'from-red-400 to-red-600',
      icon: '🏆',
      topics: ['Ghép nguyên tử', 'Cân bằng PT', 'Phòng thí nghiệm', 'Đuổi hình bắt chữ'],
      type: 'challenge'
    }
  ];

  const handleSelectGrade = (grade) => {
    if (grade.type === 'challenge') {
      navigate('/advanced-challenge');
    } else {
      navigate(`/class/${grade.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Chọn lớp học của bạn
          </h1>
          <p className="text-xl text-gray-600">
            Bắt đầu hành trình học Hóa học từ lớp 8 đến lớp 12
          </p>
        </div>

        {/* Grade Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {grades.map((grade, index) => (
            <div
              key={grade.id}
              onClick={() => handleSelectGrade(grade)}
              className="cursor-pointer animate-slide-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`bg-gradient-to-br ${grade.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{grade.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{grade.title}</h3>
                  <p className="text-white/90 mb-4">{grade.description}</p>
                  
                  {/* Topics */}
                  <div className="space-y-2">
                    {grade.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="mr-2">✓</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <button className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      Bắt đầu học →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeSelector;
