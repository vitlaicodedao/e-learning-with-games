import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

const ResultModal = ({ 
  isOpen, 
  onClose, 
  score, 
  totalPoints, 
  onRestart, 
  onBack,
  onNext,
  hasNextLesson = false
}) => {
  const percentage = (score / totalPoints) * 100;
  
  // Calculate stars: >=50%: 1 star, >=80%: 2 stars, 100%: 3 stars
  let stars = 0;
  if (percentage >= 100) {
    stars = 3;
  } else if (percentage >= 80) {
    stars = 2;
  } else if (percentage >= 50) {
    stars = 1;
  }
  
  const canProgress = percentage >= 50; // Need at least 50% (1 star) to continue

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Hiển thị số sao đạt được */}
        {stars > 0 && (
          <div className="text-6xl mb-4 animate-bounce flex justify-center gap-1">
            {[...Array(stars)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-2">
          {stars === 3 ? '🎉 Hoàn hảo!' : stars === 2 ? '👏 Xuất sắc!' : stars === 1 ? '💪 Tốt lắm!' : '😢 Chưa đạt'}
        </h2>

        <div className="text-6xl font-bold text-blue-600 mb-4">
          {score} / {totalPoints}
        </div>
        
        <div className="mb-4">
          <div className="text-lg font-medium text-gray-700 mb-2">
            Tỷ lệ hoàn thành: {percentage.toFixed(0)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all ${stars >= 2 ? 'bg-success' : stars === 1 ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-lg mb-6">
          {stars === 3
            ? '🎊 Hoàn hảo! Bạn đạt 3 sao! 🌟🌟🌟'
            : stars === 2
            ? '⭐ Tuyệt vời! Bạn đạt 2 sao! ⭐⭐'
            : stars === 1
            ? '⭐ Tốt! Bạn đạt 1 sao! ⭐'
            : canProgress
            ? `✅ Bạn đã đạt ${percentage.toFixed(0)}%! Có thể tiếp tục bài học tiếp theo.`
            : '📚 Đạt ≥60% để tiếp tục. Hãy thử lại!'}
        </p>
        
        <div className="flex gap-3 justify-center">
          {canProgress ? (
            // Nếu đạt ≥60%, cho phép tiếp tục hoặc về dashboard
            <>              
                <Button onClick={onNext}>
                  ➡️ Bài học tiếp theo
                </Button>
                <Button onClick={onBack}>
                  🏠 Trở về Dashboard
                </Button>
            </>
          ) : (
            // Nếu <60%, chỉ cho chơi lại hoặc về dashboard
            <>
              <Button onClick={onRestart}>
                🔄 Chơi lại
              </Button>
              <Button variant="outline" onClick={onBack}>
                🏠 Trở về Dashboard
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ResultModal;
