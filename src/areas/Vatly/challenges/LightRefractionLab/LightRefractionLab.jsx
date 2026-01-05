import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Lightbulb, Eye } from 'lucide-react';
import './LightRefractionLab.css';

/**
 * Light Refraction Lab - Grade 9 Physics Game
 * Demonstrates Snell's law of light refraction
 * Physics: n₁sin(θ₁) = n₂sin(θ₂)
 */

const LightRefractionLab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [targetsCompleted, setTargetsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Physics variables
  const [incidentAngle, setIncidentAngle] = useState(30); // θ₁ (degrees)
  const [refractedAngle, setRefractedAngle] = useState(0); // θ₂ (degrees)
  const [medium1Index, setMedium1Index] = useState(1.0); // n₁ (không khí)
  const [medium2Index, setMedium2Index] = useState(1.33); // n₂ (nước)
  const [showRay, setShowRay] = useState(true);
  const [showNormal, setShowNormal] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  // Target values for challenges
  const [targetAngle, setTargetAngle] = useState(0);
  const [targetMedium, setTargetMedium] = useState('');

  // Available media
  const mediaOptions = [
    { name: 'Không khí', index: 1.0, color: '#e0f2fe' },
    { name: 'Nước', index: 1.33, color: '#bfdbfe' },
    { name: 'Thủy tinh', index: 1.5, color: '#93c5fd' },
    { name: 'Kim cương', index: 2.42, color: '#60a5fa' }
  ];

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Không khí sang nước',
      description: 'Làm quen với hiện tượng khúc xạ ánh sáng',
      duration: 120,
      targetsNeeded: 3,
      medium1: 1.0,
      medium2: 1.33,
      allowedMedia: ['Không khí', 'Nước']
    },
    {
      id: 2,
      name: 'Trung bình - Nhiều môi trường',
      description: 'Thí nghiệm với thủy tinh và nước',
      duration: 150,
      targetsNeeded: 4,
      medium1: 1.0,
      medium2: 1.5,
      allowedMedia: ['Không khí', 'Nước', 'Thủy tinh']
    },
    {
      id: 3,
      name: 'Nâng cao - Phản xạ toàn phần',
      description: 'Khám phá hiện tượng phản xạ toàn phần',
      duration: 180,
      targetsNeeded: 5,
      medium1: 1.5,
      medium2: 1.0,
      allowedMedia: ['Không khí', 'Nước', 'Thủy tinh']
    },
    {
      id: 4,
      name: 'Chuyên gia - Kim cương',
      description: 'Làm việc với môi trường chiết suất cao',
      duration: 240,
      targetsNeeded: 6,
      medium1: 1.0,
      medium2: 2.42,
      allowedMedia: ['Không khí', 'Nước', 'Thủy tinh', 'Kim cương']
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Calculate refracted angle using Snell's law
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Snell's law: n₁sin(θ₁) = n₂sin(θ₂)
    // θ₂ = arcsin((n₁/n₂) × sin(θ₁))
    
    const theta1Rad = incidentAngle * Math.PI / 180;
    const sinTheta1 = Math.sin(theta1Rad);
    const ratio = medium1Index / medium2Index;
    const sinTheta2 = ratio * sinTheta1;

    // Check for total internal reflection
    if (sinTheta2 > 1) {
      // Total internal reflection occurs
      setRefractedAngle(-1); // Special value indicating TIR
    } else {
      const theta2Rad = Math.asin(sinTheta2);
      const theta2Deg = theta2Rad * 180 / Math.PI;
      setRefractedAngle(theta2Deg);
    }
  }, [incidentAngle, medium1Index, medium2Index, gameState]);

  // Generate new target
  const generateTarget = useCallback(() => {
    const targetAngle = 10 + Math.random() * 50; // 10-60 degrees
    setTargetAngle(targetAngle);

    // Random target medium
    const allowedMedia = currentLevel.allowedMedia;
    const randomMedium = allowedMedia[Math.floor(Math.random() * allowedMedia.length)];
    setTargetMedium(randomMedium);
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
      drawRefraction(ctx, width, height);
    }
  }, [incidentAngle, refractedAngle, medium1Index, medium2Index, showRay, showNormal, showAngles, gameState]);

  const drawRefraction = (ctx, width, height) => {
    const centerX = width / 2;
    const interfaceY = height / 2;

    // Get medium colors
    const medium1 = mediaOptions.find(m => m.index === medium1Index);
    const medium2 = mediaOptions.find(m => m.index === medium2Index);

    // Draw media
    // Top medium (incident)
    ctx.fillStyle = medium1 ? medium1.color : '#e0f2fe';
    ctx.fillRect(0, 0, width, interfaceY);

    // Bottom medium (refracted)
    ctx.fillStyle = medium2 ? medium2.color : '#bfdbfe';
    ctx.fillRect(0, interfaceY, width, height - interfaceY);

    // Draw interface line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, interfaceY);
    ctx.lineTo(width, interfaceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw normal line
    if (showNormal) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Normal label
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Pháp tuyến', centerX + 50, 30);
    }

    // Draw incident ray
    if (showRay) {
      const rayLength = 200;
      const theta1Rad = incidentAngle * Math.PI / 180;
      
      // Incident ray (from top-left to interface)
      const startX = centerX - rayLength * Math.sin(theta1Rad);
      const startY = interfaceY - rayLength * Math.cos(theta1Rad);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(centerX, interfaceY);
      ctx.stroke();

      // Arrow for incident ray
      drawArrow(ctx, startX, startY, centerX, interfaceY, '#fbbf24');

      // Incident ray label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Tia tới', startX - 20, startY - 10);

      // Draw refracted ray or reflection
      if (refractedAngle === -1) {
        // Total internal reflection
        const reflectX = centerX + rayLength * Math.sin(theta1Rad);
        const reflectY = interfaceY - rayLength * Math.cos(theta1Rad);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, interfaceY);
        ctx.lineTo(reflectX, reflectY);
        ctx.stroke();

        drawArrow(ctx, centerX, interfaceY, reflectX, reflectY, '#ef4444');

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PHẢN XẠ TOÀN PHẦN', centerX, interfaceY + 150);
      } else {
        // Normal refraction
        const theta2Rad = refractedAngle * Math.PI / 180;
        const endX = centerX + rayLength * Math.sin(theta2Rad);
        const endY = interfaceY + rayLength * Math.cos(theta2Rad);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, interfaceY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        drawArrow(ctx, centerX, interfaceY, endX, endY, '#10b981');

        // Refracted ray label
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Tia khúc xạ', endX + 20, endY + 20);
      }

      // Draw angles
      if (showAngles) {
        // Incident angle arc
        drawAngleArc(ctx, centerX, interfaceY, 60, -90, -90 + incidentAngle, '#fbbf24');
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        const labelX1 = centerX + 80 * Math.sin((incidentAngle / 2) * Math.PI / 180);
        const labelY1 = interfaceY - 80 * Math.cos((incidentAngle / 2) * Math.PI / 180);
        ctx.fillText(`θ₁ = ${incidentAngle}°`, labelX1, labelY1);

        // Refracted angle arc (if not TIR)
        if (refractedAngle !== -1) {
          drawAngleArc(ctx, centerX, interfaceY, 60, 90, 90 - refractedAngle, '#10b981');
          ctx.fillStyle = '#10b981';
          const labelX2 = centerX + 80 * Math.sin((refractedAngle / 2) * Math.PI / 180);
          const labelY2 = interfaceY + 80 * Math.cos((refractedAngle / 2) * Math.PI / 180);
          ctx.fillText(`θ₂ = ${refractedAngle.toFixed(1)}°`, labelX2, labelY2);
        }
      }
    }

    // Draw medium labels
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${medium1 ? medium1.name : 'Medium 1'} (n₁ = ${medium1Index.toFixed(2)})`, 20, 30);
    ctx.fillText(`${medium2 ? medium2.name : 'Medium 2'} (n₂ = ${medium2Index.toFixed(2)})`, 20, interfaceY + 30);

    // Draw light source
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX - 180 * Math.sin(incidentAngle * Math.PI / 180), 
            interfaceY - 180 * Math.cos(incidentAngle * Math.PI / 180), 
            15, 0, Math.PI * 2);
    ctx.fill();

    // Light rays from source
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 180 * Math.sin(incidentAngle * Math.PI / 180), 
                 interfaceY - 180 * Math.cos(incidentAngle * Math.PI / 180));
      ctx.lineTo(centerX - 180 * Math.sin(incidentAngle * Math.PI / 180) + 20 * Math.cos(angle), 
                 interfaceY - 180 * Math.cos(incidentAngle * Math.PI / 180) + 20 * Math.sin(angle));
      ctx.stroke();
    }
  };

  const drawArrow = (ctx, x1, y1, x2, y2, color) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle - arrowAngle),
      y2 - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle + arrowAngle),
      y2 - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawAngleArc = (ctx, x, y, radius, startAngle, endAngle, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
    ctx.stroke();
  };

  const adjustIncidentAngle = (delta) => {
    setIncidentAngle(prev => {
      const newAngle = prev + delta;
      return Math.max(0, Math.min(89, newAngle));
    });
  };

  const setMedium1 = (mediumName) => {
    const medium = mediaOptions.find(m => m.name === mediumName);
    if (medium) {
      setMedium1Index(medium.index);
    }
  };

  const setMedium2 = (mediumName) => {
    const medium = mediaOptions.find(m => m.name === mediumName);
    if (medium) {
      setMedium2Index(medium.index);
    }
  };

  const checkTarget = useCallback(() => {
    // Check if angle is close to target
    const angleMatch = Math.abs(incidentAngle - targetAngle) < 3;
    
    // Check if correct medium is selected
    const targetMediumObj = mediaOptions.find(m => m.name === targetMedium);
    const mediumMatch = targetMediumObj && medium2Index === targetMediumObj.index;

    if (angleMatch && mediumMatch) {
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
  }, [incidentAngle, targetAngle, medium2Index, targetMedium, timeLeft, currentLevel, generateTarget]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetsCompleted(0);
    setTimeLeft(currentLevel.duration);
    setIncidentAngle(30);
    setMedium1Index(currentLevel.medium1);
    setMedium2Index(currentLevel.medium2);
    setShowRay(true);
    setShowNormal(true);
    setShowAngles(true);
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

  // Calculate critical angle for TIR
  const criticalAngle = medium1Index > medium2Index 
    ? Math.asin(medium2Index / medium1Index) * 180 / Math.PI 
    : null;

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="light-refraction-lab">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Lightbulb className="title-icon" size={40} />
            Thí Nghiệm Khúc Xạ Ánh Sáng
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Lightbulb className="menu-icon" size={80} />
            <h2>Thí Nghiệm Khúc Xạ Ánh Sáng</h2>
            <p className="menu-description">
              Khám phá định luật Snell và hiện tượng khúc xạ ánh sáng khi đi qua các môi trường khác nhau
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="formula-section">
                <div className="formula-item">
                  <div className="formula">n₁sin(θ₁) = n₂sin(θ₂)</div>
                  <div className="formula-desc">Định luật Snell</div>
                  <div className="formula-desc">n: Chiết suất</div>
                  <div className="formula-desc">θ: Góc với pháp tuyến</div>
                </div>

                <div className="formula-item">
                  <div className="formula">sin(θgh) = n₂/n₁</div>
                  <div className="formula-desc">Góc giới hạn phản xạ toàn phần</div>
                  <div className="formula-desc">Khi n₁ {'>'} n₂</div>
                  <div className="formula-desc">θ₁ {'>'} θgh → Phản xạ toàn phần</div>
                </div>

                <div className="formula-item">
                  <div className="formula">n = c/v</div>
                  <div className="formula-desc">Chiết suất tuyệt đối</div>
                  <div className="formula-desc">c: Tốc độ ánh sáng chân không</div>
                  <div className="formula-desc">v: Tốc độ trong môi trường</div>
                </div>
              </div>

              <div className="theory-note">
                <strong>Hiện tượng khúc xạ:</strong>
                <p>Khi ánh sáng truyền từ môi trường này sang môi trường khác có chiết suất khác nhau, 
                tia sáng bị gãy khúc tại mặt phân cách. Nếu đi từ môi trường chiết quang kém sang môi trường 
                chiết quang hơn thì tia khúc xạ lệch lại gần pháp tuyến hơn tia tới.</p>
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
      <div className="light-refraction-lab">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Lightbulb className="title-icon" size={40} />
            Thí Nghiệm Khúc Xạ Ánh Sáng
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
    <div className="light-refraction-lab">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Lightbulb className="title-icon" size={40} />
          Khúc Xạ Ánh Sáng - Cấp độ {selectedLevel}
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
            <span className="stat-label">Góc khúc xạ</span>
            <span className="stat-value">
              {refractedAngle === -1 ? 'TIR' : `${refractedAngle.toFixed(1)}°`}
            </span>
          </div>
        </div>

        <div className="game-content">
          <div className="experiment-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="experiment-canvas"
            />
          </div>

          <div className="control-panel">
            <div className="target-info">
              <h3>🎯 Nhiệm vụ</h3>
              <div className="target-item">
                <span className="target-label">Góc tới mục tiêu:</span>
                <span className="target-value">{targetAngle.toFixed(1)}° (±3°)</span>
              </div>
              <div className="target-item">
                <span className="target-label">Môi trường mục tiêu:</span>
                <span className="target-value">{targetMedium}</span>
              </div>
            </div>

            <div className="controls">
              <h3>⚙️ Điều khiển</h3>
              
              <div className="control-section">
                <div className="control-label">
                  Góc tới: {incidentAngle}°
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustIncidentAngle(-5)}>
                    <span>-5°</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustIncidentAngle(-1)}>
                    <span>-1°</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustIncidentAngle(1)}>
                    <span>+1°</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustIncidentAngle(5)}>
                    <span>+5°</span>
                  </button>
                </div>
              </div>

              <div className="control-section">
                <div className="control-label">Môi trường trên (n₁):</div>
                <div className="media-buttons">
                  {mediaOptions
                    .filter(m => currentLevel.allowedMedia.includes(m.name))
                    .map(medium => (
                      <button
                        key={medium.name}
                        className={`media-btn ${medium1Index === medium.index ? 'active' : ''}`}
                        onClick={() => setMedium1(medium.name)}
                      >
                        {medium.name}
                        <span className="media-index">n = {medium.index}</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="control-section">
                <div className="control-label">Môi trường dưới (n₂):</div>
                <div className="media-buttons">
                  {mediaOptions
                    .filter(m => currentLevel.allowedMedia.includes(m.name))
                    .map(medium => (
                      <button
                        key={medium.name}
                        className={`media-btn ${medium2Index === medium.index ? 'active' : ''}`}
                        onClick={() => setMedium2(medium.name)}
                      >
                        {medium.name}
                        <span className="media-index">n = {medium.index}</span>
                      </button>
                    ))}
                </div>
              </div>

              {criticalAngle && (
                <div className="info-box">
                  <strong>⚠️ Góc giới hạn:</strong>
                  <div>θgh = {criticalAngle.toFixed(1)}°</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>
                    Khi θ₁ {'>'} θgh sẽ xảy ra phản xạ toàn phần
                  </div>
                </div>
              )}

              <div className="visibility-controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showNormal}
                    onChange={(e) => setShowNormal(e.target.checked)}
                  />
                  <span>Hiện pháp tuyến</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showAngles}
                    onChange={(e) => setShowAngles(e.target.checked)}
                  />
                  <span>Hiện góc đo</span>
                </label>
              </div>

              <button className="check-btn" onClick={checkTarget}>
                <Eye size={20} />
                <span>Kiểm tra</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightRefractionLab;
