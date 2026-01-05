import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, RotateCcw, Trophy, TrendingUp, Zap } from 'lucide-react';
import './MechanicalEnergyQuest.css';

const MechanicalEnergyQuest = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [challengeNumber, setChallengeNumber] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);

  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const g = 10;

  const levels = [
    {
      id: 1,
      name: 'Thế năng trọng trường',
      description: 'W_t = mgh',
      challenges: 4,
      timeLimit: 180,
      scenarioTypes: ['gravitational-potential']
    },
    {
      id: 2,
      name: 'Thế năng đàn hồi',
      description: 'W_đh = ½kx²',
      challenges: 5,
      timeLimit: 240,
      scenarioTypes: ['elastic-potential']
    },
    {
      id: 3,
      name: 'Bảo toàn cơ năng',
      description: 'W = W_đ + W_t = const',
      challenges: 6,
      timeLimit: 300,
      scenarioTypes: ['conservation']
    },
    {
      id: 4,
      name: 'Tổng hợp',
      description: 'Kết hợp tất cả các dạng năng lượng',
      challenges: 8,
      timeLimit: 360,
      scenarioTypes: ['gravitational-potential', 'elastic-potential', 'conservation']
    }
  ];

  const scenarioTypes = {
    'gravitational-potential': {
      name: 'Thế năng trọng trường',
      description: 'W_t = mgh (chọn mốc thế năng)',
      generateChallenge: () => {
        const mass = 1 + Math.random() * 19; // 1-20 kg
        const height = 2 + Math.random() * 48; // 2-50 m
        const potentialEnergy = mass * g * height;

        const questionTypes = ['energy', 'mass', 'height'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'energy':
            givenInfo = `m = ${mass.toFixed(2)}kg, h = ${height.toFixed(1)}m`;
            question = `Vật ${mass.toFixed(2)}kg ở độ cao ${height.toFixed(1)}m. Tính thế năng trọng trường (J)? (g = ${g}m/s²)`;
            correctAnswer = potentialEnergy;
            break;
          case 'mass':
            givenInfo = `W_t = ${potentialEnergy.toFixed(1)}J, h = ${height.toFixed(1)}m`;
            question = `Vật có thế năng ${potentialEnergy.toFixed(1)}J ở độ cao ${height.toFixed(1)}m. Tính khối lượng (kg)? (g = ${g}m/s²)`;
            correctAnswer = potentialEnergy / (g * height);
            break;
          case 'height':
            givenInfo = `W_t = ${potentialEnergy.toFixed(1)}J, m = ${mass.toFixed(2)}kg`;
            question = `Vật ${mass.toFixed(2)}kg có thế năng ${potentialEnergy.toFixed(1)}J. Tính độ cao (m)? (g = ${g}m/s²)`;
            correctAnswer = potentialEnergy / (mass * g);
            break;
        }

        return {
          type: 'gravitational-potential',
          mass,
          height,
          potentialEnergy,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'elastic-potential': {
      name: 'Thế năng đàn hồi',
      description: 'W_đh = ½kx² (lò xo bị nén/kéo)',
      generateChallenge: () => {
        const k = 50 + Math.random() * 450; // 50-500 N/m
        const x = 0.05 + Math.random() * 0.45; // 0.05-0.5 m
        const elasticEnergy = 0.5 * k * x * x;

        const questionTypes = ['energy', 'stiffness', 'displacement'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'energy':
            givenInfo = `k = ${k.toFixed(0)}N/m, x = ${x.toFixed(2)}m`;
            question = `Lò xo có độ cứng ${k.toFixed(0)}N/m bị nén ${x.toFixed(2)}m. Tính thế năng đàn hồi (J)?`;
            correctAnswer = elasticEnergy;
            break;
          case 'stiffness':
            givenInfo = `W_đh = ${elasticEnergy.toFixed(1)}J, x = ${x.toFixed(2)}m`;
            question = `Lò xo bị kéo ${x.toFixed(2)}m có thế năng ${elasticEnergy.toFixed(1)}J. Tính độ cứng k (N/m)?`;
            correctAnswer = (2 * elasticEnergy) / (x * x);
            break;
          case 'displacement':
            givenInfo = `W_đh = ${elasticEnergy.toFixed(1)}J, k = ${k.toFixed(0)}N/m`;
            question = `Lò xo k = ${k.toFixed(0)}N/m có thế năng ${elasticEnergy.toFixed(1)}J. Tính độ biến dạng x (m)?`;
            correctAnswer = Math.sqrt((2 * elasticEnergy) / k);
            break;
        }

        return {
          type: 'elastic-potential',
          k,
          x,
          elasticEnergy,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'conservation': {
      name: 'Bảo toàn cơ năng',
      description: 'Khi chỉ có trọng lực: W_đ + W_t = const',
      generateChallenge: () => {
        const scenarios = ['falling', 'pendulum', 'spring-mass'];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        if (scenario === 'falling') {
          // Free fall or throw up
          const mass = 1 + Math.random() * 9; // 1-10 kg
          const h1 = 10 + Math.random() * 40; // 10-50 m
          const v1 = 0; // Start from rest
          const h2 = 0; // Ground level
          
          const E_total = mass * g * h1 + 0.5 * mass * v1 * v1;
          const v2 = Math.sqrt((2 * E_total) / mass);

          return {
            type: 'conservation',
            scenario: 'falling',
            mass,
            h1,
            v1,
            h2,
            v2,
            E_total,
            questionType: 'final-velocity',
            question: `Vật ${mass.toFixed(2)}kg rơi tự do từ độ cao ${h1.toFixed(1)}m. Tính vận tốc khi chạm đất (m/s)? (Bỏ qua ma sát, g = ${g}m/s²)`,
            correctAnswer: v2,
            givenInfo: `m = ${mass.toFixed(2)}kg, h = ${h1.toFixed(1)}m`
          };
        } else if (scenario === 'pendulum') {
          // Pendulum swing
          const mass = 0.5 + Math.random() * 4.5; // 0.5-5 kg
          const L = 1 + Math.random() * 4; // 1-5 m
          const angle = 30 + Math.random() * 30; // 30-60 degrees
          const angleRad = (angle * Math.PI) / 180;
          
          const h_initial = L * (1 - Math.cos(angleRad));
          const v_bottom = Math.sqrt(2 * g * h_initial);

          return {
            type: 'conservation',
            scenario: 'pendulum',
            mass,
            L,
            angle,
            h_initial,
            v_bottom,
            questionType: 'velocity-bottom',
            question: `Con lắc đơn dài ${L.toFixed(2)}m, khối lượng ${mass.toFixed(2)}kg được kéo lệch góc ${angle.toFixed(0)}° rồi thả. Tính vận tốc tại vị trí cân bằng (m/s)? (g = ${g}m/s²)`,
            correctAnswer: v_bottom,
            givenInfo: `L = ${L.toFixed(2)}m, α = ${angle}°`
          };
        } else {
          // Spring-mass system
          const mass = 0.2 + Math.random() * 1.8; // 0.2-2 kg
          const k = 100 + Math.random() * 400; // 100-500 N/m
          const x_max = 0.1 + Math.random() * 0.3; // 0.1-0.4 m
          
          const E_total = 0.5 * k * x_max * x_max;
          const v_max = Math.sqrt((2 * E_total) / mass);

          return {
            type: 'conservation',
            scenario: 'spring-mass',
            mass,
            k,
            x_max,
            v_max,
            E_total,
            questionType: 'max-velocity',
            question: `Vật ${mass.toFixed(2)}kg gắn vào lò xo k = ${k.toFixed(0)}N/m, biên độ dao động ${x_max.toFixed(2)}m. Tính vận tốc cực đại (m/s)?`,
            correctAnswer: v_max,
            givenInfo: `m = ${mass.toFixed(2)}kg, k = ${k.toFixed(0)}N/m, A = ${x_max.toFixed(2)}m`
          };
        }
      }
    }
  };

  const startGame = useCallback(() => {
    const level = levels[selectedLevel - 1];
    setTotalChallenges(level.challenges);
    setTimeLeft(level.timeLimit);
    setChallengeNumber(1);
    setScore(0);
    generateNewChallenge(level);
    setGameState('playing');
  }, [selectedLevel]);

  const generateNewChallenge = useCallback((level) => {
    const scenarioType = level.scenarioTypes[Math.floor(Math.random() * level.scenarioTypes.length)];
    const scenario = scenarioTypes[scenarioType];
    const challenge = scenario.generateChallenge();
    
    setCurrentScenario(scenario);
    setCurrentQuestion(challenge);
    setUserAnswer('');
    setResult(null);
    setIsAnimating(false);
    setAnimationProgress(0);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('victory');
    }
  }, [gameState, timeLeft]);

  const submitAnswer = useCallback(() => {
    if (!userAnswer) return;

    const answer = parseFloat(userAnswer);
    const correct = currentQuestion.correctAnswer;
    const tolerance = 0.08;

    const isCorrect = Math.abs(answer - correct) / Math.abs(correct) <= tolerance;

    if (isCorrect) {
      const level = levels[selectedLevel - 1];
      const basePoints = 100;
      const difficultyMultiplier = selectedLevel * 0.5;
      const points = Math.floor(basePoints * (1 + difficultyMultiplier));
      
      setScore(score + points);
      setResult({
        correct: true,
        message: `Chính xác! Đáp án: ${correct.toFixed(2)}`,
        points
      });

      if (challengeNumber < totalChallenges) {
        setTimeout(() => {
          setChallengeNumber(challengeNumber + 1);
          generateNewChallenge(level);
        }, 2000);
      } else {
        setTimeout(() => {
          setGameState('victory');
        }, 2000);
      }
    } else {
      setResult({
        correct: false,
        message: `Sai rồi! Đáp án đúng: ${correct.toFixed(2)}`,
        points: 0
      });
    }
  }, [userAnswer, currentQuestion, score, challengeNumber, totalChallenges, selectedLevel, generateNewChallenge]);

  const animate = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationProgress(0);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating && animationProgress < 1) {
      animationRef.current = requestAnimationFrame(() => {
        setAnimationProgress(prev => Math.min(prev + 0.01, 1));
      });
    } else if (animationProgress >= 1) {
      setIsAnimating(false);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationProgress]);

  useEffect(() => {
    if (gameState === 'playing' && currentQuestion && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentQuestion.type === 'gravitational-potential') {
        drawGravitationalPotential(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'elastic-potential') {
        drawElasticPotential(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'conservation') {
        if (currentQuestion.scenario === 'falling') {
          drawFalling(ctx, canvas, currentQuestion, animationProgress);
        } else if (currentQuestion.scenario === 'pendulum') {
          drawPendulum(ctx, canvas, currentQuestion, animationProgress);
        } else if (currentQuestion.scenario === 'spring-mass') {
          drawSpringMass(ctx, canvas, currentQuestion, animationProgress);
        }
      }
    }
  }, [gameState, currentQuestion, animationProgress]);

  const drawGravitationalPotential = (ctx, canvas, question, progress) => {
    const groundY = canvas.height - 50;
    const heightScale = 3;
    const objectY = groundY - question.height * heightScale * progress;
    const objectX = 200;

    // Draw building/platform
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(150, objectY, 100, groundY - objectY);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, objectY, 100, groundY - objectY);

    // Draw ground
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, groundY, canvas.width, 50);

    // Draw height line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(objectX + 60, objectY);
    ctx.lineTo(objectX + 60, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Height arrows
    drawArrow(ctx, objectX + 60, objectY, objectX + 60, objectY + 30, '#fbbf24', 2);
    drawArrow(ctx, objectX + 60, groundY, objectX + 60, groundY - 30, '#fbbf24', 2);

    // Draw object
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(objectX, objectY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`m = ${question.mass.toFixed(1)}kg`, objectX, objectY - 30);

    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`h = ${(question.height * progress).toFixed(1)}m`, objectX + 100, (objectY + groundY) / 2);

    // Energy display
    const currentH = question.height * progress;
    const currentPE = question.mass * g * currentH;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`W_t = mgh = ${currentPE.toFixed(1)}J`, 400, 50);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'THẾ NĂNG TRỌNG TRƯỜNG',
      'W_t = mgh',
      question.givenInfo
    ]);
  };

  const drawElasticPotential = (ctx, canvas, question, progress) => {
    const centerY = canvas.height / 2;
    const springX = 200;
    const naturalLength = 150;
    const compressionScale = 200;
    const currentX = question.x * compressionScale * progress;

    // Draw wall
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(100, centerY - 80, 20, 160);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, centerY - 80, 20, 160);

    // Draw spring
    const springStart = 120;
    const springEnd = springStart + naturalLength - currentX;
    drawSpring(ctx, springStart, centerY, springEnd, centerY, 20, 15);

    // Draw mass
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(springEnd, centerY - 25, 50, 50);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(springEnd, centerY - 25, 50, 50);

    // Displacement arrow
    if (currentX > 5) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(springStart + naturalLength, centerY + 50);
      ctx.lineTo(springEnd, centerY + 50);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(ctx, springStart + naturalLength, centerY + 50, springStart + naturalLength - 20, centerY + 50, '#ef4444', 3);
      drawArrow(ctx, springEnd, centerY + 50, springEnd + 20, centerY + 50, '#ef4444', 3);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`x = ${(currentX / compressionScale).toFixed(2)}m`, (springStart + naturalLength + springEnd) / 2, centerY + 70);
    }

    // Natural length indicator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(springStart + naturalLength, centerY - 60);
    ctx.lineTo(springStart + naturalLength, centerY + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Energy display
    const currentElastic = 0.5 * question.k * (currentX / compressionScale) * (currentX / compressionScale);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`W_đh = ½kx² = ${currentElastic.toFixed(1)}J`, 450, 50);
    ctx.fillText(`k = ${question.k.toFixed(0)}N/m`, 450, 75);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'THẾ NĂNG ĐÀN HỒI',
      'W_đh = ½kx²',
      question.givenInfo
    ]);
  };

  const drawFalling = (ctx, canvas, question, progress) => {
    const groundY = canvas.height - 50;
    const startY = 100;
    const objectY = startY + progress * (groundY - startY - 40);
    const objectX = canvas.width / 2;

    // Draw ground
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, groundY, canvas.width, 50);

    // Draw trajectory line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(objectX, startY);
    ctx.lineTo(objectX, groundY - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw object
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(objectX, objectY, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#6d28d9';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Velocity arrow
    const currentV = Math.sqrt(2 * g * question.h1 * progress);
    if (currentV > 1) {
      const velLength = Math.min(currentV * 5, 80);
      drawArrow(ctx, objectX, objectY, objectX, objectY + velLength, '#10b981', 4);
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`v = ${currentV.toFixed(1)}m/s`, objectX + 40, objectY + velLength / 2);
    }

    // Energy bars
    const currentH = question.h1 * (1 - progress);
    const currentKE = 0.5 * question.mass * currentV * currentV;
    const currentPE = question.mass * g * currentH;
    
    drawEnergyBars(ctx, 50, 50, currentKE, currentPE, question.E_total);

    // Info box
    drawInfoBox(ctx, 10, 250, [
      'BẢO TOÀN CƠ NĂNG',
      'W = W_đ + W_t = const',
      question.givenInfo
    ]);
  };

  const drawPendulum = (ctx, canvas, question, progress) => {
    const pivotX = canvas.width / 2;
    const pivotY = 100;
    const L_scale = 150;

    // Current angle during swing
    const currentAngle = question.angle * (1 - progress) * (Math.PI / 180);
    const bobX = pivotX + L_scale * Math.sin(currentAngle);
    const bobY = pivotY + L_scale * Math.cos(currentAngle);

    // Draw pivot
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw string
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw bob
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw equilibrium position
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + L_scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle arc
    if (currentAngle > 0.05) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 50, Math.PI / 2, Math.PI / 2 + currentAngle);
      ctx.stroke();
    }

    // Energy display
    const currentH = question.h_initial * (1 - Math.cos(currentAngle) / (1 - Math.cos(question.angle * Math.PI / 180)));
    const currentV = Math.sqrt(2 * g * (question.h_initial - currentH));
    const currentKE = 0.5 * question.mass * currentV * currentV;
    const currentPE = question.mass * g * currentH;
    const E_total = question.mass * g * question.h_initial;

    drawEnergyBars(ctx, 500, 100, currentKE, currentPE, E_total);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'CON LẮC ĐƠN',
      'Bảo toàn cơ năng',
      question.givenInfo
    ]);
  };

  const drawSpringMass = (ctx, canvas, question, progress) => {
    const centerY = canvas.height / 2;
    const centerX = 300;
    const amplitude = 150;
    
    // Oscillation: x = A*cos(ωt)
    const currentX = question.x_max * Math.cos(progress * 2 * Math.PI * 2) * amplitude / question.x_max;
    const massX = centerX + currentX;

    // Draw spring
    drawSpring(ctx, 100, centerY, massX - 25, centerY, 20, 15);

    // Draw mass
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(massX - 25, centerY - 25, 50, 50);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(massX - 25, centerY - 25, 50, 50);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${question.mass.toFixed(1)}kg`, massX, centerY);

    // Equilibrium line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 60);
    ctx.lineTo(centerX, centerY + 60);
    ctx.stroke();
    ctx.setLineDash([]);

    // Amplitude markers
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(centerX - amplitude, centerY - 50);
    ctx.lineTo(centerX - amplitude, centerY + 50);
    ctx.moveTo(centerX + amplitude, centerY - 50);
    ctx.lineTo(centerX + amplitude, centerY + 50);
    ctx.stroke();

    // Energy calculation
    const x_current = (currentX / amplitude) * question.x_max;
    const currentPE = 0.5 * question.k * x_current * x_current;
    const currentKE = question.E_total - currentPE;

    drawEnergyBars(ctx, 500, 100, currentKE, currentPE, question.E_total);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'HỆ LÒ XO - VẬT',
      'Bảo toàn cơ năng',
      question.givenInfo
    ]);
  };

  const drawSpring = (ctx, x1, y1, x2, y2, amplitude, coils) => {
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const length = x2 - x1;
    const coilWidth = length / coils;

    for (let i = 0; i < coils; i++) {
      const x = x1 + i * coilWidth;
      ctx.lineTo(x + coilWidth / 4, y1 - amplitude / 2);
      ctx.lineTo(x + (3 * coilWidth) / 4, y1 + amplitude / 2);
      ctx.lineTo(x + coilWidth, y1);
    }

    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const drawEnergyBars = (ctx, x, y, ke, pe, total) => {
    const barWidth = 80;
    const maxHeight = 150;
    const spacing = 20;

    // KE bar
    const keHeight = Math.min((ke / total) * maxHeight, maxHeight);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x, y + (maxHeight - keHeight), barWidth, keHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, maxHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Động năng', x + barWidth / 2, y + maxHeight + 15);
    ctx.fillText(`${ke.toFixed(0)}J`, x + barWidth / 2, y + maxHeight + 30);

    // PE bar
    const peHeight = Math.min((pe / total) * maxHeight, maxHeight);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + barWidth + spacing, y + (maxHeight - peHeight), barWidth, peHeight);
    ctx.strokeRect(x + barWidth + spacing, y, barWidth, maxHeight);
    
    ctx.fillText('Thế năng', x + barWidth + spacing + barWidth / 2, y + maxHeight + 15);
    ctx.fillText(`${pe.toFixed(0)}J`, x + barWidth + spacing + barWidth / 2, y + maxHeight + 30);

    // Total
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Tổng: ${total.toFixed(0)}J`, x + barWidth + spacing / 2, y - 10);
  };

  const drawArrow = (ctx, x1, y1, x2, y2, color, lineWidth) => {
    const headLength = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawInfoBox = (ctx, x, y, lines) => {
    const padding = 10;
    const lineHeight = 18;
    const boxWidth = 220;
    const boxHeight = padding * 2 + lines.length * lineHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'left';

    lines.forEach((line, index) => {
      ctx.fillText(line, x + padding, y + padding + (index + 1) * lineHeight);
    });
  };

  return (
    <div className="mechanical-energy-quest">
      <header className="game-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <Home size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Zap size={32} className="title-icon" />
          Mechanical Energy Quest
        </h1>
      </header>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Zap size={64} className="menu-icon" />
            <h2>Mechanical Energy Quest</h2>
            <p className="menu-description">
              Khám phá sự chuyển hóa giữa động năng và thế năng!
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              <div className="theory-section">
                <div className="theory-item">
                  <h4>1. Thế năng trọng trường</h4>
                  <p>Thế năng của vật ở độ cao h:</p>
                  <p><strong>W_t = mgh</strong></p>
                  <p>Trong đó: m là khối lượng (kg), g = 10 m/s², h là độ cao so với mốc (m)</p>
                  <p>Mốc thế năng: vị trí chọn làm gốc (W_t = 0)</p>
                  <p>Thế năng phụ thuộc vị trí của vật</p>
                </div>

                <div className="theory-item">
                  <h4>2. Thế năng đàn hồi</h4>
                  <p>Thế năng của lò xo bị biến dạng:</p>
                  <p><strong>W_đh = ½kx²</strong></p>
                  <p>Trong đó: k là độ cứng lò xo (N/m), x là độ biến dạng (m)</p>
                  <p>Lò xo bị nén hoặc kéo đều tích lũy thế năng</p>
                </div>

                <div className="theory-item">
                  <h4>3. Định luật bảo toàn cơ năng</h4>
                  <p>Khi chỉ có lực thế (trọng lực, đàn hồi) tác dụng:</p>
                  <p><strong>W = W_đ + W_t = const</strong></p>
                  <p><strong>½mv² + mgh = const</strong></p>
                  <p>Cơ năng chuyển hóa giữa động năng và thế năng</p>
                  <p>Ví dụ: Con lắc đơn, rơi tự do, dao động lò xo</p>
                  <p>Khi có ma sát: W giảm dần theo thời gian</p>
                </div>
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn cấp độ</h3>
              <div className="level-buttons">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <span className="level-number">Cấp độ {level.id}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-desc">{level.description}</span>
                    <span className="level-desc">
                      {level.challenges} thử thách • {Math.floor(level.timeLimit / 60)} phút
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
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Câu hỏi</span>
              <span className="stat-value">{challengeNumber}/{totalChallenges}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
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
              <button className="animate-btn" onClick={animate}>
                Xem mô phỏng
              </button>
            </div>

            <div className="answer-panel">
              <div className="question-info">
                <h3>Câu hỏi {challengeNumber}</h3>
                {currentScenario && (
                  <p className="scenario-type">{currentScenario.name}</p>
                )}
                {currentQuestion && (
                  <p>{currentQuestion.question}</p>
                )}
              </div>

              <div className="input-section">
                <div className="input-group">
                  <label>Nhập đáp án của bạn:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập số..."
                  />
                </div>

                <button
                  className="submit-btn"
                  onClick={submitAnswer}
                  disabled={!userAnswer || result !== null}
                >
                  <TrendingUp size={20} />
                  <span>Trả lời</span>
                </button>
              </div>

              {result && (
                <div className={`result-box ${result.correct ? 'correct' : 'incorrect'}`}>
                  <p>{result.message}</p>
                  {result.correct && <p>+{result.points} điểm!</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <div className="victory-content">
            <Trophy
              size={80}
              className={`trophy-icon ${score > 0 ? 'success' : 'fail'}`}
            />
            <h2>{score > 0 ? 'Hoàn thành!' : 'Hết giờ!'}</h2>

            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Tổng điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Hoàn thành</span>
                <span className="final-value">{challengeNumber - 1}/{totalChallenges}</span>
              </div>
            </div>

            <div className="victory-buttons">
              <button className="menu-button" onClick={() => setGameState('menu')}>
                <Home size={20} />
                <span>Menu</span>
              </button>
              <button className="replay-button" onClick={startGame}>
                <RotateCcw size={20} />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicalEnergyQuest;
