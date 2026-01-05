import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw } from 'lucide-react';
import './PressureChallengeGame.css';

const PressureChallengeGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Pressure parameters
  const [force, setForce] = useState(100);
  const [area, setArea] = useState(1);

  const challenges = [
    {
      id: 1,
      description: 'Đinh nhọn đóng vào gỗ',
      targetPressure: 2000,
      tolerance: 300,
      scenario: 'Đinh',
      icon: '📌',
      hint: 'Diện tích nhỏ → áp suất lớn',
      forceRange: [50, 200],
      areaRange: [0.01, 0.5]
    },
    {
      id: 2,
      description: 'Người đứng trên sàn',
      targetPressure: 20000,
      tolerance: 3000,
      scenario: 'Bàn chân',
      icon: '👣',
      hint: 'Trọng lượng người / Diện tích 2 bàn chân',
      forceRange: [200, 800],
      areaRange: [0.01, 0.1]
    },
    {
      id: 3,
      description: 'Dao cắt thịt',
      targetPressure: 5000,
      tolerance: 800,
      scenario: 'Lưỡi dao',
      icon: '🔪',
      hint: 'Lưỡi dao mỏng tăng áp suất',
      forceRange: [50, 300],
      areaRange: [0.005, 0.2]
    },
    {
      id: 4,
      description: 'Xe tăng trên nền đất',
      targetPressure: 60000,
      tolerance: 10000,
      scenario: 'Xích xe tăng',
      icon: '🚜',
      hint: 'Xích rộng giảm áp suất',
      forceRange: [1000, 3000],
      areaRange: [0.1, 1]
    },
    {
      id: 5,
      description: 'Kim tiêm dưới da',
      targetPressure: 10000,
      tolerance: 1500,
      scenario: 'Mũi kim',
      icon: '💉',
      hint: 'Kim rất nhỏ nên áp suất cao',
      forceRange: [10, 100],
      areaRange: [0.001, 0.05]
    },
    {
      id: 6,
      description: 'Búa đóng đinh',
      targetPressure: 15000,
      tolerance: 2500,
      scenario: 'Đầu búa',
      icon: '🔨',
      hint: 'Lực va đập lớn',
      forceRange: [100, 500],
      areaRange: [0.01, 0.2]
    },
    {
      id: 7,
      description: 'Giày cao gót đi trên cỏ',
      targetPressure: 80000,
      tolerance: 12000,
      scenario: 'Gót giày',
      icon: '👠',
      hint: 'Gót nhỏ → áp suất rất lớn',
      forceRange: [300, 700],
      areaRange: [0.001, 0.02]
    },
    {
      id: 8,
      description: 'Máy ép thủy lực',
      targetPressure: 100000,
      tolerance: 15000,
      scenario: 'Piston',
      icon: '⚙️',
      hint: 'P = F/S rất lớn',
      forceRange: [1000, 5000],
      areaRange: [0.01, 0.15]
    },
    {
      id: 9,
      description: 'Kéo cắt giấy',
      targetPressure: 8000,
      tolerance: 1200,
      scenario: 'Lưỡi kéo',
      icon: '✂️',
      hint: 'Hai lưỡi sắc nhọn',
      forceRange: [50, 200],
      areaRange: [0.005, 0.1]
    },
    {
      id: 10,
      description: 'Người nằm trên giường đinh',
      targetPressure: 1000,
      tolerance: 200,
      scenario: 'Nhiều đinh',
      icon: '🛏️',
      hint: 'Nhiều đinh → diện tích lớn → áp suất nhỏ',
      forceRange: [400, 800],
      areaRange: [0.3, 1]
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setFeedback(null);
    // Reset to middle values
    setForce((challenge.forceRange[0] + challenge.forceRange[1]) / 2);
    setArea((challenge.areaRange[0] + challenge.areaRange[1]) / 2);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const calculatePressure = () => {
    // P = F / S (Pa = N / m²)
    return force / area;
  };

  const getPressureVisualization = () => {
    const currentPressure = calculatePressure();
    const maxPressure = 200000; // Max for visualization
    const percentage = Math.min((currentPressure / maxPressure) * 100, 100);
    return percentage;
  };

  const handleSubmit = () => {
    if (feedback) return;

    const currentPressure = calculatePressure();
    const targetPressure = currentChallenge.targetPressure;
    const tolerance = currentChallenge.tolerance;

    const isCorrect = Math.abs(currentPressure - targetPressure) <= tolerance;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Áp suất: ${currentPressure.toFixed(0)} Pa ≈ ${targetPressure} Pa`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: `Áp suất: ${currentPressure.toFixed(0)} Pa, Mục tiêu: ${targetPressure} Pa`
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
    <div className="pressure-challenge-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>💪 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Công thức:</strong> Áp suất (P) = Lực (F) / Diện tích (S)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Đơn vị:</strong> Pascal (Pa) = Newton (N) / m²</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Nguyên lý:</strong> Diện tích nhỏ → áp suất lớn</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Điều chỉnh lực và diện tích để đạt áp suất mục tiêu</p>
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
        <h1>💪 Áp Suất Thách Đố</h1>
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
            <h2>{currentChallenge.description}</h2>
            <div className="hint-box">💡 {currentChallenge.hint}</div>
            <div className="target-display">
              Áp suất mục tiêu: <strong>{currentChallenge.targetPressure.toLocaleString()} Pa</strong>
            </div>
          </div>

          <div className="pressure-simulator">
            <div className="formula-display">
              <div className="formula">
                <span className="formula-label">P</span>
                <span className="equals">=</span>
                <div className="fraction">
                  <span className="numerator">F</span>
                  <span className="divider"></span>
                  <span className="denominator">S</span>
                </div>
              </div>
            </div>

            <div className="controls">
              <div className="control-group">
                <label>
                  <span className="control-icon">💪</span>
                  Lực (F): <strong>{force.toFixed(1)} N</strong>
                </label>
                <input
                  type="range"
                  min={currentChallenge.forceRange[0]}
                  max={currentChallenge.forceRange[1]}
                  step="1"
                  value={force}
                  onChange={(e) => setForce(parseFloat(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>
                  <span className="control-icon">📐</span>
                  Diện tích (S): <strong>{area.toFixed(3)} m²</strong>
                </label>
                <input
                  type="range"
                  min={currentChallenge.areaRange[0]}
                  max={currentChallenge.areaRange[1]}
                  step="0.001"
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="pressure-visualization">
              <h3>Mô phỏng áp suất</h3>
              <div className="pressure-meter">
                <div className="pressure-bar-container">
                  <div 
                    className="pressure-bar-fill"
                    style={{ height: `${getPressureVisualization()}%` }}
                  ></div>
                </div>
                <div className="pressure-labels">
                  <span>0 Pa</span>
                  <span>200k Pa</span>
                </div>
              </div>
              <div className="surface-effect">
                <div className="surface">
                  <div 
                    className="penetration"
                    style={{ height: `${Math.min(getPressureVisualization() * 0.8, 80)}%` }}
                  >
                    <div className="force-arrow">↓</div>
                  </div>
                </div>
                <div className="effect-label">
                  {getPressureVisualization() < 20 && '☁️ Áp suất thấp'}
                  {getPressureVisualization() >= 20 && getPressureVisualization() < 50 && '📌 Áp suất vừa'}
                  {getPressureVisualization() >= 50 && getPressureVisualization() < 80 && '⚡ Áp suất cao'}
                  {getPressureVisualization() >= 80 && '💥 Áp suất rất cao'}
                </div>
              </div>
            </div>
          </div>

          <div className="pressure-result">
            <h3>Áp suất hiện tại:</h3>
            <div className="pressure-value">{calculatePressure().toFixed(0)} Pa</div>
            <div className="pressure-comparison">
              {Math.abs(calculatePressure() - currentChallenge.targetPressure) <= currentChallenge.tolerance ? (
                <span className="status-good">✓ Đạt yêu cầu</span>
              ) : calculatePressure() < currentChallenge.targetPressure ? (
                <span className="status-low">↓ Cần tăng áp suất</span>
              ) : (
                <span className="status-high">↑ Cần giảm áp suất</span>
              )}
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia áp suất!</div>}
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

export default PressureChallengeGame;
