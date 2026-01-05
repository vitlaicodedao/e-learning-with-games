import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Flame, Zap, ThermometerSun, Lightbulb, Activity } from 'lucide-react';
import './PowerHeatMaster.css';

/**
 * Power & Heat Master - Lớp 9 Chương 1: Điện học
 * 
 * Game về công suất điện và định luật Jun-Lenxơ
 * Quản lý các thiết bị điện để đạt công suất mục tiêu và kiểm soát nhiệt
 * 
 * Physics:
 * - Công suất điện: P = U×I = I²×R = U²/R (W)
 * - Định luật Jun-Lenxơ: Q = I²×R×t (J)
 * - Điện năng tiêu thụ: A = P×t (Wh hoặc kWh)
 * - Tiết kiệm điện: Chọn thiết bị hiệu quả
 * 
 * 4 Levels:
 * 1. Cơ bản: Tính công suất thiết bị
 * 2. Trung bình: Quản lý nhiệt độ do dòng điện
 * 3. Khó: Tối ưu hóa tiêu thụ điện
 * 4. Chuyên gia: An toàn điện và tiết kiệm năng lượng
 */

const PowerHeatMaster = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Active devices
  const [activeDevices, setActiveDevices] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [heatGenerated, setHeatGenerated] = useState(0);
  const [temperature, setTemperature] = useState(25); // Room temperature

  // Energy consumption
  const [energyUsed, setEnergyUsed] = useState(0); // kWh
  const [monthlyCost, setMonthlyCost] = useState(0); // VNĐ

  // Target requirements
  const [targetPower, setTargetPower] = useState({ min: 0, max: 0 });
  const [maxTemp, setMaxTemp] = useState(60);

  const voltage = 220; // V - điện áp lưới điện
  const electricityRate = 2500; // VNĐ/kWh

  // Available electrical devices
  const availableDevices = [
    {
      id: 'bulb-40w',
      name: 'Bóng đèn 40W',
      type: 'light',
      power: 40,
      resistance: 1210,
      icon: '💡',
      color: '#fbbf24',
      efficiency: 0.05
    },
    {
      id: 'bulb-60w',
      name: 'Bóng đèn 60W',
      type: 'light',
      power: 60,
      resistance: 807,
      icon: '💡',
      color: '#f59e0b',
      efficiency: 0.05
    },
    {
      id: 'bulb-100w',
      name: 'Bóng đèn 100W',
      type: 'light',
      power: 100,
      resistance: 484,
      icon: '💡',
      color: '#d97706',
      efficiency: 0.05
    },
    {
      id: 'led-10w',
      name: 'Đèn LED 10W',
      type: 'light',
      power: 10,
      resistance: 4840,
      icon: '🔆',
      color: '#10b981',
      efficiency: 0.95
    },
    {
      id: 'fan-50w',
      name: 'Quạt 50W',
      type: 'cooling',
      power: 50,
      resistance: 968,
      icon: '🌀',
      color: '#06b6d4',
      efficiency: 0.7,
      coolingPower: 30
    },
    {
      id: 'heater-1000w',
      name: 'Bếp điện 1000W',
      type: 'heating',
      power: 1000,
      resistance: 48.4,
      icon: '🔥',
      color: '#ef4444',
      efficiency: 0.9
    },
    {
      id: 'iron-1200w',
      name: 'Bàn ủi 1200W',
      type: 'heating',
      power: 1200,
      resistance: 40.3,
      icon: '🪔',
      color: '#f97316',
      efficiency: 0.85
    },
    {
      id: 'ac-1500w',
      name: 'Điều hòa 1500W',
      type: 'cooling',
      power: 1500,
      resistance: 32.3,
      icon: '❄️',
      color: '#3b82f6',
      efficiency: 0.75,
      coolingPower: 150
    }
  ];

  // Level configurations
  const levelConfigs = {
    1: {
      name: 'Cơ Bản: Công Suất Điện',
      description: 'Bật các thiết bị để đạt công suất mục tiêu',
      targetPower: { min: 200, max: 300 },
      maxTemp: 60,
      timeLimit: 120
    },
    2: {
      name: 'Trung Bình: Kiểm Soát Nhiệt',
      description: 'Đạt công suất mục tiêu mà không quá nhiệt',
      targetPower: { min: 500, max: 700 },
      maxTemp: 50,
      timeLimit: 150
    },
    3: {
      name: 'Khó: Tối Ưu Điện Năng',
      description: 'Đạt yêu cầu với hiệu suất cao nhất',
      targetPower: { min: 1000, max: 1500 },
      maxTemp: 45,
      timeLimit: 180,
      requireEfficiency: 0.7
    },
    4: {
      name: 'Chuyên Gia: An Toàn & Tiết Kiệm',
      description: 'Quản lý tổng hợp: công suất, nhiệt, chi phí',
      targetPower: { min: 800, max: 1200 },
      maxTemp: 40,
      timeLimit: 240,
      requireEfficiency: 0.8,
      maxCost: 50000 // VNĐ/tháng
    }
  };

  // Initialize game
  const startGame = useCallback(() => {
    const config = levelConfigs[level];
    setGameState('playing');
    setScore(0);
    setTimeLeft(config.timeLimit);
    setActiveDevices([]);
    setTotalPower(0);
    setTotalCurrent(0);
    setHeatGenerated(0);
    setTemperature(25);
    setEnergyUsed(0);
    setMonthlyCost(0);
    setTargetPower(config.targetPower);
    setMaxTemp(config.maxTemp);
  }, [level]);

  // Toggle device on/off
  const toggleDevice = (device) => {
    const isActive = activeDevices.find(d => d.id === device.id);
    
    if (isActive) {
      // Turn off
      setActiveDevices(prev => prev.filter(d => d.id !== device.id));
    } else {
      // Turn on
      setActiveDevices(prev => [...prev, device]);
    }
  };

  // Calculate circuit properties
  useEffect(() => {
    if (activeDevices.length === 0) {
      setTotalPower(0);
      setTotalCurrent(0);
      setHeatGenerated(0);
      return;
    }

    // Calculate total power (devices in parallel)
    const power = activeDevices.reduce((sum, device) => sum + device.power, 0);
    setTotalPower(power);

    // Calculate total current: I = P/U
    const current = power / voltage;
    setTotalCurrent(current);

    // Calculate heat generated (Joule heating): Q = P×t
    // For simplicity, assuming 1 second intervals
    const heat = power * 0.1; // Simplified
    setHeatGenerated(heat);

  }, [activeDevices, voltage]);

  // Update temperature based on heat
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTemperature(prev => {
        // Add heat from devices
        let newTemp = prev + heatGenerated * 0.001;
        
        // Subtract cooling from fans/AC
        const coolingDevices = activeDevices.filter(d => d.type === 'cooling');
        const totalCooling = coolingDevices.reduce((sum, d) => sum + (d.coolingPower || 0), 0);
        newTemp -= totalCooling * 0.001;
        
        // Natural cooling to room temperature
        newTemp += (25 - newTemp) * 0.05;
        
        return Math.max(20, Math.min(100, newTemp));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, heatGenerated, activeDevices]);

  // Calculate energy consumption
  useEffect(() => {
    if (gameState !== 'playing' || totalPower === 0) return;

    const interval = setInterval(() => {
      // Energy in kWh (1 second = 1/3600 hour)
      const energyDelta = (totalPower / 1000) / 3600;
      setEnergyUsed(prev => prev + energyDelta);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, totalPower]);

  // Calculate monthly cost
  useEffect(() => {
    // Assuming 8 hours/day usage
    const dailyEnergy = (totalPower / 1000) * 8; // kWh
    const monthlyEnergy = dailyEnergy * 30;
    const cost = monthlyEnergy * electricityRate;
    setMonthlyCost(Math.floor(cost));
  }, [totalPower]);

  // Check if requirements are met
  const checkRequirements = () => {
    const config = levelConfigs[level];
    const powerOK = totalPower >= config.targetPower.min && totalPower <= config.targetPower.max;
    const tempOK = temperature <= config.maxTemp;
    
    let efficiencyOK = true;
    if (config.requireEfficiency) {
      const avgEfficiency = activeDevices.reduce((sum, d) => sum + d.efficiency, 0) / activeDevices.length;
      efficiencyOK = avgEfficiency >= config.requireEfficiency;
    }
    
    let costOK = true;
    if (config.maxCost) {
      costOK = monthlyCost <= config.maxCost;
    }
    
    return powerOK && tempOK && efficiencyOK && costOK;
  };

  // Submit solution
  const submitSolution = () => {
    if (checkRequirements()) {
      const config = levelConfigs[level];
      const timeBonus = Math.floor(timeLeft / 10) * 100;
      const efficiencyBonus = Math.floor(
        (activeDevices.reduce((sum, d) => sum + d.efficiency, 0) / activeDevices.length) * 500
      );
      const earnedPoints = 1000 + timeBonus + efficiencyBonus;
      
      setScore(prev => prev + earnedPoints);
      
      if (level < 4) {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          startGame();
        }, 2000);
      } else {
        setTimeout(() => setGameState('victory'), 2000);
      }
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
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
    }
  }, [gameState, timeLeft]);

  // Canvas animation
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw room
      drawRoom(ctx);
      
      // Draw devices
      drawDevices(ctx);
      
      // Draw heat visualization
      drawHeatVisualization(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, activeDevices, temperature]);

  // Draw room
  const drawRoom = (ctx) => {
    // Floor
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 400, 800, 100);
    
    // Walls
    ctx.fillStyle = '#e0d5c7';
    ctx.fillRect(0, 0, 800, 400);
    
    // Temperature indicator
    const tempRatio = (temperature - 20) / 80;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `rgba(239, 68, 68, ${tempRatio * 0.3})`);
    gradient.addColorStop(1, `rgba(239, 68, 68, ${tempRatio * 0.1})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
  };

  // Draw devices in room
  const drawDevices = (ctx) => {
    activeDevices.forEach((device, index) => {
      const x = 100 + (index % 4) * 180;
      const y = 100 + Math.floor(index / 4) * 150;
      
      // Device icon
      ctx.font = '48px Arial';
      ctx.fillText(device.icon, x, y);
      
      // Power indicator
      ctx.fillStyle = device.color;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${device.power}W`, x, y + 40);
      
      // Activity animation
      if (device.type === 'light') {
        const gradient = ctx.createRadialGradient(x + 24, y - 24, 0, x + 24, y - 24, 40);
        gradient.addColorStop(0, device.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + 24, y - 24, 40, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  // Draw heat visualization
  const drawHeatVisualization = (ctx) => {
    if (temperature > 30) {
      const heatParticles = Math.floor((temperature - 30) * 2);
      
      for (let i = 0; i < heatParticles; i++) {
        const x = Math.random() * 800;
        const y = 400 - Math.random() * 100;
        const size = 2 + Math.random() * 3;
        const alpha = 0.3 + Math.random() * 0.3;
        
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const config = levelConfigs[level];
  const requirementsMet = checkRequirements();

  return (
    <div className="power-heat-master">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Flame className="title-icon" />
          Power & Heat Master
        </h1>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Flame size={80} className="menu-icon" />
            <h2>Quản Lý Công Suất & Nhiệt Độ</h2>
            <p className="menu-description">
              Làm chủ công suất điện và định luật Jun-Lenxơ
            </p>
            
            <div className="theory-box">
              <h3>Công Thức Cần Nhớ</h3>
              <div className="formula-grid">
                <div className="formula-item">
                  <p className="formula">P = U × I</p>
                  <p className="formula-desc">Công suất điện (W)</p>
                </div>
                <div className="formula-item">
                  <p className="formula">P = I² × R</p>
                  <p className="formula-desc">Công suất theo điện trở</p>
                </div>
                <div className="formula-item">
                  <p className="formula">Q = I² × R × t</p>
                  <p className="formula-desc">Định luật Jun-Lenxơ (J)</p>
                </div>
                <div className="formula-item">
                  <p className="formula">A = P × t</p>
                  <p className="formula-desc">Điện năng tiêu thụ (Wh)</p>
                </div>
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn Cấp Độ</h3>
              <div className="level-buttons">
                {[1, 2, 3, 4].map(lvl => (
                  <button
                    key={lvl}
                    className={`level-btn ${level === lvl ? 'active' : ''}`}
                    onClick={() => setLevel(lvl)}
                  >
                    <span className="level-number">Level {lvl}</span>
                    <span className="level-name">{levelConfigs[lvl].name}</span>
                    <span className="level-desc">{levelConfigs[lvl].description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startGame} className="start-button">
              <Zap size={20} />
              Bắt Đầu Quản Lý
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
            <div className={`stat-item ${requirementsMet ? 'success' : 'warning'}`}>
              <span className="stat-label">Yêu cầu</span>
              <span className="stat-value">{requirementsMet ? '✓ Đạt' : '✗ Chưa'}</span>
            </div>
          </div>

          <div className="game-content">
            <div className="room-view">
              <canvas ref={canvasRef} className="room-canvas" />
            </div>

            <div className="control-panel">
              <div className="measurements-panel">
                <h3>Đo Lường</h3>
                <div className="measurement">
                  <Zap className="measure-icon" />
                  <div className="measure-info">
                    <span className="measure-label">Công suất:</span>
                    <span className="measure-value">{totalPower.toFixed(0)} W</span>
                  </div>
                </div>
                <div className="measurement">
                  <Activity className="measure-icon" />
                  <div className="measure-info">
                    <span className="measure-label">Dòng điện:</span>
                    <span className="measure-value">{totalCurrent.toFixed(2)} A</span>
                  </div>
                </div>
                <div className="measurement">
                  <ThermometerSun className="measure-icon temperature-icon" />
                  <div className="measure-info">
                    <span className="measure-label">Nhiệt độ:</span>
                    <span className={`measure-value ${temperature > maxTemp ? 'danger' : ''}`}>
                      {temperature.toFixed(1)}°C
                    </span>
                  </div>
                </div>
                <div className="measurement">
                  <Flame className="measure-icon" />
                  <div className="measure-info">
                    <span className="measure-label">Chi phí/tháng:</span>
                    <span className="measure-value">{monthlyCost.toLocaleString()} đ</span>
                  </div>
                </div>
              </div>

              <div className="target-panel">
                <h3>Mục Tiêu</h3>
                <ul>
                  <li className={totalPower >= targetPower.min && totalPower <= targetPower.max ? 'met' : ''}>
                    Công suất: {targetPower.min}-{targetPower.max}W
                  </li>
                  <li className={temperature <= maxTemp ? 'met' : ''}>
                    Nhiệt độ ≤ {maxTemp}°C
                  </li>
                  {config.requireEfficiency && (
                    <li>Hiệu suất ≥ {(config.requireEfficiency * 100).toFixed(0)}%</li>
                  )}
                  {config.maxCost && (
                    <li className={monthlyCost <= config.maxCost ? 'met' : ''}>
                      Chi phí ≤ {config.maxCost.toLocaleString()} đ
                    </li>
                  )}
                </ul>
              </div>

              <div className="devices-panel">
                <h3>Thiết Bị Điện</h3>
                <div className="device-grid">
                  {availableDevices.map(device => {
                    const isActive = activeDevices.find(d => d.id === device.id);
                    return (
                      <button
                        key={device.id}
                        className={`device-btn ${isActive ? 'active' : ''}`}
                        onClick={() => toggleDevice(device)}
                        style={{ borderColor: device.color }}
                      >
                        <span className="device-icon">{device.icon}</span>
                        <span className="device-name">{device.name}</span>
                        <span className="device-power">{device.power}W</span>
                        <span className="device-efficiency">
                          H: {(device.efficiency * 100).toFixed(0)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={submitSolution}
                className={`submit-btn ${requirementsMet ? 'ready' : 'disabled'}`}
                disabled={!requirementsMet}
              >
                <Lightbulb size={20} />
                {requirementsMet ? 'Hoàn Thành!' : 'Chưa Đạt Yêu Cầu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <div className="victory-content">
            <Trophy size={80} className="trophy-icon" />
            <h2>Xuất Sắc!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm Cuối:</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Level Đạt:</span>
                <span className="final-value">{level}</span>
              </div>
            </div>
            <div className="victory-buttons">
              <button onClick={() => {
                setLevel(1);
                setGameState('menu');
              }} className="menu-button">
                Menu
              </button>
              <button onClick={() => {
                setLevel(1);
                startGame();
              }} className="replay-button">
                <Flame size={20} />
                Chơi Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerHeatMaster;
