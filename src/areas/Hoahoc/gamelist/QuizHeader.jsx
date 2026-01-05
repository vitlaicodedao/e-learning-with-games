import Button from '../../../components/ui/Button';

const QuizHeader = ({ onBack, currentIndex, totalQuizzes, score, totalPoints }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
   
      <div className="text-right">
        <div className="text-sm text-gray-600">
          Câu {currentIndex + 1} / {totalQuizzes}
        </div>
        <div className="text-xl font-bold text-blue-600">
          Điểm: {score} / {totalPoints}
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
