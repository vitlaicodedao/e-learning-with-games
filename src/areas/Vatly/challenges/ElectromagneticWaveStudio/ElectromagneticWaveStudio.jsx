import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Waves, Radio, Award, Zap, Target } from 'lucide-react';
import './ElectromagneticWaveStudio.css';

const ElectromagneticWaveStudio = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const spectrumCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  // Wave parameters
  const [frequency, setFrequency] = useState(100e6); // Hz (100 MHz default - FM radio)
  const [amplitude, setAmplitude] = useState(1.0);
  const [waveType, setWaveType] = useState('radio'); // radio, microwave, infrared, visible, ultraviolet, xray, gamma

  // Physics constants
  const c = 3e8; // Speed of light (m/s)
  
  // Calculated values
  const [wavelength, setWavelength] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [period, setPeriod] = useState(0);

  // Wave types with their frequency ranges
  const waveTypes = {
    radio: { name: 'Sóng Radio', freqMin: 1e3, freqMax: 1e9, color: '#ef4444', icon: '📻' },
    microwave: { name: 'Sóng Vi Ba', freqMin: 1e9, freqMax: 3e11, color: '#f97316', icon: '📡' },
    infrared: { name: 'Hồng Ngoại', freqMin: 3e11, freqMax: 4e14, color: '#f59e0b', icon: '🌡️' },
    visible: { name: 'Ánh Sáng', freqMin: 4e14, freqMax: 8e14, color: '#22c55e', icon: '💡' },
    ultraviolet: { name: 'Tử Ngoại', freqMin: 8e14, freqMax: 3e16, color: '#3b82f6', icon: '☀️' },
    xray: { name: 'Tia X', freqMin: 3e16, freqMax: 3e19, color: '#8b5cf6', icon: '⚡' },
    gamma: { name: 'Tia Gamma', freqMin: 3e19, freqMax: 3e22, color: '#ec4899', icon: '☢️' }
  };

  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Tạo sóng FM (88-108 MHz)', freqMin: 88e6, freqMax: 108e6, completed: false },
    { id: 2, text: 'Sóng ánh sáng đỏ (λ = 650-700 nm)', lambdaMin: 650e-9, lambdaMax: 700e-9, completed: false },
    { id: 3, text: 'Tia X y tế (f > 10¹⁷ Hz)', freqMin: 1e17, completed: false },
  ]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Calculate derived values
  useEffect(() => {
    const lambda = c / frequency; // λ = c/f
    const T = 1 / frequency; // Period
    const h = 6.626e-34; // Planck constant
    const E = h * frequency; // E = hf

    setWavelength(lambda);
    setPeriod(T);
    setEnergy(E);

    // Auto-detect wave type based on frequency
    if (frequency >= waveTypes.gamma.freqMin) setWaveType('gamma');
    else if (frequency >= waveTypes.xray.freqMin) setWaveType('xray');
    else if (frequency >= waveTypes.ultraviolet.freqMin) setWaveType('ultraviolet');
    else if (frequency >= waveTypes.visible.freqMin) setWaveType('visible');
    else if (frequency >= waveTypes.infrared.freqMin) setWaveType('infrared');
    else if (frequency >= waveTypes.microwave.freqMin) setWaveType('microwave');
    else setWaveType('radio');
  }, [frequency]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const animate = () => {
      setTime(t => t + 0.016);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameState]);

  // Draw electromagnetic wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    // Center horizontal line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw electric field (vertical oscillation)
    const waveColor = waveTypes[waveType].color;
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 3;
    
    const numWaves = 3; // Number of wavelengths to show
    const pixelsPerWave = width / numWaves;
    const timeOffset = isPlaying ? time * 5 : 0;

    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const phase = (x / pixelsPerWave) * 2 * Math.PI - timeOffset;
      const y = height / 2 + amplitude * 80 * Math.sin(phase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw magnetic field (horizontal perspective)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    
    for (let x = 0; x < width; x += 20) {
      const phase = (x / pixelsPerWave) * 2 * Math.PI - timeOffset;
      const amplitude2 = amplitude * 60 * Math.sin(phase);
      
      ctx.beginPath();
      ctx.moveTo(x, height / 2);
      ctx.lineTo(x + amplitude2 * 0.5, height / 2 - 30);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, height / 2);
      ctx.lineTo(x + amplitude2 * 0.5, height / 2 + 30);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw wavelength indicator
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, height - 40);
    ctx.lineTo(50 + pixelsPerWave, height - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow heads
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(50, height - 40);
    ctx.lineTo(55, height - 35);
    ctx.lineTo(55, height - 45);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(50 + pixelsPerWave, height - 40);
    ctx.lineTo(45 + pixelsPerWave, height - 35);
    ctx.lineTo(45 + pixelsPerWave, height - 45);
    ctx.fill();

    // Label
    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('λ', 50 + pixelsPerWave / 2, height - 50);

    // Labels
    ctx.fillStyle = waveColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('E (Điện trường)', 20, 30);
    ctx.fillStyle = '#34d399';
    ctx.fillText('B (Từ trường)', 20, 50);

    // Direction arrow
    ctx.fillStyle = '#60a5fa';
    ctx.font = '18px Arial';
    ctx.fillText('→ c', width - 60, height / 2 - 10);

  }, [time, frequency, amplitude, waveType, isPlaying]);

  // Draw spectrum
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw spectrum bands
    const bands = [
      { type: 'radio', x: 0, width: 80 },
      { type: 'microwave', x: 80, width: 70 },
      { type: 'infrared', x: 150, width: 60 },
      { type: 'visible', x: 210, width: 50 },
      { type: 'ultraviolet', x: 260, width: 50 },
      { type: 'xray', x: 310, width: 50 },
      { type: 'gamma', x: 360, width: 40 }
    ];

    bands.forEach(band => {
      const isActive = waveType === band.type;
      ctx.fillStyle = waveTypes[band.type].color;
      ctx.globalAlpha = isActive ? 1 : 0.3;
      ctx.fillRect(band.x, 0, band.width, height);
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.translate(band.x + band.width / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(waveTypes[band.type].name, 0, 0);
      ctx.restore();
    });

    // Current frequency marker
    const logMin = Math.log10(1e3);
    const logMax = Math.log10(3e22);
    const logFreq = Math.log10(frequency);
    const markerX = ((logFreq - logMin) / (logMax - logMin)) * width;

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(markerX, height - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [frequency, waveType]);

  // Check challenges
  useEffect(() => {
    if (gameState !== 'playing') return;

    const challenge = challenges[currentChallenge];
    if (!challenge || challenge.completed) return;

    let achieved = false;

    if (challenge.id === 1) {
      achieved = frequency >= challenge.freqMin && frequency <= challenge.freqMax;
    } else if (challenge.id === 2) {
      achieved = wavelength >= challenge.lambdaMin && wavelength <= challenge.lambdaMax;
    } else if (challenge.id === 3) {
      achieved = frequency >= challenge.freqMin;
    }

    if (achieved) {
      const newChallenges = [...challenges];
      newChallenges[currentChallenge].completed = true;
      setChallenges(newChallenges);
      setScore(prev => prev + 150);
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => setCurrentChallenge(prev => prev + 1), 1000);
      } else {
        setTimeout(() => finishGame(), 2000);
      }
    }
  }, [frequency, wavelength, currentChallenge, gameState]);

  const startGame = () => {
    setGameState('playing');
    setIsPlaying(false);
    setTime(0);
    setScore(0);
    setCurrentChallenge(0);
    setChallenges(challenges.map(c => ({ ...c, completed: false })));
    setFrequency(100e6);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const finishGame = () => {
    setIsPlaying(false);
    setGameState('result');
  };

  const formatFrequency = (f) => {
    if (f >= 1e18) return `${(f / 1e18).toFixed(2)} EHz`;
    if (f >= 1e15) return `${(f / 1e15).toFixed(2)} PHz`;
    if (f >= 1e12) return `${(f / 1e12).toFixed(2)} THz`;
    if (f >= 1e9) return `${(f / 1e9).toFixed(2)} GHz`;
    if (f >= 1e6) return `${(f / 1e6).toFixed(2)} MHz`;
    if (f >= 1e3) return `${(f / 1e3).toFixed(2)} kHz`;
    return `${f.toFixed(2)} Hz`;
  };

  const formatWavelength = (lambda) => {
    if (lambda >= 1) return `${lambda.toFixed(2)} m`;
    if (lambda >= 1e-3) return `${(lambda * 1e3).toFixed(2)} mm`;
    if (lambda >= 1e-6) return `${(lambda * 1e6).toFixed(2)} μm`;
    if (lambda >= 1e-9) return `${(lambda * 1e9).toFixed(2)} nm`;
    return `${(lambda * 1e12).toFixed(2)} pm`;
  };

  return (
    <div className="em-wave-container">
      {/* Header */}
      <div className="em-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="em-title">
          <Waves className="title-icon" />
          Electromagnetic Wave Studio
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
            <Radio size={80} className="menu-icon" />
            <h2>Phòng Thí Nghiệm Sóng Điện Từ</h2>
            <p className="menu-description">
              Khám phá phổ sóng điện từ từ sóng radio đến tia gamma. Điều chỉnh tần số để
              tạo ra các loại sóng khác nhau và tìm hiểu về bước sóng, năng lượng photon.
              Công thức: λ = c/f và E = hf
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Waves size={24} />
                <span>Mô phỏng sóng điện từ 3D</span>
              </div>
              <div className="feature-item">
                <Radio size={24} />
                <span>Phổ sóng điện từ đầy đủ</span>
              </div>
              <div className="feature-item">
                <Target size={24} />
                <span>3 thử thách về tần số</span>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              <Play size={24} />
              Bắt đầu khám phá
            </button>
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="main-layout">
            {/* Wave Visualization */}
            <div className="wave-panel">
              <h3>
                <Zap size={20} />
                Sóng Điện Từ: {waveTypes[waveType].icon} {waveTypes[waveType].name}
              </h3>
              <canvas ref={canvasRef} width={700} height={300} className="wave-canvas" />
              
              <div className="wave-controls">
                <button onClick={togglePlayPause} className="control-btn">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Tạm dừng' : 'Chạy'}
                </button>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <span className="info-label">Tần số (f)</span>
                  <span className="info-value">{formatFrequency(frequency)}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Bước sóng (λ)</span>
                  <span className="info-value">{formatWavelength(wavelength)}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Chu kỳ (T)</span>
                  <span className="info-value">{period < 1e-12 ? `${(period * 1e15).toFixed(2)} fs` : `${(period * 1e9).toFixed(2)} ns`}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Năng lượng photon</span>
                  <span className="info-value">{(energy * 1e19).toFixed(3)} × 10⁻¹⁹ J</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="controls-panel">
              <h3>Điều Chỉnh Tần Số</h3>
              
              <div className="frequency-control">
                <label>Tần số: {formatFrequency(frequency)}</label>
                <input
                  type="range"
                  min="3"
                  max="22"
                  step="0.1"
                  value={Math.log10(frequency)}
                  onChange={(e) => setFrequency(Math.pow(10, parseFloat(e.target.value)))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>kHz</span>
                  <span>MHz</span>
                  <span>GHz</span>
                  <span>THz</span>
                  <span>PHz</span>
                  <span>EHz</span>
                </div>
              </div>

              <div className="preset-buttons">
                <h4>Tần số mẫu:</h4>
                <button onClick={() => setFrequency(100e6)} className="preset-btn">
                  📻 FM Radio (100 MHz)
                </button>
                <button onClick={() => setFrequency(2.45e9)} className="preset-btn">
                  📡 Vi ba (2.45 GHz)
                </button>
                <button onClick={() => setFrequency(5e14)} className="preset-btn">
                  💡 Ánh sáng vàng (500 THz)
                </button>
                <button onClick={() => setFrequency(1e16)} className="preset-btn">
                  ☀️ Tử ngoại (10 PHz)
                </button>
                <button onClick={() => setFrequency(1e18)} className="preset-btn">
                  ⚡ Tia X (1 EHz)
                </button>
              </div>

              {/* Spectrum */}
              <div className="spectrum-section">
                <h4>Phổ Sóng Điện Từ</h4>
                <canvas ref={spectrumCanvasRef} width={400} height={80} className="spectrum-canvas" />
              </div>

              {/* Challenge */}
              <div className="challenge-box">
                <h3>
                  <Target size={20} />
                  Thử thách {currentChallenge + 1}/3
                </h3>
                {challenges[currentChallenge] && (
                  <div className={`challenge-item ${challenges[currentChallenge].completed ? 'completed' : ''}`}>
                    <p>{challenges[currentChallenge].text}</p>
                    {challenges[currentChallenge].completed && (
                      <span className="completed-badge">✓ Hoàn thành +150</span>
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
            <h2>Hoàn Thành Khám Phá!</h2>
            <div className="result-score">
              <span className="score-label">Điểm số:</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="result-stats">
              <div className="stat-item">
                <span>Thử thách hoàn thành:</span>
                <strong>{challenges.filter(c => c.completed).length}/3</strong>
              </div>
            </div>
            <div className="result-buttons">
              <button onClick={startGame} className="retry-button">
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

export default ElectromagneticWaveStudio;
