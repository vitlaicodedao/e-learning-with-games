import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Beaker, TrendingUp, Activity } from 'lucide-react';
import './IdealGasPlayground.css';

const IdealGasPlayground = () => {
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

  // Loại scenario - các định luật khí cụ thể
  const scenarioTypes = ['boyle-law', 'charles-law', 'gay-lussac-law', 'combined-gas-law'];

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    let challenge = { scenarioType };

    if (scenarioType === 'boyle-law') {
      // Định luật Boyle: P₁V₁ = P₂V₂ (T = const)
      const P1 = Math.round((Math.random() * 300 + 100) * 1000); // 100-400 kPa
      const V1 = Math.round((Math.random() * 15 + 5) * 10) / 10; // 5-20 L
      
      const questionTypes = ['final-pressure', 'final-volume', 'initial-volume', 'initial-pressure'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.T = Math.round(Math.random() * 30 + 273); // Nhiệt độ không đổi
      challenge.P1 = P1;
      challenge.V1 = V1;
      
      if (questionType === 'final-pressure') {
        let V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
        while (Math.abs(V2 - V1) < 3) {
          V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
        }
        challenge.V2 = V2;
        const P2 = (P1 * V1) / V2;
        challenge.question = `Định luật Boyle: Khí ${V1} L ở ${P1/1000} kPa được ${V2 > V1 ? 'giãn nở' : 'nén'} đến ${V2} L (T không đổi). Áp suất cuối (kPa) là?`;
        challenge.correctAnswer = Math.round(P2 / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P2 = P2;
      } else if (questionType === 'final-volume') {
        let P2 = Math.round((Math.random() * 300 + 100) * 1000);
        while (Math.abs(P2 - P1) < 50000) {
          P2 = Math.round((Math.random() * 300 + 100) * 1000);
        }
        challenge.P2 = P2;
        const V2 = (P1 * V1) / P2;
        challenge.question = `Định luật Boyle: Khí ${V1} L ở ${P1/1000} kPa được ${P2 > P1 ? 'nén' : 'giãn nở'} đến ${P2/1000} kPa (T không đổi). Thể tích cuối (L) là?`;
        challenge.correctAnswer = Math.round(V2 * 10) / 10;
        challenge.unit = 'L';
        challenge.V2 = V2;
      } else if (questionType === 'initial-volume') {
        const V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
        const P2 = Math.round((Math.random() * 300 + 100) * 1000);
        challenge.V2 = V2;
        challenge.P2 = P2;
        const V1_calc = (P2 * V2) / P1;
        challenge.question = `Định luật Boyle: Khí ban đầu ở ${P1/1000} kPa, sau khi ${P2 > P1 ? 'nén' : 'giãn nở'} đến ${P2/1000} kPa có thể tích ${V2} L (T không đổi). Thể tích ban đầu (L) là?`;
        challenge.correctAnswer = Math.round(V1_calc * 10) / 10;
        challenge.unit = 'L';
        challenge.V1 = V1_calc;
      } else {
        const V2 = Math.round((Math.random() * 15 + 5) * 10) / 10;
        const P2 = Math.round((Math.random() * 300 + 100) * 1000);
        challenge.V2 = V2;
        challenge.P2 = P2;
        const P1_calc = (P2 * V2) / V1;
        challenge.question = `Định luật Boyle: Khí thể tích ${V1} L, sau khi ${V2 > V1 ? 'giãn nở' : 'nén'} đến ${V2} L có áp suất ${P2/1000} kPa (T không đổi). Áp suất ban đầu (kPa) là?`;
        challenge.correctAnswer = Math.round(P1_calc / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P1 = P1_calc;
      }
    } else if (scenarioType === 'charles-law') {
      // Định luật Charles: V₁/T₁ = V₂/T₂ (P = const)
      const V1 = Math.round((Math.random() * 10 + 5) * 10) / 10;
      const T1 = Math.round(Math.random() * 50 + 273); // 273-323 K
      
      const questionTypes = ['final-volume', 'final-temperature', 'initial-volume', 'initial-temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.P = Math.round((Math.random() * 200 + 100) * 1000); // Áp suất không đổi
      challenge.V1 = V1;
      challenge.T1 = T1;
      
      if (questionType === 'final-volume') {
        const T2 = Math.round(Math.random() * 100 + 323); // 323-423 K
        challenge.T2 = T2;
        const V2 = (V1 * T2) / T1;
        challenge.question = `Định luật Charles: Khí ${V1} L ở ${T1} K được đun nóng đến ${T2} K (P không đổi). Thể tích cuối (L) là?`;
        challenge.correctAnswer = Math.round(V2 * 10) / 10;
        challenge.unit = 'L';
        challenge.V2 = V2;
      } else if (questionType === 'final-temperature') {
        let V2 = Math.round((Math.random() * 15 + 8) * 10) / 10;
        while (Math.abs(V2 - V1) < 2) {
          V2 = Math.round((Math.random() * 15 + 8) * 10) / 10;
        }
        challenge.V2 = V2;
        const T2 = (V2 * T1) / V1;
        challenge.question = `Định luật Charles: Khí ${V1} L ở ${T1} K được ${V2 > V1 ? 'đun nóng' : 'làm lạnh'} đến ${V2} L (P không đổi). Nhiệt độ cuối (K) là?`;
        challenge.correctAnswer = Math.round(T2);
        challenge.unit = 'K';
        challenge.T2 = T2;
      } else if (questionType === 'initial-volume') {
        const T2 = Math.round(Math.random() * 100 + 323);
        const V2 = Math.round((Math.random() * 15 + 8) * 10) / 10;
        challenge.T2 = T2;
        challenge.V2 = V2;
        const V1_calc = (V2 * T1) / T2;
        challenge.question = `Định luật Charles: Khí ban đầu ở ${T1} K, sau khi đun nóng đến ${T2} K có thể tích ${V2} L (P không đổi). Thể tích ban đầu (L) là?`;
        challenge.correctAnswer = Math.round(V1_calc * 10) / 10;
        challenge.unit = 'L';
        challenge.V1 = V1_calc;
      } else {
        const T2 = Math.round(Math.random() * 100 + 323);
        const V2 = Math.round((Math.random() * 15 + 8) * 10) / 10;
        challenge.T2 = T2;
        challenge.V2 = V2;
        const T1_calc = (V1 * T2) / V2;
        challenge.question = `Định luật Charles: Khí thể tích ${V1} L, sau khi đun nóng đến ${T2} K có thể tích ${V2} L (P không đổi). Nhiệt độ ban đầu (K) là?`;
        challenge.correctAnswer = Math.round(T1_calc);
        challenge.unit = 'K';
        challenge.T1 = T1_calc;
      }
    } else if (scenarioType === 'gay-lussac-law') {
      // Định luật Gay-Lussac: P₁/T₁ = P₂/T₂ (V = const)
      const P1 = Math.round((Math.random() * 200 + 100) * 1000);
      const T1 = Math.round(Math.random() * 50 + 273);
      
      const questionTypes = ['final-pressure', 'final-temperature', 'initial-pressure', 'initial-temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.V = Math.round((Math.random() * 10 + 5) * 10) / 10; // Thể tích không đổi
      challenge.P1 = P1;
      challenge.T1 = T1;
      
      if (questionType === 'final-pressure') {
        const T2 = Math.round(Math.random() * 100 + 323);
        challenge.T2 = T2;
        const P2 = (P1 * T2) / T1;
        challenge.question = `Định luật Gay-Lussac: Khí ${P1/1000} kPa ở ${T1} K được đun nóng đến ${T2} K (V không đổi). Áp suất cuối (kPa) là?`;
        challenge.correctAnswer = Math.round(P2 / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P2 = P2;
      } else if (questionType === 'final-temperature') {
        let P2 = Math.round((Math.random() * 300 + 150) * 1000);
        while (Math.abs(P2 - P1) < 50000) {
          P2 = Math.round((Math.random() * 300 + 150) * 1000);
        }
        challenge.P2 = P2;
        const T2 = (P2 * T1) / P1;
        challenge.question = `Định luật Gay-Lussac: Khí ${P1/1000} kPa ở ${T1} K được ${P2 > P1 ? 'đun nóng' : 'làm lạnh'} đến ${P2/1000} kPa (V không đổi). Nhiệt độ cuối (K) là?`;
        challenge.correctAnswer = Math.round(T2);
        challenge.unit = 'K';
        challenge.T2 = T2;
      } else if (questionType === 'initial-pressure') {
        const T2 = Math.round(Math.random() * 100 + 323);
        const P2 = Math.round((Math.random() * 300 + 150) * 1000);
        challenge.T2 = T2;
        challenge.P2 = P2;
        const P1_calc = (P2 * T1) / T2;
        challenge.question = `Định luật Gay-Lussac: Khí ban đầu ở ${T1} K, sau khi đun nóng đến ${T2} K có áp suất ${P2/1000} kPa (V không đổi). Áp suất ban đầu (kPa) là?`;
        challenge.correctAnswer = Math.round(P1_calc / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P1 = P1_calc;
      } else {
        const T2 = Math.round(Math.random() * 100 + 323);
        const P2 = Math.round((Math.random() * 300 + 150) * 1000);
        challenge.T2 = T2;
        challenge.P2 = P2;
        const T1_calc = (P1 * T2) / P2;
        challenge.question = `Định luật Gay-Lussac: Khí áp suất ${P1/1000} kPa, sau khi đun nóng đến ${T2} K có áp suất ${P2/1000} kPa (V không đổi). Nhiệt độ ban đầu (K) là?`;
        challenge.correctAnswer = Math.round(T1_calc);
        challenge.unit = 'K';
        challenge.T1 = T1_calc;
      }
    } else if (scenarioType === 'combined-gas-law') {
      // Định luật kết hợp: (P₁V₁)/T₁ = (P₂V₂)/T₂
      const P1 = Math.round((Math.random() * 200 + 100) * 1000);
      const V1 = Math.round((Math.random() * 10 + 5) * 10) / 10;
      const T1 = Math.round(Math.random() * 50 + 273);
      
      const T2 = Math.round(Math.random() * 100 + 300);
      const changeType = Math.random();
      
      challenge.P1 = P1;
      challenge.V1 = V1;
      challenge.T1 = T1;
      challenge.T2 = T2;
      
      if (changeType < 0.33) {
        // Tính P2 khi biết V2
        const V2 = Math.round((Math.random() * 12 + 6) * 10) / 10;
        challenge.V2 = V2;
        const P2 = (P1 * V1 * T2) / (T1 * V2);
        challenge.question = `Định luật kết hợp: Khí từ ${P1/1000} kPa, ${V1} L, ${T1} K chuyển sang ${V2} L, ${T2} K. Áp suất cuối (kPa) là?`;
        challenge.correctAnswer = Math.round(P2 / 1000 * 10) / 10;
        challenge.unit = 'kPa';
        challenge.P2 = P2;
      } else if (changeType < 0.67) {
        // Tính V2 khi biết P2
        const P2 = Math.round((Math.random() * 250 + 120) * 1000);
        challenge.P2 = P2;
        const V2 = (P1 * V1 * T2) / (P2 * T1);
        challenge.question = `Định luật kết hợp: Khí từ ${P1/1000} kPa, ${V1} L, ${T1} K chuyển sang ${P2/1000} kPa, ${T2} K. Thể tích cuối (L) là?`;
        challenge.correctAnswer = Math.round(V2 * 10) / 10;
        challenge.unit = 'L';
        challenge.V2 = V2;
      } else {
        // Tính T2 khi biết P2 và V2
        const P2 = Math.round((Math.random() * 250 + 120) * 1000);
        const V2 = Math.round((Math.random() * 12 + 6) * 10) / 10;
        challenge.P2 = P2;
        challenge.V2 = V2;
        const T2_calc = (P2 * V2 * T1) / (P1 * V1);
        challenge.question = `Định luật kết hợp: Khí từ ${P1/1000} kPa, ${V1} L, ${T1} K chuyển sang ${P2/1000} kPa, ${V2} L. Nhiệt độ cuối (K) là?`;
        challenge.correctAnswer = Math.round(T2_calc);
        challenge.unit = 'K';
        challenge.T2 = T2_calc;
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

      if (currentChallenge.scenarioType === 'boyle-law') {
        drawBoyleLaw(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'charles-law') {
        drawCharlesLaw(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'gay-lussac-law') {
        drawGayLussacLaw(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'combined-gas-law') {
        drawCombinedGasLaw(ctx, width, height);
      }
    };

    const drawBoyleLaw = (ctx, w, h) => {
      const { P1, V1, P2, V2, T } = currentChallenge;
      
      // Trạng thái 1
      const state1X = 150;
      const state1Y = h / 2 + 30;
      const container1W = 80 + V1 * 4;
      const container1H = 120;
      
      // Nội suy
      const currentV = V1 + (V2 - V1) * animationProgress;
      const currentP = (P1 * V1) / currentV;
      const currentW = 80 + currentV * 4;
      
      // Bình trái (trạng thái 1)
      ctx.fillStyle = 'rgba(224, 247, 255, 0.6)';
      ctx.fillRect(state1X - container1W / 2, state1Y - container1H / 2, container1W, container1H);
      ctx.strokeStyle = '#999';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeRect(state1X - container1W / 2, state1Y - container1H / 2, container1W, container1H);
      ctx.setLineDash([]);
      
      // Bình phải (trạng thái hiện tại)
      const state2X = 450;
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(state2X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(state2X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      
      // Piston
      const pistonX = state2X + currentW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX - 5, state1Y - container1H / 2, 10, container1H);
      
      // Mật độ phân tử (tỉ lệ nghịch với V)
      const density = V1 / currentV;
      const numParticles = Math.round(30 * density);
      for (let i = 0; i < numParticles; i++) {
        const px = state2X - currentW / 2 + 15 + (i % 6) * (currentW - 30) / 6;
        const py = state1Y - container1H / 2 + 15 + Math.floor(i / 6) * 18 + Math.sin(animationProgress * 10 + i) * 3;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Biểu đồ P-V (hyperbola)
      const graphX = 580;
      const graphY = h / 2 + 50;
      const graphW = 180;
      const graphH = 140;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('V', graphX + graphW / 2, graphY + graphH / 2 + 20);
      ctx.save();
      ctx.translate(graphX - 15, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // Đường cong Boyle
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const vMin = Math.min(V1, V2) * 0.8;
      const vMax = Math.max(V1, V2) * 1.2;
      for (let i = 0; i <= 50; i++) {
        const v = vMin + (vMax - vMin) * (i / 50);
        const p = (P1 * V1) / v;
        const x = graphX + ((v - vMin) / (vMax - vMin)) * graphW;
        const pMin = Math.min(P1, P2) * 0.7;
        const pMax = Math.max(P1, P2) * 1.3;
        const y = graphY + graphH / 2 - ((p - pMin) / (pMax - pMin)) * graphH;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Điểm hiện tại
      const currentX = graphX + ((currentV - vMin) / (vMax - vMin)) * graphW;
      const pMin = Math.min(P1, P2) * 0.7;
      const pMax = Math.max(P1, P2) * 1.3;
      const currentY = graphY + graphH / 2 - ((currentP - pMin) / (pMax - pMin)) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`State 1: P=${P1/1000} kPa, V=${V1} L`, 30, 50);
      ctx.fillStyle = '#0099cc';
      ctx.fillText(`Current: P=${Math.round(currentP/1000)} kPa, V=${currentV.toFixed(1)} L`, 30, 75);
      ctx.fillStyle = '#666';
      ctx.fillText(`T = ${T} K (constant)`, 30, 100);
    };

    const drawCharlesLaw = (ctx, w, h) => {
      const { P, V1, T1, V2, T2 } = currentChallenge;
      
      // Nội suy
      const currentT = T1 + (T2 - T1) * animationProgress;
      const currentV = (V1 * currentT) / T1;
      
      // Bình với nhiệt độ thay đổi
      const containerX = 200;
      const containerY = h / 2 + 30;
      const currentW = 80 + currentV * 4;
      const containerH = 120;
      
      // Màu theo nhiệt độ
      const tempRatio = (currentT - 273) / 150;
      let bgColor;
      if (tempRatio < 0.3) {
        bgColor = '#bfdbfe';
      } else if (tempRatio < 0.6) {
        bgColor = '#fde68a';
      } else {
        bgColor = '#fca5a5';
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(containerX - currentW / 2, containerY - containerH / 2, currentW, containerH);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - currentW / 2, containerY - containerH / 2, currentW, containerH);
      
      // Piston di động
      const pistonX = containerX + currentW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX - 5, containerY - containerH / 2, 10, containerH);
      
      // Nhiệt kế
      const thermX = containerX + currentW / 2 + 40;
      const thermY = containerY - containerH / 2 + 20;
      const thermH = 80;
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(thermX - 4, thermY, 8, thermH);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(thermX - 4, thermY, 8, thermH);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(thermX, thermY + thermH + 6, 10, 0, Math.PI * 2);
      ctx.fill();
      
      const mercuryH = ((currentT - 273) / 150) * thermH;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(thermX - 2, thermY + thermH - mercuryH, 4, mercuryH);
      
      // Biểu đồ V-T (đường thẳng)
      const graphX = 500;
      const graphY = h / 2 + 50;
      const graphW = 200;
      const graphH = 140;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('T', graphX + graphW / 2, graphY + graphH / 2 + 20);
      ctx.save();
      ctx.translate(graphX - 15, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('V', 0, 0);
      ctx.restore();
      
      // Đường thẳng Charles
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const tMin = Math.min(T1, T2) - 20;
      const tMax = Math.max(T1, T2) + 20;
      const vMin = Math.min(V1, V2) * 0.8;
      const vMax = Math.max(V1, V2) * 1.2;
      
      const x1 = graphX;
      const v1_graph = (V1 * tMin) / T1;
      const y1 = graphY + graphH / 2 - ((v1_graph - vMin) / (vMax - vMin)) * graphH;
      const x2 = graphX + graphW;
      const v2_graph = (V1 * tMax) / T1;
      const y2 = graphY + graphH / 2 - ((v2_graph - vMin) / (vMax - vMin)) * graphH;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Điểm hiện tại
      const progress = (currentT - tMin) / (tMax - tMin);
      const currentX = graphX + progress * graphW;
      const currentY = graphY + graphH / 2 - ((currentV - vMin) / (vMax - vMin)) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`State 1: V=${V1} L, T=${T1} K`, 30, 50);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Current: V=${currentV.toFixed(1)} L, T=${Math.round(currentT)} K`, 30, 75);
      ctx.fillStyle = '#666';
      ctx.fillText(`P = ${P/1000} kPa (constant)`, 30, 100);
    };

    const drawGayLussacLaw = (ctx, w, h) => {
      const { V, P1, T1, P2, T2 } = currentChallenge;
      
      // Nội suy
      const currentT = T1 + (T2 - T1) * animationProgress;
      const currentP = (P1 * currentT) / T1;
      
      // Bình cứng
      const containerX = 200;
      const containerY = h / 2 + 30;
      const containerW = 120;
      const containerH = 140;
      
      // Màu theo nhiệt độ
      const tempRatio = (currentT - 273) / 150;
      let bgColor;
      if (tempRatio < 0.3) {
        bgColor = '#bfdbfe';
      } else if (tempRatio < 0.6) {
        bgColor = '#fde68a';
      } else {
        bgColor = '#fca5a5';
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
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
      
      // Biểu đồ P-T (đường thẳng)
      const graphX = 500;
      const graphY = h / 2 + 50;
      const graphW = 200;
      const graphH = 140;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('T', graphX + graphW / 2, graphY + graphH / 2 + 20);
      ctx.save();
      ctx.translate(graphX - 15, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // Đường thẳng Gay-Lussac
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const tMin = Math.min(T1, T2) - 20;
      const tMax = Math.max(T1, T2) + 20;
      const pMin = Math.min(P1, P2) * 0.8;
      const pMax = Math.max(P1, P2) * 1.2;
      
      const x1 = graphX;
      const p1_graph = (P1 * tMin) / T1;
      const y1 = graphY + graphH / 2 - ((p1_graph - pMin) / (pMax - pMin)) * graphH;
      const x2 = graphX + graphW;
      const p2_graph = (P1 * tMax) / T1;
      const y2 = graphY + graphH / 2 - ((p2_graph - pMin) / (pMax - pMin)) * graphH;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Điểm hiện tại
      const progress = (currentT - tMin) / (tMax - tMin);
      const currentX = graphX + progress * graphW;
      const currentY = graphY + graphH / 2 - ((currentP - pMin) / (pMax - pMin)) * graphH;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`State 1: P=${P1/1000} kPa, T=${T1} K`, 30, 50);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Current: P=${Math.round(currentP/1000)} kPa, T=${Math.round(currentT)} K`, 30, 75);
      ctx.fillStyle = '#666';
      ctx.fillText(`V = ${V} L (constant)`, 30, 100);
    };

    const drawCombinedGasLaw = (ctx, w, h) => {
      const { P1, V1, T1, P2, V2, T2 } = currentChallenge;
      
      // Nội suy các giá trị
      const progress = animationProgress;
      const currentP = P1 + (P2 - P1) * progress;
      const currentV = V1 + (V2 - V1) * progress;
      const currentT = T1 + (T2 - T1) * progress;
      
      // Trạng thái 1 (mờ)
      const state1X = 150;
      const state1Y = h / 2 + 30;
      const container1W = 80 + V1 * 4;
      const container1H = 120;
      
      ctx.fillStyle = 'rgba(224, 247, 255, 0.4)';
      ctx.fillRect(state1X - container1W / 2, state1Y - container1H / 2, container1W, container1H);
      ctx.strokeStyle = '#999';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeRect(state1X - container1W / 2, state1Y - container1H / 2, container1W, container1H);
      ctx.setLineDash([]);
      
      // Trạng thái hiện tại
      const state2X = 450;
      const currentW = 80 + currentV * 4;
      
      const tempRatio = (currentT - 273) / 150;
      let bgColor;
      if (tempRatio < 0.3) {
        bgColor = '#bfdbfe';
      } else if (tempRatio < 0.6) {
        bgColor = '#fde68a';
      } else {
        bgColor = '#fca5a5';
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(state2X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(state2X - currentW / 2, state1Y - container1H / 2, currentW, container1H);
      
      // Piston
      const pistonX = state2X + currentW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX - 5, state1Y - container1H / 2, 10, container1H);
      
      // Đồng hồ áp suất
      const gaugeX = state2X;
      const gaugeY = state1Y - container1H / 2 - 50;
      const gaugeRadius = 25;
      
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      const needleAngle = -Math.PI / 2 + (currentP / 600000) * Math.PI;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(
        gaugeX + Math.cos(needleAngle) * (gaugeRadius - 3),
        gaugeY + Math.sin(needleAngle) * (gaugeRadius - 3)
      );
      ctx.stroke();
      
      // Biểu đồ 3D đơn giản (P-V-T)
      const graphX = 580;
      const graphY = h / 2 + 20;
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Combined Gas Law', graphX + 80, graphY - 50);
      
      // Hiển thị công thức
      ctx.font = '12px Arial';
      ctx.fillText('P₁V₁/T₁ = P₂V₂/T₂', graphX + 80, graphY - 30);
      
      // Thanh tiến trình
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(graphX, graphY);
      ctx.lineTo(graphX + 160, graphY);
      ctx.stroke();
      
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY);
      ctx.lineTo(graphX + 160 * progress, graphY);
      ctx.stroke();
      
      // Hiển thị các thông số
      const params = [
        { label: 'P', value1: P1/1000, value2: P2/1000, current: currentP/1000, unit: 'kPa', y: 40 },
        { label: 'V', value1: V1, value2: V2, current: currentV, unit: 'L', y: 70 },
        { label: 'T', value1: T1, value2: T2, current: currentT, unit: 'K', y: 100 }
      ];
      
      ctx.font = '11px Arial';
      ctx.textAlign = 'left';
      params.forEach(param => {
        ctx.fillStyle = '#666';
        ctx.fillText(`${param.label}: ${param.value1.toFixed(1)} → ${param.value2.toFixed(1)} ${param.unit}`, graphX, graphY + param.y);
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText(`Now: ${param.current.toFixed(1)}`, graphX + 120, graphY + param.y);
      });
      
      // Thông tin trạng thái
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Initial: P=${P1/1000} kPa, V=${V1} L, T=${T1} K`, 20, 40);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`Current: P=${Math.round(currentP/1000)} kPa, V=${currentV.toFixed(1)} L, T=${Math.round(currentT)} K`, 20, 65);
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
      <div className="ideal-gas-playground">
        <div className="game-menu">
          <div className="menu-header">
            <Beaker size={60} className="menu-icon" />
            <h1>Ideal Gas Playground</h1>
            <p className="menu-subtitle">Thử nghiệm các định luật khí</p>
          </div>

          <div className="theory-section">
            <h2><Activity size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Định luật Boyle (T = const)</h3>
              <p><strong>Công thức:</strong> P₁V₁ = P₂V₂</p>
              <p>Áp suất tỉ lệ nghịch với thể tích</p>
            </div>

            <div className="theory-box">
              <h3>2. Định luật Charles (P = const)</h3>
              <p><strong>Công thức:</strong> V₁/T₁ = V₂/T₂</p>
              <p>Thể tích tỉ lệ thuận với nhiệt độ tuyệt đối</p>
            </div>

            <div className="theory-box">
              <h3>3. Định luật Gay-Lussac (V = const)</h3>
              <p><strong>Công thức:</strong> P₁/T₁ = P₂/T₂</p>
              <p>Áp suất tỉ lệ thuận với nhiệt độ tuyệt đối</p>
            </div>

            <div className="theory-box">
              <h3>4. Định luật kết hợp</h3>
              <p><strong>Công thức:</strong> (P₁V₁)/T₁ = (P₂V₂)/T₂</p>
              <p>Kết hợp cả 3 định luật trên</p>
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
      <div className="ideal-gas-playground">
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
                <Beaker size={20} />
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
      <div className="ideal-gas-playground">
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

export default IdealGasPlayground;
