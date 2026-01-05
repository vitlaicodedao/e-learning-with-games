import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Music, Trophy } from 'lucide-react';
import './WaveFrequencyGame.css';

const WaveFrequencyGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [gameState, setGameState] = useState('tutorial');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(50);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [message, setMessage] = useState('');

  const levels = [
    {
      level: 1,
      name: 'Tìm Nốt Nhạc Cơ Bản',
      description: 'Điều chỉnh tần số để tạo nốt La (A) - 440 Hz',
      targetFrequency: 440,
      targetAmplitude: null,
      tolerance: 10,
      hint: 'Tần số càng cao, âm thanh càng cao'
    },
    {
      level: 2,
      name: 'Âm Thanh Cao',
      description: 'Tạo nốt Đô cao (High C) - 523 Hz',
      targetFrequency: 523,
      targetAmplitude: null,
      tolerance: 15,
      hint: 'Tăng tần số để tạo âm cao hơn'
    },
    {
      level: 3,
      name: 'Kiểm Soát Âm Lượng',
      description: 'Tạo âm 440 Hz với biên độ 80%',
      targetFrequency: 440,
      targetAmplitude: 80,
      tolerance: 10,
      hint: 'Biên độ quyết định độ to của âm thanh'
    },
    {
      level: 4,
      name: 'Âm Trầm',
      description: 'Tạo nốt Đô thấp (Low C) - 262 Hz với biên độ 60%',
      targetFrequency: 262,
      targetAmplitude: 60,
      tolerance: 10,
      hint: 'Giảm tần số để có âm trầm hơn'
    },
    {
      level: 5,
      name: 'Bậc Thầy Sóng Âm',
      description: 'Tạo nốt Mi (E) - 330 Hz với biên độ chính xác 75%',
      targetFrequency: 330,
      targetAmplitude: 75,
      tolerance: 5,
      hint: 'Cần độ chính xác cao cho cả tần số và biên độ'
    }
  ];

  useEffect(() => {
    if (gameState === 'playing') {
      drawWave();
    }
  }, [frequency, amplitude, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameState === 'playing') {
      const animationFrame = requestAnimationFrame(animateWave);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [gameState, frequency, amplitude]);

  let phase = 0;
  const animateWave = () => {
    phase += 0.05;
    drawWave();
    if (gameState === 'playing') {
      requestAnimationFrame(animateWave);
    }
  };

  const drawWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (height / 10) * i);
      ctx.lineTo(width, (height / 10) * i);
      ctx.stroke();
    }
    
    // Draw wave
    const level = levels[currentLevel - 1];
    const wavelength = width / (frequency / 100);
    const amplitudePixels = (amplitude / 100) * (height / 2 - 20);
    
    ctx.beginPath();
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00bcd4';
    
    for (let x = 0; x < width; x++) {
      const y = height / 2 + Math.sin((x / wavelength) * 2 * Math.PI + phase) * amplitudePixels;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw target line if needed
    if (level.targetAmplitude !== null) {
      const targetPixels = (level.targetAmplitude / 100) * (height / 2 - 20);
      ctx.strokeStyle = 'rgba(255, 235, 59, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2 - targetPixels);
      ctx.lineTo(width, height / 2 - targetPixels);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, height / 2 + targetPixels);
      ctx.lineTo(width, height / 2 + targetPixels);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw frequency indicator
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${frequency} Hz`, 20, 30);
    ctx.font = '16px Arial';
    ctx.fillText(`Biên độ: ${amplitude}%`, 20, 55);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setScore(0);
    setAttempts(3);
    setFrequency(440);
    setAmplitude(50);
    setMessage('');
  };

  const checkAnswer = () => {
    const level = levels[currentLevel - 1];
    const freqDiff = Math.abs(frequency - level.targetFrequency);
    const freqMatch = freqDiff <= level.tolerance;
    
    let ampMatch = true;
    if (level.targetAmplitude !== null) {
      const ampDiff = Math.abs(amplitude - level.targetAmplitude);
      ampMatch = ampDiff <= level.tolerance;
    }
    
    if (freqMatch && ampMatch) {
      // Success
      const bonus = Math.max(0, (3 - attempts) * 50);
      const levelScore = 200 + bonus;
      setScore(prev => prev + levelScore);
      setMessage(`🎉 Chính xác! +${levelScore} điểm`);
      
      setTimeout(() => {
        if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
          setAttempts(3);
          setFrequency(440);
          setAmplitude(50);
          setMessage('');
        } else {
          setGameState('victory');
        }
      }, 1500);
    } else {
      setAttempts(prev => prev - 1);
      
      if (attempts <= 1) {
        setGameState('gameover');
        return;
      }
      
      // Give hints
      let hint = '';
      if (!freqMatch) {
        if (frequency < level.targetFrequency) {
          hint = 'Tần số quá thấp! Tăng lên';
        } else {
          hint = 'Tần số quá cao! Giảm xuống';
        }
      }
      if (!ampMatch) {
        if (amplitude < level.targetAmplitude) {
          hint += (hint ? ' và ' : '') + 'Biên độ quá nhỏ!';
        } else {
          hint += (hint ? ' và ' : '') + 'Biên độ quá lớn!';
        }
      }
      setMessage(`❌ ${hint} (Còn ${attempts - 1} lượt)`);
    }
  };

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = amplitude / 200;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const resetLevel = () => {
    setFrequency(440);
    setAmplitude(50);
    setMessage('');
  };

  if (gameState === 'tutorial') {
    return (
      <div className="wave-frequency-game">
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <Music size={60} className="tutorial-icon" />
            <h2>Trò Chơi Tần Số Sóng Âm</h2>
            <div className="tutorial-text">
              <p><strong>Mục tiêu:</strong> Điều chỉnh tần số và biên độ để tạo ra các nốt nhạc chính xác</p>
              <h3>Hướng dẫn:</h3>
              <ul>
                <li>🎵 Kéo thanh trượt <strong>Tần số</strong> để thay đổi cao độ âm thanh</li>
                <li>📊 Kéo thanh trượt <strong>Biên độ</strong> để thay đổi độ to</li>
                <li>🔊 Nhấn nút <strong>Nghe Thử</strong> để nghe âm thanh</li>
                <li>✅ Nhấn <strong>Kiểm Tra</strong> khi đã điều chỉnh xong</li>
                <li>⭐ Mỗi cấp độ có 3 lượt thử</li>
              </ul>
              <div className="physics-note">
                <p><strong>Kiến thức vật lý:</strong></p>
                <p>• Tần số (Hz) = số dao động trong 1 giây → quyết định cao độ</p>
                <p>• Biên độ → quyết định cường độ âm (độ to)</p>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              Bắt Đầu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="wave-frequency-game">
        <div className="game-over-overlay">
          <div className="game-over-content victory">
            <Trophy size={80} />
            <h2>Xuất Sắc!</h2>
            <div className="final-score">
              {score} điểm
            </div>
            <p>Bạn đã làm chủ các sóng âm!</p>
            <div className="game-over-buttons">
              <button onClick={startGame} className="retry-button">
                Chơi Lại
              </button>
              <button onClick={() => navigate('/physics-games/grade/7')} className="menu-button">
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="wave-frequency-game">
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Hết Lượt Thử</h2>
            <div className="final-score">
              {score} điểm
            </div>
            <p>Đạt được cấp độ {currentLevel}</p>
            <div className="game-over-buttons">
              <button onClick={startGame} className="retry-button">
                Thử Lại
              </button>
              <button onClick={() => navigate('/physics-games/grade/7')} className="menu-button">
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel - 1];

  return (
    <div className="wave-frequency-game">
      <div className="game-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <div className="game-info">
          <span className="level-badge">Cấp {currentLevel}/{levels.length}</span>
          <span className="score-display">⭐ {score}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="level-info">
          <h2>{level.name}</h2>
          <p className="level-description">{level.description}</p>
          <div className="attempts-display">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`attempt-dot ${i < attempts ? 'active' : 'used'}`} />
            ))}
          </div>
        </div>

        <div className="canvas-container">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={300}
            className="wave-canvas"
          />
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <label>
              Tần số: {frequency} Hz
              <input
                type="range"
                min="100"
                max="1000"
                step="5"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="frequency-slider"
              />
            </label>
          </div>

          <div className="control-group">
            <label>
              Biên độ: {amplitude}%
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="amplitude-slider"
              />
            </label>
          </div>

          <div className="action-buttons">
            <button onClick={playSound} className="sound-button">
              <Volume2 size={20} />
              Nghe Thử
            </button>
            <button onClick={resetLevel} className="reset-button">
              Đặt Lại
            </button>
            <button onClick={checkAnswer} className="check-button">
              Kiểm Tra
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="hint-box">
            <strong>💡 Gợi ý:</strong> {level.hint}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveFrequencyGame;
