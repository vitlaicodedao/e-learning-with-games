import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Atom, Zap } from 'lucide-react';
import './NewtonsLawsArena.css';

/**
 * Newton's Laws Arena - Grade 10 Chapter 2: Dynamics
 * Game khám phá ba định luật Newton
 * Physics: F = ma, action-reaction, inertia
 */

const NewtonsLawsArena = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);

  // Scenario state
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedLaw, setSelectedLaw] = useState(null);
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
      name: 'Cơ bản - Định luật I',
      description: 'Hiểu về quán tính và trạng thái đứng yên',
      duration: 180,
      challengesNeeded: 3,
      laws: [1],
      difficulty: 'easy'
    },
    {
      id: 2,
      name: 'Trung bình - Định luật II',
      description: 'Tính toán lực và gia tốc F = ma',
      duration: 240,
      challengesNeeded: 4,
      laws: [2],
      difficulty: 'medium'
    },
    {
      id: 3,
      name: 'Nâng cao - Định luật III',
      description: 'Phân tích cặp lực tác dụng và phản tác dụng',
      duration: 300,
      challengesNeeded: 5,
      laws: [3],
      difficulty: 'medium'
    },
    {
      id: 4,
      name: 'Chuyên gia - Tổng hợp',
      description: 'Áp dụng cả ba định luật Newton',
      duration: 360,
      challengesNeeded: 6,
      laws: [1, 2, 3],
      difficulty: 'hard'
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Scenarios for each law
  const scenarios = {
    1: [ // Newton's First Law (Inertia)
      {
        id: 'law1-1',
        question: 'Một chiếc xe đang chạy đều trên đường. Tài xế đạp phanh gấp, hành khách ngã về phía nào?',
        animation: 'car-brake',
        options: ['Phía trước', 'Phía sau', 'Sang trái', 'Sang phải'],
        correct: 0,
        explanation: 'Do quán tính, hành khách tiếp tục chuyển động về phía trước khi xe phanh gấp.',
        law: 1
      },
      {
        id: 'law1-2',
        question: 'Quyển sách đặt trên bàn đứng yên. Điều gì xảy ra nếu giật tấm khăn trải bàn rất nhanh?',
        animation: 'book-table',
        options: ['Sách bay theo khăn', 'Sách vẫn đứng yên', 'Sách rơi xuống', 'Sách lật ngược'],
        correct: 1,
        explanation: 'Do quán tính, sách có xu hướng giữ nguyên trạng thái đứng yên.',
        law: 1
      },
      {
        id: 'law1-3',
        question: 'Một quả bóng lăn trên mặt đất nhẵn. Tại sao nó dần dừng lại?',
        animation: 'ball-roll',
        options: ['Do quán tính', 'Do lực ma sát', 'Do trọng lực', 'Do lực đàn hồi'],
        correct: 1,
        explanation: 'Lực ma sát làm thay đổi vận tốc của quả bóng, khiến nó dừng lại.',
        law: 1
      },
      {
        id: 'law1-4',
        question: 'Trong không gian không có lực tác dụng, vật chuyển động thẳng đều sẽ?',
        animation: 'space-object',
        options: ['Dừng lại ngay', 'Chuyển động mãi mãi', 'Quay vòng tròn', 'Bay về Trái Đất'],
        correct: 1,
        explanation: 'Định luật I Newton: Vật sẽ giữ nguyên trạng thái chuyển động nếu không có ngoại lực.',
        law: 1
      }
    ],
    2: [ // Newton's Second Law (F = ma)
      {
        id: 'law2-1',
        question: 'Tính gia tốc của vật khối lượng 5kg chịu lực 20N',
        animation: 'force-push',
        type: 'calculation',
        values: { m: 5, F: 20 },
        correct: 4, // a = F/m = 20/5 = 4 m/s²
        unit: 'm/s²',
        explanation: 'Áp dụng F = ma → a = F/m = 20/5 = 4 m/s²',
        law: 2
      },
      {
        id: 'law2-2',
        question: 'Xe khối lượng 1000kg tăng tốc từ 0 đến 20m/s trong 5s. Tính lực động cơ?',
        animation: 'car-accelerate',
        type: 'calculation',
        values: { m: 1000, v0: 0, v: 20, t: 5 },
        correct: 4000, // a = (v-v0)/t = 4, F = ma = 1000*4 = 4000N
        unit: 'N',
        explanation: 'a = Δv/Δt = 20/5 = 4 m/s². F = ma = 1000 × 4 = 4000N',
        law: 2
      },
      {
        id: 'law2-3',
        question: 'Hai lực 30N và 40N cùng phương, cùng chiều tác dụng lên vật 10kg. Tính gia tốc?',
        animation: 'two-forces',
        type: 'calculation',
        values: { F1: 30, F2: 40, m: 10 },
        correct: 7, // F_total = 70N, a = 70/10 = 7
        unit: 'm/s²',
        explanation: 'F_tổng = 30 + 40 = 70N. a = F/m = 70/10 = 7 m/s²',
        law: 2
      },
      {
        id: 'law2-4',
        question: 'Vật 2kg chuyển động chậm dần với gia tốc -3m/s². Tính độ lớn lực cản?',
        animation: 'friction-slow',
        type: 'calculation',
        values: { m: 2, a: -3 },
        correct: 6, // F = |m*a| = 2*3 = 6N
        unit: 'N',
        explanation: 'F = |ma| = 2 × 3 = 6N (lực cản ngược chiều chuyển động)',
        law: 2
      }
    ],
    3: [ // Newton's Third Law (Action-Reaction)
      {
        id: 'law3-1',
        question: 'Người đẩy tường với lực 100N. Tường tác dụng lại người một lực bao nhiêu?',
        animation: 'push-wall',
        options: ['0N', '50N', '100N', '200N'],
        correct: 2,
        explanation: 'Theo định luật III, lực tác dụng và phản tác dụng bằng nhau về độ lớn: 100N',
        law: 3
      },
      {
        id: 'law3-2',
        question: 'Rocket phụt khí về phía sau với lực F. Lực đẩy rocket về phía trước là?',
        animation: 'rocket',
        options: ['0', 'F/2', 'F', '2F'],
        correct: 2,
        explanation: 'Lực phản lực của khí tác dụng lên rocket bằng F, đẩy rocket về phía trước.',
        law: 3
      },
      {
        id: 'law3-3',
        question: 'Hai người khối lượng khác nhau đẩy nhau. Ai chịu lực lớn hơn?',
        animation: 'two-people',
        options: ['Người nặng hơn', 'Người nhẹ hơn', 'Như nhau', 'Tùy lực đẩy'],
        correct: 2,
        explanation: 'Cả hai chịu lực bằng nhau (cặp lực tác dụng - phản tác dụng).',
        law: 3
      },
      {
        id: 'law3-4',
        question: 'Trái Đất hút Mặt Trăng với lực F. Mặt Trăng hút Trái Đất với lực?',
        animation: 'earth-moon',
        options: ['0', 'F (nhỏ hơn)', 'F', 'F (lớn hơn)'],
        correct: 2,
        explanation: 'Lực hấp dẫn là cặp lực tác dụng - phản tác dụng, có độ lớn bằng nhau.',
        law: 3
      }
    ]
  };

  // Generate challenge
  const generateChallenge = useCallback(() => {
    const availableLaws = currentLevel.laws;
    const randomLaw = availableLaws[Math.floor(Math.random() * availableLaws.length)];
    const lawScenarios = scenarios[randomLaw];
    const randomScenario = lawScenarios[Math.floor(Math.random() * lawScenarios.length)];
    
    setCurrentScenario(randomScenario);
    setSelectedLaw(null);
    setUserAnswer({});
    setShowResult(false);
    setAnimationProgress(0);
    setIsAnimating(false);
  }, [currentLevel]);

  // Check answer
  const checkAnswer = () => {
    if (!currentScenario) return;

    let isCorrect = false;
    
    if (currentScenario.type === 'calculation') {
      const userValue = parseFloat(userAnswer.value);
      const tolerance = currentScenario.correct * 0.05; // 5% tolerance
      isCorrect = Math.abs(userValue - currentScenario.correct) <= tolerance;
    } else {
      isCorrect = userAnswer.selected === currentScenario.correct;
    }

    setShowResult(true);

    if (isCorrect) {
      const points = currentLevel.difficulty === 'easy' ? 100 : 
                     currentLevel.difficulty === 'medium' ? 150 : 200;
      setScore(prev => prev + points);
      setResultMessage(`✅ Chính xác! +${points} điểm`);
      
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
      setResultMessage('❌ Sai rồi! Hãy thử lại.');
      setTimeout(() => {
        setShowResult(false);
        setUserAnswer({});
      }, 2000);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 1) return 0;
        return prev + 0.02;
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
    if (!canvas || !currentScenario) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawAnimation(ctx, width, height);
    }
  }, [animationProgress, currentScenario, gameState]);

  const drawAnimation = (ctx, width, height) => {
    if (!currentScenario) return;

    const centerX = width / 2;
    const centerY = height / 2;

    switch (currentScenario.animation) {
      case 'car-brake':
        drawCarBrake(ctx, centerX, centerY);
        break;
      case 'book-table':
        drawBookTable(ctx, centerX, centerY);
        break;
      case 'ball-roll':
        drawBallRoll(ctx, centerX, centerY);
        break;
      case 'space-object':
        drawSpaceObject(ctx, centerX, centerY);
        break;
      case 'force-push':
        drawForcePush(ctx, centerX, centerY);
        break;
      case 'car-accelerate':
        drawCarAccelerate(ctx, centerX, centerY);
        break;
      case 'two-forces':
        drawTwoForces(ctx, centerX, centerY);
        break;
      case 'friction-slow':
        drawFrictionSlow(ctx, centerX, centerY);
        break;
      case 'push-wall':
        drawPushWall(ctx, centerX, centerY);
        break;
      case 'rocket':
        drawRocket(ctx, centerX, centerY);
        break;
      case 'two-people':
        drawTwoPeople(ctx, centerX, centerY);
        break;
      case 'earth-moon':
        drawEarthMoon(ctx, centerX, centerY);
        break;
      default:
        break;
    }
  };

  // Drawing functions
  const drawCarBrake = (ctx, x, y) => {
    const progress = isAnimating ? animationProgress : 0;
    
    // Car
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x - 60, y - 20, 120, 40);
    ctx.fillRect(x - 40, y - 50, 80, 30);
    
    // Wheels
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(x - 40, y + 20, 15, 0, Math.PI * 2);
    ctx.arc(x + 40, y + 20, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Passenger (tilted forward when braking)
    const tilt = isAnimating ? progress * 15 : 0;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + tilt, y - 50, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Brake lines
    if (isAnimating) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 80 - i * 20, y);
        ctx.lineTo(x - 100 - i * 20 - progress * 30, y);
        ctx.stroke();
      }
    }
  };

  const drawBookTable = (ctx, x, y) => {
    // Table
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 150, y + 20, 300, 10);
    
    // Cloth
    ctx.fillStyle = '#ffffff';
    const clothX = isAnimating ? x - 150 + animationProgress * 200 : x - 150;
    ctx.fillRect(clothX, y + 10, 100, 5);
    
    // Book
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 30, y - 20, 60, 40);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 30, y - 20, 60, 40);
  };

  const drawBallRoll = (ctx, x, y) => {
    const ballX = isAnimating ? x - 200 + animationProgress * 300 : x - 200;
    
    // Ground
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, y + 30);
    ctx.lineTo(750, y + 30);
    ctx.stroke();
    
    // Ball
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(ballX, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Friction arrows
    if (isAnimating) {
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, y + 40);
      ctx.lineTo(ballX - 30, y + 40);
      ctx.stroke();
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(ballX - 30, y + 40);
      ctx.lineTo(ballX - 25, y + 35);
      ctx.lineTo(ballX - 25, y + 45);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawSpaceObject = (ctx, x, y) => {
    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 20; i++) {
      const sx = 50 + i * 35;
      const sy = 50 + (i % 3) * 80;
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Object
    const objX = isAnimating ? x - 100 + animationProgress * 200 : x;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(objX, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Velocity arrow
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, y);
    ctx.lineTo(objX + 60, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX + 60, y);
    ctx.lineTo(objX + 52, y - 6);
    ctx.lineTo(objX + 52, y + 6);
    ctx.closePath();
    ctx.fill();
  };

  const drawForcePush = (ctx, x, y) => {
    // Box
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x, y - 40, 80, 80);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y - 40, 80, 80);
    
    // Force arrow
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 100, y);
    ctx.lineTo(x - 10, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x - 20, y - 8);
    ctx.lineTo(x - 20, y + 8);
    ctx.closePath();
    ctx.fill();
    
    // F = 20N label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('F = 20N', x - 100, y - 20);
    
    // m = 5kg label
    ctx.fillText('m = 5kg', x + 10, y + 10);
  };

  const drawCarAccelerate = (ctx, x, y) => {
    const carX = isAnimating ? x - 100 + animationProgress * 150 : x - 100;
    
    // Car
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(carX - 60, y - 20, 120, 40);
    ctx.fillRect(carX - 40, y - 50, 80, 30);
    
    // Wheels
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(carX - 40, y + 20, 15, 0, Math.PI * 2);
    ctx.arc(carX + 40, y + 20, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Speed lines
    if (isAnimating) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(carX - 70 - i * 15, y - 10 + i * 10);
        ctx.lineTo(carX - 90 - i * 15, y - 10 + i * 10);
        ctx.stroke();
      }
    }
  };

  const drawTwoForces = (ctx, x, y) => {
    // Box
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 40, y - 40, 80, 80);
    
    // Force 1 (30N)
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 120, y - 20);
    ctx.lineTo(x - 50, y - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 20);
    ctx.lineTo(x - 58, y - 26);
    ctx.lineTo(x - 58, y - 14);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('30N', x - 110, y - 30);
    
    // Force 2 (40N)
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(x - 120, y + 20);
    ctx.lineTo(x - 50, y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 50, y + 20);
    ctx.lineTo(x - 58, y + 14);
    ctx.lineTo(x - 58, y + 26);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.fillText('40N', x - 110, y + 35);
    ctx.fillText('m = 10kg', x - 25, y + 5);
  };

  const drawFrictionSlow = (ctx, x, y) => {
    const objX = isAnimating ? x + 100 - animationProgress * 150 : x + 100;
    
    // Ground
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, y + 30);
    ctx.lineTo(750, y + 30);
    ctx.stroke();
    
    // Object
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(objX - 30, y - 30, 60, 60);
    
    // Friction force
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, y);
    ctx.lineTo(objX - 50, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX - 50, y);
    ctx.lineTo(objX - 42, y - 6);
    ctx.lineTo(objX - 42, y + 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('F_ms', objX - 70, y - 10);
  };

  const drawPushWall = (ctx, x, y) => {
    // Wall
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(x + 50, y - 100, 30, 200);
    
    // Person (stick figure)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    // Head
    ctx.beginPath();
    ctx.arc(x - 50, y - 50, 15, 0, Math.PI * 2);
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 35);
    ctx.lineTo(x - 50, y + 20);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 20);
    ctx.lineTo(x + 30, y - 20);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(x - 50, y + 20);
    ctx.lineTo(x - 70, y + 60);
    ctx.moveTo(x - 50, y + 20);
    ctx.lineTo(x - 30, y + 60);
    ctx.stroke();
    
    // Force arrows
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 4;
    // Action
    ctx.beginPath();
    ctx.moveTo(x + 30, y - 20);
    ctx.lineTo(x + 45, y - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 45, y - 20);
    ctx.lineTo(x + 38, y - 26);
    ctx.lineTo(x + 38, y - 14);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('100N', x + 10, y - 30);
    
    // Reaction
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(x + 45, y + 20);
    ctx.lineTo(x + 30, y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 20);
    ctx.lineTo(x + 37, y + 14);
    ctx.lineTo(x + 37, y + 26);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.fillText('?', x + 35, y + 35);
  };

  const drawRocket = (ctx, x, y) => {
    const rocketY = isAnimating ? y + 50 - animationProgress * 100 : y + 50;
    
    // Rocket body
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 20, rocketY - 60, 40, 80);
    // Nose
    ctx.beginPath();
    ctx.moveTo(x, rocketY - 80);
    ctx.lineTo(x - 20, rocketY - 60);
    ctx.lineTo(x + 20, rocketY - 60);
    ctx.closePath();
    ctx.fill();
    // Fins
    ctx.beginPath();
    ctx.moveTo(x - 20, rocketY + 20);
    ctx.lineTo(x - 35, rocketY + 35);
    ctx.lineTo(x - 20, rocketY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 20, rocketY + 20);
    ctx.lineTo(x + 35, rocketY + 35);
    ctx.lineTo(x + 20, rocketY + 20);
    ctx.closePath();
    ctx.fill();
    
    // Exhaust
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x - 15, rocketY + 20);
    ctx.lineTo(x, rocketY + 40 + animationProgress * 20);
    ctx.lineTo(x + 15, rocketY + 20);
    ctx.closePath();
    ctx.fill();
    
    // Force labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('F↓', x + 30, rocketY + 30);
    ctx.fillText('F↑', x + 30, rocketY - 30);
  };

  const drawTwoPeople = (ctx, x, y) => {
    // Person 1 (left)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - 80, y - 50, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 80, y - 35);
    ctx.lineTo(x - 80, y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 80, y - 20);
    ctx.lineTo(x - 30, y - 20);
    ctx.stroke();
    
    // Person 2 (right)
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 80, y - 50, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 80, y - 35);
    ctx.lineTo(x + 80, y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 80, y - 20);
    ctx.lineTo(x + 30, y - 20);
    ctx.stroke();
    
    // Force arrows
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    ctx.lineWidth = 4;
    // Left to right
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 20);
    ctx.lineTo(x + 20, y - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x + 13, y - 26);
    ctx.lineTo(x + 13, y - 14);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('F', x - 5, y - 30);
  };

  const drawEarthMoon = (ctx, x, y) => {
    // Earth
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x - 100, y, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x - 110, y - 10, 12, 0, Math.PI * 2);
    ctx.arc(x - 90, y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(x + 100, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Craters
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(x + 90, y - 5, 5, 0, Math.PI * 2);
    ctx.arc(x + 110, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Force arrows
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    ctx.lineWidth = 3;
    // Earth to Moon
    ctx.beginPath();
    ctx.moveTo(x - 60, y);
    ctx.lineTo(x + 70, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 70, y);
    ctx.lineTo(x + 63, y - 6);
    ctx.lineTo(x + 63, y + 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('F', x - 10, y - 10);
    ctx.fillText('?', x + 5, y + 20);
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
    setCurrentScenario(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="newtons-laws-arena">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Atom className="title-icon" size={40} />
            Newton's Laws Arena
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Atom className="menu-icon" size={80} />
            <h2>Newton's Laws Arena</h2>
            <p className="menu-description">
              Khám phá ba định luật Newton qua các tình huống tương tác
            </p>

            <div className="theory-box">
              <h3>📚 Ba Định Luật Newton</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>1️⃣ Định luật I - Quán tính</h4>
                  <p><strong>Phát biểu:</strong> Vật giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều nếu không có ngoại lực.</p>
                  <p><strong>Ý nghĩa:</strong> Mọi vật đều có quán tính - xu hướng giữ nguyên trạng thái chuyển động.</p>
                  <p><strong>Ví dụ:</strong> Hành khách ngã về phía trước khi xe phanh gấp.</p>
                </div>

                <div className="theory-item">
                  <h4>2️⃣ Định luật II - F = ma</h4>
                  <p><strong>Công thức:</strong> F = ma</p>
                  <p><strong>Ý nghĩa:</strong> Gia tốc của vật tỉ lệ thuận với lực, tỉ lệ nghịch với khối lượng.</p>
                  <p><strong>Đơn vị:</strong> [F] = N (Newton), [m] = kg, [a] = m/s²</p>
                  <p><strong>Ứng dụng:</strong> Tính lực cần thiết để tăng tốc vật.</p>
                </div>

                <div className="theory-item">
                  <h4>3️⃣ Định luật III - Tác dụng - Phản tác dụng</h4>
                  <p><strong>Phát biểu:</strong> Khi vật A tác dụng lên vật B một lực, thì B cũng tác dụng lại A một lực bằng độ lớn nhưng ngược chiều.</p>
                  <p><strong>Đặc điểm:</strong> Cặp lực cùng giá, ngược chiều, cùng độ lớn, tác dụng lên hai vật khác nhau.</p>
                  <p><strong>Ví dụ:</strong> Đẩy tường, rocket bay, chèo thuyền.</p>
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
      <div className="newtons-laws-arena">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <Atom className="title-icon" size={40} />
            Newton's Laws Arena
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
    <div className="newtons-laws-arena">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Atom className="title-icon" size={40} />
          Newton's Laws Arena - Cấp độ {selectedLevel}
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

        {currentScenario && (
          <div className="game-content">
            <div className="animation-area">
              <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="animation-canvas"
              />
              <button 
                className="animate-btn"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? '⏸️ Dừng' : '▶️ Xem mô phỏng'}
              </button>
            </div>

            <div className="question-area">
              <div className="question-box">
                <h3>❓ Câu hỏi</h3>
                <p>{currentScenario.question}</p>
              </div>

              <div className="answer-area">
                {currentScenario.type === 'calculation' ? (
                  <div className="calculation-input">
                    <label>Nhập kết quả:</label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.01"
                        value={userAnswer.value || ''}
                        onChange={(e) => setUserAnswer({ value: e.target.value })}
                        placeholder="Nhập số..."
                      />
                      <span className="unit">{currentScenario.unit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="options-grid">
                    {currentScenario.options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`option-btn ${userAnswer.selected === idx ? 'selected' : ''}`}
                        onClick={() => setUserAnswer({ selected: idx })}
                        disabled={showResult}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  className="submit-btn"
                  onClick={checkAnswer}
                  disabled={showResult || (currentScenario.type === 'calculation' ? !userAnswer.value : userAnswer.selected === undefined)}
                >
                  <Zap size={20} />
                  <span>Kiểm tra</span>
                </button>

                {showResult && (
                  <div className={`result-box ${resultMessage.includes('✅') ? 'correct' : 'incorrect'}`}>
                    <p className="result-message">{resultMessage}</p>
                    <p className="explanation">{currentScenario.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewtonsLawsArena;
