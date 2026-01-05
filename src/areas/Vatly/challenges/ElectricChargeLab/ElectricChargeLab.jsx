import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, TestTube, Lightbulb, Magnet, Thermometer } from 'lucide-react';
import './ElectricChargeLab.css';

const ElectricChargeLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('tutorial');
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState('Chọn một vật và cọ xát vào áo len!');
  const animationFrameRef = useRef(null);

  const setupInitialObjects = () => {
    setObjects([
      { id: 1, name: 'balloon', x: 150, y: 150, charge: 0, radius: 40, color: '#3498db', isDraggable: true },
      { id: 2, name: 'rod', x: 150, y: 300, charge: 0, width: 20, height: 150, color: '#95a5a6', isDraggable: true },
      { id: 3, name: 'sweater', x: 650, y: 250, charge: 0, radius: 80, color: '#2ecc71', isDraggable: false },
      { id: 4, name: 'wall', x: 800, y: 0, width: 50, height: 500, charge: 0, color: '#bdc3c7', isDraggable: false },
    ]);
    setMessage('Chọn một vật và cọ xát vào áo len!');
    setSelectedObject(null);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      setupInitialObjects();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      const animate = () => {
        draw(ctx);
        update();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameState]);

  const drawObject = (ctx, obj) => {
    ctx.fillStyle = obj.color;
    if (obj.radius) { // Circle (balloon, sweater)
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
      ctx.fill();
    } else { // Rectangle (rod, wall)
      ctx.fillRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
    }

    // Draw charges
    const numCharges = Math.min(20, Math.abs(obj.charge));
    if (obj.charge !== 0) {
      for (let i = 0; i < numCharges; i++) {
        const sign = obj.charge > 0 ? '+' : '-';
        const chargeColor = obj.charge > 0 ? '#e74c3c' : '#3498db';
      ctx.fillStyle = chargeColor;
      ctx.font = 'bold 16px Arial';
      let randX, randY;
      if (obj.radius) {
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.random() * (obj.radius - 10);
        randX = obj.x + r * Math.cos(angle);
        randY = obj.y + r * Math.sin(angle);
      } else {
        randX = obj.x + (Math.random() - 0.5) * (obj.width - 10);
        randY = obj.y + (Math.random() - 0.5) * (obj.height - 10);
      }
        ctx.fillText(sign, randX, randY);
      }
    }
  };

  const draw = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    objects.forEach(obj => drawObject(ctx, obj));
  };

  const update = () => {
    if (dragging) return; // Don't apply forces while dragging
    
    setObjects(prevObjects => {
      const newObjects = prevObjects.map(obj => ({ ...obj }));

      newObjects.forEach(obj1 => {
        if (!obj1.isDraggable || obj1.charge === 0) return;
        let forceX = 0;
        let forceY = 0;

        newObjects.forEach(obj2 => {
          if (obj1.id === obj2.id || obj2.charge === 0) return;

          const dx = obj2.x - obj1.x;
          const dy = obj2.y - obj1.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist > 10) {
            const k = 0.5; // Coulomb's constant scaled for simulation
            const force = k * obj1.charge * obj2.charge / distSq;
            // Force direction: same charges repel, opposite attract
            forceX += force * dx / dist;
            forceY += force * dy / dist;
          }
        });
        
        // Apply force with damping
        obj1.x += forceX * 0.1;
        obj1.y += forceY * 0.1;

        // Boundary checks
        const radius = obj1.radius || obj1.width/2;
        if (obj1.x < radius) obj1.x = radius;
        if (obj1.x > 900 - radius) obj1.x = 900 - radius;
        if (obj1.y < radius) obj1.y = radius;
        if (obj1.y > 500 - radius) obj1.y = 500 - radius;
      });

      return newObjects;
    });
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedObject = [...objects].reverse().find(obj => {
      if (!obj.isDraggable) return false;
      if (obj.radius) {
        return Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2) < obj.radius;
      } else {
        return x > obj.x - obj.width/2 && x < obj.x + obj.width/2 && y > obj.y - obj.height/2 && y < obj.y + obj.height/2;
      }
    });

    if (clickedObject) {
      setSelectedObject(clickedObject.id);
      setDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !selectedObject) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setObjects(prevObjects => {
      const newObjects = prevObjects.map(obj =>
        obj.id === selectedObject ? { ...obj, x, y } : obj
      );

      // Check for rubbing against sweater
      const draggedObj = newObjects.find(o => o.id === selectedObject);
      const sweater = newObjects.find(o => o.name === 'sweater');
      if (draggedObj && sweater) {
        const dist = Math.sqrt((draggedObj.x - sweater.x)**2 + (draggedObj.y - sweater.y)**2);
        const touchDist = (draggedObj.radius || 0) + sweater.radius;
        
        if (dist < touchDist) {
          setMessage('Đang cọ xát... Vật đang nhiễm điện!');
          if (draggedObj.name === 'balloon') {
            draggedObj.charge = -30; // Balloons gain electrons
            sweater.charge = 30;
          } else if (draggedObj.name === 'rod') {
            draggedObj.charge = 30; // Rods lose electrons
            sweater.charge = -30;
          }
        } else if (draggedObj.charge !== 0) {
          setMessage('Di chuyển vật nhiễm điện lại gần các vật khác để quan sát!');
        }
      }
      return newObjects;
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    // Don't reset selectedObject so we can still see which one was moved
  };

  const renderTutorial = () => (
    <div className="ec-tutorial-overlay">
      <div className="ec-tutorial-content">
        <Zap size={60} className="ec-tutorial-icon" />
        <h2>Phòng Thí Nghiệm Tĩnh Điện</h2>
        <div className="ec-tutorial-text">
          <p><strong>Mục tiêu:</strong> Tìm hiểu về sự nhiễm điện do cọ xát và tương tác giữa các điện tích.</p>
          <h3>Hướng dẫn:</h3>
          <ul>
            <li>1. Kéo quả bóng bay hoặc thanh nhựa vào chiếc áo len để cọ xát.</li>
            <li>2. Quan sát các điện tích âm (-) và dương (+) xuất hiện.</li>
            <li>3. Di chuyển vật đã nhiễm điện lại gần các vật khác (áo len, bức tường, vật còn lại).</li>
            <li>4. Xem chúng hút hay đẩy nhau.</li>
            <li>5. Nhấn "Thí nghiệm lại" để bắt đầu lại.</li>
          </ul>
        </div>
        <button onClick={() => setGameState('playing')} className="ec-start-button">Bắt đầu</button>
      </div>
    </div>
  );

  return (
    <div className="electric-charge-lab" onMouseUp={handleMouseUp}>
      {gameState === 'tutorial' && renderTutorial()}
      <div className="ec-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="ec-back-button">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <h1>Phòng Thí Nghiệm Tĩnh Điện</h1>
        <button onClick={setupInitialObjects} className="ec-reset-button">
          Thí nghiệm lại
        </button>
      </div>
      <div className="ec-main-content">
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
        <div className="ec-message-bar">{message}</div>
      </div>
      <div className="ec-legend">
        <div><span className="charge-positive">+</span> Điện tích dương</div>
        <div><span className="charge-negative">-</span> Điện tích âm</div>
        <div><strong>Áo len:</strong> Trung hòa</div>
        <div><strong>Tường:</strong> Trung hòa</div>
      </div>
    </div>
  );
};

export default ElectricChargeLab;
