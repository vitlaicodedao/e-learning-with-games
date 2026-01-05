import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Gauge, TrendingUp, Settings } from 'lucide-react';
import './HeatEngineOptimizer.css';

const HeatEngineOptimizer = () => {
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const CHALLENGES_PER_LEVEL = 5;
  const TOTAL_LEVELS = 4;

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const engineTypes = ['heat-engine', 'refrigerator', 'heat-pump', 'carnot-efficiency'];
    const engineType = engineTypes[Math.floor(Math.random() * engineTypes.length)];
    let challenge = { engineType };

    if (engineType === 'heat-engine') {
      // Động cơ nhiệt: η = W/Q_h = (Q_h - Q_c)/Q_h
      const Q_h = Math.round(Math.random() * 1000 + 2000); // 2000-3000 J
      const efficiency = Math.round((Math.random() * 20 + 25) * 10) / 10; // 25-45%
      
      const W = Q_h * (efficiency / 100);
      const Q_c = Q_h - W;
      
      const questionTypes = ['efficiency', 'work', 'heat-rejected', 'heat-input'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (questionType === 'efficiency') {
        challenge.Q_h = Q_h;
        challenge.W = Math.round(W);
        challenge.Q_c = Math.round(Q_c);
        challenge.question = `Động cơ nhiệt nhận ${Q_h} J từ nguồn nóng, sinh công ${Math.round(W)} J. Hiệu suất (%) là?`;
        challenge.correctAnswer = efficiency;
        challenge.unit = '%';
        challenge.efficiency = efficiency;
      } else if (questionType === 'work') {
        challenge.Q_h = Q_h;
        challenge.efficiency = efficiency;
        challenge.Q_c = Math.round(Q_c);
        challenge.question = `Động cơ nhiệt có hiệu suất ${efficiency}%, nhận ${Q_h} J từ nguồn nóng. Công sinh ra (J) là?`;
        challenge.correctAnswer = Math.round(W);
        challenge.unit = 'J';
        challenge.W = W;
      } else if (questionType === 'heat-rejected') {
        challenge.Q_h = Q_h;
        challenge.W = Math.round(W);
        challenge.efficiency = efficiency;
        challenge.question = `Động cơ nhiệt nhận ${Q_h} J, sinh công ${Math.round(W)} J. Nhiệt thải ra nguồn lạnh (J) là?`;
        challenge.correctAnswer = Math.round(Q_c);
        challenge.unit = 'J';
        challenge.Q_c = Q_c;
      } else {
        challenge.W = Math.round(W);
        challenge.efficiency = efficiency;
        challenge.Q_c = Math.round(Q_c);
        const Q_h_calc = W / (efficiency / 100);
        challenge.question = `Động cơ nhiệt có hiệu suất ${efficiency}%, sinh công ${Math.round(W)} J. Nhiệt nhận từ nguồn nóng (J) là?`;
        challenge.correctAnswer = Math.round(Q_h_calc);
        challenge.unit = 'J';
        challenge.Q_h = Q_h_calc;
      }
    } else if (engineType === 'refrigerator') {
      // Máy lạnh: COP_c = Q_c/W
      const Q_c = Math.round(Math.random() * 800 + 1200); // 1200-2000 J
      const COP_c = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3-5
      
      const W = Q_c / COP_c;
      const Q_h = Q_c + W;
      
      const questionTypes = ['cop', 'work', 'heat-absorbed', 'heat-rejected'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (questionType === 'cop') {
        challenge.Q_c = Q_c;
        challenge.W = Math.round(W);
        challenge.Q_h = Math.round(Q_h);
        challenge.question = `Máy lạnh hấp thụ ${Q_c} J từ khoang lạnh, tiêu thụ công ${Math.round(W)} J. Hệ số làm lạnh COP là?`;
        challenge.correctAnswer = COP_c;
        challenge.unit = '';
        challenge.COP = COP_c;
      } else if (questionType === 'work') {
        challenge.Q_c = Q_c;
        challenge.COP = COP_c;
        challenge.Q_h = Math.round(Q_h);
        challenge.question = `Máy lạnh có COP=${COP_c}, hấp thụ ${Q_c} J từ khoang lạnh. Công tiêu thụ (J) là?`;
        challenge.correctAnswer = Math.round(W);
        challenge.unit = 'J';
        challenge.W = W;
      } else if (questionType === 'heat-absorbed') {
        challenge.W = Math.round(W);
        challenge.COP = COP_c;
        challenge.Q_h = Math.round(Q_h);
        challenge.question = `Máy lạnh có COP=${COP_c}, tiêu thụ công ${Math.round(W)} J. Nhiệt hấp thụ từ khoang lạnh (J) là?`;
        challenge.correctAnswer = Q_c;
        challenge.unit = 'J';
        challenge.Q_c = Q_c;
      } else {
        challenge.Q_c = Q_c;
        challenge.W = Math.round(W);
        challenge.COP = COP_c;
        challenge.question = `Máy lạnh hấp thụ ${Q_c} J từ khoang lạnh, tiêu thụ ${Math.round(W)} J. Nhiệt thải ra môi trường (J) là?`;
        challenge.correctAnswer = Math.round(Q_h);
        challenge.unit = 'J';
        challenge.Q_h = Q_h;
      }
    } else if (engineType === 'heat-pump') {
      // Bơm nhiệt: COP_h = Q_h/W
      const Q_h = Math.round(Math.random() * 1000 + 2500); // 2500-3500 J
      const COP_h = Math.round((Math.random() * 2 + 4) * 10) / 10; // 4-6
      
      const W = Q_h / COP_h;
      const Q_c = Q_h - W;
      
      const questionTypes = ['cop', 'work', 'heat-delivered', 'heat-extracted'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (questionType === 'cop') {
        challenge.Q_h = Q_h;
        challenge.W = Math.round(W);
        challenge.Q_c = Math.round(Q_c);
        challenge.question = `Bơm nhiệt cung cấp ${Q_h} J cho phòng, tiêu thụ công ${Math.round(W)} J. Hệ số sưởi ấm COP là?`;
        challenge.correctAnswer = COP_h;
        challenge.unit = '';
        challenge.COP = COP_h;
      } else if (questionType === 'work') {
        challenge.Q_h = Q_h;
        challenge.COP = COP_h;
        challenge.Q_c = Math.round(Q_c);
        challenge.question = `Bơm nhiệt có COP=${COP_h}, cung cấp ${Q_h} J cho phòng. Công tiêu thụ (J) là?`;
        challenge.correctAnswer = Math.round(W);
        challenge.unit = 'J';
        challenge.W = W;
      } else if (questionType === 'heat-delivered') {
        challenge.W = Math.round(W);
        challenge.COP = COP_h;
        challenge.Q_c = Math.round(Q_c);
        challenge.question = `Bơm nhiệt có COP=${COP_h}, tiêu thụ công ${Math.round(W)} J. Nhiệt cung cấp cho phòng (J) là?`;
        challenge.correctAnswer = Q_h;
        challenge.unit = 'J';
        challenge.Q_h = Q_h;
      } else {
        challenge.Q_h = Q_h;
        challenge.W = Math.round(W);
        challenge.COP = COP_h;
        challenge.question = `Bơm nhiệt cung cấp ${Q_h} J cho phòng, tiêu thụ ${Math.round(W)} J. Nhiệt lấy từ môi trường (J) là?`;
        challenge.correctAnswer = Math.round(Q_c);
        challenge.unit = 'J';
        challenge.Q_c = Q_c;
      }
    } else if (engineType === 'carnot-efficiency') {
      // So sánh hiệu suất thực tế với Carnot
      const T_h = Math.round(Math.random() * 200 + 500); // 500-700 K
      const T_c = Math.round(Math.random() * 100 + 300); // 300-400 K
      const efficiency_carnot = (1 - T_c / T_h) * 100;
      const efficiency_real = efficiency_carnot * (Math.random() * 0.2 + 0.6); // 60-80% hiệu suất Carnot
      
      const questionTypes = ['carnot-efficiency', 'real-efficiency-ratio', 'temperature-effect'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.T_h = T_h;
      challenge.T_c = T_c;
      challenge.efficiency_carnot = efficiency_carnot;
      challenge.efficiency_real = efficiency_real;
      
      if (questionType === 'carnot-efficiency') {
        challenge.question = `Hiệu suất tối đa (Carnot) của động cơ hoạt động giữa ${T_h}K và ${T_c}K là bao nhiêu (%)?`;
        challenge.correctAnswer = Math.round(efficiency_carnot * 10) / 10;
        challenge.unit = '%';
      } else if (questionType === 'real-efficiency-ratio') {
        const ratio = Math.round((efficiency_real / efficiency_carnot) * 100);
        challenge.ratio = ratio;
        challenge.question = `Động cơ thực tế có hiệu suất ${Math.round(efficiency_real * 10) / 10}% giữa ${T_h}K và ${T_c}K. Tỉ lệ so với Carnot (%) là?`;
        challenge.correctAnswer = ratio;
        challenge.unit = '%';
      } else {
        // Nhiệt độ nguồn nóng tăng lên, hiệu suất thay đổi
        const T_h_new = T_h + 50;
        const efficiency_new = (1 - T_c / T_h_new) * 100;
        const improvement = efficiency_new - efficiency_carnot;
        challenge.T_h_new = T_h_new;
        challenge.efficiency_new = efficiency_new;
        challenge.question = `Động cơ Carnot hoạt động giữa ${T_c}K và ${T_h}K. Nếu tăng nguồn nóng lên ${T_h_new}K, hiệu suất tăng thêm bao nhiêu (%)?`;
        challenge.correctAnswer = Math.round(improvement * 10) / 10;
        challenge.unit = '%';
      }
    }

    return challenge;
  }, []);

  // Vẽ canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentChallenge) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawScene = () => {
      ctx.clearRect(0, 0, width, height);

      if (currentChallenge.engineType === 'heat-engine') {
        drawHeatEngine(ctx, width, height);
      } else if (currentChallenge.engineType === 'refrigerator') {
        drawRefrigerator(ctx, width, height);
      } else if (currentChallenge.engineType === 'heat-pump') {
        drawHeatPump(ctx, width, height);
      } else if (currentChallenge.engineType === 'carnot-efficiency') {
        drawCarnotComparison(ctx, width, height);
      }
    };

    const drawHeatEngine = (ctx, w, h) => {
      const { Q_h, W, Q_c, efficiency } = currentChallenge;
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Nguồn nóng
      const hotY = centerY - 120;
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(centerX - 80, hotY - 30, 160, 60);
      ctx.strokeStyle = '#c92a2a';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 80, hotY - 30, 160, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Nguồn nóng', centerX, hotY - 5);
      ctx.fillText(`T_h`, centerX, hotY + 15);
      
      // Động cơ
      const engineRadius = 60;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(centerX, centerY, engineRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Quay động cơ
      const rotation = animationProgress * Math.PI * 4;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 40, Math.sin(angle) * 40);
        ctx.stroke();
      }
      ctx.restore();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Engine', centerX, centerY - 5);
      if (efficiency !== undefined) {
        ctx.fillText(`η=${efficiency.toFixed(1)}%`, centerX, centerY + 12);
      }
      
      // Nguồn lạnh
      const coldY = centerY + 120;
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(centerX - 80, coldY - 30, 160, 60);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 80, coldY - 30, 160, 60);
      
      ctx.fillStyle = 'white';
      ctx.fillText('Nguồn lạnh', centerX, coldY - 5);
      ctx.fillText(`T_c`, centerX, coldY + 15);
      
      // Dòng nhiệt Q_h
      if (Q_h !== undefined) {
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, hotY + 30);
        ctx.lineTo(centerX, centerY - engineRadius);
        ctx.stroke();
        
        // Mũi tên
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - engineRadius);
        ctx.lineTo(centerX - 8, centerY - engineRadius - 12);
        ctx.lineTo(centerX + 8, centerY - engineRadius - 12);
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_h=${Q_h}J`, centerX + 60, hotY + 50);
      }
      
      // Dòng nhiệt Q_c
      if (Q_c !== undefined) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + engineRadius);
        ctx.lineTo(centerX, coldY - 30);
        ctx.stroke();
        
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(centerX, coldY - 30);
        ctx.lineTo(centerX - 8, coldY - 18);
        ctx.lineTo(centerX + 8, coldY - 18);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_c=${Math.round(Q_c)}J`, centerX + 60, coldY - 10);
      }
      
      // Công W
      if (W !== undefined) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX + engineRadius, centerY);
        ctx.lineTo(centerX + engineRadius + 80, centerY);
        ctx.stroke();
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(centerX + engineRadius + 80, centerY);
        ctx.lineTo(centerX + engineRadius + 68, centerY - 8);
        ctx.lineTo(centerX + engineRadius + 68, centerY + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`W=${Math.round(W)}J`, centerX + engineRadius + 40, centerY - 15);
      }
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('η = W/Q_h = (Q_h - Q_c)/Q_h', 30, h - 10);
    };

    const drawRefrigerator = (ctx, w, h) => {
      const { Q_c, W, Q_h, COP } = currentChallenge;
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Khoang lạnh
      const coldBoxX = centerX - 100;
      const coldBoxY = centerY - 80;
      ctx.fillStyle = '#cce7ff';
      ctx.fillRect(coldBoxX, coldBoxY, 200, 160);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 4;
      ctx.strokeRect(coldBoxX, coldBoxY, 200, 160);
      
      // Vật trong tủ lạnh
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(coldBoxX + 70, coldBoxY + 60, 60, 80);
      ctx.strokeStyle = '#c92a2a';
      ctx.lineWidth = 2;
      ctx.strokeRect(coldBoxX + 70, coldBoxY + 60, 60, 80);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Khoang lạnh', centerX, coldBoxY + 30);
      ctx.fillText(`T_c (lạnh)`, centerX, coldBoxY + 50);
      
      // Compressor (máy nén)
      const compX = centerX + 180;
      const compY = centerY;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(compX, compY, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Quay compressor
      const rotation = animationProgress * Math.PI * 4;
      ctx.save();
      ctx.translate(compX, compY);
      ctx.rotate(rotation);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
        ctx.stroke();
      }
      ctx.restore();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Máy nén', compX, compY);
      
      // Dàn nóng (bên ngoài)
      const hotCoilY = centerY - 150;
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const x = centerX - 80 + i * 40;
        ctx.moveTo(x, hotCoilY);
        ctx.lineTo(x, hotCoilY - 30);
        ctx.lineTo(x + 20, hotCoilY - 30);
        ctx.lineTo(x + 20, hotCoilY);
      }
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Dàn nóng (T_h)', centerX, hotCoilY - 40);
      
      // Mũi tên Q_c (nhiệt hấp thụ)
      if (Q_c !== undefined) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, coldBoxY + 160);
        ctx.lineTo(centerX, coldBoxY + 200);
        ctx.stroke();
        
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(centerX, coldBoxY + 200);
        ctx.lineTo(centerX - 8, coldBoxY + 188);
        ctx.lineTo(centerX + 8, coldBoxY + 188);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_c=${Q_c}J`, centerX - 70, coldBoxY + 190);
      }
      
      // Mũi tên Q_h (nhiệt thải)
      if (Q_h !== undefined) {
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, hotCoilY - 30);
        ctx.lineTo(centerX, hotCoilY - 60);
        ctx.stroke();
        
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(centerX, hotCoilY - 60);
        ctx.lineTo(centerX - 8, hotCoilY - 48);
        ctx.lineTo(centerX + 8, hotCoilY - 48);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#c92a2a';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_h=${Math.round(Q_h)}J`, centerX + 60, hotCoilY - 50);
      }
      
      // Công W
      if (W !== undefined) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(compX - 50, compY - 30);
        ctx.lineTo(compX - 80, compY - 30);
        ctx.stroke();
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(compX - 50, compY - 30);
        ctx.lineTo(compX - 62, compY - 38);
        ctx.lineTo(compX - 62, compY - 22);
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`W=${Math.round(W)}J`, compX - 90, compY - 40);
      }
      
      // COP
      if (COP !== undefined) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`COP=${COP.toFixed(1)}`, compX, compY + 20);
      }
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('COP_c = Q_c/W (Máy lạnh)', 30, h - 10);
    };

    const drawHeatPump = (ctx, w, h) => {
      const { Q_h, W, Q_c, COP } = currentChallenge;
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Phòng (nhận nhiệt)
      const roomX = centerX - 100;
      const roomY = centerY - 100;
      ctx.fillStyle = '#ffe0cc';
      ctx.fillRect(roomX, roomY, 200, 180);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 4;
      ctx.strokeRect(roomX, roomY, 200, 180);
      
      // Nhiệt kế trong phòng
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(roomX + 40, roomY + 50);
      ctx.lineTo(roomX + 40, roomY + 120);
      ctx.stroke();
      
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(roomX + 40, roomY + 130, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Phòng ấm', centerX, roomY + 30);
      ctx.fillText(`T_h (nóng)`, centerX, roomY + 50);
      
      // Bơm nhiệt
      const pumpX = centerX + 180;
      const pumpY = centerY;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(pumpX - 40, pumpY - 50, 80, 100);
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 4;
      ctx.strokeRect(pumpX - 40, pumpY - 50, 80, 100);
      
      // Quạt quay
      const rotation = animationProgress * Math.PI * 4;
      ctx.save();
      ctx.translate(pumpX, pumpY);
      ctx.rotate(rotation);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 25, Math.sin(angle) * 25);
        ctx.lineTo(Math.cos(angle + 0.5) * 15, Math.sin(angle + 0.5) * 15);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Heat', pumpX, pumpY - 8);
      ctx.fillText('Pump', pumpX, pumpY + 8);
      
      // Môi trường bên ngoài (lạnh)
      const envY = centerY + 140;
      ctx.fillStyle = '#cce7ff';
      ctx.fillRect(centerX - 80, envY, 160, 50);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 80, envY, 160, 50);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Môi trường (T_c)', centerX, envY + 30);
      
      // Mũi tên Q_h (nhiệt cung cấp)
      if (Q_h !== undefined) {
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(pumpX, pumpY - 50);
        ctx.lineTo(centerX, roomY + 180);
        ctx.stroke();
        
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(centerX, roomY + 180);
        ctx.lineTo(centerX - 8, roomY + 168);
        ctx.lineTo(centerX + 8, roomY + 168);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#c92a2a';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_h=${Q_h}J`, centerX + 40, roomY + 150);
      }
      
      // Mũi tên Q_c (nhiệt lấy từ ngoài)
      if (Q_c !== undefined) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, envY);
        ctx.lineTo(pumpX, pumpY + 50);
        ctx.stroke();
        
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(pumpX, pumpY + 50);
        ctx.lineTo(pumpX - 10, pumpY + 42);
        ctx.lineTo(pumpX + 2, pumpY + 38);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Q_c=${Math.round(Q_c)}J`, centerX + 40, envY - 10);
      }
      
      // Công W
      if (W !== undefined) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pumpX + 40, pumpY);
        ctx.lineTo(pumpX + 90, pumpY);
        ctx.stroke();
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(pumpX + 40, pumpY);
        ctx.lineTo(pumpX + 52, pumpY - 8);
        ctx.lineTo(pumpX + 52, pumpY + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`W=${Math.round(W)}J`, pumpX + 50, pumpY - 15);
      }
      
      // COP
      if (COP !== undefined) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`COP=${COP.toFixed(1)}`, pumpX, pumpY + 80);
      }
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('COP_h = Q_h/W (Bơm nhiệt)', 30, h - 10);
    };

    const drawCarnotComparison = (ctx, w, h) => {
      const { T_h, T_c, efficiency_carnot, efficiency_real, ratio, T_h_new, efficiency_new } = currentChallenge;
      
      // Biểu đồ so sánh
      const graphX = 100;
      const graphY = h / 2 + 80;
      const barWidth = 80;
      const maxHeight = 200;
      
      // Trục
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - maxHeight);
      ctx.lineTo(graphX, graphY);
      ctx.lineTo(graphX + 350, graphY);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(graphX - 40, graphY - maxHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Hiệu suất (%)', 0, 0);
      ctx.restore();
      
      // Thanh Carnot
      const carnotHeight = (efficiency_carnot / 100) * maxHeight;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(graphX + 50, graphY - carnotHeight, barWidth, carnotHeight);
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 3;
      ctx.strokeRect(graphX + 50, graphY - carnotHeight, barWidth, carnotHeight);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Carnot', graphX + 90, graphY + 25);
      ctx.fillText(`${efficiency_carnot.toFixed(1)}%`, graphX + 90, graphY - carnotHeight - 10);
      
      // Thanh thực tế (nếu có)
      if (efficiency_real !== undefined) {
        const realHeight = (efficiency_real / 100) * maxHeight;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(graphX + 170, graphY - realHeight, barWidth, realHeight);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.strokeRect(graphX + 170, graphY - realHeight, barWidth, realHeight);
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText('Thực tế', graphX + 210, graphY + 25);
        ctx.fillText(`${efficiency_real.toFixed(1)}%`, graphX + 210, graphY - realHeight - 10);
        
        // Tỉ lệ
        if (ratio !== undefined) {
          ctx.font = 'bold 14px Arial';
          ctx.fillText(`${ratio}% Carnot`, graphX + 210, graphY - realHeight - 30);
        }
      }
      
      // Thanh cải tiến (nếu có)
      if (efficiency_new !== undefined) {
        const newHeight = (efficiency_new / 100) * maxHeight;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(graphX + 170, graphY - newHeight, barWidth, newHeight);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.strokeRect(graphX + 170, graphY - newHeight, barWidth, newHeight);
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText('Cải tiến', graphX + 210, graphY + 25);
        ctx.fillText(`${efficiency_new.toFixed(1)}%`, graphX + 210, graphY - newHeight - 10);
      }
      
      // Thông tin nhiệt độ
      const infoX = w - 250;
      const infoY = 80;
      
      ctx.fillStyle = '#fee2e2';
      ctx.fillRect(infoX - 10, infoY - 10, 220, 70);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.strokeRect(infoX - 10, infoY - 10, 220, 70);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Nguồn nóng: T_h = ${T_h} K`, infoX, infoY + 10);
      ctx.fillText(`Nguồn lạnh: T_c = ${T_c} K`, infoX, infoY + 35);
      
      if (T_h_new !== undefined) {
        ctx.fillStyle = '#dcfce7';
        ctx.fillRect(infoX - 10, infoY + 60, 220, 40);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(infoX - 10, infoY + 60, 220, 40);
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText(`T_h mới: ${T_h_new} K`, infoX, infoY + 85);
      }
      
      // Động cơ hoạt động
      const engineX = w / 2 + 100;
      const engineY = h / 2 - 80;
      
      // Nguồn nóng
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(engineX - 60, engineY - 80, 120, 50);
      ctx.strokeStyle = '#c92a2a';
      ctx.lineWidth = 3;
      ctx.strokeRect(engineX - 60, engineY - 80, 120, 50);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`T_h=${T_h}K`, engineX, engineY - 50);
      
      // Động cơ
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(engineX, engineY, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Quay
      const rotation = animationProgress * Math.PI * 4;
      ctx.save();
      ctx.translate(engineX, engineY);
      ctx.rotate(rotation);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 25, Math.sin(angle) * 25);
        ctx.stroke();
      }
      ctx.restore();
      
      // Nguồn lạnh
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(engineX - 60, engineY + 30, 120, 50);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.strokeRect(engineX - 60, engineY + 30, 120, 50);
      
      ctx.fillStyle = 'white';
      ctx.fillText(`T_c=${T_c}K`, engineX, engineY + 60);
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('η_Carnot = 1 - T_c/T_h (hiệu suất tối đa)', 30, h - 10);
    };

    // Animation loop
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.008;
        return newProgress >= 1 ? 0 : newProgress;
      });
      
      drawScene();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentChallenge, animationProgress]);

  const startLevel = (levelNum) => {
    setLevel(levelNum);
    setScore(0);
    setChallengesCompleted(0);
    setGameState('playing');
    setCurrentChallenge(generateChallenge(levelNum));
    setUserAnswer('');
    setFeedback('');
    setShowingAnswer(false);
    setAnimationProgress(0);
  };

  const checkAnswer = () => {
    const userValue = parseFloat(userAnswer);
    if (isNaN(userValue)) {
      setFeedback('Vui lòng nhập số hợp lệ!');
      return;
    }

    const tolerance = 0.08;
    const diff = Math.abs(userValue - currentChallenge.correctAnswer);
    const isCorrect = diff <= Math.abs(currentChallenge.correctAnswer * tolerance);

    if (isCorrect) {
      const points = 100;
      setScore(prev => prev + points);
      setFeedback(`Chính xác! +${points} điểm`);
      setShowingAnswer(true);

      setTimeout(() => {
        const newCompleted = challengesCompleted + 1;
        if (newCompleted >= CHALLENGES_PER_LEVEL) {
          setGameState('victory');
        } else {
          setChallengesCompleted(newCompleted);
          setCurrentChallenge(generateChallenge(level));
          setUserAnswer('');
          setFeedback('');
          setShowingAnswer(false);
          setAnimationProgress(0);
        }
      }, 2000);
    } else {
      setFeedback(`Sai rồi! Đáp án đúng: ${currentChallenge.correctAnswer.toFixed(2)} ${currentChallenge.unit}`);
      setShowingAnswer(true);
      setTimeout(() => {
        setUserAnswer('');
        setFeedback('');
        setShowingAnswer(false);
        setAnimationProgress(0);
      }, 3000);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="heat-engine-optimizer">
        <div className="game-menu">
          <div className="menu-header">
            <Settings size={60} className="menu-icon" />
            <h1>Heat Engine Optimizer</h1>
            <p className="menu-subtitle">Tối ưu hóa động cơ nhiệt và thiết bị nhiệt động</p>
          </div>

          <div className="theory-section">
            <h2><Gauge size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Động cơ nhiệt (Heat Engine)</h3>
              <p><strong>Hiệu suất:</strong> η = W/Q_h = (Q_h - Q_c)/Q_h</p>
              <p>Chuyển nhiệt năng thành cơ năng</p>
            </div>

            <div className="theory-box">
              <h3>2. Máy lạnh (Refrigerator)</h3>
              <p><strong>Hệ số làm lạnh:</strong> COP_c = Q_c/W</p>
              <p>Lấy nhiệt từ khoang lạnh, thải ra môi trường</p>
            </div>

            <div className="theory-box">
              <h3>3. Bơm nhiệt (Heat Pump)</h3>
              <p><strong>Hệ số sưởi ấm:</strong> COP_h = Q_h/W</p>
              <p>Lấy nhiệt từ môi trường, cung cấp cho phòng</p>
            </div>

            <div className="theory-box">
              <h3>4. Hiệu suất Carnot</h3>
              <p><strong>Hiệu suất tối đa:</strong> η_Carnot = 1 - T_c/T_h</p>
              <p>Giới hạn lý thuyết của mọi động cơ nhiệt</p>
            </div>
          </div>

          <div className="level-selector">
            <h2><Target size={24} /> Chọn cấp độ</h2>
            <div className="level-grid">
              {[1, 2, 3, 4].map(levelNum => (
                <button
                  key={levelNum}
                  onClick={() => startLevel(levelNum)}
                  className="level-button"
                >
                  <span className="level-number">Level {levelNum}</span>
                  <span className="level-challenges">{CHALLENGES_PER_LEVEL} thử thách</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="heat-engine-optimizer">
        <div className="game-playing">
          <div className="game-header">
            <button onClick={() => setGameState('menu')} className="back-button">
              ← Menu
            </button>
            <div className="game-stats">
              <div className="stat">
                <Target size={20} />
                <span>Level {level}</span>
              </div>
              <div className="stat">
                <Trophy size={20} />
                <span>{score} điểm</span>
              </div>
              <div className="stat">
                <TrendingUp size={20} />
                <span>{challengesCompleted}/{CHALLENGES_PER_LEVEL}</span>
              </div>
            </div>
          </div>

          {currentChallenge && (
            <>
              <div className="challenge-question">
                <h2>{currentChallenge.question}</h2>
              </div>

              <div className="animation-area">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="physics-canvas"
                />
              </div>

              <div className="answer-section">
                <div className="input-group">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    disabled={showingAnswer}
                    onKeyPress={(e) => e.key === 'Enter' && !showingAnswer && checkAnswer()}
                    className="answer-input"
                  />
                  <span className="input-unit">{currentChallenge.unit}</span>
                </div>
                
                <button
                  onClick={checkAnswer}
                  disabled={showingAnswer || !userAnswer}
                  className="submit-button"
                >
                  Kiểm tra
                </button>
              </div>

              {feedback && (
                <div className={`feedback ${feedback.includes('Chính xác') ? 'correct' : 'incorrect'}`}>
                  {feedback}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="heat-engine-optimizer">
        <div className="victory-screen">
          <Trophy size={80} className="victory-icon" />
          <h1>Tuyệt vời!</h1>
          <p className="victory-message">Bạn đã hoàn thành Level {level}</p>
          
          <div className="victory-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thử thách</span>
              <span className="stat-value">{CHALLENGES_PER_LEVEL}/{CHALLENGES_PER_LEVEL}</span>
            </div>
          </div>

          <div className="victory-actions">
            {level < TOTAL_LEVELS && (
              <button onClick={() => startLevel(level + 1)} className="next-button">
                Level tiếp theo →
              </button>
            )}
            <button onClick={() => startLevel(level)} className="retry-button">
              Chơi lại Level {level}
            </button>
            <button onClick={() => setGameState('menu')} className="menu-button">
              Về Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default HeatEngineOptimizer;
