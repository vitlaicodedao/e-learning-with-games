import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Volume2, Pause } from 'lucide-react';
import './SoundWaveExplorer.css';

/**
 * Sound Wave Explorer - Grade 11 Chapter 2: Waves and Sound
 * Frequency vs pitch, intensity vs loudness, Doppler effect
 */

const SoundWaveExplorer = () => {
  const canvasRef = useRef(null);
  const waveformRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState('frequency'); // frequency, intensity, doppler, game
  
  // Sound parameters
  const [frequency, setFrequency] = useState(440); // Hz
  const [intensity, setIntensity] = useState(50); // dB
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Doppler effect
  const [sourceVelocity, setSourceVelocity] = useState(0); // m/s
  const [sourcePosition, setSourcePosition] = useState(200);
  const [soundSpeed, setSoundSpeed] = useState(340); // m/s
  const [time, setTime] = useState(0);
  
  // Game mode
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [round, setRound] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0
  });

  const musicalNotes = [
    { note: 'C4', frequency: 261.63 },
    { note: 'D4', frequency: 293.66 },
    { note: 'E4', frequency: 329.63 },
    { note: 'F4', frequency: 349.23 },
    { note: 'G4', frequency: 392.00 },
    { note: 'A4', frequency: 440.00 },
    { note: 'B4', frequency: 493.88 },
    { note: 'C5', frequency: 523.25 }
  ];

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    if (mode === 'doppler' && gameState === 'playing') {
      const animate = () => {
        setTime(t => t + 0.05);
        const newPos = 200 + sourceVelocity * time * 5;
        if (newPos > 0 && newPos < 800) {
          setSourcePosition(newPos);
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [mode, gameState, time, sourceVelocity]);

  useEffect(() => {
    if (gameState === 'playing') {
      drawWaveform();
      if (mode === 'doppler') {
        drawDoppler();
      }
    }
  }, [gameState, frequency, intensity, mode, sourcePosition, sourceVelocity]);

  const startSound = () => {
    stopSound();
    
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();
    
    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    const volume = Math.pow(10, (intensity - 100) / 20);
    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    
    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);
    
    oscillatorRef.current.start();
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  const updateSound = () => {
    if (oscillatorRef.current && audioContextRef.current) {
      let effectiveFreq = frequency;
      
      // Apply Doppler effect if in doppler mode
      if (mode === 'doppler') {
        const observerAtCenter = 400;
        if (sourcePosition !== observerAtCenter) {
          const approaching = sourcePosition < observerAtCenter;
          const velocitySign = approaching ? sourceVelocity : -sourceVelocity;
          effectiveFreq = frequency * soundSpeed / (soundSpeed - velocitySign);
        }
      }
      
      oscillatorRef.current.frequency.setValueAtTime(
        effectiveFreq, 
        audioContextRef.current.currentTime
      );
      
      const volume = Math.pow(10, (intensity - 100) / 20);
      gainNodeRef.current.gain.setValueAtTime(
        volume, 
        audioContextRef.current.currentTime
      );
    }
  };

  useEffect(() => {
    if (isPlaying) {
      updateSound();
    }
  }, [frequency, intensity, sourcePosition, sourceVelocity, mode]);

  const drawWaveform = () => {
    const canvas = waveformRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const amplitude = (intensity / 100) * (height / 3);
    const wavelength = width / (frequency / 100);
    
    for (let x = 0; x < width; x++) {
      const y = height / 2 + amplitude * Math.sin(2 * Math.PI * x / wavelength);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`f = ${frequency.toFixed(1)} Hz`, 10, 20);
    ctx.fillText(`I = ${intensity.toFixed(0)} dB`, 10, 40);
    ctx.fillText(`λ ≈ ${(soundSpeed / frequency).toFixed(2)} m`, 10, 60);
  };

  const drawDoppler = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw observer at center
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(400, height / 2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Observer', 360, height / 2 + 35);
    
    // Draw moving source
    ctx.fillStyle = sourceVelocity > 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(sourcePosition, height / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw velocity arrow
    if (Math.abs(sourceVelocity) > 0) {
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const arrowLen = 50;
      const arrowX = sourcePosition + (sourceVelocity > 0 ? arrowLen : -arrowLen);
      ctx.moveTo(sourcePosition, height / 2 - 30);
      ctx.lineTo(arrowX, height / 2 - 30);
      // Arrow head
      const headLen = 10;
      const angle = sourceVelocity > 0 ? 0 : Math.PI;
      ctx.lineTo(arrowX - headLen * Math.cos(angle - Math.PI / 6), height / 2 - 30 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(arrowX, height / 2 - 30);
      ctx.lineTo(arrowX - headLen * Math.cos(angle + Math.PI / 6), height / 2 - 30 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(`v = ${sourceVelocity} m/s`, sourcePosition - 30, height / 2 - 45);
    }
    
    // Draw wave circles (compressed in front, expanded behind)
    const wavelength = soundSpeed / frequency;
    const numWaves = 10;
    
    for (let i = 0; i < numWaves; i++) {
      const baseRadius = i * wavelength * 2;
      
      // Waves moving left (towards observer if source on right)
      if (sourcePosition > 400) {
        const dopplerFactor = 1 - (sourceVelocity / soundSpeed);
        const radius = baseRadius * dopplerFactor;
        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - i / numWaves})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sourcePosition, height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const dopplerFactor = 1 + (sourceVelocity / soundSpeed);
        const radius = baseRadius * dopplerFactor;
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - i / numWaves})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sourcePosition, height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Calculate and display observed frequency
    const observedFreq = frequency * soundSpeed / (soundSpeed - (sourcePosition < 400 ? sourceVelocity : -sourceVelocity));
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`f₀ = ${frequency.toFixed(1)} Hz (Source)`, 10, 30);
    ctx.fillText(`f' = ${observedFreq.toFixed(1)} Hz (Observed)`, 10, 55);
    ctx.fillText(`Δf = ${(observedFreq - frequency).toFixed(1)} Hz`, 10, 80);
  };

  const generateChallenge = () => {
    const challengeTypes = [
      {
        type: 'identify-note',
        setup: () => {
          const note = musicalNotes[Math.floor(Math.random() * musicalNotes.length)];
          setFrequency(note.frequency);
          return {
            question: `Phát âm thanh này. Đây là nốt nhạc nào?`,
            answer: note.note,
            options: musicalNotes.map(n => n.note)
          };
        }
      },
      {
        type: 'frequency-range',
        setup: () => {
          const ranges = [
            { name: 'Hạ âm', min: 100, max: 300 },
            { name: 'Trung âm', min: 300, max: 1000 },
            { name: 'Cao âm', min: 1000, max: 2000 }
          ];
          const range = ranges[Math.floor(Math.random() * ranges.length)];
          const freq = range.min + Math.random() * (range.max - range.min);
          setFrequency(freq);
          return {
            question: `Âm thanh này thuộc vùng tần số nào?`,
            answer: range.name,
            options: ranges.map(r => r.name)
          };
        }
      },
      {
        type: 'doppler-effect',
        setup: () => {
          const velocity = 20 + Math.random() * 60;
          setSourceVelocity(velocity);
          const f0 = 500;
          setFrequency(f0);
          const observed = f0 * soundSpeed / (soundSpeed - velocity);
          return {
            question: `Nguồn âm f=${f0.toFixed(0)}Hz chuyển động lại gần với v=${velocity.toFixed(0)}m/s. Tần số quan sát là?`,
            answer: observed.toFixed(0),
            tolerance: 20,
            type: 'number',
            unit: 'Hz'
          };
        }
      }
    ];
    
    const challenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    const challengeData = challenge.setup();
    setCurrentChallenge(challengeData);
    setUserAnswer('');
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;
    
    let correct = false;
    
    if (currentChallenge.type === 'number') {
      const userNum = parseFloat(userAnswer);
      const correctNum = parseFloat(currentChallenge.answer);
      correct = Math.abs(userNum - correctNum) <= currentChallenge.tolerance;
    } else {
      correct = userAnswer === currentChallenge.answer;
    }
    
    if (correct) {
      setScore(s => s + 100);
      setStats(prev => ({
        correctAnswers: prev.correctAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        accuracy: ((prev.correctAnswers + 1) / (prev.totalQuestions + 1) * 100).toFixed(1)
      }));
      alert('Chính xác! +100 điểm');
    } else {
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        accuracy: (prev.correctAnswers / (prev.totalQuestions + 1) * 100).toFixed(1)
      }));
      alert(`Sai rồi! Đáp án: ${currentChallenge.answer}`);
    }
    
    setRound(r => r + 1);
    if (round < 9) {
      generateChallenge();
    } else {
      setGameState('result');
    }
  };

  const startGame = (isGame = false) => {
    setGameState('playing');
    setGameMode(isGame);
    setScore(0);
    setRound(0);
    setTime(0);
    setSourcePosition(200);
    if (isGame) {
      generateChallenge();
    }
  };

  const resetGame = () => {
    stopSound();
    setGameState('menu');
    setGameMode(false);
    setMode('frequency');
    setFrequency(440);
    setIntensity(50);
    setSourceVelocity(0);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  // Menu
  if (gameState === 'menu') {
    return (
      <div className="sound-explorer-container">
        <div className="sound-menu">
          <div className="sound-menu-content">
            <div className="sound-title">
              <Volume2 className="sound-title-icon" />
              <h1>Sound Wave Explorer</h1>
            </div>
            <p className="sound-description">
              Khám phá sóng âm: Tần số và cao độ, cường độ và độ to, hiệu ứng Doppler,
              và nhận diện nốt nhạc. Học thông qua tương tác và trò chơi!
            </p>
            
            <div className="sound-stats">
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.correctAnswers}</div>
                  <div className="stat-label">Trả lời đúng</div>
                </div>
              </div>
              <div className="stat-item">
                <Volume2 className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.totalQuestions}</div>
                  <div className="stat-label">Tổng câu hỏi</div>
                </div>
              </div>
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.accuracy}%</div>
                  <div className="stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>

            <div className="sound-menu-buttons">
              <button className="sound-btn sound-btn-primary" onClick={() => startGame(false)}>
                <Play size={20} />
                Chế độ khám phá
              </button>
              <button className="sound-btn sound-btn-secondary" onClick={() => startGame(true)}>
                <Trophy size={20} />
                Trò chơi nhận diện
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (gameState === 'result') {
    return (
      <div className="sound-explorer-container">
        <div className="sound-menu">
          <div className="sound-menu-content">
            <div className="sound-title">
              <Trophy className="sound-title-icon" />
              <h1>Kết quả</h1>
            </div>
            <div className="result-score">
              <div className="result-value">{score}</div>
              <div className="result-label">Tổng điểm</div>
            </div>
            <div className="sound-menu-buttons">
              <button className="sound-btn sound-btn-primary" onClick={() => startGame(true)}>
                <RotateCw size={20} />
                Chơi lại
              </button>
              <button className="sound-btn sound-btn-secondary" onClick={resetGame}>
                <Home size={20} />
                Về menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="sound-explorer-container">
      <div className="sound-game">
        <div className="sound-header">
          <div className="sound-header-left">
            <button className="sound-icon-btn" onClick={resetGame}>
              <Home size={24} />
            </button>
            <h2>Sound Wave Explorer</h2>
          </div>
          <div className="sound-header-right">
            {gameMode && (
              <div className="sound-score">
                Điểm: {score} | Câu: {round + 1}/10
              </div>
            )}
            <button 
              className={`sound-icon-btn ${isPlaying ? 'playing' : ''}`}
              onClick={toggleSound}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>

        <div className="sound-content">
          <div className="sound-canvas-container">
            <canvas
              ref={waveformRef}
              width={800}
              height={200}
              className="sound-canvas"
            />
            {mode === 'doppler' && (
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="sound-canvas"
                style={{ marginTop: '1rem' }}
              />
            )}
          </div>

          <div className="sound-controls">
            {!gameMode && (
              <div className="control-section">
                <h3>Chế độ</h3>
                <div className="mode-buttons">
                  <button 
                    className={`mode-btn ${mode === 'frequency' ? 'active' : ''}`}
                    onClick={() => setMode('frequency')}
                  >
                    Tần số
                  </button>
                  <button 
                    className={`mode-btn ${mode === 'intensity' ? 'active' : ''}`}
                    onClick={() => setMode('intensity')}
                  >
                    Cường độ
                  </button>
                  <button 
                    className={`mode-btn ${mode === 'doppler' ? 'active' : ''}`}
                    onClick={() => setMode('doppler')}
                  >
                    Doppler
                  </button>
                </div>
              </div>
            )}

            {mode === 'frequency' && !gameMode && (
              <div className="control-section">
                <h3>Tần số (Pitch)</h3>
                <div className="control-group">
                  <label>
                    Tần số: {frequency.toFixed(1)} Hz
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="10"
                      value={frequency}
                      onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="notes-grid">
                  {musicalNotes.map((note) => (
                    <button
                      key={note.note}
                      className="note-btn"
                      onClick={() => setFrequency(note.frequency)}
                    >
                      {note.note}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'intensity' && !gameMode && (
              <div className="control-section">
                <h3>Cường độ (Loudness)</h3>
                <div className="control-group">
                  <label>
                    Cường độ: {intensity.toFixed(0)} dB
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={intensity}
                      onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="sound-info-box">
                  <p><strong>20-30 dB:</strong> Thì thầm</p>
                  <p><strong>40-60 dB:</strong> Nói chuyện bình thường</p>
                  <p><strong>70-90 dB:</strong> Ồn ào</p>
                  <p><strong>90-100 dB:</strong> Rất ồn (có hại)</p>
                </div>
              </div>
            )}

            {mode === 'doppler' && !gameMode && (
              <div className="control-section">
                <h3>Hiệu ứng Doppler</h3>
                <div className="control-group">
                  <label>
                    Tần số nguồn: {frequency.toFixed(1)} Hz
                    <input
                      type="range"
                      min="200"
                      max="1000"
                      step="50"
                      value={frequency}
                      onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Vận tốc nguồn: {sourceVelocity.toFixed(0)} m/s
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="5"
                      value={sourceVelocity}
                      onChange={(e) => setSourceVelocity(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="sound-info-box">
                  <p><strong>Công thức:</strong> f' = f₀ × v/(v - vₛ)</p>
                  <p><strong>v:</strong> Tốc độ âm thanh (340 m/s)</p>
                  <p><strong>vₛ:</strong> Vận tốc nguồn</p>
                  <p>Nguồn lại gần: tần số tăng (xanh→đỏ)</p>
                  <p>Nguồn ra xa: tần số giảm</p>
                </div>
              </div>
            )}

            {gameMode && currentChallenge && (
              <div className="control-section challenge-section">
                <h3>Thử thách {round + 1}/10</h3>
                <p className="challenge-question">{currentChallenge.question}</p>
                
                {currentChallenge.type === 'number' ? (
                  <div className="challenge-input-group">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Nhập câu trả lời"
                      className="challenge-input"
                    />
                    <span className="challenge-unit">{currentChallenge.unit}</span>
                  </div>
                ) : (
                  <select
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="challenge-select"
                  >
                    <option value="">Chọn đáp án</option>
                    {currentChallenge.options.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                
                <button
                  className="sound-btn sound-btn-primary"
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                >
                  Kiểm tra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundWaveExplorer;
