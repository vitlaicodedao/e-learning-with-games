import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Lightbulb } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './SuyLuanPhanUng.css';

// Game data and utilities
const reactionRules = new Map([
  // 🔥 Phản ứng cháy
  [['H2','O2'].sort().join('+'), ['H2O']],
  [['CH4','O2'].sort().join('+'), ['CO2','H2O']],
  [['C','O2'].sort().join('+'), ['CO2']],
  [['S','O2'].sort().join('+'), ['SO2']],
  [['CO','O2'].sort().join('+'), ['CO2']],
  [['Fe','O2'].sort().join('+'), ['Fe2O3']],
  [['Mg','O2'].sort().join('+'), ['MgO']],
  [['Ca','O2'].sort().join('+'), ['CaO']],
  [['Al','O2'].sort().join('+'), ['Al2O3']],
  [['Zn','O2'].sort().join('+'), ['ZnO']],
  [['Cu','O2'].sort().join('+'), ['CuO']],
  [['P','O2'].sort().join('+'), ['P2O5']],
  [['H2','Cl2'].sort().join('+'), ['HCl']],
  

  // 🌊 Tổng hợp
  [['N2','H2'].sort().join('+'), ['NH3']],
  [['Na','Cl2'].sort().join('+'), ['NaCl']],
  [['CO2','H2O'].sort().join('+'), ['C6H12O6','O2']], // Quang hợp
  [['CaO','H2O'].sort().join('+'), ['Ca(OH)2']],
  [['NH3','HCl'].sort().join('+'), ['NH4Cl']],

  // ⚗️ Phản ứng phân hủy
  [['CaCO3'].sort().join('+'), ['CaO','CO2']],
  [['2H2O2'].sort().join('+'), ['2H2O','O2']],
  [['KClO3'].sort().join('+'), ['KCl','O2']],
  [['NH4NO3'].sort().join('+'), ['N2O','2H2O']],
  [['CuCO3'].sort().join('+'), ['CuO','CO2']],

  // ⚙️ Kim loại + Axit
  [['Zn','HCl'].sort().join('+'), ['ZnCl2','H2']],
  [['Fe','HCl'].sort().join('+'), ['FeCl2','H2']],
  [['Mg','H2SO4'].sort().join('+'), ['MgSO4','H2']],
  [['Al','HCl'].sort().join('+'), ['AlCl3','H2']],
  [['Na','H2O'].sort().join('+'), ['NaOH','H2']],

  // 🧂 Axit + Bazơ (Trung hòa)
  [['HCl','NaOH'].sort().join('+'), ['NaCl','H2O']],
  [['H2SO4','NaOH'].sort().join('+'), ['Na2SO4','H2O']],
  [['HNO3','KOH'].sort().join('+'), ['KNO3','H2O']],
  [['H2SO4','Ca(OH)2'].sort().join('+'), ['CaSO4','H2O']],

  // 🔁 Trao đổi
  [['AgNO3','NaCl'].sort().join('+'), ['AgCl','NaNO3']],
  [['BaCl2','Na2SO4'].sort().join('+'), ['BaSO4','NaCl']],
  [['CuSO4','Fe'].sort().join('+'), ['FeSO4','Cu']],
  [['FeCl3','Cu'].sort().join('+'), ['FeCl2','CuCl']],
  [['Zn','CuSO4'].sort().join('+'), ['ZnSO4','Cu']],
  [['FeS','HCl'].sort().join('+'), ['FeCl2','H2S']],
  [['CaCO3','HCl'].sort().join('+'), ['CaCl2','CO2','H2O']],

  // 🧪 Một số phản ứng khác
  [['NH3','O2'].sort().join('+'), ['NO','H2O']],
  [['SO2','O2'].sort().join('+'), ['SO3']],
  [['SO3','H2O'].sort().join('+'), ['H2SO4']],
  [['CO2','Ca(OH)2'].sort().join('+'), ['CaCO3','H2O']],
  [['Na2O','H2O'].sort().join('+'), ['NaOH']],
  [['P2O5','H2O'].sort().join('+'), ['H3PO4']],
  [['N2O5','H2O'].sort().join('+'), ['HNO3']]
]);


