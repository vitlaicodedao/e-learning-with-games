import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Battery, Lightbulb, ToggleLeft, ToggleRight, Plus, Minus } from 'lucide-react';
import './CircuitBuilderGame.css';

const components = {
  wire: { type: 'wire', label: 'Dây Dẫn' },
  battery: { type: 'battery', label: 'Nguồn Điện', voltage: 9 },
  resistor: { type: 'resistor', label: 'Điện Trở', resistance: 10 },
  lightbulb: { type: 'lightbulb', label: 'Bóng Đèn', resistance: 5 },
  switch: { type: 'switch', label: 'Công Tắc', isOpen: true },
};

const CircuitBuilderGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('tutorial');
  const [nodes, setNodes] = useState([]);
  const [elements, setElements] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('wire');
  const [startNode, setStartNode] = useState(null);
  const [circuitInfo, setCircuitInfo] = useState(null);

  const gridSize = 40;

  useEffect(() => {
    if (gameState === 'playing') {
      initializeGrid();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      draw();
    }
  }, [gameState, elements, nodes, startNode]);

  useEffect(() => {
    if (elements.length > 0) {
      analyzeCircuit();
    }
  }, [elements]);

  const initializeGrid = () => {
    const canvas = canvasRef.current;
    const numX = Math.floor(canvas.width / gridSize);
    const numY = Math.floor(canvas.height / gridSize);
    const initialNodes = [];
    for (let i = 1; i < numX; i++) {
      for (let j = 1; j < numY; j++) {
        initialNodes.push({ id: `${i}-${j}`, x: i * gridSize, y: j * gridSize, connections: 0 });
      }
    }
    setNodes(initialNodes);
    setElements([]);
    setCircuitInfo(null);
  };

  const drawGrid = (ctx) => {
    const { width, height } = ctx.canvas;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElements = (ctx) => {
    elements.forEach(el => {
      const n1 = nodes.find(n => n.id === el.start);
      const n2 = nodes.find(n => n.id === el.end);
      if (!n1 || !n2) return;

      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();

      const midX = (n1.x + n2.x) / 2;
      const midY = (n1.y + n2.y) / 2;
      const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      switch (el.type) {
        case 'battery':
          ctx.fillStyle = 'white';
          ctx.fillRect(-20, -12, 40, 24);
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(-18, -10, 36, 20);
          ctx.fillStyle = '#e74c3c';
          ctx.fillRect(10, -10, 8, 20);
          ctx.fillStyle = '#3498db';
          ctx.fillRect(-18, -10, 8, 20);
          break;
        case 'resistor':
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          for(let i = 0; i < 6; i++) {
            ctx.lineTo(-15 + i*5, i%2 === 0 ? -8 : 8);
          }
          ctx.lineTo(15, 0);
          ctx.stroke();
          break;
        case 'lightbulb':
          const brightness = circuitInfo?.elementCurrents?.[el.id] || 0;
          const glow = Math.min(1, brightness / 0.5);
          ctx.fillStyle = `rgba(255, 255, 0, ${glow})`;
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, 2 * Math.PI);
          ctx.fill();
          if (glow > 0.1) {
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 20 * glow;
          }
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.shadowBlur = 0;
          break;
        case 'switch':
          ctx.fillStyle = 'grey';
          ctx.fillRect(-20, -5, 40, 10);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          if (el.isOpen) {
            ctx.lineTo(0, -15);
          } else {
            ctx.lineTo(20, 0);
          }
          ctx.moveTo(20,0);
          ctx.stroke();
          break;
        default: // wire
          break;
      }
      ctx.restore();
    });
  };

  const drawNodes = (ctx) => {
    nodes.forEach(node => {
      ctx.fillStyle = node.connections > 0 ? '#3498db' : 'rgba(255,255,255,0.3)';
      if (startNode && startNode.id === node.id) {
        ctx.fillStyle = '#2ecc71';
      }
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid(ctx);
    drawElements(ctx);
    drawNodes(ctx);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find(node => 
      Math.sqrt((x - node.x)**2 + (y - node.y)**2) < gridSize / 2
    );

    if (clickedNode) {
      // Handle switch toggle
      const clickedElement = elements.find(el => {
        if (el.type !== 'switch') return false;
        const n1 = nodes.find(n => n.id === el.start);
        const n2 = nodes.find(n => n.id === el.end);
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;
        return Math.sqrt((x - midX)**2 + (y - midY)**2) < 20;
      });

      if (clickedElement) {
        setElements(prev => prev.map(el => el.id === clickedElement.id ? {...el, isOpen: !el.isOpen} : el));
        return;
      }

      if (!startNode) {
        setStartNode(clickedNode);
      } else {
        if (startNode.id !== clickedNode.id) {
          const newElement = {
            id: `${startNode.id}-${clickedNode.id}-${Date.now()}`,
            start: startNode.id,
            end: clickedNode.id,
            ...components[selectedComponent]
          };
          setElements(prev => [...prev, newElement]);
          setNodes(prev => prev.map(n => 
            (n.id === startNode.id || n.id === clickedNode.id) ? { ...n, connections: n.connections + 1 } : n
          ));
          setStartNode(null);
        }
      }
    } else {
      setStartNode(null);
    }
  };

  const analyzeCircuit = () => {
    // This is a highly simplified analysis for visualization
    const hasBattery = elements.some(el => el.type === 'battery');
    if (!hasBattery || elements.length < 2) {
      setCircuitInfo({ totalVoltage: 0, totalResistance: Infinity, totalCurrent: 0, elementCurrents: {} });
      return;
    }

    // Check if any switch is open
    const hasOpenSwitch = elements.some(el => el.type === 'switch' && el.isOpen);
    const hasPath = !hasOpenSwitch && elements.length > 2;

    if (hasPath) {
      let totalResistance = 0;
      elements.forEach(el => {
        if (el.resistance) totalResistance += el.resistance;
        if (el.type === 'switch' && el.isOpen) totalResistance = Infinity;
      });
      
      const totalVoltage = elements.find(el => el.type === 'battery')?.voltage || 0;
      const totalCurrent = totalResistance > 0 && totalResistance !== Infinity ? totalVoltage / totalResistance : 0;

      const elementCurrents = {};
      elements.forEach(el => {
        elementCurrents[el.id] = totalCurrent;
      });

      setCircuitInfo({ totalVoltage, totalResistance, totalCurrent, elementCurrents });
    } else {
      setCircuitInfo({ totalVoltage: 0, totalResistance: Infinity, totalCurrent: 0, elementCurrents: {} });
    }
  };

  const resetCircuit = () => {
    initializeGrid();
  };

  const renderTutorial = () => (
    <div className="cb-tutorial-overlay">
      <div className="cb-tutorial-content">
        <Zap size={60} className="cb-tutorial-icon" />
        <h2>Xây Dựng Mạch Điện</h2>
        <div className="cb-tutorial-text">
          <p><strong>Mục tiêu:</strong> Lắp ráp các mạch điện đơn giản và xem chúng hoạt động.</p>
          <h3>Hướng dẫn:</h3>
          <ul>
            <li>1. Chọn một linh kiện (dây dẫn, pin, đèn...) từ thanh công cụ.</li>
            <li>2. Nhấp vào một điểm trên lưới để bắt đầu.</li>
            <li>3. Nhấp vào điểm khác để kết thúc và đặt linh kiện.</li>
            <li>4. Tạo một mạch kín với nguồn điện để đèn sáng.</li>
            <li>5. Nhấp vào công tắc để đóng/mở mạch.</li>
          </ul>
        </div>
        <button onClick={() => setGameState('playing')} className="cb-start-button">Bắt đầu</button>
      </div>
    </div>
  );

  return (
    <div className="circuit-builder-game">
      {gameState === 'tutorial' && renderTutorial()}
      <div className="cb-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="cb-back-button">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <h1>Xây Dựng Mạch Điện</h1>
        <button onClick={resetCircuit} className="cb-reset-button">
          Làm Mới
        </button>
      </div>
      <div className="cb-main-layout">
        <div className="cb-toolbar">
          <h3>Linh Kiện</h3>
          {Object.values(components).map(c => (
            <button 
              key={c.type} 
              className={`cb-tool-btn ${selectedComponent === c.type ? 'selected' : ''}`}
              onClick={() => setSelectedComponent(c.type)}
            >
              {c.type === 'battery' && <Battery />}
              {c.type === 'wire' && <Minus />}
              {c.type === 'resistor' && <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M2 12h4l2-8l4 16l4-16l2 8h4"/></svg>}
              {c.type === 'lightbulb' && <Lightbulb />}
              {c.type === 'switch' && <ToggleLeft />}
              {c.label}
            </button>
          ))}
        </div>
        <div className="cb-canvas-container">
          <canvas ref={canvasRef} width={800} height={600} onClick={handleCanvasClick} />
        </div>
        <div className="cb-info-panel">
          <h3>Thông Tin Mạch</h3>
          {circuitInfo ? (
            <div>
              <p>Tổng điện áp: {circuitInfo.totalVoltage.toFixed(2)} V</p>
              <p>Tổng trở: {isFinite(circuitInfo.totalResistance) ? `${circuitInfo.totalResistance.toFixed(2)} Ω` : 'Mạch hở'}</p>
              <p>Dòng điện chính: {circuitInfo.totalCurrent.toFixed(3)} A</p>
              {elements.find(e => e.type === 'lightbulb') && (
                <div className="cb-bulb-status">
                  <Lightbulb color={circuitInfo.totalCurrent > 0 ? 'yellow' : 'grey'} />
                  <span>{circuitInfo.totalCurrent > 0 ? 'Đèn sáng' : 'Đèn tắt'}</span>
                </div>
              )}
            </div>
          ) : (
            <p>Chưa có thông tin. Hãy lắp một mạch điện hoàn chỉnh.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircuitBuilderGame;
