import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Calculator } from 'lucide-react';
import './ThermalEnergyGame.css';

const ThermalEnergyGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showCalculation, setShowCalculation] = useState(false);

  const challenges = [
    {
      id: 1,
      scenario: 'Đun nóng 1 kg nước từ 20°C lên 100°C',
      mass: 1,
      specificHeat: 4200,
      tempInitial: 20,
      tempFinal: 100,
      substance: 'Nước',
      icon: '💧',
      hint: 'Q = m × c × ΔT = 1 × 4200 × 80'
    },
    {
      id: 2,
      scenario: 'Làm lạnh 2 kg sắt từ 100°C xuống 20°C',
      mass: 2,
      specificHeat: 460,
      tempInitial: 100,
      tempFinal: 20,
      substance: 'Sắt',
      icon: '🔩',
      hint: 'ΔT âm khi làm lạnh'
    },
    {
      id: 3,
      scenario: 'Nung 0.5 kg đồng từ 25°C lên 85°C',
      mass: 0.5,
      specificHeat: 380,
      tempInitial: 25,
      tempFinal: 85,
      substance: 'Đồng',
      icon: '🔶',
      hint: 'c của đồng = 380 J/(kg·°C)'
    },
    {
      id: 4,
      scenario: 'Làm nóng 3 kg nước từ 15°C lên 65°C',
      mass: 3,
      specificHeat: 4200,
      tempInitial: 15,
      tempFinal: 65,
      substance: 'Nước',
      icon: '💦',
      hint: 'Khối lượng lớn hơn → nhiệt lượng lớn hơn'
    },
    {
      id: 5,
      scenario: 'Làm lạnh 1.5 kg nhôm từ 200°C xuống 50°C',
      mass: 1.5,
      specificHeat: 880,
      tempInitial: 200,
      tempFinal: 50,
      substance: 'Nhôm',
      icon: '🪙',
      hint: 'c của nhôm = 880 J/(kg·°C)'
    },
    {
      id: 6,
      scenario: 'Đun sôi 0.5 kg nước từ 30°C lên 100°C',
      mass: 0.5,
      specificHeat: 4200,
      tempInitial: 30,
      tempFinal: 100,
      substance: 'Nước',
      icon: '♨️',
      hint: 'Nước sôi ở 100°C'
    },
    {
      id: 7,
      scenario: 'Nung 2 kg sắt từ 0°C lên 150°C',
      mass: 2,
      specificHeat: 460,
      tempInitial: 0,
      tempFinal: 150,
      substance: 'Sắt',
      icon: '⚙️',
      hint: 'Chênh lệch nhiệt độ lớn'
    },
    {
      id: 8,
      scenario: 'Làm lạnh 4 kg nước từ 80°C xuống 10°C',
      mass: 4,
      specificHeat: 4200,
      tempInitial: 80,
      tempFinal: 10,
      substance: 'Nước',
      icon: '🧊',
      hint: 'Khối lượng và ΔT đều lớn'
    },
    {
      id: 9,
      scenario: 'Đun nóng 1 kg đồng từ 20°C lên 120°C',
      mass: 1,
      specificHeat: 380,
      tempInitial: 20,
      tempFinal: 120,
      substance: 'Đồng',
      icon: '🔥',
      hint: 'ΔT = 100°C'
    },
    {
      id: 10,
      scenario: 'Làm lạnh 2.5 kg nhôm từ 180°C xuống 30°C',
      mass: 2.5,
      specificHeat: 880,
      tempInitial: 180,
      tempFinal: 30,
      substance: 'Nhôm',
      icon: '❄️',
      hint: 'Q = 2.5 × 880 × 150'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setFeedback(null);
    setShowCalculation(false);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const calculateHeatEnergy = () => {
    if (!currentChallenge) return 0;
    const { mass, specificHeat, tempInitial, tempFinal } = currentChallenge;
    const deltaT = tempFinal - tempInitial;
    return Math.abs(mass * specificHeat * deltaT);
  };

  const handleSubmit = () => {
    if (feedback) return;

    const correctAnswer = calculateHeatEnergy();
    const answer = parseFloat(userAnswer);
    const tolerance = correctAnswer * 0.05; // 5% tolerance

    const isCorrect = !isNaN(answer) && Math.abs(answer - correctAnswer) <= tolerance;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Q = ${correctAnswer.toLocaleString()} J`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: `Đáp án đúng: ${correctAnswer.toLocaleString()} J`
      });
    }

    setShowCalculation(true);

    setTimeout(() => {
      if (level < 10) {
        setLevel(level + 1);
      } else {
        setGameOver(true);
      }
    }, 3500);
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
    <div className="thermal-energy-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🔬 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Công thức:</strong> Q = m × c × ΔT</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Q:</strong> Nhiệt lượng (Joule - J)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>m:</strong> Khối lượng (kg), <strong>c:</strong> Nhiệt dung riêng J/(kg·°C)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p><strong>ΔT:</strong> Độ biến thiên nhiệt độ = T<sub>cuối</sub> - T<sub>đầu</sub></p>
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
        <h1>🔬 Năng Lượng Nhiệt</h1>
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
            <div className="hint-box">💡 {currentChallenge.hint}</div>
          </div>

          <div className="formula-section">
            <div className="formula-display">
              <h3>📐 Công thức nhiệt lượng</h3>
              <div className="formula-box">
                <div className="formula-main">
                  Q = m × c × ΔT
                </div>
                <div className="formula-explanation">
                  <p>Q: Nhiệt lượng (J)</p>
                  <p>m: Khối lượng (kg)</p>
                  <p>c: Nhiệt dung riêng J/(kg·°C)</p>
                  <p>ΔT: T<sub>cuối</sub> - T<sub>đầu</sub> (°C)</p>
                </div>
              </div>
            </div>

            <div className="given-data">
              <h3>📊 Dữ kiện đề bài</h3>
              <div className="data-grid">
                <div className="data-item">
                  <span className="data-label">Chất:</span>
                  <span className="data-value">{currentChallenge.substance}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Khối lượng (m):</span>
                  <span className="data-value">{currentChallenge.mass} kg</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Nhiệt dung riêng (c):</span>
                  <span className="data-value">{currentChallenge.specificHeat.toLocaleString()} J/(kg·°C)</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Nhiệt độ đầu:</span>
                  <span className="data-value">{currentChallenge.tempInitial}°C</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Nhiệt độ cuối:</span>
                  <span className="data-value">{currentChallenge.tempFinal}°C</span>
                </div>
                <div className="data-item">
                  <span className="data-label">ΔT:</span>
                  <span className="data-value">
                    {currentChallenge.tempFinal - currentChallenge.tempInitial}°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showCalculation && (
            <div className="calculation-steps">
              <h3>📝 Cách tính</h3>
              <div className="step-by-step">
                <div className="calc-step">
                  <span className="step-label">Bước 1:</span>
                  <span className="step-content">
                    ΔT = {currentChallenge.tempFinal}°C - {currentChallenge.tempInitial}°C = {currentChallenge.tempFinal - currentChallenge.tempInitial}°C
                  </span>
                </div>
                <div className="calc-step">
                  <span className="step-label">Bước 2:</span>
                  <span className="step-content">
                    Q = m × c × ΔT
                  </span>
                </div>
                <div className="calc-step">
                  <span className="step-label">Bước 3:</span>
                  <span className="step-content">
                    Q = {currentChallenge.mass} × {currentChallenge.specificHeat.toLocaleString()} × {Math.abs(currentChallenge.tempFinal - currentChallenge.tempInitial)}
                  </span>
                </div>
                <div className="calc-step result-step">
                  <span className="step-label">Kết quả:</span>
                  <span className="step-content">
                    Q = {calculateHeatEnergy().toLocaleString()} J
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="answer-section">
            <label htmlFor="heat-input">Nhiệt lượng Q (Joule):</label>
            <div className="input-group">
              <Calculator size={20} className="input-icon" />
              <input
                id="heat-input"
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập nhiệt lượng (J)"
                disabled={!!feedback}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <span className="unit-label">J</span>
            </div>
          </div>

          <button onClick={handleSubmit} className="submit-btn" disabled={!!feedback || !userAnswer}>
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

export default ThermalEnergyGame;
