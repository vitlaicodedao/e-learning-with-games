import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Wind, Activity, Gauge } from 'lucide-react';
import './GasLawsExplorer.css';

const GasLawsExplorer = () => {
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
  const R = 8.314; // J/(mol·K) - Hằng số khí lý tưởng

  // Loại scenario
  const scenarioTypes = ['ideal-gas', 'isothermal', 'isobaric', 'isochoric'];

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    let challenge = { scenarioType };

    if (scenarioType === 'ideal-gas') {
      // Phương trình khí lý tưởng: PV = nRT
      const questionTypes = ['pressure', 'volume', 'moles', 'temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      const n = Math.round((Math.random() * 5 + 1) * 10) / 10; // 1-6 mol
      const T = Math.round(Math.random() * 100 + 273); // 273-373 K
      const V = Math.round((Math.random() * 20 + 5) * 10) / 10; // 5-25 L
      const P = (n * R * T) / (V / 1000); // Pa (V chuyển sang m³)
      
      challenge.n = n;
      challenge.T = T;
      challenge.V = V;
      challenge.P = P;
      
      if (questionType === 'pressure') {
        challenge.question = `Có ${n} mol khí lý tưởng ở ${T} K trong bình ${V} L. Áp suất (Pa) của khí là bao nhiêu?`;
        challenge.correctAnswer = Math.round(P);
        challenge.unit = 'Pa';
      } else if (questionType === 'volume') {
        const knownP = Math.round(P / 1000) * 1000; // Làm tròn áp suất
        challenge.P = knownP;
        const correctV = (n * R * T) / knownP * 1000; // L
        challenge.question = `Có ${n} mol khí lý tưởng ở ${T} K và áp suất ${knownP} Pa. Thể tích (L) của khí là bao nhiêu?`;
        challenge.correctAnswer = Math.round(correctV * 10) / 10;
        challenge.unit = 'L';
        challenge.V = challenge.correctAnswer;
      } else if (questionType === 'moles') {
        const knownP = Math.round(P / 1000) * 1000;
        challenge.P = knownP;
        const correctN = (knownP * V / 1000) / (R * T);
        challenge.question = `Khí lý tưởng ở ${T} K, áp suất ${knownP} Pa, thể tích ${V} L. Số mol khí là bao nhiêu?`;
        challenge.correctAnswer = Math.round(correctN * 10) / 10;
        challenge.unit = 'mol';
        challenge.n = challenge.correctAnswer;
      } else {
        const knownP = Math.round(P / 1000) * 1000;
        challenge.P = knownP;
        const correctT = (knownP * V / 1000) / (n * R);
        challenge.question = `Có ${n} mol khí lý tưởng ở áp suất ${knownP} Pa trong bình ${V} L. Nhiệt độ (K) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(correctT);
        challenge.unit = 'K';
        challenge.T = challenge.correctAnswer;
      }
    } else if (scenarioType === 'isothermal') {
      // Quá trình đẳng nhiệt: P₁V₁ = P₂V₂
      const P1 = Math.round((Math.random() * 300 + 100) * 1000); // 100-400 kPa
      const V1 = Math.round((Math.random() * 15 + 5) * 10) / 10; // 5-20 L
      const V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
      while (Math.abs(V2 - V1) < 2) {
        V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
      }
      const P2 = (P1 * V1) / V2;
      
      const questionTypes = ['final-pressure', 'final-volume'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.P1 = P1;
      challenge.V1 = V1;
      challenge.T = Math.round(Math.random() * 50 + 273); // Nhiệt độ không đổi
      
      if (questionType === 'final-pressure') {
        challenge.V2 = V2;
        challenge.question = `Khí lý tưởng giãn nở đẳng nhiệt từ ${V1} L đến ${V2} L. Áp suất ban đầu ${P1/1000} kPa. Áp suất cuối (kPa) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(P2 / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P2 = P2;
      } else {
        challenge.P2 = P2;
        challenge.question = `Khí lý tưởng nén đẳng nhiệt từ ${P1/1000} kPa đến ${P2/1000} kPa. Thể tích ban đầu ${V1} L. Thể tích cuối (L) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(V2 * 10) / 10;
        challenge.unit = 'L';
        challenge.V2 = V2;
      }
    } else if (scenarioType === 'isobaric') {
      // Quá trình đẳng áp: V₁/T₁ = V₂/T₂
      const V1 = Math.round((Math.random() * 10 + 5) * 10) / 10;
      const T1 = Math.round(Math.random() * 50 + 273); // 273-323 K
      const T2 = Math.round(Math.random() * 100 + 323); // 323-423 K
      const V2 = (V1 * T2) / T1;
      
      const P = Math.round((Math.random() * 200 + 100) * 1000); // Áp suất không đổi
      
      const questionTypes = ['final-volume', 'final-temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.P = P;
      challenge.V1 = V1;
      challenge.T1 = T1;
      
      if (questionType === 'final-volume') {
        challenge.T2 = T2;
        challenge.question = `Khí đun nóng đẳng áp từ ${T1} K đến ${T2} K. Thể tích ban đầu ${V1} L. Thể tích cuối (L) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(V2 * 10) / 10;
        challenge.unit = 'L';
        challenge.V2 = V2;
      } else {
        challenge.V2 = V2;
        challenge.question = `Khí giãn nở đẳng áp từ ${V1} L đến ${V2} L. Nhiệt độ ban đầu ${T1} K. Nhiệt độ cuối (K) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(T2);
        challenge.unit = 'K';
        challenge.T2 = T2;
      }
    } else if (scenarioType === 'isochoric') {
      // Quá trình đẳng tích: P₁/T₁ = P₂/T₂
      const P1 = Math.round((Math.random() * 200 + 100) * 1000);
      const T1 = Math.round(Math.random() * 50 + 273);
      const T2 = Math.round(Math.random() * 100 + 323);
      const P2 = (P1 * T2) / T1;
      
      const V = Math.round((Math.random() * 10 + 5) * 10) / 10; // Thể tích không đổi
      
      const questionTypes = ['final-pressure', 'final-temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.V = V;
      challenge.P1 = P1;
      challenge.T1 = T1;
      
      if (questionType === 'final-pressure') {
        challenge.T2 = T2;
        challenge.question = `Khí đun nóng đẳng tích từ ${T1} K đến ${T2} K. Áp suất ban đầu ${P1/1000} kPa. Áp suất cuối (kPa) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(P2 / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P2 = P2;
      } else {
        challenge.P2 = P2;
        challenge.question = `Khí tăng áp đẳng tích từ ${P1/1000} kPa đến ${P2/1000} kPa. Nhiệt độ ban đầu ${T1} K. Nhiệt độ cuối (K) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(T2);
        challenge.unit = 'K';
        challenge.T2 = T2;
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

      if (currentChallenge.scenarioType === 'ideal-gas') {
        drawIdealGas(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'isothermal') {
        drawIsothermal(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'isobaric') {
        drawIsobaric(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'isochoric') {
        drawIsochoric(ctx, width, height);
      }
    };

    const drawIdealGas = (ctx, w, h) => {
      const { P, V, T, n } = currentChallenge;
      
      // Bình chứa khí
      const containerX = w / 2;
      const containerY = h / 2 + 20;
      const containerW = 200;
      const containerH = 150;
      
      // Vẽ bình
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      
      // Vẽ các phân tử khí (số lượng tỉ lệ với n)
      const numParticles = Math.min(Math.round(n * 10), 50);
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + animationProgress * 2;
        const radius = 60 + Math.sin(i * 0.5 + animationProgress * 5) * 20;
        const px = containerX + Math.cos(angle) * radius;
        const py = containerY + Math.sin(angle) * radius * 0.6;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Vectơ vận tốc ngẫu nhiên
        const vx = Math.cos(angle + Math.PI / 4) * 8;
        const vy = Math.sin(angle + Math.PI / 4) * 5;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + vx, py + vy);
        ctx.stroke();
      }
      
      // Đồng hồ đo áp suất
      const gaugeX = containerX - containerW / 2 - 60;
      const gaugeY = containerY - containerH / 2 + 30;
      const gaugeRadius = 30;
      
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Kim đồng hồ (tỉ lệ với áp suất)
      const needleAngle = -Math.PI / 2 + (P / 500000) * Math.PI; // Max 500 kPa
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(
        gaugeX + Math.cos(needleAngle) * (gaugeRadius - 5),
        gaugeY + Math.sin(needleAngle) * (gaugeRadius - 5)
      );
      ctx.stroke();
      
      // Nhiệt kế
      const thermometerX = containerX + containerW / 2 + 50;
      const thermometerY = containerY - containerH / 2 + 20;
      const thermometerH = 100;
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(thermometerX - 5, thermometerY, 10, thermometerH);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(thermometerX - 5, thermometerY, 10, thermometerH);
      
      // Bulb
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(thermometerX, thermometerY + thermometerH + 8, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Thủy ngân (tỉ lệ với nhiệt độ)
      const mercuryHeight = ((T - 273) / 150) * thermometerH;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(thermometerX - 3, thermometerY + thermometerH - mercuryHeight, 6, mercuryHeight);
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`P = ${Math.round(P/1000)} kPa`, containerX, containerY + containerH / 2 + 40);
      ctx.fillText(`V = ${V} L`, containerX, containerY + containerH / 2 + 65);
      ctx.fillText(`T = ${T} K`, containerX, containerY + containerH / 2 + 90);
      ctx.fillText(`n = ${n} mol`, containerX, containerY + containerH / 2 + 115);
    };

    const drawIsothermal = (ctx, w, h) => {
      const { P1, V1, P2, V2, T } = currentChallenge;
      
      // Trạng thái 1 (bên trái)
      const state1X = 200;
      const state1Y = h / 2;
      const container1W = 100 + V1 * 5;
      const container1H = 120;
      
      // Nội suy giữa trạng thái 1 và 2
      const currentV = V1 + (V2 - V1) * animationProgress;
      const currentP = (P1 * V1) / currentV;
      const currentW = 100 + currentV * 5;
      
      // Bình giãn nở
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(state1X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(state1X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      
      // Piston di chuyển
      const pistonX = state1X + currentW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX - 5, state1Y - container1H / 2, 10, container1H);
      
      // Vẽ các phân tử (mật độ thay đổi)
      const numParticles = 30;
      for (let i = 0; i < numParticles; i++) {
        const px = state1X - currentW / 2 + 20 + (i % 5) * (currentW - 40) / 5 + Math.sin(animationProgress * 10 + i) * 5;
        const py = state1Y - container1H / 2 + 20 + Math.floor(i / 5) * 20 + Math.cos(animationProgress * 10 + i) * 5;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Biểu đồ P-V
      const graphX = 550;
      const graphY = h / 2;
      const graphW = 200;
      const graphH = 150;
      
      // Trục
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      // Nhãn
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('V', graphX + graphW / 2, graphY + graphH / 2 + 25);
      ctx.save();
      ctx.translate(graphX - 20, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // Đường cong đẳng nhiệt (hyperbola)
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 1; i += 0.01) {
        const v = V1 + (V2 - V1) * i;
        const p = (P1 * V1) / v;
        const x = graphX + ((v - V1) / (V2 - V1)) * graphW;
        const y = graphY + graphH / 2 - ((p - Math.min(P1, P2)) / (Math.max(P1, P2) - Math.min(P1, P2))) * graphH;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Điểm hiện tại
      const currentX = graphX + ((currentV - V1) / (V2 - V1)) * graphW;
      const currentY = graphY + graphH / 2 - ((currentP - Math.min(P1, P2)) / (Math.max(P1, P2) - Math.min(P1, P2))) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`P = ${Math.round(currentP/1000)} kPa`, 50, 50);
      ctx.fillText(`V = ${currentV.toFixed(1)} L`, 50, 80);
      ctx.fillText(`T = ${T} K (const)`, 50, 110);
    };

    const drawIsobaric = (ctx, w, h) => {
      const { P, V1, T1, V2, T2 } = currentChallenge;
      
      // Nội suy
      const currentT = T1 + (T2 - T1) * animationProgress;
      const currentV = (V1 * currentT) / T1;
      
      // Bình với piston
      const containerX = 200;
      const containerY = h / 2;
      const containerW = 100 + currentV * 5;
      const containerH = 120;
      
      // Màu theo nhiệt độ
      const tempRatio = (currentT - 273) / 150;
      const gradient = ctx.createLinearGradient(0, containerY - containerH / 2, 0, containerY + containerH / 2);
      if (tempRatio < 0.3) {
        gradient.addColorStop(0, '#bfdbfe');
        gradient.addColorStop(1, '#93c5fd');
      } else if (tempRatio < 0.6) {
        gradient.addColorStop(0, '#fde68a');
        gradient.addColorStop(1, '#fcd34d');
      } else {
        gradient.addColorStop(0, '#fca5a5');
        gradient.addColorStop(1, '#f87171');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      
      // Piston
      const pistonX = containerX + containerW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX - 5, containerY - containerH / 2, 10, containerH);
      
      // Lò sưởi (nếu đang đun nóng)
      if (T2 > T1) {
        const heaterY = containerY + containerH / 2 + 30;
        ctx.fillStyle = '#ef4444';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(containerX - 40 + i * 40, heaterY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Biểu đồ V-T
      const graphX = 550;
      const graphY = h / 2;
      const graphW = 200;
      const graphH = 150;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('T', graphX + graphW / 2, graphY + graphH / 2 + 25);
      ctx.save();
      ctx.translate(graphX - 20, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('V', 0, 0);
      ctx.restore();
      
      // Đường thẳng đẳng áp
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const x1 = graphX;
      const y1 = graphY + graphH / 2 - ((V1 - Math.min(V1, V2)) / (Math.max(V1, V2) - Math.min(V1, V2))) * graphH;
      const x2 = graphX + graphW;
      const y2 = graphY + graphH / 2 - ((V2 - Math.min(V1, V2)) / (Math.max(V1, V2) - Math.min(V1, V2))) * graphH;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Điểm hiện tại
      const progress = (currentT - T1) / (T2 - T1);
      const currentX = graphX + progress * graphW;
      const currentY = graphY + graphH / 2 - ((currentV - Math.min(V1, V2)) / (Math.max(V1, V2) - Math.min(V1, V2))) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`P = ${Math.round(P/1000)} kPa (const)`, 50, 50);
      ctx.fillText(`V = ${currentV.toFixed(1)} L`, 50, 80);
      ctx.fillText(`T = ${Math.round(currentT)} K`, 50, 110);
    };

    const drawIsochoric = (ctx, w, h) => {
      const { V, P1, T1, P2, T2 } = currentChallenge;
      
      // Nội suy
      const currentT = T1 + (T2 - T1) * animationProgress;
      const currentP = (P1 * currentT) / T1;
      
      // Bình cứng (thể tích không đổi)
      const containerX = 200;
      const containerY = h / 2;
      const containerW = 120;
      const containerH = 140;
      
      // Màu theo nhiệt độ
      const tempRatio = (currentT - 273) / 150;
      const gradient = ctx.createLinearGradient(0, containerY - containerH / 2, 0, containerY + containerH / 2);
      if (tempRatio < 0.3) {
        gradient.addColorStop(0, '#bfdbfe');
        gradient.addColorStop(1, '#93c5fd');
      } else if (tempRatio < 0.6) {
        gradient.addColorStop(0, '#fde68a');
        gradient.addColorStop(1, '#fcd34d');
      } else {
        gradient.addColorStop(0, '#fca5a5');
        gradient.addColorStop(1, '#f87171');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6; // Thành dày hơn (bình cứng)
      ctx.strokeRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      
      // Đồng hồ đo áp suất
      const gaugeX = containerX;
      const gaugeY = containerY - containerH / 2 - 40;
      const gaugeRadius = 30;
      
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      const needleAngle = -Math.PI / 2 + (currentP / 600000) * Math.PI;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(
        gaugeX + Math.cos(needleAngle) * (gaugeRadius - 5),
        gaugeY + Math.sin(needleAngle) * (gaugeRadius - 5)
      );
      ctx.stroke();
      
      // Lò sưởi
      if (T2 > T1) {
        const heaterY = containerY + containerH / 2 + 30;
        ctx.fillStyle = '#ef4444';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(containerX - 40 + i * 40, heaterY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Biểu đồ P-T
      const graphX = 550;
      const graphY = h / 2;
      const graphW = 200;
      const graphH = 150;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('T', graphX + graphW / 2, graphY + graphH / 2 + 25);
      ctx.save();
      ctx.translate(graphX - 20, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // Đường thẳng đẳng tích
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const x1 = graphX;
      const y1 = graphY + graphH / 2 - ((P1 - Math.min(P1, P2)) / (Math.max(P1, P2) - Math.min(P1, P2))) * graphH;
      const x2 = graphX + graphW;
      const y2 = graphY + graphH / 2 - ((P2 - Math.min(P1, P2)) / (Math.max(P1, P2) - Math.min(P1, P2))) * graphH;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Điểm hiện tại
      const progress = (currentT - T1) / (T2 - T1);
      const currentX = graphX + progress * graphW;
      const currentY = graphY + graphH / 2 - ((currentP - Math.min(P1, P2)) / (Math.max(P1, P2) - Math.min(P1, P2))) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`V = ${V} L (const)`, 50, 50);
      ctx.fillText(`P = ${Math.round(currentP/1000)} kPa`, 50, 80);
      ctx.fillText(`T = ${Math.round(currentT)} K`, 50, 110);
    };

    // Animation loop
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.008;
        return newProgress >= 1 ? 1 : newProgress;
      });
      
      drawScene();
      
      if (animationProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentChallenge, animationProgress]);

  // Bắt đầu level
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

  // Kiểm tra câu trả lời
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

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="gas-laws-explorer">
        <div className="game-menu">
          <div className="menu-header">
            <Wind size={60} className="menu-icon" />
            <h1>Gas Laws Explorer</h1>
            <p className="menu-subtitle">Khám phá các định luật khí lý tưởng</p>
          </div>

          <div className="theory-section">
            <h2><Activity size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Phương trình khí lý tưởng</h3>
              <p><strong>Công thức:</strong> PV = nRT</p>
              <ul>
                <li>P: Áp suất (Pa)</li>
                <li>V: Thể tích (m³)</li>
                <li>n: Số mol (mol)</li>
                <li>R: Hằng số khí = 8.314 J/(mol·K)</li>
                <li>T: Nhiệt độ tuyệt đối (K)</li>
              </ul>
            </div>

            <div className="theory-box">
              <h3>2. Quá trình đẳng nhiệt (T = const)</h3>
              <p><strong>Định luật Boyle:</strong> P₁V₁ = P₂V₂</p>
              <p>Áp suất tỉ lệ nghịch với thể tích khi nhiệt độ không đổi</p>
            </div>

            <div className="theory-box">
              <h3>3. Quá trình đẳng áp (P = const)</h3>
              <p><strong>Định luật Charles:</strong> V₁/T₁ = V₂/T₂</p>
              <p>Thể tích tỉ lệ thuận với nhiệt độ khi áp suất không đổi</p>
            </div>

            <div className="theory-box">
              <h3>4. Quá trình đẳng tích (V = const)</h3>
              <p><strong>Định luật Gay-Lussac:</strong> P₁/T₁ = P₂/T₂</p>
              <p>Áp suất tỉ lệ thuận với nhiệt độ khi thể tích không đổi</p>
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

  // Render màn chơi
  if (gameState === 'playing') {
    return (
      <div className="gas-laws-explorer">
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
                <Wind size={20} />
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

  // Render màn thắng
  if (gameState === 'victory') {
    return (
      <div className="gas-laws-explorer">
        <div className="victory-screen">
          <Trophy size={80} className="victory-icon" />
          <h1>Xuất sắc!</h1>
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

export default GasLawsExplorer;
