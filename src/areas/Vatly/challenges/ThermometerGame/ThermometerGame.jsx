import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Thermometer } from 'lucide-react';
import './ThermometerGame.css';

const ThermometerGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  const challenges = [
    {
      id: 1,
      scenario: 'Nước đang sôi',
      temperature: 100,
      unit: 'C',
      icon: '♨️',
      hint: 'Nước sôi ở 100°C',
      description: 'Đọc nhiệt độ trên nhiệt kế',
      context: 'boiling'
    },
    {
      id: 2,
      scenario: 'Nước đá đang tan',
      temperature: 0,
      unit: 'C',
      icon: '🧊',
      hint: 'Nước đá tan ở 0°C',
      description: 'Nhiệt độ nước đá tan',
      context: 'freezing'
    },
    {
      id: 3,
      scenario: 'Nhiệt độ phòng',
      temperature: 25,
      unit: 'C',
      icon: '🏠',
      hint: 'Phòng thường 20-25°C',
      description: 'Nhiệt độ trong nhà',
      context: 'room'
    },
    {
      id: 4,
      scenario: 'Cơ thể người khỏe mạnh',
      temperature: 37,
      unit: 'C',
      icon: '🌡️',
      hint: 'Thân nhiệt bình thường 37°C',
      description: 'Đo nhiệt độ cơ thể',
      context: 'body'
    },
    {
      id: 5,
      scenario: 'Chuyển đổi: 68°F',
      temperature: 20,
      unit: 'C',
      icon: '🔄',
      hint: 'F = (C × 9/5) + 32',
      description: 'Đổi từ Fahrenheit sang Celsius',
      context: 'convert',
      showF: 68
    },
    {
      id: 6,
      scenario: 'Ngày nắng nóng',
      temperature: 35,
      unit: 'C',
      icon: '☀️',
      hint: 'Mùa hè có thể lên 35°C',
      description: 'Nhiệt độ mùa hè',
      context: 'hot'
    },
    {
      id: 7,
      scenario: 'Chuyển đổi: 212°F',
      temperature: 100,
      unit: 'C',
      icon: '🔄',
      hint: 'Nước sôi ở 212°F',
      description: 'Đổi từ Fahrenheit sang Celsius',
      context: 'convert',
      showF: 212
    },
    {
      id: 8,
      scenario: 'Tủ lạnh',
      temperature: 4,
      unit: 'C',
      icon: '❄️',
      hint: 'Tủ lạnh khoảng 2-6°C',
      description: 'Nhiệt độ bảo quản thực phẩm',
      context: 'fridge'
    },
    {
      id: 9,
      scenario: 'Chuyển đổi: 25°C sang °F',
      temperature: 77,
      unit: 'F',
      icon: '🔄',
      hint: 'F = (25 × 9/5) + 32',
      description: 'Đổi từ Celsius sang Fahrenheit',
      context: 'convert',
      showC: 25
    },
    {
      id: 10,
      scenario: 'Ngày lạnh mùa đông',
      temperature: -5,
      unit: 'C',
      icon: '🌨️',
      hint: 'Âm độ dưới 0°C',
      description: 'Nhiệt độ dưới điểm đóng băng',
      context: 'cold'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  useEffect(() => {
    if (timeLeft > 0 && !feedback && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      handleSubmit(true);
    }
  }, [timeLeft, feedback, gameOver]);

  const getThermometerHeight = (temp) => {
    // Scale: -10°C to 110°C mapped to 0-100%
    const min = -10;
    const max = 110;
    const percentage = ((temp - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getThermometerColor = (temp) => {
    if (temp < 0) return '#3b82f6'; // Blue
    if (temp < 20) return '#06b6d4'; // Cyan
    if (temp < 40) return '#10b981'; // Green
    if (temp < 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const handleSubmit = (timeout = false) => {
    if (feedback) return;

    const answer = parseFloat(userAnswer);
    const correctTemp = currentChallenge.temperature;
    const tolerance = 2;

    const isCorrect = !timeout && !isNaN(answer) && Math.abs(answer - correctTemp) <= tolerance;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const earnedPoints = 10 + timeBonus;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Đáp án: ${correctTemp}°${currentChallenge.unit}. Thời gian còn: ${timeLeft}s`
      });
    } else {
      setFeedback({
        correct: false,
        message: timeout ? 'Hết giờ! ⏰' : 'Chưa chính xác! 😅',
        detail: `Đáp án đúng: ${correctTemp}°${currentChallenge.unit}`
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

  if (!currentChallenge && !gameOver) return null;

  return (
    <div className="thermometer-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🌡️ Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Đọc nhiệt kế:</strong> Quan sát cột thủy ngân/rượu</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Đơn vị:</strong> °C (Celsius) hoặc °F (Fahrenheit)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Chuyển đổi:</strong> F = (C × 9/5) + 32</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Nhập nhiệt độ và hoàn thành trong 30 giây</p>
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
        <h1>🌡️ Nhiệt Kế Thông Minh</h1>
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
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className={`stat-value ${timeLeft < 10 ? 'time-warning' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(level / 10) * 100}%` }}></div>
          </div>

          <div className="challenge-info">
            <div className="scenario-icon">{currentChallenge.icon}</div>
            <h2>{currentChallenge.scenario}</h2>
            <p className="challenge-description">{currentChallenge.description}</p>
            <div className="hint-box">💡 {currentChallenge.hint}</div>
            {currentChallenge.showF && (
              <div className="convert-info">
                Chuyển đổi: <strong>{currentChallenge.showF}°F</strong> = ? °C
              </div>
            )}
            {currentChallenge.showC && (
              <div className="convert-info">
                Chuyển đổi: <strong>{currentChallenge.showC}°C</strong> = ? °F
              </div>
            )}
          </div>

          <div className="thermometer-display">
            <div className="thermometer-container">
              <div className="thermometer-glass">
                <div className="temperature-scale">
                  <div className="scale-mark">110°C</div>
                  <div className="scale-mark">100°C</div>
                  <div className="scale-mark">80°C</div>
                  <div className="scale-mark">60°C</div>
                  <div className="scale-mark">40°C</div>
                  <div className="scale-mark">20°C</div>
                  <div className="scale-mark">0°C</div>
                  <div className="scale-mark">-10°C</div>
                </div>
                <div className="mercury-tube">
                  <div 
                    className="mercury-fill"
                    style={{ 
                      height: `${getThermometerHeight(currentChallenge.temperature)}%`,
                      background: getThermometerColor(currentChallenge.temperature)
                    }}
                  ></div>
                </div>
              </div>
              <div className="thermometer-bulb">
                <div 
                  className="bulb-fill"
                  style={{ background: getThermometerColor(currentChallenge.temperature) }}
                ></div>
              </div>
            </div>

            <div className="context-image">
              {currentChallenge.context === 'boiling' && <div className="context-visual">♨️♨️♨️</div>}
              {currentChallenge.context === 'freezing' && <div className="context-visual">🧊❄️🧊</div>}
              {currentChallenge.context === 'room' && <div className="context-visual">🏠🪴🛋️</div>}
              {currentChallenge.context === 'body' && <div className="context-visual">🧑‍⚕️🌡️</div>}
              {currentChallenge.context === 'hot' && <div className="context-visual">☀️🥵☀️</div>}
              {currentChallenge.context === 'fridge' && <div className="context-visual">❄️🥤🍎</div>}
              {currentChallenge.context === 'cold' && <div className="context-visual">🌨️⛄❄️</div>}
            </div>
          </div>

          <div className="answer-section">
            <label htmlFor="temp-input">Nhiệt độ:</label>
            <div className="input-group">
              <input
                id="temp-input"
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập nhiệt độ"
                disabled={!!feedback}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <span className="unit-label">°{currentChallenge.unit}</span>
            </div>
          </div>

          <button onClick={() => handleSubmit()} className="submit-btn" disabled={!!feedback || !userAnswer}>
            Kiểm tra ✓
          </button>

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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia nhiệt độ!</div>}
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

export default ThermometerGame;
