import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Target, Flame, Droplet, ThermometerSnowflake, ThermometerSun } from 'lucide-react';
import './HeatTransferSimulator.css';

const HeatTransferSimulator = () => {
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

  // Nhiệt dung riêng (J/kg·K)
  const specificHeatCapacities = {
    water: 4200,
    ice: 2100,
    aluminum: 900,
    iron: 450,
    copper: 390,
    lead: 130
  };

  // Loại scenario
  const scenarioTypes = ['heating-cooling', 'heat-exchange', 'calorimetry'];

  // Tạo challenge mới
  const generateChallenge = useCallback((currentLevel) => {
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    let challenge = { scenarioType };

    if (scenarioType === 'heating-cooling') {
      // Q = mcΔT - Tính nhiệt lượng để đun nóng/làm lạnh
      const materials = ['water', 'aluminum', 'iron', 'copper'];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mass = Math.round((Math.random() * 5 + 0.5) * 10) / 10; // 0.5-5.5 kg
      const t1 = Math.round(Math.random() * 40 + 10); // 10-50°C
      const t2 = Math.round(Math.random() * 40 + 50); // 50-90°C
      const c = specificHeatCapacities[material];
      
      const deltaT = Math.abs(t2 - t1);
      const heatRequired = mass * c * deltaT; // J
      
      const questionTypes = ['heat', 'mass', 'delta-temp'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      challenge.material = material;
      challenge.c = c;
      
      if (questionType === 'heat') {
        challenge.mass = mass;
        challenge.t1 = t1;
        challenge.t2 = t2;
        challenge.question = `Cần cung cấp bao nhiêu nhiệt lượng (kJ) để ${t2 > t1 ? 'đun nóng' : 'làm lạnh'} ${mass} kg ${material} từ ${t1}°C đến ${t2}°C? (c = ${c} J/kg·K)`;
        challenge.correctAnswer = Math.round(heatRequired / 1000 * 10) / 10; // kJ
        challenge.unit = 'kJ';
      } else if (questionType === 'mass') {
        const knownHeat = Math.round(heatRequired / 1000); // kJ
        challenge.heat = knownHeat * 1000; // J
        challenge.t1 = t1;
        challenge.t2 = t2;
        challenge.question = `Khối lượng ${material} (kg) cần thiết để hấp thụ ${knownHeat} kJ nhiệt khi nhiệt độ tăng từ ${t1}°C đến ${t2}°C là bao nhiêu? (c = ${c} J/kg·K)`;
        challenge.correctAnswer = Math.round((knownHeat * 1000) / (c * deltaT) * 10) / 10;
        challenge.unit = 'kg';
      } else {
        const knownHeat = Math.round(heatRequired / 1000); // kJ
        challenge.heat = knownHeat * 1000;
        challenge.mass = mass;
        challenge.t1 = t1;
        challenge.question = `Nhiệt độ cuối cùng (°C) của ${mass} kg ${material} ban đầu ở ${t1}°C sau khi hấp thụ ${knownHeat} kJ nhiệt là bao nhiêu? (c = ${c} J/kg·K)`;
        const deltaTemp = (knownHeat * 1000) / (mass * c);
        challenge.correctAnswer = Math.round((t1 + deltaTemp) * 10) / 10;
        challenge.t2 = challenge.correctAnswer;
        challenge.unit = '°C';
      }
    } else if (scenarioType === 'heat-exchange') {
      // Trao đổi nhiệt giữa hai vật
      const materials = ['water', 'aluminum', 'iron', 'copper'];
      const mat1 = materials[Math.floor(Math.random() * materials.length)];
      let mat2 = materials[Math.floor(Math.random() * materials.length)];
      while (mat2 === mat1 && materials.length > 1) {
        mat2 = materials[Math.floor(Math.random() * materials.length)];
      }
      
      const m1 = Math.round((Math.random() * 3 + 0.5) * 10) / 10;
      const m2 = Math.round((Math.random() * 3 + 0.5) * 10) / 10;
      const t1_hot = Math.round(Math.random() * 30 + 60); // 60-90°C
      const t2_cold = Math.round(Math.random() * 20 + 10); // 10-30°C
      
      const c1 = specificHeatCapacities[mat1];
      const c2 = specificHeatCapacities[mat2];
      
      // Nhiệt độ cân bằng: m1·c1·(t1 - tf) = m2·c2·(tf - t2)
      const tf = (m1 * c1 * t1_hot + m2 * c2 * t2_cold) / (m1 * c1 + m2 * c2);
      
      challenge.mat1 = mat1;
      challenge.mat2 = mat2;
      challenge.c1 = c1;
      challenge.c2 = c2;
      challenge.m1 = m1;
      challenge.m2 = m2;
      challenge.t1_hot = t1_hot;
      challenge.t2_cold = t2_cold;
      challenge.question = `Trộn ${m1} kg ${mat1} ở ${t1_hot}°C với ${m2} kg ${mat2} ở ${t2_cold}°C. Nhiệt độ cân bằng (°C) là bao nhiêu? (c₁=${c1} J/kg·K, c₂=${c2} J/kg·K)`;
      challenge.correctAnswer = Math.round(tf * 10) / 10;
      challenge.unit = '°C';
    } else if (scenarioType === 'calorimetry') {
      // Bài toán nhiệt lượng kế
      const waterMass = Math.round((Math.random() * 1 + 0.2) * 10) / 10; // 0.2-1.2 kg nước
      const sampleMass = Math.round((Math.random() * 0.5 + 0.1) * 100) / 100; // 0.1-0.6 kg mẫu
      const waterTemp = Math.round(Math.random() * 10 + 15); // 15-25°C
      const sampleTemp = Math.round(Math.random() * 30 + 70); // 70-100°C
      const finalTemp = Math.round(Math.random() * 10 + 25); // 25-35°C
      
      const c_water = specificHeatCapacities.water;
      
      // Q_thu = Q_tỏa: m_water · c_water · (tf - t_water) = m_sample · c_sample · (t_sample - tf)
      const c_sample = (waterMass * c_water * (finalTemp - waterTemp)) / (sampleMass * (sampleTemp - finalTemp));
      
      challenge.waterMass = waterMass;
      challenge.sampleMass = sampleMass;
      challenge.waterTemp = waterTemp;
      challenge.sampleTemp = sampleTemp;
      challenge.finalTemp = finalTemp;
      challenge.c_water = c_water;
      challenge.question = `Thả ${sampleMass} kg mẫu kim loại ở ${sampleTemp}°C vào ${waterMass} kg nước ở ${waterTemp}°C trong nhiệt lượng kế. Nhiệt độ cân bằng là ${finalTemp}°C. Nhiệt dung riêng của kim loại (J/kg·K) là bao nhiêu?`;
      challenge.correctAnswer = Math.round(c_sample);
      challenge.unit = 'J/kg·K';
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

      if (currentChallenge.scenarioType === 'heating-cooling') {
        drawHeatingCooling(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'heat-exchange') {
        drawHeatExchange(ctx, width, height);
      } else if (currentChallenge.scenarioType === 'calorimetry') {
        drawCalorimetry(ctx, width, height);
      }
    };

    const drawHeatingCooling = (ctx, w, h) => {
      const { t1, t2, material } = currentChallenge;
      const isHeating = t2 > t1;
      
      // Bếp hoặc tủ lạnh
      const applianceX = 150;
      const applianceY = h / 2 + 50;
      const applianceW = 120;
      const applianceH = 100;
      
      if (isHeating) {
        // Bếp
        ctx.fillStyle = '#555';
        ctx.fillRect(applianceX, applianceY, applianceW, applianceH);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(applianceX, applianceY, applianceW, applianceH);
        
        // Lò xo bếp
        for (let i = 0; i < 3; i++) {
          const spiralY = applianceY + 20 + i * 25;
          ctx.beginPath();
          ctx.arc(applianceX + 30, spiralY, 15, 0, Math.PI * 2);
          ctx.strokeStyle = animationProgress > 0.3 ? '#ff4444' : '#666';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      } else {
        // Tủ lạnh
        ctx.fillStyle = '#e0f7ff';
        ctx.fillRect(applianceX, applianceY, applianceW, applianceH);
        ctx.strokeStyle = '#0099cc';
        ctx.lineWidth = 3;
        ctx.strokeRect(applianceX, applianceY, applianceW, applianceH);
        
        // Biểu tượng tuyết
        for (let i = 0; i < 3; i++) {
          const snowY = applianceY + 25 + i * 30;
          ctx.strokeStyle = '#4db8ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(applianceX + 60, snowY - 10);
          ctx.lineTo(applianceX + 60, snowY + 10);
          ctx.moveTo(applianceX + 50, snowY);
          ctx.lineTo(applianceX + 70, snowY);
          ctx.moveTo(applianceX + 53, snowY - 7);
          ctx.lineTo(applianceX + 67, snowY + 7);
          ctx.moveTo(applianceX + 67, snowY - 7);
          ctx.lineTo(applianceX + 53, snowY + 7);
          ctx.stroke();
        }
      }
      
      // Vật liệu (nồi/hộp)
      const containerX = 450;
      const containerY = h / 2 + 50;
      const containerW = 100;
      const containerH = 100;
      
      // Nhiệt độ hiện tại (nội suy)
      const currentTemp = t1 + (t2 - t1) * animationProgress;
      
      // Màu gradient theo nhiệt độ
      const tempRatio = (currentTemp - 0) / 100; // 0-100°C
      const gradient = ctx.createLinearGradient(containerX, containerY, containerX, containerY + containerH);
      if (tempRatio < 0.3) {
        gradient.addColorStop(0, '#4db8ff');
        gradient.addColorStop(1, '#0066cc');
      } else if (tempRatio < 0.6) {
        gradient.addColorStop(0, '#ffdd44');
        gradient.addColorStop(1, '#ff9900');
      } else {
        gradient.addColorStop(0, '#ff6666');
        gradient.addColorStop(1, '#cc0000');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(containerX, containerY, containerW, containerH);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.strokeRect(containerX, containerY, containerW, containerH);
      
      // Nhãn vật liệu
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(material.toUpperCase(), containerX + containerW / 2, containerY + containerH / 2 - 10);
      
      // Nhiệt độ hiện tại
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${Math.round(currentTemp)}°C`, containerX + containerW / 2, containerY + containerH / 2 + 10);
      
      // Mũi tên dòng nhiệt
      if (animationProgress > 0.2) {
        ctx.strokeStyle = isHeating ? '#ff4444' : '#4db8ff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        const arrowStartX = applianceX + applianceW + 20;
        const arrowEndX = containerX - 20;
        const arrowY = h / 2 + 100;
        
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowEndX, arrowY);
        ctx.stroke();
        
        // Đầu mũi tên
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY);
        ctx.lineTo(arrowEndX - 10, arrowY - 6);
        ctx.lineTo(arrowEndX - 10, arrowY + 6);
        ctx.closePath();
        ctx.fillStyle = isHeating ? '#ff4444' : '#4db8ff';
        ctx.fill();
      }
      
      // Hiển thị thông tin
      ctx.fillStyle = '#333';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Initial: ${t1}°C`, 50, 50);
      ctx.fillText(`Target: ${t2}°C`, 50, 80);
      ctx.fillText(`Mass: ${currentChallenge.mass} kg`, 50, 110);
    };

    const drawHeatExchange = (ctx, w, h) => {
      const { m1, m2, t1_hot, t2_cold, mat1, mat2 } = currentChallenge;
      
      // Nhiệt độ cân bằng (tính từ correctAnswer)
      const tf = currentChallenge.correctAnswer;
      
      // Nhiệt độ hiện tại của vật 1 và vật 2
      const temp1 = t1_hot - (t1_hot - tf) * animationProgress;
      const temp2 = t2_cold + (tf - t2_cold) * animationProgress;
      
      // Vật 1 (nóng) - bên trái
      const obj1X = 120;
      const obj1Y = h / 2;
      const obj1Size = 100;
      
      // Màu theo nhiệt độ vật 1
      const ratio1 = (temp1 - 0) / 100;
      const gradient1 = ctx.createRadialGradient(obj1X, obj1Y, 0, obj1X, obj1Y, obj1Size / 2);
      if (ratio1 > 0.6) {
        gradient1.addColorStop(0, '#ff6666');
        gradient1.addColorStop(1, '#cc0000');
      } else {
        gradient1.addColorStop(0, '#ffdd44');
        gradient1.addColorStop(1, '#ff9900');
      }
      
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(obj1X, obj1Y, obj1Size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Nhãn vật 1
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(mat1.toUpperCase(), obj1X, obj1Y - 10);
      ctx.fillText(`${m1} kg`, obj1X, obj1Y + 5);
      ctx.fillText(`${Math.round(temp1)}°C`, obj1X, obj1Y + 20);
      
      // Vật 2 (lạnh) - bên phải
      const obj2X = 480;
      const obj2Y = h / 2;
      const obj2Size = 100;
      
      // Màu theo nhiệt độ vật 2
      const ratio2 = (temp2 - 0) / 100;
      const gradient2 = ctx.createRadialGradient(obj2X, obj2Y, 0, obj2X, obj2Y, obj2Size / 2);
      if (ratio2 < 0.3) {
        gradient2.addColorStop(0, '#4db8ff');
        gradient2.addColorStop(1, '#0066cc');
      } else if (ratio2 < 0.6) {
        gradient2.addColorStop(0, '#ffdd44');
        gradient2.addColorStop(1, '#ff9900');
      } else {
        gradient2.addColorStop(0, '#ff6666');
        gradient2.addColorStop(1, '#cc0000');
      }
      
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(obj2X, obj2Y, obj2Size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Nhãn vật 2
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(mat2.toUpperCase(), obj2X, obj2Y - 10);
      ctx.fillText(`${m2} kg`, obj2X, obj2Y + 5);
      ctx.fillText(`${Math.round(temp2)}°C`, obj2X, obj2Y + 20);
      
      // Mũi tên trao đổi nhiệt (hai chiều)
      if (animationProgress > 0.2) {
        const arrowY1 = h / 2 - 30;
        const arrowY2 = h / 2 + 30;
        const arrowStartX = obj1X + obj1Size / 2 + 10;
        const arrowEndX = obj2X - obj2Size / 2 - 10;
        
        // Nhiệt từ vật 1 sang vật 2
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY1);
        ctx.lineTo(arrowEndX, arrowY1);
        ctx.stroke();
        
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY1);
        ctx.lineTo(arrowEndX - 10, arrowY1 - 6);
        ctx.lineTo(arrowEndX - 10, arrowY1 + 6);
        ctx.closePath();
        ctx.fillStyle = '#ff4444';
        ctx.fill();
        
        // Nhiệt từ vật 2 sang vật 1 (nhỏ hơn, mờ hơn)
        ctx.strokeStyle = 'rgba(77, 184, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY2);
        ctx.lineTo(arrowStartX, arrowY2);
        ctx.stroke();
        
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY2);
        ctx.lineTo(arrowStartX + 10, arrowY2 - 6);
        ctx.lineTo(arrowStartX + 10, arrowY2 + 6);
        ctx.closePath();
        ctx.fillStyle = 'rgba(77, 184, 255, 0.5)';
        ctx.fill();
      }
      
      // Thông tin ban đầu
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Initial: ${t1_hot}°C (hot) & ${t2_cold}°C (cold)`, w / 2, 50);
      if (animationProgress > 0.8) {
        ctx.fillStyle = '#00aa00';
        ctx.fillText(`Equilibrium: ${Math.round(tf)}°C`, w / 2, 80);
      }
    };

    const drawCalorimetry = (ctx, w, h) => {
      const { waterMass, sampleMass, waterTemp, sampleTemp, finalTemp } = currentChallenge;
      
      // Nhiệt lượng kế (container cách nhiệt)
      const calorimeterX = w / 2;
      const calorimeterY = h / 2 + 50;
      const calorimeterW = 200;
      const calorimeterH = 150;
      
      // Vẽ nhiệt lượng kế
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(calorimeterX - calorimeterW / 2, calorimeterY - calorimeterH / 2, calorimeterW, calorimeterH);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 5;
      ctx.strokeRect(calorimeterX - calorimeterW / 2, calorimeterY - calorimeterH / 2, calorimeterW, calorimeterH);
      
      // Lớp cách nhiệt (double wall)
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.strokeRect(calorimeterX - calorimeterW / 2 + 5, calorimeterY - calorimeterH / 2 + 5, calorimeterW - 10, calorimeterH - 10);
      
      // Nước trong nhiệt lượng kế
      const waterLevel = calorimeterH * 0.6;
      const waterY = calorimeterY + calorimeterH / 2 - waterLevel;
      
      // Nhiệt độ nước hiện tại
      const currentWaterTemp = waterTemp + (finalTemp - waterTemp) * animationProgress;
      
      // Màu nước theo nhiệt độ
      const waterRatio = (currentWaterTemp - 10) / 40; // 10-50°C
      const waterGradient = ctx.createLinearGradient(0, waterY, 0, calorimeterY + calorimeterH / 2);
      if (waterRatio < 0.4) {
        waterGradient.addColorStop(0, 'rgba(77, 184, 255, 0.7)');
        waterGradient.addColorStop(1, 'rgba(0, 102, 204, 0.7)');
      } else {
        waterGradient.addColorStop(0, 'rgba(255, 221, 68, 0.7)');
        waterGradient.addColorStop(1, 'rgba(255, 153, 0, 0.7)');
      }
      
      ctx.fillStyle = waterGradient;
      ctx.fillRect(calorimeterX - calorimeterW / 2 + 10, waterY, calorimeterW - 20, waterLevel - 5);
      
      // Mẫu kim loại
      if (animationProgress < 0.3) {
        // Mẫu đang rơi vào
        const sampleY = calorimeterY - calorimeterH / 2 - 50 + (waterY - (calorimeterY - calorimeterH / 2 - 50)) * (animationProgress / 0.3);
        const sampleSize = 30;
        
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.arc(calorimeterX, sampleY, sampleSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Nhiệt độ mẫu
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${sampleTemp}°C`, calorimeterX, sampleY);
      } else {
        // Mẫu đã ở trong nước
        const sampleSize = 30;
        const sampleY = waterY + waterLevel / 2;
        
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.arc(calorimeterX, sampleY, sampleSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Nhiệt kế
      const thermometerX = calorimeterX + calorimeterW / 2 - 30;
      const thermometerY = calorimeterY - calorimeterH / 2 + 20;
      const thermometerH = 80;
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(thermometerX - 5, thermometerY, 10, thermometerH);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(thermometerX - 5, thermometerY, 10, thermometerH);
      
      // Bulb nhiệt kế
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(thermometerX, thermometerY + thermometerH + 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
      
      // Thủy ngân trong nhiệt kế (tăng dần)
      const mercuryHeight = thermometerH * (currentWaterTemp - 10) / 40;
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(thermometerX - 3, thermometerY + thermometerH - mercuryHeight, 6, mercuryHeight);
      
      // Hiển thị nhiệt độ hiện tại
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(currentWaterTemp)}°C`, thermometerX, thermometerY - 10);
      
      // Thông tin
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Water: ${waterMass} kg at ${waterTemp}°C`, 30, 50);
      ctx.fillText(`Sample: ${sampleMass} kg at ${sampleTemp}°C`, 30, 80);
      if (animationProgress > 0.8) {
        ctx.fillStyle = '#00aa00';
        ctx.fillText(`Final: ${finalTemp}°C`, 30, 110);
      }
    };

    // Animation loop
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.01;
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

    const tolerance = 0.08; // 8% sai số
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
      <div className="heat-transfer-simulator">
        <div className="game-menu">
          <div className="menu-header">
            <Flame size={60} className="menu-icon" />
            <h1>Heat Transfer Simulator</h1>
            <p className="menu-subtitle">Làm chủ định luật bảo toàn nhiệt lượng</p>
          </div>

          <div className="theory-section">
            <h2><ThermometerSun size={24} /> Lý thuyết cơ bản</h2>
            
            <div className="theory-box">
              <h3>1. Nhiệt lượng và Nhiệt dung riêng</h3>
              <p><strong>Nhiệt lượng:</strong> Q = mcΔT</p>
              <ul>
                <li>Q: Nhiệt lượng (J)</li>
                <li>m: Khối lượng (kg)</li>
                <li>c: Nhiệt dung riêng (J/kg·K)</li>
                <li>ΔT: Độ biến thiên nhiệt độ (K hoặc °C)</li>
              </ul>
            </div>

            <div className="theory-box">
              <h3>2. Phương trình cân bằng nhiệt</h3>
              <p><strong>Định luật:</strong> Q<sub>thu</sub> = Q<sub>tỏa</sub></p>
              <p>Nhiệt lượng vật này thu vào bằng nhiệt lượng vật kia tỏa ra</p>
              <p>m₁c₁(t - t₁) = m₂c₂(t₂ - t)</p>
            </div>

            <div className="theory-box">
              <h3>3. Nhiệt lượng kế</h3>
              <p>Dụng cụ đo nhiệt dung riêng của chất:</p>
              <p>m<sub>nc</sub>c<sub>nc</sub>(t - t₁) = m<sub>vật</sub>c<sub>vật</sub>(t₂ - t)</p>
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
      <div className="heat-transfer-simulator">
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
                <Flame size={20} />
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
      <div className="heat-transfer-simulator">
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

export default HeatTransferSimulator;