const distractorPool = [
  // ⚗️ Nguyên tố đơn chất
  'H2','O2','N2','Cl2','Br2','Na','K','Mg','Ca','Fe','Cu','Zn','Al','C','S','P',

  // 💧 Hợp chất vô cơ thông dụng
  'H2O','CO2','CO','SO2','SO3','NH3','NO','NO2',

  // 🧪 Axit
  'HCl','H2SO4','HNO3','H2CO3','H3PO4',

  // ⚙️ Bazơ
  'NaOH','KOH','Ca(OH)2','Mg(OH)2',

  // 🧂 Muối
  'NaCl','KCl','CaCO3','Na2CO3','Na2SO4','CuSO4','Fe2O3','ZnO',

  // 🔥 Một số oxit kim loại & phi kim
  'CaO','Al2O3','Fe3O4','P2O5',

  // 🧬 Một số hợp chất hữu cơ cơ bản
  'CH4','C2H6','C2H5OH','C6H12O6'
];

const levels = [
  {
    layout: ['R', '+', 'R', '→', 'P'],
    target: { left: ['H2', 'O2'], right: ['H2O'] },
    condition: 'Đốt cháy',
    requirements: [
      '🔥 Một khí rất nhẹ, không màu, dễ cháy',
      '💨 Một khí duy trì sự cháy',
      '💧 Sản phẩm là chất lỏng không màu ở điều kiện thường'
    ],
    title: 'Đốt cháy khí nhẹ tạo nước'
  },
  {
    layout: ['R', '+', 'R', '→', 'P'],
    target: { left: ['N2', 'H2'], right: ['NH3'] },
    condition: 't°, p, xúc tác',
    requirements: [
      '🌫️ Một khí trơ chiếm phần lớn không khí',
      '🔥 Một khí rất nhẹ và dễ cháy',
      '👃 Sản phẩm là khí có mùi khai, tan tốt trong nước'
    ],
    title: 'Tổng hợp khí có mùi khai'
  },
  {
    layout: ['R', '+', 'R', '→', 'P', '+', 'P'],
    target: { left: ['CO2', 'H2O'], right: ['C6H12O6', 'O2'] },
    condition: 'ánh sáng, diệp lục',
    requirements: [
      '🌍 Một khí gây hiệu ứng nhà kính',
      '💧 Chất lỏng không màu, hoà tan nhiều chất',
      '🍬 Sản phẩm gồm một loại đường và một khí duy trì sự cháy'
    ],
    title: 'Quang hợp tối giản'
  },
  {
    layout: ['R', '+', 'R', '→', 'P'],
    target: { left: ['Na', 'Cl2'], right: ['NaCl'] },
    condition: 't°',
    requirements: [
      '⚡ Một kim loại mềm, phản ứng rất mạnh với nước',
      '☣️ Một khí màu vàng lục, mùi hắc',
      '🧂 Sản phẩm là muối ăn quen thuộc'
    ],
    title: 'Tạo muối ăn'
  },
  {
    layout: ['R', '+', 'R', '→', 'P'],
    target: { left: ['Fe', 'O2'], right: ['Fe2O3'] },
    condition: 't°',
    requirements: [
      '🧲 Một kim loại có từ tính',
      '💨 Một khí duy trì sự cháy',
      '🟤 Sản phẩm là "gỉ" màu nâu đỏ'
    ],
    title: 'Hình thành gỉ sắt'
  },
  {
    layout: ['R', '→', 'P', '+', 'P'],
    target: { left: ['CaCO3'], right: ['CaO', 'CO2'] },
    condition: 't° cao',
    requirements: [
      '🪨 Chất rắn chính của đá vôi',
      '🔥 Khi đun nóng phân hủy tạo vôi sống và khí CO₂'
    ],
    title: 'Nhiệt phân đá vôi'
  },
  {
    layout: ['R', '+', 'R', '→', 'P', '+', 'P'],
    target: { left: ['CH4', 'O2'], right: ['CO2', 'H2O'] },
    condition: 'Đốt cháy',
    requirements: [
      '⛽ Thành phần chính của khí thiên nhiên',
      '🔥 Phản ứng cháy hoàn toàn sinh ra CO₂ và hơi nước'
    ],
    title: 'Cháy metan hoàn toàn'
  },
  {
    layout: ['R', '+', 'R', '→', 'P', '+', 'P'],
    target: { left: ['HCl', 'NaOH'], right: ['NaCl', 'H2O'] },
    condition: '',
    requirements: [
      '🔴 Một axit mạnh làm đỏ quỳ tím',
      '🔵 Một bazơ mạnh làm xanh quỳ tím',
      '🧂 Sản phẩm là muối ăn và nước'
    ],
    title: 'Trung hòa axit – bazơ'
  }
];

