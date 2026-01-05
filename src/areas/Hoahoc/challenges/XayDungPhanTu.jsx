import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Lightbulb, Atom, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './XayDungPhanTu.css';

// Dữ liệu về các nguyên tử
const atomsData = {
  H: { name: 'Hydro', color: '#ffffff', textColor: '#000000', bonds: 1 },
  C: { name: 'Carbon', color: '#909090', textColor: '#ffffff', bonds: 4 },
  N: { name: 'Nitơ', color: '#3050f8', textColor: '#ffffff', bonds: 3 },
  O: { name: 'Oxy', color: '#ff0d0d', textColor: '#ffffff', bonds: 2 },
  Cl: { name: 'Clo', color: '#1ff01f', textColor: '#000000', bonds: 1 },
  S: { name: 'Lưu huỳnh', color: '#ffff30', textColor: '#000000', bonds: 2 },
  F: { name: 'Flo', color: '#90e050', textColor: '#000000', bonds: 1 },
  Br: { name: 'Brom', color: '#a62929', textColor: '#ffffff', bonds: 1 }
};

// Các phân tử mục tiêu theo cấp độ
const moleculesByLevel = {
  1: [ // Cấp độ dễ - Phân tử 2 nguyên tử
    {
      id: 1,
      name: 'Nước',
      formula: 'H₂O',
      atoms: ['H', 'H', 'O'],
      bonds: [
        { from: 0, to: 2, type: 'single' },
        { from: 1, to: 2, type: 'single' }
      ],
      structure: [
        { atom: 'O', x: 50, y: 50 },
        { atom: 'H', x: 30, y: 30 },
        { atom: 'H', x: 70, y: 30 }
      ],
      points: 10,
      hint: 'Một nguyên tử O liên kết với hai nguyên tử H'
    },
    {
      id: 2,
      name: 'Khí hydro',
      formula: 'H₂',
      atoms: ['H', 'H'],
      bonds: [
        { from: 0, to: 1, type: 'single' }
      ],
      structure: [
        { atom: 'H', x: 40, y: 50 },
        { atom: 'H', x: 60, y: 50 }
      ],
      points: 8,
      hint: 'Hai nguyên tử H liên kết với nhau'
    },
    {
      id: 3,
      name: 'Khí oxy',
      formula: 'O₂',
      atoms: ['O', 'O'],
      bonds: [
        { from: 0, to: 1, type: 'double' }
      ],
      structure: [
        { atom: 'O', x: 40, y: 50 },
        { atom: 'O', x: 60, y: 50 }
      ],
      points: 10,
      hint: 'Hai nguyên tử O liên kết đôi'
    },
    {
      id: 4,
      name: 'Axit clohidric',
      formula: 'HCl',
      atoms: ['H', 'Cl'],
      bonds: [
        { from: 0, to: 1, type: 'single' }
      ],
      structure: [
        { atom: 'H', x: 40, y: 50 },
        { atom: 'Cl', x: 60, y: 50 }
      ],
      points: 8,
      hint: 'Một nguyên tử H liên kết với một nguyên tử Cl'
    }
  ],
  2: [ // Cấp độ trung bình - Phân tử 3-4 nguyên tử
    {
      id: 5,
      name: 'Amoniac',
      formula: 'NH₃',
      atoms: ['N', 'H', 'H', 'H'],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'single' }
      ],
      structure: [
        { atom: 'N', x: 50, y: 50 },
        { atom: 'H', x: 35, y: 35 },
        { atom: 'H', x: 65, y: 35 },
        { atom: 'H', x: 50, y: 70 }
      ],
      points: 15,
      hint: 'Một nguyên tử N ở giữa, ba nguyên tử H xung quanh'
    },
    {
      id: 6,
      name: 'Metan',
      formula: 'CH₄',
      atoms: ['C', 'H', 'H', 'H', 'H'],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'single' },
        { from: 0, to: 4, type: 'single' }
      ],
      structure: [
        { atom: 'C', x: 50, y: 50 },
        { atom: 'H', x: 30, y: 30 },
        { atom: 'H', x: 70, y: 30 },
        { atom: 'H', x: 30, y: 70 },
        { atom: 'H', x: 70, y: 70 }
      ],
      points: 15,
      hint: 'Một nguyên tử C ở giữa, bốn nguyên tử H xung quanh'
    },
    {
      id: 7,
      name: 'Khí cacbonic',
      formula: 'CO₂',
      atoms: ['C', 'O', 'O'],
      bonds: [
        { from: 0, to: 1, type: 'double' },
        { from: 0, to: 2, type: 'double' }
      ],
      structure: [
        { atom: 'C', x: 50, y: 50 },
        { atom: 'O', x: 30, y: 50 },
        { atom: 'O', x: 70, y: 50 }
      ],
      points: 12,
      hint: 'C ở giữa, hai O ở hai bên với liên kết đôi'
    },
    {
      id: 8,
      name: 'Hydro sunfua',
      formula: 'H₂S',
      atoms: ['H', 'H', 'S'],
      bonds: [
        { from: 0, to: 2, type: 'single' },
        { from: 1, to: 2, type: 'single' }
      ],
      structure: [
        { atom: 'S', x: 50, y: 50 },
        { atom: 'H', x: 30, y: 35 },
        { atom: 'H', x: 70, y: 35 }
      ],
      points: 12,
      hint: 'Giống H₂O nhưng thay O bằng S'
    }
  ],
  3: [ // Cấp độ khó - Phân tử phức tạp
    {
      id: 9,
      name: 'Etanol',
      formula: 'C₂H₆O',
      atoms: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'O', 'H'],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'single' },
        { from: 0, to: 4, type: 'single' },
        { from: 1, to: 5, type: 'single' },
        { from: 1, to: 6, type: 'single' },
        { from: 1, to: 7, type: 'single' },
        { from: 7, to: 8, type: 'single' }
      ],
      structure: [
        { atom: 'C', x: 35, y: 50 },
        { atom: 'C', x: 55, y: 50 },
        { atom: 'H', x: 20, y: 35 },
        { atom: 'H', x: 20, y: 65 },
        { atom: 'H', x: 35, y: 70 },
        { atom: 'H', x: 55, y: 30 },
        { atom: 'H', x: 55, y: 70 },
        { atom: 'O', x: 75, y: 50 },
        { atom: 'H', x: 85, y: 45 }
      ],
      points: 25,
      hint: 'CH₃-CH₂-OH: Hai carbon liên kết, một nhóm OH'
    },
    {
      id: 10,
      name: 'Axit axetic',
      formula: 'CH₃COOH',
      atoms: ['C', 'C', 'H', 'H', 'H', 'O', 'O', 'H'],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'single' },
        { from: 0, to: 4, type: 'single' },
        { from: 1, to: 5, type: 'double' },
        { from: 1, to: 6, type: 'single' },
        { from: 6, to: 7, type: 'single' }
      ],
      structure: [
        { atom: 'C', x: 30, y: 50 },
        { atom: 'C', x: 55, y: 50 },
        { atom: 'H', x: 15, y: 35 },
        { atom: 'H', x: 15, y: 65 },
        { atom: 'H', x: 30, y: 70 },
        { atom: 'O', x: 60, y: 30 },
        { atom: 'O', x: 75, y: 55 },
        { atom: 'H', x: 85, y: 50 }
      ],
      points: 25,
      hint: 'CH₃-COOH: Nhóm metyl và nhóm carboxyl'
    },
    {
      id: 11,
      name: 'Khí nitơ',
      formula: 'N₂',
      atoms: ['N', 'N'],
      bonds: [
        { from: 0, to: 1, type: 'triple' }
      ],
      structure: [
        { atom: 'N', x: 40, y: 50 },
        { atom: 'N', x: 60, y: 50 }
      ],
      points: 15,
      hint: 'Hai nguyên tử N liên kết ba'
    },
    {
      id: 12,
      name: 'Formaldehit',
      formula: 'CH₂O',
      atoms: ['C', 'H', 'H', 'O'],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'double' }
      ],
      structure: [
        { atom: 'C', x: 50, y: 50 },
        { atom: 'H', x: 35, y: 40 },
        { atom: 'H', x: 65, y: 40 },
        { atom: 'O', x: 50, y: 70 }
      ],
      points: 18,
      hint: 'C ở giữa, hai H và một O (liên kết đôi)'
    }
  ]
};

