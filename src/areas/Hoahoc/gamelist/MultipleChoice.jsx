const MultipleChoice = ({ quiz, userAnswer, isAnswered, onAnswer }) => {
  const correctOption = typeof quiz.correctAnswer === 'number' 
    ? quiz.options[quiz.correctAnswer]
    : quiz.correctAnswer;

  return (
    <div className="space-y-3">
      {quiz.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(option)}
          disabled={isAnswered}
          className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
            userAnswer === option
              ? isAnswered
                ? option === correctOption
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-blue-500 bg-blue-50'
              : isAnswered && option === correctOption
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoice;
