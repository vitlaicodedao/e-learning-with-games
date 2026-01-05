import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Trophy, Target, Info } from 'lucide-react';
import './ArchimedesChallenge.css';

const ArchimedesChallenge = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Physics state
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [waterLevel, setWaterLevel] = useState(300);
  const [targetCondition, setTargetCondition] = useState('');
  const [feedback, setFeedback] = useState('');

  const WATER_DENSITY = 1000; // kg/m³
  const GRAVITY = 9.81; // m/s²
  const WATER_SURFACE_Y = 200;

  const levels = [
    {
      id: 1,
      name: 'Nguyên Lý Cơ Bản',
      description: 'Thả vật vào nước và quan sát lực đẩy Archimedes',
      objects: [
        { id: 1, name: 'Khối Gỗ', mass: 0.5, volume: 0.001, density: 500, color: '#d97706', x: 100, y: 50 },
        { id: 2, name: 'Khối Sắt', mass: 7.8, volume: 0.001, density: 7800, color: '#64748b', x: 200, y: 50 },
        { id: 3, name: 'Khối Nhôm', mass: 2.7, volume: 0.001, density: 2700, color: '#94a3b8', x: 300, y: 50 }
      ],
      target: 'float',
      instruction: 'Tìm vật nổi trên mặt nước'
    },
    {
      id: 2,
      name: 'Vật Chìm',
      description: 'Xác định vật nào sẽ chìm xuống đáy',
      objects: [
        { id: 1, name: 'Bi Nhựa', mass: 0.3, volume: 0.0005, density: 600, color: '#ef4444', x: 100, y: 50 },
        { id: 2, name: 'Bi Thép', mass: 3.9, volume: 0.0005, density: 7800, color: '#475569', x: 200, y: 50 },
        { id: 3, name: 'Bi Nhôm', mass: 1.35, volume: 0.0005, density: 2700, color: '#9ca3af', x: 300, y: 50 }
      ],
      target: 'sink',
      instruction: 'Tìm vật chìm xuống đáy'
    },
    {
      id: 3,
      name: 'Vật Lơ Lửng',
      description: 'Tìm vật có mật độ bằng nước (lơ lửng)',
      objects: [
        { id: 1, name: 'Khối A', mass: 1.0, volume: 0.001, density: 1000, color: '#3b82f6', x: 100, y: 50 },
        { id: 2, name: 'Khối B', mass: 0.8, volume: 0.001, density: 800, color: '#10b981', x: 200, y: 50 },
        { id: 3, name: 'Khối C', mass: 1.5, volume: 0.001, density: 1500, color: '#8b5cf6', x: 300, y: 50 }
      ],
      target: 'suspend',
      instruction: 'Tìm vật lơ lửng trong nước'
    },
    {
      id: 4,
      name: 'Thử Thách Cuối',
      description: 'Sắp xếp các vật theo thứ tự chìm, lơ lửng, nổi',
      objects: [
        { id: 1, name: 'Gỗ', mass: 0.6, volume: 0.001, density: 600, color: '#d97706', x: 100, y: 50 },
        { id: 2, name: 'Nước Đá', mass: 0.92, volume: 0.001, density: 920, color: '#60a5fa', x: 200, y: 50 },
        { id: 3, name: 'Thủy Tinh', mass: 2.5, volume: 0.001, density: 2500, color: '#06b6d4', x: 300, y: 50 },
        { id: 4, name: 'Nhựa', mass: 0.95, volume: 0.001, density: 950, color: '#22c55e', x: 400, y: 50 }
      ],
      target: 'all',
      instruction: 'Thả tất cả vật vào nước'
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      resetLevel();
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [objects, gameState]);

  const resetLevel = () => {
    setObjects(currentLevel.objects.map(obj => ({
      ...obj,
      x: obj.x,
      y: obj.y,
      vy: 0,
      inWater: false,
      settled: false
    })));
    setSelectedObject(null);
    setIsDragging(false);
    setFeedback('');
  };

  const gameLoop = () => {
    updatePhysics();
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updatePhysics = () => {
    setObjects(prevObjects => {
      const newObjects = prevObjects.map(obj => {
        if (obj.settled || isDragging && selectedObject === obj.id) {
          return obj;
        }

        let newY = obj.y;
        let newVy = obj.vy;
        const objectSize = Math.cbrt(obj.volume) * 100; // Convert to pixels

        // Check if in water
        const inWater = obj.y + objectSize / 2 > WATER_SURFACE_Y;

        if (inWater) {
          // Calculate forces
          const weight = obj.mass * GRAVITY; // Weight force (down)
          const buoyancy = WATER_DENSITY * obj.volume * GRAVITY; // Buoyancy force (up)
          const netForce = weight - buoyancy;
          
          // Acceleration
          const acceleration = netForce / obj.mass;
          
          // Apply water resistance
          newVy = (newVy + acceleration * 0.016) * 0.95;

          // Update position
          newY += newVy;

          // Check if settled
          if (Math.abs(newVy) < 0.1) {
            // Determine final position based on density
            if (obj.density < WATER_DENSITY) {
              // Float - partially submerged
              const submergedRatio = obj.density / WATER_DENSITY;
              newY = WATER_SURFACE_Y + (objectSize * submergedRatio) - objectSize / 2;
            } else if (obj.density > WATER_DENSITY) {
              // Sink - rest at bottom
              newY = Math.min(newY, 550 - objectSize / 2);
            } else {
              // Suspend - stay in middle
              newY = WATER_SURFACE_Y + 100;
            }
            
            return { ...obj, y: newY, vy: 0, inWater: true, settled: true };
          }

          return { ...obj, y: newY, vy: newVy, inWater: true };
        } else {
          // In air - fall
          newVy += GRAVITY * 0.016;
          newY += newVy;
          return { ...obj, y: newY, vy: newVy, inWater: false };
        }
      });

      // Check victory condition
      checkVictory(newObjects);

      return newObjects;
    });
  };

  const checkVictory = (currentObjects) => {
    const settledCount = currentObjects.filter(obj => obj.settled).length;
    
    if (settledCount === currentLevel.objects.length) {
      const floatingObjects = currentObjects.filter(obj => obj.density < WATER_DENSITY);
      const sinkingObjects = currentObjects.filter(obj => obj.density > WATER_DENSITY);
      const suspendingObjects = currentObjects.filter(obj => obj.density === WATER_DENSITY);

      let success = false;
      let message = '';

      if (currentLevel.target === 'float' && floatingObjects.length > 0) {
        success = true;
        message = `✓ Đúng! ${floatingObjects[0].name} có mật độ < 1000 kg/m³ nên nổi`;
      } else if (currentLevel.target === 'sink' && sinkingObjects.length > 0) {
        success = true;
        message = `✓ Đúng! ${sinkingObjects[0].name} có mật độ > 1000 kg/m³ nên chìm`;
      } else if (currentLevel.target === 'suspend' && suspendingObjects.length > 0) {
        success = true;
        message = `✓ Đúng! ${suspendingObjects[0].name} có mật độ = 1000 kg/m³ nên lơ lửng`;
      } else if (currentLevel.target === 'all') {
        success = true;
        message = `✓ Hoàn thành! ${floatingObjects.length} nổi, ${suspendingObjects.length} lơ lửng, ${sinkingObjects.length} chìm`;
      }

      if (success) {
        setFeedback(message);
        setTimeout(() => {
          if (level < levels.length) {
            setLevel(l => l + 1);
            setScore(s => s + 250);
            setGameState('playing');
          } else {
            setScore(s => s + 250);
            setGameState('victory');
          }
        }, 2500);
      }
    }
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);

    // Draw container
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, WATER_SURFACE_Y, 700, 360);

    // Draw water
    const gradient = ctx.createLinearGradient(0, WATER_SURFACE_Y, 0, 560);
    gradient.addColorStop(0, '#3b82f680');
    gradient.addColorStop(1, '#1e40af80');
    ctx.fillStyle = gradient;
    ctx.fillRect(50, WATER_SURFACE_Y, 700, 360);

    // Water surface line
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 10]);
    ctx.beginPath();
    ctx.moveTo(50, WATER_SURFACE_Y);
    ctx.lineTo(750, WATER_SURFACE_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw water level markers
    for (let i = 0; i <= 3; i++) {
      const y = WATER_SURFACE_Y + i * 90;
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(750, y);
      ctx.stroke();
    }

    // Draw objects
    objects.forEach(obj => {
      const size = Math.cbrt(obj.volume) * 100;
      const x = obj.x;
      const y = obj.y;

      // Shadow
      if (!obj.inWater) {
        ctx.fillStyle = '#00000020';
        ctx.fillRect(x - size / 2 + 5, y + size / 2 + 5, size, 8);
      }

      // Object body
      ctx.fillStyle = obj.color;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      
      ctx.strokeStyle = '#00000040';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - size / 2, y - size / 2, size, size);

      // Highlight if dragging
      if (isDragging && selectedObject === obj.id) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - size / 2 - 3, y - size / 2 - 3, size + 6, size + 6);
      }

      // Label
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(obj.name, x, y);
      ctx.font = '10px Arial';
      ctx.fillText(`ρ=${obj.density}`, x, y + 12);

      // Force arrows when in water
      if (obj.inWater && obj.settled) {
        const weight = obj.mass * GRAVITY;
        const buoyancy = WATER_DENSITY * obj.volume * GRAVITY;

        // Weight arrow (down) - red
        const weightLength = weight * 5;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + weightLength);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(x, y + weightLength);
        ctx.lineTo(x - 5, y + weightLength - 8);
        ctx.lineTo(x + 5, y + weightLength - 8);
        ctx.closePath();
        ctx.fill();

        // Buoyancy arrow (up) - blue
        const buoyancyLength = buoyancy * 5;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - buoyancyLength);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(x, y - buoyancyLength);
        ctx.lineTo(x - 5, y - buoyancyLength + 8);
        ctx.lineTo(x + 5, y - buoyancyLength + 8);
        ctx.closePath();
        ctx.fill();

        // Force labels
        ctx.fillStyle = '#ef4444';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`P=${weight.toFixed(1)}N`, x + 8, y + weightLength / 2);
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`FA=${buoyancy.toFixed(1)}N`, x + 8, y - buoyancyLength / 2);
      }
    });

    // Draw formula
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Công thức: FA = ρ × V × g', 60, 30);
    ctx.font = '14px Arial';
    ctx.fillText('ρnước = 1000 kg/m³', 60, 55);
    ctx.fillText('Nổi: ρvật < ρnước | Chìm: ρvật > ρnước | Lơ lửng: ρvật = ρnước', 60, 80);

    // Draw instruction
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0ea5e9';
    ctx.fillText(currentLevel.instruction, width / 2, 130);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on object
    const clickedObject = objects.find(obj => {
      const size = Math.cbrt(obj.volume) * 100;
      return (
        x >= obj.x - size / 2 &&
        x <= obj.x + size / 2 &&
        y >= obj.y - size / 2 &&
        y <= obj.y + size / 2
      );
    });

    if (clickedObject) {
      setSelectedObject(clickedObject.id);
      setIsDragging(true);
      setDragOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === selectedObject
          ? { ...obj, x: x - dragOffset.x, y: y - dragOffset.y, vy: 0, settled: false }
          : obj
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedObject(null);
  };

  return (
    <div className="archimedes-challenge">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>🛟 Thử Thách Archimedes</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Target size={16} />
            {score} điểm
          </span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="intro-card">
            <h2>{currentLevel.name}</h2>
            <p className="level-desc">{currentLevel.description}</p>

            <div className="theory-box">
              <h3>
                <Info size={20} />
                Nguyên lý Archimedes
              </h3>
              <div className="theory-content">
                <p>
                  <strong>Lực đẩy Archimedes:</strong> Một vật nhúng trong chất lỏng sẽ chịu một lực đẩy hướng lên có độ lớn bằng trọng lượng của phần chất lỏng bị vật chiếm chỗ.
                </p>
                <div className="formula-box">
                  <strong>Công thức:</strong> F<sub>A</sub> = ρ × V × g
                </div>
                <ul className="theory-list">
                  <li><strong>Vật nổi:</strong> ρ<sub>vật</sub> &lt; ρ<sub>nước</sub> → F<sub>A</sub> &gt; P</li>
                  <li><strong>Vật chìm:</strong> ρ<sub>vật</sub> &gt; ρ<sub>nước</sub> → F<sub>A</sub> &lt; P</li>
                  <li><strong>Vật lơ lửng:</strong> ρ<sub>vật</sub> = ρ<sub>nước</sub> → F<sub>A</sub> = P</li>
                </ul>
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Droplets size={20} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="instruction-panel">
            <p>👆 Kéo và thả vật vào nước để xem chúng nổi, chìm hay lơ lửng</p>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {feedback && (
            <div className="feedback-panel success">
              {feedback}
            </div>
          )}
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Hoàn thành xuất sắc!</h2>
          <p>Bạn đã hiểu rõ nguyên lý Archimedes!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <strong>Cấp độ hoàn thành:</strong>
              <span>{levels.length}</span>
            </div>
          </div>
          <div className="victory-actions">
            <button onClick={() => { setLevel(1); setScore(0); setGameState('menu'); }}>
              Chơi lại
            </button>
            <button onClick={() => navigate(-1)}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchimedesChallenge;