const XayDungPhanTu = () => {
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('xay-dung-phan-tu');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentMoleculeIndex, setCurrentMoleculeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [completedMolecules, setCompletedMolecules] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Building area states
  const [placedAtoms, setPlacedAtoms] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [availableAtoms, setAvailableAtoms] = useState({});
  
  const buildAreaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedAtom, setDraggedAtom] = useState(null);

  const currentMolecules = moleculesByLevel[currentLevel];
  const targetMolecule = currentMolecules[currentMoleculeIndex];

  // Khởi tạo các nguyên tử có sẵn khi câu hỏi thay đổi
  useEffect(() => {
    if (targetMolecule) {
      const atomCounts = {};
      targetMolecule.atoms.forEach(atom => {
        atomCounts[atom] = (atomCounts[atom] || 0) + 1;
      });
      setAvailableAtoms(atomCounts);
      setPlacedAtoms([]);
      setBonds([]);
      setShowResult(false);
      setShowHint(false);
    }
  }, [currentMoleculeIndex, currentLevel, targetMolecule]);

  // Xử lý kéo thả nguyên tử
  const handleAtomDragStart = (atomType) => {
    if (availableAtoms[atomType] > 0) {
      setDraggedAtom(atomType);
      setIsDragging(true);
    }
  };

  const handleBuildAreaDrop = (e) => {
    e.preventDefault();
    if (!draggedAtom || !buildAreaRef.current) return;

    const rect = buildAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Thêm nguyên tử vào vùng xây dựng
    const newAtom = {
      id: Date.now(),
      type: draggedAtom,
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y))
    };

    setPlacedAtoms([...placedAtoms, newAtom]);
    setAvailableAtoms({
      ...availableAtoms,
      [draggedAtom]: availableAtoms[draggedAtom] - 1
    });

    setIsDragging(false);
    setDraggedAtom(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Chọn nguyên tử để tạo liên kết
  const handleAtomClick = (atomId) => {
    if (selectedAtom === null) {
      setSelectedAtom(atomId);
    } else if (selectedAtom === atomId) {
      setSelectedAtom(null);
    } else {
      // Tạo liên kết giữa hai nguyên tử
      const atom1 = placedAtoms.find(a => a.id === selectedAtom);
      const atom2 = placedAtoms.find(a => a.id === atomId);
      
      // Kiểm tra xem đã có liên kết chưa
      const existingBond = bonds.find(
        b => (b.from === selectedAtom && b.to === atomId) || 
             (b.from === atomId && b.to === selectedAtom)
      );

      if (existingBond) {
        // Nâng cấp liên kết: single -> double -> triple -> xóa
        const bondTypes = ['single', 'double', 'triple'];
        const currentIndex = bondTypes.indexOf(existingBond.type);
        
        if (currentIndex < 2) {
          // Nâng cấp liên kết
          setBonds(bonds.map(b => 
            b === existingBond ? { ...b, type: bondTypes[currentIndex + 1] } : b
          ));
        } else {
          // Xóa liên kết
          setBonds(bonds.filter(b => b !== existingBond));
        }
      } else {
        // Tạo liên kết mới
        const newBond = {
          id: Date.now(),
          from: selectedAtom,
          to: atomId,
          type: 'single'
        };
        setBonds([...bonds, newBond]);
      }
      
      setSelectedAtom(null);
    }
  };

  // Xóa nguyên tử
  const handleRemoveAtom = (atomId) => {
    const atom = placedAtoms.find(a => a.id === atomId);
    
    // Xóa các liên kết liên quan
    setBonds(bonds.filter(b => b.from !== atomId && b.to !== atomId));
    
    // Trả lại nguyên tử vào kho
    setAvailableAtoms({
      ...availableAtoms,
      [atom.type]: availableAtoms[atom.type] + 1
    });
    
    // Xóa nguyên tử
    setPlacedAtoms(placedAtoms.filter(a => a.id !== atomId));
    
    if (selectedAtom === atomId) {
      setSelectedAtom(null);
    }
  };

  // Kiểm tra phân tử
  const checkMolecule = () => {
    // Kiểm tra số lượng nguyên tử
    const atomCounts = {};
    placedAtoms.forEach(atom => {
      atomCounts[atom.type] = (atomCounts[atom.type] || 0) + 1;
    });

    const targetCounts = {};
    targetMolecule.atoms.forEach(atom => {
      targetCounts[atom] = (targetCounts[atom] || 0) + 1;
    });

    const atomCountsMatch = Object.keys(targetCounts).every(
      atom => atomCounts[atom] === targetCounts[atom]
    ) && Object.keys(atomCounts).length === Object.keys(targetCounts).length;

    // Kiểm tra số lượng liên kết
    const bondsMatch = bonds.length === targetMolecule.bonds.length;

    // Kiểm tra loại liên kết (đơn giản hóa - chỉ kiểm tra số lượng mỗi loại)
    const bondTypeCounts = {};
    bonds.forEach(bond => {
      bondTypeCounts[bond.type] = (bondTypeCounts[bond.type] || 0) + 1;
    });

    const targetBondTypeCounts = {};
    targetMolecule.bonds.forEach(bond => {
      targetBondTypeCounts[bond.type] = (targetBondTypeCounts[bond.type] || 0) + 1;
    });

    const bondTypesMatch = Object.keys(targetBondTypeCounts).every(
      type => bondTypeCounts[type] === targetBondTypeCounts[type]
    ) && Object.keys(bondTypeCounts).length === Object.keys(targetBondTypeCounts).length;

    const correct = atomCountsMatch && bondsMatch && bondTypesMatch;
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + targetMolecule.points);
      setTotalScore(totalScore + targetMolecule.points);
      setCompletedMolecules([...completedMolecules, targetMolecule.id]);
    }
  };

  // Chuyển câu tiếp theo
  const handleNext = () => {
    if (currentMoleculeIndex < currentMolecules.length - 1) {
      const newIndex = currentMoleculeIndex + 1;
      setCurrentMoleculeIndex(newIndex);
      // Save progress
      saveProgress({
        currentLevel,
        currentMoleculeIndex: newIndex,
        score,
        totalScore,
        completedMolecules
      });
    } else if (currentLevel < 3) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      setCurrentMoleculeIndex(0);
      setScore(0);
      // Save progress
      saveProgress({
        currentLevel: newLevel,
        currentMoleculeIndex: 0,
        score: 0,
        totalScore,
        completedMolecules
      });
    } else {
      setGameCompleted(true);
      clearProgress();
    }
  };

  // Reset
  const handleReset = () => {
    const atomCounts = {};
    targetMolecule.atoms.forEach(atom => {
      atomCounts[atom] = (atomCounts[atom] || 0) + 1;
    });
    setAvailableAtoms(atomCounts);
    setPlacedAtoms([]);
    setBonds([]);
    setSelectedAtom(null);
    setShowResult(false);
  };

  const handleRestart = () => {
    clearProgress();
    setCurrentLevel(1);
    setCurrentMoleculeIndex(0);
    setScore(0);
    setTotalScore(0);
    setCompletedMolecules([]);
    setGameCompleted(false);
    setPlacedAtoms([]);
    setBonds([]);
  };

  // Tính toán tiến độ
  const totalMolecules = Object.values(moleculesByLevel).flat().length;
  const progress = (completedMolecules.length / totalMolecules) * 100;

  if (gameCompleted) {
    const maxScore = Object.values(moleculesByLevel).flat().reduce((sum, m) => sum + m.points, 0);
    const percentage = ((totalScore / maxScore) * 100).toFixed(0);

    return (
      <div className="xay-dung-phan-tu-container">
        <div className="result-modal show">
          <div className="result-content">
            <Trophy className="result-icon" size={80} />
            <h2>Hoàn thành xuất sắc!</h2>
            <div className="result-stats">
              <p className="result-score">Tổng điểm: {totalScore}/{maxScore}</p>
              <p className="result-accuracy">Hoàn thành: {percentage}%</p>
              <p className="result-correct">Đã xây dựng: {completedMolecules.length}/{totalMolecules} phân tử</p>
            </div>
            <div className="result-message">
              {percentage >= 90 && <p>🏆 Xuất sắc! Bạn là kiến trúc sư phân tử hàng đầu!</p>}
              {percentage >= 70 && percentage < 90 && <p>👍 Tuyệt vời! Bạn đã nắm vững cách xây dựng phân tử!</p>}
              {percentage >= 50 && percentage < 70 && <p>💪 Khá tốt! Tiếp tục luyện tập để hoàn thiện!</p>}
              {percentage < 50 && <p>📚 Hãy học thêm về cấu trúc phân tử nhé!</p>}
            </div>
            <div className="result-actions">
              <button onClick={handleRestart} className="btn-restart">
                Chơi lại
              </button>
              <Link to="/advanced-challenge" className="btn-home">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xay-dung-phan-tu-container">
      <div className="game-header-combined">
        <div className="header-top">
          <Link to="/advanced-challenge" className="back-button">
            <ArrowLeft size={24} />
            <span>Quay lại</span>
          </Link>
          <h1 className="game-title">
            <Atom className="title-icon" />
            Xây Dựng Phân Tử
          </h1>
          <div className="score-display">
            <Trophy size={24} />
            <span>{totalScore} điểm</span>
          </div>
        </div>

        <div className="progress-section-inline">
          <div className="level-info">
            <span className="level-badge">Cấp độ {currentLevel}</span>
            <span className="molecule-counter">
              Phân tử {currentMoleculeIndex + 1}/{currentMolecules.length}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="game-content">

        <div className="game-layout">
          {/* Mục tiêu */}
          <div className="target-section">
            <h3>
              <Target size={20} />
              Phân tử mục tiêu
            </h3>
            <div className="target-molecule">
              <h2>{targetMolecule.name}</h2>
              <div className="formula">{targetMolecule.formula}</div>
              <div className="points-badge">+{targetMolecule.points} điểm</div>
            </div>

            {/* Kho nguyên tử */}
            <div className="atoms-inventory">
              <h4>Nguyên tử có sẵn:</h4>
              <div className="atoms-list">
                {Object.entries(availableAtoms).map(([atomType, count]) => (
                  <div
                    key={atomType}
                    className={`atom-source ${count === 0 ? 'depleted' : ''}`}
                    draggable={count > 0}
                    onDragStart={() => handleAtomDragStart(atomType)}
                  >
                    <div
                      className="atom-circle"
                      style={{
                        backgroundColor: atomsData[atomType].color,
                        color: atomsData[atomType].textColor
                      }}
                    >
                      {atomType}
                    </div>
                    <span className="atom-count">×{count}</span>
                    <span className="atom-name">{atomsData[atomType].name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gợi ý */}
            <div className="hint-section">
              <button
                className="hint-button"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb size={20} />
                {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
              </button>
              {showHint && (
                <div className="hint-box">
                  <Lightbulb size={16} />
                  <p>{targetMolecule.hint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vùng xây dựng */}
          <div className="build-section">
            <h3>Vùng xây dựng phân tử</h3>
            <div className="instructions">
              <p>🔹 Kéo nguyên tử vào vùng xây dựng</p>
              <p>🔹 Click vào 2 nguyên tử để tạo liên kết</p>
              <p>🔹 Click lại để thay đổi liên kết: đơn → đôi → ba → xóa</p>
              <p>🔹 Double-click nguyên tử để xóa</p>
            </div>
            
            <div
              ref={buildAreaRef}
              className="build-area"
              onDrop={handleBuildAreaDrop}
              onDragOver={handleDragOver}
            >
              {/* Vẽ các liên kết */}
              <svg className="bonds-layer">
                {bonds.map((bond) => {
                  const atom1 = placedAtoms.find(a => a.id === bond.from);
                  const atom2 = placedAtoms.find(a => a.id === bond.to);
                  if (!atom1 || !atom2) return null;

                  const x1 = atom1.x;
                  const y1 = atom1.y;
                  const x2 = atom2.x;
                  const y2 = atom2.y;

                  // Tính vector vuông góc để vẽ liên kết đôi/ba
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const perpX = -dy / len * 1.5;
                  const perpY = dx / len * 1.5;

                  return (
                    <g key={bond.id}>
                      {bond.type === 'single' && (
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="#333"
                          strokeWidth="2"
                        />
                      )}
                      {bond.type === 'double' && (
                        <>
                          <line
                            x1={`${x1 + perpX}%`}
                            y1={`${y1 + perpY}%`}
                            x2={`${x2 + perpX}%`}
                            y2={`${y2 + perpY}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                          <line
                            x1={`${x1 - perpX}%`}
                            y1={`${y1 - perpY}%`}
                            x2={`${x2 - perpX}%`}
                            y2={`${y2 - perpY}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                        </>
                      )}
                      {bond.type === 'triple' && (
                        <>
                          <line
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                          <line
                            x1={`${x1 + perpX * 1.5}%`}
                            y1={`${y1 + perpY * 1.5}%`}
                            x2={`${x2 + perpX * 1.5}%`}
                            y2={`${y2 + perpY * 1.5}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                          <line
                            x1={`${x1 - perpX * 1.5}%`}
                            y1={`${y1 - perpY * 1.5}%`}
                            x2={`${x2 - perpX * 1.5}%`}
                            y2={`${y2 - perpY * 1.5}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Vẽ các nguyên tử */}
              {placedAtoms.map((atom) => (
                <div
                  key={atom.id}
                  className={`placed-atom ${selectedAtom === atom.id ? 'selected' : ''}`}
                  style={{
                    left: `${atom.x}%`,
                    top: `${atom.y}%`,
                    backgroundColor: atomsData[atom.type].color,
                    color: atomsData[atom.type].textColor
                  }}
                  onClick={() => handleAtomClick(atom.id)}
                  onDoubleClick={() => handleRemoveAtom(atom.id)}
                >
                  {atom.type}
                </div>
              ))}

              {placedAtoms.length === 0 && (
                <div className="empty-message">
                  Kéo thả nguyên tử vào đây để bắt đầu
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button onClick={handleReset} className="btn-reset">
                <RotateCcw size={20} />
                Làm lại
              </button>
              <button
                onClick={checkMolecule}
                className="btn-check"
                disabled={placedAtoms.length === 0}
              >
                <CheckCircle size={20} />
                Kiểm tra
              </button>
            </div>

            {/* Kết quả */}
            {showResult && (
              <div className={`result-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle size={32} />
                    <h3>Chính xác! 🎉</h3>
                    <p>Bạn đã xây dựng đúng phân tử {targetMolecule.name}!</p>
                    <p className="points-earned">+{targetMolecule.points} điểm</p>
                    <button onClick={handleNext} className="btn-next">
                      {currentMoleculeIndex < currentMolecules.length - 1 || currentLevel < 3
                        ? 'Phân tử tiếp theo →'
                        : 'Hoàn thành'}
                    </button>
                  </>
                ) : (
                  <>
                    <XCircle size={32} />
                    <h3>Chưa đúng!</h3>
                    <p>Hãy kiểm tra lại cấu trúc phân tử.</p>
                    <p className="hint-text">Lưu ý số lượng nguyên tử và loại liên kết!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ResumeDialog
        show={showResumeDialog}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={{
          current: (getProgress()?.currentLevel || 1),
          total: 3,
          score: getProgress()?.totalScore || 0
        }}
      />
    </div>
  );
};

export default XayDungPhanTu;
