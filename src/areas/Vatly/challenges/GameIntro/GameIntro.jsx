import React from 'react';
import './GameIntro.css';

const GameIntro = ({ gameInfo, onStart }) => {
  const {
    title,
    description,
    howToPlay,
    scoring,
    physics,
    difficulty,
    estimatedTime
  } = gameInfo;

  return (
    <div className="game-intro-overlay">
      <div className="game-intro-container">
        <div className="game-intro-header">
          <h1 className="game-intro-title">{title}</h1>
          <div className="game-intro-badges">
            <span className="difficulty-badge" data-level={difficulty}>
              {difficulty === 1 && '⭐ Dễ'}
              {difficulty === 2 && '⭐⭐ Trung bình'}
              {difficulty === 3 && '⭐⭐⭐ Khó'}
              {difficulty === 4 && '⭐⭐⭐⭐ Rất khó'}
            </span>
            <span className="time-badge">⏱️ {estimatedTime}</span>
          </div>
        </div>

        <div className="game-intro-content">
          {/* Giới thiệu */}
          <section className="intro-section">
            <h2>📖 Giới thiệu</h2>
            <p>{description}</p>
          </section>

          {/* Cách chơi */}
          <section className="intro-section">
            <h2>🎮 Cách chơi</h2>
            <ol className="how-to-play-list">
              {howToPlay.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Cách tính điểm */}
          <section className="intro-section">
            <h2>🎯 Cách tính điểm</h2>
            <div className="scoring-info">
              <div className="scoring-item">
                <span className="scoring-label">Điểm cơ bản:</span>
                <span className="scoring-value">{scoring.base}</span>
              </div>
              {scoring.bonuses && scoring.bonuses.length > 0 && (
                <div className="scoring-group">
                  <h4>✨ Điểm thưởng:</h4>
                  <ul>
                    {scoring.bonuses.map((bonus, index) => (
                      <li key={index}>{bonus}</li>
                    ))}
                  </ul>
                </div>
              )}
              {scoring.penalties && scoring.penalties.length > 0 && (
                <div className="scoring-group">
                  <h4>⚠️ Phạt điểm:</h4>
                  <ul>
                    {scoring.penalties.map((penalty, index) => (
                      <li key={index}>{penalty}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="scoring-item max-score">
                <span className="scoring-label">Điểm tối đa:</span>
                <span className="scoring-value highlight">{scoring.max}</span>
              </div>
            </div>
          </section>

          {/* Kiến thức vật lý */}
          {physics && physics.length > 0 && (
            <section className="intro-section">
              <h2>⚛️ Kiến thức vật lý</h2>
              <ul className="physics-list">
                {physics.map((concept, index) => (
                  <li key={index}>{concept}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="game-intro-footer">
          <button className="start-game-btn" onClick={onStart}>
            🚀 Bắt đầu chơi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
