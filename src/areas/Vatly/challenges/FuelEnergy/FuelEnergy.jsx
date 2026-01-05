import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Zap, Trophy, Fuel } from 'lucide-react';
import './FuelEnergy.css';

const FuelEnergy = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  // Simulation state
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [fuelMass, setFuelMass] = useState(1);
  const [burning, setBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [heatReleased, setHeatReleased] = useState(0);
  const [flames, setFlames] = useState([]);
  const [waterTemp, setWaterTemp] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const fuels = {
    coal: { 
      name: 'Than đá', 
      q: 27000000, // J/kg
      color: '#1e293b',
      icon: '⛏️',
      burnRate: 0.015
    },
    wood: { 
      name: 'Gỗ', 
      q: 10000000,
      color: '#92400e',
      icon: '🪵',
      burnRate: 0.025
    },
    gasoline: { 
      name: 'Xăng', 
      q: 46000000,
      color: '#fbbf24',
      icon: '⛽',
      burnRate: 0.03
    },
    gas: { 
      name: 'Ga', 
      q: 44000000,
      color: '#3b82f6',
      icon: '🔥',
      burnRate: 0.028
    },
    alcohol: { 
      name: 'Cồn', 
      q: 27000000,
      color: '#a855f7',
      icon: '🧪',
      burnRate: 0.022
    }
  };

  const levels = [
    {
      id: 1,
      name: 'Năng Suất Tỏa Nhiệt',
      description: 'Tính nhiệt lượng tỏa ra khi đốt cháy nhiên liệu: Q = q × m',
      task: 'calculate_heat',
      fuel: 'coal',
      mass: 2,
      question: 'Tính nhiệt lượng tỏa ra khi đốt cháy hoàn toàn 2kg than đá',
      instruction: 'Sử dụng công thức Q = q × m'
    },
    {
      id: 2,
      name: 'So Sánh Nhiên Liệu',
      description: 'So sánh năng suất tỏa nhiệt của các loại nhiên liệu',
      task: 'compare_fuels',
      fuel: null,
      mass: 1,
      question: 'Nhiên liệu nào tỏa nhiệt nhiều nhất khi đốt 1kg?',
      instruction: 'So sánh giá trị q của các nhiên liệu'
    },
    {
      id: 3,
      name: 'Đun Nước Bằng Nhiên Liệu',
      description: 'Tính khối lượng nhiên liệu cần dùng để đun sôi nước',
      task: 'heat_water',
      fuel: 'gasoline',
      mass: null,
      waterMass: 5,
      question: 'Tính khối lượng xăng cần đốt để đun sôi 5kg nước từ 20°C',
      instruction: 'Q(nước) = m(xăng) × q(xăng) × H (H: hiệu suất)'
    },
    {
      id: 4,
      name: 'Hiệu Suất Sử Dụng',
      description: 'Tính hiệu suất sử dụng nhiên liệu',
      task: 'efficiency',
      fuel: 'gas',
      mass: 0.5,
      waterMass: 10,
      question: 'Tính hiệu suất khi dùng 0.5kg ga đun nước (chỉ 60% nhiệt truyền vào nước)',
      instruction: 'H = (Q(có ích) / Q(toàn phần)) × 100%'
    }
  ];

  const currentLevel = levels[level - 1];

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
  }, [gameState, burning, burnProgress, flames, waterTemp]);

  const initLevel = () => {
    if (currentLevel.fuel) {
      setSelectedFuel(currentLevel.fuel);
    } else {
      setSelectedFuel(null);
    }
    setFuelMass(currentLevel.mass || 1);
    setBurning(false);
    setBurnProgress(0);
    setHeatReleased(0);
    setWaterTemp(20);
    setAnswered(false);
    setUserAnswer('');
    setFlames([]);
  };

  const animate = () => {
    if (burning && burnProgress < 100) {
      updateBurning();
    }
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const updateBurning = () => {
    if (!selectedFuel) return;

    const fuel = fuels[selectedFuel];
    
    setBurnProgress(prev => {
      const newProgress = Math.min(prev + fuel.burnRate, 100);
      
      // Calculate heat released
      const massburnt = (newProgress / 100) * fuelMass;
      const heat = massburnt * fuel.q;
      setHeatReleased(heat);

      // Update water temperature if applicable
      if (currentLevel.task === 'heat_water' || currentLevel.task === 'efficiency') {
        const waterMass = currentLevel.waterMass || 5;
        const efficiency = currentLevel.task === 'efficiency' ? 0.6 : 0.8;
        const heatToWater = heat * efficiency;
        const tempIncrease = heatToWater / (waterMass * 4200); // Q = mcΔt
        setWaterTemp(20 + tempIncrease);
      }

      return newProgress;
    });

    // Update flames
    setFlames(prev => {
      const newFlames = prev.map(f => ({
        ...f,
        y: f.y - f.vy,
        x: f.x + (Math.random() - 0.5) * 2,
        opacity: f.opacity - 0.02,
        size: f.size * 0.98
      })).filter(f => f.opacity > 0);

      // Add new flames
      if (Math.random() > 0.3) {
        newFlames.push({
          x: 400 + (Math.random() - 0.5) * 80,
          y: 380,
          vy: 2 + Math.random() * 2,
          opacity: 1,
          size: 10 + Math.random() * 20,
          color: Math.random() > 0.5 ? '#ff6b35' : '#fbbf24'
        });
      }

      return newFlames;
    });
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

    // Draw burner
    drawBurner(ctx, width, height);

    // Draw fuel
    if (selectedFuel) {
      drawFuel(ctx, width, height);
    }

    // Draw flames
    flames.forEach(f => {
      const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
      gradient.addColorStop(0, f.color + 'ff');
      gradient.addColorStop(0.5, f.color + Math.floor(f.opacity * 128).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, f.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw water container if applicable
    if (currentLevel.task === 'heat_water' || currentLevel.task === 'efficiency') {
      drawWaterContainer(ctx, width, height);
    }

    // Draw info panel
    drawInfoPanel(ctx, width, height);
  };

  const drawBurner = (ctx, width, height) => {
    // Burner base
    ctx.fillStyle = '#64748b';
    ctx.fillRect(320, 400, 160, 20);
    
    // Burner legs
    ctx.fillRect(340, 420, 10, 40);
    ctx.fillRect(450, 420, 10, 40);

    // Burner platform
    ctx.fillStyle = '#475569';
    ctx.fillRect(300, 380, 200, 20);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(300, 380, 200, 20);
  };

  const drawFuel = (ctx, width, height) => {
    const fuel = fuels[selectedFuel];
    const fuelHeight = 40;
    const fuelWidth = 120;
    const remainingHeight = fuelHeight * (1 - burnProgress / 100);

    // Fuel block
    ctx.fillStyle = fuel.color;
    ctx.fillRect(340, 380 - remainingHeight, fuelWidth, remainingHeight);
    
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 2;
    ctx.strokeRect(340, 380 - fuelHeight, fuelWidth, fuelHeight);

    // Fuel label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${fuel.icon} ${fuel.name}`, 400, 350);
    
    ctx.font = '12px Arial';
    ctx.fillText(`${fuelMass} kg`, 400, 370);

    // Burn progress bar
    if (burning) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(320, 430, 160, 20);
      
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(320, 430, 160 * (burnProgress / 100), 20);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(320, 430, 160, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${burnProgress.toFixed(0)}%`, 400, 444);
    }
  };

  const drawWaterContainer = (ctx, width, height) => {
    const containerX = 560;
    const containerY = 280;
    const containerWidth = 180;
    const containerHeight = 100;

    // Container
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

    // Water
    const waterHeight = containerHeight * 0.8;
    const tempRatio = Math.min((waterTemp - 20) / 80, 1);
    const red = Math.floor(50 + tempRatio * 205);
    const blue = Math.floor(255 - tempRatio * 100);
    
    ctx.fillStyle = `rgba(${red}, 150, ${blue}, 0.6)`;
    ctx.fillRect(containerX, containerY + containerHeight - waterHeight, containerWidth, waterHeight);

    // Steam if boiling
    if (waterTemp > 95) {
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(200, 200, 255, ${0.5 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(
          containerX + 50 + i * 30 + Math.random() * 10,
          containerY - 20 - i * 15,
          8 - i,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Temperature display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${waterTemp.toFixed(1)}°C`, containerX + containerWidth / 2, containerY + 50);

    ctx.font = '12px Arial';
    ctx.fillText(`${currentLevel.waterMass} kg nước`, containerX + containerWidth / 2, containerY + 70);

    // Label
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('💧 Nước', containerX + containerWidth / 2, containerY - 10);
  };

  const drawInfoPanel = (ctx, width, height) => {
    const panelX = 20;
    const panelY = 80;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(panelX, panelY, 250, 280);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, 250, 280);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('📊 THÔNG TIN', panelX + 15, panelY + 25);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Arial';

    if (selectedFuel) {
      const fuel = fuels[selectedFuel];
      ctx.fillText(`Nhiên liệu: ${fuel.name}`, panelX + 15, panelY + 55);
      ctx.fillText(`Năng suất: ${(fuel.q / 1000000).toFixed(1)} MJ/kg`, panelX + 15, panelY + 75);
      ctx.fillText(`Khối lượng: ${fuelMass} kg`, panelX + 15, panelY + 95);
    }

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 15, panelY + 105);
    ctx.lineTo(panelX + 235, panelY + 105);
    ctx.stroke();

    ctx.fillText(`Tiến trình đốt: ${burnProgress.toFixed(1)}%`, panelX + 15, panelY + 125);
    ctx.fillText(`Nhiệt tỏa ra:`, panelX + 15, panelY + 145);
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${(heatReleased / 1000000).toFixed(2)} MJ`, panelX + 15, panelY + 165);

    if (currentLevel.task === 'heat_water' || currentLevel.task === 'efficiency') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Arial';
      ctx.fillText(`Nhiệt độ nước: ${waterTemp.toFixed(1)}°C`, panelX + 15, panelY + 190);
      
      if (waterTemp >= 100) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px Arial';
        ctx.fillText('✓ Nước đã sôi!', panelX + 15, panelY + 210);
      }
    }

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 15, panelY + 220);
    ctx.lineTo(panelX + 235, panelY + 220);
    ctx.stroke();

    // Formula
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Công thức:', panelX + 15, panelY + 240);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Q = q × m', panelX + 15, panelY + 260);
    ctx.fillText('q: năng suất (J/kg)', panelX + 15, panelY + 280);
    ctx.fillText('m: khối lượng (kg)', panelX + 15, panelY + 300);
  };

  const startBurning = () => {
    if (selectedFuel) {
      setBurning(true);
    }
  };

  const selectFuel = (fuelKey) => {
    if (!burning && !answered) {
      setSelectedFuel(fuelKey);
    }
  };

  const checkAnswer = () => {
    const answer = parseFloat(userAnswer);
    let correct = false;

    if (currentLevel.task === 'calculate_heat') {
      const Q = currentLevel.mass * fuels[currentLevel.fuel].q;
      correct = Math.abs(answer - Q / 1000000) < 1; // MJ tolerance
    } else if (currentLevel.task === 'compare_fuels') {
      const maxQ = Math.max(...Object.values(fuels).map(f => f.q));
      const correctFuel = Object.entries(fuels).find(([k, f]) => f.q === maxQ);
      correct = selectedFuel === correctFuel[0];
    } else if (currentLevel.task === 'heat_water') {
      const waterMass = currentLevel.waterMass;
      const Q_needed = waterMass * 4200 * 80; // Heat to boil from 20°C
      const efficiency = 0.8;
      const m_fuel = Q_needed / (fuels[currentLevel.fuel].q * efficiency);
      correct = Math.abs(answer - m_fuel * 1000) < 10; // gram tolerance
    } else if (currentLevel.task === 'efficiency') {
      const efficiency = 60;
      correct = Math.abs(answer - efficiency) < 5;
    }

    if (correct) {
      setAnswered(true);
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + Math.max(400 - time * 4, 200));
          setGameState('playing');
        } else {
          setScore(s => s + Math.max(400 - time * 4, 200));
          setGameState('victory');
        }
      }, 2000);
    } else {
      alert('Chưa chính xác! Hãy kiểm tra lại tính toán.');
    }
  };

  return (
    <div className="fuel-energy-game">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>⛽ Năng Lượng Nhiên Liệu</h1>
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
              <h3>🔥 Năng suất tỏa nhiệt</h3>
              
              <div className="formula-display">
                <div className="main-formula">
                  <strong>Công thức tính nhiệt lượng:</strong>
                  <code>Q = q × m</code>
                  <p>Q: Nhiệt lượng tỏa ra (J)</p>
                  <p>q: Năng suất tỏa nhiệt (J/kg)</p>
                  <p>m: Khối lượng nhiên liệu (kg)</p>
                </div>
              </div>

              <div className="fuels-grid">
                <h4>Năng suất tỏa nhiệt các nhiên liệu:</h4>
                {Object.entries(fuels).map(([key, fuel]) => (
                  <div key={key} className="fuel-card">
                    <span className="fuel-icon">{fuel.icon}</span>
                    <strong>{fuel.name}</strong>
                    <span className="fuel-value">q = {(fuel.q / 1000000).toFixed(1)} MJ/kg</span>
                  </div>
                ))}
              </div>

              <div className="note-box">
                <p><strong>Ý nghĩa:</strong> Năng suất tỏa nhiệt cho biết nhiệt lượng tỏa ra khi đốt cháy hoàn toàn 1kg nhiên liệu.</p>
                <p><strong>Ứng dụng:</strong> Chọn nhiên liệu phù hợp, tính toán hiệu suất sử dụng năng lượng.</p>
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Flame size={20} />
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

          {currentLevel.task === 'compare_fuels' && !burning && (
            <div className="fuel-selector">
              <p>Chọn nhiên liệu:</p>
              <div className="fuel-buttons">
                {Object.entries(fuels).map(([key, fuel]) => (
                  <button
                    key={key}
                    className={`fuel-btn ${selectedFuel === key ? 'selected' : ''}`}
                    onClick={() => selectFuel(key)}
                  >
                    {fuel.icon} {fuel.name}
                    <span>{(fuel.q / 1000000).toFixed(1)} MJ/kg</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
          />

          <div className="controls-panel">
            <button 
              className={`burn-button ${burning ? 'burning' : ''}`}
              onClick={startBurning}
              disabled={burning || !selectedFuel || answered}
            >
              <Flame size={20} />
              {burning ? 'Đang đốt...' : 'Đốt nhiên liệu'}
            </button>

            <div className="answer-section">
              <label>Nhập kết quả:</label>
              <input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={
                  currentLevel.task === 'calculate_heat' ? 'Nhiệt lượng (MJ)' :
                  currentLevel.task === 'heat_water' ? 'Khối lượng (g)' :
                  currentLevel.task === 'efficiency' ? 'Hiệu suất (%)' :
                  'Đáp án...'
                }
                disabled={answered}
              />
              <button 
                className="check-button"
                onClick={checkAnswer}
                disabled={!userAnswer || answered}
              >
                Kiểm tra
              </button>
            </div>

            {answered && (
              <div className="correct-indicator">
                ✓ Chính xác! Chuyển level tiếp theo...
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Hoàn thành xuất sắc!</h2>
          <p>Bạn đã nắm vững kiến thức về năng lượng nhiên liệu!</p>
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

export default FuelEnergy;
