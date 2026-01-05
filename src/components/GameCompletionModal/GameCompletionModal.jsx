import React from 'react';
import { Trophy, Star, Clock, RotateCw, ArrowRight, Home } from 'lucide-react';
import './GameCompletionModal.css';

/**
 * Modal hiển thị khi hoàn thành game
 */
const GameCompletionModal = ({
  isOpen,
  onClose,
  onPlayAgain,
  onGoToJourney,
  result = {},
  gameTitle = 'Game'
}) => {
  if (!isOpen) return null;

  const { score = 0, maxScore = 100, stars = 0, playTime = 0, xpGained = 0 } = result;
  const percentage = Math.round((score / maxScore) * 100);

  // Format play time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get message based on performance
  const getMessage = () => {
    if (percentage >= 90) return 'Xuất sắc!';
    if (percentage >= 70) return 'Tuyệt vời!';
    if (percentage >= 50) return 'Hoàn thành!';
    return 'Cố gắng thêm!';
  };

  // Render stars
  const renderStars = () => {
    const starElements = [];
    for (let i = 1; i <= 3; i++) {
      starElements.push(
        <Star
          key={i}
          size={40}
          className={`completion-star ${i <= stars ? 'filled' : 'empty'}`}
          fill={i <= stars ? '#FFD700' : 'none'}
          stroke={i <= stars ? '#FFD700' : '#ccc'}
        />
      );
    }
    return starElements;
  };

  return (
    <div className="completion-modal-overlay" onClick={onClose}>
      <div className="completion-modal" onClick={e => e.stopPropagation()}>
        {/* Trophy Icon */}
        <div className="completion-trophy">
          <Trophy size={64} className="trophy-icon" />
        </div>

        {/* Message */}
        <h2 className="completion-message">{getMessage()}</h2>
        <p className="completion-game-title">{gameTitle}</p>

        {/* Stars */}
        <div className="completion-stars">
          {renderStars()}
        </div>

        {/* Score */}
        <div className="completion-score">
          <div className="score-circle">
            <span className="score-value">{percentage}%</span>
            <span className="score-label">Điểm số</span>
          </div>
        </div>

        {/* Stats */}
        <div className="completion-stats">
          <div className="stat-item">
            <Clock size={20} />
            <span>{formatTime(playTime)}</span>
            <span className="stat-label">Thời gian</span>
          </div>
          <div className="stat-item">
            <Trophy size={20} />
            <span>{score}/{maxScore}</span>
            <span className="stat-label">Điểm</span>
          </div>
          {xpGained > 0 && (
            <div className="stat-item xp-gained">
              <Star size={20} />
              <span>+{xpGained}</span>
              <span className="stat-label">XP</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="completion-actions">
          <button className="btn-play-again" onClick={onPlayAgain}>
            <RotateCw size={20} />
            Chơi lại
          </button>
          <button className="btn-continue" onClick={onGoToJourney}>
            <ArrowRight size={20} />
            Tiếp tục
          </button>
        </div>

        {/* Close button */}
        <button className="btn-close-modal" onClick={onClose}>
          <Home size={20} />
        </button>
      </div>
    </div>
  );
};

export default GameCompletionModal;
