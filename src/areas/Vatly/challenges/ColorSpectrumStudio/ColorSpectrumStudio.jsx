import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Palette, Sparkles } from 'lucide-react';
import './ColorSpectrumStudio.css';

/**
 * Color Spectrum Studio - Grade 9 Physics Game
 * Demonstrates light dispersion, color mixing, and spectrum
 * Physics: White light dispersion, additive/subtractive color mixing
 */

const ColorSpectrumStudio = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [targetsCompleted, setTargetsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Color mixing state
  const [redIntensity, setRedIntensity] = useState(0);
  const [greenIntensity, setGreenIntensity] = useState(0);
  const [blueIntensity, setBlueIntensity] = useState(0);

  // Prism state
  const [prismAngle, setPrismAngle] = useState(45);
  const [showSpectrum, setShowSpectrum] = useState(true);

  // Target color
  const [targetColor, setTargetColor] = useState({ r: 255, g: 0, b: 0 });
  const [targetColorName, setTargetColorName] = useState('');

  // Mode: 'mixing' or 'dispersion'
  const [mode, setMode] = useState('mixing');

  // Predefined colors
  const colorPalette = [
    { name: 'Đỏ', r: 255, g: 0, b: 0 },
    { name: 'Cam', r: 255, g: 165, b: 0 },
    { name: 'Vàng', r: 255, g: 255, b: 0 },
    { name: 'Lục', r: 0, g: 255, b: 0 },
    { name: 'Lam', r: 0, g: 0, b: 255 },
    { name: 'Chàm', r: 75, g: 0, b: 130 },
    { name: 'Tím', r: 148, g: 0, b: 211 },
    { name: 'Trắng', r: 255, g: 255, b: 255 },
    { name: 'Đen', r: 0, g: 0, b: 0 },
    { name: 'Hồng', r: 255, g: 192, b: 203 },
    { name: 'Xanh lá nhạt', r: 144, g: 238, b: 144 },
    { name: 'Xanh dương nhạt', r: 173, g: 216, b: 230 }
  ];

  // Spectrum colors (ROYGBIV)
  const spectrumColors = [
    { name: 'Đỏ', color: '#FF0000', wavelength: '700 nm' },
    { name: 'Cam', color: '#FF7F00', wavelength: '620 nm' },
    { name: 'Vàng', color: '#FFFF00', wavelength: '580 nm' },
    { name: 'Lục', color: '#00FF00', wavelength: '530 nm' },
    { name: 'Lam', color: '#0000FF', wavelength: '470 nm' },
    { name: 'Chàm', color: '#4B0082', wavelength: '450 nm' },
    { name: 'Tím', color: '#9400D3', wavelength: '400 nm' }
  ];

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Trộn màu sơ cấp',
      description: 'Học cách trộn màu đỏ, lục, lam',
      duration: 120,
      targetsNeeded: 3,
      mode: 'mixing',
      difficulty: 'easy'
    },
    {
      id: 2,
      name: 'Trung bình - Tạo màu phức tạp',
      description: 'Tạo ra nhiều màu sắc khác nhau',
      duration: 150,
      targetsNeeded: 4,
      mode: 'mixing',
      difficulty: 'medium'
    },
    {
      id: 3,
      name: 'Nâng cao - Phân tích quang phổ',
      description: 'Nghiên cứu sự tán sắc ánh sáng qua lăng kính',
      duration: 180,
      targetsNeeded: 5,
      mode: 'dispersion',
      difficulty: 'hard'
    },
    {
      id: 4,
      name: 'Chuyên gia - Bậc thầy màu sắc',
      description: 'Kết hợp trộn màu và phân tích quang phổ',
      duration: 240,
      targetsNeeded: 6,
      mode: 'both',
      difficulty: 'expert'
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Generate new target
  const generateTarget = useCallback(() => {
    if (currentLevel.mode === 'dispersion' || (currentLevel.mode === 'both' && Math.random() > 0.5)) {
      // Dispersion mode: identify spectrum color
      setMode('dispersion');
      const randomColor = spectrumColors[Math.floor(Math.random() * spectrumColors.length)];
      setTargetColorName(randomColor.name);
    } else {
      // Mixing mode: create target color
      setMode('mixing');
      let targetIdx;
      if (currentLevel.difficulty === 'easy') {
        // Easy: primary colors only
        targetIdx = Math.floor(Math.random() * 3); // Red, Green, Blue
      } else if (currentLevel.difficulty === 'medium') {
        // Medium: first 9 colors
        targetIdx = Math.floor(Math.random() * 9);
      } else {
        // Hard/Expert: all colors
        targetIdx = Math.floor(Math.random() * colorPalette.length);
      }
      
      const target = colorPalette[targetIdx];
      setTargetColor({ r: target.r, g: target.g, b: target.b });
      setTargetColorName(target.name);
    }
  }, [currentLevel]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('victory');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      if (mode === 'mixing') {
        drawColorMixing(ctx, width, height);
      } else {
        drawDispersion(ctx, width, height);
      }
    }
  }, [redIntensity, greenIntensity, blueIntensity, prismAngle, showSpectrum, mode, gameState]);

  const drawColorMixing = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    const distance = 100;

    // Draw three light sources
    // Red light (top-left)
    if (redIntensity > 0) {
      const redX = centerX - distance * Math.cos(Math.PI / 6);
      const redY = centerY - distance * Math.sin(Math.PI / 6);
      
      const gradient = ctx.createRadialGradient(redX, redY, 0, redX, redY, radius * 2);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${redIntensity / 255})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Light source circle
      ctx.fillStyle = `rgb(${redIntensity}, 0, 0)`;
      ctx.beginPath();
      ctx.arc(redX, redY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ĐỎ', redX, redY - 40);
    }

    // Green light (top-right)
    if (greenIntensity > 0) {
      const greenX = centerX + distance * Math.cos(Math.PI / 6);
      const greenY = centerY - distance * Math.sin(Math.PI / 6);
      
      const gradient = ctx.createRadialGradient(greenX, greenY, 0, greenX, greenY, radius * 2);
      gradient.addColorStop(0, `rgba(0, 255, 0, ${greenIntensity / 255})`);
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Light source circle
      ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
      ctx.beginPath();
      ctx.arc(greenX, greenY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LỤC', greenX, greenY - 40);
    }

    // Blue light (bottom)
    if (blueIntensity > 0) {
      const blueX = centerX;
      const blueY = centerY + distance;
      
      const gradient = ctx.createRadialGradient(blueX, blueY, 0, blueX, blueY, radius * 2);
      gradient.addColorStop(0, `rgba(0, 0, 255, ${blueIntensity / 255})`);
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Light source circle
      ctx.fillStyle = `rgb(0, 0, ${blueIntensity})`;
      ctx.beginPath();
      ctx.arc(blueX, blueY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LAM', blueX, blueY + 50);
    }

    // Draw mixed color in center
    const mixedColor = `rgb(${redIntensity}, ${greenIntensity}, ${blueIntensity})`;
    
    ctx.fillStyle = mixedColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Màu kết hợp', centerX, centerY - 80);

    // RGB values
    ctx.font = '12px Arial';
    ctx.fillText(`RGB: (${redIntensity}, ${greenIntensity}, ${blueIntensity})`, centerX, centerY + 100);

    // Color name detection
    const detectedColor = detectColorName(redIntensity, greenIntensity, blueIntensity);
    if (detectedColor) {
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(detectedColor, centerX, centerY + 120);
    }
  };

  const drawDispersion = (ctx, width, height) => {
    const prismX = 200;
    const prismY = height / 2;
    const prismSize = 100;

    // Draw white light source
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(50, prismY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Light rays from source to prism
    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * 8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(75, prismY + offset);
      ctx.lineTo(prismX - 50, prismY + offset);
      ctx.stroke();
    }

    // Draw prism (triangle)
    ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(prismX - 50, prismY - prismSize / 2);
    ctx.lineTo(prismX + 50, prismY);
    ctx.lineTo(prismX - 50, prismY + prismSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Prism label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Lăng kính', prismX, prismY - prismSize / 2 - 15);

    // Draw spectrum
    if (showSpectrum) {
      const spectrumStartX = prismX + 70;
      const spectrumWidth = 400;
      const raySpacing = 25;

      spectrumColors.forEach((color, index) => {
        const angleOffset = (index - 3) * (prismAngle / 100);
        const endX = spectrumStartX + spectrumWidth;
        const endY = prismY + angleOffset * raySpacing;

        // Draw spectrum ray
        const gradient = ctx.createLinearGradient(spectrumStartX, prismY, endX, endY);
        gradient.addColorStop(0, color.color + '88');
        gradient.addColorStop(1, color.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(spectrumStartX, prismY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Color label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(color.name, endX + 10, endY + 5);
        ctx.font = '10px Arial';
        ctx.fillText(color.wavelength, endX + 10, endY + 18);
      });

      // Spectrum bar
      const barX = spectrumStartX;
      const barY = prismY + 150;
      const barWidth = spectrumWidth;
      const barHeight = 30;

      const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
      spectrumColors.forEach((color, index) => {
        gradient.addColorStop(index / (spectrumColors.length - 1), color.color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(barX, barY, barWidth, barHeight);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      // Wavelength labels
      ctx.fillStyle = '#fff';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('700 nm', barX, barY + barHeight + 15);
      ctx.fillText('400 nm', barX + barWidth, barY + barHeight + 15);
      ctx.fillText('Bước sóng →', barX + barWidth / 2, barY + barHeight + 15);
    }

    // Info text
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Ánh sáng trắng chứa tất cả các màu trong quang phổ', 50, 50);
    ctx.fillText('Lăng kính tán sắc ánh sáng thành các màu riêng biệt', 50, 70);
  };

  const detectColorName = (r, g, b) => {
    // Find closest matching color
    let minDistance = Infinity;
    let closestColor = null;

    colorPalette.forEach(color => {
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) +
        Math.pow(g - color.g, 2) +
        Math.pow(b - color.b, 2)
      );

      if (distance < minDistance && distance < 50) { // Threshold
        minDistance = distance;
        closestColor = color.name;
      }
    });

    return closestColor;
  };

  const adjustColor = (color, delta) => {
    switch (color) {
      case 'red':
        setRedIntensity(prev => Math.max(0, Math.min(255, prev + delta)));
        break;
      case 'green':
        setGreenIntensity(prev => Math.max(0, Math.min(255, prev + delta)));
        break;
      case 'blue':
        setBlueIntensity(prev => Math.max(0, Math.min(255, prev + delta)));
        break;
    }
  };

  const adjustPrism = (delta) => {
    setPrismAngle(prev => Math.max(0, Math.min(90, prev + delta)));
  };

  const checkTarget = useCallback(() => {
    if (mode === 'mixing') {
      // Check color matching
      const tolerance = currentLevel.difficulty === 'easy' ? 30 : 
                       currentLevel.difficulty === 'medium' ? 20 : 15;
      
      const rDiff = Math.abs(redIntensity - targetColor.r);
      const gDiff = Math.abs(greenIntensity - targetColor.g);
      const bDiff = Math.abs(blueIntensity - targetColor.b);

      if (rDiff < tolerance && gDiff < tolerance && bDiff < tolerance) {
        const basePoints = 200;
        const accuracyBonus = Math.floor((tolerance * 3 - rDiff - gDiff - bDiff) * 2);
        const timeBonus = Math.floor((timeLeft / 10)) * 10;
        const points = basePoints + accuracyBonus + timeBonus;
        
        setScore(prev => prev + points);
        setTargetsCompleted(prev => {
          const newCompleted = prev + 1;
          if (newCompleted >= currentLevel.targetsNeeded) {
            setTimeout(() => setGameState('victory'), 500);
          } else {
            generateTarget();
          }
          return newCompleted;
        });
        
        return true;
      }
    } else {
      // Dispersion mode: just acknowledge understanding
      const basePoints = 200;
      const timeBonus = Math.floor((timeLeft / 10)) * 10;
      const points = basePoints + timeBonus;
      
      setScore(prev => prev + points);
      setTargetsCompleted(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.targetsNeeded) {
          setTimeout(() => setGameState('victory'), 500);
        } else {
          generateTarget();
        }
        return newCompleted;
      });
      
      return true;
    }
    return false;
  }, [mode, redIntensity, greenIntensity, blueIntensity, targetColor, timeLeft, currentLevel, generateTarget]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetsCompleted(0);
    setTimeLeft(currentLevel.duration);
    setRedIntensity(0);
    setGreenIntensity(0);
    setBlueIntensity(0);
    setPrismAngle(45);
    setShowSpectrum(true);
    generateTarget();
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="color-spectrum-studio">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Palette className="title-icon" size={40} />
            Phòng Thí Nghiệm Màu Sắc
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Palette className="menu-icon" size={80} />
            <h2>Phòng Thí Nghiệm Màu Sắc</h2>
            <p className="menu-description">
              Khám phá thế giới màu sắc: trộn màu ánh sáng và phân tích quang phổ
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>🎨 Trộn màu cộng (Ánh sáng)</h4>
                  <p>Đỏ + Lục + Lam = Trắng</p>
                  <p>Đỏ + Lục = Vàng</p>
                  <p>Đỏ + Lam = Tím hồng</p>
                  <p>Lục + Lam = Lục lam</p>
                </div>

                <div className="theory-item">
                  <h4>🌈 Quang phổ ánh sáng trắng</h4>
                  <p>7 màu: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím</p>
                  <p>Bước sóng: 700 nm (đỏ) → 400 nm (tím)</p>
                  <p>Lăng kính: Tán sắc ánh sáng</p>
                </div>

                <div className="theory-item">
                  <h4>💡 Màu sắc vật thể</h4>
                  <p>Vật đỏ: Hấp thụ màu khác, phản xạ đỏ</p>
                  <p>Vật trắng: Phản xạ tất cả màu</p>
                  <p>Vật đen: Hấp thụ tất cả màu</p>
                </div>
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn cấp độ</h3>
              <div className="level-buttons">
                {levels.map(level => (
                  <button
                    key={level.id}
                    className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <span className="level-number">Cấp độ {level.id}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-desc">{level.description}</span>
                    <span className="level-desc">
                      🎯 Mục tiêu: {level.targetsNeeded} lần | ⏱️ {level.duration}s
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button className="start-button" onClick={startGame}>
              <Play size={24} />
              <span>Bắt đầu</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render victory screen
  if (gameState === 'victory') {
    return (
      <div className="color-spectrum-studio">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Palette className="title-icon" size={40} />
            Phòng Thí Nghiệm Màu Sắc
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className="trophy-icon" size={100} />
            <h2>Hoàn thành!</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Mục tiêu</span>
                <span className="final-value">{targetsCompleted}/{currentLevel.targetsNeeded}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Thời gian còn lại</span>
                <span className="final-value">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="victory-buttons">
              <button className="menu-button" onClick={returnToMenu}>
                <Home size={20} />
                <span>Menu</span>
              </button>
              <button className="replay-button" onClick={startGame}>
                <RotateCw size={20} />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game screen
  return (
    <div className="color-spectrum-studio">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Palette className="title-icon" size={40} />
          Màu Sắc - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mục tiêu</span>
            <span className="stat-value">{targetsCompleted}/{currentLevel.targetsNeeded}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Chế độ</span>
            <span className="stat-value">{mode === 'mixing' ? 'Trộn màu' : 'Quang phổ'}</span>
          </div>
        </div>

        <div className="game-content">
          <div className="experiment-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="experiment-canvas"
            />
          </div>

          <div className="control-panel">
            <div className="target-info">
              <h3>🎯 Nhiệm vụ</h3>
              <div className="target-color-display">
                {mode === 'mixing' ? (
                  <>
                    <div 
                      className="target-color-box"
                      style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
                    />
                    <div className="target-color-name">{targetColorName}</div>
                    <div className="target-rgb">
                      RGB: ({targetColor.r}, {targetColor.g}, {targetColor.b})
                    </div>
                  </>
                ) : (
                  <div className="dispersion-task">
                    <p>Quan sát quang phổ ánh sáng trắng</p>
                    <p>Tìm hiểu màu: <strong>{targetColorName}</strong></p>
                  </div>
                )}
              </div>
            </div>

            {mode === 'mixing' ? (
              <div className="controls">
                <h3>⚙️ Điều khiển màu</h3>
                
                <div className="control-section">
                  <div className="color-slider-label">
                    Đỏ (R): {redIntensity}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={redIntensity}
                    onChange={(e) => setRedIntensity(parseInt(e.target.value))}
                    className="color-slider red-slider"
                  />
                  <div className="button-group-small">
                    <button className="control-btn" onClick={() => adjustColor('red', -25)}>-25</button>
                    <button className="control-btn" onClick={() => adjustColor('red', -5)}>-5</button>
                    <button className="control-btn" onClick={() => adjustColor('red', 5)}>+5</button>
                    <button className="control-btn" onClick={() => adjustColor('red', 25)}>+25</button>
                  </div>
                </div>

                <div className="control-section">
                  <div className="color-slider-label">
                    Lục (G): {greenIntensity}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={greenIntensity}
                    onChange={(e) => setGreenIntensity(parseInt(e.target.value))}
                    className="color-slider green-slider"
                  />
                  <div className="button-group-small">
                    <button className="control-btn" onClick={() => adjustColor('green', -25)}>-25</button>
                    <button className="control-btn" onClick={() => adjustColor('green', -5)}>-5</button>
                    <button className="control-btn" onClick={() => adjustColor('green', 5)}>+5</button>
                    <button className="control-btn" onClick={() => adjustColor('green', 25)}>+25</button>
                  </div>
                </div>

                <div className="control-section">
                  <div className="color-slider-label">
                    Lam (B): {blueIntensity}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={blueIntensity}
                    onChange={(e) => setBlueIntensity(parseInt(e.target.value))}
                    className="color-slider blue-slider"
                  />
                  <div className="button-group-small">
                    <button className="control-btn" onClick={() => adjustColor('blue', -25)}>-25</button>
                    <button className="control-btn" onClick={() => adjustColor('blue', -5)}>-5</button>
                    <button className="control-btn" onClick={() => adjustColor('blue', 5)}>+5</button>
                    <button className="control-btn" onClick={() => adjustColor('blue', 25)}>+25</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="controls">
                <h3>⚙️ Điều khiển quang phổ</h3>
                
                <div className="control-section">
                  <div className="control-label">
                    Góc lăng kính: {prismAngle}°
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={prismAngle}
                    onChange={(e) => setPrismAngle(parseInt(e.target.value))}
                    className="prism-slider"
                  />
                  <div className="button-group">
                    <button className="control-btn" onClick={() => adjustPrism(-10)}>-10°</button>
                    <button className="control-btn" onClick={() => adjustPrism(-5)}>-5°</button>
                    <button className="control-btn" onClick={() => adjustPrism(5)}>+5°</button>
                    <button className="control-btn" onClick={() => adjustPrism(10)}>+10°</button>
                  </div>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showSpectrum}
                    onChange={(e) => setShowSpectrum(e.target.checked)}
                  />
                  <span>Hiện quang phổ</span>
                </label>
              </div>
            )}

            <button className="check-btn" onClick={checkTarget}>
              <Sparkles size={20} />
              <span>{mode === 'mixing' ? 'Kiểm tra màu' : 'Xác nhận'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSpectrumStudio;
