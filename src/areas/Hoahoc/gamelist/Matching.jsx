const Matching = ({ 
  quiz, 
  isAnswered, 
  matchingAnswers, 
  matchingPool,
  onDragStart,
  onDropToLeft,
  onDragOverLeft,
  onRemoveAssigned
}) => {
  return (
    <div className="space-y-6">
      {/* Targets */}
      {quiz.pairs.map((pair, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex-1 p-3 bg-blue-50 border-2 border-blue-300 rounded">
            {pair.left}
          </div>
          <div
            onDrop={(e) => !isAnswered && onDropToLeft(pair.left, e)}
            onDragOver={onDragOverLeft}
            className={`flex-1 min-h-[48px] p-3 border-2 rounded flex items-center justify-between ${
              matchingAnswers[pair.left]
                ? 'border-green-400 bg-green-50'
                : 'border-dashed border-gray-300 bg-white'
            }`}
          >
            <span>{matchingAnswers[pair.left] || 'Kéo đáp án vào đây'}</span>
            {matchingAnswers[pair.left] && !isAnswered && (
              <button onClick={() => onRemoveAssigned(pair.left)} className="text-sm text-red-600">Bỏ</button>
            )}
          </div>
          {isAnswered && (
            <div className="text-2xl">
              {matchingAnswers[pair.left] === pair.right ? '✓' : '✗'}
            </div>
          )}
        </div>
      ))}

      {/* Pool */}
      {!isAnswered && (
        <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded">
          <div className="text-sm text-gray-600 mb-2">Kéo các đáp án sau đến vị trí phù hợp:</div>
          <div className="flex flex-wrap gap-2">
            {matchingPool.map((opt, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => onDragStart(e, opt)}
                className="px-3 py-2 bg-white border-2 border-gray-300 rounded cursor-move hover:border-blue-400"
              >
                {opt}
              </div>
            ))}
            {matchingPool.length === 0 && (
              <div className="text-gray-500 text-sm">Đã kéo hết đáp án.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Matching;
