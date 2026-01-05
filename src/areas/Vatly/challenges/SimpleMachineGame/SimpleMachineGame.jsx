import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw } from 'lucide-react';
import './SimpleMachineGame.css';

const SimpleMachineGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Machine settings
  const [leverArm1, setLeverArm1] = useState(50);
  const [leverArm2, setLeverArm2] = useState(50);
  const [pulleyCount, setPulleyCount] = useState(1);
  const [inclineAngle, setInclineAngle] = useState(30);

  const challenges = [
    {
      id: 1,
      type: 'lever',
      description: 'Dùng đòn bẩy nâng vật 100N',
      objectWeight: 100,
      targetForce: 50,
      icon: '⚖️',
      hint: 'F1 × d1 = F2 × d2'
    },
    {
      id: 2,
      type: 'pulley',
      description: 'Dùng ròng rọc kéo vật 120N',
      objectWeight: 120,
      targetForce: 60,
      icon: '🔄',
      hint: 'Lực giảm = Số ròng rọc'
    },
    {
      id: 3,
      type: 'incline',
      description: 'Đẩy vật 80N lên dốc',
      objectWeight: 80,
      targetForce: 40,
      icon: '📐',
      hint: 'F = P × sin(α)'
    },
    {
      id: 4,
      type: 'lever',
      description: 'Nâng vật nặng 200N',
      objectWeight: 200,
      targetForce: 50,
      icon: '⚖️',
      hint: 'Cánh tay đòn dài hơn = lực nhỏ hơn'
    },
    {
      id: 5,
      type: 'pulley',
      description: 'Kéo vật 150N bằng ròng rọc',
      objectWeight: 150,
      targetForce: 50,
      icon: '🔄',
      hint: '3 ròng rọc giảm lực 3 lần'
    },
    {
      id: 6,
      type: 'incline',
      description: 'Đẩy hòn đá 100N lên dốc',
      objectWeight: 100,
      targetForce: 50,
      icon: '📐',
      hint: 'Góc dốc càng nhỏ, lực càng nhỏ'
    },
    {
      id: 7,
      type: 'lever',
      description: 'Bẩy tảng đá 300N',
      objectWeight: 300,
      targetForce: 100,
      icon: '⚖️',
      hint: 'Tỉ lệ cánh tay đòn = 3:1'
    },
    {
      id: 8,
      type: 'pulley',
      description: 'Nâng thùng hàng 240N',
      objectWeight: 240,
      targetForce: 60,
      icon: '🔄',
      hint: 'Cần 4 ròng rọc'
    },
    {
      id: 9,
      type: 'incline',
      description: 'Đẩy xe 120N lên dốc',
      objectWeight: 120,
      targetForce: 60,
      icon: '📐',
      hint: 'sin(30°) = 0.5'
    },
    {
      id: 10,
      type: 'lever',
      description: 'Nâng vật cực nặng 400N',
      objectWeight: 400,
      targetForce: 80,
      icon: '⚖️',
      hint: 'Cần tỉ lệ 5:1'
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setFeedback(null);
    // Reset machine settings
    setLeverArm1(50);
    setLeverArm2(50);
    setPulleyCount(1);
    setInclineAngle(30);
  };

  useEffect(() => {
    if (level <= 10 && !gameOver) {
      generateChallenge();
    }
  }, [level]);

  const calculateForce = () => {
    if (!currentChallenge) return 0;

    switch (currentChallenge.type) {
      case 'lever':
        // F1 × d1 = F2 × d2
        // F1 = (F2 × d2) / d1
        return (currentChallenge.objectWeight * leverArm2) / leverArm1;
      
      case 'pulley':
        // Lực = Trọng lượng / Số ròng rọc
        return currentChallenge.objectWeight / pulleyCount;
      
      case 'incline':
        // F = P × sin(α)
        const angleRad = (inclineAngle * Math.PI) / 180;
        return currentChallenge.objectWeight * Math.sin(angleRad);
      
      default:
        return 0;
    }
  };

  const handleSubmit = () => {
    if (feedback) return;

    const calculatedForce = calculateForce();
    const targetForce = currentChallenge.targetForce;
    const tolerance = targetForce * 0.15; // 15% sai số

    const isCorrect = Math.abs(calculatedForce - targetForce) <= tolerance;

    if (isCorrect) {
      const earnedPoints = 15;
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Lực cần: ${calculatedForce.toFixed(1)}N ≈ ${targetForce}N`
      });
    } else {
      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: `Lực hiện tại: ${calculatedForce.toFixed(1)}N, Cần: ${targetForce}N`
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
    <div className="simple-machine-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>🔧 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Đòn bẩy:</strong> F1 × d1 = F2 × d2</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Ròng rọc:</strong> Lực = Trọng lượng ÷ Số ròng rọc</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Mặt phẳng nghiêng:</strong> F = P × sin(góc)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Điều chỉnh tham số để đạt lực mục tiêu</p>
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
        <h1>🔧 Máy Cơ Đơn Giản</h1>
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
            <div className="machine-icon">{currentChallenge.icon}</div>
            <h2>{currentChallenge.description}</h2>
            <div className="hint-box">💡 {currentChallenge.hint}</div>
          </div>

          <div className="machine-simulator">
            {currentChallenge.type === 'lever' && (
              <div className="lever-machine">
                <h3>⚖️ Đòn Bẩy</h3>
                <div className="lever-display">
                  <div className="fulcrum">△</div>
                  <div 
                    className="lever-bar"
                    style={{
                      transformOrigin: `${(leverArm2 / (leverArm1 + leverArm2)) * 100}% center`
                    }}
                  >
                    <div className="force-point left" style={{ left: '0%' }}>
                      <div className="weight">?N</div>
                    </div>
                    <div className="force-point right" style={{ right: '0%' }}>
                      <div className="weight">{currentChallenge.objectWeight}N</div>
                    </div>
                  </div>
                </div>
                <div className="controls">
                  <div className="control-group">
                    <label>Cánh tay 1 (bạn): {leverArm1}cm</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={leverArm1}
                      onChange={(e) => setLeverArm1(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="control-group">
                    <label>Cánh tay 2 (vật): {leverArm2}cm</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={leverArm2}
                      onChange={(e) => setLeverArm2(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentChallenge.type === 'pulley' && (
              <div className="pulley-machine">
                <h3>🔄 Ròng Rọc</h3>
                <div className="pulley-display">
                  {[...Array(pulleyCount)].map((_, i) => (
                    <div key={i} className="pulley">
                      <div className="pulley-wheel">⭕</div>
                    </div>
                  ))}
                  <div className="hanging-weight">
                    📦 {currentChallenge.objectWeight}N
                  </div>
                </div>
                <div className="controls">
                  <div className="control-group">
                    <label>Số ròng rọc: {pulleyCount}</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={pulleyCount}
                      onChange={(e) => setPulleyCount(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentChallenge.type === 'incline' && (
              <div className="incline-machine">
                <h3>📐 Mặt Phẳng Nghiêng</h3>
                <div className="incline-display">
                  <div 
                    className="incline-plane"
                    style={{ transform: `rotate(-${inclineAngle}deg)` }}
                  >
                    <div className="sliding-object">
                      📦 {currentChallenge.objectWeight}N
                    </div>
                  </div>
                  <div className="angle-indicator">{inclineAngle}°</div>
                </div>
                <div className="controls">
                  <div className="control-group">
                    <label>Góc nghiêng: {inclineAngle}°</label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={inclineAngle}
                      onChange={(e) => setInclineAngle(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="force-result">
            <h3>Lực cần thiết:</h3>
            <div className="force-value">{calculateForce().toFixed(1)} N</div>
            <div className="target-force">Mục tiêu: {currentChallenge.targetForce} N</div>
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Kỹ sư cơ khí!</div>}
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

export default SimpleMachineGame;
