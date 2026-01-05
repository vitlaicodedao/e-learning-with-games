import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Radio, Zap, TrendingUp } from 'lucide-react';
import './ACCircuitSimulator.css';

/**
 * AC Circuit Simulator - Grade 11 Chapter 4: Magnetism & EM Induction
 * Game về mạch điện xoay chiều RLC
 * Physics: Z = √(R² + (XL - XC)²), cosφ = R/Z, resonance at XL = XC
 */

const ACCircuitSimulator = () => {
  const canvasRef = useRef(null);
  const phasorRef = useRef(null);
  const frequencyResponseRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  
  // Circuit components
  const [resistance, setResistance] = useState(100); // Ω
  const [inductance, setInductance] = useState(0.1); // H
  const [capacitance, setCapacitance] = useState(10e-6); // F (10µF)
  const [voltage, setVoltage] = useState(220); // V
  const [frequency, setFrequency] = useState(50); // Hz
  
  // Calculated values
  const [impedance, setImpedance] = useState(0);
  const [current, setCurrent] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0);
  const [apparentPower, setApparentPower] = useState(0);
  const [activePower, setActivePower] = useState(0);
  const [reactivePower, setReactivePower] = useState(0);
  const [phaseAngle, setPhaseAngle] = useState(0);
  const [XL, setXL] = useState(0);
  const [XC, setXC] = useState(0);
  
  // Animation
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [resonancesFound, setResonancesFound] = useState(0);
  
  // Challenge
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  // Frequency sweep data
  const [sweepData, setSweepData] = useState([]);

  // Calculate circuit values
  useEffect(() => {
    const omega = 2 * Math.PI * frequency;
    
    // Reactances
    const XL_val = omega * inductance;
    const XC_val = 1 / (omega * capacitance);
    
    setXL(XL_val);
    setXC(XC_val);
    
    // Impedance: Z = √(R² + (XL - XC)²)
    const X = XL_val - XC_val;
    const Z = Math.sqrt(resistance * resistance + X * X);
    setImpedance(Z);
    
    // Current: I = V / Z
    const I = voltage / Z;
    setCurrent(I);
    
    // Phase angle: φ = arctan((XL - XC) / R)
    const phi = Math.atan2(X, resistance);
    setPhaseAngle(phi);
    
    // Power factor: cosφ = R / Z
    const cosPhi = resistance / Z;
    setPowerFactor(cosPhi);
    
    // Powers
    const S = voltage * I; // Apparent power
    const P = S * cosPhi; // Active power
    const Q = S * Math.sin(phi); // Reactive power
    
    setApparentPower(S);
    setActivePower(P);
    setReactivePower(Q);
    
  }, [resistance, inductance, capacitance, voltage, frequency]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setTime(prev => prev + 0.016 * timeSpeed);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, gameState, timeSpeed]);

  // Draw circuit diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw circuit loop
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(100, 100, 500, 250);
    ctx.stroke();
    
    // AC Source
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(150, 225, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 225, 40, 0, Math.PI * 2);
    ctx.stroke();
    
    // AC symbol (sine wave)
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -20; x <= 20; x++) {
      const y = Math.sin(x / 5) * 15;
      if (x === -20) {
        ctx.moveTo(150 + x, 225 + y);
      } else {
        ctx.lineTo(150 + x, 225 + y);
      }
    }
    ctx.stroke();
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, 150, 280);
    ctx.fillText(`${frequency}Hz`, 150, 295);
    
    // Resistor R
    const rX = 350;
    const rY = 100;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rX - 40, rY);
    for (let i = 0; i < 8; i++) {
      ctx.lineTo(rX - 40 + i * 10, rY + (i % 2 === 0 ? 15 : -15));
    }
    ctx.lineTo(rX + 40, rY);
    ctx.stroke();
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('R', rX, rY - 25);
    ctx.fillText(`${resistance}Ω`, rX, rY - 10);
    
    // Inductor L
    const lX = 500;
    const lY = 225;
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(lX - 50 + i * 20, lY, 10, Math.PI, 0, false);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('L', lX, lY + 35);
    ctx.fillText(`${(inductance * 1000).toFixed(1)}mH`, lX, lY + 50);
    
    // Capacitor C
    const cX = 350;
    const cY = 350;
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cX - 30, cY - 20);
    ctx.lineTo(cX - 30, cY + 20);
    ctx.moveTo(cX + 30, cY - 20);
    ctx.lineTo(cX + 30, cY + 20);
    ctx.stroke();
    
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cX - 50, cY);
    ctx.lineTo(cX - 30, cY);
    ctx.moveTo(cX + 30, cY);
    ctx.lineTo(cX + 50, cY);
    ctx.stroke();
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('C', cX, cY + 45);
    ctx.fillText(`${(capacitance * 1e6).toFixed(1)}µF`, cX, cY + 60);
    
    // Current flow animation
    if (isPlaying) {
      const omega = 2 * Math.PI * frequency;
      const currentValue = current * Math.sin(omega * time);
      const electronSpeed = Math.abs(currentValue) * 2;
      
      // Draw current arrows
      const arrowPositions = [
        {x: 250, y: 100},
        {x: 600, y: 150},
        {x: 600, y: 300},
        {x: 250, y: 350}
      ];
      
      arrowPositions.forEach(pos => {
        ctx.fillStyle = currentValue > 0 ? '#FCD34D' : '#FCA5A5';
        ctx.beginPath();
        ctx.arc(pos.x + (time * electronSpeed * 50) % 100, pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 200);
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Thông số mạch RLC:', 20, 30);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(`Z: ${impedance.toFixed(2)} Ω`, 20, 50);
    ctx.fillText(`I: ${current.toFixed(3)} A`, 20, 70);
    ctx.fillText(`XL: ${XL.toFixed(2)} Ω`, 20, 90);
    ctx.fillText(`XC: ${XC.toFixed(2)} Ω`, 20, 110);
    ctx.fillText(`φ: ${((phaseAngle * 180) / Math.PI).toFixed(1)}°`, 20, 130);
    ctx.fillText(`cosφ: ${powerFactor.toFixed(3)}`, 20, 150);
    ctx.fillText(`P: ${activePower.toFixed(1)} W`, 20, 170);
    
    // Resonance indicator
    const isResonance = Math.abs(XL - XC) < 1;
    if (isResonance) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ CỘNG HƯỞNG!', width / 2, 30);
    }
    
  }, [time, resistance, inductance, capacitance, voltage, frequency, impedance, current, XL, XC, phaseAngle, powerFactor, activePower, isPlaying, gameState]);

  // Draw phasor diagram
  useEffect(() => {
    const canvas = phasorRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 2;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Voltage phasor (reference)
    const VL = voltage * scale;
    ctx.strokeStyle = '#10B981';
    ctx.fillStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + VL, centerY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(centerX + VL, centerY);
    ctx.lineTo(centerX + VL - 10, centerY - 5);
    ctx.lineTo(centerX + VL - 10, centerY + 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.font = 'bold 14px Arial';
    ctx.fillText('V', centerX + VL + 10, centerY + 5);
    
    // Current phasor
    const IL = current * scale * 50;
    const phi = phaseAngle;
    const Ix = IL * Math.cos(phi);
    const Iy = -IL * Math.sin(phi);
    
    ctx.strokeStyle = '#3B82F6';
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Ix, centerY + Iy);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + Ix, centerY + Iy);
    ctx.lineTo(centerX + Ix - 10 * Math.cos(phi + 0.3), centerY + Iy - 10 * Math.sin(phi + 0.3));
    ctx.lineTo(centerX + Ix - 10 * Math.cos(phi - 0.3), centerY + Iy - 10 * Math.sin(phi - 0.3));
    ctx.closePath();
    ctx.fill();
    
    ctx.font = 'bold 14px Arial';
    ctx.fillText('I', centerX + Ix + 10, centerY + Iy);
    
    // Phase angle arc
    if (Math.abs(phi) > 0.05) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, -phi, phi < 0);
      ctx.stroke();
      
      ctx.fillStyle = '#F59E0B';
      ctx.font = '12px Arial';
      ctx.fillText(`φ=${((phi * 180) / Math.PI).toFixed(0)}°`, centerX + 50, centerY + 20);
    }
    
    // Labels
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Giản đồ Fresnel', width / 2, 20);
    
  }, [voltage, current, phaseAngle, gameState]);

  // Draw frequency response
  const updateFrequencyResponse = () => {
    const data = [];
    for (let f = 1; f <= 200; f += 2) {
      const omega = 2 * Math.PI * f;
      const XL_val = omega * inductance;
      const XC_val = 1 / (omega * capacitance);
      const Z = Math.sqrt(resistance * resistance + Math.pow(XL_val - XC_val, 2));
      const I = voltage / Z;
      data.push({ frequency: f, current: I, impedance: Z });
    }
    setSweepData(data);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      updateFrequencyResponse();
    }
  }, [inductance, capacitance, resistance, voltage, gameState]);

  useEffect(() => {
    const canvas = frequencyResponseRef.current;
    if (!canvas || sweepData.length === 0 || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    const maxI = Math.max(...sweepData.map(d => d.current));
    const scale = (height - 40) / maxI;
    
    // Draw current curve
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    sweepData.forEach((d, i) => {
      const x = 20 + (i / sweepData.length) * (width - 40);
      const y = height - 20 - d.current * scale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw current frequency marker
    const currentFreqIndex = sweepData.findIndex(d => Math.abs(d.frequency - frequency) < 2);
    if (currentFreqIndex !== -1) {
      const x = 20 + (currentFreqIndex / sweepData.length) * (width - 40);
      const y = height - 20 - sweepData[currentFreqIndex].current * scale;
      
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(width - 20, height - 20);
    ctx.moveTo(20, 20);
    ctx.lineTo(20, height - 20);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tần số (Hz)', width / 2, height - 5);
    
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Dòng điện (A)', 0, 0);
    ctx.restore();
    
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Đường cong cộng hưởng', width / 2, 15);
    
  }, [sweepData, frequency, gameState]);

  // Generate challenge
  const generateChallenge = () => {
    const challenges = [
      {
        question: `Tổng trở của mạch RLC là bao nhiêu? (Ω)`,
        answer: impedance,
        tolerance: 0.1
      },
      {
        question: `Dòng điện hiệu dụng trong mạch là bao nhiêu? (A)`,
        answer: current,
        tolerance: 0.05
      },
      {
        question: `Hệ số công suất cosφ là bao nhiêu?`,
        answer: powerFactor,
        tolerance: 0.05
      },
      {
        question: `Công suất tiêu thụ của mạch là bao nhiêu? (W)`,
        answer: activePower,
        tolerance: 0.1
      },
      {
        question: `Góc lệch pha giữa U và I là bao nhiêu? (độ)`,
        answer: (phaseAngle * 180) / Math.PI,
        tolerance: 5
      }
    ];
    
    // Resonance frequency challenge
    const f0 = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
    challenges.push({
      question: `Tần số cộng hưởng của mạch này là bao nhiêu? (Hz)`,
      answer: f0,
      tolerance: 0.1
    });
    
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
      setScore(score + 200);
      setChallengesSolved(challengesSolved + 1);
      setResultMessage('Xuất sắc! +200 điểm');
      
      // Check if found resonance
      if (challenge.question.includes('cộng hưởng')) {
        setResonancesFound(resonancesFound + 1);
      }
    } else {
      setResultMessage(`Đáp án đúng: ${challenge.answer.toFixed(3)}`);
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

  // Find resonance frequency
  const findResonance = () => {
    const f0 = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
    setFrequency(parseFloat(f0.toFixed(2)));
  };

  return (
    <div className="acs-container">
      {gameState === 'menu' && (
        <div className="acs-menu">
          <div className="acs-menu-content">
            <div className="acs-title">
              <Radio className="acs-title-icon" />
              <h1>AC Circuit Simulator</h1>
            </div>
            
            <p className="acs-description">
              Mô phỏng mạch điện xoay chiều RLC phức tạp.
              Tìm hiểu về tổng trở, hệ số công suất và hiện tượng cộng hưởng điện.
            </p>

            <div className="acs-stats">
              <div className="acs-stat">
                <Trophy />
                <div>
                  <div className="acs-stat-value">{score}</div>
                  <div className="acs-stat-label">Điểm</div>
                </div>
              </div>
              <div className="acs-stat">
                <Zap />
                <div>
                  <div className="acs-stat-value">{challengesSolved}</div>
                  <div className="acs-stat-label">Thử thách</div>
                </div>
              </div>
              <div className="acs-stat">
                <TrendingUp />
                <div>
                  <div className="acs-stat-value">{resonancesFound}</div>
                  <div className="acs-stat-label">Cộng hưởng</div>
                </div>
              </div>
            </div>

            <button className="acs-start-btn" onClick={startGame}>
              <Play />
              Bắt đầu mô phỏng
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="acs-game">
          <div className="acs-header">
            <button className="acs-home-btn" onClick={returnToMenu}>
              <Home />
            </button>
            <h2>Mạch RLC xoay chiều</h2>
            <div className="acs-score-display">
              <Trophy />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="acs-main">
            <div className="acs-left">
              <canvas ref={canvasRef} width={650} height={450} className="acs-canvas" />
              
              <div className="acs-diagrams">
                <div className="acs-diagram-box">
                  <canvas ref={phasorRef} width={320} height={200} />
                </div>
                <div className="acs-diagram-box">
                  <canvas ref={frequencyResponseRef} width={320} height={200} />
                </div>
              </div>
              
              <div className="acs-controls">
                <button onClick={togglePlay} className="acs-control-btn">
                  {isPlaying ? '⏸ Tạm dừng' : '▶️ Chạy'}
                </button>
                <button onClick={reset} className="acs-control-btn">
                  <RotateCw /> Đặt lại
                </button>
                <button onClick={findResonance} className="acs-control-btn resonance">
                  ⚡ Tìm cộng hưởng
                </button>
              </div>
            </div>

            <div className="acs-right">
              <div className="acs-parameters">
                <h3>Thành phần mạch</h3>
                
                <div className="acs-param">
                  <label>Hiệu điện thế: {voltage}V</label>
                  <input type="range" min="100" max="380" step="10" value={voltage}
                    onChange={(e) => setVoltage(parseFloat(e.target.value))} />
                </div>
                
                <div className="acs-param">
                  <label>Tần số: {frequency}Hz</label>
                  <input type="range" min="1" max="200" step="1" value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))} />
                </div>
                
                <div className="acs-param">
                  <label>Điện trở R: {resistance}Ω</label>
                  <input type="range" min="10" max="500" step="10" value={resistance}
                    onChange={(e) => setResistance(parseFloat(e.target.value))} />
                </div>
                
                <div className="acs-param">
                  <label>Độ tự cảm L: {(inductance * 1000).toFixed(1)}mH</label>
                  <input type="range" min="0.01" max="1" step="0.01" value={inductance}
                    onChange={(e) => setInductance(parseFloat(e.target.value))} />
                </div>
                
                <div className="acs-param">
                  <label>Điện dung C: {(capacitance * 1e6).toFixed(1)}µF</label>
                  <input type="range" min="1" max="100" step="1" value={capacitance * 1e6}
                    onChange={(e) => setCapacitance(parseFloat(e.target.value) * 1e-6)} />
                </div>
              </div>

              <div className="acs-info">
                <h3>Đại lượng tính toán</h3>
                <div className="acs-info-grid">
                  <div className="acs-info-item">
                    <span>Tổng trở Z:</span>
                    <strong>{impedance.toFixed(2)} Ω</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Dòng điện I:</span>
                    <strong>{current.toFixed(3)} A</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Cảm kháng XL:</span>
                    <strong>{XL.toFixed(2)} Ω</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Dung kháng XC:</span>
                    <strong>{XC.toFixed(2)} Ω</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Góc lệch pha φ:</span>
                    <strong>{((phaseAngle * 180) / Math.PI).toFixed(1)}°</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Hệ số công suất:</span>
                    <strong>{powerFactor.toFixed(3)}</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Công suất P:</span>
                    <strong>{activePower.toFixed(1)} W</strong>
                  </div>
                  <div className="acs-info-item">
                    <span>Công suất phản kháng:</span>
                    <strong>{reactivePower.toFixed(1)} VAR</strong>
                  </div>
                </div>
              </div>

              {challenge && (
                <div className="acs-challenge">
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
                    <div className={`acs-result ${resultMessage.includes('Xuất sắc') ? 'correct' : 'wrong'}`}>
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

export default ACCircuitSimulator;
