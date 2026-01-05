import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Timer } from 'lucide-react';
import './RaceTracker.css';

const RaceTracker = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, racing, victory
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Racing data
  const [cars, setCars] = useState([
    { id: 1, name: 'Xe Đều', position: 0, velocity: 50, color: '#3b82f6', type: 'uniform' },
    { id: 2, name: 'Xe Nhanh Dần', position: 0, velocity: 0, acceleration: 20, color: '#ef4444', type: 'accelerating' },
    { id: 3, name: 'Xe Thay Đổi', position: 0, velocity: 30, color: '#10b981', type: 'variable' }
  ]);

  const [selectedCar, setSelectedCar] = useState(null);
  const [playerPrediction, setPlayerPrediction] = useState({ car: null, time: null });
  const [results, setResults] = useState([]);

  const levels = [
    {
      id: 1,
      name: 'Chuyển Động Đều',
      distance: 500,
      description: 'Dự đoán xe nào đến đích trước khi chúng chuyển động đều',
      cars: [
        { id: 1, name: 'Xe Xanh', velocity: 50, color: '#3b82f6', type: 'uniform' },
        { id: 2, name: 'Xe Đỏ', velocity: 70, color: '#ef4444', type: 'uniform' },
        { id: 3, name: 'Xe Xanh Lá', velocity: 60, color: '#10b981', type: 'uniform' }
      ]
    },
    {
      id: 2,
      name: 'Chuyển Động Nhanh Dần',
      distance: 600,
      description: 'Xe chuyển động nhanh dần đều - tính toán thời gian',
      cars: [
        { id: 1, name: 'Xe Ổn Định', velocity: 60, color: '#3b82f6', type: 'uniform' },
        { id: 2, name: 'Xe Tăng Tốc', velocity: 10, acceleration: 15, color: '#ef4444', type: 'accelerating' },
        { id: 3, name: 'Xe Chậm', velocity: 40, color: '#10b981', type: 'uniform' }
      ]
    },
    {
      id: 3,
      name: 'Chuyển Động Phức Tạp',
      distance: 700,
      description: 'Kết hợp cả chuyển động đều và không đều',
      cars: [
        { id: 1, name: 'Xe Đều', velocity: 55, color: '#3b82f6', type: 'uniform' },
        { id: 2, name: 'Xe Tăng Giảm', velocity: 30, acceleration: 10, color: '#ef4444', type: 'variable' },
        { id: 3, name: 'Xe Nhanh', velocity: 75, color: '#10b981', type: 'uniform' }
      ]
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'racing' && currentLevel) {
      setCars(currentLevel.cars.map(car => ({
        ...car,
        position: 0,
        velocity: car.velocity || 0
      })));
      setTime(0);
      setIsRunning(true);
    }
  }, [gameState, level]);

  useEffect(() => {
    let interval;
    if (isRunning && gameState === 'racing') {
      interval = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameState]);

  useEffect(() => {
    if (gameState === 'racing') {
      drawRace();
    }
  }, [cars, gameState]);

  useEffect(() => {
    if (isRunning && gameState === 'racing') {
      animationRef.current = requestAnimationFrame(updatePositions);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, cars, gameState]);

  const updatePositions = () => {
    if (!isRunning) return;

    setCars(prevCars => {
      const newCars = prevCars.map(car => {
        let newPosition = car.position;
        let newVelocity = car.velocity;

        if (car.type === 'uniform') {
          // Chuyển động đều: v = const
          newPosition += car.velocity * 0.016; // 60fps
        } else if (car.type === 'accelerating') {
          // Chuyển động nhanh dần: v = v0 + at
          newVelocity += (car.acceleration || 0) * 0.016;
          newPosition += newVelocity * 0.016;
        } else if (car.type === 'variable') {
          // Chuyển động thay đổi
          const t = time;
          newVelocity = car.velocity + (car.acceleration || 0) * Math.sin(t * 0.5);
          newPosition += newVelocity * 0.016;
        }

        return {
          ...car,
          position: Math.min(newPosition, currentLevel.distance),
          velocity: newVelocity
        };
      });

      // Check if any car finished
      const finished = newCars.filter(car => car.position >= currentLevel.distance);
      if (finished.length > 0) {
        setIsRunning(false);
        const sortedResults = [...newCars].sort((a, b) => b.position - a.position);
        setResults(sortedResults);
        
        // Check player prediction
        if (playerPrediction.car === sortedResults[0].id) {
          setTimeout(() => {
            if (level < levels.length) {
              setLevel(prev => prev + 1);
              setGameState('menu');
              setPlayerPrediction({ car: null, time: null });
            } else {
              setGameState('victory');
            }
          }, 2000);
        }
      }

      return newCars;
    });

    if (isRunning) {
      animationRef.current = requestAnimationFrame(updatePositions);
    }
  };

  const drawRace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw track
    const trackHeight = 80;
    const trackY = (index) => 100 + index * (trackHeight + 20);

    cars.forEach((car, index) => {
      const y = trackY(index);
      
      // Track background
      ctx.fillStyle = '#2a2a3e';
      ctx.fillRect(50, y, width - 100, trackHeight);
      
      // Track lines
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(50, y + trackHeight / 2);
      ctx.lineTo(width - 50, y + trackHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Finish line
      const finishX = width - 60;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(
          finishX,
          y + (i * trackHeight / 8),
          10,
          trackHeight / 16
        );
      }

      // Car
      const carWidth = 60;
      const carHeight = 40;
      const carX = 60 + (car.position / currentLevel.distance) * (width - 140 - carWidth);
      const carY = y + trackHeight / 2 - carHeight / 2;

      // Car body
      ctx.fillStyle = car.color;
      ctx.fillRect(carX, carY, carWidth, carHeight);
      
      // Car details
      ctx.fillStyle = '#000000';
      ctx.fillRect(carX + 10, carY + 5, 15, 10);
      ctx.fillRect(carX + 35, carY + 5, 15, 10);

      // Wheels
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(carX + 15, carY + carHeight, 8, 0, Math.PI * 2);
      ctx.arc(carX + 45, carY + carHeight, 8, 0, Math.PI * 2);
      ctx.fill();

      // Car name and velocity
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(car.name, 60, y - 10);
      ctx.font = '12px Arial';
      ctx.fillText(`v = ${Math.round(car.velocity)} m/s`, 60, y - 30);
      
      if (car.acceleration) {
        ctx.fillText(`a = ${car.acceleration} m/s²`, 200, y - 30);
      }
    });

    // Distance marker
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Quãng đường: ${currentLevel.distance}m`, width / 2 - 70, 50);
  };

  const startRace = () => {
    if (!playerPrediction.car) {
      alert('Hãy chọn xe bạn dự đoán sẽ thắng!');
      return;
    }
    setGameState('racing');
  };

  const resetRace = () => {
    setIsRunning(false);
    setTime(0);
    setResults([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCars(currentLevel.cars.map(car => ({
      ...car,
      position: 0,
      velocity: car.velocity || 0
    })));
  };

  const handleCarSelect = (carId) => {
    setPlayerPrediction({ ...playerPrediction, car: carId });
    setSelectedCar(carId);
  };

  return (
    <div className="race-tracker">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>🏎️ Đua Xe Tốc Độ</h1>
        <div className="level-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="timer">
            <Timer size={16} />
            {time.toFixed(1)}s
          </span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="level-card">
            <h2>{currentLevel.name}</h2>
            <p className="level-description">{currentLevel.description}</p>
            
            <div className="level-details">
              <div className="detail-item">
                <strong>Quãng đường:</strong> {currentLevel.distance}m
              </div>
              <div className="detail-item">
                <strong>Số xe:</strong> {currentLevel.cars.length}
              </div>
            </div>

            <div className="car-selection">
              <h3>Chọn xe bạn dự đoán sẽ thắng:</h3>
              <div className="car-options">
                {currentLevel.cars.map(car => (
                  <div
                    key={car.id}
                    className={`car-option ${selectedCar === car.id ? 'selected' : ''}`}
                    onClick={() => handleCarSelect(car.id)}
                    style={{ borderColor: car.color }}
                  >
                    <div className="car-preview" style={{ backgroundColor: car.color }}></div>
                    <div className="car-info">
                      <strong>{car.name}</strong>
                      <div className="car-stats">
                        <span>v₀ = {car.velocity} m/s</span>
                        {car.acceleration && <span>a = {car.acceleration} m/s²</span>}
                      </div>
                      <span className="car-type">
                        {car.type === 'uniform' ? '⏱️ Đều' : 
                         car.type === 'accelerating' ? '⚡ Nhanh dần' : 
                         '🔄 Thay đổi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="start-button"
              onClick={startRace}
              disabled={!selectedCar}
            >
              <Play size={20} />
              Bắt đầu đua
            </button>
          </div>
        </div>
      )}

      {gameState === 'racing' && (
        <div className="racing-screen">
          <canvas
            ref={canvasRef}
            width={900}
            height={450}
            className="race-canvas"
          />

          <div className="race-controls">
            <button onClick={() => setIsRunning(!isRunning)} className="control-button">
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Tạm dừng' : 'Tiếp tục'}
            </button>
            <button onClick={resetRace} className="control-button">
              <RotateCcw size={20} />
              Chạy lại
            </button>
          </div>

          {results.length > 0 && (
            <div className="results-panel">
              <h3>🏁 Kết quả:</h3>
              <div className="results-list">
                {results.map((car, index) => (
                  <div 
                    key={car.id} 
                    className={`result-item ${playerPrediction.car === car.id && index === 0 ? 'winner' : ''}`}
                  >
                    <span className="rank">#{index + 1}</span>
                    <span className="car-name" style={{ color: car.color }}>{car.name}</span>
                    <span className="car-distance">{Math.round(car.position)}m</span>
                  </div>
                ))}
              </div>
              {playerPrediction.car === results[0].id ? (
                <div className="success-message">
                  ✅ Chúc mừng! Dự đoán của bạn đúng!
                </div>
              ) : (
                <div className="fail-message">
                  ❌ Dự đoán sai. Hãy thử lại!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Hoàn thành xuất sắc!</h2>
          <p>Bạn đã hiểu rõ về chuyển động cơ học và vận tốc!</p>
          <div className="victory-stats">
            <div className="stat">
              <strong>Cấp độ hoàn thành:</strong>
              <span>{levels.length}</span>
            </div>
          </div>
          <div className="victory-actions">
            <button onClick={() => { setLevel(1); setGameState('menu'); }} className="replay-button">
              Chơi lại
            </button>
            <button onClick={() => navigate(-1)} className="home-button">
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceTracker;
