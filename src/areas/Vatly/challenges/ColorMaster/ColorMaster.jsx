// ColorMaster.jsx (PHIÊN BẢN HOÀN CHỈNH - Đã sửa lỗi "zombie component" Màn 4)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
// Sửa đường dẫn import nếu cần
import { COLOR_MASTER_DATA } from '../../data/colorMasterGameData'; 
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';
import './ColorMaster.css';

// --- COMPONENT CON (Nâng cấp) ---

// Component cho Gợi ý (Modal)
const HintModal = ({ hint, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>💡 Gợi ý</h3>
      <p>{hint}</p>
      <button className="game-button next-button" onClick={onClose}>
        Đã hiểu
      </button>
    </div>
  </div>
);

// Component cho Thông báo (Toast)
const FeedbackToast = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // Tự động ẩn sau 2 giây

    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return (
    <div className={`feedback-toast ${!visible ? 'is-fading-out' : ''}`}>
      {message}
    </div>
  );
};


// --- COMPONENT CHÍNH ---
const ColorMaster = () => {
  const gameData = COLOR_MASTER_DATA;

  // --- State Chính ---
  const [showIntro, setShowIntro] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0); // Dùng 'attempts' để reset
  const [taskCompleted, setTaskCompleted] = useState(false);
  
  // --- State Tương tác & Logic ---
  const [itemPositions, setItemPositions] = useState({});
  const [moduleState, setModuleState] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // --- State UI ---
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [workbenchRect, setWorkbenchRect] = useState(null);

  const workbenchRef = useRef(null);
  const currentModule = gameData.modules[currentModuleIndex];

  // --- Lấy kích thước thật của Workbench ---
  useEffect(() => {
    const updateRect = () => {
      if (workbenchRef.current) {
        setWorkbenchRect(workbenchRef.current.getBoundingClientRect());
      }
    };
    
    updateRect();
    window.addEventListener('resize', updateRect);
    
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  // --- Logic Reset khi chuyển Module ---
  useEffect(() => {
    setTaskCompleted(currentModule.isIntro || false);
    setAttempts(0);
    setHoveredZone(null);
    setDraggingItem(null);
    setFeedback(null);

    const initialPositions = {};
    currentModule.tools
      .filter(t => t.type === 'draggable' && t.spawnLocation === 'workbench')
      .forEach((tool, index) => {
        initialPositions[tool.id] = { 
          x: 10 + Math.random() * 100, 
          y: 10 + Math.random() * 100 
        };
      });
    setItemPositions(initialPositions);

    let initialModuleState = {};
    if (currentModule.id === 'm1') initialModuleState = { prismPlaced: false, screenPlaced: false };
    if (currentModule.id === 'm2') initialModuleState = { red: false, green: false, blue: false };
    if (currentModule.id === 'm3') initialModuleState = { activeFilter: null };
    if (currentModule.id === 'm4') {
      initialModuleState = { 
        objectOnStage: null, 
        currentLight: currentModule.lights[0]
      };
    }
    setModuleState(initialModuleState);

  }, [currentModuleIndex, currentModule]);


  // --- Logic tính toán vị trí (dùng kích thước thật) ---
  const isWithinZone = useCallback((itemPos, targetZone) => {
    if (!itemPos || !targetZone || !workbenchRect) return false;
    
    const targetX = (targetZone.x / 100) * workbenchRect.width;
    const targetY = (targetZone.y / 100) * workbenchRect.height;
    const tolerancePx = (targetZone.tolerance / 100) * workbenchRect.width;

    const dx = itemPos.x - targetX;
    const dy = itemPos.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < tolerancePx;
  }, [workbenchRect]);


  // --- BỘ NÃO LOGIC CHÍNH ---
  const checkGameLogic = (newPositions, newState) => {
    const currentPositions = newPositions || itemPositions;
    const currentModuleState = newState || moduleState;

    if (currentModule.isIntro) {
      setTaskCompleted(true);
      return;
    }

    let completed = false;

    switch (currentModule.id) {
      case 'm1': {
        const prismPlaced = isWithinZone(currentPositions.prism, currentModule.targets.prism);
        const screenPlaced = isWithinZone(currentPositions.screen, currentModule.targets.screen);
        setModuleState({ prismPlaced, screenPlaced });
        if (prismPlaced && screenPlaced) completed = true;
        break;
      }
      case 'm2': {
        const red = isWithinZone(currentPositions.redLight, currentModule.targets.redLight);
        const green = isWithinZone(currentPositions.greenLight, currentModule.targets.greenLight);
        const blue = isWithinZone(currentPositions.blueLight, currentModule.targets.blueLight);
        setModuleState({ red, green, blue });
        if (red && green && blue) completed = true;
        break;
      }
      case 'm3': {
        const filterZone = currentModule.targets.filter;
        let activeFilter = null;
        const filters = ['filterRed', 'filterGreen', 'filterBlue'];
        for (const filterId of filters) {
          if (isWithinZone(currentPositions[filterId], filterZone)) {
            activeFilter = filterId;
            break;
          }
        }
        setModuleState({ activeFilter });
        if (activeFilter === currentModule.correctAnswer) completed = true;
        break;
      }
      case 'm4': {
        if (currentModule.checkWinCondition(currentModuleState.objectOnStage, currentModuleState.currentLight)) {
          completed = true;
        }
        break;
      }
      default:
        break;
    }

    if (completed) {
      setTaskCompleted(true);
      setFeedback('Chính xác! Làm tốt lắm!');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  // --- XỬ LÝ KÉO THẢ ---
  const handleDragStart = (itemId) => {
    setDraggingItem(itemId);
  };

  const handleDrag = (e, data, itemId, isFromToolbox) => {
    let itemX, itemY;
    
    if (isFromToolbox) {
      if (!workbenchRect) return;
      itemX = e.clientX - workbenchRect.left;
      itemY = e.clientY - workbenchRect.top;
    } else {
      itemX = data.x;
      itemY = data.y;
      const newPositions = {
        ...itemPositions,
        [itemId]: { x: itemX, y: itemY }
      };
      setItemPositions(newPositions);
    }

    let overZone = null;
    if (currentModule.targets) {
      for (const key in currentModule.targets) {
        const targetZone = currentModule.targets[key];
        if (isWithinZone({ x: itemX, y: itemY }, targetZone)) {
          overZone = targetZone.id;
          break;
        }
      }
    }
    setHoveredZone(overZone);
  };

  const handleDragStop = (e, data, itemId, isFromToolbox) => {
    setDraggingItem(null);
    setHoveredZone(null);
    setAttempts(prev => prev + 1); // Luôn tăng số lần thử

    if (!workbenchRect) return;

    if (!isFromToolbox) {
      const newPositions = {
        ...itemPositions,
        [itemId]: { x: data.x, y: data.y }
      };
      setItemPositions(newPositions);
      checkGameLogic(newPositions, moduleState);
      return;
    }

    if (currentModule.id === 'm4' && isFromToolbox) {
      const stageZone = currentModule.targets.stage;
      const tool = currentModule.tools.find(t => t.id === itemId);
      
      const itemX = e.clientX - workbenchRect.left;
      const itemY = e.clientY - workbenchRect.top;
      
      if (tool && isWithinZone({ x: itemX, y: itemY }, stageZone)) {
        const newState = { ...moduleState, objectOnStage: tool };
        setModuleState(newState);
        checkGameLogic(itemPositions, newState);
      }
      // Nếu thả ra ngoài, không làm gì cả, component sẽ tự reset
      // vì 'attempts' đã thay đổi, 'key' sẽ thay đổi, buộc re-mount
    }
  };
  
  // Xử lý đổi đèn (Module 4)
  const handleLightChange = (light) => {
    const newState = { ...moduleState, currentLight: light };
    setModuleState(newState);
    checkGameLogic(null, newState);
  };

  // ---- Xử lý UI (Nút bấm) ----
  const handleNextModule = () => {
    if (currentModuleIndex > 0) {
      let newPoints = 0;
      if (attempts <= 3) newPoints = 3;
      else if (attempts <= 6) newPoints = 2;
      else newPoints = 1;
      setScore(prev => prev + newPoints);
    }

    if (currentModuleIndex < gameData.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
    } else {
      setFeedback(`Hoàn thành! Tổng điểm: ${score} 💡`);
      setCurrentModuleIndex(0);
      setScore(0);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    setAttempts(prev => prev + 5);
  };


  // ---- RENDER CÁC THÀNH PHẦN ----

  const renderToolbox = () => {
    if (currentModule.isIntro) return <div className="toolbox"></div>;
    
    const toolboxTools = currentModule.tools.filter(
      tool => tool.type === 'draggable' && tool.spawnLocation === 'toolbox'
    );
    
    const toolsToRender = toolboxTools.filter(
      tool => tool.id !== moduleState.objectOnStage?.id
    );

    return (
      <div className="toolbox">
        <h3>{currentModule.id === 'm4' ? 'Vật thể' : 'Công cụ'}</h3>
        
        {toolsToRender.map(tool => (
          <Draggable
            /* === SỬA LỖI NGHIÊM TÚC LÀ Ở ĐÂY === */
            // Dùng 'attempts' làm key. Vì 'attempts' thay đổi *mỗi khi thả chuột* (handleDragStop),
            // React sẽ *buộc* phải hủy và tạo mới TOÀN BỘ các vật thể trong toolbox.
            // Điều này đảm bảo chúng luôn reset về defaultPosition(0,0).
            key={`${tool.id}-${attempts}`} 
            /* === HẾT SỬA LỖI === */
            
            onStart={() => handleDragStart(tool.id)}
            onStop={(e, data) => handleDragStop(e, data, tool.id, true)}
            onDrag={(e, data) => handleDrag(e, data, tool.id, true)}
            defaultPosition={{x: 0, y: 0}}
            bounds=".game-main"
          >
            <div 
              className={`tool-item ${draggingItem === tool.id ? 'is-dragging-source' : ''}`} 
              data-color={tool.color}
            >
              <span className="tool-item-icon">{tool.icon}</span>
              {tool.label}
            </div>
          </Draggable>
        ))}
        
        {currentModule.id === 'm4' && (
          <div className="m4-light-controls">
            <h3>Nguồn sáng</h3>
            {currentModule.lights.map(light => (
              <button
                key={light.id}
                className={`light-button ${moduleState.currentLight?.id === light.id ? 'active' : ''}`}
                data-color={light.dataColor}
                onClick={() => handleLightChange(light)}
              >
                {light.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render các hiệu ứng trên bàn thí nghiệm
  const renderWorkbenchEffects = () => {
    if (currentModule.isIntro) {
      return <h2 style={{textAlign: 'center', marginTop: '20%', opacity: 0.5}}>Hãy đọc hướng dẫn ở bên phải!</h2>;
    }

    if (currentModule.id === 'm1') {
      const { prismPlaced, screenPlaced } = moduleState;
      const showRainbow = prismPlaced && screenPlaced;
      const prismPos = currentModule.targets.prism;
      const screenPos = currentModule.targets.screen;
      
      return (
        <>
          <div className="static-item" style={{ left: '10%', top: '48%' }}>Đèn pin</div>
          <div className="light-beam" style={{ 
            left: '15%', 
            top: '50%', 
            width: prismPlaced ? `${prismPos.x - 15}%` : '80%',
            opacity: showRainbow ? 0.1 : 1 
          }}></div>
          {showRainbow && (
            <div className="rainbow-beam" style={{
              left: `${prismPos.x + 3}%`, 
              top: `${prismPos.y - 1}%`,
              width: `${screenPos.x - prismPos.x}%`,
            }}></div>
          )}
        </>
      );
    }
    
    if (currentModule.id === 'm2') {
      const { red, green, blue } = moduleState;
      const t = currentModule.targets;
      return (
        <div className="color-mixing-zone">
          <div 
            className={`color-light-circle light-red m2-light-pos-red ${red ? 'is-active' : ''}`}
            style={{ left: `${t.redLight.x}%`, top: `${t.redLight.y}%` }}
          ></div>
          <div 
            className={`color-light-circle light-green m2-light-pos-green ${green ? 'is-active' : ''}`}
            style={{ left: `${t.greenLight.x}%`, top: `${t.greenLight.y}%` }}
          ></div>
          <div 
            className={`color-light-circle light-blue m2-light-pos-blue ${blue ? 'is-active' : ''}`}
            style={{ left: `${t.blueLight.x}%`, top: `${t.blueLight.y}%` }}
          ></div>
        </div>
      );
    }
    
    if (currentModule.id === 'm3') {
      const { activeFilter } = moduleState;
      const filterColor = currentModule.tools.find(t => t.id === activeFilter)?.color;
      
      let screenDisplayColor = '#FFFFFF';
      if (activeFilter) {
        screenDisplayColor = filterColor;
      }
      
      return (
        <>
          <div className="static-item" style={{ left: '10%', top: '48%' }}>Đèn pin</div>
          <div className="light-beam" style={{ left: '15%', top: '50%', width: '80%' }}></div>
          
          <div className="m3-screen" style={{ 
            left: '70%', 
            top: '45%', 
            backgroundColor: screenDisplayColor,
            color: screenDisplayColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
            textShadow: '0 0 5px #000'
          }}>
            {activeFilter ? `Màu ${activeFilter.replace('filter', '')}` : 'Trắng'}
          </div>
        </>
      );
    }
    
    if (currentModule.id === 'm4') {
      const { objectOnStage, currentLight } = moduleState;
      const activeLight = currentLight || currentModule.lights[0];
      
      let perceivedColor = '#333';
      let perceivedLabel = 'Trống';

      if(objectOnStage) {
        perceivedColor = currentModule.getPerceivedColor(objectOnStage.color, activeLight.color);
        perceivedLabel = `Thấy màu: ${perceivedColor === '#000000' ? 'Đen' : perceivedColor}`;
      }
      
      return (
        <>
          {objectOnStage && (
            <div 
              className="draggable-item" 
              style={{ 
                position: 'absolute',
                left: `${currentModule.targets.stage.x}%`,
                top: `${currentModule.targets.stage.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 150, height: 150,
                backgroundColor: perceivedColor, 
                color: perceivedColor === '#000000' ? '#FFFFFF' : '#000000'
              }}
            >
              <span className="tool-item-icon">{objectOnStage.icon}</span>
              {objectOnStage.label}
              <br/>
              ({perceivedLabel})
            </div>
          )}
          <div style={{
            position: 'absolute',
            left: `${currentModule.targets.stage.x}%`,
            top: `${currentModule.targets.stage.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 250, height: 250,
            borderRadius: '50%',
            backgroundColor: activeLight.color,
            mixBlendMode: 'screen',
            filter: 'blur(20px)',
            opacity: 0.7,
            boxShadow: `0 0 80px 30px ${activeLight.color}`,
            transition: 'all var(--transition-medium)',
            zIndex: 1,
          }}></div>
        </>
      );
    }
    return null;
  };
  
  // Render các Vùng thả (Target Zones)
  const renderTargetZones = () => {
    if (!currentModule.targets) return null;
    const { prismPlaced, screenPlaced } = (currentModule.id === 'm1') ? moduleState : {};
    const { red, green, blue } = (currentModule.id === 'm2') ? moduleState : {};
    const { activeFilter } = (currentModule.id === 'm3') ? moduleState : {};
    const { objectOnStage } = (currentModule.id === 'm4') ? moduleState : {};

    return Object.keys(currentModule.targets).map(key => {
      const zone = currentModule.targets[key];
      let isFilled = false;
      let size = { width: '120px', height: '120px' };
      
      if (key === 'prism') isFilled = prismPlaced;
      if (key === 'screen') isFilled = screenPlaced;
      if (key === 'redLight') { isFilled = red; size = { width: '80px', height: '80px', borderRadius: '50%' }; }
      if (key === 'greenLight') { isFilled = green; size = { width: '80px', height: '80px', borderRadius: '50%' }; }
      if (key === 'blueLight') { isFilled = blue; size = { width: '80px', height: '80px', borderRadius: '50%' }; }
      if (key === 'filter') { isFilled = !!activeFilter; size = { width: '60px', height: '130px' }; }
      if (key === 'stage') { isFilled = !!objectOnStage; size = { width: '250px', height: '250px' }; }

      return (
        <div
          key={zone.id}
          className={`target-zone 
            ${hoveredZone === zone.id ? 'is-over' : ''}
            ${isFilled ? 'is-filled' : ''}
          `}
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            transform: 'translate(-50%, -50%)',
            ...size
          }}
        >
          {zone.label && !isFilled && zone.label}
        </div>
      );
    });
  };

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop7-1']} onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="color-master-game">
      {showHint && <HintModal hint={currentModule.hint} onClose={() => setShowHint(false)} />}
      {feedback && <FeedbackToast message={feedback} />}

      <header className="game-header">
        <h1>{gameData.title}</h1>
        <div className="score-display">
          Tổng điểm: <span>{score} 💡</span>
        </div>
      </header>

      <main className="game-main">
        {renderToolbox()}
        
        <div className="workbench" ref={workbenchRef}>
          {workbenchRect && renderWorkbenchEffects()}
          {workbenchRect && renderTargetZones()}

          {currentModule.tools
            .filter(tool => tool.type === 'draggable' && tool.spawnLocation === 'workbench')
            .map(tool => {
              if (!itemPositions[tool.id]) return null;
              
              const isDragging = draggingItem === tool.id;
              
              let itemClass = 'draggable-item';
              if (tool.id.includes('prism')) itemClass += ' prism';
              if (tool.id.includes('screen')) itemClass += ' screen';
              if (tool.id.includes('filter')) itemClass += ' filter-item';
              if (isDragging) itemClass += ' is-dragging';

              return (
                <Draggable
                  key={tool.id}
                  onStart={() => handleDragStart(tool.id)}
                  onStop={(e, data) => handleDragStop(e, data, tool.id, false)}
                  onDrag={(e, data) => handleDrag(e, data, tool.id, false)}
                  bounds="parent"
                  position={itemPositions[tool.id]}
                >
                  <div 
                    className={itemClass}
                    data-color={tool.color}
                  >
                    <span className="tool-item-icon">{tool.icon}</span>
                    {!tool.id.includes('prism') && tool.label}
                  </div>
                </Draggable>
              );
            })}
        </div>

        <aside className="task-board">
          <div className="task-content">
            <h3>{currentModule.title}</h3>
            <p>{currentModule.task}</p>
          </div>
          
          <div className="task-buttons">
            <button className="game-button hint-button" onClick={handleShowHint} disabled={currentModule.isIntro}>
              Gợi ý (Phạt 5 lần thử)
            </button>
            <button 
              className={`game-button next-button ${currentModule.isIntro ? 'start-button' : ''}`}
              onClick={handleNextModule}
              disabled={!taskCompleted}
            >
              {currentModule.isIntro ? 'Bắt đầu!' : (taskCompleted ? 'Tiếp tục' : 'Chưa hoàn thành')}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ColorMaster;