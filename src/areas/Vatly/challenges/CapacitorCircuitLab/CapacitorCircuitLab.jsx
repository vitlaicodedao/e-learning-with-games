import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Battery, Zap } from 'lucide-react';
import './CapacitorCircuitLab.css';

const CapacitorCircuitLab = () => {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState('charging'); // charging, discharging, series, parallel
  
  // Circuit parameters
  const [capacitance, setCapacitance] = useState(100); // µF
  const [resistance, setResistance] = useState(10); // kΩ
  const [voltage, setVoltage] = useState(12); // V
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Multiple capacitors
  const [capacitors, setCapacitors] = useState([100, 100]); // µF
  const [connection, setConnection] = useState('series'); // series, parallel
  
  // Game mode
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  
  const [stats, setStats] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0
  });

  useEffect(() => {
    if (isRunning && gameState === 'playing') {
      const interval = setInterval(() => {
        setTime(t => t + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      drawCircuit();
      drawGraph();
    }
  }, [gameState, time, mode, capacitance, resistance, voltage, capacitors, connection]);

  const calculateCharging = (t) => {
    const C = capacitance * 1e-6; // Convert to F
    const R = resistance * 1e3; // Convert to Ω
    const tau = R * C;
    
    const Vc = voltage * (1 - Math.exp(-t / tau));
    const I = (voltage / R) * Math.exp(-t / tau);
    const Q = C * Vc;
    const energy = 0.5 * C * Vc * Vc;
    
    return { Vc, I: I * 1000, Q: Q * 1e6, energy, tau };
  };

  const calculateDischarging = (t) => {
    const C = capacitance * 1e-6;
    const R = resistance * 1e3;
    const tau = R * C;
    
    const Vc = voltage * Math.exp(-t / tau);
    const I = -(voltage / R) * Math.exp(-t / tau);
    const Q = C * Vc;
    const energy = 0.5 * C * Vc * Vc;
    
    return { Vc, I: I * 1000, Q: Q * 1e6, energy, tau };
  };

  const calculateEquivalent = () => {
    if (connection === 'series') {
      const reciprocalSum = capacitors.reduce((sum, C) => sum + 1/C, 0);
      return 1 / reciprocalSum;
    } else {
      return capacitors.reduce((sum, C) => sum + C, 0);
    }
  };

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    if (mode === 'series' || mode === 'parallel') {
      drawMultiCapacitorCircuit(ctx, width, height);
    } else {
      drawRCCircuit(ctx, width, height);
    }
  };

  const drawRCCircuit = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;
    
    // Draw battery
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.strokeRect(centerX - 150, centerY + radius - 10, 30, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`${voltage}V`, centerX - 145, centerY + radius + 80);
    
    // Draw resistor
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(centerX + 50 + i * 10, centerY - radius + (i % 2 === 0 ? -10 : 10));
    }
    ctx.stroke();
    ctx.fillText(`${resistance}kΩ`, centerX + 65, centerY - radius - 20);
    
    // Draw capacitor
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX + 150 - 5, centerY - 30);
    ctx.lineTo(centerX + 150 - 5, centerY + 30);
    ctx.moveTo(centerX + 150 + 5, centerY - 30);
    ctx.lineTo(centerX + 150 + 5, centerY + 30);
    ctx.stroke();
    ctx.fillText(`${capacitance}µF`, centerX + 160, centerY);
    
    // Draw wires
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Bottom
    ctx.moveTo(centerX - 120, centerY + radius + 50);
    ctx.lineTo(centerX + 150, centerY + radius + 50);
    // Right side
    ctx.lineTo(centerX + 150, centerY + 30);
    // Top right
    ctx.moveTo(centerX + 150, centerY - 30);
    ctx.lineTo(centerX + 150, centerY - radius);
    ctx.lineTo(centerX + 110, centerY - radius);
    // Top left
    ctx.moveTo(centerX + 50, centerY - radius);
    ctx.lineTo(centerX - 150, centerY - radius);
    ctx.lineTo(centerX - 150, centerY + radius - 10);
    ctx.stroke();
    
    // Calculate and show values
    const result = mode === 'charging' ? calculateCharging(time) : calculateDischarging(time);
    
    // Charge indicator on capacitor plates
    const chargeLevel = result.Vc / voltage;
    ctx.fillStyle = mode === 'charging' ? '#ef4444' : '#3b82f6';
    ctx.fillRect(centerX + 150 - 8, centerY - 30, 3, 60 * chargeLevel);
    
    // Current flow animation
    if (Math.abs(result.I) > 0.1) {
      const flowPos = (time * 50) % 100;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX - 150, centerY + radius + 50 - flowPos, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Display values
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 140);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`V_C = ${result.Vc.toFixed(2)} V`, 20, 35);
    ctx.fillText(`I = ${result.I.toFixed(2)} mA`, 20, 60);
    ctx.fillText(`Q = ${result.Q.toFixed(2)} µC`, 20, 85);
    ctx.fillText(`E = ${result.energy.toFixed(6)} J`, 20, 110);
    ctx.fillText(`τ = ${result.tau.toFixed(3)} s`, 20, 135);
  };

  const drawMultiCapacitorCircuit = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    
    if (connection === 'series') {
      // Draw series circuit
      let x = centerX - 200;
      capacitors.forEach((C, idx) => {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 5, centerY - 30);
        ctx.lineTo(x - 5, centerY + 30);
        ctx.moveTo(x + 5, centerY - 30);
        ctx.lineTo(x + 5, centerY + 30);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`C${idx+1}=${C}µF`, x - 25, centerY + 50);
        
        x += 100;
      });
      
      // Connect with wires
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 250, centerY);
      ctx.lineTo(centerX + 150, centerY);
      ctx.stroke();
    } else {
      // Draw parallel circuit
      capacitors.forEach((C, idx) => {
        const y = centerY - 80 + idx * 80;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y - 20);
        ctx.lineTo(centerX - 5, y + 20);
        ctx.moveTo(centerX + 5, y - 20);
        ctx.lineTo(centerX + 5, y + 20);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`C${idx+1}=${C}µF`, centerX + 20, y);
        
        // Wires
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 100, y);
        ctx.lineTo(centerX - 5, y);
        ctx.moveTo(centerX + 5, y);
        ctx.lineTo(centerX + 100, y);
        ctx.stroke();
      });
      
      // Vertical wires
      ctx.beginPath();
      ctx.moveTo(centerX - 100, centerY - 80);
      ctx.lineTo(centerX - 100, centerY + 80);
      ctx.moveTo(centerX + 100, centerY - 80);
      ctx.lineTo(centerX + 100, centerY + 80);
      ctx.stroke();
    }
    
    // Display equivalent capacitance
    const Ceq = calculateEquivalent();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 250, 80);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Điện dung tương đương:`, 20, 35);
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText(`C_eq = ${Ceq.toFixed(2)} µF`, 20, 65);
  };

  const drawGraph = () => {
    const canvas = graphRef.current;
    if (!canvas || mode === 'series' || mode === 'parallel') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    const result = mode === 'charging' ? calculateCharging(time) : calculateDischarging(time);
    const maxTime = result.tau * 5;
    const timeStep = maxTime / width;
    
    // Draw voltage curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = x * timeStep;
      const data = mode === 'charging' ? calculateCharging(t) : calculateDischarging(t);
      const y = height - (data.Vc / voltage) * (height - 20);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw current curve
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const maxI = voltage / (resistance * 1e3) * 1000;
    for (let x = 0; x < width; x++) {
      const t = x * timeStep;
      const data = mode === 'charging' ? calculateCharging(t) : calculateDischarging(t);
      const y = height - (Math.abs(data.I) / maxI) * (height - 20);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Current time marker
    const currentX = (time / maxTime) * width;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#3b82f6';
    ctx.font = '12px Arial';
    ctx.fillText('Voltage', 10, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Current', 10, 40);
  };

  const generateChallenge = () => {
    const challenges = [
      {
        setup: () => {
          const C = 50 + Math.random() * 150;
          const R = 5 + Math.random() * 20;
          setCapacitance(C);
          setResistance(R);
          const tau = R * C;
          return {
            question: `Tụ C=${C.toFixed(0)}µF, điện trở R=${R.toFixed(0)}kΩ. Hằng số thời gian τ = RC là?`,
            answer: tau.toFixed(0),
            tolerance: 50,
            unit: 'ms'
          };
        }
      },
      {
        setup: () => {
          const caps = [100, 100];
          setCapacitors(caps);
          setConnection('series');
          return {
            question: `Hai tụ 100µF mắc nối tiếp. Điện dung tương đương là?`,
            answer: '50',
            tolerance: 1,
            unit: 'µF'
          };
        }
      },
      {
        setup: () => {
          const caps = [50, 100];
          setCapacitors(caps);
          setConnection('parallel');
          return {
            question: `Tụ 50µF và 100µF mắc song song. Điện dung tương đương là?`,
            answer: '150',
            tolerance: 1,
            unit: 'µF'
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
    
    const userNum = parseFloat(userAnswer);
    const correct = Math.abs(userNum - parseFloat(challenge.answer)) <= challenge.tolerance;
    
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
      alert(`Sai rồi! Đáp án: ${challenge.answer} ${challenge.unit}`);
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
    setTime(0);
    setIsRunning(false);
    if (isGame) {
      generateChallenge();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setGameMode(false);
    setIsRunning(false);
    setTime(0);
  };

  if (gameState === 'menu') {
    return (
      <div className="capacitor-container">
        <div className="capacitor-menu">
          <div className="capacitor-menu-content">
            <div className="capacitor-title">
              <Battery className="capacitor-title-icon" />
              <h1>Capacitor Circuit Lab</h1>
            </div>
            <p className="capacitor-description">
              Mô phỏng tụ điện: Nạp và xả điện, mạch RC, ghép nối tiếp và song song,
              quan sát đường cong điện áp và dòng điện theo thời gian.
            </p>
            
            <div className="capacitor-stats">
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.correctAnswers}</div>
                  <div className="stat-label">Trả lời đúng</div>
                </div>
              </div>
              <div className="stat-item">
                <Battery className="stat-icon" />
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

            <div className="capacitor-menu-buttons">
              <button className="capacitor-btn capacitor-btn-primary" onClick={() => startGame(false)}>
                <Play size={20} />
                Chế độ mô phỏng
              </button>
              <button className="capacitor-btn capacitor-btn-secondary" onClick={() => startGame(true)}>
                <Trophy size={20} />
                Thử thách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="capacitor-container">
        <div className="capacitor-menu">
          <div className="capacitor-menu-content">
            <div className="capacitor-title">
              <Trophy className="capacitor-title-icon" />
              <h1>Kết quả</h1>
            </div>
            <div className="result-score">
              <div className="result-value">{score}</div>
              <div className="result-label">Tổng điểm</div>
            </div>
            <div className="capacitor-menu-buttons">
              <button className="capacitor-btn capacitor-btn-primary" onClick={() => startGame(true)}>
                <RotateCw size={20} />
                Chơi lại
              </button>
              <button className="capacitor-btn capacitor-btn-secondary" onClick={resetGame}>
                <Home size={20} />
                Về menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="capacitor-container">
      <div className="capacitor-game">
        <div className="capacitor-header">
          <div className="capacitor-header-left">
            <button className="capacitor-icon-btn" onClick={resetGame}>
              <Home size={24} />
            </button>
            <h2>Capacitor Circuit Lab</h2>
          </div>
          <div className="capacitor-header-right">
            {gameMode && (
              <div className="capacitor-score">
                Điểm: {score} | Câu: {round + 1}/10
              </div>
            )}
          </div>
        </div>

        <div className="capacitor-content">
          <div className="capacitor-canvas-container">
            <canvas ref={canvasRef} width={800} height={400} className="capacitor-canvas" />
            {(mode === 'charging' || mode === 'discharging') && (
              <canvas ref={graphRef} width={800} height={200} className="capacitor-canvas" style={{marginTop: '1rem'}} />
            )}
          </div>

          <div className="capacitor-controls">
            {!gameMode && (
              <>
                <div className="control-section">
                  <h3>Chế độ</h3>
                  <div className="mode-buttons">
                    <button className={`mode-btn ${mode === 'charging' ? 'active' : ''}`} onClick={() => {setMode('charging'); setTime(0);}}>Nạp điện</button>
                    <button className={`mode-btn ${mode === 'discharging' ? 'active' : ''}`} onClick={() => {setMode('discharging'); setTime(0);}}>Xả điện</button>
                    <button className={`mode-btn ${mode === 'series' ? 'active' : ''}`} onClick={() => setMode('series')}>Nối tiếp</button>
                    <button className={`mode-btn ${mode === 'parallel' ? 'active' : ''}`} onClick={() => setMode('parallel')}>Song song</button>
                  </div>
                </div>

                {(mode === 'charging' || mode === 'discharging') && (
                  <div className="control-section">
                    <h3>Thông số</h3>
                    <div className="control-group">
                      <label>Điện dung: {capacitance}µF
                        <input type="range" min="10" max="500" step="10" value={capacitance} onChange={(e) => setCapacitance(parseFloat(e.target.value))} />
                      </label>
                    </div>
                    <div className="control-group">
                      <label>Điện trở: {resistance}kΩ
                        <input type="range" min="1" max="50" step="1" value={resistance} onChange={(e) => setResistance(parseFloat(e.target.value))} />
                      </label>
                    </div>
                    <div className="control-group">
                      <label>Điện áp: {voltage}V
                        <input type="range" min="1" max="24" step="1" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} />
                      </label>
                    </div>
                    <button className="capacitor-btn capacitor-btn-primary" onClick={() => {setIsRunning(!isRunning)}}>
                      {isRunning ? 'Dừng' : 'Bắt đầu'}
                    </button>
                    <button className="capacitor-btn capacitor-btn-secondary" onClick={() => setTime(0)}>
                      <RotateCw size={20} /> Reset
                    </button>
                  </div>
                )}

                {(mode === 'series' || mode === 'parallel') && (
                  <div className="control-section">
                    <h3>Tụ điện</h3>
                    {capacitors.map((C, idx) => (
                      <div key={idx} className="control-group">
                        <label>C{idx+1}: {C}µF
                          <input type="range" min="10" max="200" step="10" value={C} 
                            onChange={(e) => {
                              const newCaps = [...capacitors];
                              newCaps[idx] = parseFloat(e.target.value);
                              setCapacitors(newCaps);
                            }} />
                        </label>
                      </div>
                    ))}
                    <button className="capacitor-btn capacitor-btn-primary" onClick={() => setCapacitors([...capacitors, 100])}>
                      Thêm tụ
                    </button>
                    {capacitors.length > 2 && (
                      <button className="capacitor-btn capacitor-btn-secondary" onClick={() => setCapacitors(capacitors.slice(0, -1))}>
                        Xóa tụ
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {gameMode && challenge && (
              <div className="control-section challenge-section">
                <h3>Thử thách {round + 1}/10</h3>
                <p className="challenge-question">{challenge.question}</p>
                <div className="challenge-input-group">
                  <input type="number" step="any" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Nhập câu trả lời" className="challenge-input" />
                  <span className="challenge-unit">{challenge.unit}</span>
                </div>
                <button className="capacitor-btn capacitor-btn-primary" onClick={checkAnswer} disabled={!userAnswer}>Kiểm tra</button>
              </div>
            )}

            <div className="control-section">
              <h3>Công thức</h3>
              <div className="capacitor-info-box">
                <p><strong>Điện dung:</strong> C = Q/V</p>
                <p><strong>Năng lượng:</strong> E = ½CV²</p>
                <p><strong>Nạp điện:</strong> V_C = V₀(1 - e^(-t/τ))</p>
                <p><strong>Xả điện:</strong> V_C = V₀e^(-t/τ)</p>
                <p><strong>Hằng số thời gian:</strong> τ = RC</p>
                <p><strong>Nối tiếp:</strong> 1/C_eq = Σ(1/C_i)</p>
                <p><strong>Song song:</strong> C_eq = ΣC_i</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitorCircuitLab;
