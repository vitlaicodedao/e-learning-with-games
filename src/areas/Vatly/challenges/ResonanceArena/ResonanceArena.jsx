import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Radio, AlertTriangle } from 'lucide-react';
import './ResonanceArena.css';

/**
 * Resonance Arena - Grade 11 Chapter 1: Oscillations
 * Game về cộng hưởng và dao động cưỡng bức
 * Physics: A = F₀/(m√((ω₀²-ω²)² + (2γω)²))
 */

const ResonanceArena = () => {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  
  // Physics parameters
  const [mass, setMass] = useState(1); // kg
  const [springConstant, setSpringConstant] = useState(100); // N/m
  const [dampingCoeff, setDampingCoeff] = useState(0.5); // kg/s
  const [drivingForce, setDrivingForce] = useState(10); // N
  const [drivingFrequency, setDrivingFrequency] = useState(5); // rad/s
  
  // Animation
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [bridgesDestroyed, setBridgesDestroyed] = useState(0);
  const [perfectResonances, setPerfectResonances] = useState(0);
  
  // Challenge
  const [challenge, setChallenge] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  // Amplitude history
  const [amplitudeHistory, setAmplitudeHistory] = useState([]);
  
  // Frequency sweep
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepData, setSweepData] = useState([]);

  // Calculate natural frequency
  const omega0 = Math.sqrt(springConstant / mass);
  const naturalFrequency = omega0 / (2 * Math.PI);
  const gamma = dampingCoeff / (2 * mass);
  
  // Calculate driven oscillation
  const calculateDrivenOscillation = (t, omega) => {
    // Amplitude of steady-state forced oscillation
    const denominator = Math.sqrt(
      Math.pow(omega0 * omega0 - omega * omega, 2) + 
      Math.pow(2 * gamma * omega, 2)
    );
    const amplitude = drivingForce / (mass * denominator);
    
    // Phase lag
    const delta = Math.atan2(2 * gamma * omega, omega0 * omega0 - omega * omega);
    
    // Displacement
    const x = amplitude * Math.cos(omega * t - delta);
    const v = -amplitude * omega * Math.sin(omega * t - delta);
    
    return { x, v, amplitude, delta };
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setTime(prevTime => {
          const newTime = prevTime + 0.016 * timeSpeed;
          
          // Update amplitude history
          const values = calculateDrivenOscillation(newTime, drivingFrequency);
          setAmplitudeHistory(prev => {
            const maxPoints = 500;
            return [...prev, { t: newTime, x: values.x, amplitude: values.amplitude }].slice(-maxPoints);
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
  }, [isPlaying, gameState, timeSpeed, mass, springConstant, dampingCoeff, drivingForce, drivingFrequency]);

  // Draw system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const values = calculateDrivenOscillation(time, drivingFrequency);
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 200;
    
    // Draw external force indicator
    const forceAngle = drivingFrequency * time;
    const forceRadius = 80;
    const forceX = centerX - 200 + forceRadius * Math.cos(forceAngle);
    const forceY = centerY + forceRadius * Math.sin(forceAngle);
    
    // Force source
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(centerX - 200, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX - 200, centerY, forceRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#A78BFA';
    ctx.beginPath();
    ctx.arc(forceX, forceY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Connection line (driving force)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(forceX, forceY);
    ctx.lineTo(centerX - 100, centerY);
    ctx.stroke();
    
    // Oscillating system
    const displacement = values.x * scale;
    const systemX = centerX + displacement;
    
    // Draw spring (left side)
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const coils = 20;
    const springWidth = 20;
    const springLength = systemX - (centerX - 100);
    const coilWidth = springLength / coils;
    
    let x = centerX - 100;
    ctx.moveTo(x, centerY);
    
    for (let i = 0; i < coils; i++) {
      x += coilWidth / 2;
      ctx.lineTo(x, centerY + (i % 2 === 0 ? springWidth : -springWidth));
      x += coilWidth / 2;
      ctx.lineTo(x, centerY);
    }
    ctx.stroke();
    
    // Draw mass
    const massSize = 50 + mass * 10;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(systemX - massSize/2 + 5, centerY - massSize/2 + 5, massSize, massSize);
    
    // Body
    const gradient = ctx.createLinearGradient(systemX - massSize/2, centerY - massSize/2, systemX + massSize/2, centerY + massSize/2);
    gradient.addColorStop(0, '#EF4444');
    gradient.addColorStop(1, '#DC2626');
    ctx.fillStyle = gradient;
    ctx.fillRect(systemX - massSize/2, centerY - massSize/2, massSize, massSize);
    
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 2;
    ctx.strokeRect(systemX - massSize/2, centerY - massSize/2, massSize, massSize);
    
    // Mass label
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, systemX, centerY + 5);
    
    // Draw damper
    if (dampingCoeff > 0) {
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(systemX, centerY + massSize/2 + 10);
      ctx.lineTo(systemX, centerY + massSize/2 + 40);
      ctx.stroke();
      
      ctx.fillStyle = '#475569';
      ctx.fillRect(systemX - 20, centerY + massSize/2 + 30, 40, 20);
      
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(systemX - 20, centerY + massSize/2 + 30, 40, 20);
    }
    
    // Draw equilibrium line
    ctx.strokeStyle = '#10B981';
    ctx.setLineDash([8, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX, height - 50);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw amplitude indicator
    if (values.amplitude > 0.01) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      
      // Max displacement lines
      ctx.beginPath();
      ctx.moveTo(centerX + values.amplitude * scale, 60);
      ctx.lineTo(centerX + values.amplitude * scale, height - 60);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - values.amplitude * scale, 60);
      ctx.lineTo(centerX - values.amplitude * scale, height - 60);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Amplitude arrow
      ctx.strokeStyle = '#F59E0B';
      ctx.fillStyle = '#F59E0B';
      ctx.lineWidth = 2;
      
      const arrowY = 70;
      ctx.beginPath();
      ctx.moveTo(centerX, arrowY);
      ctx.lineTo(centerX + values.amplitude * scale, arrowY);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(centerX + values.amplitude * scale, arrowY);
      ctx.lineTo(centerX + values.amplitude * scale - 10, arrowY - 5);
      ctx.lineTo(centerX + values.amplitude * scale - 10, arrowY + 5);
      ctx.closePath();
      ctx.fill();
      
      // Amplitude label
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`A = ${values.amplitude.toFixed(3)} m`, centerX + values.amplitude * scale / 2, arrowY - 10);
    }
    
    // Draw resonance warning
    const resonanceRatio = drivingFrequency / omega0;
    if (resonanceRatio > 0.9 && resonanceRatio < 1.1 && values.amplitude > 0.5) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ CỘNG HƯỞNG!', width / 2, 30);
    }
    
  }, [time, mass, springConstant, dampingCoeff, drivingForce, drivingFrequency, gameState]);

  // Draw graphs
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw oscillation
    if (amplitudeHistory.length > 1) {
      const timeRange = 8;
      const minTime = Math.max(0, time - timeRange);
      const maxAmplitude = Math.max(...amplitudeHistory.map(d => Math.abs(d.x)), 0.1);
      const scale = (height * 0.4) / maxAmplitude;
      
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let started = false;
      amplitudeHistory.forEach((point) => {
        if (point.t < minTime) return;
        
        const x = ((point.t - minTime) / timeRange) * width;
        const y = height / 2 - point.x * scale;
        
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw envelope
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      
      ctx.beginPath();
      started = false;
      amplitudeHistory.forEach((point) => {
        if (point.t < minTime) return;
        
        const x = ((point.t - minTime) / timeRange) * width;
        const y = height / 2 - point.amplitude * scale;
        
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      ctx.beginPath();
      started = false;
      amplitudeHistory.forEach((point) => {
        if (point.t < minTime) return;
        
        const x = ((point.t - minTime) / timeRange) * width;
        const y = height / 2 + point.amplitude * scale;
        
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
    
    // Labels
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Li độ x(t)', 10, 20);
    
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('Biên độ A', 10, 40);
    
  }, [amplitudeHistory, time, gameState]);

  // Frequency sweep
  const performFrequencySweep = () => {
    setIsSweeping(true);
    const sweepResults = [];
    
    for (let freq = 0.1; freq <= omega0 * 2; freq += 0.2) {
      const values = calculateDrivenOscillation(100, freq);
      sweepResults.push({ frequency: freq / (2 * Math.PI), amplitude: values.amplitude });
    }
    
    setSweepData(sweepResults);
    setIsSweeping(false);
  };

  // Generate challenge
  const generateChallenge = () => {
    const challenges = [
      {
        question: `Tần số riêng của hệ này là bao nhiêu? (Hz)`,
        answer: naturalFrequency,
        tolerance: 0.05
      },
      {
        question: `Để đạt cộng hưởng, cần điều chỉnh tần số ngoại lực thành bao nhiêu? (Hz)`,
        answer: naturalFrequency,
        tolerance: 0.1
      },
      {
        question: `Tại tần số cộng hưởng, biên độ dao động cực đại là bao nhiêu? (m)`,
        answer: drivingForce / (2 * gamma * mass * omega0),
        tolerance: 0.1
      }
    ];
    
    const selected = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(selected);
    setShowResult(false);
  };

  // Check challenge
  const checkChallenge = (userAnswer) => {
    if (!challenge) return;
    
    const error = Math.abs(userAnswer - challenge.answer) / challenge.answer;
    
    if (error < challenge.tolerance) {
      setScore(score + 150);
      setResultMessage('Chính xác! +150 điểm');
      setPerfectResonances(perfectResonances + 1);
    } else {
      setResultMessage(`Đáp án đúng: ${challenge.answer.toFixed(3)}`);
    }
    
    setShowResult(true);
    setTimeout(() => generateChallenge(), 2500);
  };

  const startGame = () => {
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    setAmplitudeHistory([]);
    generateChallenge();
  };

  const reset = () => {
    setTime(0);
    setIsPlaying(false);
    setAmplitudeHistory([]);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const returnToMenu = () => {
    setGameState('menu');
    setIsPlaying(false);
    reset();
  };

  return (
    <div className="ra-container">
      {gameState === 'menu' && (
        <div className="ra-menu">
          <div className="ra-menu-content">
            <div className="ra-title">
              <Radio className="ra-title-icon" />
              <h1>Resonance Arena</h1>
            </div>
            
            <p className="ra-description">
              Khám phá hiện tượng cộng hưởng - khi dao động đạt biên độ cực đại.
              Điều chỉnh tần số ngoại lực để đạt được cộng hưởng hoàn hảo!
            </p>

            <div className="ra-stats">
              <div className="ra-stat">
                <Trophy />
                <div>
                  <div className="ra-stat-value">{score}</div>
                  <div className="ra-stat-label">Điểm</div>
                </div>
              </div>
              <div className="ra-stat">
                <Radio />
                <div>
                  <div className="ra-stat-value">{perfectResonances}</div>
                  <div className="ra-stat-label">Cộng hưởng hoàn hảo</div>
                </div>
              </div>
              <div className="ra-stat">
                <AlertTriangle />
                <div>
                  <div className="ra-stat-value">{bridgesDestroyed}</div>
                  <div className="ra-stat-label">Cấu trúc phá hủy</div>
                </div>
              </div>
            </div>

            <button className="ra-start-btn" onClick={startGame}>
              <Play />
              Bắt đầu
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="ra-game">
          <div className="ra-header">
            <button className="ra-home-btn" onClick={returnToMenu}>
              <Home />
            </button>
            <h2>Cộng hưởng</h2>
            <div className="ra-score-display">
              <Trophy />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="ra-main">
            <div className="ra-left">
              <canvas ref={canvasRef} width={700} height={400} className="ra-canvas" />
              <canvas ref={graphRef} width={700} height={200} className="ra-graph-canvas" />
              
              <div className="ra-controls">
                <button onClick={togglePlay} className="ra-control-btn">
                  {isPlaying ? '⏸ Tạm dừng' : '▶️ Chạy'}
                </button>
                <button onClick={reset} className="ra-control-btn">
                  <RotateCw /> Đặt lại
                </button>
                <button onClick={performFrequencySweep} className="ra-control-btn" disabled={isSweeping}>
                  📊 Quét tần số
                </button>
              </div>
            </div>

            <div className="ra-right">
              <div className="ra-parameters">
                <h3>Thông số hệ</h3>
                
                <div className="ra-param">
                  <label>Khối lượng: {mass.toFixed(1)} kg</label>
                  <input type="range" min="0.5" max="3" step="0.1" value={mass}
                    onChange={(e) => setMass(parseFloat(e.target.value))} />
                </div>
                
                <div className="ra-param">
                  <label>Độ cứng: {springConstant.toFixed(0)} N/m</label>
                  <input type="range" min="20" max="200" step="10" value={springConstant}
                    onChange={(e) => setSpringConstant(parseFloat(e.target.value))} />
                </div>
                
                <div className="ra-param">
                  <label>Lực cản: {dampingCoeff.toFixed(2)} kg/s</label>
                  <input type="range" min="0" max="3" step="0.1" value={dampingCoeff}
                    onChange={(e) => setDampingCoeff(parseFloat(e.target.value))} />
                </div>
                
                <div className="ra-param">
                  <label>Lực ngoại: {drivingForce.toFixed(1)} N</label>
                  <input type="range" min="1" max="50" step="1" value={drivingForce}
                    onChange={(e) => setDrivingForce(parseFloat(e.target.value))} />
                </div>
                
                <div className="ra-param highlight">
                  <label>Tần số ngoại lực: {(drivingFrequency / (2 * Math.PI)).toFixed(2)} Hz</label>
                  <input type="range" min="1" max="20" step="0.1" value={drivingFrequency}
                    onChange={(e) => setDrivingFrequency(parseFloat(e.target.value))} />
                </div>
              </div>

              <div className="ra-info">
                <h3>Thông tin</h3>
                <div className="ra-info-row">
                  <span>Tần số riêng:</span>
                  <strong>{naturalFrequency.toFixed(2)} Hz</strong>
                </div>
                <div className="ra-info-row">
                  <span>ω₀:</span>
                  <strong>{omega0.toFixed(2)} rad/s</strong>
                </div>
                <div className="ra-info-row">
                  <span>Hệ số cản γ:</span>
                  <strong>{gamma.toFixed(3)} s⁻¹</strong>
                </div>
                {(() => {
                  const vals = calculateDrivenOscillation(time, drivingFrequency);
                  return (
                    <>
                      <div className="ra-info-row">
                        <span>Biên độ A:</span>
                        <strong>{vals.amplitude.toFixed(3)} m</strong>
                      </div>
                      <div className="ra-info-row">
                        <span>Độ lệch pha δ:</span>
                        <strong>{((vals.delta * 180) / Math.PI).toFixed(1)}°</strong>
                      </div>
                    </>
                  );
                })()}
              </div>

              {challenge && (
                <div className="ra-challenge">
                  <h3>Thử thách</h3>
                  <p>{challenge.question}</p>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Nhập đáp án..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        checkChallenge(parseFloat(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  />
                  {showResult && (
                    <div className={`ra-result ${resultMessage.includes('Chính xác') ? 'correct' : 'wrong'}`}>
                      {resultMessage}
                    </div>
                  )}
                </div>
              )}

              {sweepData.length > 0 && (
                <div className="ra-sweep-chart">
                  <h3>Đồ thị cộng hưởng</h3>
                  <svg width="100%" height="150" viewBox="0 0 300 150">
                    <line x1="30" y1="120" x2="270" y2="120" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="30" y1="120" x2="30" y2="20" stroke="#94A3B8" strokeWidth="2" />
                    
                    <polyline
                      points={sweepData.map((d, i) => {
                        const x = 30 + (i / sweepData.length) * 240;
                        const maxA = Math.max(...sweepData.map(p => p.amplitude));
                        const y = 120 - (d.amplitude / maxA) * 100;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                    />
                    
                    <text x="150" y="145" textAnchor="middle" fill="#CBD5E1" fontSize="12">
                      Tần số (Hz)
                    </text>
                    <text x="15" y="70" textAnchor="middle" fill="#CBD5E1" fontSize="12" transform="rotate(-90 15 70)">
                      Biên độ (m)
                    </text>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResonanceArena;
