import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Focus, Scan } from 'lucide-react';
import './LensOpticsChallenge.css';

/**
 * Lens Optics Challenge - Grade 9 Physics Game
 * Demonstrates converging and diverging lens properties
 * Physics: 1/f = 1/d + 1/d', magnification k = d'/d = h'/h
 */

const LensOpticsChallenge = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [targetsCompleted, setTargetsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Lens properties
  const [lensType, setLensType] = useState('converging'); // converging or diverging
  const [focalLength, setFocalLength] = useState(15); // cm
  const [objectDistance, setObjectDistance] = useState(30); // d (cm)
  const [objectHeight, setObjectHeight] = useState(3); // h (cm)
  
  // Calculated properties
  const [imageDistance, setImageDistance] = useState(0); // d' (cm)
  const [imageHeight, setImageHeight] = useState(0); // h' (cm)
  const [magnification, setMagnification] = useState(0); // k
  const [imageType, setImageType] = useState('real'); // real, virtual, or none

  // Display options
  const [showRays, setShowRays] = useState(true);
  const [showFocalPoints, setShowFocalPoints] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);

  // Target values
  const [targetImageDistance, setTargetImageDistance] = useState(0);
  const [targetMagnification, setTargetMagnification] = useState(0);

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Thấu kính hội tụ',
      description: 'Làm quen với thấu kính hội tụ và ảnh thật',
      duration: 120,
      targetsNeeded: 3,
      lensType: 'converging',
      focalRange: [10, 20],
      objectDistanceRange: [15, 60]
    },
    {
      id: 2,
      name: 'Trung bình - Độ phóng đại',
      description: 'Điều chỉnh độ phóng đại của ảnh',
      duration: 150,
      targetsNeeded: 4,
      lensType: 'converging',
      focalRange: [10, 25],
      objectDistanceRange: [10, 80]
    },
    {
      id: 3,
      name: 'Nâng cao - Thấu kính phân kì',
      description: 'Khám phá thấu kính phân kì và ảnh ảo',
      duration: 180,
      targetsNeeded: 5,
      lensType: 'diverging',
      focalRange: [-25, -10],
      objectDistanceRange: [10, 60]
    },
    {
      id: 4,
      name: 'Chuyên gia - Tất cả loại thấu kính',
      description: 'Làm chủ cả thấu kính hội tụ và phân kì',
      duration: 240,
      targetsNeeded: 6,
      lensType: 'both',
      focalRange: [-25, 25],
      objectDistanceRange: [5, 100]
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Calculate image properties using thin lens equation
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Thin lens equation: 1/f = 1/d + 1/d'
    // Rearrange: 1/d' = 1/f - 1/d
    // d' = 1 / (1/f - 1/d) = (d × f) / (d - f)

    const d = objectDistance;
    const f = focalLength;
    const h = objectHeight;

    if (lensType === 'converging' && d === f) {
      // Special case: object at focal point, image at infinity
      setImageDistance(Infinity);
      setImageHeight(Infinity);
      setMagnification(Infinity);
      setImageType('none');
    } else {
      const dPrime = (d * f) / (d - f);
      setImageDistance(dPrime);

      // Magnification: k = d'/d = h'/h
      const k = dPrime / d;
      setMagnification(k);

      // Image height: h' = k × h
      const hPrime = k * h;
      setImageHeight(hPrime);

      // Determine image type
      if (lensType === 'converging') {
        if (d > f) {
          // Object beyond focal point: real, inverted image
          setImageType('real');
        } else {
          // Object within focal point: virtual, upright image
          setImageType('virtual');
        }
      } else {
        // Diverging lens always produces virtual, upright image
        setImageType('virtual');
      }
    }
  }, [objectDistance, focalLength, objectHeight, lensType, gameState]);

  // Generate new target
  const generateTarget = useCallback(() => {
    const level = currentLevel;
    
    // Random focal length
    const f = level.focalRange[0] + Math.random() * (level.focalRange[1] - level.focalRange[0]);
    setFocalLength(parseFloat(f.toFixed(1)));

    // Random object distance
    const d = level.objectDistanceRange[0] + Math.random() * (level.objectDistanceRange[1] - level.objectDistanceRange[0]);
    setObjectDistance(parseFloat(d.toFixed(1)));

    // Random lens type if level 4
    if (level.lensType === 'both') {
      setLensType(Math.random() > 0.5 ? 'converging' : 'diverging');
    } else {
      setLensType(level.lensType);
    }

    // Calculate target values
    const dPrime = (d * f) / (d - f);
    setTargetImageDistance(parseFloat(dPrime.toFixed(1)));

    const k = dPrime / d;
    setTargetMagnification(parseFloat(k.toFixed(2)));
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
      drawLensSetup(ctx, width, height);
    }
  }, [objectDistance, imageDistance, imageHeight, focalLength, lensType, showRays, showFocalPoints, showMeasurements, gameState]);

  const drawLensSetup = (ctx, width, height) => {
    const lensX = width / 2;
    const lensY = height / 2;
    const scale = 4; // pixels per cm

    // Draw optical axis
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, lensY);
    ctx.lineTo(width, lensY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw lens
    drawLens(ctx, lensX, lensY, lensType);

    // Draw focal points
    if (showFocalPoints) {
      const fLeft = lensX - Math.abs(focalLength) * scale;
      const fRight = lensX + Math.abs(focalLength) * scale;

      // Left focal point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(fLeft, lensY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('F', fLeft, lensY - 15);

      // Right focal point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(fRight, lensY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('F\'', fRight, lensY - 15);

      // 2F points
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(lensX - 2 * Math.abs(focalLength) * scale, lensY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText('2F', lensX - 2 * Math.abs(focalLength) * scale, lensY - 12);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(lensX + 2 * Math.abs(focalLength) * scale, lensY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('2F\'', lensX + 2 * Math.abs(focalLength) * scale, lensY - 12);
    }

    // Draw object
    const objX = lensX - objectDistance * scale;
    const objH = objectHeight * scale;
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, lensY);
    ctx.lineTo(objX, lensY - objH);
    ctx.stroke();

    // Object arrowhead
    drawArrowhead(ctx, objX, lensY - objH, 'up', '#3b82f6');

    // Object label
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Vật', objX, lensY - objH - 15);

    // Draw image (if exists)
    if (imageDistance !== Infinity && !isNaN(imageDistance)) {
      const imgX = lensX + imageDistance * scale;
      const imgH = imageHeight * scale;

      // Check if image is within canvas bounds
      if (Math.abs(imgX - lensX) < width / 2 - 50 && Math.abs(imgH) < height / 2 - 50) {
        ctx.strokeStyle = imageType === 'real' ? '#10b981' : '#a855f7';
        ctx.lineWidth = 3;
        
        if (imageType === 'virtual') {
          ctx.setLineDash([5, 5]);
        }
        
        ctx.beginPath();
        ctx.moveTo(imgX, lensY);
        ctx.lineTo(imgX, lensY - imgH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Image arrowhead
        const direction = imgH > 0 ? 'up' : 'down';
        drawArrowhead(ctx, imgX, lensY - imgH, direction, imageType === 'real' ? '#10b981' : '#a855f7');

        // Image label
        ctx.fillStyle = imageType === 'real' ? '#10b981' : '#a855f7';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        const label = imageType === 'real' ? 'Ảnh thật' : 'Ảnh ảo';
        ctx.fillText(label, imgX, lensY - imgH - (imgH > 0 ? 15 : -25));
      }

      // Draw rays
      if (showRays) {
        drawRays(ctx, lensX, lensY, objX, objH, imgX, imgH, scale);
      }
    }

    // Draw measurements
    if (showMeasurements) {
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';

      // Object distance
      ctx.fillText(`d = ${objectDistance.toFixed(1)} cm`, objX + (lensX - objX) / 2, lensY + 25);

      // Image distance (if exists)
      if (imageDistance !== Infinity && !isNaN(imageDistance)) {
        const imgX = lensX + imageDistance * scale;
        if (Math.abs(imgX - lensX) < width / 2 - 50) {
          ctx.fillText(`d' = ${imageDistance.toFixed(1)} cm`, lensX + (imgX - lensX) / 2, lensY + 25);
        }
      }
    }
  };

  const drawLens = (ctx, x, y, type) => {
    const lensHeight = 150;
    const lensWidth = 20;

    if (type === 'converging') {
      // Converging lens (convex)
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2);
      ctx.quadraticCurveTo(x + lensWidth, y, x, y + lensHeight / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2);
      ctx.quadraticCurveTo(x - lensWidth, y, x, y + lensHeight / 2);
      ctx.stroke();

      // Lens symbol
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 15, y - lensHeight / 2 - 10);
      ctx.lineTo(x + 15, y - lensHeight / 2 - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2 - 10);
      ctx.lineTo(x + 5, y - lensHeight / 2 - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2 - 10);
      ctx.lineTo(x - 5, y - lensHeight / 2 - 15);
      ctx.stroke();
    } else {
      // Diverging lens (concave)
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2);
      ctx.quadraticCurveTo(x - lensWidth, y, x, y + lensHeight / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - lensHeight / 2);
      ctx.quadraticCurveTo(x + lensWidth, y, x, y + lensHeight / 2);
      ctx.stroke();

      // Lens symbol
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 15, y - lensHeight / 2 - 10);
      ctx.lineTo(x + 15, y - lensHeight / 2 - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 5, y - lensHeight / 2 - 10);
      ctx.lineTo(x, y - lensHeight / 2 - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 5, y - lensHeight / 2 - 10);
      ctx.lineTo(x, y - lensHeight / 2 - 15);
      ctx.stroke();
    }

    // Lens label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const lensLabel = type === 'converging' ? 'TKHT' : 'TKPK';
    ctx.fillText(lensLabel, x, y + lensHeight / 2 + 25);
    ctx.font = '12px Arial';
    ctx.fillText(`f = ${focalLength.toFixed(1)} cm`, x, y + lensHeight / 2 + 40);
  };

  const drawRays = (ctx, lensX, lensY, objX, objH, imgX, imgH, scale) => {
    const objTopY = lensY - objH;

    // Ray 1: Parallel to axis, passes through F' after lens
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(lensX, objTopY);
    ctx.stroke();

    const fRight = lensX + focalLength * scale;
    ctx.beginPath();
    ctx.moveTo(lensX, objTopY);
    
    if (lensType === 'converging') {
      ctx.lineTo(fRight, lensY);
    } else {
      // For diverging, ray bends away
      const slope = objTopY / (focalLength * scale);
      ctx.lineTo(lensX + 300, objTopY + slope * 300);
    }
    ctx.stroke();

    // Ray 2: Through optical center, continues straight
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(lensX, lensY);
    
    const slopeCenter = (lensY - objTopY) / (lensX - objX);
    ctx.lineTo(lensX + 300, lensY + slopeCenter * 300);
    ctx.stroke();

    // Ray 3: Through F, emerges parallel to axis
    if (lensType === 'converging') {
      const fLeft = lensX - focalLength * scale;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      
      // Find intersection with lens
      const slopeToF = (lensY - objTopY) / (fLeft - objX);
      const intersectY = objTopY + slopeToF * (lensX - objX);
      ctx.lineTo(lensX, intersectY);
      ctx.lineTo(lensX + 300, intersectY);
      ctx.stroke();
    }
  };

  const drawArrowhead = (ctx, x, y, direction, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (direction === 'up') {
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y + 10);
      ctx.lineTo(x + 5, y + 10);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y - 10);
      ctx.lineTo(x + 5, y - 10);
    }
    ctx.closePath();
    ctx.fill();
  };

  const adjustObjectDistance = (delta) => {
    setObjectDistance(prev => {
      const newDist = prev + delta;
      return Math.max(5, Math.min(100, newDist));
    });
  };

  const adjustFocalLength = (delta) => {
    setFocalLength(prev => {
      const newFocal = prev + delta;
      if (lensType === 'converging') {
        return Math.max(5, Math.min(50, newFocal));
      } else {
        return Math.max(-50, Math.min(-5, newFocal));
      }
    });
  };

  const toggleLensType = () => {
    if (currentLevel.lensType === 'both') {
      setLensType(prev => prev === 'converging' ? 'diverging' : 'converging');
      setFocalLength(prev => -prev);
    }
  };

  const checkTarget = useCallback(() => {
    // Check if image distance is close to target
    const distanceMatch = Math.abs(imageDistance - targetImageDistance) < 2;
    const magnificationMatch = Math.abs(magnification - targetMagnification) < 0.1;

    if (distanceMatch && magnificationMatch) {
      const basePoints = 200;
      const timeBonus = Math.floor((timeLeft / 10)) * 10;
      const points = basePoints + timeBonus;
      
      setScore(prev => prev + points);
      setTargetsCompleted(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.targetsNeeded) {
          setTimeout(() => setGameState('victory'), 500);
        } else {
          // Generate new target
          generateTarget();
        }
        return newCompleted;
      });
      
      return true;
    }
    return false;
  }, [imageDistance, targetImageDistance, magnification, targetMagnification, timeLeft, currentLevel, generateTarget]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetsCompleted(0);
    setTimeLeft(currentLevel.duration);
    setLensType(currentLevel.lensType === 'both' ? 'converging' : currentLevel.lensType);
    setFocalLength(currentLevel.lensType === 'diverging' ? -15 : 15);
    setObjectDistance(30);
    setObjectHeight(3);
    setShowRays(true);
    setShowFocalPoints(true);
    setShowMeasurements(true);
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
      <div className="lens-optics-challenge">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Focus className="title-icon" size={40} />
            Thử Thách Thấu Kính
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Focus className="menu-icon" size={80} />
            <h2>Thử Thách Thấu Kính</h2>
            <p className="menu-description">
              Khám phá tính chất của thấu kính hội tụ và phân kì, tìm hiểu cách tạo ảnh
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="formula-section">
                <div className="formula-item">
                  <div className="formula">1/f = 1/d + 1/d'</div>
                  <div className="formula-desc">Công thức thấu kính</div>
                  <div className="formula-desc">f: Tiêu cự (cm)</div>
                  <div className="formula-desc">d: Khoảng cách vật (cm)</div>
                  <div className="formula-desc">d': Khoảng cách ảnh (cm)</div>
                </div>

                <div className="formula-item">
                  <div className="formula">k = d'/d = h'/h</div>
                  <div className="formula-desc">Độ phóng đại</div>
                  <div className="formula-desc">k {'>'} 0: Ảnh cùng chiều</div>
                  <div className="formula-desc">k {'<'} 0: Ảnh ngược chiều</div>
                  <div className="formula-desc">|k| {'>'} 1: Ảnh lớn hơn vật</div>
                </div>

                <div className="formula-item">
                  <div className="formula">f {'>'} 0: TKHT</div>
                  <div className="formula">f {'<'} 0: TKPK</div>
                  <div className="formula-desc">Thấu kính hội tụ</div>
                  <div className="formula-desc">Thấu kính phân kì</div>
                </div>
              </div>

              <div className="theory-note">
                <strong>Đặc điểm ảnh:</strong>
                <p><strong>TKHT:</strong> d {'>'} 2f: Ảnh thật, ngược chiều, nhỏ hơn vật | 
                f {'<'} d {'<'} 2f: Ảnh thật, ngược chiều, lớn hơn vật | 
                d {'<'} f: Ảnh ảo, cùng chiều, lớn hơn vật</p>
                <p><strong>TKPK:</strong> Luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật</p>
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
      <div className="lens-optics-challenge">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Focus className="title-icon" size={40} />
            Thử Thách Thấu Kính
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
    <div className="lens-optics-challenge">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Focus className="title-icon" size={40} />
          Thấu Kính - Cấp độ {selectedLevel}
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
            <span className="stat-label">Độ phóng đại</span>
            <span className="stat-value">{magnification.toFixed(2)}×</span>
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
              <div className="target-item">
                <span className="target-label">Khoảng cách ảnh:</span>
                <span className="target-value">{targetImageDistance.toFixed(1)} cm (±2)</span>
              </div>
              <div className="target-item">
                <span className="target-label">Độ phóng đại:</span>
                <span className="target-value">{targetMagnification.toFixed(2)}× (±0.1)</span>
              </div>
            </div>

            <div className="measurements">
              <h3>📊 Đo đạc</h3>
              <div className="measure-item">
                <span className="measure-label">Khoảng cách vật (d):</span>
                <span className="measure-value">{objectDistance.toFixed(1)} cm</span>
              </div>
              <div className="measure-item">
                <span className="measure-label">Khoảng cách ảnh (d'):</span>
                <span className="measure-value">
                  {imageDistance === Infinity ? '∞' : imageDistance.toFixed(1)} cm
                </span>
              </div>
              <div className="measure-item">
                <span className="measure-label">Độ phóng đại (k):</span>
                <span className="measure-value">
                  {magnification === Infinity ? '∞' : magnification.toFixed(2)}
                </span>
              </div>
              <div className="measure-item">
                <span className="measure-label">Loại ảnh:</span>
                <span className="measure-value">
                  {imageType === 'real' ? 'Ảnh thật' : imageType === 'virtual' ? 'Ảnh ảo' : 'Không có ảnh'}
                </span>
              </div>
            </div>

            <div className="controls">
              <h3>⚙️ Điều khiển</h3>
              
              <div className="control-section">
                <div className="control-label">
                  Khoảng cách vật: {objectDistance.toFixed(1)} cm
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustObjectDistance(-5)}>
                    <span>-5</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustObjectDistance(-1)}>
                    <span>-1</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustObjectDistance(1)}>
                    <span>+1</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustObjectDistance(5)}>
                    <span>+5</span>
                  </button>
                </div>
              </div>

              <div className="control-section">
                <div className="control-label">
                  Tiêu cự: {focalLength.toFixed(1)} cm
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustFocalLength(-2)}>
                    <span>-2</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustFocalLength(-0.5)}>
                    <span>-0.5</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustFocalLength(0.5)}>
                    <span>+0.5</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustFocalLength(2)}>
                    <span>+2</span>
                  </button>
                </div>
              </div>

              {currentLevel.lensType === 'both' && (
                <button className="toggle-btn" onClick={toggleLensType}>
                  <Scan size={18} />
                  <span>Đổi loại thấu kính</span>
                </button>
              )}

              <div className="visibility-controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showRays}
                    onChange={(e) => setShowRays(e.target.checked)}
                  />
                  <span>Hiện tia sáng</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showFocalPoints}
                    onChange={(e) => setShowFocalPoints(e.target.checked)}
                  />
                  <span>Hiện tiêu điểm</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showMeasurements}
                    onChange={(e) => setShowMeasurements(e.target.checked)}
                  />
                  <span>Hiện khoảng cách</span>
                </label>
              </div>

              <button className="check-btn" onClick={checkTarget}>
                <Scan size={20} />
                <span>Kiểm tra</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensOpticsChallenge;
