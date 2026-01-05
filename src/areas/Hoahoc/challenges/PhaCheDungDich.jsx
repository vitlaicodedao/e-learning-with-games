import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Lightbulb, Beaker, Droplet, FlaskConical, Plus, Minus, RotateCcw } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './PhaCheDungDich.css';

// Dữ liệu về các chất tan
const solutes = {
  'drink-mix': { 
    name: 'Nước ép trái cây', 
    formula: 'C₆H₁₂O₆', 
    color: '#ff1744',
    saturatedConcentration: 5.000,
    molarMass: 180 // g/mol
  },
  'cobalt-nitrate': { 
    name: 'Coban(II) nitrat', 
    formula: 'Co(NO₃)₂', 
    color: '#ff69b4',
    saturatedConcentration: 5.64,
    molarMass: 183
  },
  'cobalt-chloride': { 
    name: 'Coban(II) clorua', 
    formula: 'CoCl₂', 
    color: '#ff1493',
    saturatedConcentration: 4.35,
    molarMass: 130
  },
  'potassium-dichromate': { 
    name: 'Kali dicromat', 
    formula: 'K₂Cr₂O₇', 
    color: '#ff6600',
    saturatedConcentration: 0.51,
    molarMass: 294
  },
  'gold-chloride': { 
    name: 'Vàng(III) clorua', 
    formula: 'AuCl₃', 
    color: '#ffd700',
    saturatedConcentration: 0.84,
    molarMass: 303
  },
  'potassium-chromate': { 
    name: 'Kali cromat', 
    formula: 'K₂CrO₄', 
    color: '#ffeb3b',
    saturatedConcentration: 3.35,
    molarMass: 194
  },
  'nickel-chloride': { 
    name: 'Niken(II) clorua', 
    formula: 'NiCl₂', 
    color: '#4caf50',
    saturatedConcentration: 5.20,
    molarMass: 130
  },
  'copper-sulfate': { 
    name: 'Đồng(II) sunfat', 
    formula: 'CuSO₄', 
    color: '#2196f3',
    saturatedConcentration: 1.40,
    molarMass: 160
  },
  'potassium-permanganate': { 
    name: 'Kali pemanganat', 
    formula: 'KMnO₄', 
    color: '#9c27b0',
    saturatedConcentration: 0.56,
    molarMass: 158
  }
};

