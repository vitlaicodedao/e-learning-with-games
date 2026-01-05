import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, GitBranch, Zap, CheckCircle } from 'lucide-react';
import './DCCircuitMaster.css';

/**
 * DC Circuit Master - Grade 11 Chapter 3: Electricity
 * Game về mạch điện một chiều phức tạp và định luật Kirchhoff
 * Physics: ΣI = 0 (node), ΣV = 0 (loop), P = VI, R_series, R_parallel
 */

const DCCircuitMaster = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  
  // Circuit components
  const [batteries, setBatteries] = useState([{id: 1, voltage: 12, x: 100, y: 200}]);
  const [resistors, setResistors] = useState([
    {id: 1, resistance: 10, x: 300, y: 200},
    {id: 2, resistance: 20, x: 500, y: 200}
  ]);
  const [connections, setConnections] = useState([
    {from: 'battery-1', to: 'resistor-1'},
    {from: 'resistor-1', to: 'resistor-2'},
    {from: 'resistor-2', to: 'battery-1'}
  ]);
  
  // Circuit type
  const [circuitType, setCircuitType] = useState('series'); // series, parallel, mixed, wheatstone
  
  // Calculated values
  const [totalResistance, setTotalResistance] = useState(0);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [voltages, setVoltages] = useState({});
  const [currents, setCurrents] = useState({});
  const [powers, setPowers] = useState({});
  
  // Animation
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [electronPositions, setElectronPositions] = useState([]);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  // Challenge
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Levels
  const levels = [
    {
      id: 1,
      name: 'Mạch nối tiếp',
      description: 'Tính toán mạch điện nối tiếp đơn giản',
      circuitType: 'series',
      challenges: 5
    },
    {
      id: 2,
      name: 'Mạch song song',
      description: 'Phân tích mạch điện song song',
      circuitType: 'parallel',
      challenges: 7
    },
    {
      id: 3,
      name: 'Mạch hỗn hợp',
      description: 'Giải mạch điện hỗn hợp phức tạp',
      circuitType: 'mixed',
      challenges: 10
    },
    {
      id: 4,
      name: 'Cầu Wheatstone',
      description: 'Cân bằng cầu Wheatstone',
      circuitType: 'wheatstone',
      challenges: 8
    }
  ];

  const currentLevel = levels[level - 1];

  // Calculate circuit values
  const calculateCircuit = () => {
    const voltage = batteries[0]?.voltage || 0;
    
    if (circuitType === 'series') {
      // Series circuit: R_total = R1 + R2 + ...
      const R_total = resistors.reduce((sum, r) => sum + r.resistance, 0);
      const I = voltage / R_total;
      
      setTotalResistance(R_total);
      setTotalCurrent(I);
      
      const newVoltages = {};
      const newCurrents = {};
      const newPowers = {};
      
      resistors.forEach(r => {
        newVoltages[r.id] = I * r.resistance;
        newCurrents[r.id] = I;
        newPowers[r.id] = I * I * r.resistance;
      });
      
      setVoltages(newVoltages);
      setCurrents(newCurrents);
      setPowers(newPowers);
      
    } else if (circuitType === 'parallel') {
      // Parallel circuit: 1/R_total = 1/R1 + 1/R2 + ...
      const reciprocalSum = resistors.reduce((sum, r) => sum + 1/r.resistance, 0);
      const R_total = 1 / reciprocalSum;
      const I_total = voltage / R_total;
      
      setTotalResistance(R_total);
      setTotalCurrent(I_total);
      
      const newVoltages = {};
      const newCurrents = {};
      const newPowers = {};
      
      resistors.forEach(r => {
        newVoltages[r.id] = voltage;
        newCurrents[r.id] = voltage / r.resistance;
        newPowers[r.id] = voltage * voltage / r.resistance;
      });
      
      setVoltages(newVoltages);
      setCurrents(newCurrents);
      setPowers(newPowers);
      
    } else if (circuitType === 'wheatstone') {
      // Wheatstone bridge
      if (resistors.length >= 4) {
        const [R1, R2, R3, R4] = resistors;
        const isBalanced = R1.resistance * R4.resistance === R2.resistance * R3.resistance;
        
        setTotalResistance(isBalanced ? (R1.resistance + R2.resistance) : 0);
      }
    }
  };

  useEffect(() => {
    calculateCircuit();
  }, [batteries, resistors, circuitType]);

  // Initialize electrons
  useEffect(() => {
    if (gameState === 'playing') {
      const electrons = [];
      for (let i = 0; i < 20; i++) {
        electrons.push({
          id: i,
          x: 100 + Math.random() * 600,
          y: 200,
          speed: totalCurrent > 0 ? totalCurrent * 20 : 1
        });
      }
      setElectronPositions(electrons);
    }
  }, [gameState, totalCurrent]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setTime(prev => prev + 0.016);
        
        // Animate electrons
        setElectronPositions(prev => prev.map(e => {
          let newX = e.x + e.speed;
          if (newX > 700) newX = 100;
          return { ...e, x: newX };
        }));
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, gameState]);

  // Draw circuit
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections (wires)
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 4;
    
    if (circuitType === 'series') {
      // Series circuit layout
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(250, 200);
      ctx.lineTo(250, 150);
      ctx.lineTo(450, 150);
      ctx.lineTo(450, 200);
      ctx.lineTo(600, 200);
      ctx.lineTo(600, 300);
      ctx.lineTo(100, 300);
      ctx.lineTo(100, 200);
      ctx.stroke();
      
      // Draw battery
      ctx.fillStyle = '#10B981';
      ctx.fillRect(80, 220, 40, 60);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 220, 40, 60);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${batteries[0]?.voltage || 0}V`, 100, 255);
      
      // Draw + and - terminals
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('+', 100, 215);
      ctx.fillText('-', 100, 295);
      
      // Draw resistors
      resistors.forEach((r, index) => {
        const x = 270 + index * 200;
        const y = 135;
        
        // Resistor body (zigzag)
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 30, y);
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(x - 30 + i * 12, y + (i % 2 === 0 ? 15 : -15));
        }
        ctx.lineTo(x + 30, y);
        ctx.stroke();
        
        // Resistor label
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`R${index + 1}`, x, y - 25);
        ctx.fillText(`${r.resistance}Ω`, x, y - 10);
        
        // Current and voltage labels
        ctx.fillStyle = '#3B82F6';
        ctx.font = '12px Arial';
        ctx.fillText(`I=${(currents[r.id] || 0).toFixed(2)}A`, x, y + 35);
        ctx.fillStyle = '#EF4444';
        ctx.fillText(`V=${(voltages[r.id] || 0).toFixed(2)}V`, x, y + 50);
      });
      
    } else if (circuitType === 'parallel') {
      // Parallel circuit layout
      ctx.beginPath();
      ctx.moveTo(100, 250);
      ctx.lineTo(200, 250);
      ctx.stroke();
      
      // Branch out
      ctx.beginPath();
      ctx.moveTo(200, 250);
      ctx.lineTo(200, 150);
      ctx.lineTo(500, 150);
      ctx.lineTo(500, 250);
      ctx.lineTo(600, 250);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(200, 250);
      ctx.lineTo(200, 350);
      ctx.lineTo(500, 350);
      ctx.lineTo(500, 250);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(600, 250);
      ctx.lineTo(700, 250);
      ctx.lineTo(700, 450);
      ctx.lineTo(100, 450);
      ctx.lineTo(100, 250);
      ctx.stroke();
      
      // Draw battery
      ctx.fillStyle = '#10B981';
      ctx.fillRect(70, 280, 60, 40);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 280, 60, 40);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${batteries[0]?.voltage || 0}V`, 100, 305);
      
      // Draw resistors in parallel branches
      resistors.forEach((r, index) => {
        const y = 150 + index * 200;
        
        // Resistor
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(320, y);
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(320 + i * 12, y + (i % 2 === 0 ? 15 : -15));
        }
        ctx.lineTo(380, y);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`R${index + 1}: ${r.resistance}Ω`, 350, y - 20);
        
        ctx.fillStyle = '#3B82F6';
        ctx.font = '12px Arial';
        ctx.fillText(`I=${(currents[r.id] || 0).toFixed(2)}A`, 350, y + 35);
      });
    }
    
    // Draw electrons (current flow)
    if (isPlaying) {
      electronPositions.forEach(e => {
        ctx.fillStyle = '#FCD34D';
        ctx.beginPath();
        ctx.arc(e.x, 200, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Draw info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 150);
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Thông số mạch:', 20, 30);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(`R tổng: ${totalResistance.toFixed(2)} Ω`, 20, 50);
    ctx.fillText(`I tổng: ${totalCurrent.toFixed(2)} A`, 20, 70);
    ctx.fillText(`U nguồn: ${batteries[0]?.voltage || 0} V`, 20, 90);
    
    const totalPower = totalCurrent * (batteries[0]?.voltage || 0);
    ctx.fillText(`P tổng: ${totalPower.toFixed(2)} W`, 20, 110);
    
    ctx.fillStyle = '#F59E0B';
    ctx.fillText(`Hiệu suất: ${((totalPower / (totalPower + 0.1)) * 100).toFixed(1)}%`, 20, 130);
    
  }, [time, batteries, resistors, circuitType, electronPositions, totalResistance, totalCurrent, voltages, currents, isPlaying, gameState]);

  // Generate challenge
  const generateChallenge = () => {
    const challenges = [
      {
        question: `Điện trở tương đương của mạch là bao nhiêu? (Ω)`,
        answer: totalResistance,
        tolerance: 0.1
      },
      {
        question: `Dòng điện tổng trong mạch là bao nhiêu? (A)`,
        answer: totalCurrent,
        tolerance: 0.05
      },
      {
        question: `Công suất tiêu thụ tổng của mạch là bao nhiêu? (W)`,
        answer: totalCurrent * (batteries[0]?.voltage || 0),
        tolerance: 0.1
      }
    ];
    
    if (resistors[0] && currents[resistors[0].id]) {
      challenges.push({
        question: `Dòng điện qua R1 là bao nhiêu? (A)`,
        answer: currents[resistors[0].id],
        tolerance: 0.05
      });
    }
    
    if (resistors[0] && voltages[resistors[0].id]) {
      challenges.push({
        question: `Hiệu điện thế giữa hai đầu R1 là bao nhiêu? (V)`,
        answer: voltages[resistors[0].id],
        tolerance: 0.1
      });
    }
    
    const selected = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(selected);
    setShowResult(false);
  };

  // Check challenge
  const checkChallenge = () => {
    if (!challenge) return;
    
    const userVal = parseFloat(userAnswer);
    const error = Math.abs(userVal - challenge.answer) / (challenge.answer + 0.001);
    
    if (error < challenge.tolerance) {
      setScore(score + 150);
      setChallengesSolved(challengesSolved + 1);
      setResultMessage('Chính xác! +150 điểm');
      setAccuracy(Math.min(100, accuracy + 1));
    } else {
      setResultMessage(`Đáp án đúng: ${challenge.answer.toFixed(3)}`);
      setAccuracy(Math.max(0, accuracy - 2));
    }
    
    setShowResult(true);
    setUserAnswer('');
    setTimeout(() => generateChallenge(), 2000);
  };

  const startGame = () => {
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    generateChallenge();
  };

  const reset = () => {
    setTime(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const returnToMenu = () => {
    setGameState('menu');
    setIsPlaying(false);
    reset();
  };

  const changeCircuitType = (type) => {
    setCircuitType(type);
    
    // Reset resistors based on type
    if (type === 'series') {
      setResistors([
        {id: 1, resistance: 10, x: 300, y: 150},
        {id: 2, resistance: 20, x: 500, y: 150}
      ]);
    } else if (type === 'parallel') {
      setResistors([
        {id: 1, resistance: 10, x: 350, y: 150},
        {id: 2, resistance: 20, x: 350, y: 350}
      ]);
    } else if (type === 'wheatstone') {
      setResistors([
        {id: 1, resistance: 10, x: 250, y: 150},
        {id: 2, resistance: 20, x: 450, y: 150},
        {id: 3, resistance: 15, x: 250, y: 350},
        {id: 4, resistance: 30, x: 450, y: 350}
      ]);
    }
  };

  return (
    <div className="dcm-container">
      {gameState === 'menu' && (
        <div className="dcm-menu">
          <div className="dcm-menu-content">
            <div className="dcm-title">
              <GitBranch className="dcm-title-icon" />
              <h1>DC Circuit Master</h1>
            </div>
            
            <p className="dcm-description">
              Thành thạo phân tích mạch điện một chiều phức tạp.
              Áp dụng định luật Kirchhoff và tính toán các đại lượng điện.
            </p>

            <div className="dcm-level-selector">
              <h3>Chọn cấp độ:</h3>
              {levels.map(lvl => (
                <button
                  key={lvl.id}
                  className={`dcm-level-btn ${level === lvl.id ? 'active' : ''}`}
                  onClick={() => setLevel(lvl.id)}
                >
                  <div className="dcm-level-name">{lvl.name}</div>
                  <div className="dcm-level-desc">{lvl.description}</div>
                </button>
              ))}
            </div>

            <div className="dcm-stats">
              <div className="dcm-stat">
                <Trophy />
                <div>
                  <div className="dcm-stat-value">{score}</div>
                  <div className="dcm-stat-label">Điểm</div>
                </div>
              </div>
              <div className="dcm-stat">
                <CheckCircle />
                <div>
                  <div className="dcm-stat-value">{challengesSolved}</div>
                  <div className="dcm-stat-label">Bài giải</div>
                </div>
              </div>
              <div className="dcm-stat">
                <Zap />
                <div>
                  <div className="dcm-stat-value">{accuracy.toFixed(0)}%</div>
                  <div className="dcm-stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>

            <button className="dcm-start-btn" onClick={startGame}>
              <Play />
              Bắt đầu
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="dcm-game">
          <div className="dcm-header">
            <button className="dcm-home-btn" onClick={returnToMenu}>
              <Home />
            </button>
            <h2>Mạch điện DC</h2>
            <div className="dcm-score-display">
              <Trophy />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="dcm-main">
            <div className="dcm-left">
              <canvas ref={canvasRef} width={750} height={500} className="dcm-canvas" />
              
              <div className="dcm-controls">
                <button onClick={togglePlay} className="dcm-control-btn">
                  {isPlaying ? '⏸ Tạm dừng' : '▶️ Chạy'}
                </button>
                <button onClick={reset} className="dcm-control-btn">
                  <RotateCw /> Đặt lại
                </button>
              </div>
            </div>

            <div className="dcm-right">
              <div className="dcm-circuit-selector">
                <h3>Loại mạch</h3>
                <div className="dcm-circuit-buttons">
                  <button
                    className={circuitType === 'series' ? 'active' : ''}
                    onClick={() => changeCircuitType('series')}
                  >
                    Nối tiếp
                  </button>
                  <button
                    className={circuitType === 'parallel' ? 'active' : ''}
                    onClick={() => changeCircuitType('parallel')}
                  >
                    Song song
                  </button>
                  <button
                    className={circuitType === 'wheatstone' ? 'active' : ''}
                    onClick={() => changeCircuitType('wheatstone')}
                  >
                    Wheatstone
                  </button>
                </div>
              </div>

              <div className="dcm-parameters">
                <h3>Điều chỉnh</h3>
                
                <div className="dcm-param">
                  <label>Hiệu điện thế nguồn: {batteries[0]?.voltage || 0}V</label>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={batteries[0]?.voltage || 12}
                    onChange={(e) => setBatteries([{...batteries[0], voltage: parseFloat(e.target.value)}])}
                  />
                </div>
                
                {resistors.map((r, index) => (
                  <div key={r.id} className="dcm-param">
                    <label>R{index + 1}: {r.resistance}Ω</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={r.resistance}
                      onChange={(e) => {
                        const newResistors = [...resistors];
                        newResistors[index] = {...r, resistance: parseFloat(e.target.value)};
                        setResistors(newResistors);
                      }}
                    />
                  </div>
                ))}
              </div>

              {challenge && (
                <div className="dcm-challenge">
                  <h3>Thử thách</h3>
                  <p>{challenge.question}</p>
                  <input
                    type="number"
                    step="0.001"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập đáp án..."
                    onKeyPress={(e) => e.key === 'Enter' && checkChallenge()}
                  />
                  <button onClick={checkChallenge}>Kiểm tra</button>
                  
                  {showResult && (
                    <div className={`dcm-result ${resultMessage.includes('Chính xác') ? 'correct' : 'wrong'}`}>
                      {resultMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCCircuitMaster;
