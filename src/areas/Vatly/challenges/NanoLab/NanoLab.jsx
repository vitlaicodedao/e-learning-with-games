// NanoLab.jsx (Đã cập nhật Khu Vực 2 & 3)
import React, { useState, useMemo } from 'react';

// 1. IMPORT CSS
import './NanoLab.css'; 

// 2. IMPORT DATA
import { NANO_LAB_DATA } from '../../data/games.js'; // Đảm bảo đường dẫn này ĐÚNG
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';

// 3. SỬ DỤNG DATA
const levels = NANO_LAB_DATA; 

// Định nghĩa các công cụ
const TOOLS = {
  MOVE: 'DI CHUYỂN',
  SCAN: 'QUÉT (ĐO)',
  FORCE: 'LỰC (KHÓA)',
  THERMAL: 'NHIỆT (KHÓA)'
};

const NanoLab = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [score, setScore] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState(TOOLS.MOVE);
  const [message, setMessage] = useState('Chào mừng tới Nano Lab! Hãy giải câu đố.');

  // --- State cho 3 Khu Vực ---
  // KV 1 (Đo Lường)
  const [itemsOnScale, setItemsOnScale] = useState([]);
  const [itemsOnShelf, setItemsOnShelf] = useState(levels[0].items); 

  // KV 2 (Lực) - MỚI
  const [boxLaunched, setBoxLaunched] = useState(false);
  const [targetHit, setTargetHit] = useState(false);

  // KV 3 (Nhiệt) - MỚI
  const [barState, setBarState] = useState('normal'); // 'normal' hoặc 'shrunk'
  const [keyCollected, setKeyCollected] = useState(false);
  
  // Lấy level hiện tại từ 'levels'
  const currentLevel = levels[currentLevelIndex]; 

  // Tính toán tổng khối lượng trên bệ (KV 1)
  const totalWeightOnScale = useMemo(() => {
    return itemsOnScale.reduce((total, item) => total + item.weight, 0);
  }, [itemsOnScale]);

  // --- Logic Kiểm Tra Thắng Màn (THAY ĐỔI) ---
  const isLevelComplete = useMemo(() => {
    // Kiểm tra xem currentLevel có tồn tại không
    if (!currentLevel) return false;

    switch (currentLevel.id) {
      case 0: // KV 1
        return Math.abs(totalWeightOnScale - currentLevel.targetWeight) < 0.01;
      case 1: // KV 2
        return targetHit;
      case 2: // KV 3
        return keyCollected;
      default:
        return false;
    }
  }, [currentLevel, totalWeightOnScale, targetHit, keyCollected]);


  // --- Xử lý Logic Game ---

  const handleToolSelect = (tool) => {
    // Không cần kiểm tra khóa nữa vì nút đã bị vô hiệu hóa (disabled)
    setSelectedTool(tool);
    setMessage(`Đã chọn găng tay: ${tool}`);
  };

  // Logic cho KV 1
  const handleItemClick = (item, source) => {
    if (currentLevel.id !== 0) return;

    if (selectedTool === TOOLS.SCAN) {
      setMessage(`[QUÉT]: ${item.name} có khối lượng ${item.weight.toFixed(1)} kg.`);
    } 
    else if (selectedTool === TOOLS.MOVE) {
      if (source === 'shelf') {
        setItemsOnShelf(prev => prev.filter(i => i.id !== item.id));
        setItemsOnScale(prev => [...prev, item]);
        setMessage(`Đã đặt ${item.name} lên bệ cảm biến.`);
      } else if (source === 'scale') {
        setItemsOnScale(prev => prev.filter(i => i.id !== item.id));
        setItemsOnShelf(prev => [...prev, item]);
        setMessage(`Đã cất ${item.name} về kệ.`);
      }
    }
  };

  // --- Logic cho KV 2 (MỚI) ---
  const handleForceBoxClick = () => {
    if (currentLevel.id !== 1 || boxLaunched) return;

    if (selectedTool === TOOLS.FORCE) {
      setMessage('Đã dùng Lực Đàn Hồi! Đang phóng...');
      setBoxLaunched(true);

      // Giả lập thời gian phóng 1 giây
      setTimeout(() => {
        setMessage('Trúng đích! Bạn đã áp dụng lực thành công.');
        setTargetHit(true);
      }, 1000);

    } else {
      setMessage('Sai công cụ! Cần dùng găng tay LỰC để tạo lò xo đẩy.');
    }
  };

  // --- Logic cho KV 3 (MỚI) ---
  const handleThermalBarClick = () => {
    if (currentLevel.id !== 2 || barState === 'shrunk') return;

    if (selectedTool === TOOLS.THERMAL) {
      setMessage('Đã dùng LÀM LẠNH! Thanh kim loại đang co lại...');
      setBarState('shrunk');
    } else {
      setMessage('Sai công cụ! Dùng găng tay NHIỆT (chế độ Lạnh) mới làm co được kim loại.');
    }
  };

  const handleKeyClick = () => {
    if (currentLevel.id !== 2 || keyCollected) return;

    if (barState === 'shrunk') {
      setMessage('Đã lấy được chìa khóa!');
      setKeyCollected(true);
    } else {
      setMessage('Không thể lấy! Thanh kim loại vẫn đang chặn.');
    }
  };

  // --- Logic Chuyển Màn (THAY ĐỔI) ---
  const goToNextLevel = () => {
    if (!isLevelComplete) return;

    setScore(prev => prev + 100);
    
    if (currentLevelIndex < levels.length - 1) {
      const nextLevelIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextLevelIndex);
      setMessage(`Qua màn! Chào mừng tới ${levels[nextLevelIndex].title}`);
      
      // Reset TẤT CẢ state của các màn
      setItemsOnScale([]);
      setItemsOnShelf(levels[0].items); 
      setBoxLaunched(false);
      setTargetHit(false);
      setBarState('normal');
      setKeyCollected(false);
      setSelectedTool(TOOLS.MOVE); // Reset găng tay về Di Chuyển

    } else {
      setMessage('Chúc mừng! Bạn đã hoàn thành tất cả màn chơi!');
    }
  };

  // --- Hàm Render ---

  // Render KV 1 (Không đổi)
  const renderLevel1 = () => {
    return (
      <div className="level-content">
        <p><b>Mục tiêu:</b> {currentLevel.objective}</p>
        <div className="lab-area">
          <div className="item-shelf-wrapper">
            <h4>Kệ Vật Phẩm</h4>
            <div className="item-shelf-content">
              {itemsOnShelf.map(item => (
                <div 
                  key={item.id} 
                  className="item-box"
                  onClick={() => handleItemClick(item, 'shelf')}
                  title={`Nhấn để ${selectedTool === TOOLS.SCAN ? 'Quét' : 'Di chuyển'}`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="sensor-pad-wrapper">
            <h4>Bệ Cảm Biến</h4>
            <div className={`sensor-pad ${isLevelComplete ? 'active' : ''}`}>
              <div className="sensor-display">
                {totalWeightOnScale.toFixed(1)} kg
              </div>
              <div className="sensor-items">
                {itemsOnScale.map(item => (
                  <div 
                    key={item.id} 
                    className="item-box"
                    onClick={() => handleItemClick(item, 'scale')}
                    title={`Nhấn để ${selectedTool === TOOLS.SCAN ? 'Quét' : 'Di chuyển'}`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`door ${isLevelComplete ? 'open' : ''}`}>
            {isLevelComplete ? 'ĐÃ MỞ' : 'CỬA KHÓA'}
          </div>
        </div>
        {isLevelComplete && (
          <button className="next-level-btn" onClick={goToNextLevel}>
            Qua Màn
          </button>
        )}
      </div>
    );
  };

  // Render KV 2 (MỚI)
  const renderLevel2 = () => {
    return (
      <div className="level-content">
        <p><b>Mục tiêu:</b> {currentLevel.objective}</p>
        <div className="lab-area-force">
          
          <div className={`force-target ${targetHit ? 'hit' : ''}`}>
            {targetHit ? 'ĐÃ TRÚNG' : 'MỤC TIÊU'}
          </div>
          
          <div 
            className={`force-box ${boxLaunched ? 'launched' : ''}`}
            onClick={handleForceBoxClick}
            title="Nhấn để dùng Lực Đàn Hồi"
          >
            HỘP
          </div>

        </div>
        {isLevelComplete && (
          <button className="next-level-btn" onClick={goToNextLevel}>
            Qua Màn
          </button>
        )}
      </div>
    );
  };

  // Render KV 3 (MỚI)
  const renderLevel3 = () => {
    return (
      <div className="level-content">
        <p><b>Mục tiêu:</b> {currentLevel.objective}</p>
        <div className="lab-area-thermal">
          
          <div 
            className={`thermal-bar ${barState}`}
            onClick={handleThermalBarClick}
            title="Nhấn để dùng găng tay Nhiệt"
          >
            Thanh Kim Loại
          </div>

          <div 
            className={`thermal-key ${keyCollected ? 'collected' : ''} ${barState === 'shrunk' ? 'clickable' : ''}`}
            onClick={handleKeyClick}
            title={barState === 'shrunk' ? "Nhấn để lấy chìa khóa" : "Bị chặn!"}
          >
            🔑
          </div>

        </div>
        {isLevelComplete && (
          <button className="next-level-btn" onClick={goToNextLevel}>
            Qua Màn
          </button>
        )}
      </div>
    );
  };

  // --- Render Chính (THAY ĐỔI) ---
  const renderLevelContent = () => {
    if (!currentLevel) {
        return <div>Đang tải màn chơi...</div>;
    }
      
    switch (currentLevel.id) {
      case 0:
        return renderLevel1();
      case 1:
        return renderLevel2(); // MỚI
      case 2:
        return renderLevel3(); // MỚI
      default:
        return <div>Lỗi: Không tìm thấy màn chơi.</div>;
    }
  };

  // Kiểm tra an toàn
  if (!levels || levels.length === 0 || !currentLevel) {
      return <div>Lỗi: Không thể tải dữ liệu game.</div>;
  }

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop6-2']} onStart={() => setShowIntro(false)} />;
  }

  // --- JSX Trả Về (THAY ĐỔI) ---
  return (
    <div className="nano-lab-container">
      <header className="game-header">
        <h1>Phòng Thí Nghiệm Nano</h1>
        <div className="score-display">Điểm: {score}</div>
      </header>
      <div className="game-body">
        <aside className="tool-bar">
          <h3>Găng Tay Vật Lý</h3>
          <button
            className={`tool-btn ${selectedTool === TOOLS.MOVE ? 'active' : ''}`}
            onClick={() => handleToolSelect(TOOLS.MOVE)}
          >
            {TOOLS.MOVE}
          </button>
          <button
            className={`tool-btn ${selectedTool === TOOLS.SCAN ? 'active' : ''}`}
            onClick={() => handleToolSelect(TOOLS.SCAN)}
          >
            {TOOLS.SCAN}
          </button>
          
          {/* Mở khóa Lực ở KV 2 (Level index 1) */}
          <button 
            className={`tool-btn ${selectedTool === TOOLS.FORCE ? 'active' : ''}`}
            onClick={() => handleToolSelect(TOOLS.FORCE)}
            disabled={currentLevelIndex < 1} 
          >
            {TOOLS.FORCE}
          </button>
          
          {/* Mở khóa Nhiệt ở KV 3 (Level index 2) */}
          <button 
            className={`tool-btn ${selectedTool === TOOLS.THERMAL ? 'active' : ''}`}
            onClick={() => handleToolSelect(TOOLS.THERMAL)}
            disabled={currentLevelIndex < 2}
          >
            {TOOLS.THERMAL}
          </button>
        </aside>
        <main className="game-viewport">
          <h2>{currentLevel.title}</h2>
          <div className="message-bar">{message}</div>
          {renderLevelContent()}
        </main>
      </div>
    </div>
  );
};

export default NanoLab;