// Các câu hỏi thử thách
const challenges = [
  {
    id: 1,
    level: 1,
    type: 'find-concentration',
    title: 'Tính nồng độ mol',
    instruction: 'Hòa tan 0.5 mol NaCl vào 1 lít nước. Tính nồng độ mol của dung dịch?',
    solute: 'drink-mix',
    targetMoles: 0.5,
    targetVolume: 1.0,
    targetConcentration: 0.5,
    tolerance: 0.05,
    points: 10,
    hint: 'Công thức: C = n/V (mol/lít)'
  },
  {
    id: 2,
    level: 1,
    type: 'find-concentration',
    title: 'Tính nồng độ mol',
    instruction: 'Hòa tan 2 mol glucose vào 0.5 lít nước. Nồng độ mol là bao nhiêu?',
    solute: 'drink-mix',
    targetMoles: 2.0,
    targetVolume: 0.5,
    targetConcentration: 4.0,
    tolerance: 0.1,
    points: 10,
    hint: 'C = n/V = 2/0.5 = ?'
  },
  {
    id: 3,
    level: 1,
    type: 'find-moles',
    title: 'Tính số mol chất tan',
    instruction: 'Pha chế 2 lít dung dịch CuSO₄ 0.3M. Cần bao nhiêu mol CuSO₄?',
    solute: 'copper-sulfate',
    targetMoles: 0.6,
    targetVolume: 2.0,
    targetConcentration: 0.3,
    tolerance: 0.05,
    points: 12,
    hint: 'Công thức: n = C × V'
  },
  {
    id: 4,
    level: 1,
    type: 'find-volume',
    title: 'Tính thể tích dung dịch',
    instruction: 'Hòa tan 1.5 mol NaOH để được dung dịch 3M. Tính thể tích dung dịch?',
    solute: 'nickel-chloride',
    targetMoles: 1.5,
    targetVolume: 0.5,
    targetConcentration: 3.0,
    tolerance: 0.05,
    points: 12,
    hint: 'Công thức: V = n/C'
  },
  {
    id: 5,
    level: 2,
    type: 'dilution',
    title: 'Pha loãng dung dịch',
    instruction: 'Có 100ml dung dịch H₂SO₄ 2M. Thêm nước để được dung dịch 0.5M. Tính thể tích nước cần thêm?',
    solute: 'potassium-dichromate',
    initialVolume: 0.1,
    initialConcentration: 2.0,
    targetConcentration: 0.5,
    targetVolume: 0.4,
    tolerance: 0.05,
    points: 15,
    hint: 'C₁V₁ = C₂V₂, sau đó tính V_nước = V₂ - V₁'
  },
  {
    id: 6,
    level: 2,
    type: 'dilution',
    title: 'Pha loãng dung dịch',
    instruction: 'Có 200ml dung dịch NaCl 3M. Pha loãng thành 1.5M. Thể tích dung dịch sau pha loãng?',
    solute: 'cobalt-chloride',
    initialVolume: 0.2,
    initialConcentration: 3.0,
    targetConcentration: 1.5,
    targetVolume: 0.4,
    tolerance: 0.05,
    points: 15,
    hint: 'Sử dụng: C₁V₁ = C₂V₂'
  },
  {
    id: 7,
    level: 2,
    type: 'mass-calculation',
    title: 'Tính khối lượng chất tan',
    instruction: 'Pha 500ml dung dịch KMnO₄ 0.2M. Tính khối lượng KMnO₄ cần dùng? (M_KMnO₄ = 158 g/mol)',
    solute: 'potassium-permanganate',
    targetVolume: 0.5,
    targetConcentration: 0.2,
    molarMass: 158,
    targetMass: 15.8,
    tolerance: 1.0,
    points: 18,
    hint: 'Tính n = C×V, sau đó m = n×M'
  },
  {
    id: 8,
    level: 2,
    type: 'mass-calculation',
    title: 'Tính khối lượng chất tan',
    instruction: 'Pha 250ml dung dịch CuSO₄ 0.4M. Cần bao nhiêu gam CuSO₄? (M_CuSO₄ = 160 g/mol)',
    solute: 'copper-sulfate',
    targetVolume: 0.25,
    targetConcentration: 0.4,
    molarMass: 160,
    targetMass: 16.0,
    tolerance: 1.0,
    points: 18,
    hint: 'n = C×V = 0.4×0.25, m = n×160'
  },
  {
    id: 9,
    level: 3,
    type: 'mixing',
    title: 'Trộn dung dịch',
    instruction: 'Trộn 100ml dung dịch NaCl 2M với 200ml dung dịch NaCl 1M. Tính nồng độ mol của dung dịch sau khi trộn?',
    solute: 'nickel-chloride',
    solution1: { volume: 0.1, concentration: 2.0 },
    solution2: { volume: 0.2, concentration: 1.0 },
    targetConcentration: 1.333,
    tolerance: 0.05,
    points: 20,
    hint: 'C = (C₁V₁ + C₂V₂)/(V₁ + V₂)'
  },
  {
    id: 10,
    level: 3,
    type: 'mixing',
    title: 'Trộn dung dịch',
    instruction: 'Trộn 150ml dung dịch H₂SO₄ 3M với 350ml dung dịch H₂SO₄ 1M. Nồng độ mol sau khi trộn?',
    solute: 'gold-chloride',
    solution1: { volume: 0.15, concentration: 3.0 },
    solution2: { volume: 0.35, concentration: 1.0 },
    targetConcentration: 1.6,
    tolerance: 0.05,
    points: 20,
    hint: 'Tổng số mol = n₁ + n₂, V_tổng = V₁ + V₂'
  },
  {
    id: 11,
    level: 3,
    type: 'complex',
    title: 'Bài tập tổng hợp',
    instruction: 'Hòa tan 23.4g NaCl (M=58.5 g/mol) vào nước được 400ml dung dịch. Tính nồng độ mol?',
    solute: 'potassium-chromate',
    targetMass: 23.4,
    molarMass: 58.5,
    targetVolume: 0.4,
    targetConcentration: 1.0,
    tolerance: 0.05,
    points: 25,
    hint: 'Tính n = m/M, sau đó C = n/V'
  },
  {
    id: 12,
    level: 3,
    type: 'complex',
    title: 'Bài tập tổng hợp',
    instruction: 'Có 50ml dd H₂SO₄ 4M. Thêm nước đến 200ml. Sau đó lấy 100ml dd này pha loãng đến 500ml. Tính nồng độ cuối?',
    solute: 'cobalt-nitrate',
    targetConcentration: 0.2,
    tolerance: 0.05,
    points: 25,
    hint: 'Làm từng bước: C₁=4M→C₂=1M→C₃=0.2M'
  }
];

