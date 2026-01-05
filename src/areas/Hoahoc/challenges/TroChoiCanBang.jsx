import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import periodicData from '../../../data/periodic.json';
import './TroChoiCanBang.css';

// Reactions - from simple to complex
const REACTIONS = [
  { reactants:[{formula:'H2',coeff:1},{formula:'O2',coeff:1}],products:[{formula:'H2O',coeff:1}] },
  { reactants:[{formula:'N2',coeff:1},{formula:'H2',coeff:3}],products:[{formula:'NH3',coeff:2}] },
  { reactants:[{formula:'CH4',coeff:1},{formula:'O2',coeff:2}],products:[{formula:'CO2',coeff:1},{formula:'H2O',coeff:2}] },
  { reactants:[{formula:'Fe',coeff:1},{formula:'O2',coeff:1}],products:[{formula:'Fe2O3',coeff:1}] },
  { reactants:[{formula:'Al',coeff:4},{formula:'O2',coeff:3}],products:[{formula:'Al2O3',coeff:2}] },
  { reactants:[{formula:'C3H8',coeff:1},{formula:'O2',coeff:5}],products:[{formula:'CO2',coeff:3},{formula:'H2O',coeff:4}] },
  { reactants:[{formula:'KClO3',coeff:2}],products:[{formula:'KCl',coeff:2},{formula:'O2',coeff:3}] },
  { reactants:[{formula:'Na2CO3',coeff:1},{formula:'HCl',coeff:2}],products:[{formula:'NaCl',coeff:2},{formula:'H2O',coeff:1},{formula:'CO2',coeff:1}] }
];

function parseFormula(formula) {
  const parts = [];
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  while((match = regex.exec(formula)) !== null) {
    const [, el, countStr] = match;
    parts.push({ element: el, count: parseInt(countStr || '1') });
  }
  return parts;
}

function calculateMolarMass(formula) {
  const parsed = parseFormula(formula);
  let total = 0;
  for(let {element, count} of parsed) {
    const data = periodicData[element];
    if(data && data.mass) total += data.mass * count;
  }
  return total;
}

function CoefficientControl({ value, onChange, disabled }) {
  return (
    <div className="coeff-control">
      <button onClick={()=>onChange(Math.max(1, value - 1))} disabled={disabled}>−</button>
      <input type="number" min="1" value={value} onChange={(e)=>onChange(Math.max(1,parseInt(e.target.value)||1))} disabled={disabled} />
      <button onClick={()=>onChange(value + 1)} disabled={disabled}>+</button>
    </div>
  );
}

