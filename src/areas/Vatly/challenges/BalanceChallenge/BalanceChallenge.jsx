import React, { useState, useMemo, useCallback } from 'react';
// Sửa đường dẫn: ra 3 cấp, vào 'data', lấy 'games' (bỏ .js)
import { GAME_DATA, checkPuzzleResult } from '../../data/games';
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';

// Sửa đường dẫn: Import file CSS từ thư mục styles
import './BalanceChallenge.css';

// --- Hằng số Cấu hình ---
const SCALE_FACTOR = 40; // Pixel cho mỗi đơn vị 'd' (40px)
const LEVER_WIDTH_UNITS = 10; // Đòn bẩy rộng 10 vạch mỗi bên (tổng 20)
const LEVER_WIDTH_PX = LEVER_WIDTH_UNITS * SCALE_FACTOR * 2; // 10 * 40 * 2 = 800px

// --- Component Vật nặng Kéo được (Draggable) ---
const DraggableMass = ({ mass }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("mass", mass);
    e.currentTarget.classList.add('dragging');
  };
  
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div
      className="mass"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {mass} kg
    </div>
  );
};

// --- Component Vật nặng Đã đặt (Fixed) ---
const PlacedMass = ({ mass, distance, isHidden }) => {
  // Tính vị trí x (pixel) từ tâm (0)
  // d = -5 -> x = -200px
  // d = 5  -> x = +200px
  const x_from_center = distance * SCALE_FACTOR;
  
  // Chuyển đổi sang % (left: 0% -> 100%)
  const left_percent = 50 + (x_from_center / LEVER_WIDTH_PX) * 100;

  return (
    <div
      className={`mass placed-mass ${isHidden ? 'hidden' : ''}`}
      style={{ left: `${left_percent}%` }}
    >
      {isHidden ? '?' : `${mass} kg`}
    </div>
  );
};

// --- Component Khe Thả vật (Drop Slot) ---
const DropSlot = ({ distance, onDrop }) => {
  const x_from_center = distance * SCALE_FACTOR;
  const left_percent = 50 + (x_from_center / LEVER_WIDTH_PX) * 100;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const mass = e.dataTransfer.getData("mass");
    if (mass) {
      onDrop(Number(mass), distance);
    }
  };

  return (
    <div
      className="drop-slot"
      style={{ left: `${left_percent}%` }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
    </div>
  );
};

// --- Component Vạch Chia ---
const LeverMark = ({ distance }) => {
  const x_from_center = distance * SCALE_FACTOR;
  const left_percent = 50 + (x_from_center / LEVER_WIDTH_PX) * 100;
  // Vạch chính ở 5 và 10
  const isMain = distance % 5 === 0; 

  return (
    <div 
      className={`mark ${isMain ? 'main-mark' : ''}`}
      style={{ left: `${left_percent}%` }}
    >
    </div>
  );
};