const PhaCheDungDich = () => {
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('pha-che-dung-dich');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  
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
        setCurrentChallengeIndex(savedData.currentChallengeIndex || 0);
        setScore(savedData.score || 0);
        setTotalScore(savedData.totalScore || 0);
        setCompletedChallenges(savedData.completedChallenges || []);
      }
      setGameStarted(true);
    }
  };
  
  // Lab states
  const [moles, setMoles] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [concentration, setConcentration] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showValues, setShowValues] = useState(false);
  
  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];
  const currentSolute = solutes[currentChallenge?.solute] || solutes['drink-mix'];

  // Tính nồng độ khi moles hoặc volume thay đổi
  useEffect(() => {
    if (volume > 0 && currentSolute) {
      const newConcentration = moles / volume;
      setConcentration(Math.min(newConcentration, currentSolute.saturatedConcentration));
    } else {
      setConcentration(0);
    }
  }, [moles, volume, currentSolute]);

  // Reset khi chuyển câu hỏi
  useEffect(() => {
    setMoles(0);
    setVolume(0.5);
    setConcentration(0);
    setUserAnswer('');
    setShowHint(false);
    setShowResult(false);
    setShowValues(false);
  }, [currentChallengeIndex]);

  // Tăng/giảm số mol
  const adjustMoles = (delta) => {
    const newMoles = Math.max(0, Math.min(moles + delta, 10));
    setMoles(parseFloat(newMoles.toFixed(2)));
  };

  // Tăng/giảm thể tích
  const adjustVolume = (delta) => {
    const newVolume = Math.max(0.1, Math.min(volume + delta, 5));
    setVolume(parseFloat(newVolume.toFixed(2)));
  };

  // Kiểm tra đáp án
  const checkAnswer = () => {
    const answer = parseFloat(userAnswer);
    if (isNaN(answer)) {
      alert('Vui lòng nhập một số hợp lệ!');
      return;
    }

    let correct = false;
    let targetValue = 0;

    switch (currentChallenge.type) {
      case 'find-concentration':
        targetValue = currentChallenge.targetConcentration;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      case 'find-moles':
        targetValue = currentChallenge.targetMoles;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      case 'find-volume':
        targetValue = currentChallenge.targetVolume;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      case 'dilution':
        targetValue = currentChallenge.targetVolume;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      case 'mass-calculation':
        targetValue = currentChallenge.targetMass;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      case 'mixing':
      case 'complex':
        targetValue = currentChallenge.targetConcentration;
        correct = Math.abs(answer - targetValue) <= currentChallenge.tolerance;
        break;
      default:
        break;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + currentChallenge.points);
      setTotalScore(totalScore + currentChallenge.points);
      setCompletedChallenges([...completedChallenges, currentChallenge.id]);
    }
  };

  // Chuyển câu tiếp theo
  const handleNext = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      const newIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(newIndex);
      // Save progress after moving to next challenge
      saveProgress({
        currentChallengeIndex: newIndex,
        score,
        totalScore,
        completedChallenges
      });
    } else {
      setGameCompleted(true);
      clearProgress();
    }
  };

  // Reset
  const handleReset = () => {
    setMoles(0);
    setVolume(0.5);
    setUserAnswer('');
    setShowResult(false);
    setShowHint(false);
  };

  const handleRestart = () => {
    clearProgress();
    setCurrentChallengeIndex(0);
    setScore(0);
    setTotalScore(0);
    setCompletedChallenges([]);
    setGameCompleted(false);
  };

  // Tính toán hiển thị
  const fillPercentage = Math.min((volume / 5) * 100, 100);
  const isSaturated = concentration >= currentSolute.saturatedConcentration;
  const opacity = Math.min(concentration / currentSolute.saturatedConcentration, 1);

  if (gameCompleted) {
    const maxScore = challenges.reduce((sum, c) => sum + c.points, 0);
    const percentage = ((totalScore / maxScore) * 100).toFixed(0);

    return (
      <div className="pha-che-container">
        <div className="result-modal show">
          <div className="result-content">
            <Trophy className="result-icon" size={80} />
            <h2>Hoàn thành xuất sắc!</h2>
            <div className="result-stats">
              <p className="result-score">Tổng điểm: {totalScore}/{maxScore}</p>
              <p className="result-accuracy">Hoàn thành: {percentage}%</p>
              <p className="result-correct">Đã hoàn thành: {completedChallenges.length}/{challenges.length} thử thách</p>
            </div>
            <div className="result-message">
              {percentage >= 90 && <p>🏆 Xuất sắc! Bạn là chuyên gia pha chế dung dịch!</p>}
              {percentage >= 70 && percentage < 90 && <p>👍 Tuyệt vời! Bạn đã nắm vững kiến thức về nồng độ!</p>}
              {percentage >= 50 && percentage < 70 && <p>💪 Khá tốt! Tiếp tục luyện tập để hoàn thiện!</p>}
              {percentage < 50 && <p>📚 Hãy ôn lại kiến thức về nồng độ mol nhé!</p>}
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

  if (!gameStarted) {
    return (
      <div className="pha-che-container">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/advanced-challenge" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                <FlaskConical className="inline mr-2" size={28} />
                Pha Chế Dung Dịch
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
            current: (getProgress()?.currentChallengeIndex || 0) + 1,
            total: challenges.length,
            score: getProgress()?.totalScore || 0
          }}
        />
      </div>
    );
  }

  return (
    <div className="pha-che-container">
      <div className="game-header-combined">
        <div className="header-top">
          <Link to="/advanced-challenge" className="back-button">
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </Link>
          <h1 className="game-title">
            <FlaskConical className="title-icon" />
            Pha Chế Dung Dịch - Nồng Độ Mol
          </h1>
          <div className="score-display">
            <Trophy size={20} />
            <span>{totalScore} điểm</span>
          </div>
        </div>
        
        <div className="progress-section-inline">
          <div className="challenge-info">
            <span className={`level-badge level-${currentChallenge.level}`}>
              Cấp độ {currentChallenge.level}
            </span>
            <span className="challenge-counter">
              Thử thách {currentChallengeIndex + 1}/{challenges.length}
            </span>
            <span className="points-badge">+{currentChallenge.points} điểm</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="game-layout">
          {/* Phần mô phỏng bên trái */}
          <div className="simulation-section">
            <div className="solute-info">
              <h3>Chất tan: {currentSolute.name}</h3>
              <p className="formula">{currentSolute.formula}</p>
              <p className="molar-mass">M = {currentSolute.molarMass} g/mol</p>
            </div>

            {/* Bình chứa */}
            <div className="beaker-container">
              <div className="beaker">
                <div 
                  className="solution"
                  style={{
                    height: `${fillPercentage}%`,
                    backgroundColor: currentSolute.color,
                    opacity: opacity * 0.7 + 0.3
                  }}
                >
                  {isSaturated && (
                    <div className="saturated-indicator">
                      <span>⚠️ Bão hòa</span>
                    </div>
                  )}
                </div>
                <div className="beaker-markings">
                  <div className="marking" style={{ bottom: '80%' }}>4L</div>
                  <div className="marking" style={{ bottom: '60%' }}>3L</div>
                  <div className="marking" style={{ bottom: '40%' }}>2L</div>
                  <div className="marking" style={{ bottom: '20%' }}>1L</div>
                </div>
              </div>
              
              {/* Hiển thị nồng độ */}
              <div className="concentration-display">
                <Beaker size={24} />
                <div className="concentration-value">
                  <span className="value">{concentration.toFixed(3)}</span>
                  <span className="unit">M</span>
                </div>
              </div>
            </div>

            {/* Điều khiển */}
            <div className="controls-panel">
              <div className="control-group">
                <label>
                  <Droplet size={16} />
                  Số mol chất tan (n)
                </label>
                <div className="control-buttons">
                  <button onClick={() => adjustMoles(-0.1)} className="btn-adjust">
                    <Minus size={16} />
                  </button>
                  <span className="control-value">{moles.toFixed(2)} mol</span>
                  <button onClick={() => adjustMoles(0.1)} className="btn-adjust">
                    <Plus size={16} />
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={moles}
                  onChange={(e) => setMoles(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="control-group">
                <label>
                  <Beaker size={16} />
                  Thể tích dung dịch (V)
                </label>
                <div className="control-buttons">
                  <button onClick={() => adjustVolume(-0.1)} className="btn-adjust">
                    <Minus size={16} />
                  </button>
                  <span className="control-value">{volume.toFixed(2)} L</span>
                  <button onClick={() => adjustVolume(0.1)} className="btn-adjust">
                    <Plus size={16} />
                  </button>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>
            </div>

            {/* Hiển thị giá trị chính xác */}
            <div className="values-display">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showValues}
                  onChange={(e) => setShowValues(e.target.checked)}
                />
                Hiển thị giá trị chính xác
              </label>
              {showValues && (
                <div className="exact-values">
                  <p>n = {moles.toFixed(3)} mol</p>
                  <p>V = {volume.toFixed(3)} L</p>
                  <p>C = {concentration.toFixed(3)} M</p>
                  <p className="formula-display">C = n/V</p>
                </div>
              )}
            </div>
          </div>

          {/* Phần câu hỏi bên phải */}
          <div className="challenge-section">
            <div className="challenge-card">
              <h2>{currentChallenge.title}</h2>
              <div className="challenge-instruction">
                <Target size={20} />
                <p>{currentChallenge.instruction}</p>
              </div>

              {/* Công thức tham khảo */}
              <div className="formulas-reference">
                <h4>📐 Công thức:</h4>
                <ul>
                  <li>Nồng độ mol: <code>C = n/V</code> (M)</li>
                  <li>Số mol: <code>n = C × V</code> (mol)</li>
                  <li>Thể tích: <code>V = n/C</code> (L)</li>
                  <li>Khối lượng: <code>m = n × M</code> (g)</li>
                  <li>Pha loãng: <code>C₁V₁ = C₂V₂</code></li>
                </ul>
              </div>

              {/* Nhập đáp án */}
              <div className="answer-input">
                <label>Đáp án của bạn:</label>
                <div className="input-group">
                  <input
                    type="number"
                    step="0.01"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập kết quả..."
                    disabled={showResult}
                  />
                  <span className="unit">
                    {currentChallenge.type === 'find-moles' ? 'mol' :
                     currentChallenge.type === 'find-volume' || currentChallenge.type === 'dilution' ? 'L' :
                     currentChallenge.type === 'mass-calculation' ? 'g' : 'M'}
                  </span>
                </div>
              </div>

              {/* Gợi ý */}
              {!showResult && (
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
                      <p>{currentChallenge.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Nút hành động */}
              <div className="action-buttons">
                <button onClick={handleReset} className="btn-reset">
                  <RotateCcw size={20} />
                  Làm lại
                </button>
                {!showResult && (
                  <button onClick={checkAnswer} className="btn-check">
                    Kiểm tra
                  </button>
                )}
              </div>

              {/* Kết quả */}
              {showResult && (
                <div className={`result-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? (
                    <>
                      <h3>✓ Chính xác!</h3>
                      <p>Bạn đã giải đúng bài toán!</p>
                      <p className="points-earned">+{currentChallenge.points} điểm</p>
                    </>
                  ) : (
                    <>
                      <h3>✗ Chưa đúng!</h3>
                      <p>Hãy kiểm tra lại cách tính nhé!</p>
                      <p className="hint-text">Xem lại công thức và đơn vị</p>
                    </>
                  )}
                  <button onClick={handleNext} className="btn-next">
                    {currentChallengeIndex < challenges.length - 1
                      ? 'Thử thách tiếp theo →'
                      : 'Hoàn thành'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ResumeDialog
        show={showResumeDialog}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={{
          current: (getProgress()?.currentChallengeIndex || 0) + 1,
          total: challenges.length,
          score: getProgress()?.totalScore || 0
        }}
      />
    </div>
  );
};

export default PhaCheDungDich;
