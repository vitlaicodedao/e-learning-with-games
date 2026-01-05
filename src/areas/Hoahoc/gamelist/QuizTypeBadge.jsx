const QuizTypeBadge = ({ type, points }) => {
  const typeLabels = {
    'multiple-choice': '🔷 Trắc nghiệm',
    'true-false': '🧠 Đúng/Sai',
    'fill-in-blank': '📝 Điền từ',
    'matching': '🔗 Nối cặp',
    'ordering': '📊 Sắp xếp',
    'drag-drop': '🎯 Kéo thả'
  };

  return (
    <div className="mb-4">
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
        {typeLabels[type] || type}
      </span>
      <span className="ml-2 text-gray-600">{points} điểm</span>
    </div>
  );
};

export default QuizTypeBadge;
