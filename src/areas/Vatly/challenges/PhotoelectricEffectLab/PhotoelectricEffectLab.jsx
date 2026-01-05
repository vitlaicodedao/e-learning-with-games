import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Lightbulb, Award, Target, Zap } from 'lucide-react';
import './PhotoelectricEffectLab.css';

const PhotoelectricEffectLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const graphCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  // Physics parameters
  const [lightIntensity, setLightIntensity] = useState(50); // %
  const [frequency, setFrequency] = useState(6e14); // Hz
  const [voltage, setVoltage] = useState(0); // V (stopping potential)
  
  // Metal cathode selection
  const [metal, setMetal] = useState('sodium');
  
  // Metals with work functions (eV)
  const metals = {
    sodium: { name: 'Natri (Na)', workFunction: 2.28, color: '#f59e0b' },
    potassium: { name: 'Kali (K)', workFunction: 2.25, color: '#22c55e' },
    calcium: { name: 'Canxi (Ca)', workFunction: 2.87, color: '#60a5fa' },
    zinc: { name: 'Kẽm (Zn)', workFunction: 4.31, color: '#a78bfa' },
    copper: { name: 'Đồng (Cu)', workFunction: 4.65, color: '#ef4444' }
  };

  // Constants
  const h = 6.626e-34; // Planck constant (J·s)
  const c = 3e8; // Speed of light (m/s)
  const e = 1.602e-19; // Elementary charge (C)

  // Calculated values
  const [photonEnergy, setPhotonEnergy] = useState(0); // eV
  const [maxKineticEnergy, setMaxKineticEnergy] = useState(0); // eV
  const [current, setCurrent] = useState(0); // μA
  const [electronCount, setElectronCount] = useState(0);
  const [isPhotoelectric, setIsPhotoelectric] = useState(false);

  // Calculate physics
  useEffect(() => {
    const Eph = (h * frequency) / e; // Photon energy in eV
    const W = metals[metal].workFunction;
    const Kmax = Eph - W; // Einstein equation: Kmax = hf - W

    setPhotonEnergy(Eph);
    
    if (Kmax > 0) {
      setMaxKineticEnergy(Kmax);
      setIsPhotoelectric(true);
      
      // Current depends on intensity and stopping potential
      if (voltage <= Kmax) {
        const i = (lightIntensity / 100) * 10 * (1 - voltage / (Kmax + 0.1));
        setCurrent(Math.max(0, i));
        setElectronCount(Math.floor(i * 10));
      } else {
        setCurrent(0);
        setElectronCount(0);
      }
    } else {
      setMaxKineticEnergy(0);
      setIsPhotoelectric(false);
      setCurrent(0);
      setElectronCount(0);
    }
  }, [frequency, metal, lightIntensity, voltage]);

  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Gây hiện tượng quang điện với Na', metalTarget: 'sodium', completed: false },
    { id: 2, text: 'Động năng electron max = 2 eV', kTarget: 2, tolerance: 0.2, completed: false },
    { id: 3, text: 'Tìm điện áp hãm đúng (I=0)', completed: false }
  ]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Animation
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const animate = () => {
      setTime(t => t + 0.03);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameState]);

  // Draw photoelectric setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Cathode (left)
    const cathodeX = 150;
    const cathodeY = height / 2;
    const cathodeHeight = 120;

    ctx.fillStyle = metals[metal].color;
    ctx.fillRect(cathodeX - 10, cathodeY - cathodeHeight/2, 20, cathodeHeight);
    
    // Cathode label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Catốt (-)', cathodeX, cathodeY + cathodeHeight/2 + 25);
    ctx.font = '12px Arial';
    ctx.fillText(metals[metal].name, cathodeX, cathodeY + cathodeHeight/2 + 40);

    // Anode (right)
    const anodeX = 450;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(anodeX - 10, cathodeY - cathodeHeight/2, 20, cathodeHeight);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Anốt (+)', anodeX, cathodeY + cathodeHeight/2 + 25);

    // Light source
    const lightX = 50;
    const lightY = cathodeY - 80;
    
    const gradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 40);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(0.5, `rgba(251, 191, 36, ${lightIntensity / 200})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(lightX, lightY, 40, 0, Math.PI * 2);
    ctx.fill();

    // Light symbol
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(lightX + 25 * Math.cos(angle), lightY + 25 * Math.sin(angle));
      ctx.lineTo(lightX + 35 * Math.cos(angle), lightY + 35 * Math.sin(angle));
      ctx.stroke();
    }

    // Photons (light rays)
    if (isPlaying) {
      const numPhotons = Math.floor(lightIntensity / 10) + 2;
      for (let i = 0; i < numPhotons; i++) {
        const t = (time * 3 + i * 0.3) % 1;
        const x = lightX + (cathodeX - lightX - 10) * t;
        const y = lightY + (cathodeY - lightY) * t;
        
        ctx.fillStyle = `rgba(251, 191, 36, ${1 - t})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Photoelectrons
    if (isPhotoelectric && isPlaying) {
      for (let i = 0; i < electronCount; i++) {
        const t = (time * 2 + i * 0.15) % 1;
        const x = cathodeX + (anodeX - cathodeX) * t;
        const y = cathodeY + Math.sin(t * Math.PI * 4) * 20;
        
        const alpha = 1 - t;
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Electron trail
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Voltage source
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.strokeRect(width - 100, cathodeY - 40, 80, 80);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('V', width - 60, cathodeY);
    ctx.font = '14px Arial';
    ctx.fillText(`${voltage.toFixed(1)} V`, width - 60, cathodeY + 20);

    // Circuit wires
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    // Bottom wire
    ctx.beginPath();
    ctx.moveTo(cathodeX, cathodeY + cathodeHeight/2);
    ctx.lineTo(cathodeX, height - 50);
    ctx.lineTo(width - 100, height - 50);
    ctx.lineTo(width - 100, cathodeY + 40);
    ctx.stroke();
    // Top wire
    ctx.beginPath();
    ctx.moveTo(anodeX, cathodeY - cathodeHeight/2);
    ctx.lineTo(anodeX, 50);
    ctx.lineTo(width - 20, 50);
    ctx.lineTo(width - 20, cathodeY - 40);
    ctx.stroke();

    // Ammeter
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height - 50, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('A', width / 2, height - 45);

    // Info display
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`λ = ${(c / frequency * 1e9).toFixed(1)} nm`, 20, 20);
    ctx.fillText(`f = ${(frequency / 1e14).toFixed(2)} × 10¹⁴ Hz`, 20, 35);
    ctx.fillText(`Eph = ${photonEnergy.toFixed(2)} eV`, 20, 50);
    ctx.fillText(`W = ${metals[metal].workFunction.toFixed(2)} eV`, 20, 65);
    
    if (isPhotoelectric) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`✓ Quang điện xảy ra`, 20, 85);
      ctx.fillText(`Kmax = ${maxKineticEnergy.toFixed(2)} eV`, 20, 100);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`✗ Không có quang điện`, 20, 85);
      ctx.fillText(`(Eph < W)`, 20, 100);
    }

  }, [time, frequency, metal, lightIntensity, voltage, isPhotoelectric, electronCount, photonEnergy, maxKineticEnergy, isPlaying]);

  // Draw I-V characteristic curve
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 40);
    ctx.stroke();
    // X-axis
    ctx.beginPath();
    ctx.moveTo(50, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('V (V)', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('I (μA)', 0, 0);
    ctx.restore();

    // Draw I-V curve
    if (isPhotoelectric && maxKineticEnergy > 0) {
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const Vmax = 5;
      const Vstop = maxKineticEnergy;
      const Imax = (lightIntensity / 100) * 10;

      for (let v = -Vstop; v <= Vmax; v += 0.1) {
        let i;
        if (v < 0) {
          i = Imax * (1 + v / Vstop);
        } else {
          i = Imax;
        }
        i = Math.max(0, i);

        const x = 50 + ((v + Vstop) / (Vmax + Vstop)) * (width - 70);
        const y = height - 40 - (i / (Imax + 1)) * (height - 60);

        if (v === -Vstop) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point
      const vCurrent = voltage;
      let iCurrent = current;
      const xPoint = 50 + ((vCurrent + Vstop) / (Vmax + Vstop)) * (width - 70);
      const yPoint = height - 40 - (iCurrent / (Imax + 1)) * (height - 60);

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(xPoint, yPoint, 5, 0, Math.PI * 2);
      ctx.fill();

      // Stopping potential marker
      const xStop = 50;
      const yStop = height - 40;
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xStop, yStop);
      ctx.lineTo(xStop, 20);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = '11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Vh = ${Vstop.toFixed(2)} V`, xStop + 5, 30);
    }

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const x = 50 + (i / 5) * (width - 70);
      ctx.beginPath();
      ctx.moveTo(x, height - 40);
      ctx.lineTo(x, 20);
      ctx.stroke();
    }

  }, [isPhotoelectric, maxKineticEnergy, lightIntensity, voltage, current]);

  // Check challenges
  useEffect(() => {
    if (gameState !== 'playing') return;

    const challenge = challenges[currentChallenge];
    if (!challenge || challenge.completed) return;

    let achieved = false;

    if (challenge.id === 1) {
      achieved = isPhotoelectric && metal === challenge.metalTarget;
    } else if (challenge.id === 2) {
      achieved = Math.abs(maxKineticEnergy - challenge.kTarget) <= challenge.tolerance;
    } else if (challenge.id === 3) {
      achieved = isPhotoelectric && Math.abs(voltage - maxKineticEnergy) < 0.1 && current < 0.1;
    }

    if (achieved) {
      const newChallenges = [...challenges];
      newChallenges[currentChallenge].completed = true;
      setChallenges(newChallenges);
      setScore(prev => prev + 200);
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => setCurrentChallenge(prev => prev + 1), 1000);
      } else {
        setTimeout(() => finishGame(), 2000);
      }
    }
  }, [isPhotoelectric, metal, maxKineticEnergy, voltage, current, currentChallenge, gameState]);

  const startGame = () => {
    setGameState('playing');
    setIsPlaying(false);
    setTime(0);
    setScore(0);
    setCurrentChallenge(0);
    setChallenges(challenges.map(c => ({ ...c, completed: false })));
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const finishGame = () => { setIsPlaying(false); setGameState('result'); };

  return (
    <div className="photoelectric-container">
      <div className="photoelectric-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="photoelectric-title">
          <Lightbulb className="title-icon" />
          Photoelectric Effect Lab
        </h1>
        <div className="score-display">
          <Award size={20} />
          <span>{score}</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Zap size={80} className="menu-icon" />
            <h2>Phòng Thí Nghiệm Hiện Tượng Quang Điện</h2>
            <p className="menu-description">
              Khám phá hiện tượng quang điện - bằng chứng cho thuyết lượng tử ánh sáng.
              Phương trình Einstein: Kmax = hf - W. Tìm hiểu về năng lượng photon, công thoát
              và điện áp hãm.
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Lightbulb size={24} />
                <span>Mô phỏng quang điện thực tế</span>
              </div>
              <div className="feature-item">
                <Zap size={24} />
                <span>5 kim loại khác nhau</span>
              </div>
              <div className="feature-item">
                <Target size={24} />
                <span>Đường đặc tuyến I-V</span>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              <Play size={24} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="experiment-grid">
            <div className="setup-panel">
              <h3>Bộ Thí Nghiệm Quang Điện</h3>
              <canvas ref={canvasRef} width={600} height={400} className="setup-canvas" />
              
              <div className="controls">
                <button onClick={togglePlayPause} className="control-btn">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Dừng' : 'Chạy'}
                </button>
                <button onClick={() => { setTime(0); setIsPlaying(false); }} className="control-btn">
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>

              <div className="measurement-panel">
                <div className="measurement-item">
                  <span>Dòng điện:</span>
                  <strong className={current > 0 ? 'active' : ''}>{current.toFixed(2)} μA</strong>
                </div>
                <div className="measurement-item">
                  <span>Trạng thái:</span>
                  <strong className={isPhotoelectric ? 'active' : 'inactive'}>
                    {isPhotoelectric ? '✓ Quang điện' : '✗ Không xảy ra'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="controls-panel">
              <div className="param-section">
                <h4>Kim Loại Catốt</h4>
                <div className="metal-selector">
                  {Object.keys(metals).map(key => (
                    <button
                      key={key}
                      className={`metal-btn ${metal === key ? 'active' : ''}`}
                      onClick={() => setMetal(key)}
                      style={{ borderColor: metals[key].color }}
                    >
                      {metals[key].name}
                      <span>W = {metals[key].workFunction} eV</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="param-section">
                <h4>Thông Số Ánh Sáng</h4>
                <div className="param-control">
                  <label>Cường độ: {lightIntensity}%</label>
                  <input type="range" min="10" max="100" step="5" value={lightIntensity}
                    onChange={(e) => setLightIntensity(parseInt(e.target.value))} className="slider" />
                </div>

                <div className="param-control">
                  <label>Tần số: {(frequency / 1e14).toFixed(2)} × 10¹⁴ Hz</label>
                  <input type="range" min="3" max="10" step="0.1" value={frequency / 1e14}
                    onChange={(e) => setFrequency(parseFloat(e.target.value) * 1e14)} className="slider" />
                  <div className="wavelength-display">
                    λ = {(c / frequency * 1e9).toFixed(1)} nm
                  </div>
                </div>

                <div className="param-control">
                  <label>Điện áp hãm: {voltage.toFixed(2)} V</label>
                  <input type="range" min="0" max="5" step="0.1" value={voltage}
                    onChange={(e) => setVoltage(parseFloat(e.target.value))} className="slider" />
                </div>
              </div>

              <div className="graph-section">
                <h4>Đường Đặc Tuyến I-V</h4>
                <canvas ref={graphCanvasRef} width={350} height={200} className="graph-canvas" />
              </div>
            </div>
          </div>

          <div className="challenge-panel">
            <h3><Target size={20} /> Thử thách {currentChallenge + 1}/3</h3>
            {challenges[currentChallenge] && (
              <div className={`challenge-item ${challenges[currentChallenge].completed ? 'completed' : ''}`}>
                <p>{challenges[currentChallenge].text}</p>
                {challenges[currentChallenge].completed && (
                  <span className="completed-badge">✓ Hoàn thành +200</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="result-screen">
          <div className="result-content">
            <Award size={100} className="result-icon" />
            <h2>Thí Nghiệm Thành Công!</h2>
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

export default PhotoelectricEffectLab;
