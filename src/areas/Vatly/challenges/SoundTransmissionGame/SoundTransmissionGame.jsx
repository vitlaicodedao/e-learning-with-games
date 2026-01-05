import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Ear, Wind, Waves, Box, XCircle } from 'lucide-react';
import './SoundTransmissionGame.css';

const SoundTransmissionGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('tutorial');
  const [selectedMedium, setSelectedMedium] = useState(null);
  const [animationState, setAnimationState] = useState('idle'); // idle, propagating, finished
  const [result, setResult] = useState(null);

  const media = {
    air: { name: 'Không khí', icon: Wind, speed: 343, attenuation: 0.7 },
    water: { name: 'Nước', icon: Waves, speed: 1480, attenuation: 0.4 },
    steel: { name: 'Thép', icon: Box, speed: 5960, attenuation: 0.1 },
    vacuum: { name: 'Chân không', icon: XCircle, speed: 0, attenuation: 1.0 },
  };

  const distance = 500; // a fixed distance for visualization

  useEffect(() => {
    if (gameState === 'playing') {
      drawScene();
    }
  }, [selectedMedium, gameState]);

  const drawScene = (progress = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.fillStyle = '#1a2238';
    ctx.fillRect(0, 0, width, height);

    // Draw medium background
    if (selectedMedium) {
      let bgColor;
      switch (selectedMedium) {
        case 'air': bgColor = 'rgba(135, 206, 235, 0.1)'; break;
        case 'water': bgColor = 'rgba(0, 105, 148, 0.2)'; break;
        case 'steel': bgColor = 'rgba(119, 136, 153, 0.3)'; break;
        case 'vacuum': bgColor = 'rgba(50, 50, 50, 0.2)'; break;
        default: bgColor = 'transparent';
      }
      ctx.fillStyle = bgColor;
      ctx.fillRect(50, 50, width - 100, height - 100);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(50, 50, width - 100, height - 100);
    }

    // Draw source (Bell) and receiver (Ear)
    const sourceX = 100;
    const receiverX = width - 100;
    const y = height / 2;

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Nguồn Âm', sourceX - 40, y - 50);
    ctx.fillText('Máy Thu', receiverX - 30, y - 50);

    // Draw icons (simplified representation)
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    // Bell
    ctx.beginPath();
    ctx.moveTo(sourceX - 15, y);
    ctx.lineTo(sourceX + 15, y);
    ctx.arc(sourceX, y - 20, 20, Math.PI * 0.2, Math.PI * 0.8, true);
    ctx.closePath();
    ctx.stroke();
    // Ear
    ctx.beginPath();
    ctx.arc(receiverX, y, 20, Math.PI * 1.5, Math.PI * 0.5);
    ctx.arc(receiverX, y, 10, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();

    // Draw sound wave propagation
    if (animationState === 'propagating' && selectedMedium && media[selectedMedium].speed > 0) {
      const waveX = sourceX + progress * (receiverX - sourceX);
      const attenuation = media[selectedMedium].attenuation;
      const radius = 30 * (1 - attenuation * progress);

      if (radius > 0) {
        ctx.strokeStyle = `rgba(0, 188, 212, ${1 - progress})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(waveX, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const runSimulation = () => {
    if (!selectedMedium) {
      alert('Vui lòng chọn một môi trường!');
      return;
    }
    setAnimationState('propagating');
    setResult(null);

    const medium = media[selectedMedium];
    const duration = medium.speed > 0 ? 2000 / (medium.speed / 343) : 2000; // Normalize duration for visual appeal
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      let progress = elapsed / duration;

      if (progress >= 1) {
        progress = 1;
        setAnimationState('finished');
        const timeTaken = medium.speed > 0 ? distance / medium.speed : Infinity;
        const intensity = medium.speed > 0 ? 100 * (1 - medium.attenuation) : 0;
        setResult({ time: timeTaken, intensity: intensity });
        drawScene(1);
        return;
      }

      drawScene(progress);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const reset = () => {
    setSelectedMedium(null);
    setAnimationState('idle');
    setResult(null);
  };

  const renderTutorial = () => (
    <div className="st-tutorial-overlay">
      <div className="st-tutorial-content">
        <Waves size={60} className="st-tutorial-icon" />
        <h2>Phòng Thí Nghiệm Truyền Âm</h2>
        <div className="st-tutorial-text">
          <p><strong>Mục tiêu:</strong> Khám phá cách âm thanh di chuyển qua các môi trường khác nhau.</p>
          <h3>Hướng dẫn:</h3>
          <ul>
            <li>1. Chọn một môi trường: Không khí, Nước, Thép, hoặc Chân không.</li>
            <li>2. Nhấn nút <strong>"Rung Chuông"</strong> để bắt đầu thí nghiệm.</li>
            <li>3. Quan sát sóng âm truyền đi và xem kết quả.</li>
            <li>4. So sánh tốc độ và cường độ âm trong các môi trường.</li>
          </ul>
          <div className="st-physics-note">
            <p><strong>Kiến thức vật lý:</strong></p>
            <p>• Âm thanh cần vật chất để truyền đi.</p>
            <p>• Tốc độ âm thanh thay đổi tùy thuộc vào mật độ và độ đàn hồi của môi trường.</p>
            <p>• Nói chung: V<sub>rắn</sub> &gt; V<sub>lỏng</sub> &gt; V<sub>khí</sub>. Âm thanh không truyền được trong chân không.</p>
          </div>
        </div>
        <button onClick={() => setGameState('playing')} className="st-start-button">
          Bắt đầu thí nghiệm
        </button>
      </div>
    </div>
  );

  return (
    <div className="sound-transmission-game">
      {gameState === 'tutorial' && renderTutorial()}
      <div className="st-game-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="st-back-button">
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <h1>Phòng Thí Nghiệm Truyền Âm</h1>
      </div>

      <div className="st-main-content">
        <div className="st-controls">
          <h2>Chọn Môi Trường</h2>
          <div className="st-medium-selector">
            {Object.keys(media).map(key => {
              const MediumIcon = media[key].icon;
              return (
                <button
                  key={key}
                  className={`st-medium-btn ${selectedMedium === key ? 'selected' : ''}`}
                  onClick={() => setSelectedMedium(key)}
                  disabled={animationState === 'propagating'}
                >
                  <MediumIcon size={30} />
                  <span>{media[key].name}</span>
                </button>
              );
            })}
          </div>
          <button 
            className="st-action-button" 
            onClick={runSimulation}
            disabled={!selectedMedium || animationState === 'propagating'}
          >
            <Bell size={24} />
            Rung Chuông
          </button>
          <button 
            className="st-reset-button" 
            onClick={reset}
            disabled={animationState === 'propagating'}
          >
            Thí nghiệm mới
          </button>
        </div>

        <div className="st-simulation-area">
          <canvas ref={canvasRef} width="800" height="400" />
        </div>

        <div className="st-results-panel">
          <h2>Kết Quả</h2>
          {result ? (
            <div className="st-result-data">
              <p>Môi trường: <strong>{media[selectedMedium].name}</strong></p>
              <p>Thời gian truyền (giả định {distance}m): <strong>{isFinite(result.time) ? `${result.time.toFixed(3)} s` : 'Không truyền được'}</strong></p>
              <p>Tốc độ âm: <strong>{media[selectedMedium].speed} m/s</strong></p>
              <p>Cường độ nhận được: <strong>{result.intensity.toFixed(0)}%</strong></p>
            </div>
          ) : (
            <p className="st-no-result">Chọn môi trường và rung chuông để xem kết quả.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoundTransmissionGame;
