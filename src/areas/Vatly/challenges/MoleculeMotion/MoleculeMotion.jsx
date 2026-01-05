import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Atom, Trophy, Thermometer, Gauge } from 'lucide-react';
import './MoleculeMotion.css';

const MoleculeMotion = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Simulation state
  const [molecules, setMolecules] = useState([]);
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [state, setState] = useState('solid'); // solid, liquid, gas
  const [isRunning, setIsRunning] = useState(false);

  const levels = [
    {
      id: 1,
      name: 'Chất Rắn',
      description: 'Quan sát phân tử dao động quanh vị trí cân bằng',
      state: 'solid',
      tempRange: [100, 273],
      instruction: 'Quan sát các phân tử trong chất rắn'
    },
    {
      id: 2,
      name: 'Chất Lỏng',
      description: 'Phân tử chuyển động tự do nhưng còn gần nhau',
      state: 'liquid',
      tempRange: [273, 373],
      instruction: 'Tăng nhiệt độ để chuyển từ rắn sang lỏng'
    },
    {
      id: 3,
      name: 'Chất Khí',
      description: 'Phân tử chuyển động hỗn loạn, xa nhau',
      state: 'gas',
      tempRange: [373, 500],
      instruction: 'Tăng nhiệt độ để chuyển từ lỏng sang khí'
    },
    {
      id: 4,
      name: 'Chuyển Pha',
      description: 'Quan sát quá trình chuyển thể',
      state: 'transition',
      tempRange: [100, 500],
      instruction: 'Điều chỉnh nhiệt độ để thấy các trạng thái'
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      initMolecules();
      setTemperature(currentLevel.tempRange[0]);
      setState(currentLevel.state);
      setIsRunning(true);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (isRunning && gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, molecules, temperature, gameState]);

  const initMolecules = () => {
    const newMolecules = [];
    const rows = 8;
    const cols = 10;
    const spacing = 60;
    const offsetX = 150;
    const offsetY = 100;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newMolecules.push({
          id: i * cols + j,
          x: offsetX + j * spacing + (i % 2) * (spacing / 2),
          y: offsetY + i * spacing,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          homeX: offsetX + j * spacing + (i % 2) * (spacing / 2),
          homeY: offsetY + i * spacing,
          radius: 8,
          color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`
        });
      }
    }

    setMolecules(newMolecules);
  };

  const gameLoop = () => {
    updateMolecules();
    drawGame();
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updateMolecules = () => {
    // Determine state based on temperature
    let newState;
    if (temperature < 273) {
      newState = 'solid';
    } else if (temperature < 373) {
      newState = 'liquid';
    } else {
      newState = 'gas';
    }
    setState(newState);

    setMolecules(prevMolecules => {
      return prevMolecules.map(mol => {
        let newVx = mol.vx;
        let newVy = mol.vy;
        let newX = mol.x;
        let newY = mol.y;

        // Update velocity based on temperature and state
        const speedFactor = Math.sqrt(temperature / 300);

        if (newState === 'solid') {
          // Oscillate around home position
          const dx = mol.homeX - mol.x;
          const dy = mol.homeY - mol.y;
          newVx = dx * 0.02 * speedFactor + (Math.random() - 0.5) * 0.1;
          newVy = dy * 0.02 * speedFactor + (Math.random() - 0.5) * 0.1;
        } else if (newState === 'liquid') {
          // Free movement but with attraction to nearby molecules
          newVx += (Math.random() - 0.5) * 0.2 * speedFactor;
          newVy += (Math.random() - 0.5) * 0.2 * speedFactor;
          
          // Weak attraction to home
          const dx = mol.homeX - mol.x;
          const dy = mol.homeY - mol.y;
          newVx += dx * 0.001;
          newVy += dy * 0.001;
        } else {
          // Random motion, high speed
          newVx += (Math.random() - 0.5) * 0.5 * speedFactor;
          newVy += (Math.random() - 0.5) * 0.5 * speedFactor;
        }

        // Apply damping based on state
        const damping = newState === 'solid' ? 0.9 : newState === 'liquid' ? 0.98 : 0.99;
        newVx *= damping;
        newVy *= damping;

        // Limit speed
        const maxSpeed = newState === 'solid' ? 1 : newState === 'liquid' ? 3 : 6;
        const speed = Math.hypot(newVx, newVy);
        if (speed > maxSpeed) {
          newVx = (newVx / speed) * maxSpeed;
          newVy = (newVy / speed) * maxSpeed;
        }

        // Update position
        newX += newVx;
        newY += newVy;

        // Boundary collision
        if (newX < 50 || newX > 750) {
          newVx = -newVx * 0.8;
          newX = Math.max(50, Math.min(750, newX));
        }
        if (newY < 50 || newY > 550) {
          newVy = -newVy * 0.8;
          newY = Math.max(50, Math.min(550, newY));
        }

        return {
          ...mol,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      });
    });

    // Check level completion
    if (currentLevel.state !== 'transition') {
      if (state === currentLevel.state) {
        setTimeout(() => {
          if (level < levels.length) {
            setLevel(l => l + 1);
            setScore(s => s + 150);
            setGameState('playing');
          } else {
            setScore(s => s + 150);
            setGameState('victory');
          }
        }, 3000);
      }
    }
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background - change color based on state
    let bgColor;
    if (state === 'solid') {
      bgColor = '#1e3a8a';
    } else if (state === 'liquid') {
      bgColor = '#0f766e';
    } else {
      bgColor = '#991b1b';
    }
    
    ctx.fillStyle = bgColor + '40';
    ctx.fillRect(0, 0, width, height);

    // Draw container
    ctx.strokeStyle = '#ffffff80';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 700, 500);

    // Draw molecules
    molecules.forEach(mol => {
      // Glow effect
      const gradient = ctx.createRadialGradient(mol.x, mol.y, 0, mol.x, mol.y, mol.radius * 2);
      gradient.addColorStop(0, mol.color);
      gradient.addColorStop(1, mol.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mol.x, mol.y, mol.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Molecule body
      ctx.fillStyle = mol.color;
      ctx.beginPath();
      ctx.arc(mol.x, mol.y, mol.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw connection lines in solid/liquid state
      if (state === 'solid' || state === 'liquid') {
        const maxDist = state === 'solid' ? 70 : 90;
        molecules.forEach(other => {
          if (other.id > mol.id) {
            const dist = Math.hypot(mol.x - other.x, mol.y - other.y);
            if (dist < maxDist) {
              const alpha = 1 - dist / maxDist;
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(mol.x, mol.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      }
    });

    // Draw state info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Trạng thái: ${state === 'solid' ? 'RẮN' : state === 'liquid' ? 'LỎNG' : 'KHÍ'}`, 60, 35);

    // Draw temperature info
    ctx.font = '18px Arial';
    ctx.fillText(`Nhiệt độ: ${temperature}K (${(temperature - 273).toFixed(0)}°C)`, 400, 35);

    // Draw legend
    const legendX = width - 180;
    const legendY = 80;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(legendX - 10, legendY - 10, 170, 180);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('THANG NHIỆT ĐỘ', legendX, legendY);
    
    // Temperature bar
    const barHeight = 120;
    const barY = legendY + 20;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, barY, 30, barHeight);
    
    // Fill bar
    const tempRatio = (temperature - 100) / 400;
    const fillHeight = tempRatio * barHeight;
    
    const tempGradient = ctx.createLinearGradient(0, barY + barHeight, 0, barY);
    tempGradient.addColorStop(0, '#3b82f6');
    tempGradient.addColorStop(0.5, '#10b981');
    tempGradient.addColorStop(1, '#ef4444');
    
    ctx.fillStyle = tempGradient;
    ctx.fillRect(legendX, barY + barHeight - fillHeight, 30, fillHeight);
    
    // Temperature markers
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('500K', legendX + 35, barY + 5);
    ctx.fillText('373K', legendX + 35, barY + 40);
    ctx.fillText('273K', legendX + 35, barY + 80);
    ctx.fillText('100K', legendX + 35, barY + barHeight + 5);
  };

  const handleTemperatureChange = (newTemp) => {
    setTemperature(newTemp);
  };

  return (
    <div className="molecule-motion">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>🔬 Chuyển Động Phân Tử</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Atom size={16} />
            {score} điểm
          </span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="intro-card">
            <h2>{currentLevel.name}</h2>
            <p className="level-desc">{currentLevel.description}</p>

            <div className="theory-box">
              <h3>
                <Atom size={20} />
                Thuyết động học phân tử
              </h3>
              <div className="theory-content">
                <div className="state-box solid">
                  <strong>⬛ Chất Rắn</strong>
                  <p>Phân tử dao động quanh vị trí cân bằng, liên kết chặt chẽ</p>
                </div>
                <div className="state-box liquid">
                  <strong>💧 Chất Lỏng</strong>
                  <p>Phân tử chuyển động tự do nhưng còn gần nhau, liên kết yếu hơn</p>
                </div>
                <div className="state-box gas">
                  <strong>☁️ Chất Khí</strong>
                  <p>Phân tử chuyển động hỗn loạn, xa nhau, không có liên kết</p>
                </div>
              </div>
              <div className="note-box">
                <strong>📝 Lưu ý:</strong> Nhiệt độ càng cao, phân tử chuyển động càng nhanh
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Atom size={20} />
              Bắt đầu quan sát
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="instruction-panel">
            <p>{currentLevel.instruction}</p>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
          />

          <div className="controls-panel">
            <div className="temperature-control">
              <div className="control-header">
                <Thermometer size={20} />
                <strong>Điều chỉnh nhiệt độ</strong>
              </div>
              <div className="slider-container">
                <span className="temp-label">100K (-173°C)</span>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={temperature}
                  onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                  className="temp-slider"
                />
                <span className="temp-label">500K (227°C)</span>
              </div>
              <div className="temp-display">
                <Gauge size={24} />
                <span>{temperature}K ({(temperature - 273).toFixed(0)}°C)</span>
              </div>
            </div>

            <div className="state-indicator">
              <div className={`state-dot ${state}`}></div>
              <span>Trạng thái hiện tại: <strong>{
                state === 'solid' ? 'CHẤT RẮN' :
                state === 'liquid' ? 'CHẤT LỎNG' :
                'CHẤT KHÍ'
              }</strong></span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã hiểu rõ về chuyển động phân tử!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
          </div>
          <div className="victory-actions">
            <button onClick={() => { setLevel(1); setScore(0); setGameState('menu'); }}>
              Chơi lại
            </button>
            <button onClick={() => navigate(-1)}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoleculeMotion;
