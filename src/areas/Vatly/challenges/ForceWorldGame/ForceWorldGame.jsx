import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, HelpCircle, Target } from 'lucide-react';
import './ForceWorldGame.css';

const ForceWorldGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Force arrow state
  const [arrowStart, setArrowStart] = useState({ x: 0, y: 0 });
  const [arrowEnd, setArrowEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);

  const challenges = [
    {
      id: 1,
      object: 'Hộp gỗ',
      mass: 5,
      icon: '📦',
      targetForce: 20,
      targetDirection: 0, // 0 = right, 90 = up, 180 = left, 270 = down
      description: 'Kéo hộp sang phải với lực 20N',
      tolerance: 3
    },
    {
      id: 2,
      object: 'Quả bóng',
      mass: 0.5,
      icon: '⚽',
      targetForce: 10,
      targetDirection: 90,
      description: 'Đá bóng lên cao với lực 10N',
      tolerance: 2
    },
    {
      id: 3,
      object: 'Xe đẩy',
      mass: 10,
      icon: '🛒',
      targetForce: 30,
      targetDirection: 0,
      description: 'Đẩy xe về phía trước với lực 30N',
      tolerance: 5
    },
    {
      id: 4,
      object: 'Cửa',
      mass: 15,
      icon: '🚪',
      targetForce: 25,
      targetDirection: 180,
      description: 'Kéo cửa về phía bạn với lực 25N',
      tolerance: 4
    },
    {
      id: 5,
      object: 'Búa',
      mass: 2,
      icon: '🔨',
      targetForce: 40,
      targetDirection: 270,
      description: 'Đập búa xuống với lực 40N',
      tolerance: 6
    },
    {
      id: 6,
      object: 'Tủ sách',
      mass: 20,
      icon: '📚',
      targetForce: 50,
      targetDirection: 0,
      description: 'Đẩy tủ sách sang phải với lực 50N',
      tolerance: 7
    },
    {
      id: 7,
      object: 'Dù',
      mass: 1,
      icon: '☂️',
      targetForce: 15,
      targetDirection: 90,
      description: 'Nâng dù lên với lực 15N',
      tolerance: 3
    },
    {
      id: 8,
      object: 'Hòn đá',
      mass: 8,
      icon: '🪨',
      targetForce: 35,
      targetDirection: 270,
      description: 'Ném đá xuống với lực 35N',
      tolerance: 5
    },
    {
      id: 9,
      object: 'Kéo',
      mass: 0.3,
      icon: '✂️',
      targetForce: 12,
      targetDirection: 180,
      description: 'Kéo kéo về phía trái với lực 12N',
      tolerance: 2
    },
    {
      id: 10,
      object: 'Thùng nước',
      mass: 12,
      icon: '🪣',
      targetForce: 45,
      targetDirection: 90,
      description: 'Nâng thùng nước lên với lực 45N',
      tolerance: 6
    }
  ];

  const generateChallenge = () => {
    const challenge = challenges[level - 1];
    setCurrentChallenge(challenge);
    setFeedback(null);
    setTimeLeft(45);
    setArrowStart({ x: 200, y: 200 });
    setArrowEnd({ x: 200, y: 200 });
  };

  useEffect(() => {
    if (currentChallenge === null) {
      generateChallenge();
    }
  }, [level]);

  useEffect(() => {
    if (timeLeft > 0 && !feedback && !gameOver && !showTutorial) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      handleTimeout();
    }
  }, [timeLeft, feedback, gameOver, showTutorial]);

  useEffect(() => {
    if (canvasRef.current && currentChallenge) {
      drawCanvas();
    }
  }, [arrowStart, arrowEnd, currentChallenge]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 400; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(400, i);
      ctx.stroke();
    }

    // Draw object at center
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentChallenge.icon, 200, 200);

    // Draw force arrow
    if (arrowStart.x !== arrowEnd.x || arrowStart.y !== arrowEnd.y) {
      drawArrow(ctx, arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y);
    }

    // Draw magnitude
    const force = calculateForce();
    if (force > 0) {
      ctx.fillStyle = '#667eea';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${force.toFixed(1)}N`, arrowEnd.x, arrowEnd.y - 20);
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headlen = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = '#667eea';
    ctx.lineWidth = 4;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const handleCanvasMouseDown = (e) => {
    if (feedback) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking near object center
    const dist = Math.sqrt((x - 200) ** 2 + (y - 200) ** 2);
    if (dist < 40) {
      setIsDragging(true);
      setArrowStart({ x: 200, y: 200 });
      setArrowEnd({ x: 200, y: 200 });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || feedback) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setArrowEnd({ x, y });
  };

  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const calculateForce = () => {
    const dx = arrowEnd.x - arrowStart.x;
    const dy = arrowEnd.y - arrowStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance / 2; // Scale: 2 pixels = 1N
  };

  const calculateAngle = () => {
    const dx = arrowEnd.x - arrowStart.x;
    const dy = arrowEnd.y - arrowStart.y;
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI); // -dy because canvas Y is inverted
    if (angle < 0) angle += 360;
    return angle;
  };

  const handleSubmit = () => {
    if (feedback) return;

    const force = calculateForce();
    const angle = calculateAngle();
    const target = currentChallenge;

    // Check force magnitude
    const forceDiff = Math.abs(force - target.targetForce);
    const forceCorrect = forceDiff <= target.tolerance;

    // Check direction (within 30 degrees)
    let angleDiff = Math.abs(angle - target.targetDirection);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;
    const directionCorrect = angleDiff <= 30;

    const isCorrect = forceCorrect && directionCorrect;

    if (isCorrect) {
      const timeBonus = Math.ceil(timeLeft / 5);
      const accuracyBonus = (forceDiff < 1 && angleDiff < 10) ? 5 : 0;
      const earnedPoints = 15 + timeBonus + accuracyBonus;

      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: `Lực: ${force.toFixed(1)}N, Góc: ${angle.toFixed(0)}°`
      });
    } else {
      let errorMsg = '';
      if (!forceCorrect) errorMsg += `Lực chưa đúng (cần ${target.targetForce}N). `;
      if (!directionCorrect) errorMsg += `Hướng chưa đúng. `;

      setFeedback({
        correct: false,
        message: 'Chưa chính xác! 😅',
        detail: errorMsg
      });
    }

    setTimeout(() => {
      moveToNextChallenge();
    }, 3000);
  };

  const handleTimeout = () => {
    setFeedback({ correct: false, message: 'Hết giờ! ⏰', detail: '' });
    setTimeout(() => {
      moveToNextChallenge();
    }, 2000);
  };

  const moveToNextChallenge = () => {
    if (level < 10) {
      setLevel(level + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowTutorial(false);
    setCurrentChallenge(null);
  };

  const getDirectionText = (angle) => {
    if (angle === 0) return '→ Phải';
    if (angle === 90) return '↑ Lên';
    if (angle === 180) return '← Trái';
    if (angle === 270) return '↓ Xuống';
    return `${angle}°`;
  };

  if (!currentChallenge) return null;

  return (
    <div className="force-world-game">
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>💪 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Click vào vật thể</strong> ở giữa màn hình</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Kéo chuột</strong> theo hướng và độ dài mong muốn</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Độ dài mũi tên</strong> = độ lớn lực (2 pixels = 1N)</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p><strong>Nhả chuột</strong> và bấm "Kiểm tra" để xem kết quả</p>
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
        <h1>💪 Thế Giới Lực</h1>
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
              <span className={`stat-value ${timeLeft < 15 ? 'warning' : ''}`}>{timeLeft}s</span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(level / 10) * 100}%` }}></div>
          </div>

          <div className="challenge-info">
            <div className="challenge-header">
              <h2>🎯 {currentChallenge.description}</h2>
              <div className="target-display">
                <span>Mục tiêu:</span>
                <span className="target-value">{currentChallenge.targetForce}N {getDirectionText(currentChallenge.targetDirection)}</span>
              </div>
            </div>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="force-canvas"
            />
            <div className="canvas-hint">
              🖱️ Click vào vật thể và kéo để vẽ mũi tên lực
            </div>
          </div>

          <div className="action-section">
            <button onClick={handleSubmit} className="submit-btn" disabled={!!feedback || calculateForce() === 0}>
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
            <div className="final-stat">
              <span className="final-label">Độ chính xác</span>
              <span className="final-value">{Math.round((correctAnswers / 10) * 100)}%</span>
            </div>
          </div>

          <div className="achievement">
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia về lực!</div>}
            {correctAnswers >= 7 && correctAnswers < 9 && <div className="badge silver">🥈 Rất tốt!</div>}
            {correctAnswers >= 5 && correctAnswers < 7 && <div className="badge bronze">🥉 Khá tốt!</div>}
            {correctAnswers < 5 && <div className="badge">💪 Cố gắng lên!</div>}
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

export default ForceWorldGame;
