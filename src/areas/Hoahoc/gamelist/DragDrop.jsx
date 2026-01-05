const DragDrop = ({ 
  quiz, 
  isAnswered, 
  matchingAnswers,
  inlineSlots,
  inlineOptions,
  onDragStartOption,
  onDropToLeft,
  onDragOverLeft,
  onRemoveAssigned,
  onDragStartInline,
  onDropToSlot,
  onDragOverSlot,
  onRemoveInlineAssigned
}) => {
  // Inline drag-drop (Duolingo-style)
  if (quiz.inline) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center gap-6">
          {inlineSlots.map(slot => (
            <div key={slot.id} className="flex flex-col items-center gap-2">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center border-2 ${isAnswered ? 'opacity-80' : 'bg-white'}`}>
                <div
                  onDrop={(e) => !isAnswered && onDropToSlot(slot.id, e)}
                  onDragOver={onDragOverSlot}
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: slot.value ? (slot.correct === slot.value ? '#f0fff4' : '#fff5f5') : '#f8fafc' }}
                >
                  {slot.value ? (
                    <div className="text-lg font-bold">{slot.value}</div>
                  ) : (
                    <div className="text-sm text-gray-600">{slot.label}</div>
                  )}
                </div>
              </div>
              {!isAnswered && slot.value && (
                <button onClick={() => onRemoveInlineAssigned(slot.id)} className="text-sm text-red-600">Bỏ</button>
              )}
            </div>
          ))}
        </div>

        {!isAnswered && (
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            {inlineOptions.map((opt, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => onDragStartInline(e, opt)}
                className="px-4 py-2 bg-white border rounded shadow cursor-move"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard drag-drop
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Các mục (Kéo)</h4>
          <div className="space-y-2">
            {quiz.pairs?.map((pair, index) => (
              <div
                key={`drag-${index}`}
                draggable={!isAnswered}
                onDragStart={(e) => onDragStartOption(e, pair.right)}
                className={`p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-move ${isAnswered ? 'opacity-60' : ''}`}
              >
                <span className="font-medium">🔸 {pair.left}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Nhóm (Thả vào)</h4>
          <div className="space-y-2">
            {quiz.pairs?.map((pair, index) => (
              <div
                key={`target-${index}`}
                onDrop={(e) => !isAnswered && onDropToLeft(pair.left, e)}
                onDragOver={onDragOverLeft}
                className={`p-3 rounded-lg border-2 min-h-[48px] flex items-center justify-between ${matchingAnswers[pair.left] ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300 bg-white'}`}
              >
                <span>{matchingAnswers[pair.left] || pair.right}</span>
                {matchingAnswers[pair.left] && !isAnswered && (
                  <button onClick={() => onRemoveAssigned(pair.left)} className="text-sm text-red-600">Bỏ</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isAnswered && (
        <div className="text-sm text-gray-600 italic text-center">Kéo từng mục từ cột trái vào nhóm phù hợp ở cột phải, sau đó nhấn "Kiểm tra đáp án"</div>
      )}
    </div>
  );
};

export default DragDrop;
