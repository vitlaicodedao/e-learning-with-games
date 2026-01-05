import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Eye, Target } from 'lucide-react';
import './MirrorLabGame.css';

const MirrorLabGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('tutorial');
  const [currentMode, setCurrentMode] = useState('plane');
  const [objectPosition, setObjectPosition] = useState(200);
  const [mirrorType, setMirrorType] = useState('plane');
  const [focalLength, setFocalLength] = useState(100);
  const [showRays, setShowRays] = useState(true);
  const [imageProperties, setImageProperties] = useState(null);
  const [challengeMode, setChallengeMode] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  const challenges = [
    {
      id: 1,
      name: 'Tạo ảnh nhỏ bằng 1/2',
      description: 'Sử dụng gương cầu lồi để tạo ảnh nhỏ bằng 1/2 vật',
      mirrorType: 'convex',
      targetMagnification: 0.5,
      allowedObjectRange: { min: 50, max: 250 },
      allowedFocalRange: { min: 50, max: 150 },
      hint: 'Điều chỉnh vị trí vật và tiêu cự để đạt độ phóng đại = 0.5'
    },
    {
      id: 2,
      name: 'Tạo ảnh thật lớn gấp đôi',
      description: 'Dùng gương cầu lõm để tạo ảnh thật lớn gấp 2 lần vật',
      mirrorType: 'concave',
      targetMagnification: 2.0,
      imageType: 'real',
      allowedObjectRange: { min: 100, max: 300 },
      allowedFocalRange: { min: 80, max: 120 },
      hint: 'Đặt vật ngoài tiêu điểm, điều chỉnh để đạt độ phóng đại = 2'
    },
    {
      id: 3,
      name: 'Tạo ảnh ảo lớn gấp 3',
      description: 'Dùng gương cầu lõm để tạo ảnh ảo lớn gấp 3 lần vật',
      mirrorType: 'concave',
      targetMagnification: 3.0,
      imageType: 'virtual',
      allowedObjectRange: { min: 50, max: 150 },
      allowedFocalRange: { min: 80, max: 120 },
      hint: 'Đặt vật trong tiêu điểm để tạo ảnh ảo phóng đại'
    },
    {
      id: 4,
      name: 'Ứng dụng gương chiếu hậu',
      description: 'Tạo ảnh nhỏ hơn 1/3 vật như gương chiếu hậu xe máy',
      mirrorType: 'convex',
      targetMagnification: 0.33,
      allowedObjectRange: { min: 100, max: 300 },
      allowedFocalRange: { min: 60, max: 100 },
      hint: 'Gương cầu lồi luôn tạo ảnh ảo, nhỏ hơn vật, trường nhìn rộng'
    },
    {
      id: 5,
      name: 'Gương phóng đại',
      description: 'Dùng gương lõm tạo ảnh ảo phóng đại gấp 4 lần',
      mirrorType: 'concave',
      targetMagnification: 4.0,
      imageType: 'virtual',
      allowedObjectRange: { min: 30, max: 100 },
      allowedFocalRange: { min: 80, max: 120 },
      hint: 'Đặt vật rất gần gương, trong tiêu điểm'
    }
  ];

  useEffect(() => {
    if (gameState === 'playing') {
      drawMirrorLab();
    }
  }, [gameState, objectPosition, mirrorType, focalLength, showRays]);

  useEffect(() => {
    calculateImageProperties();
  }, [objectPosition, mirrorType, focalLength]);

  const startFreeMode = () => {
    setGameState('playing');
    setChallengeMode(false);
    setMirrorType('plane');
    setObjectPosition(200);
    setFocalLength(100);
  };

  const startChallengeMode = () => {
    setGameState('playing');
    setChallengeMode(true);
    setLevel(1);
    setScore(0);
    setCompletedChallenges(0);
    loadChallenge(1);
  };

  const loadChallenge = (levelNum) => {
    const challenge = challenges[levelNum - 1];
    setCurrentChallenge(challenge);
    setMirrorType(challenge.mirrorType);
    setObjectPosition(challenge.allowedObjectRange.min + 50);
    setFocalLength(challenge.allowedFocalRange ? challenge.allowedFocalRange.min + 20 : 100);
    setAttempts(3);
  };

  const drawMirrorLab = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const mirrorX = width / 2;

    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1a1a30';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    drawObject(ctx, objectPosition, centerY);

    if (mirrorType === 'plane') {
      drawPlaneMirror(ctx, mirrorX, centerY);
      if (showRays) drawPlaneRays(ctx, objectPosition, mirrorX, centerY);
    } else if (mirrorType === 'convex') {
      drawConvexMirror(ctx, mirrorX, centerY, focalLength);
      if (showRays) drawConvexRays(ctx, objectPosition, mirrorX, centerY, focalLength);
    } else if (mirrorType === 'concave') {
      drawConcaveMirror(ctx, mirrorX, centerY, focalLength);
      if (showRays) drawConcaveRays(ctx, objectPosition, mirrorX, centerY, focalLength);
    }

    if (mirrorType !== 'plane') {
      drawFocalPoint(ctx, mirrorX, centerY, focalLength, mirrorType);
    }
  };

  const drawObject = (ctx, x, centerY) => {
    const objectHeight = 60;
    ctx.strokeStyle = '#4caf50';
    ctx.fillStyle = '#4caf50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x, centerY - objectHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, centerY - objectHeight);
    ctx.lineTo(x - 8, centerY - objectHeight + 15);
    ctx.lineTo(x + 8, centerY - objectHeight + 15);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Vật', x - 15, centerY + 30);
  };

  const drawPlaneMirror = (ctx, x, centerY) => {
    const height = 200;
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, centerY - height / 2);
    ctx.lineTo(x, centerY + height / 2);
    ctx.stroke();
    ctx.strokeStyle = '#80deea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 3, centerY - height / 2 + 10);
    ctx.lineTo(x - 3, centerY + height / 2 - 10);
    ctx.stroke();
  };

  const drawConvexMirror = (ctx, x, centerY, focal) => {
    const radius = focal * 2;
    const height = 180;
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x - radius, centerY, radius, -Math.asin(height / 2 / radius), Math.asin(height / 2 / radius));
    ctx.stroke();
  };

  const drawConcaveMirror = (ctx, x, centerY, focal) => {
    const radius = focal * 2;
    const height = 180;
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x + radius, centerY, radius, Math.PI - Math.asin(height / 2 / radius), Math.PI + Math.asin(height / 2 / radius));
    ctx.stroke();
  };

  const drawFocalPoint = (ctx, mirrorX, centerY, focal, type) => {
    const focalX = type === 'convex' ? mirrorX + focal : mirrorX - focal;
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.arc(focalX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 12px Arial';
    ctx.fillText('F', focalX - 5, centerY - 15);
  };

  const drawPlaneRays = (ctx, objX, mirrorX, centerY) => {
    const objectHeight = 60;
    const dx = mirrorX - objX;
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objectHeight);
    ctx.lineTo(mirrorX, centerY - objectHeight);
    ctx.stroke();
    const imageX = mirrorX + dx;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(mirrorX, centerY - objectHeight);
    ctx.lineTo(imageX, centerY - objectHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f44336';
    ctx.fillStyle = '#f44336';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(imageX, centerY);
    ctx.lineTo(imageX, centerY - objectHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(imageX, centerY - objectHeight);
    ctx.lineTo(imageX - 6, centerY - objectHeight + 12);
    ctx.lineTo(imageX + 6, centerY - objectHeight + 12);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Ảnh', imageX - 15, centerY + 30);
  };

  const drawConvexRays = (ctx, objX, mirrorX, centerY, focal) => {
    const objectHeight = 60;
    const objectDist = mirrorX - objX;
    const imageDist = (objectDist * focal) / (objectDist + focal);
    const imageHeight = objectHeight * imageDist / objectDist;
    const imageX = mirrorX + imageDist;
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objectHeight);
    ctx.lineTo(mirrorX, centerY - objectHeight);
    ctx.stroke();
    ctx.strokeStyle = '#ff9800';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(mirrorX, centerY - objectHeight);
    ctx.lineTo(imageX, centerY - imageHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f44336';
    ctx.fillStyle = '#f44336';
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(imageX, centerY);
    ctx.lineTo(imageX, centerY - imageHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(imageX, centerY - imageHeight);
    ctx.lineTo(imageX - 4, centerY - imageHeight + 8);
    ctx.lineTo(imageX + 4, centerY - imageHeight + 8);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Ảnh ảo', imageX - 20, centerY - imageHeight - 10);
  };

  const drawConcaveRays = (ctx, objX, mirrorX, centerY, focal) => {
    const objectHeight = 60;
    const objectDist = mirrorX - objX;
    if (objectDist > focal) {
      const imageDist = (objectDist * focal) / (objectDist - focal);
      const imageHeight = objectHeight * imageDist / objectDist;
      const imageX = mirrorX - imageDist;
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, centerY - objectHeight);
      ctx.lineTo(mirrorX, centerY - objectHeight);
      ctx.stroke();
      ctx.strokeStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(mirrorX, centerY - objectHeight);
      ctx.lineTo(imageX, centerY + imageHeight);
      ctx.stroke();
      ctx.strokeStyle = '#f44336';
      ctx.fillStyle = '#f44336';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(imageX, centerY);
      ctx.lineTo(imageX, centerY + imageHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(imageX, centerY + imageHeight);
      ctx.lineTo(imageX - 5, centerY + imageHeight - 10);
      ctx.lineTo(imageX + 5, centerY + imageHeight - 10);
      ctx.closePath();
      ctx.fill();
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Ảnh thật', imageX - 25, centerY + imageHeight + 20);
    } else {
      const imageDist = (objectDist * focal) / (focal - objectDist);
      const imageHeight = objectHeight * imageDist / objectDist;
      const imageX = mirrorX + imageDist;
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, centerY - objectHeight);
      ctx.lineTo(mirrorX, centerY - objectHeight);
      ctx.stroke();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(mirrorX, centerY - objectHeight);
      ctx.lineTo(imageX, centerY - imageHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#f44336';
      ctx.fillStyle = '#f44336';
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(imageX, centerY);
      ctx.lineTo(imageX, centerY - imageHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(imageX, centerY - imageHeight);
      ctx.lineTo(imageX - 5, centerY - imageHeight + 10);
      ctx.lineTo(imageX + 5, centerY - imageHeight + 10);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Ảnh ảo', imageX - 20, centerY - imageHeight - 10);
    }
  };

  const calculateImageProperties = () => {
    const mirrorX = 400;
    const objectDist = mirrorX - objectPosition;
    let properties = {};
    if (mirrorType === 'plane') {
      properties = {
        type: 'Ảnh ảo',
        position: `${objectDist}cm sau gương`,
        size: 'Bằng vật',
        orientation: 'Cùng chiều',
        magnification: 1.0
      };
    } else if (mirrorType === 'convex') {
      const imageDist = (objectDist * focalLength) / (objectDist + focalLength);
      const mag = imageDist / objectDist;
      properties = {
        type: 'Ảnh ảo',
        position: `${imageDist.toFixed(1)}cm trong gương`,
        size: mag < 1 ? 'Nhỏ hơn vật' : 'Bằng vật',
        orientation: 'Cùng chiều',
        magnification: mag
      };
    } else if (mirrorType === 'concave') {
      if (objectDist > focalLength) {
        const imageDist = (objectDist * focalLength) / (objectDist - focalLength);
        const mag = imageDist / objectDist;
        properties = {
          type: 'Ảnh thật',
          position: `${imageDist.toFixed(1)}cm trước gương`,
          size: mag > 1 ? 'Lớn hơn vật' : mag < 1 ? 'Nhỏ hơn vật' : 'Bằng vật',
          orientation: 'Ngược chiều',
          magnification: mag
        };
      } else {
        const imageDist = (objectDist * focalLength) / (focalLength - objectDist);
        const mag = imageDist / objectDist;
        properties = {
          type: 'Ảnh ảo',
          position: `${imageDist.toFixed(1)}cm sau gương`,
          size: 'Lớn hơn vật',
          orientation: 'Cùng chiều',
          magnification: mag
        };
      }
    }
    setImageProperties(properties);
  };

  const checkChallenge = () => {
    if (!currentChallenge || !imageProperties) return;
    let success = false;
    const tolerance = 0.15;
    if (currentChallenge.targetMagnification) {
      const targetMag = currentChallenge.targetMagnification;
      const actualMag = Math.abs(imageProperties.magnification);
      const diff = Math.abs(actualMag - targetMag);
      if (diff / targetMag <= tolerance) {
        if (currentChallenge.imageType) {
          const expectedType = currentChallenge.imageType === 'real' ? 'Ảnh thật' : 'Ảnh ảo';
          success = imageProperties.type === expectedType;
        } else {
          success = true;
        }
      }
    }
    if (success) {
      handleChallengeSuccess();
    } else {
      handleChallengeFailure();
    }
  };

  const handleChallengeSuccess = () => {
    const points = 200 + (attempts * 50);
    setScore(score + points);
    setCompletedChallenges(completedChallenges + 1);
    setTimeout(() => {
      if (level < challenges.length) {
        setLevel(level + 1);
        loadChallenge(level + 1);
      } else {
        setGameState('victory');
      }
    }, 1500);
  };

  const handleChallengeFailure = () => {
    setAttempts(attempts - 1);
    if (attempts <= 1) {
      setGameState('gameover');
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setCompletedChallenges(0);
    setGameState('playing');
    loadChallenge(1);
  };

  return (
    <div className="mirror-lab-game">
      <div className="game-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className="game-title">
          <Eye className="title-icon" />
          <h1>Phòng Thí Nghiệm Gương</h1>
        </div>
        <div className="game-stats">
          <div className="stat-item">
            <Award className="stat-icon" />
            <span>{score} điểm</span>
          </div>
          {challengeMode && (
            <div className="stat-item">
              <Target className="stat-icon" />
              <span>Cấp {level}/{challenges.length}</span>
            </div>
          )}
        </div>
      </div>

      {gameState === 'tutorial' && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <h2>🔬 Chào mừng đến phòng thí nghiệm!</h2>
            <div className="tutorial-info">
              <p>Khám phá 3 loại gương:</p>
              <ul>
                <li>🪞 <strong>Gương phẳng:</strong> Tạo ảnh ảo, cùng kích thước</li>
                <li>⚫ <strong>Gương cầu lồi:</strong> Tạo ảnh ảo nhỏ hơn, trường nhìn rộng</li>
                <li>⚪ <strong>Gương cầu lõm:</strong> Có thể tạo ảnh thật hoặc ảnh ảo</li>
              </ul>
            </div>
            <div className="mode-selection">
              <button onClick={startFreeMode} className="mode-button">
                🔬 Thực Hành Tự Do
              </button>
              <button onClick={startChallengeMode} className="mode-button challenge-btn">
                🎯 Chế Độ Thử Thách
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-content">
          {challengeMode && currentChallenge && (
            <div className="challenge-info">
              <h3>{currentChallenge.name}</h3>
              <p>{currentChallenge.description}</p>
              <div className="attempts-indicator">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`attempt-dot ${i < attempts ? 'active' : 'used'}`}
                  />
                ))}
              </div>
              <p className="hint-text">💡 {currentChallenge.hint}</p>
            </div>
          )}

          <div className="lab-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="lab-canvas"
            />
          </div>

          <div className="controls-panel">
            {!challengeMode && (
              <div className="mirror-type-selector">
                <button
                  onClick={() => setMirrorType('plane')}
                  className={`mirror-type-btn ${mirrorType === 'plane' ? 'active' : ''}`}
                >
                  Gương Phẳng
                </button>
                <button
                  onClick={() => setMirrorType('convex')}
                  className={`mirror-type-btn ${mirrorType === 'convex' ? 'active' : ''}`}
                >
                  Gương Lồi
                </button>
                <button
                  onClick={() => setMirrorType('concave')}
                  className={`mirror-type-btn ${mirrorType === 'concave' ? 'active' : ''}`}
                >
                  Gương Lõm
                </button>
              </div>
            )}

            <div className="control-group">
              <label>Vị trí vật: {objectPosition}cm</label>
              <input
                type="range"
                min={challengeMode && currentChallenge ? currentChallenge.allowedObjectRange.min : 50}
                max={challengeMode && currentChallenge ? currentChallenge.allowedObjectRange.max : 350}
                value={objectPosition}
                onChange={(e) => setObjectPosition(parseInt(e.target.value))}
                className="control-slider"
              />
            </div>

            {mirrorType !== 'plane' && (
              <div className="control-group">
                <label>Tiêu cự: {focalLength}cm</label>
                <input
                  type="range"
                  min={challengeMode && currentChallenge?.allowedFocalRange ? currentChallenge.allowedFocalRange.min : 50}
                  max={challengeMode && currentChallenge?.allowedFocalRange ? currentChallenge.allowedFocalRange.max : 150}
                  value={focalLength}
                  onChange={(e) => setFocalLength(parseInt(e.target.value))}
                  className="control-slider"
                />
              </div>
            )}

            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showRays}
                  onChange={(e) => setShowRays(e.target.checked)}
                />
                <span>Hiển thị tia sáng và ảnh</span>
              </label>
            </div>
          </div>

          {imageProperties && (
            <div className="image-properties-panel">
              <h3>📊 Tính chất của ảnh</h3>
              <div className="properties-grid">
                <div className="property-item">
                  <span className="property-label">Loại ảnh:</span>
                  <span className="property-value">{imageProperties.type}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Vị trí:</span>
                  <span className="property-value">{imageProperties.position}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Kích thước:</span>
                  <span className="property-value">{imageProperties.size}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Chiều:</span>
                  <span className="property-value">{imageProperties.orientation}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Độ phóng đại:</span>
                  <span className="property-value">{imageProperties.magnification.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            {challengeMode ? (
              <>
                <button onClick={checkChallenge} className="check-button">
                  <Target size={20} />
                  Kiểm Tra
                </button>
                <button onClick={() => loadChallenge(level)} className="reset-button">
                  <RotateCcw size={20} />
                  Đặt Lại
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setGameState('tutorial')} className="back-to-menu-button">
                  Về Menu
                </button>
                <button onClick={startChallengeMode} className="challenge-mode-button">
                  🎯 Chế Độ Thử Thách
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="game-over-overlay victory">
          <div className="game-over-content">
            <h2>🎉 Hoàn Thành Xuất Sắc!</h2>
            <p className="final-score">{score} điểm</p>
            <p className="completion-text">
              Hoàn thành {completedChallenges}/{challenges.length} thử thách!
            </p>
            <div className="achievement-stars">
              {['⭐', '⭐', '⭐'].map((star, i) => (
                <span key={i} className="star">{star}</span>
              ))}
            </div>
            <div className="victory-buttons">
              <button onClick={resetGame} className="retry-button">
                <RotateCcw size={20} />
                Chơi Lại
              </button>
              <button onClick={() => navigate('/physics-games/grade/7')} className="home-button">
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>💪 Thử Lại Nhé!</h2>
            <p className="final-score">{score} điểm</p>
            <p>Hoàn thành: {completedChallenges}/{challenges.length} thử thách</p>
            <div className="gameover-buttons">
              <button onClick={resetGame} className="retry-button">
                <RotateCcw size={20} />
                Thử Lại
              </button>
              <button onClick={() => navigate('/physics-games/grade/7')} className="home-button">
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MirrorLabGame;
