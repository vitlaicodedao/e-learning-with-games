import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Sun,
  Zap,
  Award,
  TrendingUp,
  Battery,
  Home
} from 'lucide-react';
import './SolarCellOptimizer.css';

const SolarCellOptimizer = () => {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);
  
  // Game states
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [score, setScore] = useState(0);
  
  // Solar cell parameters
  const [cellType, setCellType] = useState('silicon'); // silicon, monocrystalline, polycrystalline, perovskite
  const [sunAngle, setSunAngle] = useState(0); // 0-90 degrees
  const [lightIntensity, setLightIntensity] = useState(1000); // W/m² (100-1200)
  const [temperature, setTemperature] = useState(25); // °C (0-60)
  const [isRunning, setIsRunning] = useState(false);
  
  // Measurements
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [maxPower, setMaxPower] = useState(0);
  
  // Animation
  const [photonParticles, setPhotonParticles] = useState([]);
  const [electronFlow, setElectronFlow] = useState([]);
  
  // IV curve data
  const [ivCurveData, setIvCurveData] = useState([]);
  
  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Đạt hiệu suất > 20% với tế bào silicon đơn tinh thể', completed: false },
    { id: 2, text: 'Tìm góc chiếu sáng tối ưu để đạt công suất cực đại', completed: false },
    { id: 3, text: 'Điều chỉnh nhiệt độ dưới 30°C và đạt công suất > 200W', completed: false }
  ]);
  
  // Cell specifications
  const cellSpecs = {
    silicon: {
      name: 'Silicon cơ bản',
      voc: 0.7, // Open circuit voltage (V)
      isc: 8, // Short circuit current (A)
      efficiency: 15,
      tempCoeff: -0.45, // %/°C
      color: '#4a5568'
    },
    monocrystalline: {
      name: 'Silicon đơn tinh thể',
      voc: 0.75,
      isc: 9,
      efficiency: 22,
      tempCoeff: -0.40,
      color: '#1a202c'
    },
    polycrystalline: {
      name: 'Silicon đa tinh thể',
      voc: 0.68,
      isc: 8.5,
      efficiency: 18,
      tempCoeff: -0.50,
      color: '#2d3748'
    },
    perovskite: {
      name: 'Perovskite',
      voc: 1.1,
      isc: 7,
      efficiency: 25,
      tempCoeff: -0.30,
      color: '#742a2a'
    }
  };
  
  // Constants
  const PANEL_AREA = 1; // m²
  
  useEffect(() => {
    if (gameState === 'playing' && isRunning) {
      calculatePerformance();
      generateIVCurve();
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, isRunning, cellType, sunAngle, lightIntensity, temperature]);
  
  const calculatePerformance = () => {
    const spec = cellSpecs[cellType];
    
    // Angle factor: cos(angle) for perpendicular incidence
    const angleRad = (sunAngle * Math.PI) / 180;
    const angleFactor = Math.cos(angleRad);
    
    // Intensity factor (normalized to 1000 W/m²)
    const intensityFactor = lightIntensity / 1000;
    
    // Temperature correction: efficiency decreases with temperature
    const tempDiff = temperature - 25;
    const tempFactor = 1 + (spec.tempCoeff * tempDiff) / 100;
    
    // Calculate actual parameters
    const actualVoc = spec.voc * (1 + 0.002 * tempDiff) * Math.log(1 + intensityFactor);
    const actualIsc = spec.isc * intensityFactor * angleFactor;
    
    // Maximum power point (typically at 0.8 Voc and 0.9 Isc)
    const vmp = actualVoc * 0.8;
    const imp = actualIsc * 0.9;
    const pMax = vmp * imp;
    
    // Calculate efficiency
    const inputPower = lightIntensity * PANEL_AREA * angleFactor;
    const actualEfficiency = ((pMax / inputPower) * 100) * tempFactor;
    
    setVoltage(vmp);
    setCurrent(imp);
    setPower(pMax);
    setEfficiency(Math.max(0, actualEfficiency));
    setMaxPower(pMax);
    
    // Check challenges
    checkChallenges(actualEfficiency, pMax);
    
    // Generate photon particles
    if (Math.random() < 0.3) {
      const numPhotons = Math.floor((intensityFactor * angleFactor) * 5);
      const newPhotons = Array.from({ length: numPhotons }, () => ({
        x: Math.random() * 400,
        y: -10,
        speed: 2 + Math.random() * 2,
        size: 3 + Math.random() * 2,
        angle: sunAngle
      }));
      setPhotonParticles(prev => [...prev.slice(-50), ...newPhotons]);
    }
    
    // Generate electron flow
    if (actualIsc > 0 && Math.random() < 0.4) {
      const newElectrons = Array.from({ length: 3 }, () => ({
        x: 200 + Math.random() * 100,
        y: 250,
        targetX: 350,
        targetY: 150,
        progress: 0
      }));
      setElectronFlow(prev => [...prev.slice(-30), ...newElectrons]);
    }
  };
  
  const generateIVCurve = () => {
    const spec = cellSpecs[cellType];
    const angleRad = (sunAngle * Math.PI) / 180;
    const angleFactor = Math.cos(angleRad);
    const intensityFactor = lightIntensity / 1000;
    const tempDiff = temperature - 25;
    
    const actualVoc = spec.voc * (1 + 0.002 * tempDiff) * Math.log(1 + intensityFactor);
    const actualIsc = spec.isc * intensityFactor * angleFactor;
    
    const data = [];
    for (let v = 0; v <= actualVoc; v += actualVoc / 50) {
      // Simplified solar cell equation: I = Isc - I0 * (exp(qV/nkT) - 1)
      // Approximation: I = Isc * (1 - (V/Voc)^2)
      const i = actualIsc * (1 - Math.pow(v / actualVoc, 2));
      const p = v * i;
      data.push({ v, i, p });
    }
    
    setIvCurveData(data);
  };
  
  const checkChallenges = (eff, pow) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === 1 && cellType === 'monocrystalline' && eff > 20 && !ch.completed) {
        setScore(s => s + 30);
        return { ...ch, completed: true };
      }
      if (ch.id === 2 && sunAngle < 10 && pow === maxPower && !ch.completed) {
        setScore(s => s + 25);
        return { ...ch, completed: true };
      }
      if (ch.id === 3 && temperature < 30 && pow > 200 && !ch.completed) {
        setScore(s => s + 35);
        return { ...ch, completed: true };
      }
      return ch;
    }));
  };
  
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);
    
    // Draw sun
    const sunX = 50 + Math.cos((sunAngle * Math.PI) / 180) * 100;
    const sunY = 50 + Math.sin((sunAngle * Math.PI) / 180) * 50;
    
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 40);
    sunGradient.addColorStop(0, '#fef08a');
    sunGradient.addColorStop(0.5, '#fbbf24');
    sunGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw sun rays
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * 45, sunY + Math.sin(angle) * 45);
      ctx.lineTo(sunX + Math.cos(angle) * 65, sunY + Math.sin(angle) * 65);
      ctx.stroke();
    }
    
    // Draw photon particles
    photonParticles.forEach(photon => {
      photon.y += photon.speed;
      
      const gradient = ctx.createRadialGradient(photon.x, photon.y, 0, photon.x, photon.y, photon.size);
      gradient.addColorStop(0, '#fef08a');
      gradient.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(photon.x, photon.y, photon.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Remove off-screen photons
    setPhotonParticles(prev => prev.filter(p => p.y < height + 10));
    
    // Draw solar panel
    const panelX = 150;
    const panelY = 200;
    const panelWidth = 200;
    const panelHeight = 120;
    
    // Panel frame
    ctx.fillStyle = '#334155';
    ctx.fillRect(panelX - 5, panelY - 5, panelWidth + 10, panelHeight + 10);
    
    // Panel cells
    const spec = cellSpecs[cellType];
    ctx.fillStyle = spec.color;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    // Cell grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(panelX + (panelWidth / 4) * i, panelY);
      ctx.lineTo(panelX + (panelWidth / 4) * i, panelY + panelHeight);
      ctx.stroke();
    }
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(panelX, panelY + (panelHeight / 3) * i);
      ctx.lineTo(panelX + panelWidth, panelY + (panelHeight / 3) * i);
      ctx.stroke();
    }
    
    // Panel label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(spec.name, panelX + panelWidth / 2, panelY + panelHeight + 25);
    
    // Draw electron flow
    electronFlow.forEach(electron => {
      electron.progress += 0.02;
      if (electron.progress > 1) electron.progress = 0;
      
      const currentX = electron.x + (electron.targetX - electron.x) * electron.progress;
      const currentY = electron.y + (electron.targetY - electron.y) * electron.progress;
      
      const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 4);
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw circuit connections
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    
    // Positive terminal
    ctx.beginPath();
    ctx.moveTo(panelX + panelWidth, panelY + panelHeight / 2);
    ctx.lineTo(380, panelY + panelHeight / 2);
    ctx.lineTo(380, 150);
    ctx.stroke();
    
    // Negative terminal
    ctx.beginPath();
    ctx.moveTo(panelX, panelY + panelHeight / 2);
    ctx.lineTo(120, panelY + panelHeight / 2);
    ctx.lineTo(120, 150);
    ctx.stroke();
    
    // Draw battery/load
    const batteryX = 200;
    const batteryY = 120;
    const batteryWidth = 100;
    const batteryHeight = 40;
    
    // Battery body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(batteryX, batteryY, batteryWidth, batteryHeight);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(batteryX, batteryY, batteryWidth, batteryHeight);
    
    // Battery terminals
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(batteryX - 5, batteryY + 10, 5, 20); // Negative
    ctx.fillRect(batteryX + batteryWidth, batteryY + 10, 5, 20); // Positive
    
    // Battery icon
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚡', batteryX + batteryWidth / 2, batteryY + 28);
    
    // Connections to battery
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 150);
    ctx.lineTo(batteryX - 5, 150);
    ctx.lineTo(batteryX - 5, batteryY + 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(380, 150);
    ctx.lineTo(batteryX + batteryWidth + 5, 150);
    ctx.lineTo(batteryX + batteryWidth + 5, batteryY + 20);
    ctx.stroke();
    
    // Draw current flow arrows
    if (current > 0) {
      ctx.fillStyle = '#fbbf24';
      const arrowSize = 8;
      
      // Arrow on positive line
      ctx.beginPath();
      ctx.moveTo(365, 180);
      ctx.lineTo(365 - arrowSize, 180 - arrowSize / 2);
      ctx.lineTo(365 - arrowSize, 180 + arrowSize / 2);
      ctx.closePath();
      ctx.fill();
      
      // Arrow on negative line
      ctx.beginPath();
      ctx.moveTo(135, 180);
      ctx.lineTo(135 - arrowSize, 180 - arrowSize / 2);
      ctx.lineTo(135 - arrowSize, 180 + arrowSize / 2);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw temperature indicator
    const tempX = 420;
    const tempY = 50;
    ctx.fillStyle = temperature > 40 ? '#ef4444' : temperature > 30 ? '#fbbf24' : '#60a5fa';
    ctx.fillRect(tempX, tempY, 20, 100);
    
    const tempLevel = ((60 - temperature) / 60) * 100;
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(tempX, tempY, 20, tempLevel);
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(tempX, tempY, 20, 100);
    
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${temperature}°C`, tempX + 10, tempY + 120);
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    if (gameState === 'playing') {
      drawGraph();
    }
  }, [ivCurveData, voltage, current]);
  
  const drawGraph = () => {
    const canvas = graphRef.current;
    if (!canvas || ivCurveData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Find max values
    const maxV = Math.max(...ivCurveData.map(d => d.v));
    const maxI = Math.max(...ivCurveData.map(d => d.i));
    const maxP = Math.max(...ivCurveData.map(d => d.p));
    
    const scaleX = (width - 2 * padding) / maxV;
    const scaleYI = (height - 2 * padding) / maxI;
    const scaleYP = (height - 2 * padding) / maxP;
    
    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw I-V curve
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ivCurveData.forEach((point, index) => {
      const x = padding + point.v * scaleX;
      const y = height - padding - point.i * scaleYI;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw P-V curve
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ivCurveData.forEach((point, index) => {
      const x = padding + point.v * scaleX;
      const y = height - padding - point.p * scaleYP;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw current operating point
    const opX = padding + voltage * scaleX;
    const opYI = height - padding - current * scaleYI;
    const opYP = height - padding - power * scaleYP;
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(opX, opYI, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(opX, opYP, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Điện áp (V)', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Dòng (A) / Công suất (W)', 0, 0);
    ctx.restore();
    
    // Legend
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(width - 150, 20, 20, 3);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Dòng điện', width - 125, 25);
    
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(width - 150, 35, 20, 3);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Công suất', width - 125, 40);
  };
  
  const handleStart = () => {
    setGameState('playing');
    setScore(0);
    setChallenges(prev => prev.map(ch => ({ ...ch, completed: false })));
    setIsRunning(true);
  };
  
  const handleToggle = () => {
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setCellType('silicon');
    setSunAngle(0);
    setLightIntensity(1000);
    setTemperature(25);
    setPhotonParticles([]);
    setElectronFlow([]);
    setIvCurveData([]);
  };
  
  const handleFinish = () => {
    setGameState('result');
    setIsRunning(false);
  };
  
  const handleRetry = () => {
    setGameState('menu');
    setScore(0);
    handleReset();
  };
  
  const handleBack = () => {
    window.history.back();
  };
  
  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="solar-container">
        <div className="solar-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="solar-title">
            <Sun className="title-icon" size={32} />
            Solar Cell Optimizer
          </h1>
          <div className="score-display">
            <Award size={20} />
            <span>{score}</span>
          </div>
        </div>
        
        <div className="menu-screen">
          <div className="menu-content">
            <Sun className="menu-icon" size={64} />
            <h2>Tối ưu hóa Pin Mặt Trời</h2>
            <p className="menu-description">
              Khám phá hoạt động của pin mặt trời! Điều chỉnh các thông số như loại tế bào, 
              góc chiếu sáng, cường độ ánh sáng và nhiệt độ để tối đa hóa hiệu suất chuyển đổi năng lượng.
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Zap size={24} />
                <span>4 loại pin mặt trời với hiệu suất khác nhau</span>
              </div>
              <div className="feature-item">
                <TrendingUp size={24} />
                <span>Đồ thị đặc tuyến I-V và P-V thời gian thực</span>
              </div>
              <div className="feature-item">
                <Battery size={24} />
                <span>Tính toán công suất cực đại và hiệu suất</span>
              </div>
            </div>
            <button className="start-button" onClick={handleStart}>
              <Play size={24} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Result Screen
  if (gameState === 'result') {
    const completedCount = challenges.filter(ch => ch.completed).length;
    
    return (
      <div className="solar-container">
        <div className="solar-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="solar-title">
            <Sun className="title-icon" size={32} />
            Solar Cell Optimizer
          </h1>
          <div className="score-display">
            <Award size={20} />
            <span>{score}</span>
          </div>
        </div>
        
        <div className="result-screen">
          <div className="result-content">
            <Award className="result-icon" size={80} />
            <h2>Hoàn thành!</h2>
            
            <div className="result-score">
              <span className="score-label">Điểm số:</span>
              <span className="score-value">{score}</span>
            </div>
            
            <div className="result-stats">
              <div className="stat-item">
                <span>Thử thách hoàn thành:</span>
                <strong>{completedCount}/3</strong>
              </div>
              <div className="stat-item">
                <span>Hiệu suất tối đa:</span>
                <strong>{efficiency.toFixed(1)}%</strong>
              </div>
              <div className="stat-item">
                <span>Công suất cực đại:</span>
                <strong>{maxPower.toFixed(1)} W</strong>
              </div>
            </div>
            
            <div className="result-buttons">
              <button className="retry-button" onClick={handleRetry}>
                <RotateCcw size={20} />
                Chơi lại
              </button>
              <button className="home-button" onClick={handleBack}>
                <Home size={20} />
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Playing Screen
  return (
    <div className="solar-container">
      <div className="solar-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="solar-title">
          <Sun className="title-icon" size={32} />
          Solar Cell Optimizer
        </h1>
        <div className="score-display">
          <Award size={20} />
          <span>{score}</span>
        </div>
      </div>
      
      <div className="playing-screen">
        <div className="experiment-grid">
          <div className="setup-panel">
            <h3>Mô hình Pin Mặt Trời</h3>
            <canvas 
              ref={canvasRef} 
              width={500} 
              height={350}
              className="setup-canvas"
            />
            
            <div className="controls">
              <button className="control-btn" onClick={handleToggle}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Tạm dừng' : 'Chạy'}
              </button>
              <button className="control-btn" onClick={handleReset}>
                <RotateCcw size={20} />
                Đặt lại
              </button>
              <button className="control-btn" onClick={handleFinish}>
                <Award size={20} />
                Hoàn thành
              </button>
            </div>
            
            <div className="measurement-panel">
              <div className="measurement-item">
                <span>Điện áp (V):</span>
                <strong>{voltage.toFixed(2)} V</strong>
              </div>
              <div className="measurement-item">
                <span>Dòng điện (I):</span>
                <strong>{current.toFixed(2)} A</strong>
              </div>
              <div className="measurement-item">
                <span>Công suất (P):</span>
                <strong>{power.toFixed(2)} W</strong>
              </div>
              <div className="measurement-item">
                <span>Hiệu suất (η):</span>
                <strong style={{ color: efficiency > 20 ? '#22c55e' : efficiency > 15 ? '#fbbf24' : '#60a5fa' }}>
                  {efficiency.toFixed(1)}%
                </strong>
              </div>
            </div>
          </div>
          
          <div className="controls-panel">
            <h4>Thông số điều khiển</h4>
            
            <div className="param-section">
              <label>Loại tế bào quang điện:</label>
              <div className="cell-selector">
                {Object.entries(cellSpecs).map(([key, spec]) => (
                  <button
                    key={key}
                    className={`cell-btn ${cellType === key ? 'active' : ''}`}
                    onClick={() => setCellType(key)}
                    style={{ borderColor: spec.color }}
                  >
                    {spec.name}
                    <span>η = {spec.efficiency}%</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="param-section">
              <div className="param-control">
                <label>Góc chiếu sáng: {sunAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={sunAngle}
                  onChange={(e) => setSunAngle(Number(e.target.value))}
                  className="slider"
                />
                <div className="angle-display">
                  Vuông góc: {Math.abs(sunAngle - 0) < 5 ? '✓' : '✗'}
                </div>
              </div>
              
              <div className="param-control">
                <label>Cường độ ánh sáng: {lightIntensity} W/m²</label>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="10"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="slider"
                />
              </div>
              
              <div className="param-control">
                <label>Nhiệt độ: {temperature}°C</label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
            
            <div className="graph-section">
              <h4>Đặc tuyến I-V và P-V</h4>
              <canvas 
                ref={graphRef} 
                width={400} 
                height={250}
                className="graph-canvas"
              />
            </div>
          </div>
        </div>
        
        <div className="challenge-panel">
          <h3>
            <Award size={24} />
            Thử thách
          </h3>
          {challenges.map(challenge => (
            <div 
              key={challenge.id} 
              className={`challenge-item ${challenge.completed ? 'completed' : ''}`}
            >
              <p>{challenge.text}</p>
              {challenge.completed && (
                <span className="completed-badge">✓ Hoàn thành</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarCellOptimizer;