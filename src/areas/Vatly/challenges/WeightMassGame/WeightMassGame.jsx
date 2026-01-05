import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw } from 'lucide-react';
import './WeightMassGame.css';

const WeightMassGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState('earth');

  const objects = [
    { name: 'Người', mass: 60, icon: '🧍' },
    { name: 'Hộp gỗ', mass: 10, icon: '📦' },
    { name: 'Quả bóng', mass: 0.5, icon: '⚽' },
    { name: 'Xe đạp', mass: 15, icon: '🚲' },
    { name: 'Bàn học', mass: 20, icon: '🪑' },
    { name: 'Tủ lạnh', mass: 80, icon: '🧊' },
    { name: 'Chó', mass: 8, icon: '🐕' },
    { name: 'Mèo', mass: 4, icon: '🐈' },
    { name: 'Sách', mass: 1, icon: '📚' },
    { name: 'Máy tính', mass: 25, icon: '💻' }
  ];

  const g_earth = 10; // m/s²
  const g_moon = 1.6; // m/s²

  const generateQuestion = () => {
    const obj = objects[level - 1];
    setCurrentQuestion(obj);
    setSelectedPlanet('earth');
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateQuestion();
    }
  }, [level]);

  const calculateWeight = (mass, planet) => {
    const g = planet === 'earth' ? g_earth : g_moon;
    return mass * g;
  };

  const handleSubmit = () => {
    if (feedback || !userAnswer) return;

    const correctWeight = calculateWeight(currentQuestion.mass, selectedPlanet);
    const answer = parseFloat(userAnswer);
    const isCorrect = Math.abs(answer - correctWeight) < 1;

    if (isCorrect) {
      const earnedPoints = 10;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Khối lượng: ${currentQuestion.mass}kg, Trọng lượng: ${correctWeight}N`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: `Đáp án đúng: ${correctWeight}N`
      });
    }

    setTimeout(() => {
      if (level < 10) {
        setLevel(level + 1);
      } else {
        setGameOver(true);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowTutorial(false);
  };

  if (!currentQuestion && !gameOver) return null;

  return (
    <div className="weight-mass-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🪨 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Khối lượng</strong> không thay đổi ở mọi nơi</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Trọng lượng</strong> = Khối lượng × g</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p>Trái Đất: g = 10 m/s², Mặt Trăng: g = 1.6 m/s²</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Chọn hành tinh và tính trọng lượng</p>
              </div>
            </div>
            <button onClick={() => setShowTutorial(false)} className="start-game-btn">
              Bắt đầu chơi! 🎮
            </button>
          </div>
        </div>
      )}

      <div className="game-header">
        <button onClick={() => navigate('/physics-games/grade/6')} className="back-btn">
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <h1>🪨 Trọng Lượng & Khối Lượng</h1>
      </div>

      {!gameOver ? (
        <div className="game-content">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Câu</span>
              <span className="stat-value">{level}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(level / 10) * 100}%` }}></div>
          </div>

          <div className="object-display">
            <div className="object-icon">{currentQuestion.icon}</div>
            <h2>{currentQuestion.name}</h2>
            <div className="mass-display">
              Khối lượng: <strong>{currentQuestion.mass} kg</strong>
            </div>
          </div>

          <div className="planet-selector">
            <h3>Chọn hành tinh:</h3>
            <div className="planets">
              <button
                className={`planet-btn ${selectedPlanet === 'earth' ? 'active' : ''}`}
                onClick={() => setSelectedPlanet('earth')}
              >
                🌍 Trái Đất<br/>
                <small>g = 10 m/s²</small>
              </button>
              <button
                className={`planet-btn ${selectedPlanet === 'moon' ? 'active' : ''}`}
                onClick={() => setSelectedPlanet('moon')}
              >
                🌙 Mặt Trăng<br/>
                <small>g = 1.6 m/s²</small>
              </button>
            </div>
          </div>

          <div className="answer-section">
            <div className="input-group">
              <label>Trọng lượng trên {selectedPlanet === 'earth' ? 'Trái Đất' : 'Mặt Trăng'}:</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Nhập trọng lượng"
                  step="0.1"
                  disabled={!!feedback}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <span className="unit-label">N</span>
              </div>
            </div>
            <button onClick={handleSubmit} className="submit-btn" disabled={!!feedback || !userAnswer}>
              Kiểm tra ✓
            </button>
          </div>

          {feedback && (
            <div className={`feedback ${feedback.correct ? 'correct-feedback' : 'wrong-feedback'}`}>
              <div className="feedback-message">{feedback.message}</div>
              {feedback.detail && <div className="feedback-detail">{feedback.detail}</div>}
            </div>
          )}
        </div>
      ) : (
        <div className="game-over">
          <Award size={80} className="trophy-icon" />
          <h2>🎉 Hoàn thành!</h2>
          <div className="final-stats">
            <div className="final-stat">
              <span className="final-label">Tổng điểm</span>
              <span className="final-value">{score}</span>
            </div>
            <div className="final-stat">
              <span className="final-label">Trả lời đúng</span>
              <span className="final-value">{correctAnswers}/10</span>
            </div>
          </div>
          <div className="achievement">
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia vật lý!</div>}
            {correctAnswers >= 7 && correctAnswers < 9 && <div className="badge silver">🥈 Rất tốt!</div>}
            {correctAnswers >= 5 && correctAnswers < 7 && <div className="badge bronze">🥉 Khá tốt!</div>}
          </div>
          <div className="button-group">
            <button onClick={handleRestart} className="restart-btn">
              <RotateCcw size={20} />
              Chơi lại
            </button>
            <button onClick={() => navigate('/physics-games/grade/6')} className="back-menu-btn">
              Về danh sách game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightMassGame;
