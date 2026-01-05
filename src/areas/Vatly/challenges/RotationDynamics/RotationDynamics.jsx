import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, RotateCcw, Trophy, TrendingUp } from 'lucide-react';
import './RotationDynamics.css';

const RotationDynamics = () => {
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
  const [questionType, setQuestionType] = useState('');
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const g = 10;

  const levels = [
    {
      id: 1,
      name: 'Chuyển động tròn đều',
      description: 'Vận tốc góc và chu kỳ',
      challenges: 4,
      timeLimit: 180,
      scenarioTypes: ['uniform-circular']
    },
    {
      id: 2,
      name: 'Lực hướng tâm',
      description: 'Tính lực hướng tâm trong chuyển động tròn',
      challenges: 5,
      timeLimit: 240,
      scenarioTypes: ['centripetal-force']
    },
    {
      id: 3,
      name: 'Chuyển động vệ tinh',
      description: 'Quỹ đạo và vận tốc vệ tinh',
      challenges: 6,
      timeLimit: 300,
      scenarioTypes: ['satellite']
    },
    {
      id: 4,
      name: 'Tổng hợp',
      description: 'Kết hợp tất cả các loại chuyển động quay',
      challenges: 8,
      timeLimit: 360,
      scenarioTypes: ['uniform-circular', 'centripetal-force', 'satellite']
    }
  ];

  const scenarioTypes = {
    'uniform-circular': {
      name: 'Chuyển động tròn đều',
      description: 'Vận tốc dài v = ωr, chu kỳ T = 2πr/v',
      generateChallenge: () => {
        const radius = 0.5 + Math.random() * 4.5; // 0.5-5 m
        const period = 1 + Math.random() * 9; // 1-10 s
        const omega = (2 * Math.PI) / period;
        const velocity = omega * radius;
        const frequency = 1 / period;

        const questionTypes = ['velocity', 'period', 'omega', 'frequency'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'velocity':
            givenInfo = `R = ${radius.toFixed(2)}m, T = ${period.toFixed(2)}s`;
            question = `Vật chuyển động tròn đều với bán kính ${radius.toFixed(2)}m, chu kỳ ${period.toFixed(2)}s. Tính vận tốc dài (m/s)?`;
            correctAnswer = velocity;
            break;
          case 'period':
            givenInfo = `R = ${radius.toFixed(2)}m, v = ${velocity.toFixed(2)}m/s`;
            question = `Vật chuyển động tròn với bán kính ${radius.toFixed(2)}m, vận tốc ${velocity.toFixed(2)}m/s. Tính chu kỳ T (s)?`;
            correctAnswer = period;
            break;
          case 'omega':
            givenInfo = `T = ${period.toFixed(2)}s`;
            question = `Vật chuyển động tròn đều với chu kỳ ${period.toFixed(2)}s. Tính vận tốc góc ω (rad/s)?`;
            correctAnswer = omega;
            break;
          case 'frequency':
            givenInfo = `T = ${period.toFixed(2)}s`;
            question = `Chu kỳ quay là ${period.toFixed(2)}s. Tính tần số f (Hz)?`;
            correctAnswer = frequency;
            break;
        }

        return {
          type: 'uniform-circular',
          radius,
          period,
          omega,
          velocity,
          frequency,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'centripetal-force': {
      name: 'Lực hướng tâm',
      description: 'F_ht = mv²/r = mω²r',
      generateChallenge: () => {
        const mass = 0.5 + Math.random() * 9.5; // 0.5-10 kg
        const radius = 0.5 + Math.random() * 4.5; // 0.5-5 m
        const velocity = 2 + Math.random() * 18; // 2-20 m/s
        const omega = velocity / radius;
        const centripetalForce = (mass * velocity * velocity) / radius;

        const questionTypes = ['force', 'velocity', 'radius'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'force':
            givenInfo = `m = ${mass.toFixed(2)}kg, R = ${radius.toFixed(2)}m, v = ${velocity.toFixed(2)}m/s`;
            question = `Vật ${mass.toFixed(2)}kg chuyển động tròn đều với R = ${radius.toFixed(2)}m, v = ${velocity.toFixed(2)}m/s. Tính lực hướng tâm (N)?`;
            correctAnswer = centripetalForce;
            break;
          case 'velocity':
            const givenForce = centripetalForce;
            givenInfo = `m = ${mass.toFixed(2)}kg, R = ${radius.toFixed(2)}m, F = ${givenForce.toFixed(2)}N`;
            question = `Lực hướng tâm ${givenForce.toFixed(2)}N tác dụng lên vật ${mass.toFixed(2)}kg chuyển động tròn R = ${radius.toFixed(2)}m. Tính vận tốc (m/s)?`;
            correctAnswer = velocity;
            break;
          case 'radius':
            const givenForce2 = centripetalForce;
            givenInfo = `m = ${mass.toFixed(2)}kg, v = ${velocity.toFixed(2)}m/s, F = ${givenForce2.toFixed(2)}N`;
            question = `Vật ${mass.toFixed(2)}kg, vận tốc ${velocity.toFixed(2)}m/s chịu lực hướng tâm ${givenForce2.toFixed(2)}N. Tính bán kính quỹ đạo (m)?`;
            correctAnswer = radius;
            break;
        }

        return {
          type: 'centripetal-force',
          mass,
          radius,
          velocity,
          omega,
          centripetalForce,
          questionType: qType,
          question,
          correctAnswer,
          givenInfo
        };
      }
    },
    'satellite': {
      name: 'Chuyển động vệ tinh',
      description: 'Vận tốc quỹ đạo và chu kỳ quay',
      generateChallenge: () => {
        const earthRadius = 6400; // km
        const altitude = 200 + Math.random() * 35600; // 200-36000 km
        const orbitRadius = earthRadius + altitude;
        const GM = 398600; // km³/s² (G × M_Earth)
        const velocity = Math.sqrt(GM / orbitRadius);
        const period = (2 * Math.PI * orbitRadius) / velocity;

        const questionTypes = ['velocity', 'period', 'altitude'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question, correctAnswer, givenInfo;

        switch (qType) {
          case 'velocity':
            givenInfo = `Độ cao: ${altitude.toFixed(0)}km`;
            question = `Vệ tinh bay ở độ cao ${altitude.toFixed(0)}km so với mặt đất (R_Earth = ${earthRadius}km). Tính vận tốc quỹ đạo (km/s)? (GM = ${GM} km³/s²)`;
            correctAnswer = velocity;
            break;
          case 'period':
            givenInfo = `Độ cao: ${altitude.toFixed(0)}km`;
            question = `Vệ tinh ở độ cao ${altitude.toFixed(0)}km (R_Earth = ${earthRadius}km, GM = ${GM} km³/s²). Tính chu kỳ quay (giây)?`;
            correctAnswer = period;
            break;
          case 'altitude':
            const givenVelocity = velocity;
            givenInfo = `Vận tốc: ${givenVelocity.toFixed(3)}km/s`;
            question = `Vệ tinh có vận tốc quỹ đạo ${givenVelocity.toFixed(3)}km/s (R_Earth = ${earthRadius}km, GM = ${GM} km³/s²). Tính độ cao so với mặt đất (km)?`;
            correctAnswer = altitude;
            break;
        }

        return {
          type: 'satellite',
          earthRadius,
          altitude,
          orbitRadius,
          velocity,
          period,
          GM,
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
    setQuestionType(challenge.questionType);
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
    const tolerance = 0.1; // 10% tolerance

    const isCorrect = Math.abs(answer - correct) / correct <= tolerance;

    if (isCorrect) {
      const level = levels[selectedLevel - 1];
      const basePoints = 100;
      const difficultyMultiplier = selectedLevel * 0.5;
      const points = Math.floor(basePoints * (1 + difficultyMultiplier));
      
      setScore(score + points);
      setResult({
        correct: true,
        message: `Chính xác! Đáp án: ${correct.toFixed(3)}`,
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
        message: `Sai rồi! Đáp án đúng: ${correct.toFixed(3)}`,
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
        setAnimationProgress(prev => Math.min(prev + 0.005, 1));
      });
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

      if (currentQuestion.type === 'uniform-circular') {
        drawUniformCircular(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'centripetal-force') {
        drawCentripetalForce(ctx, canvas, currentQuestion, animationProgress);
      } else if (currentQuestion.type === 'satellite') {
        drawSatellite(ctx, canvas, currentQuestion, animationProgress);
      }
    }
  }, [gameState, currentQuestion, animationProgress]);

  const drawUniformCircular = (ctx, canvas, question, progress) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const displayRadius = 100 + question.radius * 20;

    // Draw circular path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw center
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw rotating object
    const angle = progress * 2 * Math.PI * 5; // Multiple rotations
    const objX = centerX + displayRadius * Math.cos(angle);
    const objY = centerY + displayRadius * Math.sin(angle);

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(objX, objY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw velocity vector
    const velAngle = angle + Math.PI / 2;
    const velLength = 50;
    const velEndX = objX + velLength * Math.cos(velAngle);
    const velEndY = objY + velLength * Math.sin(velAngle);
    drawArrow(ctx, objX, objY, velEndX, velEndY, '#10b981', 3);

    // Draw radius line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`R = ${question.radius.toFixed(2)}m`, centerX + displayRadius / 2 * Math.cos(angle), centerY + displayRadius / 2 * Math.sin(angle) - 10);

    ctx.fillStyle = '#10b981';
    ctx.fillText(`v`, velEndX + 15 * Math.cos(velAngle), velEndY + 15 * Math.sin(velAngle));

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'CHUYỂN ĐỘNG TRÒN ĐỀU',
      `v = ωr = 2πr/T`,
      question.givenInfo
    ]);
  };

  const drawCentripetalForce = (ctx, canvas, question, progress) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const displayRadius = 100 + question.radius * 20;

    // Draw circular path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw center
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw rotating object
    const angle = progress * 2 * Math.PI * 3;
    const objX = centerX + displayRadius * Math.cos(angle);
    const objY = centerY + displayRadius * Math.sin(angle);

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(objX, objY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#6d28d9';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw centripetal force (pointing to center)
    const forceScale = Math.min(question.centripetalForce / 50, 3);
    const forceLength = 40 * forceScale;
    const forceAngle = Math.atan2(centerY - objY, centerX - objX);
    const forceEndX = objX + forceLength * Math.cos(forceAngle);
    const forceEndY = objY + forceLength * Math.sin(forceAngle);
    drawArrow(ctx, objX, objY, forceEndX, forceEndY, '#ef4444', 4);

    // Draw velocity vector
    const velAngle = angle + Math.PI / 2;
    const velLength = 50;
    const velEndX = objX + velLength * Math.cos(velAngle);
    const velEndY = objY + velLength * Math.sin(velAngle);
    drawArrow(ctx, objX, objY, velEndX, velEndY, '#10b981', 3);

    // Labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`F_ht`, forceEndX + 20 * Math.cos(forceAngle), forceEndY + 20 * Math.sin(forceAngle));

    ctx.fillStyle = '#10b981';
    ctx.fillText(`v`, velEndX + 15 * Math.cos(velAngle), velEndY + 15 * Math.sin(velAngle));

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'LỰC HƯỚNG TÂM',
      `F = mv²/r = mω²r`,
      question.givenInfo
    ]);
  };

  const drawSatellite = (ctx, canvas, question, progress) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const earthDisplayRadius = 60;
    const orbitDisplayRadius = earthDisplayRadius + 80 + (question.altitude / 400);

    // Draw Earth
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthDisplayRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Earth details
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(centerX - 15, centerY - 15, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 20, centerY + 10, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Draw orbit
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitDisplayRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw satellite
    const angle = progress * 2 * Math.PI * 2;
    const satX = centerX + orbitDisplayRadius * Math.cos(angle);
    const satY = centerY + orbitDisplayRadius * Math.sin(angle);

    // Satellite body
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(satX - 8, satY - 8, 16, 16);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(satX - 8, satY - 8, 16, 16);

    // Solar panels
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(satX - 20, satY - 4, 10, 8);
    ctx.fillRect(satX + 10, satY - 4, 10, 8);

    // Draw velocity vector
    const velAngle = angle + Math.PI / 2;
    const velLength = 50;
    const velEndX = satX + velLength * Math.cos(velAngle);
    const velEndY = satY + velLength * Math.sin(velAngle);
    drawArrow(ctx, satX, satY, velEndX, velEndY, '#10b981', 3);

    // Draw gravitational force (pointing to center)
    const gravAngle = Math.atan2(centerY - satY, centerX - satX);
    const gravLength = 40;
    const gravEndX = satX + gravLength * Math.cos(gravAngle);
    const gravEndY = satY + gravLength * Math.sin(gravAngle);
    drawArrow(ctx, satX, satY, gravEndX, gravEndY, '#ef4444', 3);

    // Labels
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Trái Đất', centerX, centerY + earthDisplayRadius + 20);

    ctx.fillStyle = '#10b981';
    ctx.fillText(`v`, velEndX + 15, velEndY);

    ctx.fillStyle = '#ef4444';
    ctx.fillText(`F_g`, gravEndX + 15, gravEndY);

    // Info box
    drawInfoBox(ctx, 10, 10, [
      'VỆ TINH',
      `v = √(GM/r)`,
      question.givenInfo,
      `R_Earth = ${question.earthRadius}km`
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
    const boxWidth = 250;
    const boxHeight = padding * 2 + lines.length * lineHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';

    lines.forEach((line, index) => {
      ctx.fillText(line, x + padding, y + padding + (index + 1) * lineHeight);
    });
  };

  return (
    <div className="rotation-dynamics">
      <header className="game-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <Home size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <span className="title-icon">🌀</span>
          Rotation Dynamics
        </h1>
      </header>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <div className="menu-icon">🌀</div>
            <h2>Rotation Dynamics</h2>
            <p className="menu-description">
              Khám phá chuyển động quay và lực hướng tâm trong vũ trụ!
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              <div className="theory-section">
                <div className="theory-item">
                  <h4>1. Chuyển động tròn đều</h4>
                  <p>Vận tốc dài: <strong>v = ωr = 2πr/T</strong></p>
                  <p>Vận tốc góc: <strong>ω = 2π/T = 2πf</strong></p>
                  <p>Chu kỳ T (s): thời gian quay một vòng</p>
                  <p>Tần số f (Hz): số vòng quay trong 1 giây</p>
                  <p>Gia tốc hướng tâm: <strong>a_ht = v²/r = ω²r</strong></p>
                </div>

                <div className="theory-item">
                  <h4>2. Lực hướng tâm</h4>
                  <p>Lực hướng tâm cần thiết để duy trì chuyển động tròn:</p>
                  <p><strong>F_ht = ma_ht = mv²/r = mω²r</strong></p>
                  <p>Lực hướng tâm luôn hướng vào tâm quỹ đạo</p>
                  <p>Ví dụ: Lực căng dây khi quay vật, lực ma sát ở khúc cua, lực hấp dẫn với vệ tinh</p>
                </div>

                <div className="theory-item">
                  <h4>3. Chuyển động vệ tinh</h4>
                  <p>Lực hấp dẫn đóng vai trò lực hướng tâm:</p>
                  <p><strong>GMm/r² = mv²/r</strong></p>
                  <p>Vận tốc vệ tinh: <strong>v = √(GM/r)</strong></p>
                  <p>Chu kỳ quay: <strong>T = 2πr/v = 2π√(r³/GM)</strong></p>
                  <p>Với G = 6.67×10⁻¹¹ Nm²/kg², M là khối lượng Trái Đất</p>
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
                    step="0.001"
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

export default RotationDynamics;
