import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Atom, Zap, Activity } from 'lucide-react';
import './MolecularMotionStudio.css';

const MolecularMotionStudio = () => {
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
  const k_B = 1.38e-23; // Hằng số Boltzmann (J/K)
  const N_A = 6.022e23; // Số Avogadro

  // Loại scenario
  const scenarioTypes = ['kinetic-theory', 'rms-speed', 'pressure-temperature', 'mean-free-path'];

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    let challenge = { scenarioType };

    if (scenarioType === 'kinetic-theory') {
      // Động năng trung bình phân tử: E_k = (3/2)kT
      const T = Math.round(Math.random() * 200 + 273); // 273-473 K
      const E_k = (3/2) * k_B * T; // J
      
      const questionTypes = ['energy', 'temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.k_B = k_B;
      
      if (questionType === 'energy') {
        challenge.T = T;
        challenge.question = `Động năng trung bình của phân tử khí ở ${T} K là bao nhiêu (×10⁻²¹ J)? k_B = 1.38×10⁻²³ J/K`;
        challenge.correctAnswer = Math.round(E_k * 1e21 * 100) / 100;
        challenge.unit = '×10⁻²¹ J';
        challenge.E_k = E_k;
      } else {
        challenge.E_k = E_k;
        const T_calc = (2 * E_k) / (3 * k_B);
        challenge.question = `Nhiệt độ (K) của khí khi động năng trung bình phân tử là ${(E_k * 1e21).toFixed(2)}×10⁻²¹ J? k_B = 1.38×10⁻²³ J/K`;
        challenge.correctAnswer = Math.round(T_calc);
        challenge.unit = 'K';
        challenge.T = T_calc;
      }
    } else if (scenarioType === 'rms-speed') {
      // Vận tốc căn quân phương: v_rms = √(3kT/m) = √(3RT/M)
      const gases = [
        { name: 'H₂', M: 2 },
        { name: 'He', M: 4 },
        { name: 'N₂', M: 28 },
        { name: 'O₂', M: 32 },
        { name: 'CO₂', M: 44 }
      ];
      const gas = gases[Math.floor(Math.random() * gases.length)];
      const T = Math.round(Math.random() * 200 + 273);
      const R = 8.314; // J/(mol·K)
      const M = gas.M / 1000; // kg/mol
      
      const v_rms = Math.sqrt((3 * R * T) / M); // m/s
      
      const questionTypes = ['speed', 'temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.gas = gas.name;
      challenge.M = gas.M;
      challenge.R = R;
      
      if (questionType === 'speed') {
        challenge.T = T;
        challenge.question = `Vận tốc căn quân phương (m/s) của phân tử ${gas.name} (M=${gas.M} g/mol) ở ${T} K là bao nhiêu?`;
        challenge.correctAnswer = Math.round(v_rms);
        challenge.unit = 'm/s';
        challenge.v_rms = v_rms;
      } else {
        challenge.v_rms = v_rms;
        const T_calc = (M * v_rms * v_rms) / (3 * R);
        challenge.question = `Nhiệt độ (K) của khí ${gas.name} khi vận tốc căn quân phương là ${Math.round(v_rms)} m/s (M=${gas.M} g/mol)?`;
        challenge.correctAnswer = Math.round(T_calc);
        challenge.unit = 'K';
        challenge.T = T_calc;
      }
    } else if (scenarioType === 'pressure-temperature') {
      // Áp suất khí: P = nkT (n là mật độ phân tử)
      const T = Math.round(Math.random() * 200 + 273);
      const n = Math.round((Math.random() * 5 + 1) * 1e25); // phân tử/m³
      const P = n * k_B * T; // Pa
      
      const questionTypes = ['pressure', 'density', 'temperature'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.k_B = k_B;
      
      if (questionType === 'pressure') {
        challenge.n = n;
        challenge.T = T;
        challenge.question = `Áp suất (kPa) của khí có mật độ phân tử ${(n/1e25).toFixed(1)}×10²⁵ phân tử/m³ ở ${T} K? k_B = 1.38×10⁻²³ J/K`;
        challenge.correctAnswer = Math.round(P / 1000);
        challenge.unit = 'kPa';
        challenge.P = P;
      } else if (questionType === 'density') {
        challenge.P = P;
        challenge.T = T;
        const n_calc = P / (k_B * T);
        challenge.question = `Mật độ phân tử (×10²⁵ phân tử/m³) của khí ở ${Math.round(P/1000)} kPa và ${T} K? k_B = 1.38×10⁻²³ J/K`;
        challenge.correctAnswer = Math.round(n_calc / 1e25 * 10) / 10;
        challenge.unit = '×10²⁵ /m³';
        challenge.n = n_calc;
      } else {
        challenge.P = P;
        challenge.n = n;
        const T_calc = P / (n * k_B);
        challenge.question = `Nhiệt độ (K) của khí ở ${Math.round(P/1000)} kPa với mật độ ${(n/1e25).toFixed(1)}×10²⁵ phân tử/m³? k_B = 1.38×10⁻²³ J/K`;
        challenge.correctAnswer = Math.round(T_calc);
        challenge.unit = 'K';
        challenge.T = T_calc;
      }
    } else if (scenarioType === 'mean-free-path') {
      // Quãng đường tự do trung bình: λ = 1/(√2·π·d²·n)
      const d = Math.round((Math.random() * 2 + 2) * 1e-10 * 1e10) / 1e10; // 2-4 × 10⁻¹⁰ m
      const T = Math.round(Math.random() * 200 + 273);
      const P = Math.round((Math.random() * 200 + 100) * 1000); // Pa
      
      const n = P / (k_B * T); // mật độ phân tử
      const lambda = 1 / (Math.sqrt(2) * Math.PI * d * d * n); // m
      
      challenge.d = d;
      challenge.T = T;
      challenge.P = P;
      challenge.n = n;
      challenge.question = `Quãng đường tự do trung bình (nm) của phân tử có đường kính ${(d*1e10).toFixed(1)}×10⁻¹⁰ m trong khí ở ${T} K, ${Math.round(P/1000)} kPa?`;
      challenge.correctAnswer = Math.round(lambda * 1e9 * 10) / 10;
      challenge.unit = 'nm';
      challenge.lambda = lambda;
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

      if (currentChallenge.scenarioType === 'kinetic-theory') {
        drawKineticTheory(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'rms-speed') {
        drawRMSSpeed(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'pressure-temperature') {
        drawPressureTemperature(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'mean-free-path') {
        drawMeanFreePath(ctx, width, height);
      }
    };

    const drawKineticTheory = (ctx, w, h) => {
      const { T, E_k } = currentChallenge;
      
      // Container
      const containerX = w / 2;
      const containerY = h / 2;
      const containerSize = 250;
      
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - containerSize / 2, containerY - containerSize / 2, containerSize, containerSize);
      
      // Phân tử chuyển động với vận tốc theo nhiệt độ
      const numParticles = 40;
      const speedFactor = Math.sqrt(T / 300); // Tỉ lệ với √T
      
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + animationProgress * speedFactor * 3;
        const radius = 50 + (i % 3) * 35;
        const px = containerX + Math.cos(angle) * radius;
        const py = containerY + Math.sin(angle) * radius;
        
        // Phân tử
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Vectơ vận tốc
        const vx = -Math.sin(angle) * speedFactor * 12;
        const vy = Math.cos(angle) * speedFactor * 12;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + vx, py + vy);
        ctx.stroke();
      }
      
      // Biểu đồ phân bố vận tốc Maxwell-Boltzmann (đơn giản hóa)
      const graphX = 600;
      const graphY = h / 2;
      const graphW = 170;
      const graphH = 200;
      
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
      ctx.fillText('v', graphX + graphW / 2, graphY + graphH / 2 + 20);
      ctx.save();
      ctx.translate(graphX - 15, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('f(v)', 0, 0);
      ctx.restore();
      
      // Đường cong Maxwell-Boltzmann
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 50; i++) {
        const x = i / 50;
        // Hàm đơn giản hóa của phân bố M-B
        const y = 4 * x * x * Math.exp(-2 * x * x);
        const canvasX = graphX + x * graphW;
        const canvasY = graphY + graphH / 2 - y * graphH * 0.8;
        if (i === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
      ctx.stroke();
      
      // Vị trí vận tốc trung bình
      const v_avg_pos = 0.6; // Vị trí tương đối
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(graphX + v_avg_pos * graphW, graphY + graphH / 2);
      ctx.lineTo(graphX + v_avg_pos * graphW, graphY - graphH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`T = ${T} K`, 30, 50);
      ctx.fillText(`E_k = ${(E_k * 1e21).toFixed(2)}×10⁻²¹ J`, 30, 80);
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '14px Arial';
      ctx.fillText('E_k = (3/2)kT', 30, 110);
    };

    const drawRMSSpeed = (ctx, w, h) => {
      const { gas, T, v_rms, M } = currentChallenge;
      
      // Container
      const containerX = 250;
      const containerY = h / 2;
      const containerW = 300;
      const containerH = 200;
      
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - containerW / 2, containerY - containerH / 2, containerW, containerH);
      
      // Phân tử với các vận tốc khác nhau
      const speedScale = v_rms / 1000; // Scale cho hiển thị
      const numParticles = 30;
      
      for (let i = 0; i < numParticles; i++) {
        const speedVariation = 0.5 + Math.random() * 1.0; // 0.5-1.5 lần v_rms
        const angle = (i / numParticles) * Math.PI * 2 + animationProgress * speedVariation * 4;
        const radius = 30 + (i % 4) * 20;
        const px = containerX + Math.cos(angle) * radius;
        const py = containerY + Math.sin(angle) * radius;
        
        // Màu theo vận tốc
        const speed = v_rms * speedVariation;
        const colorIntensity = Math.min(255, Math.round(speed / 5));
        ctx.fillStyle = `rgb(${colorIntensity}, ${100}, ${255 - colorIntensity})`;
        ctx.beginPath();
        ctx.arc(px, py, 3 + speedVariation, 0, Math.PI * 2);
        ctx.fill();
        
        // Đuôi chuyển động
        ctx.strokeStyle = `rgba(${colorIntensity}, ${100}, ${255 - colorIntensity}, 0.3)`;
        ctx.lineWidth = 2;
        const tailLength = speedVariation * 15;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - Math.cos(angle) * tailLength, py - Math.sin(angle) * tailLength);
        ctx.stroke();
      }
      
      // Biểu đồ histogram vận tốc
      const graphX = 580;
      const graphY = h / 2 + 50;
      const graphW = 180;
      const graphH = 150;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      // Các cột histogram
      const bars = 10;
      for (let i = 0; i < bars; i++) {
        const x = i / bars;
        const height = Math.exp(-((x - 0.6) * (x - 0.6)) / 0.1) * graphH * 0.6;
        const barX = graphX + (x * graphW);
        const barW = graphW / bars - 2;
        
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(barX, graphY + graphH / 2 - height, barW, height);
      }
      
      // Đánh dấu v_rms
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(graphX + 0.6 * graphW, graphY + graphH / 2);
      ctx.lineTo(graphX + 0.6 * graphW, graphY - graphH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('v_rms', graphX + 0.6 * graphW, graphY + graphH / 2 + 20);
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Gas: ${gas} (M = ${M} g/mol)`, 30, 50);
      ctx.fillText(`T = ${T} K`, 30, 80);
      ctx.fillText(`v_rms = ${Math.round(v_rms)} m/s`, 30, 110);
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '13px Arial';
      ctx.fillText('v_rms = √(3RT/M)', 30, 135);
    };

    const drawPressureTemperature = (ctx, w, h) => {
      const { P, n, T } = currentChallenge;
      
      // Container với mật độ phân tử
      const containerX = 250;
      const containerY = h / 2;
      const containerSize = 220;
      
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(containerX - containerSize / 2, containerY - containerSize / 2, containerSize, containerSize);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(containerX - containerSize / 2, containerY - containerSize / 2, containerSize, containerSize);
      
      // Mật độ phân tử (tỉ lệ với n)
      const displayDensity = Math.min(60, Math.round((n / 1e25) * 10));
      
      for (let i = 0; i < displayDensity; i++) {
        const angle = (i / displayDensity) * Math.PI * 2 + animationProgress * 3 + i * 0.5;
        const radius = 20 + (i % 5) * 18;
        const px = containerX + Math.cos(angle) * radius;
        const py = containerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Mũi tên va chạm với thành
      if (animationProgress % 0.2 < 0.1) {
        const sides = 4;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const wallX = containerX + Math.cos(angle) * (containerSize / 2 - 10);
          const wallY = containerY + Math.sin(angle) * (containerSize / 2 - 10);
          
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(wallX - Math.cos(angle) * 15, wallY - Math.sin(angle) * 15);
          ctx.lineTo(wallX, wallY);
          ctx.stroke();
          
          // Đầu mũi tên
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(wallX, wallY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Đồng hồ đo áp suất
      const gaugeX = 550;
      const gaugeY = h / 2 - 50;
      const gaugeRadius = 60;
      
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Vạch chia độ
      for (let i = 0; i <= 10; i++) {
        const angle = -Math.PI + (i / 10) * Math.PI;
        const x1 = gaugeX + Math.cos(angle) * (gaugeRadius - 10);
        const y1 = gaugeY + Math.sin(angle) * (gaugeRadius - 10);
        const x2 = gaugeX + Math.cos(angle) * (gaugeRadius - 5);
        const y2 = gaugeY + Math.sin(angle) * (gaugeRadius - 5);
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Kim đồng hồ (tỉ lệ với áp suất)
      const needleAngle = -Math.PI + ((P / 500000) % 1) * Math.PI;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(
        gaugeX + Math.cos(needleAngle) * (gaugeRadius - 15),
        gaugeY + Math.sin(needleAngle) * (gaugeRadius - 15)
      );
      ctx.stroke();
      
      // Nhiệt kế
      const thermX = 650;
      const thermY = h / 2 + 20;
      const thermH = 100;
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(thermX - 5, thermY, 10, thermH);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(thermX - 5, thermY, 10, thermH);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(thermX, thermY + thermH + 10, 12, 0, Math.PI * 2);
      ctx.fill();
      
      const mercuryH = ((T - 273) / 200) * thermH;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(thermX - 3, thermY + thermH - mercuryH, 6, mercuryH);
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`n = ${(n/1e25).toFixed(1)}×10²⁵ /m³`, 30, 50);
      ctx.fillText(`T = ${Math.round(T)} K`, 30, 80);
      ctx.fillText(`P = ${Math.round(P/1000)} kPa`, 30, 110);
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '13px Arial';
      ctx.fillText('P = nkT', 30, 135);
    };

    const drawMeanFreePath = (ctx, w, h) => {
      const { d, T, P, lambda, n } = currentChallenge;
      
      // Container
      const containerX = w / 2 - 50;
      const containerY = h / 2;
      const containerSize = 300;
      
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(containerX - containerSize / 2, containerY - containerSize / 2, containerSize, containerSize);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 3;
      ctx.strokeRect(containerX - containerSize / 2, containerY - containerSize / 2, containerSize, containerSize);
      
      // Vẽ các phân tử và quãng đường tự do
      const numParticles = 25;
      const particleRadius = Math.max(2, d * 1e10 * 2); // Scale lên
      
      // Vẽ quãng đường tự do cho 1 phân tử đặc biệt
      const trackedParticle = {
        x: containerX - 100,
        y: containerY - 50 + Math.sin(animationProgress * 4) * 40,
        vx: 60,
        vy: Math.cos(animationProgress * 4) * 30
      };
      
      // Đường đi của phân tử tracked
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(containerX - containerSize / 2 + 20, trackedParticle.y);
      ctx.lineTo(trackedParticle.x, trackedParticle.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Phân tử tracked (đỏ)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(trackedParticle.x, trackedParticle.y, particleRadius + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Các phân tử khác
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + animationProgress * 2;
        const radius = 40 + (i % 4) * 30;
        const px = containerX + Math.cos(angle) * radius;
        const py = containerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Khoảng cách trung bình (minh họa)
      const refX = 550;
      const refY = h / 2;
      
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      
      // Vẽ 2 phân tử và khoảng cách
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(refX, refY - 50, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(refX, refY + 50, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Đường khoảng cách
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(refX, refY - 50);
      ctx.lineTo(refX, refY + 50);
      ctx.stroke();
      
      // Mũi tên hai đầu
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(refX, refY - 50);
      ctx.lineTo(refX - 5, refY - 45);
      ctx.lineTo(refX + 5, refY - 45);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(refX, refY + 50);
      ctx.lineTo(refX - 5, refY + 45);
      ctx.lineTo(refX + 5, refY + 45);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('λ', refX + 20, refY);
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 15px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`d = ${(d*1e10).toFixed(1)}×10⁻¹⁰ m`, 30, 50);
      ctx.fillText(`T = ${T} K, P = ${Math.round(P/1000)} kPa`, 30, 75);
      ctx.fillText(`λ = ${(lambda*1e9).toFixed(1)} nm`, 30, 100);
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px Arial';
      ctx.fillText('λ = 1/(√2·π·d²·n)', 30, 125);
    };

    // Animation loop
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.015;
        return newProgress >= 1 ? 0 : newProgress; // Loop liên tục
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

    const tolerance = 0.10; // 10% do tính toán phức tạp
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
      <div className="molecular-motion-studio">
        <div className="game-menu">
          <div className="menu-header">
            <Atom size={60} className="menu-icon" />
            <h1>Molecular Motion Studio</h1>
            <p className="menu-subtitle">Khám phá thuyết động học phân tử</p>
          </div>

          <div className="theory-section">
            <h2><Activity size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Thuyết động học phân tử</h3>
              <p><strong>Động năng trung bình:</strong> E_k = (3/2)kT</p>
              <p>k = 1.38×10⁻²³ J/K (Boltzmann)</p>
            </div>

            <div className="theory-box">
              <h3>2. Vận tốc căn quân phương</h3>
              <p><strong>Công thức:</strong> v_rms = √(3RT/M)</p>
              <p>Vận tốc hiệu dụng của phân tử khí</p>
            </div>

            <div className="theory-box">
              <h3>3. Áp suất từ va chạm phân tử</h3>
              <p><strong>Công thức:</strong> P = nkT</p>
              <p>n: mật độ phân tử (phân tử/m³)</p>
            </div>

            <div className="theory-box">
              <h3>4. Quãng đường tự do trung bình</h3>
              <p><strong>Công thức:</strong> λ = 1/(√2·π·d²·n)</p>
              <p>Khoảng cách giữa các va chạm liên tiếp</p>
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
      <div className="molecular-motion-studio">
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
                <Atom size={20} />
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
      <div className="molecular-motion-studio">
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

export default MolecularMotionStudio;