// Utility functions
const toPretty = (formula) => formula.replace(/(\d+)/g, '<sub>$1</sub>');
const keyOf = (arr) => [...arr].sort().join('+');

const pickDistractors = (excludeSet, count = 4) => {
  const picks = [];
  const pool = distractorPool.filter(x => !excludeSet.has(x));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  for (let i = 0; i < Math.min(count, pool.length); i++) picks.push(pool[i]);
  return picks;
};

const interleave = (arrA, arrB) => {
  const out = [];
  const maxLen = Math.max(arrA.length, arrB.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < arrA.length) out.push(arrA[i]);
    if (i < arrB.length) out.push(arrB[i]);
  }
  return out;
};

const generateProducts = (leftReactants) => {
  if (!leftReactants.length) return [];
  const k = keyOf(leftReactants);
  return reactionRules.get(k) || ['NR'];
};

const arraysEqualIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  const aa = [...a].sort();
  const bb = [...b].sort();
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
};

// Drag and Drop Tile Component
const DragTile = ({ formula, onDragStart, onDragEnd, isDragging }) => (
  <button 
    className={`chem-tile ${isDragging ? 'dragging' : ''}`}
    draggable
    onDragStart={(e) => onDragStart(e, formula)}
    onDragEnd={onDragEnd}
    dangerouslySetInnerHTML={{ __html: toPretty(formula) }}
  />
);

// Drop Zone Component
const DropZone = ({ id, onDrop, onClear, children, isActive }) => (
  <div 
    className={`chem-dropzone ${children ? 'filled' : ''} ${isActive ? 'active' : ''}`}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => onDrop(e, id)}
    onClick={() => onClear(id)}
  >
    {children}
  </div>
);

// Product Zone Component (readonly)
const ProductZone = ({ children }) => (
  <div className="chem-dropzone readonly">
    {children}
  </div>
);