export default function TroChoiCanBang(){
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('tro-choi-can-bang');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [coeffs, setCoeffs] = useState({});
  const [message, setMessage] = useState('Điều chỉnh hệ số để cân bằng phương trình!');

  const reaction = REACTIONS[currentLevel] || REACTIONS[0];

  // Initialize coefficients when level changes
  useEffect(() => {
    if (!reaction) return;
    const initialCoeffs = {};
    reaction.reactants.forEach((r, i) => { initialCoeffs[`r${i}`] = 1; });
    reaction.products.forEach((p, i) => { initialCoeffs[`p${i}`] = 1; });
    setCoeffs(initialCoeffs);
  }, [currentLevel]);

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
        setCurrentLevel(savedData.currentLevel || 0);
      }
      setGameStarted(true);
    }
  };

  const isBalanced = () => {
    const atoms = {};

    reaction.reactants.forEach((r, i) => {
      const coeff = coeffs[`r${i}`] || 1;
      const parsed = parseFormula(r.formula);
      parsed.forEach(({element, count}) => {
        atoms[element] = (atoms[element] || 0) + count * coeff;
      });
    });

    reaction.products.forEach((p, i) => {
      const coeff = coeffs[`p${i}`] || 1;
      const parsed = parseFormula(p.formula);
      parsed.forEach(({element, count}) => {
        atoms[element] = (atoms[element] || 0) - count * coeff;
      });
    });

    return Object.values(atoms).every(v => v === 0);
  };

  const getTotalMass = (side) => {
    if (side === 'reactants') {
      return reaction.reactants.reduce((sum, r, i) => {
        const coeff = coeffs[`r${i}`] || 1;
        const mass = calculateMolarMass(r.formula);
        return sum + coeff * mass;
      }, 0);
    } else {
      return reaction.products.reduce((sum, p, i) => {
        const coeff = coeffs[`p${i}`] || 1;
        const mass = calculateMolarMass(p.formula);
        return sum + coeff * mass;
      }, 0);
    }
  };

  const leftMass = getTotalMass('reactants');
  const rightMass = getTotalMass('products');
  const balanced = isBalanced();
  
  // Calculate tilt angle for visual feedback
  const massDiff = leftMass - rightMass;
  const tiltAngle = Math.max(-15, Math.min(15, massDiff / 20));

  const handleCheck = () => {
    if (gameCompleted) return;

    if (balanced) {
      if (currentLevel < REACTIONS.length - 1) {
        setMessage(`✅ Chính xác! Chuyển sang phản ứng tiếp theo...`);
        setTimeout(() => {
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel);
          const nextReaction = REACTIONS[nextLevel];
          const nextCoeffs = {};
          nextReaction.reactants.forEach((r, i) => { nextCoeffs[`r${i}`] = 1; });
          nextReaction.products.forEach((p, i) => { nextCoeffs[`p${i}`] = 1; });
          setCoeffs(nextCoeffs);
          setMessage('Điều chỉnh hệ số để cân bằng phương trình!');
          // Save progress
          saveProgress({ currentLevel: nextLevel });
        }, 2000);
      } else {
        setGameCompleted(true);
        clearProgress();
        setMessage('🎉 Chúc mừng! Bạn đã hoàn thành tất cả 8 phản ứng!');
      }
    } else {
      setMessage('❌ Chưa cân bằng. Kiểm tra lại số lượng nguyên tử mỗi loại!');
    }
  };

  const handleReset = () => {
    const resetCoeffs = {};
    reaction.reactants.forEach((r, i) => { resetCoeffs[`r${i}`] = 1; });
    reaction.products.forEach((p, i) => { resetCoeffs[`p${i}`] = 1; });
    setCoeffs(resetCoeffs);
    setMessage('Điều chỉnh hệ số để cân bằng phương trình!');
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/advanced-challenge" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">⚖️</span>
                Cân Bằng Phương Trình
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
            current: (getProgress()?.currentLevel || 0) + 1,
            total: REACTIONS.length,
            score: 0
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/advanced-challenge" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">⚖️</span>
              Cân Bằng Phương Trình
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!reaction ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 text-center">
            <p>Loading...</p>
          </div>
        ) : (
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-bold text-lg">Phản ứng: {currentLevel + 1}/{REACTIONS.length}</span>
              </div>
            </div>
            {gameCompleted && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Trophy className="w-8 h-8" />
                <span className="font-bold">Hoàn thành!</span>
              </div>
            )}
          </div>

          {/* Balance Scale Visualization */}
          <div className="scale-container mb-5">
            <div className="scale-base"></div>
            <div className="scale-beam" style={{ transform: `rotate(${tiltAngle}deg)` }}>
              <div className="scale-center"></div>
              
              {/* Left Pan (Reactants) */}
              <div className="scale-pan left">
                <div className="scale-chain"></div>
                <div className={`scale-plate ${balanced ? 'balanced' : leftMass > rightMass ? 'heavier' : ''}`}>
                  <div className="text-[10px] font-bold text-gray-700 mb-0.5">Chất phản ứng</div>
                  <div className="text-[9px] text-gray-600">{leftMass.toFixed(2)} g/mol</div>
                </div>
              </div>

              {/* Right Pan (Products) */}
              <div className="scale-pan right">
                <div className="scale-chain"></div>
                <div className={`scale-plate ${balanced ? 'balanced' : rightMass > leftMass ? 'heavier' : ''}`}>
                  <div className="text-[10px] font-bold text-gray-700 mb-0.5">Sản phẩm</div>
                  <div className="text-[9px] text-gray-600">{rightMass.toFixed(2)} g/mol</div>
                </div>
              </div>
            </div>
          </div>

          {/* Equation */}
          <div className="equation-display mb-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {/* Reactants */}
              {reaction.reactants.map((r, i) => (
                <React.Fragment key={`r${i}`}>
                  {i > 0 && <span className="text-lg font-bold text-gray-700">+</span>}
                  <div className="species-card">
                    <CoefficientControl 
                      value={coeffs[`r${i}`] || 1} 
                      onChange={(v) => setCoeffs({...coeffs, [`r${i}`]: v})}
                      disabled={gameCompleted}
                    />
                    <div className="formula">{r.formula}</div>
                    <div className="molar-mass">
                      {calculateMolarMass(r.formula).toFixed(2)} g/mol
                    </div>
                  </div>
                </React.Fragment>
              ))}

              <span className="text-xl font-bold text-gray-700 mx-2">→</span>

              {/* Products */}
              {reaction.products.map((p, i) => (
                <React.Fragment key={`p${i}`}>
                  {i > 0 && <span className="text-lg font-bold text-gray-700">+</span>}
                  <div className="species-card">
                    <CoefficientControl 
                      value={coeffs[`p${i}`] || 1} 
                      onChange={(v) => setCoeffs({...coeffs, [`p${i}`]: v})}
                      disabled={gameCompleted}
                    />
                    <div className="formula">{p.formula}</div>
                    <div className="molar-mass">
                      {calculateMolarMass(p.formula).toFixed(2)} g/mol
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2.5 justify-center mb-4">
            <button 
              onClick={handleCheck}
              disabled={gameCompleted}
              className={`px-5 py-2 text-sm rounded-lg font-semibold transition-colors ${
                gameCompleted 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {gameCompleted ? 'Hoàn thành' : 'Kiểm tra'}
            </button>
            
            {!gameCompleted && (
              <button 
                onClick={handleReset}
                className="px-5 py-2 text-sm rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>

          {/* Message */}
          <div className={`text-center p-2.5 rounded-lg text-xs ${
            message.includes('✅') ? 'bg-green-100 text-green-800' :
            message.includes('❌') ? 'bg-red-100 text-red-800' :
            message.includes('🎉') ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        </div>
        )}
      </div>

      <ResumeDialog
        show={showResumeDialog}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={{
          current: (getProgress()?.currentLevel || 0) + 1,
          total: REACTIONS.length,
          score: 0
        }}
      />
    </div>
  );
}
