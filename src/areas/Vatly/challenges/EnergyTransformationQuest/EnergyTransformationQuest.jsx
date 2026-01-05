import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Zap, ArrowRightLeft } from 'lucide-react';
import './EnergyTransformationQuest.css';

/**
 * Energy Transformation Quest - Grade 9 Physics Game
 * Demonstrates energy transformation and conservation
 * Physics: Law of conservation of energy, energy conversion efficiency
 */

const EnergyTransformationQuest = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [targetsCompleted, setTargetsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Energy system state
  const [currentSystem, setCurrentSystem] = useState('pendulum');
  const [animationTime, setAnimationTime] = useState(0);

  // Pendulum system
  const [pendulumAngle, setPendulumAngle] = useState(45); // degrees
  const [pendulumLength, setPendulumLength] = useState(2); // meters

  // Energy values
  const [potentialEnergy, setPotentialEnergy] = useState(0);
  const [kineticEnergy, setKineticEnergy] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [efficiency, setEfficiency] = useState(100);

  // Target values
  const [targetEnergyType, setTargetEnergyType] = useState('');
  const [targetPercentage, setTargetPercentage] = useState(0);

  // Energy transformation systems
  const systems = [
    {
      id: 'pendulum',
      name: 'Con lắc đơn',
      description: 'Thế năng ⇄ Động năng',
      energyTypes: ['Thế năng', 'Động năng']
    },
    {
      id: 'spring',
      name: 'Lò xo',
      description: 'Thế năng đàn hồi ⇄ Động năng',
      energyTypes: ['Thế năng đàn hồi', 'Động năng']
    },
    {
      id: 'roller',
      name: 'Tàu lượn',
      description: 'Thế năng ⇄ Động năng (có ma sát)',
      energyTypes: ['Thế năng', 'Động năng', 'Nhiệt năng']
    },
    {
      id: 'water',
      name: 'Thủy điện',
      description: 'Thế năng → Động năng → Điện năng',
      energyTypes: ['Thế năng', 'Động năng', 'Điện năng']
    }
  ];

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Con lắc đơn',
      description: 'Học về chuyển đổi thế năng và động năng',
      duration: 120,
      targetsNeeded: 3,
      allowedSystems: ['pendulum'],
      hasLoss: false
    },
    {
      id: 2,
      name: 'Trung bình - Lò xo & Con lắc',
      description: 'Nhiều hệ chuyển đổi năng lượng',
      duration: 150,
      targetsNeeded: 4,
      allowedSystems: ['pendulum', 'spring'],
      hasLoss: false
    },
    {
      id: 3,
      name: 'Nâng cao - Có ma sát',
      description: 'Chuyển đổi năng lượng với tổn thất',
      duration: 180,
      targetsNeeded: 5,
      allowedSystems: ['pendulum', 'spring', 'roller'],
      hasLoss: true
    },
    {
      id: 4,
      name: 'Chuyên gia - Thủy điện',
      description: 'Chuyển đổi năng lượng phức tạp',
      duration: 240,
      targetsNeeded: 6,
      allowedSystems: ['pendulum', 'spring', 'roller', 'water'],
      hasLoss: true
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Physics constants
  const g = 10; // m/s² (simplified)
  const mass = 1; // kg

  // Calculate energy for pendulum
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (currentSystem === 'pendulum') {
      // Pendulum energy calculation
      const angleRad = (pendulumAngle * Math.PI) / 180;
      const currentAngleRad = Math.sin(animationTime * 2) * angleRad;
      
      // Height: h = L(1 - cos(θ))
      const h = pendulumLength * (1 - Math.cos(currentAngleRad));
      const maxH = pendulumLength * (1 - Math.cos(angleRad));
      
      // Potential energy: PE = mgh
      const pe = mass * g * h;
      setPotentialEnergy(pe);
      
      // Total energy (at max height)
      const total = mass * g * maxH;
      setTotalEnergy(total);
      
      // Kinetic energy: KE = Total - PE
      let ke = total - pe;
      if (currentLevel.hasLoss) {
        // Apply energy loss (friction)
        const loss = (1 - efficiency / 100);
        ke = ke * (1 - loss * 0.5);
      }
      setKineticEnergy(Math.max(0, ke));
      
    } else if (currentSystem === 'spring') {
      // Spring oscillation
      const amplitude = 0.2; // meters
      const x = amplitude * Math.cos(animationTime * 3);
      
      // Spring constant k = 100 N/m
      const k = 100;
      
      // Elastic potential energy: PE = 0.5 * k * x²
      const pe = 0.5 * k * x * x;
      setPotentialEnergy(pe);
      
      // Total energy (at max displacement)
      const total = 0.5 * k * amplitude * amplitude;
      setTotalEnergy(total);
      
      // Kinetic energy
      let ke = total - pe;
      if (currentLevel.hasLoss) {
        const loss = (1 - efficiency / 100);
        ke = ke * (1 - loss * 0.3);
      }
      setKineticEnergy(Math.max(0, ke));
      
    } else if (currentSystem === 'roller') {
      // Roller coaster
      const maxHeight = 10; // meters
      const currentHeight = maxHeight * (0.5 + 0.5 * Math.cos(animationTime * 1.5));
      
      // Potential energy
      const pe = mass * g * currentHeight;
      setPotentialEnergy(pe);
      
      // Total energy
      const total = mass * g * maxHeight;
      setTotalEnergy(total);
      
      // Kinetic energy with friction loss
      const loss = (1 - efficiency / 100);
      const ke = Math.max(0, (total - pe) * (1 - loss));
      setKineticEnergy(ke);
      
    } else if (currentSystem === 'water') {
      // Hydroelectric system
      const waterHeight = 50; // meters
      const flowRate = 0.5; // progress through system
      
      // Initial potential energy
      const initialPE = mass * g * waterHeight;
      
      // Energy stages with conversion efficiency
      const pePercent = Math.max(0, 1 - flowRate * 2);
      const kePercent = flowRate < 0.5 ? flowRate * 2 : Math.max(0, 1 - (flowRate - 0.5) * 2);
      const electricPercent = flowRate > 0.5 ? (flowRate - 0.5) * 2 : 0;
      
      const loss = (1 - efficiency / 100);
      setPotentialEnergy(initialPE * pePercent);
      setKineticEnergy(initialPE * kePercent * 0.9); // 90% conversion
      
      setTotalEnergy(initialPE);
    }
    
  }, [animationTime, currentSystem, pendulumAngle, pendulumLength, efficiency, currentLevel, gameState]);

  // Animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  // Generate new target
  const generateTarget = useCallback(() => {
    const system = systems.find(s => s.id === currentSystem);
    if (!system) return;

    const randomEnergyType = system.energyTypes[Math.floor(Math.random() * system.energyTypes.length)];
    setTargetEnergyType(randomEnergyType);

    // Target percentage range
    const targetPercent = 20 + Math.random() * 60; // 20-80%
    setTargetPercentage(targetPercent);
  }, [currentSystem]);

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
      drawEnergySystem(ctx, width, height);
      drawEnergyBars(ctx, width, height);
    }
  }, [animationTime, potentialEnergy, kineticEnergy, currentSystem, pendulumAngle, gameState]);

  const drawEnergySystem = (ctx, width, height) => {
    const centerX = 300;
    const centerY = 250;

    if (currentSystem === 'pendulum') {
      // Draw pendulum
      const angleRad = Math.sin(animationTime * 2) * (pendulumAngle * Math.PI / 180);
      const length = pendulumLength * 80; // scale for display
      
      // Pivot point
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.arc(centerX, 100, 8, 0, Math.PI * 2);
      ctx.fill();

      // String
      const bobX = centerX + length * Math.sin(angleRad);
      const bobY = 100 + length * Math.cos(angleRad);
      
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 100);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Height indicator
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, bobY);
      ctx.lineTo(centerX, 100 + length);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Con lắc đơn', centerX, 50);
      
    } else if (currentSystem === 'spring') {
      // Draw spring-mass system
      const amplitude = 60;
      const x = centerX + amplitude * Math.cos(animationTime * 3);
      
      // Wall
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(centerX - 150, centerY - 50, 20, 100);

      // Spring (simplified zigzag)
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 130, centerY);
      
      const springSegments = 10;
      const segmentLength = (x - centerX + 130 - 20) / springSegments;
      for (let i = 0; i < springSegments; i++) {
        const segX = centerX - 130 + i * segmentLength;
        const segY = centerY + (i % 2 === 0 ? -15 : 15);
        ctx.lineTo(segX, segY);
      }
      ctx.lineTo(x - 20, centerY);
      ctx.stroke();

      // Mass
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x - 20, centerY - 20, 40, 40);

      // Equilibrium position
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 40);
      ctx.lineTo(centerX, centerY + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Lò xo', centerX, 150);
      
    } else if (currentSystem === 'roller') {
      // Draw roller coaster track
      const trackY = 400;
      const amplitude = 100;
      
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      for (let x = 50; x <= 550; x += 5) {
        const y = trackY - amplitude * (0.5 + 0.5 * Math.cos((x - 50) / 80));
        if (x === 50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Cart position
      const cartProgress = (animationTime * 50) % 500;
      const cartX = 50 + cartProgress;
      const cartY = trackY - amplitude * (0.5 + 0.5 * Math.cos(cartProgress / 80));

      // Cart
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cartX - 15, cartY - 20, 30, 20);
      
      // Wheels
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(cartX - 10, cartY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cartX + 10, cartY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tàu lượn (có ma sát)', 300, 200);
      
    } else if (currentSystem === 'water') {
      // Draw hydroelectric system
      // Reservoir
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(50, 150, 150, 100);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Hồ chứa', 125, 180);

      // Water flow (pipe)
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.lineTo(300, 300);
      ctx.stroke();

      // Turbine
      const turbineX = 320;
      const turbineY = 320;
      const turbineRotation = animationTime * 5;
      
      ctx.save();
      ctx.translate(turbineX, turbineY);
      ctx.rotate(turbineRotation);
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
        ctx.lineTo(Math.cos(angle + 0.3) * 40, Math.sin(angle + 0.3) * 40);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();

      // Generator
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(380, 300, 60, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Máy phát', 410, 325);

      // Power lines
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(440, 320);
      ctx.lineTo(520, 280);
      ctx.stroke();

      // Transmission tower
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(520, 280);
      ctx.lineTo(500, 380);
      ctx.moveTo(520, 280);
      ctx.lineTo(540, 380);
      ctx.moveTo(510, 320);
      ctx.lineTo(530, 320);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('1. Thế năng', 50, 130);
      ctx.fillText('2. Động năng', 250, 280);
      ctx.fillText('3. Điện năng', 450, 270);
    }
  };

  const drawEnergyBars = (ctx, width, height) => {
    const barX = 550;
    const barY = 100;
    const barWidth = 180;
    const barHeight = 30;
    const spacing = 50;

    // Calculate percentages
    const pePercent = totalEnergy > 0 ? (potentialEnergy / totalEnergy) * 100 : 0;
    const kePercent = totalEnergy > 0 ? (kineticEnergy / totalEnergy) * 100 : 0;

    // Potential Energy bar
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(barX, barY, barWidth * (pePercent / 100), barHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Thế năng', barX, barY - 5);
    ctx.fillText(`${pePercent.toFixed(1)}%`, barX + barWidth + 10, barY + 20);

    // Kinetic Energy bar
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, barY + spacing, barWidth * (kePercent / 100), barHeight);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(barX, barY + spacing, barWidth, barHeight);
    
    ctx.fillStyle = '#fff';
    ctx.fillText('Động năng', barX, barY + spacing - 5);
    ctx.fillText(`${kePercent.toFixed(1)}%`, barX + barWidth + 10, barY + spacing + 20);

    // Total Energy
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Tổng năng lượng: ${totalEnergy.toFixed(2)} J`, barX, barY + spacing * 2 + 20);

    // Conservation statement
    ctx.font = '12px Arial';
    const conserved = Math.abs(pePercent + kePercent - 100) < 1;
    ctx.fillStyle = conserved ? '#10b981' : '#fbbf24';
    const statement = conserved ? '✓ Năng lượng được bảo toàn' : '⚠ Có tổn thất năng lượng';
    ctx.fillText(statement, barX, barY + spacing * 2 + 45);
  };

  const adjustPendulumAngle = (delta) => {
    setPendulumAngle(prev => Math.max(10, Math.min(80, prev + delta)));
  };

  const changeSystem = (systemId) => {
    if (currentLevel.allowedSystems.includes(systemId)) {
      setCurrentSystem(systemId);
      setAnimationTime(0);
      generateTarget();
    }
  };

  const checkTarget = useCallback(() => {
    let currentPercent = 0;
    
    if (targetEnergyType === 'Thế năng' || targetEnergyType === 'Thế năng đàn hồi') {
      currentPercent = totalEnergy > 0 ? (potentialEnergy / totalEnergy) * 100 : 0;
    } else if (targetEnergyType === 'Động năng') {
      currentPercent = totalEnergy > 0 ? (kineticEnergy / totalEnergy) * 100 : 0;
    }

    const tolerance = 15;
    if (Math.abs(currentPercent - targetPercentage) < tolerance) {
      const basePoints = 200;
      const accuracyBonus = Math.floor((tolerance - Math.abs(currentPercent - targetPercentage)) * 5);
      const timeBonus = Math.floor((timeLeft / 10)) * 10;
      const points = basePoints + accuracyBonus + timeBonus;
      
      setScore(prev => prev + points);
      setTargetsCompleted(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.targetsNeeded) {
          setTimeout(() => setGameState('victory'), 500);
        } else {
          generateTarget();
        }
        return newCompleted;
      });
      
      return true;
    }
    return false;
  }, [potentialEnergy, kineticEnergy, totalEnergy, targetEnergyType, targetPercentage, timeLeft, currentLevel, generateTarget]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetsCompleted(0);
    setTimeLeft(currentLevel.duration);
    setCurrentSystem(currentLevel.allowedSystems[0]);
    setPendulumAngle(45);
    setAnimationTime(0);
    setEfficiency(currentLevel.hasLoss ? 95 : 100);
    generateTarget();
  };

  const returnToMenu = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="energy-transformation-quest">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Zap className="title-icon" size={40} />
            Chuyển Hóa Năng Lượng
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Zap className="menu-icon" size={80} />
            <h2>Chuyển Hóa Năng Lượng</h2>
            <p className="menu-description">
              Khám phá định luật bảo toàn năng lượng và các dạng chuyển hóa năng lượng
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>⚖️ Định luật bảo toàn năng lượng</h4>
                  <p><strong>W = PE + KE = const</strong></p>
                  <p>Trong hệ cô lập, tổng năng lượng được bảo toàn</p>
                  <p>Năng lượng không tự sinh ra, không tự mất đi, chỉ chuyển từ dạng này sang dạng khác</p>
                </div>

                <div className="theory-item">
                  <h4>📐 Các công thức</h4>
                  <p><strong>Thế năng:</strong> PE = mgh</p>
                  <p><strong>Động năng:</strong> KE = ½mv²</p>
                  <p><strong>Thế năng đàn hồi:</strong> PE = ½kx²</p>
                  <p><strong>Hiệu suất:</strong> H = (W_out/W_in) × 100%</p>
                </div>

                <div className="theory-item">
                  <h4>🔄 Chuyển hóa năng lượng</h4>
                  <p>Con lắc: PE ⇄ KE</p>
                  <p>Lò xo: PE đàn hồi ⇄ KE</p>
                  <p>Thủy điện: PE → KE → Điện năng</p>
                  <p>Có ma sát: Một phần → Nhiệt năng</p>
                </div>
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
      <div className="energy-transformation-quest">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Zap className="title-icon" size={40} />
            Chuyển Hóa Năng Lượng
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
    <div className="energy-transformation-quest">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Zap className="title-icon" size={40} />
          Chuyển Hóa Năng Lượng - Cấp độ {selectedLevel}
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
            <span className="stat-label">Hiệu suất</span>
            <span className="stat-value">{efficiency}%</span>
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
              <div className="target-task">
                <p>Loại năng lượng: <strong>{targetEnergyType}</strong></p>
                <p>Tỷ lệ mục tiêu: <strong>{targetPercentage.toFixed(1)}% (±15%)</strong></p>
              </div>
            </div>

            <div className="system-selector">
              <h3>🔄 Hệ thống</h3>
              <div className="system-buttons">
                {systems
                  .filter(s => currentLevel.allowedSystems.includes(s.id))
                  .map(system => (
                    <button
                      key={system.id}
                      className={`system-btn ${currentSystem === system.id ? 'active' : ''}`}
                      onClick={() => changeSystem(system.id)}
                    >
                      <span className="system-name">{system.name}</span>
                      <span className="system-desc">{system.description}</span>
                    </button>
                  ))}
              </div>
            </div>

            {currentSystem === 'pendulum' && (
              <div className="controls">
                <h3>⚙️ Điều khiển</h3>
                <div className="control-section">
                  <div className="control-label">
                    Biên độ góc: {pendulumAngle}°
                  </div>
                  <div className="button-group">
                    <button className="control-btn" onClick={() => adjustPendulumAngle(-5)}>-5°</button>
                    <button className="control-btn" onClick={() => adjustPendulumAngle(-1)}>-1°</button>
                    <button className="control-btn" onClick={() => adjustPendulumAngle(1)}>+1°</button>
                    <button className="control-btn" onClick={() => adjustPendulumAngle(5)}>+5°</button>
                  </div>
                </div>
              </div>
            )}

            <button className="check-btn" onClick={checkTarget}>
              <ArrowRightLeft size={20} />
              <span>Kiểm tra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyTransformationQuest;
