import React from 'react';

const Ordering = ({ 
  quiz, 
  orderedItems, 
  isAnswered,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const gridTemplate = orderedItems
    .map((_, i) => (i < orderedItems.length - 1 ? '1fr auto' : '1fr'))
    .join(' ');

  const correctGridTemplate = quiz.correctOrder
    .map((_, i) => (i < quiz.correctOrder.length - 1 ? 'auto auto' : 'auto'))
    .join(' ');

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">Kéo để sắp xếp theo thứ tự đúng từ trái sang phải:</div>
      <div className="grid items-start gap-2" style={{ gridTemplateColumns: gridTemplate }}>
        {orderedItems.map((item, index) => {
          const correctAtPos = isAnswered ? item === quiz.correctOrder[index] : null;
          return (
            <React.Fragment key={`ordering-${index}`}>
              <div
                draggable={!isAnswered}
                onDragStart={() => onDragStart(index)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(index)}
                className={`min-w-0 max-w-[240px] px-3 py-2 rounded-lg border-2 bg-white cursor-move select-none shadow-sm text-sm leading-snug whitespace-normal break-words ${
                  isAnswered
                    ? correctAtPos
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {item}
              </div>
              {index < orderedItems.length - 1 && (
                <div className="self-center text-gray-400">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded">
          <div className="font-bold mb-2">Thứ tự đúng:</div>
          <div className="grid items-start gap-2" style={{ gridTemplateColumns: correctGridTemplate }}>
            {quiz.correctOrder.map((item, index) => (
              <React.Fragment key={`correct-${index}`}>
                <div className="px-3 py-2 rounded-lg border-2 border-green-400 bg-white text-sm leading-snug">
                  {item}
                </div>
                {index < quiz.correctOrder.length - 1 && (
                  <div className="self-center text-gray-400">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordering;
