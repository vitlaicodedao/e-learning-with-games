const TrueFalse = ({ quiz, userAnswer, isAnswered, onAnswer }) => {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => onAnswer(true)}
        disabled={isAnswered}
        className={`px-8 py-4 text-lg font-bold rounded-lg border-2 transition-all ${
          userAnswer === true
            ? isAnswered
              ? quiz.correctAnswer === true
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-red-500 bg-red-500 text-white'
              : 'border-blue-500 bg-blue-500 text-white'
            : isAnswered && quiz.correctAnswer === true
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-300 hover:border-blue-300'
        }`}
      >
        ✓ Đúng
      </button>
      <button
        onClick={() => onAnswer(false)}
        disabled={isAnswered}
        className={`px-8 py-4 text-lg font-bold rounded-lg border-2 transition-all ${
          userAnswer === false
            ? isAnswered
              ? quiz.correctAnswer === false
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-red-500 bg-red-500 text-white'
              : 'border-blue-500 bg-blue-500 text-white'
            : isAnswered && quiz.correctAnswer === false
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-300 hover:border-blue-300'
        }`}
      >
        ✗ Sai
      </button>
    </div>
  );
};

export default TrueFalse;
