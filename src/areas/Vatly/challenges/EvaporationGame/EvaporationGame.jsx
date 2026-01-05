import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Wind } from 'lucide-react';
import './EvaporationGame.css';

const EvaporationGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Environmental factors
  const [temperature, setTemperature] = useState(25);
  const [windSpeed, setWindSpeed] = useState(5);
  const [humidity, setHumidity] = useState(50);
  const [surfaceArea, setSurfaceArea] = useState(50);

  const challenges = [
    {
      id: 1,
      scenario: 'Phơi quần áo ngoài trời',
      icon: '👕',
      targetRate: 60,
      optimalTemp: 35,
      optimalWind: 15,
      optimalHumidity: 30,
      optimalArea: 80,
      hint: 'Nhiệt độ cao + gió mạnh + độ ẩm thấp = bốc hơi nhanh',
      description: 'Làm thế nào để quần áo khô nhanh?'
    },
    {
      id: 2,
      scenario: 'Làm khô hạt thóc',
      icon: '🌾',
      targetRate: 70,
      optimalTemp: 40,
      optimalWind: 20,
      optimalHumidity: 20,
      optimalArea: 90,
      hint: 'Phơi rộng ra, nắng gắt, gió to',
      description: 'Phơi thóc hiệu quả'
    },
    {
      id: 3,
      scenario: 'Giữ nước lâu bay hơi',
      icon: '💧',
      targetRate: 20,
      optimalTemp: 15,
      optimalWind: 5,
      optimalHumidity: 80,
      optimalArea: 20,
      hint: 'Nhiệt độ thấp + không gió + độ ẩm cao',
      description: 'Làm chậm sự bốc hơi'
    },
    {
      id: 4,
      scenario: 'Sấy tóc nhanh',
      icon: '💇',
      targetRate: 75,
      optimalTemp: 45,
      optimalWind: 25,
      optimalHumidity: 25,
      optimalArea: 70,
      hint: 'Máy sấy nóng + gió mạnh',
      description: 'Sấy khô tóc ướt'
    },
    {
      id: 5,
      scenario: 'Làm muối từ nước biển',
      icon: '🧂',
      targetRate: 65,
      optimalTemp: 38,
      optimalWind: 18,
      optimalHumidity: 35,
      optimalArea: 85,
      hint: 'Ruộng muối phơi rộng',
      description: 'Bốc hơi nước biển lấy muối'
    },
    {
      id: 6,
      scenario: 'Bảo quản thực phẩm tươi',
      icon: '🥗',
      targetRate: 15,
      optimalTemp: 10,
      optimalWind: 3,
      optimalHumidity: 85,
      optimalArea: 15,
      hint: 'Tủ lạnh mát + đậy kín',
      description: 'Giữ độ ẩm cho thực phẩm'
    },
    {
      id: 7,
      scenario: 'Lau sàn nhà cho nhanh khô',
      icon: '🧹',
      targetRate: 68,
      optimalTemp: 32,
      optimalWind: 22,
      optimalHumidity: 28,
      optimalArea: 75,
      hint: 'Mở cửa + quạt + nóng',
      description: 'Làm khô sàn nhà'
    },
    {
      id: 8,
      scenario: 'Ủ rượu (giữ ẩm)',
      icon: '🍶',
      targetRate: 10,
      optimalTemp: 18,
      optimalWind: 2,
      optimalHumidity: 90,
      optimalArea: 10,
      hint: 'Kín + mát + ẩm cao',
      description: 'Ngăn rượu bay hơi'
    },
    {
      id: 9,
      scenario: 'Sấy trái cây làm mứt',
      icon: '🍎',
      targetRate: 72,
      optimalTemp: 42,
      optimalWind: 23,
      optimalHumidity: 22,
      optimalArea: 88,
      hint: 'Lò sấy nóng + gió tuần hoàn',
      description: 'Làm khô trái cây'
    },
    {
      id: 10,
      scenario: 'Giữ ẩm cho da mặt',
      icon: '😊',
      targetRate: 18,
      optimalTemp: 20,
      optimalWind: 4,
      optimalHumidity: 75,
      optimalArea: 25,
      hint: 'Nhiệt độ ổn + tránh gió + ẩm vừa',
      description: 'Ngăn da khô'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setFeedback(null);
    // Reset to default values
    setTemperature(25);
    setWindSpeed(5);
    setHumidity(50);
    setSurfaceArea(50);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const calculateEvaporationRate = () => {
    // Formula: Rate = (Temp factor) × (Wind factor) × (1/Humidity factor) × (Area factor)
    const tempFactor = temperature / 10;
    const windFactor = windSpeed / 5;
    const humidityFactor = 100 / (humidity + 10);
    const areaFactor = surfaceArea / 20;
    
    const rate = tempFactor * windFactor * humidityFactor * areaFactor * 10;
    return Math.min(100, Math.max(0, rate));
  };

  const getVaporParticles = () => {
    const rate = calculateEvaporationRate();
    return Math.floor(rate / 10);
  };

  const handleSubmit = () => {
    if (feedback) return;

    const currentRate = calculateEvaporationRate();
    const targetRate = currentChallenge.targetRate;
    const tolerance = 10;

    const isCorrect = Math.abs(currentRate - targetRate) <= tolerance;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Tốc độ bốc hơi: ${currentRate.toFixed(0)}% ≈ ${targetRate}%`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa tối ưu! 😅',
        detail: `Tốc độ hiện tại: ${currentRate.toFixed(0)}%, Mục tiêu: ${targetRate}%`
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
    <div className="evaporation-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>💨 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Bốc hơi:</strong> Chất lỏng chuyển thành hơi ở mọi nhiệt độ</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Tăng tốc:</strong> Nhiệt độ cao, gió mạnh, độ ẩm thấp, diện tích lớn</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Giảm tốc:</strong> Nhiệt độ thấp, không gió, độ ẩm cao, diện tích nhỏ</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Điều chỉnh 4 yếu tố để đạt tốc độ bốc hơi mục tiêu</p>
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
        <h1>💨 Sự Bốc Hơi</h1>
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
            <div className="scenario-icon">{currentChallenge.icon}</div>
            <h2>{currentChallenge.scenario}</h2>
            <p className="challenge-description">{currentChallenge.description}</p>
            <div className="hint-box">💡 {currentChallenge.hint}</div>
            <div className="target-display">
              Tốc độ bốc hơi mục tiêu: <strong>{currentChallenge.targetRate}%</strong>
            </div>
          </div>

          <div className="evaporation-simulator">
            <div className="visual-area">
              <div className="water-container">
                <div className="water-surface">
                  <div className="water-level" style={{ opacity: Math.max(0.3, 1 - calculateEvaporationRate() / 100) }}>
                    💧
                  </div>
                  <div className="vapor-particles">
                    {[...Array(getVaporParticles())].map((_, i) => (
                      <div
                        key={i}
                        className="vapor-particle"
                        style={{
                          left: `${Math.random() * 90}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                      >
                        ☁️
                      </div>
                    ))}
                  </div>
                </div>
                <div className="environment-effects">
                  {temperature > 30 && <div className="sun-effect">☀️</div>}
                  {windSpeed > 15 && <div className="wind-effect">💨💨💨</div>}
                  {humidity > 70 && <div className="humidity-effect">💧💧💧</div>}
                </div>
              </div>

              <div className="rate-meter">
                <h3>Tốc độ bốc hơi</h3>
                <div className="meter-bar">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${calculateEvaporationRate()}%`,
                      background: calculateEvaporationRate() > 70 ? '#ef4444' : calculateEvaporationRate() > 40 ? '#f59e0b' : '#3b82f6'
                    }}
                  >
                    <span className="meter-value">{calculateEvaporationRate().toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="controls-panel">
              <div className="control-group">
                <label>
                  <span className="control-icon">🌡️</span>
                  Nhiệt độ: <strong>{temperature}°C</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  disabled={!!feedback}
                />
                <div className="range-labels">
                  <span>5°C</span>
                  <span>50°C</span>
                </div>
              </div>

              <div className="control-group">
                <label>
                  <span className="control-icon">💨</span>
                  Tốc độ gió: <strong>{windSpeed} m/s</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                  disabled={!!feedback}
                />
                <div className="range-labels">
                  <span>0 m/s</span>
                  <span>30 m/s</span>
                </div>
              </div>

              <div className="control-group">
                <label>
                  <span className="control-icon">💧</span>
                  Độ ẩm: <strong>{humidity}%</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={humidity}
                  onChange={(e) => setHumidity(parseInt(e.target.value))}
                  disabled={!!feedback}
                />
                <div className="range-labels">
                  <span>10%</span>
                  <span>95%</span>
                </div>
              </div>

              <div className="control-group">
                <label>
                  <span className="control-icon">📐</span>
                  Diện tích: <strong>{surfaceArea}%</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={surfaceArea}
                  onChange={(e) => setSurfaceArea(parseInt(e.target.value))}
                  disabled={!!feedback}
                />
                <div className="range-labels">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia bốc hơi!</div>}
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

export default EvaporationGame;
