import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw } from 'lucide-react';
import './HeatTransferGame.css';

const HeatTransferGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const transferMethods = [
    {
      id: 'conduction',
      name: 'Dẫn nhiệt',
      icon: '🔗',
      description: 'Nhiệt truyền qua vật rắn, từ phân tử này sang phân tử khác',
      color: '#ef4444',
      example: 'Thìa kim loại nóng dần khi đặt vào nước nóng'
    },
    {
      id: 'convection',
      name: 'Đối lưu',
      icon: '🌊',
      description: 'Nhiệt truyền bằng dòng chất lỏng hoặc khí chuyển động',
      color: '#3b82f6',
      example: 'Nước nóng ở đáy nồi nổi lên trên'
    },
    {
      id: 'radiation',
      name: 'Bức xạ',
      icon: '☀️',
      description: 'Nhiệt truyền bằng sóng điện từ, không cần môi trường',
      color: '#f59e0b',
      example: 'Ánh nắng mặt trời sưởi ấm trái đất'
    }
  ];

  const challenges = [
    {
      id: 1,
      scenario: 'Đun nước, nước đáy nồi nóng lên trước',
      icon: '🍲',
      correctMethod: 'conduction',
      hint: 'Đáy nồi tiếp xúc trực tiếp với bếp',
      description: 'Nhiệt từ bếp truyền vào nồi'
    },
    {
      id: 2,
      scenario: 'Nước nóng ở đáy nổi lên, nước lạnh chìm xuống',
      icon: '♨️',
      correctMethod: 'convection',
      hint: 'Nước chuyển động tạo dòng tuần hoàn',
      description: 'Dòng nước di chuyển'
    },
    {
      id: 3,
      scenario: 'Mặt trời sưởi ấm da mặt bạn',
      icon: '☀️',
      correctMethod: 'radiation',
      hint: 'Không cần không khí làm môi trường',
      description: 'Nhiệt từ mặt trời'
    },
    {
      id: 4,
      scenario: 'Thìa kim loại nóng khi khuấy trà nóng',
      icon: '🥄',
      correctMethod: 'conduction',
      hint: 'Kim loại dẫn nhiệt tốt',
      description: 'Nhiệt lan dọc thìa'
    },
    {
      id: 5,
      scenario: 'Gió ấm từ quạt sưởi làm nóng phòng',
      icon: '🌬️',
      correctMethod: 'convection',
      hint: 'Không khí nóng di chuyển',
      description: 'Không khí tuần hoàn'
    },
    {
      id: 6,
      scenario: 'Ngồi gần lửa trại cảm thấy ấm',
      icon: '🔥',
      correctMethod: 'radiation',
      hint: 'Cảm thấy nóng dù không chạm vào',
      description: 'Nhiệt bức xạ từ lửa'
    },
    {
      id: 7,
      scenario: 'Tay lạnh ôm cốc trà nóng để sưởi ấm',
      icon: '☕',
      correctMethod: 'conduction',
      hint: 'Tay chạm trực tiếp vào cốc',
      description: 'Tiếp xúc trực tiếp'
    },
    {
      id: 8,
      scenario: 'Nước sôi tạo dòng tuần hoàn trong nồi',
      icon: '💧',
      correctMethod: 'convection',
      hint: 'Nước nóng nhẹ hơn, nổi lên',
      description: 'Chất lỏng chuyển động'
    },
    {
      id: 9,
      scenario: 'Sưởi ấm bằng đèn hồng ngoại',
      icon: '💡',
      correctMethod: 'radiation',
      hint: 'Sóng nhiệt truyền qua không khí',
      description: 'Bức xạ nhiệt'
    },
    {
      id: 10,
      scenario: 'Đất nóng lên khi phơi nắng',
      icon: '🏖️',
      correctMethod: 'radiation',
      hint: 'Ánh nắng từ mặt trời',
      description: 'Năng lượng mặt trời'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setSelectedMethod(null);
    setFeedback(null);
    setShowAnimation(false);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const handleSelectMethod = (methodId) => {
    if (feedback) return;
    setSelectedMethod(methodId);
    setShowAnimation(true);
  };

  const handleSubmit = () => {
    if (feedback || !selectedMethod) return;

    const isCorrect = selectedMethod === currentChallenge.correctMethod;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: transferMethods.find(m => m.id === selectedMethod).description
      });
    } else {
      const correctMethodName = transferMethods.find(m => m.id === currentChallenge.correctMethod).name;
      setFeedback({
        correct: false,
        message: 'Chưa đúng! 😅',
        detail: `Đáp án đúng: ${correctMethodName}`
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
    <div className="heat-transfer-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🔥 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Dẫn nhiệt:</strong> Nhiệt truyền qua vật rắn tiếp xúc trực tiếp</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Đối lưu:</strong> Nhiệt truyền bằng chất lỏng/khí chuyển động</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Bức xạ:</strong> Nhiệt truyền bằng sóng, không cần môi trường</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Chọn phương thức truyền nhiệt phù hợp cho mỗi tình huống</p>
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
        <h1>🔥 Truyền Nhiệt</h1>
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
          </div>

          <div className="visualization-area">
            {showAnimation && selectedMethod && (
              <div className="animation-container">
                {selectedMethod === 'conduction' && (
                  <div className="conduction-animation">
                    <div className="solid-bar">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="particle"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        >
                          ●
                        </div>
                      ))}
                    </div>
                    <div className="heat-source">🔥</div>
                    <div className="arrow-flow">→ → → → →</div>
                  </div>
                )}

                {selectedMethod === 'convection' && (
                  <div className="convection-animation">
                    <div className="fluid-container">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="fluid-particle"
                          style={{
                            left: `${(i % 2) * 60 + 20}%`,
                            animationDelay: `${i * 0.5}s`
                          }}
                        >
                          ☁️
                        </div>
                      ))}
                    </div>
                    <div className="heat-source-bottom">🔥</div>
                    <div className="circulation-arrows">
                      <span className="arrow-up">↑</span>
                      <span className="arrow-down">↓</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'radiation' && (
                  <div className="radiation-animation">
                    <div className="sun-source">☀️</div>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="wave"
                        style={{
                          transform: `rotate(${i * 30}deg)`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      >
                        <div className="wave-line">〰️</div>
                      </div>
                    ))}
                    <div className="target-object">🌍</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="methods-selection">
            <h3>Chọn phương thức truyền nhiệt:</h3>
            <div className="methods-grid">
              {transferMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  disabled={!!feedback}
                  style={{
                    borderColor: selectedMethod === method.id ? method.color : '#e5e7eb'
                  }}
                >
                  <div className="method-icon" style={{ color: method.color }}>
                    {method.icon}
                  </div>
                  <h4>{method.name}</h4>
                  <p className="method-description">{method.description}</p>
                  <div className="method-example">{method.example}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={!!feedback || !selectedMethod}
          >
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia truyền nhiệt!</div>}
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

export default HeatTransferGame;
