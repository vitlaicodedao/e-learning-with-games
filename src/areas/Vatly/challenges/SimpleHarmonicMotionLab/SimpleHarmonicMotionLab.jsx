import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Activity, Settings } from 'lucide-react';
import './SimpleHarmonicMotionLab.css';

/**
 * Simple Harmonic Motion Lab - Grade 11 Chapter 1: Oscillations
 * Thí nghiệm dao động điều hòa với lò xo và con lắc đơn
 * Physics: x = A*cos(ωt + φ), v = -Aω*sin(ωt + φ), a = -Aω²*cos(ωt + φ)
 */

const SimpleHarmonicMotionLab = () => {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, result
  const [mode, setMode] = useState('spring'); // spring, pendulum
  
  // Spring parameters
  const [mass, setMass] = useState(0.5); // kg
  const [springConstant, setSpringConstant] = useState(20); // N/m
  const [amplitude, setAmplitude] = useState(0.15); // m
  const [initialPhase, setInitialPhase] = useState(0); // rad
  
  // Pendulum parameters
  const [length, setLength] = useState(1); // m
  const [gravity, setGravity] = useState(10); // m/s²
  const [pendulumAmplitude, setPendulumAmplitude] = useState(15); // degrees
  
  // Animation state
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Graph data
  const [graphData, setGraphData] = useState({
    displacement: [],
    velocity: [],
    acceleration: []
  });
  const [showGraphs, setShowGraphs] = useState({
    displacement: true,
    velocity: true,
    acceleration: true
  });
  
  // Stats
  const [stats, setStats] = useState({
    experimentsRun: 0,
    perfectPredictions: 0,
    averageError: 0
  });

  // Challenge mode
  const [challengeMode, setChallengeMode] = useState(false);
  const [targetValues, setTargetValues] = useState(null);
  const [userPrediction, setUserPrediction] = useState({ period: '', frequency: '', maxVelocity: '' });
  const [showResult, setShowResult] = useState(false);

  // Calculate physics values
  const calculateSpringOscillation = (t) => {
    const omega = Math.sqrt(springConstant / mass); // ω = √(k/m)
    const period = 2 * Math.PI / omega; // T = 2π/ω
    const frequency = 1 / period; // f = 1/T
    
    const displacement = amplitude * Math.cos(omega * t + initialPhase);
    const velocity = -amplitude * omega * Math.sin(omega * t + initialPhase);
    const acceleration = -amplitude * omega * omega * Math.cos(omega * t + initialPhase);
    const maxVelocity = amplitude * omega;
    const maxAcceleration = amplitude * omega * omega;
    
    return {
      displacement,
      velocity,
      acceleration,
      omega,
      period,
      frequency,
      maxVelocity,
      maxAcceleration
    };
  };

  const calculatePendulumOscillation = (t) => {
    const omega = Math.sqrt(gravity / length); // ω = √(g/L)
    const period = 2 * Math.PI / omega; // T = 2π√(L/g)
    const frequency = 1 / period;
    
    const amplitudeRad = (pendulumAmplitude * Math.PI) / 180;
    const displacement = amplitudeRad * Math.cos(omega * t + initialPhase);
    const velocity = -amplitudeRad * omega * Math.sin(omega * t + initialPhase);
    const acceleration = -amplitudeRad * omega * omega * Math.cos(omega * t + initialPhase);
    const maxVelocity = amplitudeRad * omega;
    const maxAcceleration = amplitudeRad * omega * omega;
    
    return {
      displacement,
      velocity,
      acceleration,
      omega,
      period,
      frequency,
      maxVelocity,
      maxAcceleration
    };
  };

  const getCurrentValues = (t) => {
    return mode === 'spring' ? calculateSpringOscillation(t) : calculatePendulumOscillation(t);
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setTime(prevTime => {
          const newTime = prevTime + 0.016 * timeSpeed; // 16ms * speed
          
          // Update graph data
          const values = getCurrentValues(newTime);
          setGraphData(prev => {
            const maxPoints = 300;
            return {
              displacement: [...prev.displacement, { t: newTime, value: values.displacement }].slice(-maxPoints),
              velocity: [...prev.velocity, { t: newTime, value: values.velocity }].slice(-maxPoints),
              acceleration: [...prev.acceleration, { t: newTime, value: values.acceleration }].slice(-maxPoints)
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
  }, [isPlaying, gameState, timeSpeed, mode, mass, springConstant, amplitude, length, gravity, pendulumAmplitude, initialPhase]);

  // Draw spring visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const values = getCurrentValues(time);
    
    if (mode === 'spring') {
      // Draw spring system
      const centerX = width / 2;
      const topY = 50;
      const scale = 300; // pixels per meter
      const currentPosition = topY + 150 + values.displacement * scale;
      
      // Draw ceiling
      ctx.fillStyle = '#333';
      ctx.fillRect(0, topY, width, 5);
      
      // Draw spring
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const coils = 15;
      const springWidth = 30;
      const springLength = currentPosition - topY - 40;
      
      ctx.moveTo(centerX, topY + 5);
      for (let i = 0; i <= coils; i++) {
        const y = topY + 5 + (springLength * i) / coils;
        const x = centerX + (i % 2 === 0 ? springWidth : -springWidth);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(centerX, currentPosition - 40);
      ctx.stroke();
      
      // Draw mass
      const massSize = 40 + mass * 30;
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(centerX - massSize/2, currentPosition - 40, massSize, massSize);
      
      // Draw mass label
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass} kg`, centerX, currentPosition - 10);
      
      // Draw equilibrium line
      ctx.strokeStyle = '#10B981';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(50, topY + 150);
      ctx.lineTo(width - 50, topY + 150);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw displacement arrow
      if (Math.abs(values.displacement) > 0.01) {
        ctx.strokeStyle = '#F59E0B';
        ctx.fillStyle = '#F59E0B';
        ctx.lineWidth = 2;
        
        const arrowY = topY + 150;
        const arrowEndY = currentPosition - 20;
        
        ctx.beginPath();
        ctx.moveTo(width - 80, arrowY);
        ctx.lineTo(width - 80, arrowEndY);
        ctx.stroke();
        
        // Arrow head
        const direction = values.displacement > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(width - 80, arrowEndY);
        ctx.lineTo(width - 85, arrowEndY - direction * 10);
        ctx.lineTo(width - 75, arrowEndY - direction * 10);
        ctx.closePath();
        ctx.fill();
      }
      
    } else {
      // Draw pendulum
      const pivotX = width / 2;
      const pivotY = 50;
      const scale = 200; // pixels per meter
      const angleRad = values.displacement;
      
      const bobX = pivotX + length * scale * Math.sin(angleRad);
      const bobY = pivotY + length * scale * Math.cos(angleRad);
      
      // Draw ceiling
      ctx.fillStyle = '#333';
      ctx.fillRect(0, pivotY - 5, width, 5);
      
      // Draw pivot
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw string
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      
      // Draw bob
      const bobSize = 20 + mass * 10;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw bob label
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass} kg`, bobX, bobY + 5);
      
      // Draw equilibrium line
      ctx.strokeStyle = '#10B981';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + length * scale + 50);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw angle arc
      if (Math.abs(angleRad) > 0.05) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 40, Math.PI / 2, Math.PI / 2 + angleRad, angleRad < 0);
        ctx.stroke();
      }
    }
    
  }, [time, mode, mass, springConstant, amplitude, length, gravity, pendulumAmplitude, gameState]);

  // Draw graphs
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const graphHeight = height / 3;
    const graphs = [
      { data: graphData.displacement, color: '#3B82F6', label: 'x (m)', show: showGraphs.displacement },
      { data: graphData.velocity, color: '#10B981', label: 'v (m/s)', show: showGraphs.velocity },
      { data: graphData.acceleration, color: '#EF4444', label: 'a (m/s²)', show: showGraphs.acceleration }
    ];
    
    graphs.forEach((graph, index) => {
      if (!graph.show) return;
      
      const startY = index * graphHeight;
      
      // Draw background
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, startY, width, graphHeight);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let i = 0; i <= 4; i++) {
        const y = startY + (graphHeight * i) / 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw center line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.moveTo(0, startY + graphHeight / 2);
      ctx.lineTo(width, startY + graphHeight / 2);
      ctx.stroke();
      
      // Draw graph
      if (graph.data.length > 1) {
        const maxValue = Math.max(...graph.data.map(d => Math.abs(d.value)), 0.1);
        const scale = (graphHeight * 0.4) / maxValue;
        
        ctx.strokeStyle = graph.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const timeRange = 8; // Show last 8 seconds
        const minTime = Math.max(0, time - timeRange);
        
        graph.data.forEach((point, i) => {
          if (point.t < minTime) return;
          
          const x = ((point.t - minTime) / timeRange) * width;
          const y = startY + graphHeight / 2 - point.value * scale;
          
          if (i === 0 || graph.data[i - 1].t < minTime) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }
      
      // Draw label
      ctx.fillStyle = graph.color;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(graph.label, 10, startY + 20);
      
      // Draw current value
      if (graph.data.length > 0) {
        const currentValue = graph.data[graph.data.length - 1].value;
        ctx.fillText(currentValue.toFixed(3), 10, startY + 40);
      }
    });
    
  }, [graphData, showGraphs, time, gameState]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    setGraphData({ displacement: [], velocity: [], acceleration: [] });
    setShowResult(false);
  };

  // Reset simulation
  const resetSimulation = () => {
    setTime(0);
    setIsPlaying(false);
    setGraphData({ displacement: [], velocity: [], acceleration: [] });
    setShowResult(false);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Start challenge
  const startChallenge = () => {
    const values = getCurrentValues(0);
    setTargetValues({
      period: values.period,
      frequency: values.frequency,
      maxVelocity: values.maxVelocity
    });
    setChallengeMode(true);
    setUserPrediction({ period: '', frequency: '', maxVelocity: '' });
    setShowResult(false);
  };

  // Check prediction
  const checkPrediction = () => {
    if (!targetValues) return;
    
    const periodError = Math.abs(parseFloat(userPrediction.period) - targetValues.period) / targetValues.period;
    const frequencyError = Math.abs(parseFloat(userPrediction.frequency) - targetValues.frequency) / targetValues.frequency;
    const velocityError = Math.abs(parseFloat(userPrediction.maxVelocity) - targetValues.maxVelocity) / targetValues.maxVelocity;
    
    const avgError = (periodError + frequencyError + velocityError) / 3;
    const isPerfect = avgError < 0.05;
    
    setStats(prev => ({
      experimentsRun: prev.experimentsRun + 1,
      perfectPredictions: prev.perfectPredictions + (isPerfect ? 1 : 0),
      averageError: (prev.averageError * prev.experimentsRun + avgError * 100) / (prev.experimentsRun + 1)
    }));
    
    setShowResult(true);
  };

  // Return to menu
  const returnToMenu = () => {
    setGameState('menu');
    setIsPlaying(false);
    resetSimulation();
  };

  return (
    <div className="shm-lab-container">
      {/* Menu */}
      {gameState === 'menu' && (
        <div className="shm-menu">
          <div className="shm-menu-content">
            <div className="shm-title">
              <Activity className="shm-title-icon" />
              <h1>Simple Harmonic Motion Lab</h1>
            </div>
            
            <p className="shm-description">
              Khám phá dao động điều hòa qua thí nghiệm với lò xo và con lắc đơn.
              Quan sát đồ thị chuyển động và dự đoán các đại lượng vật lý.
            </p>

            <div className="shm-mode-selector">
              <h3>Chọn chế độ thí nghiệm:</h3>
              <div className="shm-mode-buttons">
                <button
                  className={`shm-mode-btn ${mode === 'spring' ? 'active' : ''}`}
                  onClick={() => setMode('spring')}
                >
                  <Activity />
                  <span>Con lắc lò xo</span>
                </button>
                <button
                  className={`shm-mode-btn ${mode === 'pendulum' ? 'active' : ''}`}
                  onClick={() => setMode('pendulum')}
                >
                  <Activity />
                  <span>Con lắc đơn</span>
                </button>
              </div>
            </div>

            <div className="shm-stats">
              <div className="shm-stat-item">
                <Trophy />
                <div>
                  <div className="shm-stat-value">{stats.experimentsRun}</div>
                  <div className="shm-stat-label">Thí nghiệm</div>
                </div>
              </div>
              <div className="shm-stat-item">
                <Trophy />
                <div>
                  <div className="shm-stat-value">{stats.perfectPredictions}</div>
                  <div className="shm-stat-label">Dự đoán chính xác</div>
                </div>
              </div>
              <div className="shm-stat-item">
                <Trophy />
                <div>
                  <div className="shm-stat-value">{stats.averageError.toFixed(1)}%</div>
                  <div className="shm-stat-label">Sai số trung bình</div>
                </div>
              </div>
            </div>

            <button className="shm-start-btn" onClick={startGame}>
              <Play />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {/* Game */}
      {gameState === 'playing' && (
        <div className="shm-game">
          <div className="shm-header">
            <button className="shm-home-btn" onClick={returnToMenu}>
              <Home />
            </button>
            <h2>{mode === 'spring' ? 'Con lắc lò xo' : 'Con lắc đơn'}</h2>
            <div className="shm-controls">
              <button onClick={togglePlayPause} className="shm-control-btn">
                {isPlaying ? '⏸' : '▶️'}
              </button>
              <button onClick={resetSimulation} className="shm-control-btn">
                <RotateCw />
              </button>
            </div>
          </div>

          <div className="shm-main">
            <div className="shm-left-panel">
              <canvas ref={canvasRef} width={400} height={500} className="shm-canvas" />
              
              <div className="shm-info-panel">
                <h3>Thông số hiện tại</h3>
                {(() => {
                  const values = getCurrentValues(time);
                  return (
                    <div className="shm-values">
                      <div className="shm-value-row">
                        <span>Chu kỳ T:</span>
                        <strong>{values.period.toFixed(3)} s</strong>
                      </div>
                      <div className="shm-value-row">
                        <span>Tần số f:</span>
                        <strong>{values.frequency.toFixed(3)} Hz</strong>
                      </div>
                      <div className="shm-value-row">
                        <span>ω:</span>
                        <strong>{values.omega.toFixed(3)} rad/s</strong>
                      </div>
                      <div className="shm-value-row">
                        <span>v_max:</span>
                        <strong>{values.maxVelocity.toFixed(3)} m/s</strong>
                      </div>
                      <div className="shm-value-row">
                        <span>a_max:</span>
                        <strong>{values.maxAcceleration.toFixed(3)} m/s²</strong>
                      </div>
                      <div className="shm-value-row">
                        <span>Thời gian:</span>
                        <strong>{time.toFixed(2)} s</strong>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="shm-right-panel">
              <div className="shm-parameters">
                <h3><Settings /> Điều chỉnh thông số</h3>
                
                {mode === 'spring' ? (
                  <>
                    <div className="shm-param">
                      <label>Khối lượng m (kg): {mass.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={mass}
                        onChange={(e) => setMass(parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="shm-param">
                      <label>Độ cứng k (N/m): {springConstant.toFixed(0)}</label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={springConstant}
                        onChange={(e) => setSpringConstant(parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="shm-param">
                      <label>Biên độ A (m): {amplitude.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.05"
                        max="0.3"
                        step="0.01"
                        value={amplitude}
                        onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="shm-param">
                      <label>Khối lượng m (kg): {mass.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={mass}
                        onChange={(e) => setMass(parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="shm-param">
                      <label>Chiều dài L (m): {length.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="shm-param">
                      <label>Biên độ góc (°): {pendulumAmplitude.toFixed(0)}</label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={pendulumAmplitude}
                        onChange={(e) => setPendulumAmplitude(parseFloat(e.target.value))}
                      />
                    </div>
                  </>
                )}
                
                <div className="shm-param">
                  <label>Pha ban đầu φ (rad): {initialPhase.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max={Math.PI * 2}
                    step="0.1"
                    value={initialPhase}
                    onChange={(e) => setInitialPhase(parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="shm-param">
                  <label>Tốc độ thời gian: {timeSpeed.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="shm-graph-controls">
                <h3>Hiển thị đồ thị</h3>
                <label>
                  <input
                    type="checkbox"
                    checked={showGraphs.displacement}
                    onChange={(e) => setShowGraphs(prev => ({ ...prev, displacement: e.target.checked }))}
                  />
                  Li độ x(t)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showGraphs.velocity}
                    onChange={(e) => setShowGraphs(prev => ({ ...prev, velocity: e.target.checked }))}
                  />
                  Vận tốc v(t)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showGraphs.acceleration}
                    onChange={(e) => setShowGraphs(prev => ({ ...prev, acceleration: e.target.checked }))}
                  />
                  Gia tốc a(t)
                </label>
              </div>

              <div className="shm-challenge">
                <h3>Thử thách dự đoán</h3>
                {!challengeMode ? (
                  <button className="shm-challenge-btn" onClick={startChallenge}>
                    Bắt đầu thử thách
                  </button>
                ) : (
                  <div className="shm-prediction">
                    <div className="shm-input-group">
                      <label>Chu kỳ T (s):</label>
                      <input
                        type="number"
                        step="0.001"
                        value={userPrediction.period}
                        onChange={(e) => setUserPrediction(prev => ({ ...prev, period: e.target.value }))}
                        placeholder="0.000"
                      />
                    </div>
                    
                    <div className="shm-input-group">
                      <label>Tần số f (Hz):</label>
                      <input
                        type="number"
                        step="0.001"
                        value={userPrediction.frequency}
                        onChange={(e) => setUserPrediction(prev => ({ ...prev, frequency: e.target.value }))}
                        placeholder="0.000"
                      />
                    </div>
                    
                    <div className="shm-input-group">
                      <label>v_max (m/s):</label>
                      <input
                        type="number"
                        step="0.001"
                        value={userPrediction.maxVelocity}
                        onChange={(e) => setUserPrediction(prev => ({ ...prev, maxVelocity: e.target.value }))}
                        placeholder="0.000"
                      />
                    </div>
                    
                    <button className="shm-check-btn" onClick={checkPrediction}>
                      Kiểm tra
                    </button>
                    
                    {showResult && targetValues && (
                      <div className="shm-result">
                        <h4>Kết quả:</h4>
                        <div className="shm-result-row">
                          <span>T thực tế:</span>
                          <strong>{targetValues.period.toFixed(3)} s</strong>
                        </div>
                        <div className="shm-result-row">
                          <span>f thực tế:</span>
                          <strong>{targetValues.frequency.toFixed(3)} Hz</strong>
                        </div>
                        <div className="shm-result-row">
                          <span>v_max thực tế:</span>
                          <strong>{targetValues.maxVelocity.toFixed(3)} m/s</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shm-graphs">
            <canvas ref={graphRef} width={1200} height={300} className="shm-graph-canvas" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleHarmonicMotionLab;
