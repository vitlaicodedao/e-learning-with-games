import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Zap, Award } from 'lucide-react';
import './OscillationEnergyMaster.css';

/**
 * Oscillation Energy Master - Grade 11 Chapter 1: Oscillations
 * Game về năng lượng dao động và sự chuyển hóa năng lượng
 * Physics: Wđ = (1/2)mv², Wt = (1/2)kx², W = Wđ + Wt = (1/2)kA²
 */

const OscillationEnergyMaster = () => {
  const canvasRef = useRef(null);
  const energyGraphRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  
  // Physics parameters
  const [mass, setMass] = useState(0.5); // kg
  const [springConstant, setSpringConstant] = useState(50); // N/m
  const [amplitude, setAmplitude] = useState(0.2); // m
  const [dampingCoeff, setDampingCoeff] = useState(0); // Damping coefficient
  
  // Animation
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  // Challenge mode
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  // Energy data
  const [energyHistory, setEnergyHistory] = useState({
    kinetic: [],
    potential: [],
    total: []
  });

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Năng lượng dao động',
      description: 'Tìm hiểu động năng và thế năng trong dao động',
      challenges: 5,
      damping: false
    },
    {
      id: 2,
      name: 'Trung bình - Bảo toàn năng lượng',
      description: 'Kiểm tra định luật bảo toàn cơ năng',
      challenges: 7,
      damping: false
    },
    {
      id: 3,
      name: 'Nâng cao - Dao động tắt dần',
      description: 'Phân tích năng lượng với lực cản',
      challenges: 10,
      damping: true
    }
  ];

  const currentLevel = levels[level - 1];

  // Calculate oscillation values with damping
  const calculateValues = (t) => {
    const omega = Math.sqrt(springConstant / mass);
    
    if (dampingCoeff === 0) {
      // No damping - simple harmonic motion
      const x = amplitude * Math.cos(omega * t);
      const v = -amplitude * omega * Math.sin(omega * t);
      
      const kineticEnergy = 0.5 * mass * v * v;
      const potentialEnergy = 0.5 * springConstant * x * x;
      const totalEnergy = kineticEnergy + potentialEnergy;
      
      return { x, v, kineticEnergy, potentialEnergy, totalEnergy, omega };
    } else {
      // Damped oscillation
      const gamma = dampingCoeff / (2 * mass);
      const omegaD = Math.sqrt(omega * omega - gamma * gamma);
      const A = amplitude * Math.exp(-gamma * t);
      
      const x = A * Math.cos(omegaD * t);
      const v = -A * omegaD * Math.sin(omegaD * t) - gamma * A * Math.cos(omegaD * t);
      
      const kineticEnergy = 0.5 * mass * v * v;
      const potentialEnergy = 0.5 * springConstant * x * x;
      const totalEnergy = kineticEnergy + potentialEnergy;
      
      return { x, v, kineticEnergy, potentialEnergy, totalEnergy, omega: omegaD, amplitude: A };
    }
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setTime(prevTime => {
          const newTime = prevTime + 0.016 * timeSpeed;
          
          // Update energy history
          const values = calculateValues(newTime);
          setEnergyHistory(prev => {
            const maxPoints = 400;
            return {
              kinetic: [...prev.kinetic, { t: newTime, value: values.kineticEnergy }].slice(-maxPoints),
              potential: [...prev.potential, { t: newTime, value: values.potentialEnergy }].slice(-maxPoints),
              total: [...prev.total, { t: newTime, value: values.totalEnergy }].slice(-maxPoints)
            };
          });
          
          return newTime;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, gameState, timeSpeed, mass, springConstant, amplitude, dampingCoeff]);

  // Draw spring system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const values = calculateValues(time);
    const centerX = width / 2;
    const topY = 50;
    const scale = 250;
    const currentPosition = topY + 200 + values.x * scale;
    
    // Draw ceiling
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, topY, width, 8);
    
    // Draw spring
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const coils = 18;
    const springWidth = 25;
    const springLength = currentPosition - topY - 50;
    
    ctx.moveTo(centerX, topY + 8);
    for (let i = 0; i <= coils; i++) {
      const y = topY + 8 + (springLength * i) / coils;
      const x = centerX + (i % 2 === 0 ? springWidth : -springWidth);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(centerX, currentPosition - 50);
    ctx.stroke();
    
    // Draw mass
    const massSize = 50 + mass * 20;
    
    // Mass shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(centerX - massSize/2 + 5, currentPosition - 45, massSize, massSize);
    
    // Mass body with gradient
    const gradient = ctx.createLinearGradient(centerX - massSize/2, currentPosition - 50, centerX + massSize/2, currentPosition);
    gradient.addColorStop(0, '#EF4444');
    gradient.addColorStop(1, '#DC2626');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - massSize/2, currentPosition - 50, massSize, massSize);
    
    // Mass outline
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - massSize/2, currentPosition - 50, massSize, massSize);
    
    // Mass label
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, centerX, currentPosition - 25);
    
    // Draw equilibrium line
    ctx.strokeStyle = '#10B981';
    ctx.setLineDash([8, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, topY + 200);
    ctx.lineTo(width - 50, topY + 200);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#10B981';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('VTCB', 55, topY + 195);
    
    // Draw velocity vector
    if (Math.abs(values.v) > 0.1) {
      const velocityScale = 100;
      const velocityLength = Math.min(Math.abs(values.v) * velocityScale, 80);
      const velocityDirection = values.v > 0 ? 1 : -1;
      
      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = '#10B981';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(centerX + massSize/2 + 20, currentPosition - 25);
      ctx.lineTo(centerX + massSize/2 + 20, currentPosition - 25 + velocityDirection * velocityLength);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(centerX + massSize/2 + 20, currentPosition - 25 + velocityDirection * velocityLength);
      ctx.lineTo(centerX + massSize/2 + 15, currentPosition - 25 + velocityDirection * (velocityLength - 10));
      ctx.lineTo(centerX + massSize/2 + 25, currentPosition - 25 + velocityDirection * (velocityLength - 10));
      ctx.closePath();
      ctx.fill();
      
      // Velocity label
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`v=${values.v.toFixed(2)} m/s`, centerX + massSize/2 + 30, currentPosition - 20);
    }
    
    // Energy bars
    const maxEnergy = 0.5 * springConstant * amplitude * amplitude;
    const barWidth = 40;
    const barMaxHeight = 150;
    const barX = width - 120;
    const barBaseY = height - 50;
    
    // Kinetic energy bar
    const kineticHeight = (values.kineticEnergy / maxEnergy) * barMaxHeight;
    ctx.fillStyle = '#10B981';
    ctx.fillRect(barX, barBaseY - kineticHeight, barWidth, kineticHeight);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barBaseY - kineticHeight, barWidth, kineticHeight);
    
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Wđ', barX + barWidth/2, barBaseY + 15);
    ctx.fillText(`${values.kineticEnergy.toFixed(2)} J`, barX + barWidth/2, barBaseY + 30);
    
    // Potential energy bar
    const potentialHeight = (values.potentialEnergy / maxEnergy) * barMaxHeight;
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(barX + 50, barBaseY - potentialHeight, barWidth, potentialHeight);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX + 50, barBaseY - potentialHeight, barWidth, potentialHeight);
    
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText('Wt', barX + 50 + barWidth/2, barBaseY + 15);
    ctx.fillText(`${values.potentialEnergy.toFixed(2)} J`, barX + 50 + barWidth/2, barBaseY + 30);
    
    // Draw bar outlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barBaseY - barMaxHeight, barWidth, barMaxHeight);
    ctx.strokeRect(barX + 50, barBaseY - barMaxHeight, barWidth, barMaxHeight);
    
  }, [time, mass, springConstant, amplitude, dampingCoeff, gameState]);

  // Draw energy graphs
  useEffect(() => {
    const canvas = energyGraphRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = (height * i) / 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Calculate max energy for scaling
    const maxEnergy = 0.5 * springConstant * amplitude * amplitude * 1.1;
    
    // Draw energy curves
    const timeRange = 10;
    const minTime = Math.max(0, time - timeRange);
    
    const drawCurve = (data, color, label) => {
      if (data.length < 2) return;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let started = false;
      data.forEach((point) => {
        if (point.t < minTime) return;
        
        const x = ((point.t - minTime) / timeRange) * width;
        const y = height - (point.value / maxEnergy) * height;
        
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw legend
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
    };
    
    drawCurve(energyHistory.potential, '#F59E0B', 'Thế năng');
    drawCurve(energyHistory.kinetic, '#10B981', 'Động năng');
    drawCurve(energyHistory.total, '#EF4444', 'Cơ năng');
    
    // Legend
    const legendX = 20;
    const legendY = 30;
    
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(legendX, legendY, 20, 3);
    ctx.fillText('Thế năng', legendX + 25, legendY + 5);
    
    ctx.fillStyle = '#10B981';
    ctx.fillRect(legendX, legendY + 20, 20, 3);
    ctx.fillText('Động năng', legendX + 25, legendY + 25);
    
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(legendX, legendY + 40, 20, 3);
    ctx.fillText('Cơ năng', legendX + 25, legendY + 45);
    
  }, [energyHistory, time, springConstant, amplitude, gameState]);

  // Generate challenge
  const generateChallenge = () => {
    const types = [
      {
        type: 'maxKinetic',
        question: 'Động năng cực đại của hệ dao động này là bao nhiêu? (J)',
        calculate: () => 0.5 * springConstant * amplitude * amplitude
      },
      {
        type: 'maxPotential',
        question: 'Thế năng cực đại của hệ dao động này là bao nhiêu? (J)',
        calculate: () => 0.5 * springConstant * amplitude * amplitude
      },
      {
        type: 'totalEnergy',
        question: 'Cơ năng toàn phần của hệ dao động này là bao nhiêu? (J)',
        calculate: () => 0.5 * springConstant * amplitude * amplitude
      },
      {
        type: 'velocityAtPosition',
        question: `Vận tốc của vật tại li độ x=${(amplitude * 0.5).toFixed(2)}m là bao nhiêu? (m/s)`,
        calculate: () => {
          const x = amplitude * 0.5;
          const omega = Math.sqrt(springConstant / mass);
          return omega * Math.sqrt(amplitude * amplitude - x * x);
        }
      },
      {
        type: 'energyRatio',
        question: 'Tỷ số giữa động năng và thế năng tại vị trí biên là?',
        calculate: () => 0
      }
    ];
    
    const selected = types[Math.floor(Math.random() * types.length)];
    const answer = selected.calculate();
    
    setCurrentChallenge({
      ...selected,
      answer: answer
    });
    setUserAnswer('');
    setShowResult(false);
  };

  // Check answer
  const checkAnswer = () => {
    if (!currentChallenge) return;
    
    const userVal = parseFloat(userAnswer);
    const error = Math.abs(userVal - currentChallenge.answer) / currentChallenge.answer;
    
    if (error < 0.05) {
      setScore(score + 100);
      setChallengesSolved(challengesSolved + 1);
      setResultMessage('Chính xác! +100 điểm');
      setAccuracy(Math.min(100, accuracy + 1));
    } else if (error < 0.1) {
      setScore(score + 50);
      setChallengesSolved(challengesSolved + 1);
      setResultMessage('Gần đúng! +50 điểm');
    } else {
      setResultMessage(`Sai rồi! Đáp án đúng: ${currentChallenge.answer.toFixed(3)}`);
      setAccuracy(Math.max(0, accuracy - 2));
    }
    
    setShowResult(true);
    setTimeout(() => {
      generateChallenge();
    }, 2000);
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    setEnergyHistory({ kinetic: [], potential: [], total: [] });
    generateChallenge();
  };

  // Reset
  const reset = () => {
    setTime(0);
    setIsPlaying(false);
    setEnergyHistory({ kinetic: [], potential: [], total: [] });
  };

  // Toggle play
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Return to menu
  const returnToMenu = () => {
    setGameState('menu');
    setIsPlaying(false);
    reset();
  };

  return (
    <div className="oem-container">
      {gameState === 'menu' && (
        <div className="oem-menu">
          <div className="oem-menu-content">
            <div className="oem-title">
              <Zap className="oem-title-icon" />
              <h1>Oscillation Energy Master</h1>
            </div>
            
            <p className="oem-description">
              Khám phá sự chuyển hóa năng lượng trong dao động điều hòa.
              Quan sát động năng, thế năng và định luật bảo toàn cơ năng.
            </p>

            <div className="oem-level-selector">
              <h3>Chọn cấp độ:</h3>
              {levels.map(lvl => (
                <button
                  key={lvl.id}
                  className={`oem-level-btn ${level === lvl.id ? 'active' : ''}`}
                  onClick={() => setLevel(lvl.id)}
                >
                  <div className="oem-level-name">{lvl.name}</div>
                  <div className="oem-level-desc">{lvl.description}</div>
                </button>
              ))}
            </div>

            <div className="oem-stats">
              <div className="oem-stat">
                <Trophy />
                <div>
                  <div className="oem-stat-value">{score}</div>
                  <div className="oem-stat-label">Điểm</div>
                </div>
              </div>
              <div className="oem-stat">
                <Award />
                <div>
                  <div className="oem-stat-value">{challengesSolved}</div>
                  <div className="oem-stat-label">Thử thách</div>
                </div>
              </div>
              <div className="oem-stat">
                <Zap />
                <div>
                  <div className="oem-stat-value">{accuracy.toFixed(0)}%</div>
                  <div className="oem-stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>

            <button className="oem-start-btn" onClick={startGame}>
              <Play />
              Bắt đầu
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="oem-game">
          <div className="oem-header">
            <button className="oem-home-btn" onClick={returnToMenu}>
              <Home />
            </button>
            <h2>Năng lượng dao động</h2>
            <div className="oem-score-display">
              <Trophy />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="oem-main">
            <div className="oem-left">
              <canvas ref={canvasRef} width={500} height={600} className="oem-canvas" />
              
              <div className="oem-controls">
                <button onClick={togglePlay} className="oem-control-btn">
                  {isPlaying ? '⏸ Tạm dừng' : '▶️ Chạy'}
                </button>
                <button onClick={reset} className="oem-control-btn">
                  <RotateCw /> Đặt lại
                </button>
              </div>
            </div>

            <div className="oem-right">
              <div className="oem-parameters">
                <h3>Thông số</h3>
                
                <div className="oem-param">
                  <label>Khối lượng: {mass.toFixed(2)} kg</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="oem-param">
                  <label>Độ cứng: {springConstant.toFixed(0)} N/m</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={springConstant}
                    onChange={(e) => setSpringConstant(parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="oem-param">
                  <label>Biên độ: {amplitude.toFixed(2)} m</label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.01"
                    value={amplitude}
                    onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                  />
                </div>
                
                {currentLevel.damping && (
                  <div className="oem-param">
                    <label>Lực cản: {dampingCoeff.toFixed(2)} kg/s</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={dampingCoeff}
                      onChange={(e) => setDampingCoeff(parseFloat(e.target.value))}
                    />
                  </div>
                )}
                
                <div className="oem-param">
                  <label>Tốc độ: {timeSpeed.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="oem-info">
                <h3>Năng lượng</h3>
                {(() => {
                  const vals = calculateValues(time);
                  return (
                    <>
                      <div className="oem-info-row">
                        <span>Động năng:</span>
                        <strong>{vals.kineticEnergy.toFixed(3)} J</strong>
                      </div>
                      <div className="oem-info-row">
                        <span>Thế năng:</span>
                        <strong>{vals.potentialEnergy.toFixed(3)} J</strong>
                      </div>
                      <div className="oem-info-row">
                        <span>Cơ năng:</span>
                        <strong>{vals.totalEnergy.toFixed(3)} J</strong>
                      </div>
                      <div className="oem-info-row">
                        <span>Vận tốc:</span>
                        <strong>{vals.v.toFixed(3)} m/s</strong>
                      </div>
                      <div className="oem-info-row">
                        <span>Li độ:</span>
                        <strong>{vals.x.toFixed(3)} m</strong>
                      </div>
                    </>
                  );
                })()}
              </div>

              {currentChallenge && (
                <div className="oem-challenge">
                  <h3>Thử thách</h3>
                  <p className="oem-challenge-question">{currentChallenge.question}</p>
                  
                  <input
                    type="number"
                    step="0.001"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập đáp án..."
                    className="oem-answer-input"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  
                  <button onClick={checkAnswer} className="oem-check-btn">
                    Kiểm tra
                  </button>
                  
                  {showResult && (
                    <div className={`oem-result ${resultMessage.includes('Chính xác') ? 'correct' : resultMessage.includes('Gần') ? 'close' : 'wrong'}`}>
                      {resultMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="oem-graph-section">
            <h3>Đồ thị năng lượng theo thời gian</h3>
            <canvas ref={energyGraphRef} width={1200} height={200} className="oem-graph-canvas" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OscillationEnergyMaster;
