import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Grip, Zap } from 'lucide-react';
import './FrictionTensionMaster.css';

/**
 * Friction & Tension Master - Grade 10 Chapter 2: Dynamics
 * Game về lực ma sát và lực căng dây
 * Physics: F_ms = μN, T = tension in rope, inclined plane, pulleys
 */

const FrictionTensionMaster = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);

  // Physics parameters
  const g = 10; // m/s² (simplified for easier calculations)
  const [scenarioType, setScenarioType] = useState('friction'); // friction, incline, pulley
  const [mass, setMass] = useState(10);
  const [mass2, setMass2] = useState(0); // For pulley system
  const [mu, setMu] = useState(0.3); // Coefficient of friction
  const [angle, setAngle] = useState(30); // Incline angle
  const [appliedForce, setAppliedForce] = useState(0);
  
  // Target values
  const [targetFriction, setTargetFriction] = useState(0);
  const [targetTension, setTargetTension] = useState(0);
  const [targetAcceleration, setTargetAcceleration] = useState(0);

  // User input
  const [userAnswer, setUserAnswer] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Animation state
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Lực ma sát',
      description: 'Tính lực ma sát trên mặt phẳng ngang',
      duration: 180,
      challengesNeeded: 3,
      scenarios: ['friction'],
      difficulty: 'easy'
    },
    {
      id: 2,
      name: 'Trung bình - Mặt phẳng nghiêng',
      description: 'Phân tích lực trên mặt phẳng nghiêng',
      duration: 240,
      challengesNeeded: 4,
      scenarios: ['incline'],
      difficulty: 'medium'
    },
    {
      id: 3,
      name: 'Nâng cao - Hệ ròng rọc',
      description: 'Tính lực căng dây và gia tốc hệ',
      duration: 300,
      challengesNeeded: 5,
      scenarios: ['pulley'],
      difficulty: 'hard'
    },
    {
      id: 4,
      name: 'Chuyên gia - Tổng hợp',
      description: 'Kết hợp ma sát, mặt phẳng nghiêng và ròng rọc',
      duration: 360,
      challengesNeeded: 6,
      scenarios: ['friction', 'incline', 'pulley'],
      difficulty: 'hard'
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Physics calculations
  const calculateFriction = (m, mu_val, F_applied = 0) => {
    const N = m * g; // Normal force
    const F_max = mu_val * N; // Max static friction
    
    if (F_applied === 0) {
      return F_max;
    }
    
    // If applied force > max friction, object moves (kinetic friction)
    return F_applied > F_max ? F_max : F_applied;
  };

  const calculateIncline = (m, angle_deg, mu_val) => {
    const theta = (angle_deg * Math.PI) / 180;
    const N = m * g * Math.cos(theta);
    const F_gravity_parallel = m * g * Math.sin(theta);
    const F_friction = mu_val * N;
    
    // Net force down the incline
    const F_net = F_gravity_parallel - F_friction;
    const acceleration = F_net / m;
    
    return {
      normal: N,
      friction: F_friction,
      gravityParallel: F_gravity_parallel,
      acceleration: Math.max(0, acceleration)
    };
  };

  const calculatePulley = (m1, m2, mu_val = 0) => {
    // m1 on table with friction, m2 hanging
    // Assuming m2 > m1*mu to move
    const F_friction = mu_val * m1 * g;
    const F_net = m2 * g - F_friction;
    const total_mass = m1 + m2;
    const acceleration = F_net / total_mass;
    const tension = m2 * (g - acceleration);
    
    return {
      acceleration: Math.max(0, acceleration),
      tension: tension,
      friction: F_friction
    };
  };

  // Generate challenge
  const generateChallenge = useCallback(() => {
    const scenarios = currentLevel.scenarios;
    const type = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    setScenarioType(type);
    setUserAnswer({});
    setShowResult(false);
    setAnimationProgress(0);

    if (type === 'friction') {
      const m = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
      const mu_val = [0.2, 0.3, 0.4, 0.5][Math.floor(Math.random() * 4)];
      
      setMass(m);
      setMu(mu_val);
      setAppliedForce(0);
      
      const F_friction = calculateFriction(m, mu_val);
      setTargetFriction(F_friction);
      
    } else if (type === 'incline') {
      const m = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
      const theta = [15, 20, 30, 37, 45][Math.floor(Math.random() * 5)];
      const mu_val = [0.1, 0.2, 0.3][Math.floor(Math.random() * 3)];
      
      setMass(m);
      setAngle(theta);
      setMu(mu_val);
      
      const result = calculateIncline(m, theta, mu_val);
      setTargetFriction(result.friction);
      setTargetAcceleration(result.acceleration);
      
    } else if (type === 'pulley') {
      const m1 = [5, 10, 15][Math.floor(Math.random() * 3)];
      const m2 = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
      const mu_val = [0.1, 0.2, 0.3][Math.floor(Math.random() * 3)];
      
      setMass(m1);
      setMass2(m2);
      setMu(mu_val);
      
      const result = calculatePulley(m1, m2, mu_val);
      setTargetTension(result.tension);
      setTargetAcceleration(result.acceleration);
    }
  }, [currentLevel]);

  // Check answer
  const checkAnswer = () => {
    if (!userAnswer.value) return;

    const userValue = parseFloat(userAnswer.value);
    let correctValue = 0;
    let unit = '';

    if (scenarioType === 'friction') {
      correctValue = targetFriction;
      unit = 'N';
    } else if (scenarioType === 'incline') {
      if (userAnswer.type === 'friction') {
        correctValue = targetFriction;
        unit = 'N';
      } else if (userAnswer.type === 'acceleration') {
        correctValue = targetAcceleration;
        unit = 'm/s²';
      }
    } else if (scenarioType === 'pulley') {
      if (userAnswer.type === 'tension') {
        correctValue = targetTension;
        unit = 'N';
      } else if (userAnswer.type === 'acceleration') {
        correctValue = targetAcceleration;
        unit = 'm/s²';
      }
    }

    const tolerance = correctValue * 0.08; // 8% tolerance
    const isCorrect = Math.abs(userValue - correctValue) <= tolerance;

    setShowResult(true);

    if (isCorrect) {
      const points = currentLevel.difficulty === 'easy' ? 100 : 
                     currentLevel.difficulty === 'medium' ? 150 : 200;
      setScore(prev => prev + points);
      setResultMessage(`✅ Chính xác! Đáp án: ${correctValue.toFixed(2)} ${unit}. +${points} điểm`);
      
      setCompletedChallenges(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.challengesNeeded) {
          setTimeout(() => setGameState('victory'), 1500);
        } else {
          setTimeout(() => generateChallenge(), 2000);
        }
        return newCompleted;
      });
    } else {
      setResultMessage(`❌ Sai rồi! Đáp án đúng: ${correctValue.toFixed(2)} ${unit}. Thử lại!`);
      setTimeout(() => {
        setShowResult(false);
        setUserAnswer({});
      }, 3000);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 1) return 0;
        return prev + 0.015;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating, gameState]);

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

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawScenario(ctx, width, height);
    }
  }, [animationProgress, scenarioType, mass, mass2, mu, angle, gameState]);

  const drawScenario = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;

    if (scenarioType === 'friction') {
      drawFrictionScenario(ctx, centerX, centerY);
    } else if (scenarioType === 'incline') {
      drawInclineScenario(ctx, centerX, centerY);
    } else if (scenarioType === 'pulley') {
      drawPulleyScenario(ctx, centerX, centerY);
    }
  };

  const drawFrictionScenario = (ctx, x, y) => {
    const progress = isAnimating ? animationProgress : 0;
    
    // Ground
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, y + 50, 800, 20);
    
    // Surface texture (friction)
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 40, y + 50);
      ctx.lineTo(i * 40 + 20, y + 60);
      ctx.stroke();
    }
    
    // Box
    const boxX = x - 100 + progress * 200;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(boxX - 40, y - 10, 80, 60);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX - 40, y - 10, 80, 60);
    
    // Mass label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`m = ${mass}kg`, boxX, y + 25);
    
    // Normal force (up)
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boxX, y - 10);
    ctx.lineTo(boxX, y - 60);
    ctx.stroke();
    drawArrowHead(ctx, boxX, y - 60, 0, -1, '#10b981');
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('N', boxX + 15, y - 50);
    
    // Weight (down)
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(boxX, y + 50);
    ctx.lineTo(boxX, y + 90);
    ctx.stroke();
    drawArrowHead(ctx, boxX, y + 90, 0, 1, '#ef4444');
    
    ctx.fillStyle = '#fff';
    ctx.fillText('P', boxX + 15, y + 85);
    
    // Friction force (opposing motion)
    if (isAnimating) {
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(boxX, y + 25);
      ctx.lineTo(boxX - 50, y + 25);
      ctx.stroke();
      drawArrowHead(ctx, boxX - 50, y + 25, -1, 0, '#f59e0b');
      
      ctx.fillStyle = '#fff';
      ctx.fillText('F_ms', boxX - 70, y + 15);
    }
    
    // Info box
    drawInfoBox(ctx, 50, 50, [
      `Khối lượng: ${mass} kg`,
      `Hệ số ma sát: μ = ${mu}`,
      `Trọng lượng: P = ${(mass * g).toFixed(1)} N`,
      `Phản lực: N = ${(mass * g).toFixed(1)} N`,
      `Tính lực ma sát cực đại?`
    ]);
  };

  const drawInclineScenario = (ctx, x, y) => {
    const progress = isAnimating ? animationProgress : 0;
    const theta = (angle * Math.PI) / 180;
    
    // Inclined plane
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.moveTo(100, y + 150);
    ctx.lineTo(700, y + 150);
    ctx.lineTo(700, y + 150 - 400 * Math.tan(theta));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Surface texture
    const numLines = 15;
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i < numLines; i++) {
      const t = i / numLines;
      const px1 = 100 + t * 600;
      const py1 = y + 150 - t * 600 * Math.tan(theta);
      const perpX = Math.sin(theta) * 10;
      const perpY = -Math.cos(theta) * 10;
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px1 + perpX, py1 + perpY);
      ctx.stroke();
    }
    
    // Box on incline
    const boxT = 0.3 + progress * 0.4;
    const boxX = 100 + boxT * 600;
    const boxY = y + 150 - boxT * 600 * Math.tan(theta);
    
    ctx.save();
    ctx.translate(boxX, boxY);
    ctx.rotate(-theta);
    
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-30, -30, 60, 60);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-30, -30, 60, 60);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass}kg`, 0, 5);
    
    // Normal force (perpendicular to surface)
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -50);
    ctx.stroke();
    drawArrowHead(ctx, 0, -50, 0, -1, '#10b981');
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('N', 15, -40);
    
    // Friction (up the incline)
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    drawArrowHead(ctx, 40, 0, 1, 0, '#f59e0b');
    
    ctx.fillStyle = '#fff';
    ctx.fillText('F_ms', 50, -5);
    
    ctx.restore();
    
    // Weight (vertical down)
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boxX, boxY);
    ctx.lineTo(boxX, boxY + 60);
    ctx.stroke();
    drawArrowHead(ctx, boxX, boxY + 60, 0, 1, '#ef4444');
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('P', boxX + 15, boxY + 55);
    
    // Angle arc
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(700, y + 150, 40, Math.PI, Math.PI - theta, true);
    ctx.stroke();
    
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${angle}°`, 660, y + 130);
    
    // Info box
    const result = calculateIncline(mass, angle, mu);
    drawInfoBox(ctx, 50, 50, [
      `Khối lượng: ${mass} kg`,
      `Góc nghiêng: ${angle}°`,
      `Hệ số ma sát: μ = ${mu}`,
      `P = ${(mass * g).toFixed(1)} N`,
      `Tính lực ma sát và gia tốc?`
    ]);
  };

  const drawPulleyScenario = (ctx, x, y) => {
    const progress = isAnimating ? animationProgress : 0;
    
    // Table
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(50, y, 400, 20);
    
    // Surface texture
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * 40, y);
      ctx.lineTo(70 + i * 40, y + 10);
      ctx.stroke();
    }
    
    // Box m1 on table
    const box1X = 200 + progress * 150;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(box1X - 30, y - 50, 60, 50);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(box1X - 30, y - 50, 60, 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`m₁=${mass}kg`, box1X, y - 20);
    
    // Pulley
    const pulleyX = 450;
    const pulleyY = y - 50;
    ctx.strokeStyle = '#4b5563';
    ctx.fillStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pulleyX, pulleyY, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pulleyX, pulleyY, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Rope
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    // Horizontal part
    ctx.beginPath();
    ctx.moveTo(box1X + 30, y - 25);
    ctx.lineTo(pulleyX, y - 25);
    ctx.stroke();
    // Vertical part
    const box2Y = y + 50 + progress * 100;
    ctx.beginPath();
    ctx.moveTo(pulleyX, pulleyY + 25);
    ctx.lineTo(pulleyX, box2Y - 30);
    ctx.stroke();
    
    // Box m2 hanging
    ctx.fillStyle = '#92400e';
    ctx.fillRect(pulleyX - 30, box2Y - 30, 60, 60);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(pulleyX - 30, box2Y - 30, 60, 60);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`m₂=${mass2}kg`, pulleyX, box2Y + 5);
    
    // Tension labels
    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px Arial';
    ctx.fillText('T', box1X + 60, y - 35);
    ctx.fillText('T', pulleyX + 20, y);
    
    // Forces on m1
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(box1X, y - 25);
    ctx.lineTo(box1X - 40, y - 25);
    ctx.stroke();
    drawArrowHead(ctx, box1X - 40, y - 25, -1, 0, '#f59e0b');
    
    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.fillText('F_ms', box1X - 60, y - 30);
    
    // Forces on m2
    // Weight
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pulleyX, box2Y + 30);
    ctx.lineTo(pulleyX, box2Y + 70);
    ctx.stroke();
    drawArrowHead(ctx, pulleyX, box2Y + 70, 0, 1, '#ef4444');
    
    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.fillText('P₂', pulleyX + 15, box2Y + 65);
    
    // Info box
    drawInfoBox(ctx, 520, 50, [
      `m₁ = ${mass} kg (trên bàn)`,
      `m₂ = ${mass2} kg (treo)`,
      `μ = ${mu}`,
      `P₂ = ${(mass2 * g).toFixed(1)} N`,
      `Tính lực căng T và gia tốc a?`
    ]);
  };

  const drawArrowHead = (ctx, x, y, dx, dy, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const size = 8;
    if (dx !== 0) {
      ctx.moveTo(x, y);
      ctx.lineTo(x - dx * size, y - size);
      ctx.lineTo(x - dx * size, y + size);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - dy * size);
      ctx.lineTo(x + size, y - dy * size);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawInfoBox = (ctx, x, y, lines) => {
    const width = 280;
    const height = 30 + lines.length * 22;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    lines.forEach((line, i) => {
      ctx.fillText(line, x + 15, y + 25 + i * 22);
    });
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCompletedChallenges(0);
    setTimeLeft(currentLevel.duration);
    generateChallenge();
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="friction-tension-master">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Grip className="title-icon" size={40} />
            Friction & Tension Master
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Grip className="menu-icon" size={80} />
            <h2>Friction & Tension Master</h2>
            <p className="menu-description">
              Làm chủ lực ma sát và lực căng dây trong các hệ cơ học
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>🔥 Lực ma sát</h4>
                  <p><strong>Định nghĩa:</strong> Lực cản trở chuyển động tương đối giữa hai bề mặt tiếp xúc.</p>
                  <p><strong>Công thức:</strong> F_ms = μN</p>
                  <p><strong>μ:</strong> Hệ số ma sát (phụ thuộc bề mặt)</p>
                  <p><strong>N:</strong> Phản lực vuông góc với bề mặt</p>
                  <p><strong>Đặc điểm:</strong> Ngược chiều chuyển động, tỉ lệ với phản lực</p>
                </div>

                <div className="theory-item">
                  <h4>📐 Mặt phẳng nghiêng</h4>
                  <p><strong>Phân tích lực:</strong></p>
                  <p>• P = mg (trọng lực thẳng đứng)</p>
                  <p>• N = mg cos(θ) (phản lực vuông góc)</p>
                  <p>• P∥ = mg sin(θ) (thành phần song song)</p>
                  <p>• F_ms = μN = μmg cos(θ)</p>
                  <p><strong>Điều kiện trượt:</strong> P∥ &gt; F_ms</p>
                  <p><strong>Gia tốc:</strong> a = g(sin θ - μ cos θ)</p>
                </div>

                <div className="theory-item">
                  <h4>🔗 Lực căng dây</h4>
                  <p><strong>Định nghĩa:</strong> Lực do dây căng tác dụng lên vật.</p>
                  <p><strong>Đặc điểm:</strong></p>
                  <p>• Hướng dọc theo dây</p>
                  <p>• Cùng độ lớn tại mọi điểm trên dây lý tưởng</p>
                  <p>• Luôn là lực kéo, không bao giờ đẩy</p>
                  <p><strong>Hệ ròng rọc:</strong> T = m₂(g - a)</p>
                  <p>với a = (m₂g - μm₁g)/(m₁ + m₂)</p>
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
                      🎯 {level.challengesNeeded} thử thách | ⏱️ {level.duration}s
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

  // Render victory
  if (gameState === 'victory') {
    const success = completedChallenges >= currentLevel.challengesNeeded;
    
    return (
      <div className="friction-tension-master">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <Grip className="title-icon" size={40} />
            Friction & Tension Master
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className={`trophy-icon ${success ? 'success' : 'fail'}`} size={100} />
            <h2>{success ? 'Xuất sắc!' : 'Hết giờ!'}</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Hoàn thành</span>
                <span className="final-value">{completedChallenges}/{currentLevel.challengesNeeded}</span>
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

  // Render game
  return (
    <div className="friction-tension-master">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Grip className="title-icon" size={40} />
          Friction & Tension Master - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thử thách</span>
            <span className="stat-value">{completedChallenges}/{currentLevel.challengesNeeded}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="game-content">
          <div className="animation-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="animation-canvas"
            />
            <button 
              className="animate-btn"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? '⏸️ Dừng' : '▶️ Xem chuyển động'}
            </button>
          </div>

          <div className="answer-panel">
            <div className="question-info">
              <h3>🎯 Nhiệm vụ</h3>
              <p className="scenario-type">
                {scenarioType === 'friction' && '🔥 Tính lực ma sát cực đại'}
                {scenarioType === 'incline' && '📐 Phân tích lực trên mặt phẳng nghiêng'}
                {scenarioType === 'pulley' && '🔗 Tính lực căng dây và gia tốc hệ'}
              </p>
            </div>

            <div className="input-section">
              {scenarioType === 'friction' && (
                <div className="input-group">
                  <label>Lực ma sát cực đại (N):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={userAnswer.value || ''}
                    onChange={(e) => setUserAnswer({ value: e.target.value, type: 'friction' })}
                    placeholder="Nhập kết quả..."
                  />
                </div>
              )}

              {scenarioType === 'incline' && (
                <>
                  <div className="input-group">
                    <label>Chọn giá trị cần tính:</label>
                    <select
                      value={userAnswer.type || ''}
                      onChange={(e) => setUserAnswer({ ...userAnswer, type: e.target.value })}
                    >
                      <option value="">-- Chọn --</option>
                      <option value="friction">Lực ma sát (N)</option>
                      <option value="acceleration">Gia tốc (m/s²)</option>
                    </select>
                  </div>
                  {userAnswer.type && (
                    <div className="input-group">
                      <label>Giá trị:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={userAnswer.value || ''}
                        onChange={(e) => setUserAnswer({ ...userAnswer, value: e.target.value })}
                        placeholder="Nhập kết quả..."
                      />
                    </div>
                  )}
                </>
              )}

              {scenarioType === 'pulley' && (
                <>
                  <div className="input-group">
                    <label>Chọn giá trị cần tính:</label>
                    <select
                      value={userAnswer.type || ''}
                      onChange={(e) => setUserAnswer({ ...userAnswer, type: e.target.value })}
                    >
                      <option value="">-- Chọn --</option>
                      <option value="tension">Lực căng dây T (N)</option>
                      <option value="acceleration">Gia tốc hệ a (m/s²)</option>
                    </select>
                  </div>
                  {userAnswer.type && (
                    <div className="input-group">
                      <label>Giá trị:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={userAnswer.value || ''}
                        onChange={(e) => setUserAnswer({ ...userAnswer, value: e.target.value })}
                        placeholder="Nhập kết quả..."
                      />
                    </div>
                  )}
                </>
              )}

              <button 
                className="submit-btn"
                onClick={checkAnswer}
                disabled={!userAnswer.value || showResult}
              >
                <Zap size={20} />
                <span>Kiểm tra</span>
              </button>

              {showResult && (
                <div className={`result-box ${resultMessage.includes('✅') ? 'correct' : 'incorrect'}`}>
                  <p>{resultMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrictionTensionMaster;
