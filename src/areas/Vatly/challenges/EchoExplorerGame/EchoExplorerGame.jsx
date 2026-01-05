import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mountain, Building, Trees, Volume2, Timer, Check } from 'lucide-react';
import './EchoExplorerGame.css';

const EchoExplorerGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('tutorial'); // tutorial, playing, finished
  const [currentLevel, setCurrentLevel] = useState(0);
  const [animationState, setAnimationState] = useState('idle'); // idle, shouting, echoing
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playerDistance, setPlayerDistance] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [score, setScore] = useState(0);

  const speedOfSound = 343; // m/s

  const levels = [
    {
      name: 'Hẻm Núi Vang Dội',
      icon: Mountain,
      distance: 100,
      background: 'cave',
      description: 'Ước tính khoảng cách đến vách núi đối diện.'
    },
    {
      name: 'Thành Phố Ồn Ào',
      icon: Building,
      distance: 50,
      background: 'city',
      description: 'Đo khoảng cách tới tòa nhà cao tầng.'
    },
    {
      name: 'Cánh Đồng Mở',
      icon: Trees,
      distance: Infinity, // No echo
      background: 'field',
      description: 'Ở đây có tiếng vang không nhỉ?'
    },
    {
      name: 'Hang Động Bí Ẩn',
      icon: Mountain,
      distance: 171.5,
      background: 'cave',
      description: 'Một hang động sâu hơn. Cẩn thận nhé!'
    },
  ];

  const level = levels[currentLevel];
  const echoTime = level.distance !== Infinity ? (level.distance * 2) / speedOfSound : Infinity;

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 0.01);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    drawScene();
  }, [gameState, currentLevel, animationState]);

  const drawScene = (wavePosition = 0, isEcho = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Background
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (level.background === 'cave') {
      gradient.addColorStop(0, '#3E3E3E');
      gradient.addColorStop(1, '#1E1E1E');
    } else if (level.background === 'city') {
      gradient.addColorStop(0, '#4A6E8A');
      gradient.addColorStop(1, '#2C3E50');
    } else {
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#4682B4');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Character
    const charX = 100;
    const charY = height - 70;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(charX, charY - 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(charX - 10, charY, 20, 40);

    // Obstacle
    if (level.distance !== Infinity) {
      const obstacleX = width - 100;
      ctx.fillStyle = level.background === 'cave' ? '#6B4F3A' : '#A9A9A9';
      ctx.fillRect(obstacleX, 0, 100, height);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(obstacleX, 0, 10, height);
    }

    // Wave
    if (animationState === 'shouting' || animationState === 'echoing') {
      const waveX = charX + wavePosition * (width - 200);
      ctx.strokeStyle = isEcho ? '#FF6347' : '#00BFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(waveX, charY - 20, 30, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
  };

  const startShout = () => {
    if (animationState !== 'idle') return;
    setAnimationState('shouting');
    setTimer(0);
    setTimerRunning(true);
    setResultMessage('');
    setPlayerDistance('');

    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const progress = elapsed / (echoTime / 2);

      if (progress >= 1) {
        drawScene(1, false);
        if (level.distance !== Infinity) {
          setAnimationState('echoing');
          startEcho();
        } else {
          setTimerRunning(false);
          setAnimationState('finished');
          setResultMessage('Không có tiếng vang ở không gian mở!');
        }
        return;
      }
      drawScene(progress, false);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const startEcho = () => {
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const progress = 1 - (elapsed / (echoTime / 2));

      if (progress <= 0) {
        drawScene(0, true);
        setAnimationState('finished');
        return;
      }
      drawScene(progress, true);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const stopTimer = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
  };

  const checkAnswer = () => {
    stopTimer();
    const calculatedDistance = (speedOfSound * timer) / 2;
    const actualDistance = level.distance;
    const difference = Math.abs(calculatedDistance - actualDistance);
    const tolerance = actualDistance * 0.15; // 15% tolerance

    if (level.distance === Infinity) {
        if (timer < 1) {
            setResultMessage('Chính xác! Ở đây không có tiếng vang.');
            setScore(s => s + 100);
        } else {
            setResultMessage('Hmm, bạn đã đo được thời gian, nhưng ở đây không có gì để âm thanh dội lại.');
        }
        return;
    }

    if (difference <= tolerance) {
      const points = Math.max(10, 100 - Math.floor(difference * 10));
      setResultMessage(`🎉 Tuyệt vời! Khoảng cách thực tế là ${actualDistance.toFixed(1)}m. Bạn đã tính được ${calculatedDistance.toFixed(1)}m. +${points} điểm.`);
      setScore(s => s + points);
    } else {
      setResultMessage(`Chưa chính xác. Khoảng cách thực tế là ${actualDistance.toFixed(1)}m, bạn tính được ${calculatedDistance.toFixed(1)}m. Hãy thử lại!`);
    }
    setAnimationState('idle');
  };
  
  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(c => c + 1);
      setAnimationState('idle');
      setResultMessage('');
      setPlayerDistance('');
      setTimer(0);
    } else {
      setGameState('finished');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(0);
    setScore(0);
    setAnimationState('idle');
    setResultMessage('');
    setPlayerDistance('');
    setTimer(0);
  }

  const renderTutorial = () => (
    <div className="ee-tutorial-overlay">
      <div className="ee-tutorial-content">
        <Mountain size={60} className="ee-tutorial-icon" />
        <h2>Khám Phá Tiếng Vang</h2>
        <div className="ee-tutorial-text">
          <p><strong>Mục tiêu:</strong> Dùng tiếng vang để đo khoảng cách.</p>
          <h3>Hướng dẫn:</h3>
          <ul>
            <li>1. Nhấn <strong>"Hét Lên"</strong> để tạo ra âm thanh.</li>
            <li>2. Đồng hồ sẽ bắt đầu chạy.</li>
            <li>3. Khi sóng âm dội lại (màu cam), nhấn <strong>"Dừng Đồng Hồ"</strong>.</li>
            <li>4. Dùng công thức: <strong>Khoảng cách = (343 * Thời gian) / 2</strong> để tính.</li>
            <li>5. Nhập kết quả và nhấn <strong>"Kiểm Tra"</strong>.</li>
          </ul>
        </div>
        <button onClick={startGame} className="ee-start-button">Bắt đầu</button>
      </div>
    </div>
  );
  
  const renderGameFinished = () => (
    <div className="ee-tutorial-overlay">
        <div className="ee-tutorial-content">
            <h2>Hoàn Thành!</h2>
            <p className="ee-final-score">Tổng điểm: {score}</p>
            <div className="ee-game-over-buttons">
                <button onClick={startGame} className="ee-retry-button">Chơi Lại</button>
                <button onClick={() => navigate('/physics-games/grade/7')} className="ee-menu-button">Về Menu</button>
            </div>
        </div>
    </div>
  );

  if (gameState === 'tutorial') return renderTutorial();
  if (gameState === 'finished') return renderGameFinished();

  return (
    <div className="echo-explorer-game">
      <div className="ee-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="ee-back-button">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="ee-score">Điểm: {score}</div>
      </div>
      <div className="ee-main">
        <div className="ee-level-info">
          <h2>Cấp {currentLevel + 1}: {level.name}</h2>
          <p>{level.description}</p>
        </div>
        <div className="ee-simulation">
          <canvas ref={canvasRef} width="800" height="300" />
          <div className="ee-timer-display">
            <Timer size={24} />
            <span>{timer.toFixed(2)}s</span>
          </div>
        </div>
        <div className="ee-controls">
          <button onClick={startShout} disabled={animationState !== 'idle'} className="ee-shout-button">
            <Volume2 /> Hét Lên
          </button>
          <button onClick={stopTimer} disabled={!timerRunning} className="ee-stop-button">
            <Timer /> Dừng Đồng Hồ
          </button>
        </div>
        <div className="ee-calculation">
          <p className="ee-formula">Khoảng cách = (343 m/s × {timer.toFixed(2)}s) / 2 = <strong>{((speedOfSound * timer) / 2).toFixed(1)} m</strong></p>
          <div className="ee-answer-box">
            <input 
              type="number"
              value={playerDistance}
              onChange={e => setPlayerDistance(e.target.value)}
              placeholder="Nhập khoảng cách bạn tính được"
              disabled={timerRunning}
            />
            <button onClick={checkAnswer} disabled={timerRunning || animationState === 'shouting'}>
              <Check /> Kiểm Tra
            </button>
          </div>
        </div>
        {resultMessage && <div className="ee-result-message">{resultMessage}</div>}
        {(animationState === 'idle' && resultMessage) && (
          <button onClick={nextLevel} className="ee-next-level-button">
            {currentLevel < levels.length - 1 ? 'Cấp Tiếp Theo' : 'Hoàn Thành'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EchoExplorerGame;
