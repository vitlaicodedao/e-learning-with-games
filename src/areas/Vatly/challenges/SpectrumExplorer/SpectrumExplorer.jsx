import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Rainbow, Award, Target, Zap } from 'lucide-react';
import './SpectrumExplorer.css';

const SpectrumExplorer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const prismCanvasRef = useRef(null);
  const spectrumCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  // Light source parameters
  const [lightType, setLightType] = useState('white'); // white, monochromatic, emission
  const [wavelength, setWavelength] = useState(550); // nm for monochromatic
  const [prismAngle, setPrismAngle] = useState(60); // degrees
  const [refractiveIndex, setRefractiveIndex] = useState(1.5);

  // Emission spectrum
  const [selectedElement, setSelectedElement] = useState('hydrogen');
  
  // Elements with their emission wavelengths (nm)
  const elements = {
    hydrogen: { name: 'Hydro', lines: [410, 434, 486, 656], color: '#60a5fa' },
    helium: { name: 'Heli', lines: [388, 447, 471, 492, 501, 588, 668], color: '#fbbf24' },
    sodium: { name: 'Natri', lines: [589, 589.6], color: '#f97316' },
    mercury: { name: 'Thủy ngân', lines: [405, 436, 546, 577], color: '#a78bfa' },
    neon: { name: 'Neon', lines: [540, 585, 614, 640, 660], color: '#ef4444' }
  };

  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Tạo phổ ánh sáng trắng hoàn chỉnh', type: 'white', completed: false },
    { id: 2, text: 'Phổ vạch Hydro - tìm 4 vạch đặc trưng', element: 'hydrogen', target: 4, completed: false },
    { id: 3, text: 'Góc lăng kính 60°, n=1.5', angleTarget: 60, nTarget: 1.5, completed: false }
  ]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Animation
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const animate = () => {
      setTime(t => t + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameState]);

  // Draw light source and incoming ray
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Light source
    const sourceX = 50;
    const sourceY = height / 2;

    if (lightType === 'white') {
      // White light source
      const gradient = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 30);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#fef3c7');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Incoming white ray
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sourceX + 30, sourceY);
      ctx.lineTo(150, sourceY);
      ctx.stroke();

    } else if (lightType === 'monochromatic') {
      // Monochromatic light
      const rgb = wavelengthToRGB(wavelength);
      const gradient = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 30);
      gradient.addColorStop(0, `rgb(${rgb.r},${rgb.g},${rgb.b})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Incoming colored ray
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.8)`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sourceX + 30, sourceY);
      ctx.lineTo(150, sourceY);
      ctx.stroke();

    } else if (lightType === 'emission') {
      // Emission tube
      ctx.strokeStyle = elements[selectedElement].color;
      ctx.lineWidth = 8;
      ctx.strokeRect(sourceX - 20, sourceY - 15, 60, 30);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(sourceX + 10, sourceY, 0, sourceX + 10, sourceY, 40);
      gradient.addColorStop(0, elements[selectedElement].color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(sourceX + 10, sourceY, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Outgoing rays
      ctx.strokeStyle = elements[selectedElement].color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sourceX + 40, sourceY);
      ctx.lineTo(150, sourceY);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    if (lightType === 'white') {
      ctx.fillText('Ánh sáng trắng', sourceX, height - 20);
    } else if (lightType === 'monochromatic') {
      ctx.fillText(`λ = ${wavelength} nm`, sourceX, height - 20);
    } else {
      ctx.fillText(elements[selectedElement].name, sourceX, height - 20);
    }

  }, [lightType, wavelength, selectedElement, time, isPlaying]);

  // Draw prism and refraction
  useEffect(() => {
    const canvas = prismCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Prism position
    const prismX = width / 2;
    const prismY = height / 2;
    const prismSize = 100;

    // Draw prism (triangle)
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(prismX - prismSize/2, prismY + prismSize/2);
    ctx.lineTo(prismX + prismSize/2, prismY + prismSize/2);
    ctx.lineTo(prismX, prismY - prismSize/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Incoming ray
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, prismY);
    ctx.lineTo(prismX - prismSize/2, prismY);
    ctx.stroke();

    // Refracted rays (dispersion)
    if (lightType === 'white') {
      const colors = [
        { lambda: 400, color: '#8b00ff', name: 'Tím' },
        { lambda: 450, color: '#0000ff', name: 'Lam' },
        { lambda: 500, color: '#00ffff', name: 'Lục' },
        { lambda: 550, color: '#00ff00', name: 'Vàng' },
        { lambda: 600, color: '#ffff00', name: 'Cam' },
        { lambda: 650, color: '#ff0000', name: 'Đỏ' }
      ];

      colors.forEach((c, i) => {
        const n = calculateRefractiveIndex(c.lambda);
        const deviation = calculateDeviation(prismAngle, n);
        const angle = (deviation - 20 + i * 2) * Math.PI / 180;
        
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prismX + prismSize/2, prismY);
        ctx.lineTo(prismX + prismSize/2 + 150 * Math.cos(angle), 
                   prismY + 150 * Math.sin(angle));
        ctx.stroke();
      });

    } else if (lightType === 'monochromatic') {
      const rgb = wavelengthToRGB(wavelength);
      const n = calculateRefractiveIndex(wavelength);
      const deviation = calculateDeviation(prismAngle, n);
      const angle = deviation * Math.PI / 180;

      ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(prismX + prismSize/2, prismY);
      ctx.lineTo(prismX + prismSize/2 + 150 * Math.cos(angle), 
                 prismY + 150 * Math.sin(angle));
      ctx.stroke();

    } else if (lightType === 'emission') {
      elements[selectedElement].lines.forEach((lambda, i) => {
        const rgb = wavelengthToRGB(lambda);
        const n = calculateRefractiveIndex(lambda);
        const deviation = calculateDeviation(prismAngle, n);
        const angle = deviation * Math.PI / 180;

        ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prismX + prismSize/2, prismY);
        ctx.lineTo(prismX + prismSize/2 + 150 * Math.cos(angle), 
                   prismY + 150 * Math.sin(angle));
        ctx.stroke();
      });
    }

    // Prism label
    ctx.fillStyle = '#60a5fa';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lăng kính ${prismAngle}°`, prismX, height - 20);
    ctx.fillText(`n = ${refractiveIndex.toFixed(2)}`, prismX, height - 5);

  }, [lightType, wavelength, selectedElement, prismAngle, refractiveIndex]);

  // Draw spectrum on screen
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    if (lightType === 'white') {
      // Continuous spectrum
      for (let i = 0; i < height; i++) {
        const lambda = 400 + (i / height) * 300; // 400-700 nm
        const rgb = wavelengthToRGB(lambda);
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fillRect(0, height - i, width, 1);
      }

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('700nm', width - 5, height - 5);
      ctx.fillText('400nm', width - 5, 15);

    } else if (lightType === 'monochromatic') {
      // Single line
      const rgb = wavelengthToRGB(wavelength);
      const y = height - ((wavelength - 400) / 300) * height;
      
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillRect(0, y - 2, width, 4);

      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${wavelength}nm`, 5, y - 5);

    } else if (lightType === 'emission') {
      // Line spectrum
      elements[selectedElement].lines.forEach(lambda => {
        const rgb = wavelengthToRGB(lambda);
        const y = height - ((lambda - 400) / 300) * height;
        
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fillRect(0, y - 2, width, 4);

        // Wavelength label
        ctx.fillStyle = '#fff';
        ctx.font = '9px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${lambda}`, 5, y - 3);
      });
    }

    // Screen border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

  }, [lightType, wavelength, selectedElement]);

  // Helper functions
  const wavelengthToRGB = (lambda) => {
    if (lambda < 380) lambda = 380;
    if (lambda > 780) lambda = 780;

    let r, g, b;

    if (lambda >= 380 && lambda < 440) {
      r = -(lambda - 440) / (440 - 380);
      g = 0.0;
      b = 1.0;
    } else if (lambda >= 440 && lambda < 490) {
      r = 0.0;
      g = (lambda - 440) / (490 - 440);
      b = 1.0;
    } else if (lambda >= 490 && lambda < 510) {
      r = 0.0;
      g = 1.0;
      b = -(lambda - 510) / (510 - 490);
    } else if (lambda >= 510 && lambda < 580) {
      r = (lambda - 510) / (580 - 510);
      g = 1.0;
      b = 0.0;
    } else if (lambda >= 580 && lambda < 645) {
      r = 1.0;
      g = -(lambda - 645) / (645 - 580);
      b = 0.0;
    } else {
      r = 1.0;
      g = 0.0;
      b = 0.0;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const calculateRefractiveIndex = (lambda) => {
    // Cauchy's equation: n(λ) = A + B/λ²
    const A = refractiveIndex;
    const B = 10000; // nm²
    return A + B / (lambda * lambda);
  };

  const calculateDeviation = (angle, n) => {
    // Simplified deviation angle
    const A = angle * Math.PI / 180;
    const sinA = Math.sin(A / 2);
    const deviation = 2 * Math.asin(n * sinA) - A;
    return deviation * 180 / Math.PI;
  };

  // Check challenges
  useEffect(() => {
    if (gameState !== 'playing') return;

    const challenge = challenges[currentChallenge];
    if (!challenge || challenge.completed) return;

    let achieved = false;

    if (challenge.id === 1) {
      achieved = lightType === 'white';
    } else if (challenge.id === 2) {
      achieved = lightType === 'emission' && selectedElement === challenge.element;
    } else if (challenge.id === 3) {
      const angleOk = Math.abs(prismAngle - challenge.angleTarget) < 1;
      const nOk = Math.abs(refractiveIndex - challenge.nTarget) < 0.05;
      achieved = angleOk && nOk;
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
  }, [lightType, selectedElement, prismAngle, refractiveIndex, currentChallenge, gameState]);

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
    <div className="spectrum-container">
      <div className="spectrum-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="spectrum-title">
          <Rainbow className="title-icon" />
          Spectrum Explorer
        </h1>
        <div className="score-display">
          <Award size={20} />
          <span>{score}</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Rainbow size={80} className="menu-icon" />
            <h2>Khám Phá Phổ Ánh Sáng</h2>
            <p className="menu-description">
              Tìm hiểu về tán sắc ánh sáng qua lăng kính. Khám phá phổ liên tục của ánh sáng
              trắng và phổ vạch của các nguyên tố. Quan sát sự phân tách các bước sóng khác nhau.
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Rainbow size={24} />
                <span>Phổ liên tục & phổ vạch</span>
              </div>
              <div className="feature-item">
                <Zap size={24} />
                <span>5 nguyên tố khác nhau</span>
              </div>
              <div className="feature-item">
                <Target size={24} />
                <span>3 thử thách quang phổ</span>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              <Play size={24} />
              Bắt đầu khám phá
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="experiment-layout">
            {/* Top row - Light sources */}
            <div className="sources-panel">
              <h3>Nguồn Sáng</h3>
              <canvas ref={canvasRef} width={200} height={150} className="source-canvas" />
              
              <div className="light-type-selector">
                <button 
                  className={`type-btn ${lightType === 'white' ? 'active' : ''}`}
                  onClick={() => setLightType('white')}
                >
                  💡 Ánh sáng trắng
                </button>
                <button 
                  className={`type-btn ${lightType === 'monochromatic' ? 'active' : ''}`}
                  onClick={() => setLightType('monochromatic')}
                >
                  🔦 Đơn sắc
                </button>
                <button 
                  className={`type-btn ${lightType === 'emission' ? 'active' : ''}`}
                  onClick={() => setLightType('emission')}
                >
                  ⚡ Phát xạ
                </button>
              </div>

              {lightType === 'monochromatic' && (
                <div className="param-control">
                  <label>Bước sóng: {wavelength} nm</label>
                  <input type="range" min="400" max="700" step="5" value={wavelength}
                    onChange={(e) => setWavelength(parseInt(e.target.value))} className="slider" />
                </div>
              )}

              {lightType === 'emission' && (
                <div className="element-selector">
                  <label>Chọn nguyên tố:</label>
                  {Object.keys(elements).map(key => (
                    <button 
                      key={key}
                      className={`element-btn ${selectedElement === key ? 'active' : ''}`}
                      onClick={() => setSelectedElement(key)}
                      style={{ borderColor: elements[key].color }}
                    >
                      {elements[key].name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Middle - Prism */}
            <div className="prism-panel">
              <h3>Lăng Kính</h3>
              <canvas ref={prismCanvasRef} width={400} height={300} className="prism-canvas" />
              
              <div className="prism-controls">
                <div className="param-control">
                  <label>Góc chiết quang: {prismAngle}°</label>
                  <input type="range" min="30" max="90" step="5" value={prismAngle}
                    onChange={(e) => setPrismAngle(parseInt(e.target.value))} className="slider" />
                </div>

                <div className="param-control">
                  <label>Chiết suất n: {refractiveIndex.toFixed(2)}</label>
                  <input type="range" min="1.3" max="1.8" step="0.05" value={refractiveIndex}
                    onChange={(e) => setRefractiveIndex(parseFloat(e.target.value))} className="slider" />
                </div>
              </div>

              <button onClick={togglePlayPause} className="control-btn">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Dừng' : 'Chạy'}
              </button>
            </div>

            {/* Right - Spectrum */}
            <div className="screen-panel">
              <h3>Phổ Quan Sát</h3>
              <canvas ref={spectrumCanvasRef} width={120} height={400} className="spectrum-canvas" />
              
              <div className="spectrum-info">
                {lightType === 'white' && (
                  <div className="info-text">
                    <strong>Phổ liên tục</strong>
                    <p>Ánh sáng trắng bị tán sắc thành dải màu từ đỏ đến tím</p>
                  </div>
                )}
                {lightType === 'monochromatic' && (
                  <div className="info-text">
                    <strong>Ánh sáng đơn sắc</strong>
                    <p>Một bước sóng duy nhất, không bị tán sắc</p>
                  </div>
                )}
                {lightType === 'emission' && (
                  <div className="info-text">
                    <strong>Phổ vạch phát xạ</strong>
                    <p>{elements[selectedElement].name}: {elements[selectedElement].lines.length} vạch đặc trưng</p>
                  </div>
                )}
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
                  <span className="completed-badge">✓ Hoàn thành +150</span>
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

export default SpectrumExplorer;
