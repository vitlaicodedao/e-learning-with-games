import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Waves, Pause } from 'lucide-react';
import './WaveInterferenceStudio.css';

/**
 * Wave Interference Studio - Grade 11 Chapter 2: Waves and Sound
 * Interactive 2-source wave interference with ripple tank simulation
 */

const WaveInterferenceStudio = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Wave parameters
  const [sourceSeparation, setSourceSeparation] = useState(5);
  const [wavelength, setWavelength] = useState(30);
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(20);
  const [showStanding, setShowStanding] = useState(false);
  
  // Animation
  const [time, setTime] = useState(0);
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Challenge mode
  const [challengeMode, setChallengeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [challengeQuestion, setChallengeQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    correctPredictions: 0,
    totalAttempts: 0,
    accuracy: 0
  });

  // Sources position
  const source1 = { x: 400 - sourceSeparation * 5, y: 300 };
  const source2 = { x: 400 + sourceSeparation * 5, y: 300 };

  useEffect(() => {
    if (gameState === 'playing' && isPlaying) {
      const animate = () => {
        setTime(t => t + 0.05 * timeSpeed);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [gameState, isPlaying, timeSpeed]);

  useEffect(() => {
    if (gameState === 'playing') {
      drawWaves();
    }
  }, [gameState, time, sourceSeparation, wavelength, amplitude, showStanding]);

  const drawWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Create image data for interference pattern
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const k = (2 * Math.PI) / wavelength; // wave number
    const omega = 2 * Math.PI * frequency;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx1 = x - source1.x;
        const dy1 = y - source1.y;
        const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        
        const dx2 = x - source2.x;
        const dy2 = y - source2.y;
        const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        let wave1, wave2;
        
        if (showStanding) {
          // Standing wave pattern
          wave1 = amplitude * Math.cos(k * r1) * Math.cos(omega * time);
          wave2 = amplitude * Math.cos(k * r2) * Math.cos(omega * time);
        } else {
          // Traveling wave pattern
          wave1 = amplitude * Math.cos(k * r1 - omega * time);
          wave2 = amplitude * Math.cos(k * r2 - omega * time);
        }
        
        const interference = wave1 + wave2;
        
        // Map interference to color
        const normalized = (interference / (2 * amplitude) + 1) / 2;
        const intensity = Math.floor(normalized * 255);
        
        const idx = (y * width + x) * 4;
        
        if (intensity > 200) {
          // Bright areas (constructive)
          data[idx] = 100 + intensity / 2;
          data[idx + 1] = 150 + intensity / 3;
          data[idx + 2] = 255;
        } else if (intensity < 50) {
          // Dark areas (destructive)
          data[idx] = intensity / 2;
          data[idx + 1] = intensity / 3;
          data[idx + 2] = intensity;
        } else {
          // Mid areas
          data[idx] = intensity / 2;
          data[idx + 1] = intensity;
          data[idx + 2] = 150 + intensity / 2;
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw sources
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(source1.x, source1.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(source2.x, source2.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw nodal and antinodal lines indicators
    if (showStanding) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      const d = sourceSeparation * 10;
      const numLines = Math.floor(d / wavelength);
      
      for (let n = -numLines; n <= numLines; n++) {
        const pathDiff = n * wavelength;
        // This is simplified - real nodal lines are hyperbolas
        if (Math.abs(pathDiff) < d) {
          ctx.beginPath();
          ctx.moveTo(400, 100);
          ctx.lineTo(400 + pathDiff * 2, 500);
          ctx.stroke();
        }
      }
    }
  };

  const generateChallenge = () => {
    const d = sourceSeparation * 10;
    const maxima = Math.floor(d / wavelength);
    const questions = [
      {
        question: `Với khoảng cách nguồn d=${d.toFixed(0)}px và bước sóng λ=${wavelength}px, có bao nhiêu cực đại giao thoa?`,
        answer: maxima,
        tolerance: 1,
        unit: 'cực đại',
        type: 'number'
      },
      {
        question: `Khoảng cách giữa 2 cực đại liên tiếp là bao nhiêu?`,
        answer: wavelength,
        tolerance: 2,
        unit: 'px',
        type: 'number'
      },
      {
        question: `Nếu tăng tần số lên gấp đôi, bước sóng sẽ thay đổi như thế nào?`,
        answer: 'giảm một nửa',
        type: 'text',
        options: ['tăng gấp đôi', 'giảm một nửa', 'không đổi', 'tăng gấp 4']
      }
    ];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    setChallengeQuestion(question);
  };

  const checkAnswer = () => {
    if (!challengeQuestion) return;
    
    setAttempts(a => a + 1);
    
    if (challengeQuestion.type === 'number') {
      const userNum = parseFloat(userAnswer);
      const correct = Math.abs(userNum - challengeQuestion.answer) <= challengeQuestion.tolerance;
      
      if (correct) {
        setScore(s => s + 100);
        setStats(prev => ({
          correctPredictions: prev.correctPredictions + 1,
          totalAttempts: prev.totalAttempts + 1,
          accuracy: ((prev.correctPredictions + 1) / (prev.totalAttempts + 1) * 100).toFixed(1)
        }));
        alert('Chính xác! +100 điểm');
        generateChallenge();
      } else {
        alert(`Sai rồi! Đáp án đúng: ${challengeQuestion.answer} ${challengeQuestion.unit}`);
        setStats(prev => ({
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          accuracy: (prev.correctPredictions / (prev.totalAttempts + 1) * 100).toFixed(1)
        }));
      }
    } else {
      const correct = userAnswer.toLowerCase() === challengeQuestion.answer.toLowerCase();
      if (correct) {
        setScore(s => s + 100);
        setStats(prev => ({
          correctPredictions: prev.correctPredictions + 1,
          totalAttempts: prev.totalAttempts + 1,
          accuracy: ((prev.correctPredictions + 1) / (prev.totalAttempts + 1) * 100).toFixed(1)
        }));
        alert('Chính xác! +100 điểm');
        generateChallenge();
      } else {
        alert(`Sai rồi! Đáp án đúng: ${challengeQuestion.answer}`);
        setStats(prev => ({
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          accuracy: (prev.correctPredictions / (prev.totalAttempts + 1) * 100).toFixed(1)
        }));
      }
    }
    setUserAnswer('');
  };

  const startGame = (challenge = false) => {
    setGameState('playing');
    setChallengeMode(challenge);
    setIsPlaying(true);
    setTime(0);
    setScore(0);
    setAttempts(0);
    if (challenge) {
      generateChallenge();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setIsPlaying(false);
    setTime(0);
    setScore(0);
    setAttempts(0);
    setChallengeMode(false);
    setChallengeQuestion(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="wave-interference-container">
        <div className="wave-menu">
          <div className="wave-menu-content">
            <div className="wave-title">
              <Waves className="wave-title-icon" />
              <h1>Wave Interference Studio</h1>
            </div>
            <p className="wave-description">
              Mô phỏng giao thoa sóng từ 2 nguồn kết hợp - Quan sát các vân giao thoa, 
              cực đại và cực tiểu, sóng dừng với nút và bụng sóng.
            </p>
            
            <div className="wave-stats">
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.correctPredictions}</div>
                  <div className="stat-label">Dự đoán đúng</div>
                </div>
              </div>
              <div className="stat-item">
                <Waves className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.totalAttempts}</div>
                  <div className="stat-label">Tổng lần thử</div>
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

            <div className="wave-menu-buttons">
              <button className="wave-btn wave-btn-primary" onClick={() => startGame(false)}>
                <Play size={20} />
                Chế độ tự do
              </button>
              <button className="wave-btn wave-btn-secondary" onClick={() => startGame(true)}>
                <Trophy size={20} />
                Chế độ thử thách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game
  return (
    <div className="wave-interference-container">
      <div className="wave-game">
        <div className="wave-header">
          <div className="wave-header-left">
            <button className="wave-icon-btn" onClick={resetGame}>
              <Home size={24} />
            </button>
            <h2>Wave Interference Studio</h2>
          </div>
          <div className="wave-header-right">
            {challengeMode && (
              <div className="wave-score">
                Điểm: {score} | Lần thử: {attempts}
              </div>
            )}
            <button className="wave-icon-btn" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="wave-icon-btn" onClick={() => setTime(0)}>
              <RotateCw size={24} />
            </button>
          </div>
        </div>

        <div className="wave-content">
          <div className="wave-canvas-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="wave-canvas"
            />
            <div className="wave-overlay-info">
              <div className="info-item">λ = {wavelength}px</div>
              <div className="info-item">f = {frequency}Hz</div>
              <div className="info-item">d = {sourceSeparation * 10}px</div>
            </div>
          </div>

          <div className="wave-controls">
            <div className="control-section">
              <h3>Thông số sóng</h3>
              
              <div className="control-group">
                <label>
                  Khoảng cách nguồn (d): {sourceSeparation * 10}px
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.5"
                    value={sourceSeparation}
                    onChange={(e) => setSourceSeparation(parseFloat(e.target.value))}
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Bước sóng (λ): {wavelength}px
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="2"
                    value={wavelength}
                    onChange={(e) => setWavelength(parseFloat(e.target.value))}
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Tần số (f): {frequency}Hz
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Biên độ (A): {amplitude}
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={amplitude}
                    onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Tốc độ thời gian: {timeSpeed}x
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                  />
                </label>
              </div>

              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showStanding}
                    onChange={(e) => setShowStanding(e.target.checked)}
                  />
                  Chế độ sóng dừng
                </label>
              </div>
            </div>

            {challengeMode && challengeQuestion && (
              <div className="control-section challenge-section">
                <h3>Thử thách</h3>
                <p className="challenge-question">{challengeQuestion.question}</p>
                
                {challengeQuestion.type === 'number' ? (
                  <div className="challenge-input-group">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Nhập câu trả lời"
                      className="challenge-input"
                    />
                    <span className="challenge-unit">{challengeQuestion.unit}</span>
                  </div>
                ) : (
                  <select
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="challenge-select"
                  >
                    <option value="">Chọn đáp án</option>
                    {challengeQuestion.options.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                
                <button
                  className="wave-btn wave-btn-primary"
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                >
                  Kiểm tra
                </button>
              </div>
            )}

            <div className="control-section">
              <h3>Ghi chú</h3>
              <div className="wave-info-box">
                <p><strong>Cực đại:</strong> Sáng (xanh/trắng) - sóng cùng pha</p>
                <p><strong>Cực tiểu:</strong> Tối (đen/xanh đậm) - sóng ngược pha</p>
                <p><strong>Điều kiện cực đại:</strong> Δd = kλ (k = 0, ±1, ±2...)</p>
                <p><strong>Điều kiện cực tiểu:</strong> Δd = (k + 0.5)λ</p>
                {showStanding && (
                  <>
                    <p><strong>Nút sóng:</strong> Biên độ = 0</p>
                    <p><strong>Bụng sóng:</strong> Biên độ cực đại</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveInterferenceStudio;
