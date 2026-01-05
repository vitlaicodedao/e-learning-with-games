import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Zap, TrendingUp, Activity } from 'lucide-react';
import './ThermodynamicCycles.css';

const ThermodynamicCycles = () => {
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

  // Loại chu trình nhiệt động
  const cycleTypes = ['carnot', 'otto', 'diesel', 'first-law'];

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const cycleType = cycleTypes[Math.floor(Math.random() * cycleTypes.length)];
    let challenge = { cycleType };

    if (cycleType === 'carnot') {
      // Chu trình Carnot: η = 1 - T_c/T_h
      const T_h = Math.round(Math.random() * 200 + 400); // 400-600 K
      const T_c = Math.round(Math.random() * 100 + 273); // 273-373 K
      
      const efficiency = (1 - T_c / T_h) * 100; // %
      
      const questionTypes = ['efficiency', 'cold-temp', 'hot-temp', 'work'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.T_h = T_h;
      challenge.T_c = T_c;
      
      if (questionType === 'efficiency') {
        challenge.question = `Chu trình Carnot hoạt động giữa nguồn nóng ${T_h} K và nguồn lạnh ${T_c} K. Hiệu suất (%) là bao nhiêu?`;
        challenge.correctAnswer = Math.round(efficiency * 10) / 10;
        challenge.unit = '%';
        challenge.efficiency = efficiency;
      } else if (questionType === 'cold-temp') {
        const knownEfficiency = Math.round(efficiency);
        challenge.efficiency = knownEfficiency;
        const T_c_calc = T_h * (1 - knownEfficiency / 100);
        challenge.question = `Chu trình Carnot có hiệu suất ${knownEfficiency}% với nguồn nóng ${T_h} K. Nhiệt độ nguồn lạnh (K) là?`;
        challenge.correctAnswer = Math.round(T_c_calc);
        challenge.unit = 'K';
        challenge.T_c = T_c_calc;
      } else if (questionType === 'hot-temp') {
        const knownEfficiency = Math.round(efficiency);
        challenge.efficiency = knownEfficiency;
        const T_h_calc = T_c / (1 - knownEfficiency / 100);
        challenge.question = `Chu trình Carnot có hiệu suất ${knownEfficiency}% với nguồn lạnh ${T_c} K. Nhiệt độ nguồn nóng (K) là?`;
        challenge.correctAnswer = Math.round(T_h_calc);
        challenge.unit = 'K';
        challenge.T_h = T_h_calc;
      } else {
        const Q_h = Math.round(Math.random() * 1000 + 1000); // 1000-2000 J
        challenge.Q_h = Q_h;
        const W = Q_h * (efficiency / 100);
        challenge.question = `Chu trình Carnot nhận ${Q_h} J từ nguồn nóng ${T_h} K và tỏa nhiệt cho nguồn lạnh ${T_c} K. Công sinh ra (J) là?`;
        challenge.correctAnswer = Math.round(W);
        challenge.unit = 'J';
        challenge.W = W;
        challenge.efficiency = efficiency;
      }
    } else if (cycleType === 'otto') {
      // Chu trình Otto (động cơ xăng): η = 1 - 1/r^(γ-1)
      const r = Math.round(Math.random() * 5 + 6); // Tỉ số nén 6-11
      const gamma = 1.4; // Không khí
      
      const efficiency = (1 - 1 / Math.pow(r, gamma - 1)) * 100;
      
      const questionTypes = ['efficiency', 'compression-ratio'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.gamma = gamma;
      
      if (questionType === 'efficiency') {
        challenge.r = r;
        challenge.question = `Chu trình Otto có tỉ số nén r=${r} (γ=1.4). Hiệu suất lý thuyết (%) là?`;
        challenge.correctAnswer = Math.round(efficiency * 10) / 10;
        challenge.unit = '%';
        challenge.efficiency = efficiency;
      } else {
        const knownEfficiency = Math.round(efficiency);
        challenge.efficiency = knownEfficiency;
        // η = 1 - 1/r^(γ-1) => r = (1/(1-η))^(1/(γ-1))
        const r_calc = Math.pow(1 / (1 - knownEfficiency / 100), 1 / (gamma - 1));
        challenge.question = `Chu trình Otto có hiệu suất ${knownEfficiency}% (γ=1.4). Tỉ số nén r là?`;
        challenge.correctAnswer = Math.round(r_calc * 10) / 10;
        challenge.unit = '';
        challenge.r = r_calc;
      }
    } else if (cycleType === 'diesel') {
      // Chu trình Diesel: η = 1 - (1/r^(γ-1)) × [(ρ^γ - 1)/(γ(ρ - 1))]
      const r = Math.round(Math.random() * 8 + 12); // Tỉ số nén 12-20
      const rho = Math.round((Math.random() * 1 + 1.5) * 10) / 10; // Tỉ số cắt 1.5-2.5
      const gamma = 1.4;
      
      const term1 = 1 / Math.pow(r, gamma - 1);
      const term2 = (Math.pow(rho, gamma) - 1) / (gamma * (rho - 1));
      const efficiency = (1 - term1 * term2) * 100;
      
      challenge.r = r;
      challenge.rho = rho;
      challenge.gamma = gamma;
      challenge.question = `Chu trình Diesel có tỉ số nén r=${r}, tỉ số cắt ρ=${rho} (γ=1.4). Hiệu suất (%) là?`;
      challenge.correctAnswer = Math.round(efficiency * 10) / 10;
      challenge.unit = '%';
      challenge.efficiency = efficiency;
    } else if (cycleType === 'first-law') {
      // Định luật I nhiệt động lực học: ΔU = Q - W
      const processTypes = ['isochoric', 'isobaric', 'isothermal', 'adiabatic'];
      const processType = processTypes[Math.floor(Math.random() * processTypes.length)];
      
      challenge.processType = processType;
      
      if (processType === 'isochoric') {
        // Đẳng tích: W = 0, ΔU = Q
        const Q = Math.round((Math.random() * 1000 + 500) * (Math.random() < 0.5 ? 1 : -1));
        challenge.Q = Q;
        challenge.question = `Quá trình đẳng tích: Khí nhận ${Math.abs(Q)} J nhiệt lượng ${Q > 0 ? '(đun nóng)' : '(làm lạnh)'}. Độ biến thiên nội năng ΔU (J) là?`;
        challenge.correctAnswer = Q;
        challenge.unit = 'J';
        challenge.deltaU = Q;
        challenge.W = 0;
      } else if (processType === 'isobaric') {
        // Đẳng áp: W = PΔV, ΔU = Q - W
        const Q = Math.round(Math.random() * 1500 + 1000);
        const W = Math.round(Math.random() * 500 + 200);
        challenge.Q = Q;
        challenge.W = W;
        const deltaU = Q - W;
        challenge.question = `Quá trình đẳng áp: Khí nhận ${Q} J nhiệt, sinh công ${W} J. Độ biến thiên nội năng ΔU (J) là?`;
        challenge.correctAnswer = deltaU;
        challenge.unit = 'J';
        challenge.deltaU = deltaU;
      } else if (processType === 'isothermal') {
        // Đẳng nhiệt: ΔU = 0, Q = W
        const W = Math.round(Math.random() * 800 + 400);
        challenge.W = W;
        challenge.question = `Quá trình đẳng nhiệt: Khí giãn nở sinh công ${W} J. Nhiệt lượng khí nhận vào (J) là?`;
        challenge.correctAnswer = W;
        challenge.unit = 'J';
        challenge.Q = W;
        challenge.deltaU = 0;
      } else {
        // Đoạn nhiệt: Q = 0, ΔU = -W
        const W = Math.round(Math.random() * 600 + 300);
        challenge.W = W;
        const deltaU = -W;
        challenge.question = `Quá trình đoạn nhiệt: Khí giãn nở sinh công ${W} J. Độ biến thiên nội năng ΔU (J) là?`;
        challenge.correctAnswer = deltaU;
        challenge.unit = 'J';
        challenge.Q = 0;
        challenge.deltaU = deltaU;
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

      if (currentChallenge.cycleType === 'carnot') {
        drawCarnotCycle(ctx, width, height);
      } else if (currentChallenge.cycleType === 'otto') {
        drawOttoCycle(ctx, width, height);
      } else if (currentChallenge.cycleType === 'diesel') {
        drawDieselCycle(ctx, width, height);
      } else if (currentChallenge.cycleType === 'first-law') {
        drawFirstLaw(ctx, width, height);
      }
    };

    const drawCarnotCycle = (ctx, w, h) => {
      const { T_h, T_c, efficiency } = currentChallenge;
      
      // Biểu đồ P-V chu trình Carnot
      const graphX = 120;
      const graphY = h / 2;
      const graphW = 250;
      const graphH = 200;
      
      // Trục
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      // Nhãn
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('V', graphX + graphW / 2, graphY + graphH / 2 + 30);
      ctx.save();
      ctx.translate(graphX - 30, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // 4 đỉnh chu trình Carnot
      const points = [
        { x: 0.2, y: 0.8, label: '1' },
        { x: 0.5, y: 0.5, label: '2' },
        { x: 0.8, y: 0.3, label: '3' },
        { x: 0.4, y: 0.6, label: '4' }
      ];
      
      // Vẽ chu trình với animation
      const progress = animationProgress;
      const totalSteps = 4;
      const currentStep = Math.floor(progress * totalSteps);
      const stepProgress = (progress * totalSteps) % 1;
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      
      for (let i = 0; i < totalSteps; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % totalSteps];
        
        const x1 = graphX + p1.x * graphW;
        const y1 = graphY + graphH / 2 - p1.y * graphH;
        const x2 = graphX + p2.x * graphW;
        const y2 = graphY + graphH / 2 - p2.y * graphH;
        
        if (i < currentStep) {
          // Đã vẽ xong
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          // Đường cong (isothermal hoặc adiabatic)
          const isIsothermal = (i === 0 || i === 2);
          if (isIsothermal) {
            // Đẳng nhiệt (hyperbola)
            for (let t = 0; t <= 1; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 20;
              ctx.lineTo(x, y);
            }
          } else {
            // Đoạn nhiệt (đường dốc hơn)
            ctx.lineTo(x2, y2);
          }
          ctx.stroke();
        } else if (i === currentStep) {
          // Đang vẽ
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          const isIsothermal = (i === 0 || i === 2);
          const progressX = x1 + (x2 - x1) * stepProgress;
          const progressY = isIsothermal 
            ? y1 + (y2 - y1) * stepProgress + Math.sin(stepProgress * Math.PI) * 20
            : y1 + (y2 - y1) * stepProgress;
          
          if (isIsothermal) {
            for (let t = 0; t <= stepProgress; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 20;
              ctx.lineTo(x, y);
            }
          } else {
            ctx.lineTo(progressX, progressY);
          }
          ctx.stroke();
          
          // Chấm di chuyển
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(progressX, progressY, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Đánh số đỉnh
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p1.label, x1, y1 - 15);
      }
      
      // Nhãn quá trình
      const processes = [
        { label: 'Giãn nở đẳng nhiệt (T_h)', x: 0.35, y: 0.65, color: '#ef4444' },
        { label: 'Giãn nở đoạn nhiệt', x: 0.65, y: 0.42, color: '#3b82f6' },
        { label: 'Nén đẳng nhiệt (T_c)', x: 0.6, y: 0.45, color: '#ef4444' },
        { label: 'Nén đoạn nhiệt', x: 0.3, y: 0.7, color: '#3b82f6' }
      ];
      
      ctx.font = '11px Arial';
      processes.forEach((proc, i) => {
        if (currentStep > i || (currentStep === i && stepProgress > 0.5)) {
          ctx.fillStyle = proc.color;
          ctx.fillText(proc.label, graphX + proc.x * graphW, graphY + graphH / 2 - proc.y * graphH);
        }
      });
      
      // Sơ đồ nhiệt động
      const diagramX = 500;
      const diagramY = h / 2;
      
      // Nguồn nóng
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(diagramX - 60, diagramY - 120, 120, 40);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(diagramX - 60, diagramY - 120, 120, 40);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`T_h = ${T_h} K`, diagramX, diagramY - 95);
      
      // Động cơ
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(diagramX, diagramY, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Engine', diagramX, diagramY - 5);
      ctx.fillText(`η=${efficiency.toFixed(1)}%`, diagramX, diagramY + 15);
      
      // Nguồn lạnh
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(diagramX - 60, diagramY + 80, 120, 40);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(diagramX - 60, diagramY + 80, 120, 40);
      ctx.fillStyle = '#fff';
      ctx.fillText(`T_c = ${T_c} K`, diagramX, diagramY + 105);
      
      // Mũi tên dòng nhiệt
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(diagramX, diagramY - 80);
      ctx.lineTo(diagramX, diagramY - 50);
      ctx.stroke();
      
      // Đầu mũi tên
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(diagramX, diagramY - 50);
      ctx.lineTo(diagramX - 6, diagramY - 60);
      ctx.lineTo(diagramX + 6, diagramY - 60);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '12px Arial';
      ctx.fillText('Q_h', diagramX + 20, diagramY - 60);
      
      // Mũi tên nhiệt thoát
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(diagramX, diagramY + 50);
      ctx.lineTo(diagramX, diagramY + 80);
      ctx.stroke();
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(diagramX, diagramY + 80);
      ctx.lineTo(diagramX - 6, diagramY + 70);
      ctx.lineTo(diagramX + 6, diagramY + 70);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('Q_c', diagramX + 20, diagramY + 70);
      
      // Mũi tên công
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(diagramX + 50, diagramY);
      ctx.lineTo(diagramX + 100, diagramY);
      ctx.stroke();
      
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(diagramX + 100, diagramY);
      ctx.lineTo(diagramX + 90, diagramY - 6);
      ctx.lineTo(diagramX + 90, diagramY + 6);
      ctx.closePath();
      ctx.fill();
      
      ctx.font = 'bold 14px Arial';
      ctx.fillText('W', diagramX + 75, diagramY - 10);
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('η = 1 - T_c/T_h', 30, h - 30);
      ctx.fillText(`η = 1 - ${T_c}/${T_h} = ${efficiency.toFixed(1)}%`, 30, h - 10);
    };

    const drawOttoCycle = (ctx, w, h) => {
      const { r, efficiency, gamma } = currentChallenge;
      
      // Biểu đồ P-V chu trình Otto
      const graphX = 120;
      const graphY = h / 2;
      const graphW = 250;
      const graphH = 200;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('V', graphX + graphW / 2, graphY + graphH / 2 + 30);
      ctx.save();
      ctx.translate(graphX - 30, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // 4 điểm chu trình Otto
      const points = [
        { x: 0.7, y: 0.2, label: '1' },
        { x: 0.3, y: 0.4, label: '2' },
        { x: 0.3, y: 0.7, label: '3' },
        { x: 0.7, y: 0.4, label: '4' }
      ];
      
      const progress = animationProgress;
      const totalSteps = 4;
      const currentStep = Math.floor(progress * totalSteps);
      const stepProgress = (progress * totalSteps) % 1;
      
      for (let i = 0; i < totalSteps; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % totalSteps];
        
        const x1 = graphX + p1.x * graphW;
        const y1 = graphY + graphH / 2 - p1.y * graphH;
        const x2 = graphX + p2.x * graphW;
        const y2 = graphY + graphH / 2 - p2.y * graphH;
        
        if (i < currentStep) {
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          if (i === 0 || i === 2) {
            // Quá trình đoạn nhiệt (đường cong)
            for (let t = 0; t <= 1; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * Math.pow(t, 1.4);
              ctx.lineTo(x, y);
            }
          } else {
            // Quá trình đẳng tích (thẳng đứng)
            ctx.lineTo(x2, y2);
          }
          ctx.stroke();
        } else if (i === currentStep) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          if (i === 0 || i === 2) {
            for (let t = 0; t <= stepProgress; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * Math.pow(t, 1.4);
              ctx.lineTo(x, y);
            }
          } else {
            const progressX = x1 + (x2 - x1) * stepProgress;
            const progressY = y1 + (y2 - y1) * stepProgress;
            ctx.lineTo(progressX, progressY);
          }
          ctx.stroke();
        }
        
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p1.label, x1, y1 - 15);
      }
      
      // Nhãn quá trình
      const labels = [
        '1→2: Nén đoạn nhiệt',
        '2→3: Cháy đẳng tích',
        '3→4: Giãn nở đoạn nhiệt',
        '4→1: Xả đẳng tích'
      ];
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'left';
      labels.forEach((label, i) => {
        if (currentStep > i) {
          ctx.fillText(label, graphX + graphW + 20, graphY - graphH / 2 + 40 + i * 25);
        }
      });
      
      // Động cơ xăng
      const engineX = 550;
      const engineY = h / 2;
      
      // Xy lanh
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(engineX - 50, engineY - 80, 100, 160);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.strokeRect(engineX - 50, engineY - 80, 100, 160);
      
      // Piston (di chuyển)
      const pistonY = engineY + 60 - Math.abs(Math.sin(animationProgress * Math.PI * 2)) * 100;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(engineX - 45, pistonY - 10, 90, 20);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(engineX - 45, pistonY - 10, 90, 20);
      
      // Bugi
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(engineX, engineY - 80);
      ctx.lineTo(engineX, engineY - 60);
      ctx.stroke();
      
      if (currentStep === 1 && stepProgress > 0.3) {
        // Tia lửa
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(engineX, engineY - 60);
          ctx.lineTo(engineX + Math.cos(angle) * 15, engineY - 60 + Math.sin(angle) * 15);
          ctx.stroke();
        }
      }
      
      // Thông tin
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Otto Cycle', engineX, engineY + 110);
      ctx.fillText(`r = ${r}`, engineX, engineY + 130);
      ctx.fillText(`η = ${efficiency.toFixed(1)}%`, engineX, engineY + 150);
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('η = 1 - 1/r^(γ-1)', 30, h - 30);
      ctx.fillText(`η = 1 - 1/${r}^0.4 = ${efficiency.toFixed(1)}%`, 30, h - 10);
    };

    const drawDieselCycle = (ctx, w, h) => {
      const { r, rho, efficiency } = currentChallenge;
      
      // Biểu đồ P-V chu trình Diesel
      const graphX = 120;
      const graphY = h / 2;
      const graphW = 250;
      const graphH = 200;
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(graphX, graphY - graphH / 2);
      ctx.lineTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('V', graphX + graphW / 2, graphY + graphH / 2 + 30);
      ctx.save();
      ctx.translate(graphX - 30, graphY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('P', 0, 0);
      ctx.restore();
      
      // 4 điểm chu trình Diesel
      const points = [
        { x: 0.7, y: 0.2, label: '1' },
        { x: 0.3, y: 0.5, label: '2' },
        { x: 0.4, y: 0.7, label: '3' },
        { x: 0.7, y: 0.4, label: '4' }
      ];
      
      const progress = animationProgress;
      const totalSteps = 4;
      const currentStep = Math.floor(progress * totalSteps);
      const stepProgress = (progress * totalSteps) % 1;
      
      for (let i = 0; i < totalSteps; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % totalSteps];
        
        const x1 = graphX + p1.x * graphW;
        const y1 = graphY + graphH / 2 - p1.y * graphH;
        const x2 = graphX + p2.x * graphW;
        const y2 = graphY + graphH / 2 - p2.y * graphH;
        
        if (i < currentStep) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          if (i === 0 || i === 2) {
            for (let t = 0; t <= 1; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * Math.pow(t, 1.3);
              ctx.lineTo(x, y);
            }
          } else {
            ctx.lineTo(x2, y2);
          }
          ctx.stroke();
        } else if (i === currentStep) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          if (i === 0 || i === 2) {
            for (let t = 0; t <= stepProgress; t += 0.05) {
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * Math.pow(t, 1.3);
              ctx.lineTo(x, y);
            }
          } else {
            const progressX = x1 + (x2 - x1) * stepProgress;
            const progressY = y1 + (y2 - y1) * stepProgress;
            ctx.lineTo(progressX, progressY);
          }
          ctx.stroke();
        }
        
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p1.label, x1, y1 - 15);
      }
      
      // Động cơ diesel
      const engineX = 550;
      const engineY = h / 2;
      
      ctx.fillStyle = '#64748b';
      ctx.fillRect(engineX - 60, engineY - 90, 120, 180);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.strokeRect(engineX - 60, engineY - 90, 120, 180);
      
      // Kim phun nhiên liệu
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(engineX, engineY - 90);
      ctx.lineTo(engineX, engineY - 50);
      ctx.stroke();
      
      if (currentStep === 1 && stepProgress > 0.2) {
        // Phun nhiên liệu
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(engineX, engineY - 50);
          ctx.lineTo(engineX - 10 + i * 10, engineY - 30 - i * 5);
          ctx.stroke();
        }
      }
      
      // Piston
      const pistonY = engineY + 70 - Math.abs(Math.sin(animationProgress * Math.PI * 2)) * 120;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(engineX - 55, pistonY - 15, 110, 30);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.strokeRect(engineX - 55, pistonY - 15, 110, 30);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Diesel Cycle', engineX, engineY + 120);
      ctx.fillText(`r=${r}, ρ=${rho}`, engineX, engineY + 140);
      ctx.fillText(`η=${efficiency.toFixed(1)}%`, engineX, engineY + 160);
      
      // Công thức
      ctx.fillStyle = '#1f2937';
      ctx.font = '13px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('η = 1 - (1/r^(γ-1))×[(ρ^γ-1)/(γ(ρ-1))]', 30, h - 10);
    };

    const drawFirstLaw = (ctx, w, h) => {
      const { processType, Q, W, deltaU } = currentChallenge;
      
      // Hệ thống
      const sysX = w / 2 - 150;
      const sysY = h / 2;
      const sysSize = 150;
      
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(sysX - sysSize / 2, sysY - sysSize / 2, sysSize, sysSize);
      ctx.strokeStyle = '#0099cc';
      ctx.lineWidth = 4;
      ctx.strokeRect(sysX - sysSize / 2, sysY - sysSize / 2, sysSize, sysSize);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Hệ khí', sysX, sysY - 10);
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`ΔU = ${deltaU} J`, sysX, sysY + 15);
      
      // Mũi tên nhiệt Q
      if (Q !== 0) {
        const qSign = Q > 0 ? 1 : -1;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (qSign > 0) {
          ctx.moveTo(sysX - sysSize / 2 - 80, sysY);
          ctx.lineTo(sysX - sysSize / 2, sysY);
        } else {
          ctx.moveTo(sysX - sysSize / 2, sysY);
          ctx.lineTo(sysX - sysSize / 2 - 80, sysY);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        if (qSign > 0) {
          ctx.moveTo(sysX - sysSize / 2, sysY);
          ctx.lineTo(sysX - sysSize / 2 - 10, sysY - 8);
          ctx.lineTo(sysX - sysSize / 2 - 10, sysY + 8);
        } else {
          ctx.moveTo(sysX - sysSize / 2 - 80, sysY);
          ctx.lineTo(sysX - sysSize / 2 - 70, sysY - 8);
          ctx.lineTo(sysX - sysSize / 2 - 70, sysY + 8);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Q = ${Q} J`, sysX - sysSize / 2 - 100, sysY - 10);
      }
      
      // Mũi tên công W
      if (W !== 0) {
        const wSign = W > 0 ? 1 : -1;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (wSign > 0) {
          ctx.moveTo(sysX + sysSize / 2, sysY);
          ctx.lineTo(sysX + sysSize / 2 + 80, sysY);
        } else {
          ctx.moveTo(sysX + sysSize / 2 + 80, sysY);
          ctx.lineTo(sysX + sysSize / 2, sysY);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        if (wSign > 0) {
          ctx.moveTo(sysX + sysSize / 2 + 80, sysY);
          ctx.lineTo(sysX + sysSize / 2 + 70, sysY - 8);
          ctx.lineTo(sysX + sysSize / 2 + 70, sysY + 8);
        } else {
          ctx.moveTo(sysX + sysSize / 2, sysY);
          ctx.lineTo(sysX + sysSize / 2 + 10, sysY - 8);
          ctx.lineTo(sysX + sysSize / 2 + 10, sysY + 8);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`W = ${W} J`, sysX + sysSize / 2 + 100, sysY - 10);
      }
      
      // Nhãn quá trình
      const processNames = {
        'isochoric': 'Đẳng tích (V=const)',
        'isobaric': 'Đẳng áp (P=const)',
        'isothermal': 'Đẳng nhiệt (T=const)',
        'adiabatic': 'Đoạn nhiệt (Q=0)'
      };
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(processNames[processType], w / 2, 50);
      
      // Định luật I
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ΔU = Q - W', w / 2, h - 50);
      ctx.fillText(`${deltaU} = ${Q} - ${W}`, w / 2, h - 25);
      
      // Biểu đồ thanh so sánh
      const barX = w / 2 + 200;
      const barY = h / 2;
      const barW = 40;
      const maxHeight = 120;
      
      const values = [
        { label: 'Q', value: Q, color: '#ef4444' },
        { label: 'W', value: W, color: '#10b981' },
        { label: 'ΔU', value: deltaU, color: '#3b82f6' }
      ];
      
      const maxVal = Math.max(...values.map(v => Math.abs(v.value)), 1);
      
      values.forEach((item, i) => {
        const height = (item.value / maxVal) * maxHeight;
        const x = barX + i * (barW + 20);
        const y = barY - (height > 0 ? height : 0);
        
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barW, Math.abs(height));
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barW, Math.abs(height));
        
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barW / 2, barY + 25);
        ctx.fillText(`${item.value}J`, x + barW / 2, y - 10);
      });
      
      // Trục 0
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(barX - 10, barY);
      ctx.lineTo(barX + 3 * (barW + 20) - 10, barY);
      ctx.stroke();
    };

    // Animation loop
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.006;
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
      <div className="thermodynamic-cycles">
        <div className="game-menu">
          <div className="menu-header">
            <Zap size={60} className="menu-icon" />
            <h1>Thermodynamic Cycles</h1>
            <p className="menu-subtitle">Khám phá chu trình nhiệt động học</p>
          </div>

          <div className="theory-section">
            <h2><Activity size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Chu trình Carnot</h3>
              <p><strong>Hiệu suất:</strong> η = 1 - T_c/T_h</p>
              <p>Chu trình lý tưởng nhất giữa hai nguồn nhiệt</p>
            </div>

            <div className="theory-box">
              <h3>2. Chu trình Otto (Động cơ xăng)</h3>
              <p><strong>Hiệu suất:</strong> η = 1 - 1/r^(γ-1)</p>
              <p>r: tỉ số nén, γ: hệ số đoạn nhiệt</p>
            </div>

            <div className="theory-box">
              <h3>3. Chu trình Diesel (Động cơ diesel)</h3>
              <p><strong>Hiệu suất:</strong> η = 1 - (1/r^(γ-1)) × [(ρ^γ - 1)/(γ(ρ - 1))]</p>
              <p>ρ: tỉ số cắt (cut-off ratio)</p>
            </div>

            <div className="theory-box">
              <h3>4. Định luật I nhiệt động lực học</h3>
              <p><strong>Công thức:</strong> ΔU = Q - W</p>
              <p>Độ biến thiên nội năng = Nhiệt nhận - Công sinh</p>
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
      <div className="thermodynamic-cycles">
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
                <Zap size={20} />
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
      <div className="thermodynamic-cycles">
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

export default ThermodynamicCycles;
