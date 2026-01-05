import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Flame, Thermometer, Trophy, Beaker } from 'lucide-react';
import './Calorimeter.css';

const Calorimeter = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  // Simulation state
  const [object1, setObject1] = useState({ mass: 0.5, temp: 80, material: 'iron' });
  const [object2, setObject2] = useState({ mass: 0.3, temp: 20, material: 'water' });
  const [mixing, setMixing] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(20);
  const [targetTemp, setTargetTemp] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [particles, setParticles] = useState([]);

  const materials = {
    water: { c: 4200, color: '#3b82f6', name: 'Nước' },
    iron: { c: 460, color: '#64748b', name: 'Sắt' },
    aluminum: { c: 880, color: '#94a3b8', name: 'Nhôm' },
    copper: { c: 380, color: '#f97316', name: 'Đồng' },
    oil: { c: 2000, color: '#fbbf24', name: 'Dầu' }
  };

  const levels = [
    {
      id: 1,
      name: 'Nhiệt Lượng Cơ Bản',
      description: 'Tính nhiệt lượng thu vào hoặc tỏa ra: Q = m × c × Δt',
      obj1: { mass: 0.5, temp: 80, material: 'iron' },
      obj2: { mass: 0.3, temp: 20, material: 'water' },
      question: 'Tính nhiệt lượng sắt tỏa ra khi nguội từ 80°C xuống 20°C',
      instruction: 'Sử dụng công thức Q = m × c × Δt'
    },
    {
      id: 2,
      name: 'Cân Bằng Nhiệt',
      description: 'Nhiệt lượng tỏa ra = Nhiệt lượng thu vào',
      obj1: { mass: 0.4, temp: 100, material: 'copper' },
      obj2: { mass: 0.5, temp: 15, material: 'water' },
      question: 'Tính nhiệt độ cân bằng khi trộn đồng nóng vào nước lạnh',
      instruction: 'Qtỏa = Qthu → m₁c₁(t₁ - t) = m₂c₂(t - t₂)'
    },
    {
      id: 3,
      name: 'Nhiệt Dung Riêng',
      description: 'So sánh khả năng giữ nhiệt của các chất',
      obj1: { mass: 0.3, temp: 90, material: 'aluminum' },
      obj2: { mass: 0.3, temp: 20, material: 'oil' },
      question: 'Chất nào giữ nhiệt tốt hơn khi cùng khối lượng?',
      instruction: 'So sánh nhiệt dung riêng c của các chất'
    },
    {
      id: 4,
      name: 'Bài Toán Thực Hành',
      description: 'Xác định nhiệt dung riêng của vật chưa biết',
      obj1: { mass: 0.2, temp: 100, material: 'copper' },
      obj2: { mass: 0.4, temp: 25, material: 'water' },
      question: 'Xác định nhiệt dung riêng của kim loại',
      instruction: 'Dùng phương trình cân bằng nhiệt để tính c'
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      initLevel();
      setTime(0);
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, mixing, currentTemp, particles]);

  const initLevel = () => {
    setObject1(currentLevel.obj1);
    setObject2(currentLevel.obj2);
    setMixing(false);
    setCurrentTemp(currentLevel.obj2.temp);
    setAnswered(false);
    setUserAnswer('');
    
    // Calculate target temperature
    const m1 = currentLevel.obj1.mass;
    const c1 = materials[currentLevel.obj1.material].c;
    const t1 = currentLevel.obj1.temp;
    const m2 = currentLevel.obj2.mass;
    const c2 = materials[currentLevel.obj2.material].c;
    const t2 = currentLevel.obj2.temp;
    
    const tTarget = (m1 * c1 * t1 + m2 * c2 * t2) / (m1 * c1 + m2 * c2);
    setTargetTemp(tTarget);

    // Initialize particles
    initParticles();
  };

  const initParticles = () => {
    const newParticles = [];
    
    // Hot particles (object 1)
    const hotCount = Math.floor(object1.mass * 100);
    for (let i = 0; i < hotCount; i++) {
      newParticles.push({
        x: 150 + Math.random() * 150,
        y: 250 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        temp: object1.temp,
        material: object1.material,
        radius: 3
      });
    }

    // Cold particles (object 2)
    const coldCount = Math.floor(object2.mass * 100);
    for (let i = 0; i < coldCount; i++) {
      newParticles.push({
        x: 500 + Math.random() * 150,
        y: 250 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        temp: object2.temp,
        material: object2.material,
        radius: 3
      });
    }

    setParticles(newParticles);
  };

  const animate = () => {
    if (mixing) {
      updateParticles();
      updateTemperature();
    }
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const updateParticles = () => {
    setParticles(prev => {
      return prev.map(p => {
        // Move particles
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;

        // Bounce off walls
        if (newX < 100 || newX > 700) {
          p.vx *= -1;
          newX = p.x;
        }
        if (newY < 200 || newY > 450) {
          p.vy *= -1;
          newY = p.y;
        }

        // Heat exchange with nearby particles
        let tempChange = 0;
        prev.forEach(other => {
          if (other !== p) {
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 20) {
              const tempDiff = other.temp - p.temp;
              tempChange += tempDiff * 0.01;
            }
          }
        });

        const newTemp = p.temp + tempChange;

        return {
          ...p,
          x: newX,
          y: newY,
          temp: Math.max(0, Math.min(100, newTemp))
        };
      });
    });
  };

  const updateTemperature = () => {
    setCurrentTemp(prev => {
      const diff = targetTemp - prev;
      if (Math.abs(diff) < 0.1) {
        return targetTemp;
      }
      return prev + diff * 0.05;
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Draw calorimeter container
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, 180, 640, 280);

    ctx.fillStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.fillRect(80, 180, 640, 280);

    // Draw particles
    particles.forEach(p => {
      const tempRatio = (p.temp - 20) / 80;
      const red = Math.floor(50 + tempRatio * 205);
      const blue = Math.floor(255 - tempRatio * 205);
      
      ctx.fillStyle = `rgba(${red}, 100, ${blue}, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Velocity trail
      if (mixing) {
        ctx.strokeStyle = `rgba(${red}, 100, ${blue}, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
      }
    });

    // Draw thermometer
    drawThermometer(ctx, 730, 200, currentTemp);

    // Draw labels
    if (!mixing) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      
      // Object 1
      ctx.fillStyle = materials[object1.material].color;
      ctx.fillText(materials[object1.material].name, 225, 170);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`m = ${object1.mass} kg`, 225, 190);
      ctx.fillText(`t₁ = ${object1.temp}°C`, 225, 210);

      // Object 2
      ctx.fillStyle = materials[object2.material].color;
      ctx.fillText(materials[object2.material].name, 575, 170);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`m = ${object2.mass} kg`, 575, 190);
      ctx.fillText(`t₂ = ${object2.temp}°C`, 575, 210);
    }

    // Draw formula
    drawFormula(ctx, width, height);
  };

  const drawThermometer = (ctx, x, y, temp) => {
    // Thermometer tube
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, 30, 200);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 30, 200);

    // Mercury
    const mercuryHeight = (temp / 100) * 180;
    const gradient = ctx.createLinearGradient(x, y + 200 - mercuryHeight, x, y + 200);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(1, '#dc2626');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 5, y + 200 - mercuryHeight, 20, mercuryHeight);

    // Bulb
    ctx.beginPath();
    ctx.arc(x + 15, y + 210, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Scale
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 100; i += 20) {
      const yPos = y + 200 - (i / 100) * 180;
      ctx.fillText(`${i}°C`, x + 35, yPos + 4);
      
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yPos);
      ctx.lineTo(x + 5, yPos);
      ctx.stroke();
    }

    // Current temperature
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentTemp.toFixed(1)}°C`, x + 15, y - 10);
  };

  const drawFormula = (ctx, width, height) => {
    const formulaY = height - 80;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(50, formulaY - 10, width - 100, 70);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, formulaY - 10, width - 100, 70);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Công thức:', 70, formulaY + 10);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Q = m × c × Δt     (Nhiệt lượng)', 70, formulaY + 35);
    
    ctx.fillStyle = '#10b981';
    ctx.fillText('Qtỏa = Qthu     (Cân bằng nhiệt)', 350, formulaY + 35);

    // Material info
    const mat1 = materials[object1.material];
    const mat2 = materials[object2.material];
    
    ctx.fillStyle = mat1.color;
    ctx.fillText(`c₁(${mat1.name}) = ${mat1.c} J/kg.K`, 550, formulaY + 10);
    
    ctx.fillStyle = mat2.color;
    ctx.fillText(`c₂(${mat2.name}) = ${mat2.c} J/kg.K`, 550, formulaY + 35);
  };

  const startMixing = () => {
    setMixing(true);
  };

  const checkAnswer = () => {
    const answer = parseFloat(userAnswer);
    const tolerance = 2; // 2 degree tolerance

    let correct = false;

    if (level === 1) {
      // Q = m × c × Δt
      const Q = object1.mass * materials[object1.material].c * (object1.temp - object2.temp);
      correct = Math.abs(answer - Q) < Q * 0.1; // 10% tolerance
    } else if (level === 2) {
      // Temperature
      correct = Math.abs(answer - targetTemp) < tolerance;
    } else if (level === 3) {
      // Compare c values
      const correctAnswer = materials[object2.material].c > materials[object1.material].c ? 
        materials[object2.material].c : materials[object1.material].c;
      correct = Math.abs(answer - correctAnswer) < 100;
    } else if (level === 4) {
      // Calculate c from equilibrium
      const m1 = object1.mass;
      const t1 = object1.temp;
      const m2 = object2.mass;
      const c2 = materials[object2.material].c;
      const t2 = object2.temp;
      const t = targetTemp;
      
      const c1_calculated = (m2 * c2 * (t - t2)) / (m1 * (t1 - t));
      correct = Math.abs(answer - c1_calculated) < c1_calculated * 0.15;
    }

    if (correct) {
      setAnswered(true);
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + Math.max(300 - time * 3, 150));
          setGameState('playing');
        } else {
          setScore(s => s + Math.max(300 - time * 3, 150));
          setGameState('victory');
        }
      }, 2000);
    } else {
      alert('Chưa chính xác! Hãy thử lại với công thức.');
    }
  };

  return (
    <div className="calorimeter-game">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>🔬 Nhiệt Lượng Kế</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Beaker size={16} />
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
              <h3>📚 Lý thuyết nhiệt lượng</h3>
              
              <div className="formula-section">
                <div className="formula-card">
                  <Flame size={24} className="formula-icon" />
                  <div className="formula-content">
                    <strong>Nhiệt lượng</strong>
                    <code>Q = m × c × Δt</code>
                    <p>Q: Nhiệt lượng (J)</p>
                    <p>m: Khối lượng (kg)</p>
                    <p>c: Nhiệt dung riêng (J/kg.K)</p>
                    <p>Δt: Độ biến thiên nhiệt độ (K)</p>
                  </div>
                </div>

                <div className="formula-card">
                  <Droplet size={24} className="formula-icon" />
                  <div className="formula-content">
                    <strong>Cân bằng nhiệt</strong>
                    <code>Q<sub>tỏa</sub> = Q<sub>thu</sub></code>
                    <p>Nhiệt lượng tỏa ra = Nhiệt lượng thu vào</p>
                    <p>m₁c₁(t₁ - t) = m₂c₂(t - t₂)</p>
                  </div>
                </div>
              </div>

              <div className="materials-table">
                <h4>Nhiệt dung riêng một số chất:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Chất</th>
                      <th>c (J/kg.K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(materials).map(([key, mat]) => (
                      <tr key={key}>
                        <td>{mat.name}</td>
                        <td>{mat.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Beaker size={20} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="instruction-panel">
            <p><strong>Câu hỏi:</strong> {currentLevel.question}</p>
            <p className="hint">{currentLevel.instruction}</p>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
          />

          <div className="controls-panel">
            <button 
              className={`mix-button ${mixing ? 'mixing' : ''}`}
              onClick={startMixing}
              disabled={mixing || answered}
            >
              <Droplet size={20} />
              {mixing ? 'Đang trộn...' : 'Trộn chất'}
            </button>

            <div className="answer-section">
              <label>Nhập kết quả:</label>
              <input
                type="number"
                step="0.1"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập đáp án..."
                disabled={answered}
              />
              <button 
                className="check-button"
                onClick={checkAnswer}
                disabled={!userAnswer || answered}
              >
                Kiểm tra
              </button>
            </div>

            {answered && (
              <div className="correct-indicator">
                ✓ Chính xác! Nhiệt độ cân bằng: {targetTemp.toFixed(1)}°C
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã thành thạo tính toán nhiệt lượng!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <strong>Thời gian:</strong>
              <span>{time}s</span>
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

export default Calorimeter;
