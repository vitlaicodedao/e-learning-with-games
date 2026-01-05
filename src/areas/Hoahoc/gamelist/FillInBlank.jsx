const FillInBlank = ({ quiz, userAnswer, isAnswered, onAnswer }) => {
  return (
    <div>
      <input
        type="text"
        value={userAnswer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={isAnswered}
        placeholder="Nhập câu trả lời của bạn..."
        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />
      {isAnswered && (
        <div className={`mt-3 p-3 rounded ${
          userAnswer?.toString().trim().toLowerCase() === quiz.correctAnswer?.toString().trim().toLowerCase()
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          Đáp án đúng: <strong>{quiz.correctAnswer}</strong>
        </div>
      )}
      {quiz.hint && !isAnswered && (
        <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded">
          💡 Gợi ý: {quiz.hint}
        </div>
      )}
    </div>
  );
};

export default FillInBlank;
