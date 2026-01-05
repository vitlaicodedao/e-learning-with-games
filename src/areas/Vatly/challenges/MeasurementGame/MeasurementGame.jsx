import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, HelpCircle } from 'lucide-react';
import './MeasurementGame.css';

const MeasurementGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Ruler dragging state
  const [rulerPosition, setRulerPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const rulerRef = useRef(null);
  const objectRef = useRef(null);

  // Danh sách vật thể với kích thước thật (pixels tương ứng với cm/m)
  const measurements = [
    { object: 'Bút chì', realValue: 18, unit: 'cm', width: 180, image: '✏️', color: '#FFD700', hint: 'Đặt thước sát cạnh bút' },
    { object: 'Sách giáo khoa', realValue: 25, unit: 'cm', width: 250, image: '📚', color: '#4169E1', hint: 'Đo chiều dài cạnh sách' },
    { object: 'Thước kẻ nhựa', realValue: 30, unit: 'cm', width: 300, image: '📐', color: '#32CD32', hint: 'Thước chuẩn 30cm' },
    { object: 'Hộp bút', realValue: 22, unit: 'cm', width: 220, image: '🎨', color: '#FF69B4', hint: 'Đo chiều dài hộp' },
    { object: 'Điện thoại', realValue: 15, unit: 'cm', width: 150, image: '📱', color: '#708090', hint: 'Đo chiều cao điện thoại' },
    { object: 'Cốc nước', realValue: 12, unit: 'cm', width: 120, image: '🥤', color: '#FF6347', hint: 'Đo chiều cao cốc' },
    { object: 'Hộp phấn', realValue: 8, unit: 'cm', width: 80, image: '📦', color: '#DEB887', hint: 'Hộp phấn nhỏ' },
    { object: 'Tẩy', realValue: 5, unit: 'cm', width: 50, image: '🧼', color: '#FFB6C1', hint: 'Vật nhỏ, đo cẩn thận' },
    { object: 'Vở', realValue: 20, unit: 'cm', width: 200, image: '📓', color: '#FFA500', hint: 'Đo cạnh dài của vở' },
    { object: 'Kéo', realValue: 16, unit: 'cm', width: 160, image: '✂️', color: '#C0C0C0', hint: 'Đo chiều dài kéo' },
  ];

  const generateQuestion = () => {
    const item = measurements[Math.floor(Math.random() * measurements.length)];
    setCurrentQuestion(item);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(60);
    setRulerPosition({ x: 50, y: 50 });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !feedback && !gameOver && !showTutorial) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      handleTimeout();
    }
  }, [timeLeft, feedback, gameOver, showTutorial]);

  // Handle ruler dragging
  const handleRulerMouseDown = (e) => {
    setIsDragging(true);
    const rect = rulerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const container = e.currentTarget.getBoundingClientRect();
      setRulerPosition({
        x: e.clientX - container.left - dragOffset.x,
        y: e.clientY - container.top - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTimeout = () => {
    setFeedback({ correct: false, message: 'Hết giờ! ⏰' });
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleSubmit = () => {
    if (feedback || !userAnswer) return;

    const answer = parseFloat(userAnswer);
    const correct = currentQuestion.realValue;
    const tolerance = correct * 0.1; // 10% sai số cho phép

    const isCorrect = Math.abs(answer - correct) <= tolerance;
    
    if (isCorrect) {
      const timeBonus = Math.ceil(timeLeft / 6);
      const accuracyBonus = Math.abs(answer - correct) < 0.5 ? 5 : 0;
      const earnedPoints = 10 + timeBonus + accuracyBonus;
      
      setScore(score + earnedPoints);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        correct: true,
        message: `Chính xác! 🎉 (+${earnedPoints} điểm)`,
        detail: answer === correct ? 'Đo hoàn hảo! 🌟' : 'Đo rất tốt!'
      });
    } else {
      setFeedback({
        correct: false,
        message: `Chưa chính xác! 😅`,
        detail: `Đáp án đúng: ${correct} ${currentQuestion.unit}. Bạn đo được: ${answer} ${currentQuestion.unit}`
      });
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const moveToNextQuestion = () => {
    setTotalQuestions(totalQuestions + 1);
    if (level < 10) {
      setLevel(level + 1);
      generateQuestion();
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowTutorial(false);
    generateQuestion();
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  if (!currentQuestion) return null;

  return (
    <div className="measurement-game">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>📏 Hướng dẫn chơi</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p><strong>Kéo thước đo</strong> bằng chuột để đặt sát cạnh vật thể</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p><strong>Đọc kết quả</strong> trên thước, chú ý vạch chia nhỏ</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p><strong>Nhập số đo</strong> vào ô bên dưới và nhấn "Kiểm tra"</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p><strong>Sai số ±10%</strong> được chấp nhận</p>
              </div>
            </div>
            <button onClick={closeTutorial} className="start-game-btn">
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
        <h1>📏 Đo Độ Dài</h1>
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

          <div className="question-header">
            <h2>🎯 Đo {currentQuestion.object}</h2>
            <div className="hint-box">
              <HelpCircle size={16} />
              <span>{currentQuestion.hint}</span>
            </div>
          </div>

          {/* Measurement Area */}
          <div 
            className="measurement-area"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Object to measure */}
            <div className="object-container">
              <div 
                ref={objectRef}
                className="object-to-measure"
                style={{ 
                  width: `${currentQuestion.width}px`,
                  backgroundColor: currentQuestion.color
                }}
              >
                <span className="object-icon">{currentQuestion.image}</span>
                <span className="object-label">{currentQuestion.object}</span>
              </div>
            </div>

            {/* Draggable Ruler */}
            <div
              ref={rulerRef}
              className={`ruler ${isDragging ? 'dragging' : ''}`}
              style={{
                left: `${rulerPosition.x}px`,
                top: `${rulerPosition.y}px`,
              }}
              onMouseDown={handleRulerMouseDown}
            >
              <div className="ruler-body">
                <div className="ruler-label">📏 Thước kẻ (cm)</div>
                <div className="ruler-marks">
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className="ruler-mark-group">
                      <div className={`ruler-mark ${i % 5 === 0 ? 'major' : 'minor'}`}>
                        {i % 5 === 0 && <span className="mark-number">{i}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="drag-hint">
              🖱️ Kéo thước để đo vật thể
            </div>
          </div>

          {/* Answer Input */}
          <div className="answer-section">
            <div className="input-group">
              <label>Kết quả đo của bạn:</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Nhập số đo"
                  step="0.1"
                  disabled={!!feedback}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <span className="unit-label">{currentQuestion.unit}</span>
              </div>
            </div>
            <button 
              onClick={handleSubmit} 
              className="submit-btn"
              disabled={!!feedback || !userAnswer}
            >
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
            {correctAnswers >= 9 && <div className="badge gold">🏆 Chuyên gia đo lường!</div>}
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

export default MeasurementGame;
