import React, { useState, useEffect, useRef } from 'react';
import { PROJECTILE_MOTION_DATA } from '../../data/games';
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';
import './ProjectileMotion.css';

const ProjectileMotion = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [angle, setAngle] = useState(45);
  const [force, setForce] = useState(15);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [trajectory, setTrajectory] = useState([]);
  const [gameState, setGameState] = useState('aiming'); // 'aiming', 'flying', 'hit', 'miss'
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const { levels, physics } = PROJECTILE_MOTION_DATA;
  const level = levels[currentLevel];
  const puzzle = level?.puzzles[currentPuzzle];

  // Constants
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 700;
  const SCALE = 10; // pixels per meter (giảm xuống 10 để hiển thị xa hơn, 100m = 1000px)
  const SLINGSHOT_X = 100; // Ná thun ở sát bên trái để có nhiều không gian
  const SLINGSHOT_Y = CANVAS_HEIGHT - 120;

  useEffect(() => {
    if (!canvasRef.current) return;
    drawGame();
  }, [angle, force, trajectory, gameState, puzzle]);

  // Thêm event listener toàn cục cho mouseup và mousemove
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Không tự động bắn khi thả, chờ người chơi nhấn nút Bắn
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isDragging && canvasRef.current && puzzle) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Tính tỉ lệ scale của canvas
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        const groundY = CANVAS_HEIGHT - 120;
        const slingshotCenterY = groundY - 50;

        // Tính góc và lực từ vị trí chuột
        const dx = SLINGSHOT_X - mouseX;
        const dy = slingshotCenterY - mouseY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        let calculatedAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        const maxPullDistance = 150;
        const pullRatio = Math.min(distance / maxPullDistance, 1);
        const calculatedForce = puzzle.minForce + (puzzle.maxForce - puzzle.minForce) * pullRatio;

        const minAllowedAngle = puzzle.minAngle || 15;
        const maxAllowedAngle = puzzle.maxAngle || 85;
        
        if (calculatedAngle < 0) {
          calculatedAngle = minAllowedAngle;
        }
        
        const clampedAngle = Math.max(Math.min(calculatedAngle, maxAllowedAngle), minAllowedAngle);
        
        setAngle(clampedAngle);
        setForce(calculatedForce);
      }
    };

    // Thêm event listeners
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, puzzle]);

  // Tính toán quỹ đạo
  const calculateTrajectory = () => {
    if (!puzzle) return [];

    const { gravity, airResistance, timeStep } = physics;
    const v0 = force; // Vận tốc ban đầu
    const angleRad = (angle * Math.PI) / 180;
    
    let vx = v0 * Math.cos(angleRad);
    let vy = v0 * Math.sin(angleRad);
    let x = 0;
    let y = 0;
    
    const points = [];
    let time = 0;
    const maxTime = 15; // Tăng thời gian lên 15s
    const maxDistance = 150; // Tăng lên 150m để bắn xa

    while (y >= 0 && time < maxTime && x < maxDistance) {
      points.push({ x, y, time });

      // Cập nhật vị trí
      x += vx * timeStep;
      y += vy * timeStep;

      // Áp dụng gió nếu có
      if (puzzle.wind) {
        vx += puzzle.wind.x * timeStep;
        vy += puzzle.wind.y * timeStep;
      }

      // Áp dụng trọng lực
      vy -= gravity * timeStep;
      
      // ❌ BUG CŨ: Lực cản không khí với công thức vx *= (1 - airResistance) 
      // làm vận tốc giảm QUÁ NHANH (0.99^100 ≈ 0.37), khiến đạn rơi thẳng!
      // ✅ FIX: TẮT lực cản không khí để có quỹ đạo parabol chuẩn
      // Trong game học tập cho lớp 10, không cần mô phỏng lực cản phức tạp

      time += timeStep;
    }

    return points;
  };

  // Kiểm tra va chạm
  const checkCollision = (trajectory) => {
    if (!puzzle) return { hit: false, type: 'miss' };

    for (let point of trajectory) {
      // Kiểm tra trúng mục tiêu
      const dx = point.x - puzzle.targetX;
      const dy = point.y - puzzle.targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= puzzle.targetRadius) {
        return { hit: true, type: 'target', point };
      }

      // Kiểm tra va chạm với chướng ngại vật
      if (puzzle.obstacles) {
        for (let obstacle of puzzle.obstacles) {
          if (
            point.x >= obstacle.x &&
            point.x <= obstacle.x + obstacle.width &&
            point.y >= 0 &&
            point.y <= obstacle.height
          ) {
            return { hit: true, type: 'obstacle', point };
          }
        }
      }
    }

    return { hit: false, type: 'miss' };
  };

  // Xử lý kéo thả ná thun
  const handleMouseDown = (e) => {
    if (gameState !== 'aiming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const groundY = CANVAS_HEIGHT - 120;
    const slingshotCenterY = groundY - 50;
    
    // Chỉ cho phép kéo ở vùng ná thun (bán kính 150px)
    const dx = mouseX - SLINGSHOT_X;
    const dy = mouseY - slingshotCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 150) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Tính tỉ lệ scale của canvas
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const groundY = CANVAS_HEIGHT - 120;
    const slingshotCenterY = groundY - 50;

    // ✅ FIX HOÀN TOÀN: Tính vector kéo (pull vector)
    const pullX = mouseX - SLINGSHOT_X;
    const pullY = mouseY - slingshotCenterY;
    const pullDistance = Math.sqrt(pullX * pullX + pullY * pullY);
    
    // CHỈ xử lý nếu kéo về BÊN TRÁI của ná thun (pullX < 0)
    if (pullX < 0 && pullDistance <= 150) {
      // Vector bắn ngược với vector kéo
      const launchX = -pullX;  // Ngược chiều X
      const launchY = -pullY;  // Ngược chiều Y
      
      // Tính góc bắn (phải là góc dương, hướng lên trên và sang phải)
      let calculatedAngle = Math.atan2(launchY, launchX) * (180 / Math.PI);
      
      // Tính lực dựa trên khoảng cách kéo
      const maxPullDistance = 150;
      const pullRatio = Math.min(pullDistance / maxPullDistance, 1);
      const calculatedForce = puzzle.minForce + (puzzle.maxForce - puzzle.minForce) * pullRatio;

      // Giới hạn góc trong khoảng cho phép
      const minAllowedAngle = puzzle.minAngle || 15;
      const maxAllowedAngle = puzzle.maxAngle || 85;
      
      // Clamp góc
      const clampedAngle = Math.max(Math.min(calculatedAngle, maxAllowedAngle), minAllowedAngle);
      
      setAngle(clampedAngle);
      setForce(calculatedForce);
    }
    // Nếu kéo về bên phải (pullX >= 0) hoặc quá xa, không cập nhật
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    launchProjectile();
  };

  // Bắn viên đạn
  const launchProjectile = () => {
    setGameState('flying');
    setIsLaunched(true);
    setAttempts(prev => prev + 1);

    const traj = calculateTrajectory();
    
    // Animate trajectory - Hiển thị từng điểm một với tốc độ vừa phải
    let index = 0;
    const stepsPerFrame = 1; // Giảm xuống 1 để chậm hơn, dễ theo dõi
    
    const animate = () => {
      if (index < traj.length) {
        const currentSlice = traj.slice(0, index + 1);
        setTrajectory(currentSlice);
        index += stepsPerFrame;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation xong - GIỮ LẠI TOÀN BỘ QUỸ ĐẠO
        setTrajectory(traj);
        
        // Chờ 1 giây để người chơi thấy rõ quỹ đạo và vị trí cuối
        setTimeout(() => {
          const result = checkCollision(traj);
          if (result.hit && result.type === 'target') {
            setGameState('hit');
            setScore(prev => prev + 10);
            setTimeout(() => nextPuzzle(), 2000);
          } else {
            setGameState('miss');
            setTimeout(() => resetPuzzle(), 2000);
          }
        }, 1000);
      }
    };
    animate();
  };

  // Vẽ game
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Vẽ nền gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#E0F6FF');
    gradient.addColorStop(1, '#D4F1F4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Vẽ mây
    drawClouds(ctx);
    
    const groundY = CANVAS_HEIGHT - 120; // Đồng bộ với SLINGSHOT_Y
    
    // Vẽ mặt đất với texture đẹp
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, CANVAS_HEIGHT);
    groundGradient.addColorStop(0, '#8B7355');
    groundGradient.addColorStop(0.3, '#6B5344');
    groundGradient.addColorStop(1, '#4A3728');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, CANVAS_HEIGHT - groundY);
    
    // Vẽ cỏ đẹp hơn
    ctx.fillStyle = '#2D5016';
    ctx.fillRect(0, groundY - 10, CANVAS_WIDTH, 10);
    
    // Vẽ nhiều nhánh cỏ
    for (let i = 0; i < CANVAS_WIDTH; i += 10) {
      const height = 15 + Math.sin(i * 0.1) * 4;
      ctx.fillStyle = i % 20 === 0 ? '#3A6B1E' : '#2D5016';
      ctx.beginPath();
      ctx.moveTo(i, groundY);
      ctx.lineTo(i - 4, groundY - height);
      ctx.lineTo(i, groundY - height + 3);
      ctx.lineTo(i + 4, groundY - height);
      ctx.lineTo(i, groundY);
      ctx.fill();
    }

    if (!puzzle) return;

    // Vẽ lưới tọa độ (giúp nhìn rõ khoảng cách)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += SCALE * 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Vẽ chướng ngại vật
    if (puzzle.obstacles) {
      puzzle.obstacles.forEach(obstacle => {
        const x = SLINGSHOT_X + obstacle.x * SCALE;
        const y = groundY - obstacle.height * SCALE;
        const width = obstacle.width * SCALE;
        const height = obstacle.height * SCALE;
        
        // Vẽ tường gạch
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Vẽ họa tiết gạch
        ctx.strokeStyle = '#A0522D';
        for (let by = y; by < y + height; by += 15) {
          ctx.beginPath();
          ctx.moveTo(x, by);
          ctx.lineTo(x + width, by);
          ctx.stroke();
        }
      });
    }

    // Vẽ mục tiêu
    const targetX = SLINGSHOT_X + puzzle.targetX * SCALE;
    const targetY = groundY - puzzle.targetY * SCALE;
    const targetRadius = puzzle.targetRadius * SCALE;
    
    // Vẽ chân mục tiêu (cọc)
    if (puzzle.targetY === 0) {
      ctx.fillStyle = '#654321';
      ctx.fillRect(targetX - 3, targetY, 6, 30);
    }
    
    // Vẽ mục tiêu với vòng tròn đồng tâm
    const colors = ['#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF'];
    colors.forEach((color, i) => {
      ctx.fillStyle = gameState === 'hit' ? '#00FF00' : color;
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetRadius * (1 - i * 0.25), 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Vẽ điểm giữa
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ ná thun
    drawSlingshot(ctx, groundY);

    // Vẽ quỹ đạo dự đoán khi ngắm
    if (gameState === 'aiming' && !isLaunched) {
      const predictedTrajectory = calculateTrajectory();
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      predictedTrajectory.forEach((point, index) => {
        const x = SLINGSHOT_X + point.x * SCALE;
        const y = groundY - point.y * SCALE;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Vẽ các điểm trên quỹ đạo
      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      predictedTrajectory.forEach((point, index) => {
        if (index % 10 === 0) {
          const x = SLINGSHOT_X + point.x * SCALE;
          const y = groundY - point.y * SCALE;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Vẽ quỹ đạo thực tế khi bay (hoặc sau khi bay xong)
    if (trajectory.length > 0 && (gameState === 'flying' || gameState === 'hit' || gameState === 'miss')) {
      // Vẽ quỹ đạo bằng các chấm tròn màu cam
      ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
      trajectory.forEach((point, index) => {
        const x = SLINGSHOT_X + point.x * SCALE;
        const y = groundY - point.y * SCALE;
        
        // Chỉ vẽ các điểm trên mặt đất
        if (y <= groundY) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Vẽ viên đạn tại điểm cuối cùng (CHỈ khi đang bay)
      if (gameState === 'flying') {
        const lastPoint = trajectory[trajectory.length - 1];
        const ballX = SLINGSHOT_X + lastPoint.x * SCALE;
        const ballY = groundY - lastPoint.y * SCALE;
        
        // Chỉ vẽ viên đạn nếu nó còn trên mặt đất
        if (ballY <= groundY) {
          drawBird(ctx, ballX, ballY);
        }
      }
    }

    // Vẽ thông tin góc và lực lên canvas
    if (gameState === 'aiming') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 200, 60);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Góc: ${angle.toFixed(1)}°`, 20, 35);
      ctx.fillText(`Lực: ${force.toFixed(1)} m/s`, 20, 60);
    }
  };

  // Vẽ mây
  const drawClouds = (ctx) => {
    const clouds = [
      { x: 150, y: 100, size: 1 },
      { x: 500, y: 140, size: 1.3 },
      { x: 850, y: 80, size: 0.9 },
      { x: 1050, y: 120, size: 1.1 },
    ];
    
    clouds.forEach(cloud => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, 35 * cloud.size, 0, Math.PI * 2);
      ctx.arc(cloud.x + 30 * cloud.size, cloud.y, 40 * cloud.size, 0, Math.PI * 2);
      ctx.arc(cloud.x + 60 * cloud.size, cloud.y, 35 * cloud.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Vẽ ná thun
  const drawSlingshot = (ctx, groundY) => {
    // Bóng đổ của khung ná
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(SLINGSHOT_X - 12, groundY - 5, 35, 8);
    
    // Khung ná (hai cột) với gradient
    const poleGradient = ctx.createLinearGradient(SLINGSHOT_X - 20, groundY - 100, SLINGSHOT_X + 20, groundY - 100);
    poleGradient.addColorStop(0, '#4A2511');
    poleGradient.addColorStop(0.5, '#654321');
    poleGradient.addColorStop(1, '#4A2511');
    
    ctx.fillStyle = poleGradient;
    ctx.fillRect(SLINGSHOT_X - 20, groundY - 100, 10, 100);
    ctx.fillRect(SLINGSHOT_X + 10, groundY - 100, 10, 100);
    
    // Viền cột
    ctx.strokeStyle = '#2A1505';
    ctx.lineWidth = 2;
    ctx.strokeRect(SLINGSHOT_X - 20, groundY - 100, 10, 100);
    ctx.strokeRect(SLINGSHOT_X + 10, groundY - 100, 10, 100);
    
    // Đỉnh khung (ngang)
    ctx.fillStyle = poleGradient;
    ctx.fillRect(SLINGSHOT_X - 20, groundY - 105, 40, 10);
    ctx.strokeStyle = '#2A1505';
    ctx.strokeRect(SLINGSHOT_X - 20, groundY - 105, 40, 10);
    
    // Dây thun
    if (gameState === 'aiming') {
      const angleRad = (angle * Math.PI) / 180;
      const pullBack = Math.min(force * 4, 80);
      const ballX = SLINGSHOT_X - Math.cos(angleRad) * pullBack;
      const ballY = groundY - 50 - Math.sin(angleRad) * pullBack;
      
      // Dây thun trái với shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(SLINGSHOT_X - 15, groundY - 100);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
      
      // Dây thun phải
      ctx.beginPath();
      ctx.moveTo(SLINGSHOT_X + 15, groundY - 100);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Viên đạn trên ná
      drawBird(ctx, ballX, ballY);
      
      // Vẽ mũi tên chỉ hướng bắn (lớn và rõ hơn)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#FFA500';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const arrowEndX = ballX + Math.cos(angleRad) * 60;
      const arrowEndY = ballY - Math.sin(angleRad) * 60;
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.stroke();
      
      // Đầu mũi tên
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowEndY);
      ctx.lineTo(arrowEndX - 12 * Math.cos(angleRad - 0.4), arrowEndY + 12 * Math.sin(angleRad - 0.4));
      ctx.lineTo(arrowEndX - 12 * Math.cos(angleRad + 0.4), arrowEndY + 12 * Math.sin(angleRad + 0.4));
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Vòng tròn chỉ điểm kéo
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(SLINGSHOT_X, groundY - 50, pullBack, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Dây thun không kéo
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(SLINGSHOT_X - 15, groundY - 100);
      ctx.lineTo(SLINGSHOT_X, groundY - 50);
      ctx.lineTo(SLINGSHOT_X + 15, groundY - 100);
      ctx.stroke();
    }
  };

  // Vẽ Angry Bird
  const drawBird = (ctx, x, y) => {
    // Bóng đổ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thân chính
    ctx.fillStyle = '#E63946';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Bụng
    ctx.fillStyle = '#FFE4E1';
    ctx.beginPath();
    ctx.arc(x, y + 4, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Mắt trắng (lớn hơn)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 5, y - 3, 5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 3, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Viền mắt
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x - 5, y - 3, 5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 3, 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Con ngươi
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 5, y - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Điểm sáng trong mắt
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 4, y - 3, 1, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 3, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Lông mày (dày và rõ hơn)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 8);
    ctx.lineTo(x - 4, y - 6);
    ctx.moveTo(x + 4, y - 6);
    ctx.lineTo(x + 10, y - 8);
    ctx.stroke();
    
    // Mỏ (lớn hơn)
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(x, y + 3);
    ctx.lineTo(x + 10, y + 2);
    ctx.lineTo(x, y + 6);
    ctx.fill();
    
    // Viền mỏ
    ctx.strokeStyle = '#CC7000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 3);
    ctx.lineTo(x + 10, y + 2);
    ctx.lineTo(x, y + 6);
    ctx.closePath();
    ctx.stroke();
    
    // Đuôi (lớn và chi tiết hơn)
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x - 22, y - 8);
    ctx.lineTo(x - 20, y);
    ctx.lineTo(x - 22, y + 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#600000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Highlight trên thân
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - 4, y - 6, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const resetPuzzle = () => {
    setGameState('aiming');
    setIsLaunched(false);
    setTrajectory([]);
    setAngle(45);
    setForce(15);
  };

  const nextPuzzle = () => {
    if (currentPuzzle < level.puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentPuzzle(0);
    } else {
      alert('Chúc mừng! Bạn đã hoàn thành tất cả các màn!');
    }
    resetPuzzle();
  };

  const resetLevel = () => {
    setCurrentPuzzle(0);
    setScore(0);
    setAttempts(0);
    resetPuzzle();
  };

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop10-1']} onStart={() => setShowIntro(false)} />;
  }

  if (!level || !puzzle) {
    return <div className="projectile-loading">Đang tải...</div>;
  }

  return (
    <div className="projectile-container">
      <div className="projectile-header">
        <h2>{level.title}</h2>
        <div className="projectile-stats">
          <span>Điểm: {score}</span>
          <span>Lần bắn: {attempts}</span>
          <span>Màn: {currentPuzzle + 1}/{level.puzzles.length}</span>
        </div>
      </div>

      <div className="projectile-info">
        <div className="projectile-help">
          <strong>🎯 Hướng dẫn:</strong> Kéo ná thun về phía sau (ngược hướng bắn) để điều chỉnh góc và lực. 
          Hoặc dùng thanh trượt bên dưới. Mũi tên vàng chỉ hướng bay của viên đạn.
        </div>
        
        <div className="projectile-controls">
          <div className="control-group">
            <label>Góc bắn: {angle.toFixed(1)}°</label>
            <input
              type="range"
              min={puzzle.minAngle || 15}
              max={puzzle.maxAngle || 75}
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              disabled={gameState !== 'aiming'}
            />
          </div>
          <div className="control-group">
            <label>Lực: {force.toFixed(1)} m/s</label>
            <input
              type="range"
              min={puzzle.minForce || 5}
              max={puzzle.maxForce || 35}
              value={force}
              onChange={(e) => setForce(parseFloat(e.target.value))}
              disabled={gameState !== 'aiming'}
            />
          </div>
        </div>
        
        {/* Thông tin vật lý chi tiết */}
        {gameState === 'aiming' && (
          <div className="physics-info">
            <div className="physics-detail">
              <span>Vận tốc ngang (Vx):</span>
              <strong>{(force * Math.cos((angle * Math.PI) / 180)).toFixed(2)} m/s</strong>
            </div>
            <div className="physics-detail">
              <span>Vận tốc đứng (Vy):</span>
              <strong>{(force * Math.sin((angle * Math.PI) / 180)).toFixed(2)} m/s</strong>
            </div>
            <div className="physics-detail">
              <span>Tầm xa dự kiến:</span>
              <strong>{((force * force * Math.sin(2 * angle * Math.PI / 180)) / physics.gravity).toFixed(1)} m</strong>
            </div>
          </div>
        )}
        
        {puzzle.hint && (
          <div className="projectile-hint">
            💡 {puzzle.hint}
          </div>
        )}
        
        {puzzle.wind && (
          <div className="projectile-wind">
            🌬️ Gió: {puzzle.wind.x > 0 ? 'Thuận' : 'Ngược'} ({Math.abs(puzzle.wind.x)} m/s)
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="projectile-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <div className="projectile-actions">
        {gameState === 'aiming' && !isDragging && (
          <button className="btn-launch" onClick={launchProjectile}>
            🎯 Bắn!
          </button>
        )}
        {gameState === 'miss' && (
          <button className="btn-retry" onClick={resetPuzzle}>
            🔄 Thử lại
          </button>
        )}
        {gameState === 'hit' && (
          <button className="btn-next" onClick={nextPuzzle}>
            ➡️ Màn tiếp theo
          </button>
        )}
        <button className="btn-reset" onClick={resetLevel}>
          🔙 Làm lại từ đầu
        </button>
      </div>

      {gameState === 'hit' && (
        <div className="projectile-message success">
          🎉 Tuyệt vời! Bạn đã trúng mục tiêu!
        </div>
      )}
      {gameState === 'miss' && (
        <div className="projectile-message fail">
          😞 Trượt mất rồi! Thử lại nhé!
        </div>
      )}
    </div>
  );
};

export default ProjectileMotion;
