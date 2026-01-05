import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, RotateCcw, Trophy, TrendingUp, Zap } from 'lucide-react';
import './WorkEnergyTheoremLab.css';

const WorkEnergyTheoremLab = () => {
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
      name: 'Công cơ học',
      description: 'Tính công của lực: A = F.s.cosα',
      challenges: 4,
      timeLimit: 180,
      scenarioTypes: ['work']
    },
    {
      id: 2,
      name: 'Động năng',
      description: 'Động năng: W_đ = ½mv²',
      challenges: 5,
      timeLimit: 240,
      scenarioTypes: ['kinetic-energy']
    },
    {
      id: 3,
      name: 'Định lý động năng',
      description: 'A = ΔW_đ = ½mv₂² - ½mv₁²',
      challenges: 6,
      timeLimit: 300,
      scenarioTypes: ['work-energy-theorem']
    },
    {
      id: 4,
      name: 'Tổng hợp',
      description: 'Kết hợp tất cả các khái niệm',
      challenges: 8,
      timeLimit: 360,
      scenarioTypes: ['work', 'kinetic-energy', 'work-energy-theorem']
    }
  ];

  const scenarioTypes = {
    'work': {
      name: 'Công cơ học',
      description: 'Công của lực không đổi: A = F × s × cos(α)',
      generateChallenge: () => {
        const force = 10 + Math.floor(Math.random() * 90); // 10-100 N
        const distance = 2 + Math.random() * 18; // 2-20 m
        const angles = [0, 30, 45, 60, 90, 120, 150, 180];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        const angleRad = (angle * Math.PI) / 180;
        const work = force * distance * Math.cos(angleRad);

        const questionTypes = ['work', 'force', 'distance'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'work':
            givenInfo = `F = ${force}N, s = ${distance.toFixed(1)}m, α = ${angle}°`;
            question = `Lực ${force}N tác dụng lên vật làm vật dịch chuyển ${distance.toFixed(1)}m. Góc giữa lực và chuyển động là ${angle}°. Tính công (J)?`;
            correctAnswer = work;
            break;
          case 'force':
            givenInfo = `A = ${work.toFixed(1)}J, s = ${distance.toFixed(1)}m, α = ${angle}°`;
            question = `Công thực hiện là ${work.toFixed(1)}J khi vật dịch chuyển ${distance.toFixed(1)}m với góc ${angle}° giữa lực và chuyển động. Tính lực (N)?`;
            correctAnswer = work / (distance * Math.cos(angleRad));
            break;
          case 'distance':
            givenInfo = `A = ${work.toFixed(1)}J, F = ${force}N, α = ${angle}°`;
            question = `Lực ${force}N thực hiện công ${work.toFixed(1)}J với góc ${angle}° giữa lực và chuyển động. Tính quãng đường dịch chuyển (m)?`;
            correctAnswer = work / (force * Math.cos(angleRad));
            break;
        }

        return {
          type: 'work',
          force,
          distance,
          angle,
          work,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'kinetic-energy': {
      name: 'Động năng',
      description: 'W_đ = ½mv²',
      generateChallenge: () => {
        const mass = 1 + Math.random() * 19; // 1-20 kg
        const velocity = 2 + Math.random() * 28; // 2-30 m/s
        const kineticEnergy = 0.5 * mass * velocity * velocity;

        const questionTypes = ['energy', 'mass', 'velocity'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'energy':
            givenInfo = `m = ${mass.toFixed(2)}kg, v = ${velocity.toFixed(2)}m/s`;
            question = `Vật khối lượng ${mass.toFixed(2)}kg chuyển động với vận tốc ${velocity.toFixed(2)}m/s. Tính động năng (J)?`;
            correctAnswer = kineticEnergy;
            break;
          case 'mass':
            givenInfo = `W_đ = ${kineticEnergy.toFixed(1)}J, v = ${velocity.toFixed(2)}m/s`;
            question = `Vật có động năng ${kineticEnergy.toFixed(1)}J khi chuyển động với vận tốc ${velocity.toFixed(2)}m/s. Tính khối lượng (kg)?`;
            correctAnswer = (2 * kineticEnergy) / (velocity * velocity);
            break;
          case 'velocity':
            givenInfo = `W_đ = ${kineticEnergy.toFixed(1)}J, m = ${mass.toFixed(2)}kg`;
            question = `Vật ${mass.toFixed(2)}kg có động năng ${kineticEnergy.toFixed(1)}J. Tính vận tốc (m/s)?`;
            correctAnswer = Math.sqrt((2 * kineticEnergy) / mass);
            break;
        }

        return {
          type: 'kinetic-energy',
          mass,
          velocity,
          kineticEnergy,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'work-energy-theorem': {
      name: 'Định lý động năng',
      description: 'Công của ngoại lực bằng độ biến thiên động năng: A = ΔW_đ',
      generateChallenge: () => {
        const mass = 2 + Math.random() * 18; // 2-20 kg
        const v1 = 0 + Math.random() * 15; // 0-15 m/s (initial velocity)
        const v2 = v1 + 5 + Math.random() * 15; // v1+5 to v1+20 m/s (final velocity)
        const ke1 = 0.5 * mass * v1 * v1;
        const ke2 = 0.5 * mass * v2 * v2;
        const work = ke2 - ke1;

        const questionTypes = ['work', 'final-velocity', 'initial-velocity'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'work':
            givenInfo = `m = ${mass.toFixed(2)}kg, v₁ = ${v1.toFixed(2)}m/s, v₂ = ${v2.toFixed(2)}m/s`;
            question = `Vật ${mass.toFixed(2)}kg tăng tốc từ ${v1.toFixed(2)}m/s đến ${v2.toFixed(2)}m/s. Tính công của ngoại lực (J)?`;
            correctAnswer = work;
            break;
          case 'final-velocity':
            givenInfo = `m = ${mass.toFixed(2)}kg, v₁ = ${v1.toFixed(2)}m/s, A = ${work.toFixed(1)}J`;
            question = `Vật ${mass.toFixed(2)}kg ban đầu có vận tốc ${v1.toFixed(2)}m/s. Ngoại lực thực hiện công ${work.toFixed(1)}J. Tính vận tốc cuối (m/s)?`;
            correctAnswer = v2;
            break;
          case 'initial-velocity':
            givenInfo = `m = ${mass.toFixed(2)}kg, v₂ = ${v2.toFixed(2)}m/s, A = ${work.toFixed(1)}J`;
            question = `Vật ${mass.toFixed(2)}kg đạt vận tốc ${v2.toFixed(2)}m/s sau khi ngoại lực thực hiện công ${work.toFixed(1)}J. Tính vận tốc ban đầu (m/s)?`;
            correctAnswer = v1;
            break;
        }

        return {
          type: 'work-energy-theorem',
          mass,
          v1,
          v2,
          ke1,
          ke2,
          work,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
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

      if (currentQuestion.type === 'work') {
        drawWork(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'kinetic-energy') {
        drawKineticEnergy(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'work-energy-theorem') {
        drawWorkEnergyTheorem(ctx, canvas, currentQuestion, animationProgress);
      }
    }
  }, [gameState, currentQuestion, animationProgress]);

  const drawWork = (ctx, canvas, question, progress) => {
    const startX = 100;
    const startY = canvas.height / 2;
    const distanceScale = 3;
    const displacement = question.distance * distanceScale * progress;
    const objectX = startX + displacement;

    // Draw ground
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, startY + 30);
    ctx.lineTo(canvas.width, startY + 30);
    ctx.stroke();

    // Draw ground texture
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, startY + 30);
      ctx.lineTo(i + 10, startY + 40);
      ctx.stroke();
    }

    // Draw object (box)
    const boxSize = 40;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(objectX - boxSize / 2, startY - boxSize, boxSize, boxSize);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(objectX - boxSize / 2, startY - boxSize, boxSize, boxSize);

    // Draw force vector
    const forceScale = 2;
    const forceLength = (question.force / 10) * forceScale;
    const angleRad = (question.angle * Math.PI) / 180;
    const forceEndX = objectX + forceLength * Math.cos(angleRad);
    const forceEndY = startY - boxSize / 2 + forceLength * Math.sin(angleRad);
    
    drawArrow(ctx, objectX, startY - boxSize / 2, forceEndX, forceEndY, '#ef4444', 4);

    // Draw angle arc
    if (question.angle !== 0 && question.angle !== 180) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(objectX, startY - boxSize / 2, 30, 0, -angleRad, angleRad > 0);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`F = ${question.force}N`, forceEndX, forceEndY - 15);

    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${question.angle}°`, objectX + 45, startY - boxSize / 2 + 10);

    // Distance label
    ctx.fillStyle = 'white';
    ctx.fillText(`s = ${(displacement / distanceScale).toFixed(1)}m`, (startX + objectX) / 2, startY + 60);

    // Draw distance line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY + 50);
    ctx.lineTo(objectX, startY + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'CÔNG CƠ HỌC',
      'A = F × s × cos(α)',
      question.givenInfo
    ]);
  };

  const drawKineticEnergy = (ctx, canvas, question, progress) => {
    const centerY = canvas.height / 2;
    const objectX = 100 + progress * 600;

    // Draw ground
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, centerY + 30);
    ctx.lineTo(canvas.width, centerY + 30);
    ctx.stroke();

    // Draw motion blur trail
    if (progress > 0.1) {
      for (let i = 0; i < 5; i++) {
        const trailX = objectX - (i + 1) * 15;
        const alpha = 0.3 - i * 0.05;
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fillRect(trailX - 15, centerY - 30, 30, 30);
      }
    }

    // Draw moving object
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(objectX - 20, centerY - 40, 40, 40);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(objectX - 20, centerY - 40, 40, 40);

    // Mass label on object
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${question.mass.toFixed(1)}kg`, objectX, centerY - 15);

    // Draw velocity vector
    const velLength = 60;
    const velEndX = objectX + velLength;
    const velEndY = centerY - 20;
    drawArrow(ctx, objectX + 20, centerY - 20, velEndX, velEndY, '#10b981', 4);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`v = ${question.velocity.toFixed(1)}m/s`, velEndX + 50, velEndY);

    // Energy bar
    const maxEnergy = 10000;
    const energyBarWidth = Math.min((question.kineticEnergy / maxEnergy) * 300, 300);
    const barX = 450;
    const barY = 50;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, 300, 30);

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(barX, barY, energyBarWidth, 30);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, 300, 30);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Động năng: ${question.kineticEnergy.toFixed(1)}J`, barX, barY - 10);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'ĐỘNG NĂNG',
      'W_đ = ½mv²',
      question.givenInfo
    ]);
  };

  const drawWorkEnergyTheorem = (ctx, canvas, question, progress) => {
    const centerY = canvas.height / 2;
    const startX = 100;
    const endX = 700;
    const objectX = startX + progress * (endX - startX);

    // Draw ground
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, centerY + 30);
    ctx.lineTo(canvas.width, centerY + 30);
    ctx.stroke();

    // Draw start and end markers
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, centerY - 60);
    ctx.lineTo(startX, centerY + 30);
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(endX, centerY - 60);
    ctx.lineTo(endX, centerY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw moving object
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(objectX - 20, centerY - 40, 40, 40);
    ctx.strokeStyle = '#6d28d9';
    ctx.lineWidth = 3;
    ctx.strokeRect(objectX - 20, centerY - 40, 40, 40);

    // Mass label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${question.mass.toFixed(1)}kg`, objectX, centerY - 15);

    // Current velocity (interpolate between v1 and v2)
    const currentV = question.v1 + progress * (question.v2 - question.v1);
    const velLength = 50;
    const velEndX = objectX + 20 + velLength;
    const velEndY = centerY - 20;
    drawArrow(ctx, objectX + 20, centerY - 20, velEndX, velEndY, '#10b981', 4);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${currentV.toFixed(1)}m/s`, velEndX + 30, velEndY);

    // Initial velocity label (at start)
    ctx.fillStyle = '#a5f3fc';
    ctx.textAlign = 'center';
    ctx.fillText(`v₁ = ${question.v1.toFixed(1)}m/s`, startX, centerY - 70);

    // Final velocity label (at end)
    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`v₂ = ${question.v2.toFixed(1)}m/s`, endX, centerY - 70);

    // Energy display
    const currentKE = 0.5 * question.mass * currentV * currentV;
    
    // Energy bars
    const barWidth = 120;
    const barHeight = 25;
    const barStartY = 80;

    // KE1 bar
    const ke1Height = Math.min((question.ke1 / 5000) * 150, 150);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(100, barStartY + (150 - ke1Height), barWidth, ke1Height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, barStartY, barWidth, 150);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`KE₁`, 160, barStartY + 170);
    ctx.fillText(`${question.ke1.toFixed(0)}J`, 160, barStartY + 185);

    // Current KE bar
    const currentKEHeight = Math.min((currentKE / 5000) * 150, 150);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(250, barStartY + (150 - currentKEHeight), barWidth, currentKEHeight);
    ctx.strokeRect(250, barStartY, barWidth, 150);
    ctx.fillText(`KE hiện tại`, 310, barStartY + 170);
    ctx.fillText(`${currentKE.toFixed(0)}J`, 310, barStartY + 185);

    // KE2 bar
    const ke2Height = Math.min((question.ke2 / 5000) * 150, 150);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(400, barStartY + (150 - ke2Height), barWidth, ke2Height);
    ctx.strokeRect(400, barStartY, barWidth, 150);
    ctx.fillText(`KE₂`, 460, barStartY + 170);
    ctx.fillText(`${question.ke2.toFixed(0)}J`, 460, barStartY + 185);

    // Work label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`A = ${question.work.toFixed(1)}J`, 280, barStartY + 210);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'ĐỊNH LÝ ĐỘNG NĂNG',
      'A = ΔW_đ = ½mv₂² - ½mv₁²',
      question.givenInfo
    ]);
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
    <div className="work-energy-theorem-lab">
      <header className="game-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <Home size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Zap size={32} className="title-icon" />
          Work-Energy Theorem Lab
        </h1>
      </header>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Zap size={64} className="menu-icon" />
            <h2>Work-Energy Theorem Lab</h2>
            <p className="menu-description">
              Khám phá mối quan hệ giữa công và động năng!
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              <div className="theory-section">
                <div className="theory-item">
                  <h4>1. Công cơ học</h4>
                  <p>Công của lực không đổi:</p>
                  <p><strong>A = F × s × cos(α)</strong></p>
                  <p>Trong đó: F là lực (N), s là độ dịch chuyển (m), α là góc giữa lực và chuyển động</p>
                  <p>Đơn vị: Jun (J) = N.m</p>
                  <p>• α = 0°: A = F.s (lực cùng chiều chuyển động)</p>
                  <p>• α = 90°: A = 0 (lực vuông góc với chuyển động)</p>
                  <p>• α = 180°: A = -F.s (lực ngược chiều chuyển động)</p>
                </div>

                <div className="theory-item">
                  <h4>2. Động năng</h4>
                  <p>Động năng của vật chuyển động:</p>
                  <p><strong>W_đ = ½mv²</strong></p>
                  <p>Trong đó: m là khối lượng (kg), v là vận tốc (m/s)</p>
                  <p>Động năng phụ thuộc vào khối lượng và bình phương vận tốc</p>
                </div>

                <div className="theory-item">
                  <h4>3. Định lý động năng</h4>
                  <p>Công của ngoại lực bằng độ biến thiên động năng:</p>
                  <p><strong>A = ΔW_đ = W_đ2 - W_đ1</strong></p>
                  <p><strong>A = ½mv₂² - ½mv₁²</strong></p>
                  <p>Nếu A &gt; 0: vật tăng tốc (động năng tăng)</p>
                  <p>Nếu A &lt; 0: vật giảm tốc (động năng giảm)</p>
                  <p>Nếu A = 0: động năng không đổi (v = const)</p>
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

export default WorkEnergyTheoremLab;
