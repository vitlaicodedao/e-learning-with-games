import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gauge, Zap, Trophy, Cog } from 'lucide-react';
import './HeatEngine.css';

const HeatEngine = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  // Simulation state
  const [engineRunning, setEngineRunning] = useState(false);
  const [pistonPosition, setPistonPosition] = useState(0);
  const [cyclePhase, setCyclePhase] = useState(0); // 0: intake, 1: compression, 2: power, 3: exhaust
  const [heatInput, setHeatInput] = useState(0);
  const [workOutput, setWorkOutput] = useState(0);
  const [heatWaste, setHeatWaste] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [particles, setParticles] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [temperatureHot, setTemperatureHot] = useState(500);
  const [temperatureCold, setTemperatureCold] = useState(300);

  const levels = [
    {
      id: 1,
      name: 'Chu Trình Động Cơ',
      description: 'Tìm hiểu 4 kỳ của động cơ nhiệt: nạp, nén, cháy, thải',
      task: 'understand_cycle',
      question: 'Quan sát và mô tả chu trình hoạt động của động cơ nhiệt',
      instruction: 'Nhấn Start để xem động cơ hoạt động qua 4 kỳ'
    },
    {
      id: 2,
      name: 'Hiệu Suất Động Cơ',
      description: 'Tính hiệu suất: H = (Wcơ / Qnhiệt) × 100%',
      task: 'calculate_efficiency',
      Qin: 1000,
      Wout: 300,
      question: 'Động cơ nhận 1000J nhiệt, sinh 300J công. Tính hiệu suất',
      instruction: 'H = (W / Q) × 100%'
    },
    {
      id: 3,
      name: 'Nhiệt Độ Nguồn Nóng/Lạnh',
      description: 'Hiệu suất lý tưởng: H = (T₁ - T₂) / T₁ × 100%',
      task: 'carnot_efficiency',
      T1: 600,
      T2: 300,
      question: 'Tính hiệu suất lý tưởng với nguồn nóng 600K, nguồn lạnh 300K',
      instruction: 'H = (T₁ - T₂) / T₁ × 100% (Chu trình Carnot)'
    },
    {
      id: 4,
      name: 'Tối Ưu Động Cơ',
      description: 'Tăng hiệu suất bằng cách tăng T₁ hoặc giảm T₂',
      task: 'optimize_engine',
      question: 'Điều chỉnh nhiệt độ để đạt hiệu suất > 50%',
      instruction: 'Kéo thanh trượt để thay đổi nhiệt độ nguồn nóng/lạnh'
    }
  ];

  const currentLevel = levels[level - 1];
  const phaseNames = ['Nạp nhiên liệu', 'Nén', 'Cháy - Sinh công', 'Thải khí'];

  useEffect(() => {
    if (gameState === 'playing') {
      initLevel();
      setTime(0);
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, engineRunning, pistonPosition, cyclePhase, particles]);

  const initLevel = () => {
    setEngineRunning(false);
    setPistonPosition(0);
    setCyclePhase(0);
    setHeatInput(0);
    setWorkOutput(0);
    setHeatWaste(0);
    setEfficiency(0);
    setRpm(0);
    setAnswered(false);
    setUserAnswer('');
    setTemperatureHot(500);
    setTemperatureCold(300);
    initParticles();
  };

  const initParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: 300 + Math.random() * 150,
        y: 200 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        energy: 50
      });
    }
    setParticles(newParticles);
  };

  const animate = () => {
    if (engineRunning) {
      updateEngine();
    }
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const updateEngine = () => {
    // Update piston position based on cycle phase
    setPistonPosition(prev => {
      let newPos = prev + 0.02;
      if (newPos >= 1) {
        newPos = 0;
        setCyclePhase(p => (p + 1) % 4);
      }
      return newPos;
    });

    // Update RPM
    setRpm(prev => Math.min(prev + 10, 1200));

    // Update energy values
    const Q_in = 1000;
    const eff = calculateEfficiency();
    const W_out = Q_in * (eff / 100);
    const Q_waste = Q_in - W_out;

    setHeatInput(Q_in);
    setWorkOutput(W_out);
    setHeatWaste(Q_waste);
    setEfficiency(eff);

    // Update particles based on cycle phase
    updateParticles();
  };

  const updateParticles = () => {
    setParticles(prev => {
      return prev.map(p => {
        let newVx = p.vx;
        let newVy = p.vy;
        let newEnergy = p.energy;

        // Compression phase - particles slow down
        if (cyclePhase === 1) {
          newVx *= 0.98;
          newVy *= 0.98;
          newEnergy = Math.min(newEnergy + 1, 100);
        }
        
        // Power phase - particles speed up
        if (cyclePhase === 2) {
          newVx += (Math.random() - 0.5) * 0.5;
          newVy += (Math.random() - 0.5) * 0.5;
          newEnergy = Math.min(newEnergy + 2, 100);
        }

        // Exhaust phase - particles exit
        if (cyclePhase === 3) {
          newVx *= 1.05;
          newEnergy = Math.max(newEnergy - 1, 30);
        }

        let newX = p.x + newVx;
        let newY = p.y + newVy;

        // Boundaries (cylinder walls)
        const pistonY = 180 + pistonPosition * 120;
        if (newX < 280 || newX > 470) {
          newVx *= -1;
          newX = p.x;
        }
        if (newY < 180 || newY > pistonY) {
          newVy *= -1;
          newY = p.y;
        }

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          energy: newEnergy
        };
      });
    });
  };

  const calculateEfficiency = () => {
    if (currentLevel.task === 'optimize_engine') {
      return ((temperatureHot - temperatureCold) / temperatureHot) * 100;
    }
    return 30; // Default efficiency
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw heat engine
    drawEngine(ctx, width, height);

    // Draw energy flow diagram
    drawEnergyFlow(ctx, width, height);

    // Draw info panel
    drawInfoPanel(ctx, width, height);
  };

  const drawEngine = (ctx, width, height) => {
    const cylinderX = 280;
    const cylinderY = 180;
    const cylinderWidth = 190;
    const cylinderHeight = 150;

    // Cylinder
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(cylinderX, cylinderY, cylinderWidth, cylinderHeight);

    ctx.fillStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.fillRect(cylinderX, cylinderY, cylinderWidth, cylinderHeight);

    // Particles inside cylinder
    particles.forEach(p => {
      const energyRatio = p.energy / 100;
      const red = Math.floor(50 + energyRatio * 205);
      const blue = Math.floor(255 - energyRatio * 205);
      
      ctx.fillStyle = `rgba(${red}, 100, ${blue}, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Piston
    const pistonY = cylinderY + pistonPosition * (cylinderHeight - 30);
    
    ctx.fillStyle = '#475569';
    ctx.fillRect(cylinderX, pistonY, cylinderWidth, 30);
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(cylinderX, pistonY, cylinderWidth, 30);

    // Piston rod
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cylinderX + cylinderWidth / 2 - 5, pistonY + 30, 10, 80);

    // Crankshaft
    const crankX = cylinderX + cylinderWidth / 2;
    const crankY = pistonY + 110;
    const angle = pistonPosition * Math.PI * 2;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(crankX, crankY, 30, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(crankX, crankY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Connecting point
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(crankX, crankY);
    ctx.lineTo(crankX + Math.cos(angle) * 25, crankY + Math.sin(angle) * 25);
    ctx.stroke();

    // Spark plug (for power phase)
    if (cyclePhase === 2) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cylinderX + 95, cylinderY);
        ctx.lineTo(cylinderX + 95 + (Math.random() - 0.5) * 20, cylinderY - 15 - i * 10);
        ctx.stroke();
      }
    }

    // Valve indicators
    // Intake valve
    const intakeOpen = cyclePhase === 0;
    ctx.fillStyle = intakeOpen ? '#10b981' : '#334155';
    ctx.fillRect(cylinderX + 30, cylinderY - 15, 40, 15);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(cylinderX + 30, cylinderY - 15, 40, 15);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NẠP', cylinderX + 50, cylinderY - 4);

    // Exhaust valve
    const exhaustOpen = cyclePhase === 3;
    ctx.fillStyle = exhaustOpen ? '#ef4444' : '#334155';
    ctx.fillRect(cylinderX + cylinderWidth - 70, cylinderY - 15, 40, 15);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(cylinderX + cylinderWidth - 70, cylinderY - 15, 40, 15);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.fillText('THẢI', cylinderX + cylinderWidth - 50, cylinderY - 4);

    // Cycle phase label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(phaseNames[cyclePhase], cylinderX + cylinderWidth / 2, cylinderY - 30);

    // RPM display
    if (engineRunning) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(cylinderX + cylinderWidth - 60, cylinderY + 10, 50, 30);
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${rpm}`, cylinderX + cylinderWidth - 35, cylinderY + 25);
      ctx.font = '10px Arial';
      ctx.fillText('RPM', cylinderX + cylinderWidth - 35, cylinderY + 37);
    }
  };

  const drawEnergyFlow = (ctx, width, height) => {
    const flowX = 520;
    const flowY = 200;

    // Heat source (hot)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(flowX, flowY, 80, 50);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(flowX, flowY, 80, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 Nguồn nóng', flowX + 40, flowY + 25);
    ctx.font = '12px Arial';
    ctx.fillText(`${temperatureHot}K`, flowX + 40, flowY + 42);

    // Arrow Q_in
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(flowX + 40, flowY + 50);
    ctx.lineTo(flowX + 40, flowY + 90);
    ctx.stroke();
    drawArrow(ctx, flowX + 40, flowY + 90, Math.PI / 2);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Q₁ = ${heatInput.toFixed(0)}J`, flowX + 90, flowY + 70);

    // Engine box
    ctx.fillStyle = '#475569';
    ctx.fillRect(flowX, flowY + 100, 80, 50);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(flowX, flowY + 100, 80, 50);
    
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('⚙️ Động cơ', flowX + 40, flowY + 130);

    // Arrow W_out (to the right)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(flowX + 80, flowY + 125);
    ctx.lineTo(flowX + 140, flowY + 125);
    ctx.stroke();
    drawArrow(ctx, flowX + 140, flowY + 125, 0);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`W = ${workOutput.toFixed(0)}J`, flowX + 150, flowY + 130);

    // Arrow Q_out (to cold sink)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(flowX + 40, flowY + 150);
    ctx.lineTo(flowX + 40, flowY + 190);
    ctx.stroke();
    drawArrow(ctx, flowX + 40, flowY + 190, Math.PI / 2);

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Q₂ = ${heatWaste.toFixed(0)}J`, flowX + 90, flowY + 170);

    // Heat sink (cold)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(flowX, flowY + 200, 80, 50);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(flowX, flowY + 200, 80, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('❄️ Nguồn lạnh', flowX + 40, flowY + 225);
    ctx.font = '12px Arial';
    ctx.fillText(`${temperatureCold}K`, flowX + 40, flowY + 242);

    // Efficiency display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(flowX + 100, flowY + 30, 140, 60);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(flowX + 100, flowY + 30, 140, 60);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HIỆU SUẤT', flowX + 170, flowY + 50);
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${efficiency.toFixed(1)}%`, flowX + 170, flowY + 75);
  };

  const drawArrow = (ctx, x, y, angle) => {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8 * Math.cos(angle - Math.PI / 6), y - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - 8 * Math.cos(angle + Math.PI / 6), y - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const drawInfoPanel = (ctx, width, height) => {
    const panelX = 20;
    const panelY = 80;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(panelX, panelY, 240, 200);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, 240, 200);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('⚙️ CHU TRÌNH', panelX + 15, panelY + 25);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Arial';

    const phases = [
      '1. NẠP: Hút nhiên liệu',
      '2. NÉN: Nén hỗn hợp',
      '3. CHÁY: Đốt - sinh công',
      '4. THẢI: Đẩy khí thải'
    ];

    phases.forEach((phase, i) => {
      const active = cyclePhase === i && engineRunning;
      ctx.fillStyle = active ? '#10b981' : '#94a3b8';
      ctx.fillText(phase, panelX + 15, panelY + 55 + i * 25);
    });

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 15, panelY + 165);
    ctx.lineTo(panelX + 225, panelY + 165);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Công thức hiệu suất:', panelX + 15, panelY + 185);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('H = (W / Q) × 100%', panelX + 15, panelY + 205);
    ctx.fillText('H = (T₁-T₂)/T₁ × 100%', panelX + 15, panelY + 225);
  };

  const startEngine = () => {
    setEngineRunning(true);
    
    if (currentLevel.task === 'understand_cycle') {
      setTimeout(() => {
        setAnswered(true);
      }, 8000); // Auto-complete after 2 full cycles
    }
  };

  const stopEngine = () => {
    setEngineRunning(false);
    setRpm(0);
  };

  const checkAnswer = () => {
    const answer = parseFloat(userAnswer);
    let correct = false;

    if (currentLevel.task === 'calculate_efficiency') {
      const H = (currentLevel.Wout / currentLevel.Qin) * 100;
      correct = Math.abs(answer - H) < 2;
    } else if (currentLevel.task === 'carnot_efficiency') {
      const H = ((currentLevel.T1 - currentLevel.T2) / currentLevel.T1) * 100;
      correct = Math.abs(answer - H) < 2;
    } else if (currentLevel.task === 'optimize_engine') {
      const H = ((temperatureHot - temperatureCold) / temperatureHot) * 100;
      correct = H > 50;
    }

    if (correct) {
      setAnswered(true);
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + Math.max(500 - time * 5, 250));
          setGameState('playing');
        } else {
          setScore(s => s + Math.max(500 - time * 5, 250));
          setGameState('victory');
        }
      }, 2000);
    } else {
      alert('Chưa chính xác! Hãy kiểm tra lại công thức.');
    }
  };

  return (
    <div className="heat-engine-game">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>⚙️ Động Cơ Nhiệt</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Zap size={16} />
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
              <h3>⚙️ Động cơ nhiệt</h3>
              
              <div className="theory-content">
                <div className="theory-section">
                  <h4>🔄 Nguyên lý hoạt động:</h4>
                  <p>Động cơ nhiệt biến đổi nhiệt năng thành cơ năng qua chu trình 4 kỳ:</p>
                  <ol>
                    <li><strong>Nạp:</strong> Hút hỗn hợp nhiên liệu - không khí vào xi lanh</li>
                    <li><strong>Nén:</strong> Nén hỗn hợp, nhiệt độ và áp suất tăng</li>
                    <li><strong>Cháy:</strong> Đốt cháy, sinh công đẩy piston xuống</li>
                    <li><strong>Thải:</strong> Đẩy khí thải ra ngoài</li>
                  </ol>
                </div>

                <div className="theory-section">
                  <h4>📊 Hiệu suất:</h4>
                  <div className="formula-box">
                    <code>H = (W / Q₁) × 100%</code>
                    <p>W: Công cơ học sinh ra</p>
                    <p>Q₁: Nhiệt lượng nhận vào</p>
                  </div>
                  <div className="formula-box">
                    <code>H = (T₁ - T₂) / T₁ × 100%</code>
                    <p>T₁: Nhiệt độ nguồn nóng (K)</p>
                    <p>T₂: Nhiệt độ nguồn lạnh (K)</p>
                    <p><em>(Chu trình Carnot lý tưởng)</em></p>
                  </div>
                </div>

                <div className="theory-section">
                  <h4>💡 Ứng dụng:</h4>
                  <p>Động cơ ô tô, xe máy, máy bay, nhà máy điện nhiệt...</p>
                  <p>Hiệu suất thực tế: 20-40% (còn lại mất dưới dạng nhiệt)</p>
                </div>
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Cog size={20} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="instruction-panel">
            <p><strong>Nhiệm vụ:</strong> {currentLevel.question}</p>
            <p className="hint">{currentLevel.instruction}</p>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
          />

          <div className="controls-panel">
            <div className="engine-controls">
              <button 
                className={`start-btn ${engineRunning ? 'running' : ''}`}
                onClick={startEngine}
                disabled={engineRunning}
              >
                <Cog size={20} />
                {engineRunning ? 'Đang chạy...' : 'Start động cơ'}
              </button>
              
              <button 
                className="stop-btn"
                onClick={stopEngine}
                disabled={!engineRunning}
              >
                Stop
              </button>
            </div>

            {currentLevel.task === 'optimize_engine' && (
              <div className="temperature-controls">
                <div className="temp-slider">
                  <label>🔥 Nguồn nóng T₁: {temperatureHot}K</label>
                  <input
                    type="range"
                    min="400"
                    max="800"
                    value={temperatureHot}
                    onChange={(e) => setTemperatureHot(parseInt(e.target.value))}
                    disabled={engineRunning}
                  />
                </div>
                <div className="temp-slider">
                  <label>❄️ Nguồn lạnh T₂: {temperatureCold}K</label>
                  <input
                    type="range"
                    min="200"
                    max="400"
                    value={temperatureCold}
                    onChange={(e) => setTemperatureCold(parseInt(e.target.value))}
                    disabled={engineRunning}
                  />
                </div>
              </div>
            )}

            {(currentLevel.task === 'calculate_efficiency' || 
              currentLevel.task === 'carnot_efficiency' || 
              currentLevel.task === 'optimize_engine') && (
              <div className="answer-section">
                <label>
                  {currentLevel.task === 'optimize_engine' 
                    ? 'Hiệu suất hiện tại:' 
                    : 'Nhập hiệu suất (%):'}
                </label>
                {currentLevel.task === 'optimize_engine' ? (
                  <div className="efficiency-display">
                    {efficiency.toFixed(1)}%
                  </div>
                ) : (
                  <input
                    type="number"
                    step="0.1"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Hiệu suất %"
                    disabled={answered}
                  />
                )}
                <button 
                  className="check-button"
                  onClick={checkAnswer}
                  disabled={
                    answered || 
                    (currentLevel.task !== 'optimize_engine' && !userAnswer)
                  }
                >
                  Kiểm tra
                </button>
              </div>
            )}

            {answered && (
              <div className="correct-indicator">
                ✓ Hoàn thành! Chuyển level tiếp theo...
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã hoàn thành tất cả 10 game Vật lý lớp 8!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <strong>Thời gian:</strong>
              <span>{time}s</span>
            </div>
          </div>
          <div className="victory-message">
            <p>🏆 Chúc mừng! Bạn đã nắm vững kiến thức về:</p>
            <ul>
              <li>✓ Cơ học: Chuyển động, lực, áp suất, công suất</li>
              <li>✓ Nhiệt học: Phân tử, truyền nhiệt, nhiệt lượng, động cơ</li>
            </ul>
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

export default HeatEngine;
