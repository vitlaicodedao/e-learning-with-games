import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, RotateCcw, Trophy, TrendingUp } from 'lucide-react';
import './EquilibriumChallenge.css';

const EquilibriumChallenge = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'victory'
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [challengeNumber, setChallengeNumber] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);

  // Current challenge
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Physics constants
  const g = 10; // m/s²

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cân bằng lực',
      description: 'Điều kiện cân bằng: ΣF = 0',
      challenges: 4,
      timeLimit: 180,
      scenarioTypes: ['force-balance']
    },
    {
      id: 2,
      name: 'Moment lực',
      description: 'Moment lực và điều kiện cân bằng quay',
      challenges: 5,
      timeLimit: 240,
      scenarioTypes: ['moment']
    },
    {
      id: 3,
      name: 'Đòn bẩy',
      description: 'Nguyên lý đòn bẩy và ứng dụng',
      challenges: 6,
      timeLimit: 300,
      scenarioTypes: ['lever']
    },
    {
      id: 4,
      name: 'Tổng hợp',
      description: 'Kết hợp tất cả các loại cân bằng',
      challenges: 8,
      timeLimit: 360,
      scenarioTypes: ['force-balance', 'moment', 'lever']
    }
  ];

  // Scenario types
  const scenarioTypes = {
    'force-balance': {
      name: 'Cân bằng lực',
      description: 'Vật đứng yên khi tổng các lực tác dụng bằng 0',
      generateChallenge: () => {
        const numForces = 2 + Math.floor(Math.random() * 2); // 2-3 forces
        const forces = [];
        let totalX = 0;
        let totalY = 0;

        // Generate random forces
        for (let i = 0; i < numForces; i++) {
          const magnitude = 10 + Math.floor(Math.random() * 40); // 10-50 N
          const angle = Math.floor(Math.random() * 360); // 0-360 degrees
          const angleRad = (angle * Math.PI) / 180;
          
          forces.push({
            magnitude,
            angle,
            x: magnitude * Math.cos(angleRad),
            y: magnitude * Math.sin(angleRad)
          });

          totalX += magnitude * Math.cos(angleRad);
          totalY += magnitude * Math.sin(angleRad);
        }

        // Calculate equilibrium force
        const equilibriumX = -totalX;
        const equilibriumY = -totalY;
        const equilibriumMagnitude = Math.sqrt(equilibriumX * equilibriumX + equilibriumY * equilibriumY);
        let equilibriumAngle = Math.atan2(equilibriumY, equilibriumX) * (180 / Math.PI);
        if (equilibriumAngle < 0) equilibriumAngle += 360;

        return {
          type: 'force-balance',
          forces,
          correctAnswer: equilibriumMagnitude,
          correctAngle: equilibriumAngle,
          question: `Cho ${numForces} lực tác dụng lên vật. Để vật cân bằng, cần thêm lực có độ lớn bao nhiêu N? (Làm tròn 1 chữ số thập phân)`
        };
      }
    },
    'moment': {
      name: 'Moment lực',
      description: 'Moment lực M = F × d, điều kiện cân bằng: ΣM = 0',
      generateChallenge: () => {
        const numForces = 2 + Math.floor(Math.random() * 2); // 2-3 forces
        const forces = [];
        let totalMoment = 0;
        const leverLength = 2 + Math.random() * 3; // 2-5 m

        for (let i = 0; i < numForces; i++) {
          const force = 10 + Math.floor(Math.random() * 30); // 10-40 N
          const distance = 0.5 + Math.random() * (leverLength - 0.5);
          const clockwise = Math.random() > 0.5;
          
          forces.push({
            force,
            distance,
            clockwise
          });

          totalMoment += clockwise ? force * distance : -force * distance;
        }

        // Calculate equilibrium force at a specific distance
        const equilibriumDistance = 0.5 + Math.random() * (leverLength - 0.5);
        const equilibriumForce = Math.abs(totalMoment / equilibriumDistance);
        const equilibriumClockwise = totalMoment < 0;

        return {
          type: 'moment',
          forces,
          leverLength,
          equilibriumDistance,
          correctAnswer: equilibriumForce,
          equilibriumClockwise,
          question: `Thanh có chiều dài ${leverLength.toFixed(1)}m quay quanh trục tại trung điểm. Cần thêm lực tác dụng vuông góc với thanh, cách trục ${equilibriumDistance.toFixed(2)}m để cân bằng. Tính độ lớn lực (N)? (Làm tròn 1 chữ số thập phân)`
        };
      }
    },
    'lever': {
      name: 'Đòn bẩy',
      description: 'Nguyên lý đòn bẩy: F₁ × d₁ = F₂ × d₂',
      generateChallenge: () => {
        const totalLength = 3 + Math.random() * 4; // 3-7 m
        const fulcrumPosition = 0.3 + Math.random() * 0.4; // 30-70% from left
        const fulcrumDistance = totalLength * fulcrumPosition;

        const d1 = fulcrumDistance;
        const d2 = totalLength - fulcrumDistance;

        // Place objects on the lever
        const mass1 = 10 + Math.floor(Math.random() * 40); // 10-50 kg
        const weight1 = mass1 * g;

        // Calculate required weight on the other side
        const weight2 = (weight1 * d1) / d2;
        const mass2 = weight2 / g;

        // Question types: calculate mass, calculate distance, or calculate fulcrum position
        const questionType = Math.floor(Math.random() * 3);

        if (questionType === 0) {
          // Calculate mass2
          return {
            type: 'lever',
            totalLength,
            fulcrumDistance,
            mass1,
            mass2: null,
            d1,
            d2,
            correctAnswer: mass2,
            question: `Đòn bẩy dài ${totalLength.toFixed(1)}m, điểm tựa cách đầu trái ${fulcrumDistance.toFixed(2)}m. Vật khối lượng ${mass1}kg đặt ở đầu trái. Tính khối lượng vật cần đặt ở đầu phải để cân bằng (kg)? (Làm tròn 1 chữ số thập phân)`
          };
        } else if (questionType === 1) {
          // Calculate distance d1
          const givenMass2 = 10 + Math.floor(Math.random() * 40);
          const givenWeight2 = givenMass2 * g;
          const correctD1 = (givenWeight2 * d2) / weight1;

          return {
            type: 'lever',
            totalLength,
            fulcrumDistance: null,
            mass1,
            mass2: givenMass2,
            d1: null,
            d2,
            correctAnswer: correctD1,
            question: `Đòn bẩy dài ${totalLength.toFixed(1)}m. Vật ${mass1}kg ở đầu trái, vật ${givenMass2}kg ở đầu phải (cách điểm tựa ${d2.toFixed(2)}m). Tính khoảng cách từ vật trái đến điểm tựa để cân bằng (m)? (Làm tròn 2 chữ số thập phân)`
          };
        } else {
          // Calculate fulcrum position from left
          return {
            type: 'lever',
            totalLength,
            fulcrumDistance: null,
            mass1,
            mass2,
            d1: null,
            d2: null,
            correctAnswer: fulcrumDistance,
            question: `Đòn bẩy dài ${totalLength.toFixed(1)}m với vật ${mass1}kg ở đầu trái và vật ${mass2.toFixed(1)}kg ở đầu phải. Tính khoảng cách từ điểm tựa đến đầu trái để cân bằng (m)? (Làm tròn 2 chữ số thập phân)`
          };
        }
      }
    }
  };

  // Start game
  const startGame = useCallback(() => {
    const level = levels[selectedLevel - 1];
    setTotalChallenges(level.challenges);
    setTimeLeft(level.timeLimit);
    setChallengeNumber(1);
    setScore(0);
    generateNewChallenge(level);
    setGameState('playing');
  }, [selectedLevel]);

  // Generate new challenge
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

  // Timer
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

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (!userAnswer) return;

    const answer = parseFloat(userAnswer);
    const correct = currentQuestion.correctAnswer;
    const tolerance = 0.08; // 8% tolerance

    const isCorrect = Math.abs(answer - correct) / correct <= tolerance;

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

  // Animate scenario
  const animate = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationProgress(0);
    }
  }, [isAnimating]);

  // Animation loop
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

  // Draw on canvas
  useEffect(() => {
    if (gameState === 'playing' && currentQuestion && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw based on scenario type
      if (currentQuestion.type === 'force-balance') {
        drawForceBalance(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'moment') {
        drawMoment(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'lever') {
        drawLever(ctx, canvas, currentQuestion, animationProgress);
      }
    }
  }, [gameState, currentQuestion, animationProgress]);

  // Draw force balance scenario
  const drawForceBalance = (ctx, canvas, question, progress) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const objectRadius = 30;
    const arrowScale = 2;

    // Draw object (circle)
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(centerX, centerY, objectRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw forces
    question.forces.forEach((force, index) => {
      const angleRad = (force.angle * Math.PI) / 180;
      const startX = centerX + objectRadius * Math.cos(angleRad);
      const startY = centerY + objectRadius * Math.sin(angleRad);
      const length = force.magnitude * arrowScale * (isAnimating ? progress : 1);
      const endX = startX + length * Math.cos(angleRad);
      const endY = startY + length * Math.sin(angleRad);

      // Draw arrow
      drawArrow(ctx, startX, startY, endX, endY, '#fbbf24', 3);

      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      const labelX = endX + 30 * Math.cos(angleRad);
      const labelY = endY + 30 * Math.sin(angleRad);
      ctx.fillText(`F${index + 1} = ${force.magnitude}N`, labelX, labelY);
      ctx.fillText(`${force.angle}°`, labelX, labelY + 16);
    });

    // Draw equilibrium force (if animating and result is shown)
    if (result && result.correct) {
      const eqAngleRad = (question.correctAngle * Math.PI) / 180;
      const startX = centerX + objectRadius * Math.cos(eqAngleRad);
      const startY = centerY + objectRadius * Math.sin(eqAngleRad);
      const length = question.correctAnswer * arrowScale;
      const endX = startX + length * Math.cos(eqAngleRad);
      const endY = startY + length * Math.sin(eqAngleRad);

      drawArrow(ctx, startX, startY, endX, endY, '#10b981', 3);
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px Arial';
      const labelX = endX + 30 * Math.cos(eqAngleRad);
      const labelY = endY + 30 * Math.sin(eqAngleRad);
      ctx.fillText(`F_cb = ${question.correctAnswer.toFixed(1)}N`, labelX, labelY);
    }

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'CÂN BẰNG LỰC',
      'Điều kiện: ΣF = 0',
      `Số lực: ${question.forces.length}`
    ]);
  };

  // Draw moment scenario
  const drawMoment = (ctx, canvas, question, progress) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const leverPixelLength = 400;
    const pixelsPerMeter = leverPixelLength / question.leverLength;

    // Draw lever (horizontal bar)
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(centerX - leverPixelLength / 2, centerY);
    ctx.lineTo(centerX + leverPixelLength / 2, centerY);
    ctx.stroke();

    // Draw fulcrum (triangle)
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - 15, centerY + 25);
    ctx.lineTo(centerX + 15, centerY + 25);
    ctx.closePath();
    ctx.fill();

    // Draw forces
    question.forces.forEach((f, index) => {
      const xPos = centerX + (f.distance - question.leverLength / 2) * pixelsPerMeter;
      const forceLength = f.force * 2 * (isAnimating ? progress : 1);
      
      if (f.clockwise) {
        // Downward force
        drawArrow(ctx, xPos, centerY - 8, xPos, centerY - 8 - forceLength, '#ef4444', 3);
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${f.force}N ↓`, xPos, centerY - forceLength - 20);
        ctx.fillText(`d=${f.distance.toFixed(2)}m`, xPos, centerY + 40);
      } else {
        // Upward force
        drawArrow(ctx, xPos, centerY + 8, xPos, centerY + 8 + forceLength, '#3b82f6', 3);
        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${f.force}N ↑`, xPos, centerY + forceLength + 30);
        ctx.fillText(`d=${f.distance.toFixed(2)}m`, xPos, centerY + 50);
      }
    });

    // Draw equilibrium force position
    if (result && result.correct) {
      const xPos = centerX + (question.equilibriumDistance - question.leverLength / 2) * pixelsPerMeter;
      const forceLength = question.correctAnswer * 2;
      
      if (question.equilibriumClockwise) {
        drawArrow(ctx, xPos, centerY - 8, xPos, centerY - 8 - forceLength, '#10b981', 3);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${question.correctAnswer.toFixed(1)}N ↓`, xPos, centerY - forceLength - 20);
      } else {
        drawArrow(ctx, xPos, centerY + 8, xPos, centerY + 8 + forceLength, '#10b981', 3);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${question.correctAnswer.toFixed(1)}N ↑`, xPos, centerY + forceLength + 30);
      }
    }

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'MOMENT LỰC',
      'M = F × d',
      `Thanh dài: ${question.leverLength.toFixed(1)}m`
    ]);
  };

  // Draw lever scenario
  const drawLever = (ctx, canvas, question, progress) => {
    const centerY = canvas.height / 2;
    const leverPixelLength = 500;
    const pixelsPerMeter = leverPixelLength / question.totalLength;
    const leftX = 50;
    const rightX = leftX + leverPixelLength;

    // Determine fulcrum position
    let fulcrumX;
    if (question.fulcrumDistance !== null) {
      fulcrumX = leftX + question.fulcrumDistance * pixelsPerMeter;
    } else if (question.d1 !== null) {
      fulcrumX = leftX + question.d1 * pixelsPerMeter;
    } else {
      fulcrumX = leftX + question.correctAnswer * pixelsPerMeter;
    }

    // Lever rotation based on balance (animate tilt if not balanced)
    const isBalanced = result && result.correct;
    let leverAngle = 0;
    if (!isBalanced && isAnimating) {
      leverAngle = Math.sin(progress * Math.PI * 4) * 0.05; // Tilt oscillation
    }

    // Draw lever (bar)
    ctx.save();
    ctx.translate(fulcrumX, centerY);
    ctx.rotate(leverAngle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-(fulcrumX - leftX), 0);
    ctx.lineTo(rightX - fulcrumX, 0);
    ctx.stroke();
    ctx.restore();

    // Draw fulcrum
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(fulcrumX, centerY);
    ctx.lineTo(fulcrumX - 20, centerY + 30);
    ctx.lineTo(fulcrumX + 20, centerY + 30);
    ctx.closePath();
    ctx.fill();

    // Draw mass 1 (left)
    const leftMassX = leftX;
    const leftMassY = centerY - 10 + Math.sin(leverAngle) * (fulcrumX - leftX);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(leftMassX - 25, leftMassY - 30, 50, 30);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftMassX - 25, leftMassY - 30, 50, 30);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${question.mass1}kg`, leftMassX, leftMassY - 10);

    // Draw mass 2 (right) if known
    if (question.mass2 !== null) {
      const rightMassX = rightX;
      const rightMassY = centerY - 10 - Math.sin(leverAngle) * (rightX - fulcrumX);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rightMassX - 25, rightMassY - 30, 50, 30);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.strokeRect(rightMassX - 25, rightMassY - 30, 50, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${question.mass2.toFixed(1)}kg`, rightMassX, rightMassY - 10);
    } else if (result && result.correct) {
      // Draw equilibrium mass
      const rightMassX = rightX;
      const rightMassY = centerY - 10;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(rightMassX - 25, rightMassY - 30, 50, 30);
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 2;
      ctx.strokeRect(rightMassX - 25, rightMassY - 30, 50, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${question.correctAnswer.toFixed(1)}kg`, rightMassX, rightMassY - 10);
    }

    // Draw distance labels
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${question.totalLength.toFixed(1)}m`, (leftX + rightX) / 2, centerY + 60);

    // Draw balanced indicator
    if (isBalanced) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚖️ CÂN BẰNG', canvas.width / 2, 30);
    }

    // Info box
    const infoLines = ['ĐÒN BẨY', 'F₁ × d₁ = F₂ × d₂'];
    if (question.fulcrumDistance !== null) {
      infoLines.push(`Điểm tựa: ${question.fulcrumDistance.toFixed(2)}m từ trái`);
    }
    drawInfoBox(ctx, 10, 10, infoLines);
  };

  // Utility: Draw arrow
  const drawArrow = (ctx, x1, y1, x2, y2, color, lineWidth) => {
    const headLength = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw arrowhead
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

  // Utility: Draw info box
  const drawInfoBox = (ctx, x, y, lines) => {
    const padding = 10;
    const lineHeight = 18;
    const boxWidth = 200;
    const boxHeight = padding * 2 + lines.length * lineHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';

    lines.forEach((line, index) => {
      ctx.fillText(line, x + padding, y + padding + (index + 1) * lineHeight);
    });
  };

  return (
    <div className="equilibrium-challenge">
      {/* Header */}
      <header className="game-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <Home size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <span className="title-icon">⚖️</span>
          Equilibrium Challenge
        </h1>
      </header>

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <div className="menu-icon">⚖️</div>
            <h2>Equilibrium Challenge</h2>
            <p className="menu-description">
              Khám phá các điều kiện cân bằng: lực, moment và đòn bẩy!
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              <div className="theory-section">
                <div className="theory-item">
                  <h4>1. Điều kiện cân bằng lực</h4>
                  <p>Vật đứng yên khi tổng các lực tác dụng bằng 0:</p>
                  <p><strong>ΣF = 0</strong> hay <strong>ΣF⃗ = 0⃗</strong></p>
                  <p>Theo các trục: <strong>ΣFₓ = 0</strong> và <strong>ΣFᵧ = 0</strong></p>
                </div>

                <div className="theory-item">
                  <h4>2. Moment lực</h4>
                  <p>Moment lực đặc trưng cho tác dụng làm quay của lực:</p>
                  <p><strong>M = F × d</strong></p>
                  <p>Trong đó: F là lực (N), d là khoảng cách từ trục quay đến phương lực (m)</p>
                  <p>Điều kiện cân bằng quay: <strong>ΣM = 0</strong></p>
                  <p>Moment lực cùng chiều cân bằng với moment lực ngược chiều</p>
                </div>

                <div className="theory-item">
                  <h4>3. Đòn bẩy</h4>
                  <p>Nguyên lý đòn bẩy (quy tắc momen):</p>
                  <p><strong>F₁ × d₁ = F₂ × d₂</strong></p>
                  <p>Trong đó: F₁, F₂ là các lực tác dụng, d₁, d₂ là khoảng cách từ điểm tựa đến điểm đặt lực</p>
                  <p>Ứng dụng: bập bênh, kéo, kìm, cân đĩa,...</p>
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

      {/* Game Screen */}
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

      {/* Victory Screen */}
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

export default EquilibriumChallenge;
