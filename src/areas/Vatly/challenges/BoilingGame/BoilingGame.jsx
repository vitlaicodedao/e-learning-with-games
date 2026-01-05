import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Flame } from 'lucide-react';
import './BoilingGame.css';

const BoilingGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Boiling simulation
  const [temperature, setTemperature] = useState(20);
  const [pressure, setPressure] = useState(101.3);
  const [isHeating, setIsHeating] = useState(false);
  const [isBoiling, setIsBoiling] = useState(false);

  const challenges = [
    {
      id: 1,
      scenario: 'Đun nước ở áp suất bình thường',
      icon: '♨️',
      targetTemp: 100,
      targetPressure: 101.3,
      liquid: 'Nước',
      hint: 'Nước sôi ở 100°C tại 1 atm',
      description: 'Điều kiện sôi chuẩn',
      color: '#3b82f6'
    },
    {
      id: 2,
      scenario: 'Nấu ăn trên núi cao',
      icon: '⛰️',
      targetTemp: 92,
      targetPressure: 70,
      liquid: 'Nước',
      hint: 'Áp suất thấp → nhiệt độ sôi giảm',
      description: 'Áp suất thấp hơn',
      color: '#06b6d4'
    },
    {
      id: 3,
      scenario: 'Nồi áp suất nấu nhanh',
      icon: '🍲',
      targetTemp: 120,
      targetPressure: 200,
      liquid: 'Nước',
      hint: 'Áp suất cao → nhiệt độ sôi tăng',
      description: 'Áp suất cao hơn',
      color: '#8b5cf6'
    },
    {
      id: 4,
      scenario: 'Rượu etylic sôi',
      icon: '🍶',
      targetTemp: 78,
      targetPressure: 101.3,
      liquid: 'Rượu',
      hint: 'Rượu sôi thấp hơn nước',
      description: 'Nhiệt độ sôi khác nhau',
      color: '#f59e0b'
    },
    {
      id: 5,
      scenario: 'Đỉnh Everest (cao nhất)',
      icon: '🏔️',
      targetTemp: 72,
      targetPressure: 33,
      liquid: 'Nước',
      hint: 'Áp suất rất thấp ở 8848m',
      description: 'Độ cao cực đại',
      color: '#0891b2'
    },
    {
      id: 6,
      scenario: 'Nồi hấp áp lực công nghiệp',
      icon: '⚙️',
      targetTemp: 135,
      targetPressure: 300,
      liquid: 'Nước',
      hint: 'Áp suất rất cao → sôi >130°C',
      description: 'Công nghiệp thực phẩm',
      color: '#6366f1'
    },
    {
      id: 7,
      scenario: 'Sữa sôi (không để cháy)',
      icon: '🥛',
      targetTemp: 100,
      targetPressure: 101.3,
      liquid: 'Sữa',
      hint: 'Sữa sôi gần 100°C',
      description: 'Kiểm soát nhiệt độ',
      color: '#e5e7eb'
    },
    {
      id: 8,
      scenario: 'Biển Chết (dưới mực nước biển)',
      icon: '🌊',
      targetTemp: 101,
      targetPressure: 106,
      liquid: 'Nước',
      hint: 'Áp suất cao hơn 1 chút',
      description: 'Độ cao âm (-430m)',
      color: '#14b8a6'
    },
    {
      id: 9,
      scenario: 'Cồn y tế',
      icon: '💊',
      targetTemp: 78,
      targetPressure: 101.3,
      liquid: 'Cồn',
      hint: 'Giống rượu etylic',
      description: 'Làm sạch vết thương',
      color: '#f97316'
    },
    {
      id: 10,
      scenario: 'Nước biển (có muối)',
      icon: '🧂',
      targetTemp: 102,
      targetPressure: 101.3,
      liquid: 'Nước muối',
      hint: 'Muối làm tăng nhiệt độ sôi',
      description: 'Chất tan tăng điểm sôi',
      color: '#0ea5e9'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setFeedback(null);
    setTemperature(20);
    setPressure(101.3);
    setIsHeating(false);
    setIsBoiling(false);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  useEffect(() => {
    if (isHeating && temperature < 150 && !feedback) {
      const timer = setTimeout(() => {
        setTemperature(prev => Math.min(prev + 1, 150));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHeating, temperature, feedback]);

  useEffect(() => {
    if (!currentChallenge) return;
    
    // Calculate boiling point based on pressure
    const boilingPoint = calculateBoilingPoint(currentChallenge.liquid, pressure);
    setIsBoiling(temperature >= boilingPoint);
  }, [temperature, pressure, currentChallenge]);

  const calculateBoilingPoint = (liquid, pressureKPa) => {
    // Simplified formula: T_boil changes with pressure
    const standardBoilingPoints = {
      'Nước': 100,
      'Rượu': 78,
      'Cồn': 78,
      'Sữa': 100,
      'Nước muối': 102
    };
    
    const baseTemp = standardBoilingPoints[liquid] || 100;
    const pressureRatio = pressureKPa / 101.3;
    
    // Approximate: T increases ~10°C per 100 kPa increase
    const tempChange = (pressureRatio - 1) * 30;
    return baseTemp + tempChange;
  };

  const getBubbleCount = () => {
    if (!isBoiling) return 0;
    const intensity = Math.min((temperature - calculateBoilingPoint(currentChallenge.liquid, pressure)) / 5, 10);
    return Math.floor(intensity * 3);
  };

  const handleHeating = () => {
    setIsHeating(!isHeating);
  };

  const handleCooling = () => {
    setTemperature(Math.max(20, temperature - 10));
  };

  const handleSubmit = () => {
    if (feedback) return;

    const targetTemp = currentChallenge.targetTemp;
    const targetPressure = currentChallenge.targetPressure;
    const tempTolerance = 3;
    const pressureTolerance = 10;

    const tempCorrect = Math.abs(temperature - targetTemp) <= tempTolerance;
    const pressureCorrect = Math.abs(pressure - targetPressure) <= pressureTolerance;
    const isCorrect = tempCorrect && pressureCorrect && isBoiling;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `${currentChallenge.liquid} đang sôi ở ${temperature}°C, ${pressure.toFixed(1)} kPa`
      });
    } else {
      setFeedback({
        correct: false,
        message: !isBoiling ? 'Chưa sôi! 😅' : 'Chưa đúng điều kiện! 😅',
        detail: `Mục tiêu: ${targetTemp}°C, ${targetPressure} kPa`
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
    <div className="boiling-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>♨️ Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Sự sôi:</strong> Chất lỏng chuyển thành hơi ở nhiệt độ sôi</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Áp suất cao:</strong> Nhiệt độ sôi tăng</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Áp suất thấp:</strong> Nhiệt độ sôi giảm</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Điều chỉnh nhiệt độ và áp suất để làm sôi chất lỏng</p>
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
        <h1>♨️ Sự Sôi</h1>
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
              Mục tiêu: <strong>{currentChallenge.targetTemp}°C</strong> tại <strong>{currentChallenge.targetPressure} kPa</strong>
            </div>
          </div>

          <div className="boiling-simulator">
            <div className="visual-section">
              <div className="pot-container">
                <div className="pot" style={{ borderColor: currentChallenge.color }}>
                  <div 
                    className="liquid"
                    style={{ 
                      background: currentChallenge.color,
                      opacity: 0.7
                    }}
                  >
                    {isBoiling && (
                      <div className="bubbles">
                        {[...Array(getBubbleCount())].map((_, i) => (
                          <div
                            key={i}
                            className="bubble"
                            style={{
                              left: `${Math.random() * 80 + 10}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${1 + Math.random()}s`
                            }}
                          >
                            ○
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="steam-container">
                    {isBoiling && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="steam"
                            style={{
                              left: `${i * 12}%`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          >
                            ☁️
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="heat-source">
                  {isHeating && <div className="flame">🔥🔥🔥</div>}
                </div>
              </div>

              <div className="status-display">
                <div className={`status-indicator ${isBoiling ? 'boiling' : 'heating'}`}>
                  {isBoiling ? '♨️ ĐANG SÔI' : '🌡️ ĐUN NÓNG'}
                </div>
                <div className="boiling-point-info">
                  Điểm sôi: {calculateBoilingPoint(currentChallenge.liquid, pressure).toFixed(1)}°C
                </div>
              </div>
            </div>

            <div className="controls-section">
              <div className="display-panel">
                <div className="display-item">
                  <span className="display-label">🌡️ Nhiệt độ</span>
                  <span className="display-value">{temperature}°C</span>
                </div>
                <div className="display-item">
                  <span className="display-label">💨 Áp suất</span>
                  <span className="display-value">{pressure.toFixed(1)} kPa</span>
                </div>
              </div>

              <div className="control-buttons">
                <button
                  onClick={handleHeating}
                  className={`control-btn heat-btn ${isHeating ? 'active' : ''}`}
                  disabled={!!feedback || temperature >= 150}
                >
                  <Flame size={20} />
                  {isHeating ? 'Đang đun' : 'Đun nóng'}
                </button>
                <button
                  onClick={handleCooling}
                  className="control-btn cool-btn"
                  disabled={!!feedback || temperature <= 20}
                >
                  ❄️ Làm lạnh
                </button>
              </div>

              <div className="pressure-control">
                <label>
                  <span className="control-icon">💨</span>
                  Điều chỉnh áp suất: <strong>{pressure.toFixed(1)} kPa</strong>
                </label>
                <input
                  type="range"
                  min="30"
                  max="350"
                  step="1"
                  value={pressure}
                  onChange={(e) => setPressure(parseFloat(e.target.value))}
                  disabled={!!feedback}
                />
                <div className="range-labels">
                  <span>30 kPa</span>
                  <span>101.3 kPa (1 atm)</span>
                  <span>350 kPa</span>
                </div>
              </div>

              <div className="info-box">
                <h4>Thông tin:</h4>
                <p>• Nước: 100°C (1 atm)</p>
                <p>• Rượu/Cồn: 78°C (1 atm)</p>
                <p>• Sữa: ~100°C (1 atm)</p>
                <p>• Nước muối: ~102°C (1 atm)</p>
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

export default BoilingGame;