// --- Component Game Chính ---
const BalanceChallenge = () => {
  // Lấy dữ liệu từ file games.js (giờ là GAME_DATA)
  const [showIntro, setShowIntro] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Danh sách các vật nặng người chơi đã đặt
  // Cấu trúc: [ { mass: 10, distance: 5 }, { mass: 20, distance: 2 } ]
  const [placedMasses, setPlacedMasses] = useState([]);
  
  const [feedback, setFeedback] = useState(null); // { isSuccess: bool, angle: number }

  // Lấy dữ liệu màn chơi hiện tại
  const currentLevel = useMemo(() => GAME_DATA[levelIndex], [levelIndex]);
  const currentQuestion = useMemo(() => currentLevel?.questions?.[questionIndex], [currentLevel, questionIndex]);

  // Vật nặng cố định (Bên trái)
  const fixedMasses = useMemo(() => {
    return currentQuestion.leftObjects.map(obj => ({
      ...obj,
      isHidden: obj.mass === '?', // Logic vật ẩn
    }));
  }, [currentQuestion]);

  // Các vật nặng có sẵn để kéo (ví dụ: [5, 10, 20])
  const draggableMasses = useMemo(() => {
    // Tạm thời cố định, bạn có thể thay đổi dựa trên level
    return [5, 10, 15, 20]; 
  }, []);

  // Các khe có thể thả vật (Luôn có, bất kể vạch chia)
  const dropSlots = useMemo(() => {
    let slots = [];
    // Chỉ cho phép thả bên phải (để đơn giản logic chấm điểm)
    for (let d = 1; d <= LEVER_WIDTH_UNITS; d++) {
      slots.push(d); 
    }
    return slots;
  }, []);

  // --- Logic Kéo Thả ---
  const handleDropMass = useCallback((mass, distance) => {
    setPlacedMasses(prev => {
      // Logic: Nếu thả vào khe đã có, thay thế.
      const existingIndex = prev.findIndex(m => m.distance === distance);
      if (existingIndex > -1) {
        const newMasses = [...prev];
        newMasses[existingIndex] = { mass, distance };
        return newMasses;
      }
      // Thêm mới
      return [...prev, { mass, distance }];
    });
    setFeedback(null); // Đặt lại phản hồi
  }, []);

  // Xóa vật nặng khi nhấn vào
  const handleRemoveMass = (distance) => {
    setPlacedMasses(prev => prev.filter(m => m.distance !== distance));
    setFeedback(null);
  };

  // --- Logic Chấm điểm ---
  const handleCheck = useCallback(() => {
    // Vật nặng cố định bên trái
    const leftSide = currentQuestion.leftObjects.map(m => ({...m, distance: m.d, mass: m.mass, hiddenAnswer: m.hiddenAnswer}));
    // Vật nặng người chơi đặt (chỉ ở bên phải)
    const rightSide = placedMasses;

    // Gọi hàm logic phức tạp từ games.js
    const result = checkPuzzleResult(
      leftSide, 
      rightSide, 
      currentQuestion.target, 
      0.1 // Sai số 0.1
    );
    
    setFeedback(result);

    if (result.isSuccess) {
      setScore(s => s + 2); // Cộng điểm
    }

  }, [placedMasses, currentQuestion]);

  // --- Thử lại (Retry) ---
  const handleRetry = useCallback(() => {
    // Xóa các vật đã đặt và đặt lại feedback để người chơi thử lại
    setPlacedMasses([]);
    setFeedback(null);
  }, []);

  // --- Chuyển màn ---
  const handleNext = () => {
    if (questionIndex < currentLevel.questions.length - 1) {
      setQuestionIndex(q => q + 1);
    } else if (levelIndex < GAME_DATA.length - 1) {
      setLevelIndex(l => l + 1);
      setQuestionIndex(0);
    } else {
      alert("Trò chơi kết thúc! Tổng điểm: " + score);
    }
    setPlacedMasses([]);
    setFeedback(null);
  };

  // Tính góc nghiêng
  const rotationAngle = feedback ? feedback.angle : 0;

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop6-1']} onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="game-container">
      {/* Nút quay lại (nếu cần) */}
      {/* <button onClick={() => {}} style={{position: 'absolute', top: '20px', left: '20px'}}>Quay lại</button> */}
      
      <div className="header-bar">
        <span>Mức độ: {currentLevel.level}</span>
        <span>Câu đố: {questionIndex + 1}/{currentLevel.questions.length}</span>
        <span>Điểm: {score}</span>
      </div>
      
      <h1 className="title">{currentLevel.title}</h1>
      <p className="hint-text">{currentLevel.hint}</p>

      {/* KHU VỰC KÉO VẬT NẶNG */}
      <div className="mass-container">
        {draggableMasses.map(mass => (
          <DraggableMass key={mass} mass={mass} />
        ))}
      </div>

      {/* KHU VỰC GAME */}
      <div className="game-area">
        <div className="fulcrum"></div>
        
        <div 
          className="lever-container" 
          style={{ 
            width: `${LEVER_WIDTH_PX}px`,
            transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
          }}
        >
          {/* Render CÁC VẠCH CHIA (nếu showMarks là true) */}
          {currentLevel.showMarks && dropSlots.map(d => (
            <LeverMark key={`mark-${d}`} distance={d} />
          ))}
          {/* Render VẠCH CHIA bên trái (nếu cần) */}
          {currentLevel.showMarks && dropSlots.map(d => (
            <LeverMark key={`mark-neg-${d}`} distance={-d} />
          ))}

          {/* Render CÁC KHE THẢ VẬT (luôn render) */}
          {dropSlots.map(d => (
            <DropSlot 
              key={`slot-${d}`} 
              distance={d} 
              onDrop={handleDropMass}
            />
          ))}

          {/* Render vật nặng cố định (Bên trái) */}
          {fixedMasses.map((mass, index) => (
            <PlacedMass 
              key={`fixed-${index}`}
              mass={mass.mass} 
              distance={-mass.d} // d=5 -> distance = -5
              isHidden={mass.isHidden} 
            />
          ))}

          {/* Render các vật nặng người chơi đã đặt */}
          {placedMasses.map((mass, index) => (
            // Thêm onClick để xóa
            <div key={`placed-${index}`} onClick={() => handleRemoveMass(mass.distance)}>
              <PlacedMass 
                mass={mass.mass} 
                distance={mass.distance} 
              />
            </div>
          ))}

        </div>

        {/* Phản hồi (Mặt cười/mếu) */}
        {feedback && (
          <div className="feedback-face">
            {feedback.isSuccess ? '😊' : '😟'}
          </div>
        )}
      </div>
      
      {/* KHU VỰC NÚT ĐIỀU KHIỂN */}
      <div className="controls">
        {feedback ? (
          feedback.isSuccess ? (
            <button className="button next" onClick={handleNext}>Kế Tiếp</button>
          ) : (
            // Hiển thị nút Thử Lại khi trả lời sai
            <button className="button" onClick={handleRetry}>Thử Lại</button>
          )
        ) : (
          <button 
            className="button" 
            onClick={handleCheck}
            disabled={placedMasses.length === 0} // Vô hiệu hóa khi chưa đặt gì
          >
            Chấm Điểm
          </button>
        )}
      </div>
    </div>
  );
};

export default BalanceChallenge;


