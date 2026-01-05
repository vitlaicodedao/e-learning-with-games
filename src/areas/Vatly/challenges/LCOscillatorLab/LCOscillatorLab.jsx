import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Activity, Award, Target } from 'lucide-react';
import './LCOscillatorLab.css';

const LCOscillatorLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const graphCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // LC Circuit parameters
  const [inductance, setInductance] = useState(1.0); // Henry
  const [capacitance, setCapacitance] = useState(1.0); // microFarad
  const [initialCharge, setInitialCharge] = useState(10); // microcoulomb
  const [resistance, setResistance] = useState(0); // Ohm (for damping)

  // Physics calculations
  const [frequency, setFrequency] = useState(0); // Hz
  const [period, setPeriod] = useState(0); // s
  const [maxEnergy, setMaxEnergy] = useState(0); // Joules
  const [currentCharge, setCurrentCharge] = useState(0);
  const [currentCurrent, setCurrentCurrent] = useState(0);
  const [electricEnergy, setElectricEnergy] = useState(0);
  const [magneticEnergy, setMagneticEnergy] = useState(0);

  // Challenge system
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Tìm tần số dao động khi L=2H, C=0.5μF', target: 159.15, tolerance: 5, completed: false },
    { id: 2, text: 'Đạt năng lượng tối đa 500μJ với Q₀=10μC', target: 500, tolerance: 50, completed: false },
    { id: 3, text: 'Chu kỳ dao động T=0.01s, tìm tích LC', target: 2.533e-6, tolerance: 0.1e-6, completed: false }
  ]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Graph data
  const [graphData, setGraphData] = useState({
    time: [],
    charge: [],
    current: [],
    electricEnergy: [],
    magneticEnergy: []
  });

  // Calculate physics parameters
  useEffect(() => {
    const L = inductance; // H
    const C = capacitance * 1e-6; // Convert μF to F
    const Q0 = initialCharge * 1e-6; // Convert μC to C
    const R = resistance;

    // Angular frequency: ω = 1/√(LC) for undamped, ω = √(1/LC - R²/4L²) for damped
    let omega;
    if (R === 0) {
      omega = 1 / Math.sqrt(L * C);
    } else {
      const dampingTerm = R * R / (4 * L * L);
      const naturalFreqSquared = 1 / (L * C);
      if (naturalFreqSquared > dampingTerm) {
        omega = Math.sqrt(naturalFreqSquared - dampingTerm);
      } else {
        omega = 0; // Over-damped
      }
    }

    const freq = omega / (2 * Math.PI);
    const T = freq > 0 ? 1 / freq : 0;

    setFrequency(freq);
    setPeriod(T);

    // Max energy: W = Q₀²/(2C)
    const maxE = (Q0 * Q0) / (2 * C);
    setMaxEnergy(maxE);
  }, [inductance, capacitance, initialCharge, resistance]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const animate = () => {
      setTime(t => {
        const newTime = t + 0.016; // ~60fps
        updatePhysics(newTime);
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
  }, [isPlaying, gameState, inductance, capacitance, initialCharge, resistance]);

  // Update physics calculations
  const updatePhysics = (t) => {
    const L = inductance;
    const C = capacitance * 1e-6;
    const Q0 = initialCharge * 1e-6;
    const R = resistance;

    let q, i, wE, wM;

    if (R === 0) {
      // Undamped oscillation
      const omega = 1 / Math.sqrt(L * C);
      q = Q0 * Math.cos(omega * t);
      i = -Q0 * omega * Math.sin(omega * t);
      wE = (q * q) / (2 * C);
      wM = (L * i * i) / 2;
    } else {
      // Damped oscillation
      const gamma = R / (2 * L);
      const omega0Squared = 1 / (L * C);
      const omegaDSquared = omega0Squared - gamma * gamma;

      if (omegaDSquared > 0) {
        const omegaD = Math.sqrt(omegaDSquared);
        const exponentialDecay = Math.exp(-gamma * t);
        q = Q0 * exponentialDecay * Math.cos(omegaD * t);
        i = -Q0 * exponentialDecay * (gamma * Math.cos(omegaD * t) + omegaD * Math.sin(omegaD * t));
        wE = (q * q) / (2 * C);
        wM = (L * i * i) / 2;
      } else {
        // Over-damped
        q = Q0 * Math.exp(-gamma * t);
        i = -Q0 * gamma * Math.exp(-gamma * t);
        wE = (q * q) / (2 * C);
        wM = 0;
      }
    }

    setCurrentCharge(q * 1e6); // Convert to μC
    setCurrentCurrent(i * 1e3); // Convert to mA
    setElectricEnergy(wE * 1e6); // Convert to μJ
    setMagneticEnergy(wM * 1e6); // Convert to μJ

    // Update graph data (keep last 200 points)
    setGraphData(prev => {
      const newData = {
        time: [...prev.time, t].slice(-200),
        charge: [...prev.charge, q * 1e6].slice(-200),
        current: [...prev.current, i * 1e3].slice(-200),
        electricEnergy: [...prev.electricEnergy, wE * 1e6].slice(-200),
        magneticEnergy: [...prev.magneticEnergy, wM * 1e6].slice(-200)
      };
      return newData;
    });
  };

  // Draw LC circuit visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw circuit components
    const centerX = width / 2;
    const centerY = height / 2;
    const circuitRadius = 120;

    // Capacitor (top)
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY - circuitRadius);
    ctx.lineTo(centerX + 30, centerY - circuitRadius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY - circuitRadius - 15);
    ctx.lineTo(centerX + 30, centerY - circuitRadius - 15);
    ctx.stroke();

    // Inductor (bottom) - draw coil
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    const coilY = centerY + circuitRadius;
    const coilWidth = 60;
    const coilLoops = 5;
    for (let i = 0; i < coilLoops; i++) {
      const x = centerX - coilWidth/2 + (i * coilWidth/(coilLoops-1));
      ctx.beginPath();
      ctx.arc(x, coilY, 8, Math.PI, 0, false);
      ctx.stroke();
    }

    // Connecting wires
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    // Left wire
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY - circuitRadius);
    ctx.lineTo(centerX - circuitRadius, centerY - circuitRadius);
    ctx.lineTo(centerX - circuitRadius, centerY + circuitRadius);
    ctx.lineTo(centerX - coilWidth/2, coilY);
    ctx.stroke();
    // Right wire
    ctx.beginPath();
    ctx.moveTo(centerX + 30, centerY - circuitRadius);
    ctx.lineTo(centerX + circuitRadius, centerY - circuitRadius);
    ctx.lineTo(centerX + circuitRadius, centerY + circuitRadius);
    ctx.lineTo(centerX + coilWidth/2, coilY);
    ctx.stroke();

    // Draw charge flow animation
    if (isPlaying) {
      const flowSpeed = Math.abs(currentCurrent) / 10;
      const numParticles = Math.floor(flowSpeed) + 3;
      
      for (let i = 0; i < numParticles; i++) {
        const t = (time * 5 + i / numParticles) % 1;
        let x, y;
        
        if (currentCurrent > 0) {
          // Clockwise
          if (t < 0.25) {
            x = centerX + 30 + (circuitRadius - 30) * (t * 4);
            y = centerY - circuitRadius;
          } else if (t < 0.5) {
            x = centerX + circuitRadius;
            y = centerY - circuitRadius + (2 * circuitRadius) * ((t - 0.25) * 4);
          } else if (t < 0.75) {
            x = centerX + circuitRadius - (2 * circuitRadius) * ((t - 0.5) * 4);
            y = centerY + circuitRadius;
          } else {
            x = centerX - circuitRadius;
            y = centerY + circuitRadius - (2 * circuitRadius) * ((t - 0.75) * 4);
          }
        } else {
          // Counter-clockwise
          const tRev = 1 - t;
          if (tRev < 0.25) {
            x = centerX + 30 + (circuitRadius - 30) * (tRev * 4);
            y = centerY - circuitRadius;
          } else if (tRev < 0.5) {
            x = centerX + circuitRadius;
            y = centerY - circuitRadius + (2 * circuitRadius) * ((tRev - 0.25) * 4);
          } else if (tRev < 0.75) {
            x = centerX + circuitRadius - (2 * circuitRadius) * ((tRev - 0.5) * 4);
            y = centerY + circuitRadius;
          } else {
            x = centerX - circuitRadius;
            y = centerY + circuitRadius - (2 * circuitRadius) * ((tRev - 0.75) * 4);
          }
        }

        ctx.fillStyle = currentCurrent > 0 ? '#fbbf24' : '#f87171';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('C', centerX, centerY - circuitRadius - 30);
    ctx.fillText('L', centerX, centerY + circuitRadius + 30);

    // Current charge display
    ctx.font = '14px Arial';
    ctx.fillStyle = currentCharge > 0 ? '#60a5fa' : '#f87171';
    ctx.fillText(`Q = ${currentCharge.toFixed(2)} μC`, centerX, centerY - circuitRadius + 20);

    // Current display
    ctx.fillStyle = '#34d399';
    ctx.fillText(`I = ${currentCurrent.toFixed(2)} mA`, centerX, centerY + circuitRadius - 20);

  }, [time, currentCharge, currentCurrent, isPlaying]);

  // Draw energy graphs
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || graphData.time.length < 2) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Find max values for scaling
    const maxE = Math.max(...graphData.electricEnergy, ...graphData.magneticEnergy, 0.1);
    const maxI = Math.max(...graphData.current.map(Math.abs), 0.1);

    // Draw electric energy (blue)
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    graphData.electricEnergy.forEach((e, i) => {
      const x = (i / graphData.electricEnergy.length) * width;
      const y = height - (e / maxE) * height * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw magnetic energy (green)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    graphData.magneticEnergy.forEach((e, i) => {
      const x = (i / graphData.magneticEnergy.length) * width;
      const y = height - (e / maxE) * height * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw total energy (yellow)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    graphData.electricEnergy.forEach((e, i) => {
      const totalE = e + graphData.magneticEnergy[i];
      const x = (i / graphData.electricEnergy.length) * width;
      const y = height - (totalE / maxE) * height * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.font = '12px Arial';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('WE (Điện)', 10, 20);
    ctx.fillStyle = '#34d399';
    ctx.fillText('WM (Từ)', 90, 20);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Tổng', 170, 20);

  }, [graphData]);

  // Check challenges
  useEffect(() => {
    if (gameState !== 'playing') return;

    const challenge = challenges[currentChallenge];
    if (!challenge || challenge.completed) return;

    let achieved = false;
    let value = 0;

    if (challenge.id === 1) {
      value = frequency;
      achieved = Math.abs(value - challenge.target) <= challenge.tolerance;
    } else if (challenge.id === 2) {
      value = maxEnergy * 1e6;
      achieved = Math.abs(value - challenge.target) <= challenge.tolerance;
    } else if (challenge.id === 3) {
      value = inductance * capacitance * 1e-6;
      achieved = Math.abs(value - challenge.target) <= challenge.tolerance;
    }

    if (achieved) {
      const newChallenges = [...challenges];
      newChallenges[currentChallenge].completed = true;
      setChallenges(newChallenges);
      setScore(prev => prev + 100);
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => setCurrentChallenge(prev => prev + 1), 1000);
      } else {
        setTimeout(() => finishGame(), 2000);
      }
    }
  }, [frequency, maxEnergy, inductance, capacitance, currentChallenge, gameState]);

  const startGame = () => {
    setGameState('playing');
    setIsPlaying(false);
    setTime(0);
    setScore(0);
    setCurrentChallenge(0);
    setChallenges(challenges.map(c => ({ ...c, completed: false })));
    setGraphData({ time: [], charge: [], current: [], electricEnergy: [], magneticEnergy: [] });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSimulation = () => {
    setTime(0);
    setIsPlaying(false);
    setGraphData({ time: [], charge: [], current: [], electricEnergy: [], magneticEnergy: [] });
  };

  const finishGame = () => {
    setIsPlaying(false);
    setGameState('result');
    const completedCount = challenges.filter(c => c.completed).length;
    const finalScore = score + (completedCount * 50);
    setScore(finalScore);
  };

  return (
    <div className="lc-oscillator-container">
      {/* Header */}
      <div className="lc-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="lc-title">
          <Zap className="title-icon" />
          LC Oscillator Lab
        </h1>
        <div className="score-display">
          <Award size={20} />
          <span>{score}</span>
        </div>
      </div>

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Activity size={80} className="menu-icon" />
            <h2>Phòng Thí Nghiệm Dao Động Điện Từ</h2>
            <p className="menu-description">
              Khám phá dao động điện từ trong mạch LC. Điều chỉnh các thông số L, C để đạt được
              các mục tiêu về tần số dao động và năng lượng. Quan sát sự chuyển hóa năng lượng
              giữa điện trường (tụ điện) và từ trường (cuộn cảm).
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Zap size={24} />
                <span>Mô phỏng dao động điện từ</span>
              </div>
              <div className="feature-item">
                <Activity size={24} />
                <span>Đồ thị năng lượng thời gian thực</span>
              </div>
              <div className="feature-item">
                <Target size={24} />
                <span>3 thử thách vật lý</span>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              <Play size={24} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="main-content">
            {/* Left Panel - Circuit Visualization */}
            <div className="circuit-panel">
              <h3>Mạch Dao Động LC</h3>
              <canvas ref={canvasRef} width={400} height={400} className="circuit-canvas" />
              
              <div className="control-buttons">
                <button onClick={togglePlayPause} className="control-btn">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Tạm dừng' : 'Chạy'}
                </button>
                <button onClick={resetSimulation} className="control-btn">
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>

              <div className="info-display">
                <div className="info-row">
                  <span>Tần số:</span>
                  <strong>{frequency.toFixed(2)} Hz</strong>
                </div>
                <div className="info-row">
                  <span>Chu kỳ:</span>
                  <strong>{period.toFixed(4)} s</strong>
                </div>
                <div className="info-row">
                  <span>Năng lượng max:</span>
                  <strong>{(maxEnergy * 1e6).toFixed(2)} μJ</strong>
                </div>
              </div>
            </div>

            {/* Right Panel - Controls & Graphs */}
            <div className="right-panel">
              {/* Parameters */}
              <div className="parameters-panel">
                <h3>Thông Số Mạch</h3>
                
                <div className="parameter-control">
                  <label>Độ tự cảm L: {inductance.toFixed(2)} H</label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={inductance}
                    onChange={(e) => setInductance(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="parameter-control">
                  <label>Điện dung C: {capacitance.toFixed(2)} μF</label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={capacitance}
                    onChange={(e) => setCapacitance(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="parameter-control">
                  <label>Điện tích ban đầu Q₀: {initialCharge.toFixed(1)} μC</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={initialCharge}
                    onChange={(e) => setInitialCharge(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="parameter-control">
                  <label>Điện trở R (cản): {resistance.toFixed(1)} Ω</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={resistance}
                    onChange={(e) => setResistance(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>

              {/* Energy Graph */}
              <div className="graph-panel">
                <h3>Đồ Thị Năng Lượng</h3>
                <canvas ref={graphCanvasRef} width={400} height={200} className="graph-canvas" />
                <div className="energy-values">
                  <div className="energy-item electric">
                    WE: {electricEnergy.toFixed(2)} μJ
                  </div>
                  <div className="energy-item magnetic">
                    WM: {magneticEnergy.toFixed(2)} μJ
                  </div>
                  <div className="energy-item total">
                    Tổng: {(electricEnergy + magneticEnergy).toFixed(2)} μJ
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div className="challenge-panel">
                <h3>
                  <Target size={20} />
                  Thử thách {currentChallenge + 1}/3
                </h3>
                {challenges[currentChallenge] && (
                  <div className={`challenge-item ${challenges[currentChallenge].completed ? 'completed' : ''}`}>
                    <p>{challenges[currentChallenge].text}</p>
                    {challenges[currentChallenge].completed && (
                      <span className="completed-badge">✓ Hoàn thành +100</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {gameState === 'result' && (
        <div className="result-screen">
          <div className="result-content">
            <Award size={100} className="result-icon" />
            <h2>Hoàn Thành Thí Nghiệm!</h2>
            <div className="result-score">
              <span className="score-label">Điểm số:</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="result-stats">
              <div className="stat-item">
                <span>Thử thách hoàn thành:</span>
                <strong>{challenges.filter(c => c.completed).length}/3</strong>
              </div>
              <div className="stat-item">
                <span>Tần số cuối:</span>
                <strong>{frequency.toFixed(2)} Hz</strong>
              </div>
            </div>
            <div className="result-buttons">
              <button onClick={startGame} className="retry-button">
                <RotateCcw size={20} />
                Thử lại
              </button>
              <button onClick={() => navigate(-1)} className="home-button">
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LCOscillatorLab;
