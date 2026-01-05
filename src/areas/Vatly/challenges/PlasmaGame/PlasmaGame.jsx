import React, { useState, useRef, useEffect } from 'react';
import './PlasmaGame.css';
// Import toàn bộ logic game và hàm vẽ từ file plasma.js
import { GameEngine } from './plasma.js';
// Import dữ liệu game từ data/games.js
import { PLASMA_GAME_DATA } from '../../data/games.js';
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';

// ID cho linh kiện
let nextComponentId = 0;

function PlasmaGame() {
  const [showIntro, setShowIntro] = useState(true);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  
  // Đây là trạng thái (state) cốt lõi của game
  // Danh sách tất cả linh kiện trên màn hình
  const [components, setComponents] = useState([]);
  // Danh sách tất cả các dây nối
  const [wires, setWires] = useState([]);

  // Các trạng thái để xử lý thao tác kéo-thả
  const [draggingItem, setDraggingItem] = useState(null); // { id, type, offsetX, offsetY }
  const [isWiring, setIsWiring] = useState(false);
  const [wireStartNode, setWireStartNode] = useState(null); // { componentId, nodeId }

  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [question, setQuestion] = useState(null);

  const canvasRef = useRef(null);
  // Ref để lưu trữ đối tượng GameEngine
  const gameEngineRef = useRef(null);
  // Ref để lưu trữ state mới nhất (tránh closure trong game loop)
  const componentsRef = useRef(components);
  const wiresRef = useRef(wires);

  // Lấy dữ liệu màn chơi hiện tại
  const currentLevelData = PLASMA_GAME_DATA.find(lvl => lvl.id === level) || PLASMA_GAME_DATA[0];

  // Khởi chạy Game Engine (Vòng lặp Game) khi component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Khởi tạo engine và truyền vào các hàm 'setter' của React
    gameEngineRef.current = new GameEngine(ctx, (newScore) => {
      // Cập nhật điểm một cách an toàn
      setScore(prevScore => prevScore + newScore);
    });

    // Bắt đầu vòng lặp game, liên tục vẽ lại
    let isRunning = true;
    const runGameLoop = () => {
      if (!isRunning) return;
      
      // Game loop sẽ lấy trạng thái MỚI NHẤT từ React
      if (gameEngineRef.current) {
        // Dùng componentsRef và wiresRef để lấy state mới nhất
        gameEngineRef.current.run(componentsRef.current, wiresRef.current);
      }
      requestAnimationFrame(runGameLoop);
    };
    
    const frameId = requestAnimationFrame(runGameLoop);
    
    return () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    }; // Dọn dẹp
  }, []); // Chỉ chạy 1 lần khi mount

  // Sync state vào ref để game loop luôn có state mới nhất
  useEffect(() => {
    componentsRef.current = components;
    wiresRef.current = wires;
  }, [components, wires]);

  // Kiểm tra hoàn thành màn chơi
  useEffect(() => {
    if (!gameEngineRef.current) return;
    
    const checkCompletion = () => {
      if (gameEngineRef.current.simulationState.isLit) {
        // Đèn sáng - hiển thị câu hỏi
        if (currentLevelData && currentLevelData.question && !question) {
          setQuestion(currentLevelData.question);
          setResultMessage('💡 Tuyệt vời! Đèn đã sáng! Hãy trả lời câu hỏi:');
        }
      }
    };
    
    // Delay một chút để đảm bảo simulation đã chạy
    const timer = setTimeout(checkCompletion, 100);
    return () => clearTimeout(timer);
  }, [components, wires]); // Bỏ currentLevelData và question khỏi deps

  // --- HÀM XỬ LÝ THAO TÁC (Input Handlers) ---

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    if (!gameEngineRef.current) return;
    
    const pos = getMousePos(e);
    
    // 1. Kiểm tra xem có click trúng 1 node để BẮT ĐẦU nối dây không
    const nodeClicked = gameEngineRef.current.getNodeAt(pos, components);
    if (nodeClicked) {
      setIsWiring(true);
      setWireStartNode(nodeClicked);
      return;
    }

    // 2. KIỂM TRA MỚI: Click trúng công tắc để BẬT/TẮT?
    const itemClicked = gameEngineRef.current.getComponentAt(pos, components);
    if (itemClicked && itemClicked.type === 'switch') {
      toggleSwitch(itemClicked.id);
      return; // Không kéo, chỉ bật/tắt
    }

    // 3. Kiểm tra xem có click trúng 1 linh kiện để KÉO
    if (itemClicked) {
      setDraggingItem({
        id: itemClicked.id,
        type: itemClicked.type,
        offsetX: pos.x - itemClicked.x,
        offsetY: pos.y - itemClicked.y,
      });
      return;
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingItem) return;
    const pos = getMousePos(e);
    
    // Cập nhật vị trí linh kiện đang kéo
    setComponents(prev => 
      prev.map(c => 
        c.id === draggingItem.id 
          ? { ...c, x: pos.x - draggingItem.offsetX, y: pos.y - draggingItem.offsetY } 
          : c
      )
    );
  };

  const handleMouseUp = (e) => {
    if (!gameEngineRef.current) return;
    const pos = getMousePos(e);

    // 1. Nếu đang nối dây, kiểm tra xem có thả trúng node KẾT THÚC không
    if (isWiring && wireStartNode) {
      const endNode = gameEngineRef.current.getNodeAt(pos, components);
      if (endNode && endNode.componentId !== wireStartNode.componentId) {
        // Tạo dây nối mới
        const newWire = {
          id: `w${Date.now()}`,
          from: wireStartNode,
          to: endNode,
        };
        setWires(prev => [...prev, newWire]);
      }
    }
    
    // 2. Thả linh kiện
    setDraggingItem(null);
    setIsWiring(false);
    setWireStartNode(null);
  };

  // --- HÀM XỬ LÝ TOOLBOX ---

  // --- HÀM MỚI: Bật/Tắt Công tắc ---
  const toggleSwitch = (componentId) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === componentId && c.type === 'switch'
          ? { ...c, isClosed: !c.isClosed } // Lật trạng thái
          : c
      )
    );
  };

  const addComponent = (type) => {
    const newComponent = {
      id: nextComponentId++,
      type: type, // 'pin', 'bulb', 'switch'
      x: 150 + (nextComponentId * 20), // Offset để không chồng lên nhau
      y: 150,
      // QUAN TRỌNG: Thêm thuộc tính isClosed cho switch
      ...(type === 'switch' && { isClosed: false }), // Trạng thái ban đầu là MỞ
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const resetCircuit = () => {
    setComponents([]);
    setWires([]);
    setQuestion(null);
    setShowResult(false);
    setResultMessage('');
  };

  // Xử lý trả lời câu hỏi
  const handleAnswer = (option) => {
    if (option.correct) {
      setResultMessage('✅ Chính xác! +50 điểm');
      setScore(prevScore => prevScore + 50);
      setTimeout(() => {
        setQuestion(null);
        setShowResult(true);
        setResultMessage('🎉 Tuyệt vời! Bạn đã hoàn thành màn này!');
        setScore(prevScore => prevScore + 100);
      }, 1500);
    } else {
      setResultMessage('❌ Chưa đúng, hãy thử lại!');
      setTimeout(() => {
        setResultMessage('💡 Hãy suy nghĩ kỹ hơn nhé!');
      }, 1500);
    }
  };

  // Chuyển màn tiếp theo
  const handleNextLevel = () => {
    if (level < PLASMA_GAME_DATA.length) {
      setLevel(level + 1);
      resetCircuit();
    } else {
      setResultMessage('🏆 Chúc mừng! Bạn đã hoàn thành tất cả các màn!');
    }
  };

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop8-2']} onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <h1>Mô phỏng Mạch điện (lop8-2)</h1>
        <div className="score-board">Điểm: {score} | Màn: {level}/{PLASMA_GAME_DATA.length}</div>
      </div>

      {/* Thông tin màn chơi */}
      {currentLevelData ? (
        <div className="objective-box">
          <strong>Mục tiêu:</strong> {currentLevelData.title} - {currentLevelData.description}
        </div>
      ) : (
        <div className="objective-box">
          <strong>Đang tải màn chơi...</strong>
        </div>
      )}

      <div className="main-content">
        <div className="toolbox">
          <h3>Hộp công cụ</h3>
          <button onClick={() => addComponent('pin')}>➕ Thêm Pin (DC)</button>
          <button onClick={() => addComponent('bulb')}>💡 Thêm Bóng Đèn</button>
          <button onClick={() => addComponent('switch')}>🔌 Thêm Công Tắc</button>
          <button onClick={() => setWires([])}>🗑️ Xóa hết dây</button>
          <button onClick={resetCircuit} className="reset-btn">🔄 Chơi lại</button>
          
          <div className="instructions">
            <h4>Hướng dẫn:</h4>
            <p>• Click vào linh kiện để kéo thả</p>
            <p>• Click vào chấm đen (node) để nối dây</p>
            <p>• Làm cho đèn sáng để hoàn thành màn!</p>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="700"
            height="450"
            className="simulation-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Thông báo trạng thái */}
          {gameEngineRef.current?.simulationState.isShort && (
            <div className="warning-overlay">
              ⚠️ NGẮN MẠCH! Mạch không an toàn!
            </div>
          )}
        </div>
      </div>

      {/* Thông báo kết quả */}
      {resultMessage && (
        <div className={`result-message ${showResult ? 'success' : 'info'}`}>
          {resultMessage}
        </div>
      )}

      {/* Khu vực câu hỏi logic */}
      {question && (
        <div className="question-box">
          <strong>Câu hỏi logic:</strong>
          <p>{question.text}</p>
          <div className="options">
            {question.options && question.options.map((option) => (
              <button 
                key={option.id} 
                onClick={() => handleAnswer(option)}
                className="option-button"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="controls">
        {showResult && level < PLASMA_GAME_DATA.length && (
          <button onClick={handleNextLevel} className="next-button">
            Màn tiếp theo →
          </button>
        )}
        {level > 1 && !showResult && (
          <button onClick={() => { setLevel(level - 1); resetCircuit(); }} className="prev-button">
            ← Màn trước
          </button>
        )}
      </div>
    </div>
  );
}

export default PlasmaGame;
