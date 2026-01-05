import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Flame } from 'lucide-react';
import './ThermalExpansionGame.css';

const ThermalExpansionGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [temperature, setTemperature] = useState(20);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isHeating, setIsHeating] = useState(false);

  const challenges = [
    {
      id: 1,
      material: 'Dây điện đồng',
      icon: '🔌',
      type: 'metal',
      minTemp: 20,
      maxTemp: 100,
      targetTemp: 80,
      expansionRate: 0.017,
      hint: 'Kim loại giãn nở khi nhiệt độ tăng',
      description: 'Quan sát dây đồng giãn nở khi đun nóng',
      color: '#d97706'
    },
    {
      id: 2,
      material: 'Dải sắt',
      icon: '🔩',
      type: 'metal',
      minTemp: 20,
      maxTemp: 120,
      targetTemp: 90,
      expansionRate: 0.012,
      hint: 'Sắt giãn nở ít hơn đồng',
      description: 'Đun nóng thanh sắt',
      color: '#6b7280'
    },
    {
      id: 3,
      material: 'Bóng bay',
      icon: '🎈',
      type: 'gas',
      minTemp: 10,
      maxTemp: 60,
      targetTemp: 45,
      expansionRate: 0.04,
      hint: 'Khí giãn nở mạnh nhất',
      description: 'Bóng bay phồng lên khi nóng',
      color: '#ef4444'
    },
    {
      id: 4,
      material: 'Nước trong bình',
      icon: '💧',
      type: 'liquid',
      minTemp: 10,
      maxTemp: 80,
      targetTemp: 60,
      expansionRate: 0.021,
      hint: 'Chất lỏng giãn nở vừa phải',
      description: 'Mực nước dâng cao khi đun',
      color: '#3b82f6'
    },
    {
      id: 5,
      material: 'Thanh nhôm',
      icon: '🪙',
      type: 'metal',
      minTemp: 20,
      maxTemp: 150,
      targetTemp: 100,
      expansionRate: 0.024,
      hint: 'Nhôm giãn nở nhiều hơn sắt',
      description: 'Thanh nhôm giãn dài',
      color: '#94a3b8'
    },
    {
      id: 6,
      material: 'Hơi nước',
      icon: '♨️',
      type: 'gas',
      minTemp: 100,
      maxTemp: 200,
      targetTemp: 150,
      expansionRate: 0.05,
      hint: 'Hơi nước giãn nở rất mạnh',
      description: 'Hơi nước thoát ra khi đun sôi',
      color: '#e5e7eb'
    },
    {
      id: 7,
      material: 'Dầu ăn',
      icon: '🛢️',
      type: 'liquid',
      minTemp: 20,
      maxTemp: 120,
      targetTemp: 80,
      expansionRate: 0.028,
      hint: 'Dầu giãn nở nhiều hơn nước',
      description: 'Dầu nở ra khi nhiệt độ tăng',
      color: '#fbbf24'
    },
    {
      id: 8,
      material: 'Đường ray xe lửa',
      icon: '🛤️',
      type: 'metal',
      minTemp: 20,
      maxTemp: 60,
      targetTemp: 45,
      expansionRate: 0.012,
      hint: 'Ray giãn nở nên có khe hở',
      description: 'Quan sát khe hở trên ray',
      color: '#475569'
    },
    {
      id: 9,
      material: 'Không khí trong lốp xe',
      icon: '🚗',
      type: 'gas',
      minTemp: 20,
      maxTemp: 70,
      targetTemp: 55,
      expansionRate: 0.037,
      hint: 'Áp suất lốp tăng khi nóng',
      description: 'Không khí giãn nở trong lốp',
      color: '#1f2937'
    },
    {
      id: 10,
      material: 'Thuỷ ngân trong nhiệt kế',
      icon: '🌡️',
      type: 'liquid',
      minTemp: 0,
      maxTemp: 100,
      targetTemp: 70,
      expansionRate: 0.018,
      hint: 'Thuỷ ngân giãn nở đều',
      description: 'Cột thuỷ ngân dâng lên',
      color: '#9ca3af'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setTemperature(challenge.minTemp);
    setFeedback(null);
    setIsHeating(false);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const calculateSize = () => {
    if (!currentChallenge) return 100;
    const tempDiff = temperature - currentChallenge.minTemp;
    const expansion = tempDiff * currentChallenge.expansionRate;
    return 100 + expansion;
  };

  const getExpansionPercentage = () => {
    if (!currentChallenge) return 0;
    const range = currentChallenge.maxTemp - currentChallenge.minTemp;
    const current = temperature - currentChallenge.minTemp;
    return (current / range) * 100;
  };

  const handleHeating = () => {
    if (isHeating) {
      setIsHeating(false);
    } else {
      setIsHeating(true);
    }
  };

  useEffect(() => {
    if (isHeating && temperature < currentChallenge.maxTemp && !feedback) {
      const timer = setTimeout(() => {
        setTemperature(Math.min(temperature + 1, currentChallenge.maxTemp));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHeating, temperature, feedback]);

  const handleCooling = () => {
    if (temperature > currentChallenge.minTemp) {
      setTemperature(Math.max(temperature - 5, currentChallenge.minTemp));
    }
  };

  const handleSubmit = () => {
    if (feedback) return;

    const targetTemp = currentChallenge.targetTemp;
    const tolerance = 5;

    const isCorrect = Math.abs(temperature - targetTemp) <= tolerance;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Nhiệt độ: ${temperature}°C ≈ ${targetTemp}°C`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: `Nhiệt độ cần: ${targetTemp}°C (±${tolerance}°C)`
      });
    }

    setIsHeating(false);

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
    <div className="thermal-expansion-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🔥 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Giãn nở nhiệt:</strong> Vật nở ra khi nhiệt độ tăng</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Thứ tự:</strong> Khí giãn nở nhiều nhất, sau đó đến lỏng, rắn ít nhất</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Điều khiển:</strong> Đun nóng hoặc làm lạnh để đạt nhiệt độ mục tiêu</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Quan sát vật giãn nở và kiểm tra kết quả</p>
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
        <h1>🔥 Giãn Nở Nhiệt</h1>
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

          <div className="challenge-info">
            <div className="material-icon">{currentChallenge.icon}</div>
            <h2>{currentChallenge.material}</h2>
            <p className="challenge-description">{currentChallenge.description}</p>
            <div className="hint-box">💡 {currentChallenge.hint}</div>
            <div className="target-info">
              Đạt nhiệt độ: <strong>{currentChallenge.targetTemp}°C</strong> (±5°C)
            </div>
          </div>

          <div className="expansion-simulator">
            <div className="temperature-display">
              <div className="temp-value">{temperature}°C</div>
              <div className="temp-range">
                <span>{currentChallenge.minTemp}°C</span>
                <span>{currentChallenge.maxTemp}°C</span>
              </div>
              <div className="temp-progress-bar">
                <div 
                  className="temp-progress-fill"
                  style={{ 
                    width: `${getExpansionPercentage()}%`,
                    background: `linear-gradient(90deg, #3b82f6, ${currentChallenge.color})`
                  }}
                ></div>
              </div>
            </div>

            <div className="visual-container">
              {currentChallenge.type === 'metal' && (
                <div className="metal-bar-container">
                  <div 
                    className="metal-bar"
                    style={{ 
                      width: `${calculateSize()}%`,
                      background: currentChallenge.color,
                      transition: 'width 0.3s ease'
                    }}
                  >
                    <div className="bar-length">{calculateSize().toFixed(1)}%</div>
                  </div>
                  <div className="reference-line">100%</div>
                </div>
              )}

              {currentChallenge.type === 'gas' && (
                <div className="gas-container">
                  <div 
                    className="gas-balloon"
                    style={{ 
                      width: `${calculateSize() * 2}px`,
                      height: `${calculateSize() * 2}px`,
                      background: currentChallenge.color,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="gas-icon">{currentChallenge.icon}</span>
                  </div>
                  <div className="gas-particles">
                    {[...Array(Math.floor(calculateSize() / 20))].map((_, i) => (
                      <div 
                        key={i} 
                        className="particle"
                        style={{ 
                          animationDelay: `${i * 0.2}s`,
                          left: `${Math.random() * 80}%`,
                          top: `${Math.random() * 80}%`
                        }}
                      >•</div>
                    ))}
                  </div>
                </div>
              )}

              {currentChallenge.type === 'liquid' && (
                <div className="liquid-container">
                  <div className="beaker">
                    <div 
                      className="liquid-level"
                      style={{ 
                        height: `${calculateSize() * 0.8}%`,
                        background: currentChallenge.color,
                        transition: 'height 0.3s ease'
                      }}
                    >
                      <div className="liquid-surface"></div>
                    </div>
                    <div className="beaker-marks">
                      <div className="mark">100ml</div>
                      <div className="mark">80ml</div>
                      <div className="mark">60ml</div>
                      <div className="mark">40ml</div>
                      <div className="mark">20ml</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="heat-indicator">
                {isHeating && <div className="flame-animation">🔥🔥🔥</div>}
              </div>
            </div>

            <div className="controls">
              <button 
                onClick={handleHeating} 
                className={`control-btn heat-btn ${isHeating ? 'active' : ''}`}
                disabled={!!feedback || temperature >= currentChallenge.maxTemp}
              >
                <Flame size={20} />
                {isHeating ? 'Đang đun' : 'Đun nóng'}
              </button>
              <button 
                onClick={handleCooling} 
                className="control-btn cool-btn"
                disabled={!!feedback || temperature <= currentChallenge.minTemp}
              >
                ❄️ Làm lạnh
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} className="submit-btn" disabled={!!feedback}>
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia nhiệt học!</div>}
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

export default ThermalExpansionGame;
