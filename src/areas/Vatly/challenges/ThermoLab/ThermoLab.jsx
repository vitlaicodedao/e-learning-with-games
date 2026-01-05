// src/components/Games/ThermoLab/ThermoLab.jsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import { THERMO_LAB_DATA } from "../../data/games";
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';
import "./ThermoLab.css";

// Lấy dữ liệu từ file games.js
const { modules: gameModules, tools } = THERMO_LAB_DATA;

// ---------------------------------
// COMPONENT CON: HIỂN THỊ THÍ NGHIỆM
// (Đã cập nhật để nhận 'placedToolId' và 'onHotspotClick')
// ---------------------------------

function Module1_Bridge({ currentData, placedToolId, onHotspotClick }) {
  const { value, isFailed } = currentData;
  const bridgeWidth = value;
  const isBent = isFailed;
  const hasRoller = placedToolId === "roller";

  return (
    <div className="bridge-container">
      <div
        className={`bridge ${isBent ? "bent" : ""}`}
        style={{ width: `${bridgeWidth}%` }}
      ></div>
      <div className="bridge-support">
        <div className="support-pillar"></div> {/* Trụ cố định */}
        <div className={`support-pillar ${hasRoller ? "has-roller" : ""}`}>
          {/* Vùng tương tác (hotspot) cho con lăn */}
          <div
            className={`support-hotspot ${hasRoller ? "hidden" : ""}`}
            onClick={() => onHotspotClick("roller")}
            title="Đặt Gối đỡ con lăn vào đây"
          ></div>
        </div>
      </div>
    </div>
  );
}

function Module2_FishTank({ currentData, placedToolId, onHotspotClick }) {
  const { value, isFailed, currentTemp } = currentData;
  const waterHeight = value;
  const isHot = currentTemp > 30;
  const hasPipe = placedToolId === "overflowPipe";

  return (
    <div className={`fishtank-container ${isFailed ? "broken" : ""}`}>
      {/* Vùng tương tác (hotspot) cho ống tràn */}
      <div
        className={`pipe-hotspot ${hasPipe ? "hidden" : ""}`}
        onClick={() => onHotspotClick("overflowPipe")}
        title="Đặt Ống tràn vào đây"
      ></div>

      <div
        className={`water-level ${isHot ? "hot" : ""}`}
        style={{ height: `${waterHeight}%` }}
      ></div>
      <div className="fish">🐟</div>
      {/* Ống tràn chỉ hiển thị khi đã đặt */}
      {hasPipe && <div className="overflow-pipe"></div>}
    </div>
  );
}

function Module3_Balloon({ currentData, isHeating, heatIntensity }) {
  const { value, isFailed, isSolved } = currentData;
  const balloonScale = value / 100;

  let balloonClass = "balloon";
  if (isSolved) balloonClass = "balloon inflated";
  if (isFailed) balloonClass = "balloon exploded";

  // CSS custom property để điều khiển kích thước ngọn lửa
  const flaskStyle = {
    "--heat-intensity": heatIntensity / 50, // Chuyển 0-100 thành 0-2
  };

  return (
    <div className="balloon-container">
      <div className={balloonClass} style={{ transform: `scale(${balloonScale})` }}></div>
      <div className={`flask ${isHeating ? "heating" : ""}`} style={flaskStyle}></div>
    </div>
  );
}

// ---------------------------------
// COMPONENT CHÍNH: PHÒNG THÍ NGHIỆM
// ---------------------------------

