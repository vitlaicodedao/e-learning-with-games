import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw } from 'lucide-react';
import './MassBalanceGame.css';

const MassBalanceGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [leftMass, setLeftMass] = useState(0);
  const [rightMass, setRightMass] = useState(0);
  const [targetMass, setTargetMass] = useState(0);
  const [availableWeights, setAvailableWeights] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isBalanced, setIsBalanced] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const weights = [1, 2, 5, 10, 20, 50, 100, 200, 500];

  const generateLevel = () => {
    const target = Math.floor(Math.random() * 500) + 50;
    setTargetMass(target);
    setLeftMass(0);
    setRightMass(target);
    
    // Generate available weights
    const available = [];
    for (let i = 0; i < 8; i++) {
      const weight = weights[Math.floor(Math.random() * weights.length)];
      available.push({ id: Date.now() + i, value: weight, placed: false });
    }
    setAvailableWeights(available);
    setIsBalanced(false);
    setFeedback(null);
  };

  useEffect(() => {
    generateLevel();
  }, []);

  useEffect(() => {
    const balanced = Math.abs(leftMass - rightMass) < 1;
    setIsBalanced(balanced);
  }, [leftMass, rightMass]);

  const handleAddWeight = (weight) => {
    if (weight.placed) return;
    
    setLeftMass(leftMass + weight.value);
    setAvailableWeights(availableWeights.map(w => 
      w.id === weight.id ? { ...w, placed: true } : w
    ));
  };

  const handleRemoveWeight = (weight) => {
    setLeftMass(Math.max(0, leftMass - weight.value));
    setAvailableWeights(availableWeights.map(w => 
      w.id === weight.id ? { ...w, placed: false } : w
    ));
  };

  const handleCheck = () => {
    if (isBalanced) {
      setScore(score + 10 + level * 2);
      setFeedback({ correct: true, message: 'Cân bằng hoàn hảo! 🎯' });
      
      setTimeout(() => {
        if (level < 10) {
          setLevel(level + 1);
          generateLevel();
        } else {
          setGameOver(true);
        }
      }, 2000);
    } else {
      setFeedback({ correct: false, message: 'Chưa cân bằng! Thử lại nhé!' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const tiltAngle = Math.min(Math.max((leftMass - rightMass) / 20, -15), 15);

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    generateLevel();
  };

  return (
    <div className="mass-balance-game">
      <div className="game-header">
        <button onClick={() => navigate('/advanced-physics-challenge')} className="back-btn">
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <h1>⚖️ Cân Bằng Khối Lượng</h1>
      </div>

      {!gameOver ? (
        <div className="game-content">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Cấp độ</span>
              <span className="stat-value">{level}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mục tiêu</span>
              <span className="stat-value">{targetMass}g</span>
            </div>
          </div>

          <div className="balance-container">
            <div className="balance-stand">
              <div className="stand-pole"></div>
              <div className="stand-base"></div>
            </div>

            <div 
              className="balance-beam" 
              style={{ transform: `rotate(${tiltAngle}deg)` }}
            >
              <div className="beam-line"></div>
              
              <div className="balance-plate left-plate">
                <div className="plate-content">
                  <div className="mass-display">{leftMass}g</div>
                  <div className="weights-display">
                    {availableWeights.filter(w => w.placed).map(w => (
                      <div 
                        key={w.id} 
                        className="placed-weight"
                        onClick={() => handleRemoveWeight(w)}
                      >
                        {w.value}g
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="balance-plate right-plate">
                <div className="plate-content">
                  <div className="mass-display">{rightMass}g</div>
                  <div className="target-label">Mục tiêu</div>
                </div>
              </div>
            </div>

            {isBalanced && (
              <div className="balanced-indicator">
                ✓ Cân bằng!
              </div>
            )}
          </div>

          <div className="weights-selection">
            <h3>Chọn quả cân:</h3>
            <div className="weights-grid">
              {availableWeights.filter(w => !w.placed).map(weight => (
                <button
                  key={weight.id}
                  className="weight-btn"
                  onClick={() => handleAddWeight(weight)}
                >
                  <div className="weight-icon">⚖️</div>
                  <div className="weight-value">{weight.value}g</div>
                </button>
              ))}
            </div>
          </div>

          <button 
            className="check-btn" 
            onClick={handleCheck}
            disabled={!isBalanced}
          >
            Kiểm tra
          </button>

          {feedback && (
            <div className={`feedback ${feedback.correct ? 'correct-feedback' : 'wrong-feedback'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      ) : (
        <div className="game-over">
          <Award size={80} className="trophy-icon" />
          <h2>Hoàn thành!</h2>
          <div className="final-stats">
            <div className="final-stat">
              <span className="final-label">Tổng điểm</span>
              <span className="final-value">{score}</span>
            </div>
            <div className="final-stat">
              <span className="final-label">Cấp độ đạt</span>
              <span className="final-value">{level}</span>
            </div>
          </div>
          <button onClick={handleRestart} className="restart-btn">
            <RotateCcw size={20} />
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
};

export default MassBalanceGame;