export default function SuyLuanPhanUng() {
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('suy-luan-phan-ung');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [placements, setPlacements] = useState({});
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState('');
  const [reactantSlots, setReactantSlots] = useState(0);
  const [products, setProducts] = useState([]);
  const [draggedFormula, setDraggedFormula] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    if (hasProgress && !gameStarted) {
      setShowResumeDialog(true);
    } else if (!gameStarted) {
      setGameStarted(true);
    }
  }, [hasProgress, gameStarted]);

  // Start game - either from beginning or resume
  const startGame = (fromBeginning = false) => {
    setShowResumeDialog(false);
    if (fromBeginning) {
      clearProgress();
      setGameStarted(true);
    } else {
      // Resume from saved progress
      const savedData = getProgress();
      if (savedData) {
        setLevel(savedData.level || 0);
        setCompletedLevels(savedData.completedLevels || 0);
      }
      setGameStarted(true);
    }
  };

  const currentLevel = levels[level] || levels[0];

  // Generate bank items for current level
  const generateBankItems = useCallback(() => {
    if (!currentLevel || !currentLevel.target) return [];
    const needLeft = [...currentLevel.target.left];
    const exclude = new Set([...currentLevel.target.right, ...needLeft]);
    const extras = pickDistractors(exclude, 4);
    return interleave(needLeft, extras);
  }, [currentLevel]);

  const [bankItems, setBankItems] = useState([]);

  // Initialize level
  useEffect(() => {
    if (!currentLevel || !currentLevel.layout) return;
    const items = generateBankItems();
    setBankItems(items);
    setPlacements({});
    setProducts([]);
    setStatus('Kéo thả công thức hóa học để hoàn thành phản ứng theo mô tả.');
    setStatusKind('');

    // Count reactant slots
    const rCount = currentLevel.layout.filter(tok => tok === 'R').length;
    setReactantSlots(rCount);
  }, [level, generateBankItems, currentLevel]);

  // Recompute products when placements change
  useEffect(() => {
    const left = Object.keys(placements)
      .filter(id => id.startsWith('R'))
      .map(id => placements[id])
      .filter(Boolean);

    if (reactantSlots && left.length === reactantSlots) {
      const newProducts = generateProducts(left);
      setProducts(newProducts);
    } else {
      setProducts([]);
    }
  }, [placements, reactantSlots]);

  const handleDragStart = (e, formula) => {
    e.dataTransfer.setData('text/plain', formula);
    setDraggedFormula(formula);
  };

  const handleDragEnd = () => {
    setDraggedFormula(null);
    setActiveZone(null);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const formula = e.dataTransfer.getData('text/plain');
    if (!formula) return;

    // If replacing, add old item back to bank
    if (placements[zoneId]) {
      setBankItems(prev => [...prev, placements[zoneId]]);
    }

    // Update placements
    setPlacements(prev => ({ ...prev, [zoneId]: formula }));
    
    // Remove dragged item from bank
    setBankItems(prev => {
      const index = prev.findIndex(item => item === formula);
      if (index !== -1) {
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
      }
      return prev;
    });

    setActiveZone(null);
  };

  const handleClear = (zoneId) => {
    const formula = placements[zoneId];
    if (!formula) return;

    // Remove from placements
    setPlacements(prev => {
      const newPlacements = { ...prev };
      delete newPlacements[zoneId];
      return newPlacements;
    });

    // Add back to bank
    setBankItems(prev => [...prev, formula]);
  };

  const validate = () => {
    const rZones = Object.keys(placements).filter(id => id.startsWith('R'));
    if (rZones.length < reactantSlots) {
      setStatus('❌ Hãy điền đủ tất cả các ô chất phản ứng.');
      setStatusKind('error');
      return;
    }

    const left = rZones.map(id => placements[id]).filter(Boolean);
    const targetLeft = currentLevel.target.left;
    const targetRight = currentLevel.target.right;
    const generated = generateProducts(left);
    
    const ok = arraysEqualIgnoreOrder(left, targetLeft) && arraysEqualIgnoreOrder(generated, targetRight);
    
    if (ok) {
      setStatus('✅ Chính xác! Chuyển màn sau 2 giây...');
      setStatusKind('success');
      
      if (level < levels.length - 1) {
        setTimeout(() => {
          const nextLevel = level + 1;
          const nextCompleted = completedLevels + 1;
          setLevel(nextLevel);
          setCompletedLevels(nextCompleted);
          // Save progress
          saveProgress({ level: nextLevel, completedLevels: nextCompleted });
        }, 2000);
      } else {
        setGameCompleted(true);
        clearProgress();
        setStatus('🎉 Chúc mừng! Bạn đã hoàn thành tất cả 8 màn chơi!');
      }
    } else {
      setStatus('❌ Chưa đúng. Thử điều chỉnh lại các chất phản ứng.');
      setStatusKind('error');
    }
  };

  const goToPrevLevel = () => {
    if (level > 0) setLevel(level - 1);
  };

  const goToNextLevel = () => {
    if (level < levels.length - 1) setLevel(level + 1);
  };

  // Render equation elements
  const renderEquation = () => {
    if (!currentLevel || !currentLevel.layout) return [];
    const elements = [];
    let rCount = 0;
    let pCount = 0;
    let arrowRendered = false;

    currentLevel.layout.forEach((tok, index) => {
      if (tok === 'R') {
        const id = `R${++rCount}`;
        const formula = placements[id];
        elements.push(
          <DropZone 
            key={id}
            id={id}
            onDrop={handleDrop}
            onClear={handleClear}
            isActive={activeZone === id}
          >
            {formula && (
              <div 
                className="chem-tile"
                dangerouslySetInnerHTML={{ __html: toPretty(formula) }}
              />
            )}
          </DropZone>
        );
      } else if (tok === 'P') {
        const id = `P${++pCount}`;
        const product = products[pCount - 1];
        elements.push(
          <ProductZone key={id}>
            {product && (
              <div 
                className="chem-tile"
                dangerouslySetInnerHTML={{ __html: toPretty(product) }}
              />
            )}
          </ProductZone>
        );
      } else if (tok === '→') {
        // Add arrow with condition
        if (!arrowRendered && currentLevel.condition) {
          elements.push(
            <div key={`arrow-${index}`} className="chem-arrow-wrapper">
              {currentLevel.condition && (
                <div className="chem-condition">{currentLevel.condition}</div>
              )}
              <div className="chem-operator">{tok}</div>
            </div>
          );
          arrowRendered = true;
        } else {
          elements.push(
            <div key={`op-${index}`} className="chem-operator">
              {tok}
            </div>
          );
        }
      } else {
        elements.push(
          <div key={`op-${index}`} className="chem-operator">
            {tok}
          </div>
        );
      }
    });

    return elements;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/advanced-challenge" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🔬</span>
                Suy Luận Phản Ứng
              </h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
        <ResumeDialog
          show={showResumeDialog}
          onResume={() => startGame(false)}
          onRestart={() => startGame(true)}
          progressInfo={{
            current: (getProgress()?.level || 0) + 1,
            total: levels.length,
            score: getProgress()?.completedLevels || 0
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/advanced-challenge" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🔬</span>
              Suy Luận Phản Ứng
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!gameStarted ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 text-center">
            <p>Đang tải...</p>
          </div>
        ) : !currentLevel ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 text-center">
            <p>Loading...</p>
          </div>
        ) : (
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-lg">Màn chơi: {level + 1}/{levels.length}</span>
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {currentLevel.title}
              </div>
            </div>
            {gameCompleted && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Trophy className="w-8 h-8" />
                <span className="font-bold">Hoàn thành!</span>
              </div>
            )}
          </div>

          {/* Game Layout - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bank - Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  🏦 Ngân hàng chất
                </h3>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[120px]">
                  {bankItems.map((formula, index) => (
                    <DragTile
                      key={`${formula}-${index}`}
                      formula={formula}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedFormula === formula}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Kéo công thức vào ô trống bên phải
                </p>
              </div>
            </div>

            {/* Equation - Right Column */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                {/* Level Navigation */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-200">
                  <button 
                    className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    disabled={level === 0 || gameCompleted}
                    onClick={goToPrevLevel}
                  >
                    ← Trước
                  </button>
                  <span className="font-bold text-gray-700">Cấp {level + 1}</span>
                  <button 
                    className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    disabled={level === levels.length - 1 || gameCompleted}
                    onClick={goToNextLevel}
                  >
                    Sau →
                  </button>
                </div>

                {/* Requirements */}
                <h3 className="font-bold text-base mb-2">📋 Yêu cầu (Mô tả tính chất):</h3>
                <ul className="mb-4 space-y-1 text-sm text-gray-700">
                  {currentLevel.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>

                {/* Equation Display */}
                <div className="bg-white rounded-lg p-4 mb-4 shadow-inner">
                  <div className="chem-equation">
                    {renderEquation()}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3 mb-3">
                  <button 
                    onClick={validate}
                    disabled={gameCompleted}
                    className={`flex-1 py-2.5 text-sm rounded-lg font-semibold transition-colors ${
                      gameCompleted 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {gameCompleted ? 'Đã hoàn thành' : 'Kiểm tra'}
                  </button>
                </div>

                {/* Status */}
                {status && (
                  <div className={`text-center p-3 rounded-lg text-sm font-semibold ${
                    statusKind === 'success' ? 'bg-green-100 text-green-800' :
                    statusKind === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      <ResumeDialog
        show={showResumeDialog}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={{
          current: (getProgress()?.level || 0) + 1,
          total: levels.length,
          score: getProgress()?.completedLevels || 0
        }}
      />
    </div>
  );
}