function ThermoLab() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [gameState, setGameState] = useState("pending");
  const [eurekaPoints, setEurekaPoints] = useState(0);

  // --- State mới cho logic thí nghiệm ---
  const [temperature, setTemperature] = useState(gameModules[0].initialTemp);
  const [heatIntensity, setHeatIntensity] = useState(50); // Cường độ (0-100)
  const [isRunning, setIsRunning] = useState(false); // Thí nghiệm đang chạy?
  const [selectedToolId, setSelectedToolId] = useState(null); // Tool đang chọn
  const [placedToolId, setPlacedToolId] = useState(null); // Tool đã đặt
  
  // --- NÂNG CẤP: Trạng thái thí nghiệm ---
  const [experimentPhase, setExperimentPhase] = useState("setup"); // setup → running → analysis → complete
  const [observations, setObservations] = useState([]); // Ghi chép quan sát
  const [showHints, setShowHints] = useState(true); // Hiển thị gợi ý

  // Dùng 'ref' để truy cập state mới nhất trong 'setInterval'
  const simulationIntervalRef = useRef(null);

  // Lấy thông tin config của module hiện tại
  const currentModule = useMemo(
    () => gameModules.find((m) => m.id === currentModuleId),
    [currentModuleId]
  );

  // Hàm tính toán logic vật lý cốt lõi (GIỮ NGUYÊN)
  const simulationData = useMemo(() => {
    const {
      initialTemp,
      initialValue,
      expansionFactor,
      failTemp,
      targetTemp,
      requiredTool,
    } = currentModule;

    const deltaTemp = temperature - initialTemp;
    let currentValue = initialValue + deltaTemp * expansionFactor;

    // Giới hạn giá trị
    if (currentModule.id === 2 && currentValue > 100 && placedToolId !== "overflowPipe") {
      currentValue = 100.5; // Cho phép tràn 1 chút để thấy lỗi
    }
    if (currentModule.id === 1 && currentValue < 100) currentValue = 100;
    if (currentModule.id === 3 && currentValue < initialValue) currentValue = initialValue;

    // Kiểm tra trạng thái
    let newGameState = "pending";
    const hasCorrectTool = placedToolId === requiredTool;

    if (temperature >= failTemp && (currentModule.id !== 3 && !hasCorrectTool)) {
      newGameState = "failed";
    } else if (currentModule.id === 3 && temperature >= failTemp) {
      newGameState = "failed";
    } else if (
      temperature >= targetTemp &&
      (hasCorrectTool || currentModule.id === 3)
    ) {
      newGameState = "solved";
    }
    
    // Nếu game kết thúc (thắng/thua), dừng thí nghiệm
    if (newGameState !== "pending" && isRunning) {
        setIsRunning(false);
    }

    return {
      value: currentValue,
      unit: currentModule.unit,
      isFailed: newGameState === "failed",
      isSolved: newGameState === "solved",
      currentTemp: temperature,
      initialTemp: initialTemp,
    };
  }, [temperature, placedToolId, currentModule, isRunning]);
  
  // Cập nhật gameState chung
  useEffect(() => {
    const newStatus = simulationData.isFailed
      ? "failed"
      : simulationData.isSolved
      ? "solved"
      : "pending";
      
    if (newStatus !== gameState) {
        setGameState(newStatus);
        if (newStatus === 'solved' && gameState === 'pending') {
            setEurekaPoints(prev => prev + 100);
        }
    }
  }, [simulationData, gameState]);


  // --- NÂNG CẤP: Logic Vòng lặp Thí nghiệm (Simulation Loop) ---
  useEffect(() => {
    // Xóa interval cũ khi component unmount hoặc isRunning thay đổi
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      // Bắt đầu vòng lặp
      simulationIntervalRef.current = setInterval(() => {
        setTemperature((prevTemp) => {
          // Tốc độ tăng nhiệt dựa trên Cường độ
          // (Cường độ 0-100 -> Tăng 0 - 1 độ mỗi 200ms)
          const tempIncrease = (heatIntensity / 100) * 1; 
          const newTemp = prevTemp + tempIncrease;
          
          // Dừng ở 100 độ
          if (newTemp >= 100) {
            setIsRunning(false); // Tự động dừng
            return 100;
          }
          return newTemp;
        });
      }, 200); // Tần suất cập nhật (ms)
    } else {
      // Dừng vòng lặp
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }
  }, [isRunning, heatIntensity]);


  // --- HÀM XỬ LÝ SỰ KIỆN (Đã nâng cấp) ---

  const handleModuleChange = (id) => {
    setCurrentModuleId(id);
    const newModule = gameModules.find((m) => m.id === id);
    handleReset(newModule); // Reset khi đổi module
  };

  // Nút Bắt đầu / Dừng Thí nghiệm
  const handleStartStop = () => {
    if (gameState !== 'pending') {
        handleReset(); // Nếu đã thắng/thua, nhấn nút này = Reset
    } else {
        // NÂNG CẤP: Kiểm tra điều kiện trước khi bắt đầu
        if (experimentPhase === 'setup') {
          // Module 1 & 2 yêu cầu đặt dụng cụ trước
          if ((currentModuleId === 1 || currentModuleId === 2) && !placedToolId) {
            setObservations(prev => [...prev, '⚠️ Hãy đặt dụng cụ hỗ trợ trước khi bắt đầu!']);
            return;
          }
          setExperimentPhase('running');
          setObservations(prev => [...prev, '🔬 Bắt đầu thí nghiệm...']);
        }
        setIsRunning(!isRunning); // Bắt đầu hoặc Tạm dừng
    }
  };

  // Nút Reset
  const handleReset = (module = currentModule) => {
    setIsRunning(false);
    setGameState("pending");
    setTemperature(module.initialTemp);
    setPlacedToolId(null);
    setSelectedToolId(null);
    setHeatIntensity(50);
    setExperimentPhase('setup');
    setObservations([]);
  };

  // Chọn 1 tool từ kho
  const handleToolSelect = (toolId) => {
    if (gameState !== 'pending' || placedToolId) return; // Không cho chọn nếu đã đặt
    setSelectedToolId(selectedToolId === toolId ? null : toolId); // Nhấn lần nữa để bỏ chọn
  };

  // Nhấp vào vùng tương tác (hotspot)
  const handleHotspotClick = (requiredToolId) => {
    if (selectedToolId && selectedToolId === requiredToolId) {
      // Đặt tool thành công
      setPlacedToolId(selectedToolId);
      setSelectedToolId(null);
      setObservations(prev => [...prev, `✅ Đã lắp đặt ${tools.find(t => t.id === requiredToolId).name}`]);
    } else if (selectedToolId && selectedToolId !== requiredToolId) {
      // Đặt sai tool
      setObservations(prev => [...prev, '❌ Dụng cụ không phù hợp với vị trí này!']);
    } else {
      // Chưa chọn tool nào
      setObservations(prev => [...prev, '💡 Hãy chọn dụng cụ từ kho đồ bên dưới']);
    }
  };

  // --- RENDER ---

  const renderExperiment = () => {
    switch (currentModuleId) {
      case 1:
        return (
          <Module1_Bridge
            currentData={simulationData}
            placedToolId={placedToolId}
            onHotspotClick={handleHotspotClick}
          />
        );
      case 2:
        return (
          <Module2_FishTank
            currentData={simulationData}
            placedToolId={placedToolId}
            onHotspotClick={handleHotspotClick}
          />
        );
      case 3:
        return (
          <Module3_Balloon
            currentData={simulationData}
            isHeating={isRunning}
            heatIntensity={heatIntensity}
          />
        );
      default:
        return null;
    }
  };

  // Lọc các tool có thể dùng (lọc bỏ đèn cồn, vì nó là nút Start)
  const availableTools = tools.filter(
    (t) => t.id === "roller" || t.id === "overflowPipe"
  );
  
  // Logic cho nút Start/Stop/Reset
  let startButtonText = "Bắt đầu Thí nghiệm 🔥";
  if (isRunning) startButtonText = "Tạm dừng ⏸️";
  if (gameState !== 'pending') startButtonText = "Làm lại Thí nghiệm 🔄";
  

  return (
    <div className="thermo-lab-container">
      {/* 1. Thanh điều hướng */}
      <nav className="module-nav">
        {gameModules.map((module) => (
          <button
            key={module.id}
            className={`module-nav-btn ${
              currentModuleId === module.id ? "active" : ""
            }`}
            onClick={() => handleModuleChange(module.id)}
          >
            {`Mô-đun ${module.id}`}
          </button>
        ))}
      </nav>

      {/* Hiển thị intro nếu chưa bắt đầu */}
      {showIntro && (
        <GameIntro gameInfo={GAME_INTRO_DATA['lop6-3']} onStart={() => setShowIntro(false)} />
      )}

      <div className="lab-wrapper">
        {/* 2.1. Bảng điều khiển (Trái) */}
        <aside className="control-panel">
          <h2>{currentModule.title}</h2>
          <p>{currentModule.description}</p>

          <div className="control-section">
            <label htmlFor="temperature-slider">
              Điều chỉnh Cường độ Nhiệt
            </label>
            <input
              type="range"
              id="temperature-slider"
              min="0"
              max="100"
              value={heatIntensity}
              onChange={(e) => setHeatIntensity(parseInt(e.target.value, 10))}
              disabled={isRunning} // Không cho chỉnh khi đang chạy
            />
          </div>

          <button className="btn btn-start" onClick={handleStartStop} >
            {startButtonText}
          </button>
          
          {(isRunning || gameState !== 'pending') && (
            <button className="btn btn-reset" onClick={() => handleReset()} style={{marginTop: "10px"}}>
              Reset
            </button>
          )}

        </aside>

        {/* 2.2. Khu vực thí nghiệm (Giữa) */}
        <main className="lab-area">
          <div className="experiment-zone">{renderExperiment()}</div>
        </main>

        {/* 2.3. Bảng thông số (Phải) */}
        <aside className="stats-panel">
          <h3>Thông số</h3>
          <div className="stat-item">
            <span className="label">Điểm Eureka</span>
            <div className="value">{eurekaPoints} ✨</div>
          </div>
          <div className="stat-item">
            <span className="label">Nhiệt độ hiện tại</span>
            <div
              className={`value ${
                temperature > 40 ? "hot" : temperature < 15 ? "cold" : ""
              }`}
            >
              {temperature.toFixed(1)}°C
            </div>
          </div>
          <div className="stat-item">
            <span className="label">
              {currentModule.id === 1
                ? "Chiều dài cầu"
                : currentModule.id === 2
                ? "Mực nước"
                : "Kích thước bóng"}
            </span>
            <div className="value">
              {simulationData.value.toFixed(1)}
              {simulationData.unit}
            </div>
          </div>

          <div className={`game-status ${gameState}`}>
            {gameState === "pending" && (isRunning ? "Đang chạy..." : "Sẵn sàng")}
            {gameState === "solved" && "Thành công! Bạn đã hiểu bài."}
            {gameState === "failed" && "Hỏng rồi! Thử lại nhé."}
          </div>
          
          {/* NÂNG CẤP: Nhật ký quan sát */}
          <div className="observation-log">
            <h4>📋 Nhật ký Quan sát</h4>
            <div className="log-entries">
              {observations.slice(-3).map((obs, idx) => (
                <div key={idx} className="log-entry">{obs}</div>
              ))}
            </div>
          </div>
          
          {/* NÂNG CẤP: Gợi ý thí nghiệm */}
          {showHints && experimentPhase === 'setup' && (
            <div className="hint-box">
              <div className="hint-header" onClick={() => setShowHints(false)}>
                💡 Gợi ý <span style={{fontSize: '12px', cursor: 'pointer'}}>✕</span>
              </div>
              <p className="hint-text">{currentModule.hint || currentModule.description}</p>
            </div>
          )}
        </aside>
      </div>

      {/* 3. Kho công cụ */}
      {/* Kho đồ chỉ hiển thị ở Module 1 và 2 */}
      {(currentModuleId === 1 || currentModuleId === 2) && (
        <footer className="tool-inventory">
          {availableTools.map((tool) => (
            <div
              key={tool.id}
              className={`
                tool-item 
                ${selectedToolId === tool.id ? "selected" : ""}
                ${placedToolId ? "placed" : ""}
              `}
              onClick={() => handleToolSelect(tool.id)}
              title={tool.description}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
            </div>
          ))}
        </footer>
      )}
    </div>
  );
}

export default ThermoLab;