import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Zap, Plus, Minus } from 'lucide-react';
import './ElectricFieldVisualizer.css';

/**
 * Electric Field Visualizer - Grade 11 Chapter 3: Electricity
 * Interactive charge placement, field lines, potential visualization
 */

const ElectricFieldVisualizer = () => {
  const canvasRef = useRef(null);
  const potentialRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [charges, setCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showPotential, setShowPotential] = useState(false);
  const [testCharge, setTestCharge] = useState({ x: 400, y: 300, q: 1e-6 });
  const [showForce, setShowForce] = useState(false);
  
  // Game mode
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0
  });

  const k = 8.99e9; // Coulomb constant

  useEffect(() => {
    if (gameState === 'playing') {
      drawField();
      if (showPotential) {
        drawPotentialMap();
      }
    }
  }, [gameState, charges, showFieldLines, showPotential, testCharge, showForce]);

  const addCharge = (type) => {
    const newCharge = {
      id: Date.now(),
      x: 400 + (Math.random() - 0.5) * 200,
      y: 300 + (Math.random() - 0.5) * 200,
      q: type === 'positive' ? 5e-6 : -5e-6,
      type
    };
    setCharges([...charges, newCharge]);
  };

  const removeCharge = (id) => {
    setCharges(charges.filter(c => c.id !== id));
  };

  const updateChargePosition = (id, x, y) => {
    setCharges(charges.map(c => c.id === id ? { ...c, x, y } : c));
  };

  const calculateElectricField = (x, y) => {
    let Ex = 0, Ey = 0;
    
    charges.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r > 5) {
        const E = k * Math.abs(charge.q) / (r * r);
        const dirX = dx / r;
        const dirY = dy / r;
        
        if (charge.q > 0) {
          Ex += E * dirX;
          Ey += E * dirY;
        } else {
          Ex -= E * dirX;
          Ey -= E * dirY;
        }
      }
    });
    
    return { Ex, Ey, magnitude: Math.sqrt(Ex * Ex + Ey * Ey) };
  };

  const calculatePotential = (x, y) => {
    let V = 0;
    charges.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > 5) {
        V += k * charge.q / r;
      }
    });
    return V;
  };

  const calculateForce = () => {
    const field = calculateElectricField(testCharge.x, testCharge.y);
    return {
      Fx: field.Ex * testCharge.q,
      Fy: field.Ey * testCharge.q,
      magnitude: field.magnitude * Math.abs(testCharge.q)
    };
  };

  const drawField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw field lines
    if (showFieldLines && charges.length > 0) {
      charges.forEach(charge => {
        const numLines = 16;
        const startRadius = 25;
        
        for (let i = 0; i < numLines; i++) {
          const angle = (i / numLines) * 2 * Math.PI;
          let x = charge.x + Math.cos(angle) * startRadius;
          let y = charge.y + Math.sin(angle) * startRadius;
          
          ctx.strokeStyle = charge.q > 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          
          for (let step = 0; step < 100; step++) {
            const field = calculateElectricField(x, y);
            const magnitude = field.magnitude;
            
            if (magnitude < 1e3 || x < 0 || x > width || y < 0 || y > height) break;
            
            const stepSize = 5;
            const dx = (charge.q > 0 ? field.Ex : -field.Ex) / magnitude * stepSize;
            const dy = (charge.q > 0 ? field.Ey : -field.Ey) / magnitude * stepSize;
            
            x += dx;
            y += dy;
            ctx.lineTo(x, y);
          }
          
          ctx.stroke();
        }
      });
    }
    
    // Draw charges
    charges.forEach(charge => {
      ctx.fillStyle = charge.q > 0 ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      
      if (charge.q > 0) {
        // Plus sign
        ctx.beginPath();
        ctx.moveTo(charge.x - 8, charge.y);
        ctx.lineTo(charge.x + 8, charge.y);
        ctx.moveTo(charge.x, charge.y - 8);
        ctx.lineTo(charge.x, charge.y + 8);
        ctx.stroke();
      } else {
        // Minus sign
        ctx.beginPath();
        ctx.moveTo(charge.x - 8, charge.y);
        ctx.lineTo(charge.x + 8, charge.y);
        ctx.stroke();
      }
    });
    
    // Draw test charge and force
    if (showForce && charges.length > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(testCharge.x, testCharge.y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      const force = calculateForce();
      const scale = 1e5;
      const arrowLen = Math.min(force.magnitude * scale, 100);
      
      if (arrowLen > 5) {
        const angle = Math.atan2(force.Fy, force.Fx);
        const endX = testCharge.x + Math.cos(angle) * arrowLen;
        const endY = testCharge.y + Math.sin(angle) * arrowLen;
        
        ctx.strokeStyle = '#22c55e';
        ctx.fillStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(testCharge.x, testCharge.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Arrow head
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }
    }
  };

  const drawPotentialMap = () => {
    const canvas = potentialRef.current;
    if (!canvas || charges.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    let minV = Infinity, maxV = -Infinity;
    const potentials = [];
    
    // Calculate potential at each pixel
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const V = calculatePotential(x, y);
        potentials.push(V);
        if (V < minV) minV = V;
        if (V > maxV) maxV = V;
      }
    }
    
    // Map to colors
    let idx = 0;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const V = potentials[idx++];
        const normalized = (V - minV) / (maxV - minV);
        
        // Color gradient: blue (negative) -> green (zero) -> red (positive)
        let r, g, b;
        if (normalized < 0.5) {
          const t = normalized * 2;
          r = 0;
          g = Math.floor(t * 255);
          b = Math.floor((1 - t) * 255);
        } else {
          const t = (normalized - 0.5) * 2;
          r = Math.floor(t * 255);
          g = Math.floor((1 - t) * 255);
          b = 0;
        }
        
        // Fill 2x2 block
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = 150;
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const loadPreset = (preset) => {
    switch (preset) {
      case 'dipole':
        setCharges([
          { id: 1, x: 350, y: 300, q: 5e-6, type: 'positive' },
          { id: 2, x: 450, y: 300, q: -5e-6, type: 'negative' }
        ]);
        break;
      case 'parallel':
        setCharges([
          { id: 1, x: 300, y: 200, q: 5e-6, type: 'positive' },
          { id: 2, x: 300, y: 400, q: 5e-6, type: 'positive' },
          { id: 3, x: 500, y: 200, q: -5e-6, type: 'negative' },
          { id: 4, x: 500, y: 400, q: -5e-6, type: 'negative' }
        ]);
        break;
      case 'triangle':
        setCharges([
          { id: 1, x: 400, y: 200, q: 5e-6, type: 'positive' },
          { id: 2, x: 300, y: 400, q: -5e-6, type: 'negative' },
          { id: 3, x: 500, y: 400, q: -5e-6, type: 'negative' }
        ]);
        break;
    }
  };

  const generateChallenge = () => {
    const challenges = [
      {
        setup: () => {
          const config = [
            { id: 1, x: 300, y: 300, q: 5e-6, type: 'positive' },
            { id: 2, x: 500, y: 300, q: 5e-6, type: 'positive' }
          ];
          setCharges(config);
          return {
            question: 'Hai điện tích dương đặt cách nhau 200px. Tại điểm giữa, điện trường có hướng nào?',
            answer: 'bằng 0',
            options: ['sang phải', 'sang trái', 'bằng 0', 'vô cùng']
          };
        }
      },
      {
        setup: () => {
          const config = [
            { id: 1, x: 400, y: 300, q: 5e-6, type: 'positive' }
          ];
          setCharges(config);
          return {
            question: 'Điện trường do điện tích điểm gây ra có phương hướng như thế nào?',
            answer: 'hướng ra xa',
            options: ['hướng ra xa', 'hướng vào trong', 'tiếp tuyến', 'không xác định']
          };
        }
      }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(challenge.setup());
    setUserAnswer('');
  };

  const checkAnswer = () => {
    if (!challenge) return;
    
    const correct = userAnswer === challenge.answer;
    
    if (correct) {
      setScore(s => s + 100);
      setStats(prev => ({
        correctAnswers: prev.correctAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        accuracy: ((prev.correctAnswers + 1) / (prev.totalQuestions + 1) * 100).toFixed(1)
      }));
      alert('Chính xác! +100 điểm');
    } else {
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        accuracy: (prev.correctAnswers / (prev.totalQuestions + 1) * 100).toFixed(1)
      }));
      alert(`Sai rồi! Đáp án: ${challenge.answer}`);
    }
    
    setRound(r => r + 1);
    if (round < 9) {
      generateChallenge();
    } else {
      setGameState('result');
    }
  };

  const startGame = (isGame = false) => {
    setGameState('playing');
    setGameMode(isGame);
    setScore(0);
    setRound(0);
    setCharges([]);
    if (isGame) {
      generateChallenge();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setGameMode(false);
    setCharges([]);
  };

  const handleCanvasClick = (e) => {
    if (gameMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (showForce) {
      setTestCharge({ ...testCharge, x, y });
    }
  };

  // Menu
  if (gameState === 'menu') {
    return (
      <div className="electric-container">
        <div className="electric-menu">
          <div className="electric-menu-content">
            <div className="electric-title">
              <Zap className="electric-title-icon" />
              <h1>Electric Field Visualizer</h1>
            </div>
            <p className="electric-description">
              Mô phỏng điện trường: Đặt điện tích, quan sát đường sức điện trường,
              bề mặt đẳng thế, và tính toán lực điện trường.
            </p>
            
            <div className="electric-stats">
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.correctAnswers}</div>
                  <div className="stat-label">Trả lời đúng</div>
                </div>
              </div>
              <div className="stat-item">
                <Zap className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.totalQuestions}</div>
                  <div className="stat-label">Tổng câu hỏi</div>
                </div>
              </div>
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.accuracy}%</div>
                  <div className="stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>

            <div className="electric-menu-buttons">
              <button className="electric-btn electric-btn-primary" onClick={() => startGame(false)}>
                <Play size={20} />
                Chế độ tự do
              </button>
              <button className="electric-btn electric-btn-secondary" onClick={() => startGame(true)}>
                <Trophy size={20} />
                Thử thách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result
  if (gameState === 'result') {
    return (
      <div className="electric-container">
        <div className="electric-menu">
          <div className="electric-menu-content">
            <div className="electric-title">
              <Trophy className="electric-title-icon" />
              <h1>Kết quả</h1>
            </div>
            <div className="result-score">
              <div className="result-value">{score}</div>
              <div className="result-label">Tổng điểm</div>
            </div>
            <div className="electric-menu-buttons">
              <button className="electric-btn electric-btn-primary" onClick={() => startGame(true)}>
                <RotateCw size={20} />
                Chơi lại
              </button>
              <button className="electric-btn electric-btn-secondary" onClick={resetGame}>
                <Home size={20} />
                Về menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="electric-container">
      <div className="electric-game">
        <div className="electric-header">
          <div className="electric-header-left">
            <button className="electric-icon-btn" onClick={resetGame}>
              <Home size={24} />
            </button>
            <h2>Electric Field Visualizer</h2>
          </div>
          <div className="electric-header-right">
            {gameMode && (
              <div className="electric-score">
                Điểm: {score} | Câu: {round + 1}/10
              </div>
            )}
          </div>
        </div>

        <div className="electric-content">
          <div className="electric-canvas-container">
            <div className="canvas-wrapper">
              {showPotential && (
                <canvas
                  ref={potentialRef}
                  width={800}
                  height={600}
                  className="electric-canvas potential-canvas"
                />
              )}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="electric-canvas"
                onClick={handleCanvasClick}
              />
            </div>
          </div>

          <div className="electric-controls">
            {!gameMode && (
              <>
                <div className="control-section">
                  <h3>Điện tích</h3>
                  <div className="charge-buttons">
                    <button 
                      className="charge-btn positive"
                      onClick={() => addCharge('positive')}
                    >
                      <Plus size={20} />
                      Điện tích +
                    </button>
                    <button 
                      className="charge-btn negative"
                      onClick={() => addCharge('negative')}
                    >
                      <Minus size={20} />
                      Điện tích -
                    </button>
                  </div>
                  <button 
                    className="electric-btn electric-btn-primary"
                    onClick={() => setCharges([])}
                    disabled={charges.length === 0}
                  >
                    Xóa tất cả
                  </button>
                </div>

                <div className="control-section">
                  <h3>Cấu hình mẫu</h3>
                  <div className="preset-buttons">
                    <button className="preset-btn" onClick={() => loadPreset('dipole')}>
                      Lưỡng cực
                    </button>
                    <button className="preset-btn" onClick={() => loadPreset('parallel')}>
                      Song song
                    </button>
                    <button className="preset-btn" onClick={() => loadPreset('triangle')}>
                      Tam giác
                    </button>
                  </div>
                </div>

                <div className="control-section">
                  <h3>Hiển thị</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showFieldLines}
                      onChange={(e) => setShowFieldLines(e.target.checked)}
                    />
                    Đường sức điện trường
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showPotential}
                      onChange={(e) => setShowPotential(e.target.checked)}
                    />
                    Bản đồ điện thế
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showForce}
                      onChange={(e) => setShowForce(e.target.checked)}
                    />
                    Lực trên điện tích thử
                  </label>
                </div>
              </>
            )}

            {gameMode && challenge && (
              <div className="control-section challenge-section">
                <h3>Thử thách {round + 1}/10</h3>
                <p className="challenge-question">{challenge.question}</p>
                <select
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="challenge-select"
                >
                  <option value="">Chọn đáp án</option>
                  {challenge.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  className="electric-btn electric-btn-primary"
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                >
                  Kiểm tra
                </button>
              </div>
            )}

            <div className="control-section">
              <h3>Thông tin</h3>
              <div className="electric-info-box">
                <p><strong>Điện trường:</strong> E = kQ/r²</p>
                <p><strong>Lực:</strong> F = qE</p>
                <p><strong>Điện thế:</strong> V = kQ/r</p>
                <p><strong>k:</strong> 9×10⁹ N·m²/C²</p>
                <p>Đỏ: điện tích dương (+)</p>
                <p>Xanh: điện tích âm (-)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricFieldVisualizer;
