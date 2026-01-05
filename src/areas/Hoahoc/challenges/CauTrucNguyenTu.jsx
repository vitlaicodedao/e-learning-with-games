import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Atom, Zap, Circle } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './CauTrucNguyenTu.css';

const CauTrucNguyenTu = () => {
  const navigate = useNavigate();
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('cau-truc-nguyen-tu');
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [userInputs, setUserInputs] = useState({
    protons: '',
    neutrons: '',
    electrons: '',
    massNumber: '',
    atomicNumber: '',
    charge: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Kiểm tra tiến trình khi component mount
  useEffect(() => {
    if (hasProgress && !gameStarted && !showResults) {
      setShowResumeDialog(true);
    }
  }, []);

  // Danh sách thử thách về cấu trúc nguyên tử
  const challenges = [
    {
      id: 1,
      title: "Nguyên tử Hydro (H)",
      difficulty: "Dễ",
      points: 20,
      element: {
        name: "Hydro",
        symbol: "H",
        atomicNumber: 1,
        massNumber: 1,
        protons: 1,
        neutrons: 0,
        electrons: 1,
        charge: 0
      },
      question: "Xác định số hạt trong nguyên tử Hydro (¹H)",
      hint: "Số proton = Số electron = Số hiệu nguyên tử. Số neutron = Số khối - Số proton",
      visualization: true
    },
    {
      id: 2,
      title: "Nguyên tử Carbon (C)",
      difficulty: "Dễ",
      points: 20,
      element: {
        name: "Carbon",
        symbol: "C",
        atomicNumber: 6,
        massNumber: 12,
        protons: 6,
        neutrons: 6,
        electrons: 6,
        charge: 0
      },
      question: "Xác định số hạt trong nguyên tử Carbon (¹²C)",
      hint: "¹²C có số khối = 12, số hiệu = 6",
      visualization: true
    },
    {
      id: 3,
      title: "Nguyên tử Oxygen (O)",
      difficulty: "Dễ",
      points: 20,
      element: {
        name: "Oxygen",
        symbol: "O",
        atomicNumber: 8,
        massNumber: 16,
        protons: 8,
        neutrons: 8,
        electrons: 8,
        charge: 0
      },
      question: "Xác định số hạt trong nguyên tử Oxygen (¹⁶O)",
      hint: "Số neutron = 16 - 8 = 8",
      visualization: true
    },
    {
      id: 4,
      title: "Ion Na⁺",
      difficulty: "Trung bình",
      points: 25,
      element: {
        name: "Natri",
        symbol: "Na",
        atomicNumber: 11,
        massNumber: 23,
        protons: 11,
        neutrons: 12,
        electrons: 10,
        charge: 1
      },
      question: "Xác định số hạt trong ion Na⁺ (²³Na⁺)",
      hint: "Ion Na⁺ mất 1 electron → số electron = 11 - 1 = 10",
      visualization: true
    },
    {
      id: 5,
      title: "Ion Cl⁻",
      difficulty: "Trung bình",
      points: 25,
      element: {
        name: "Clo",
        symbol: "Cl",
        atomicNumber: 17,
        massNumber: 35,
        protons: 17,
        neutrons: 18,
        electrons: 18,
        charge: -1
      },
      question: "Xác định số hạt trong ion Cl⁻ (³⁵Cl⁻)",
      hint: "Ion Cl⁻ nhận thêm 1 electron → số electron = 17 + 1 = 18",
      visualization: true
    },
    {
      id: 6,
      title: "Đồng vị Carbon-14",
      difficulty: "Trung bình",
      points: 25,
      element: {
        name: "Carbon-14",
        symbol: "C",
        atomicNumber: 6,
        massNumber: 14,
        protons: 6,
        neutrons: 8,
        electrons: 6,
        charge: 0
      },
      question: "Xác định số hạt trong đồng vị Carbon-14 (¹⁴C)",
      hint: "¹⁴C và ¹²C có cùng số proton (6) nhưng khác số neutron. ¹⁴C có 8 neutron",
      visualization: true,
      isIsotope: true,
      compareWith: {
        name: "Carbon-12",
        massNumber: 12,
        neutrons: 6
      }
    },
    {
      id: 7,
      title: "Ion Al³⁺",
      difficulty: "Trung bình",
      points: 25,
      element: {
        name: "Nhôm",
        symbol: "Al",
        atomicNumber: 13,
        massNumber: 27,
        protons: 13,
        neutrons: 14,
        electrons: 10,
        charge: 3
      },
      question: "Xác định số hạt trong ion Al³⁺ (²⁷Al³⁺)",
      hint: "Ion Al³⁺ mất 3 electron → số electron = 13 - 3 = 10",
      visualization: true
    },
    {
      id: 8,
      title: "Ion O²⁻",
      difficulty: "Khó",
      points: 30,
      element: {
        name: "Oxygen",
        symbol: "O",
        atomicNumber: 8,
        massNumber: 16,
        protons: 8,
        neutrons: 8,
        electrons: 10,
        charge: -2
      },
      question: "Xác định số hạt trong ion O²⁻ (¹⁶O²⁻)",
      hint: "Ion O²⁻ nhận thêm 2 electron → số electron = 8 + 2 = 10",
      visualization: true
    },
    {
      id: 9,
      title: "Đồng vị Uranium-235",
      difficulty: "Khó",
      points: 30,
      element: {
        name: "Uranium-235",
        symbol: "U",
        atomicNumber: 92,
        massNumber: 235,
        protons: 92,
        neutrons: 143,
        electrons: 92,
        charge: 0
      },
      question: "Xác định số hạt trong đồng vị Uranium-235 (²³⁵U)",
      hint: "²³⁵U có 92 proton và 235 - 92 = 143 neutron",
      visualization: true,
      isIsotope: true,
      compareWith: {
        name: "Uranium-238",
        massNumber: 238,
        neutrons: 146
      }
    },
    {
      id: 10,
      title: "Ion Fe³⁺",
      difficulty: "Khó",
      points: 35,
      element: {
        name: "Sắt",
        symbol: "Fe",
        atomicNumber: 26,
        massNumber: 56,
        protons: 26,
        neutrons: 30,
        electrons: 23,
        charge: 3
      },
      question: "Xác định số hạt trong ion Fe³⁺ (⁵⁶Fe³⁺)",
      hint: "Ion Fe³⁺ mất 3 electron. Tính: số neutron = 56 - 26 = 30, số electron = 26 - 3 = 23",
      visualization: true
    }
  ];

  const currentQ = challenges[currentChallenge];

  // Start or resume game
  const startGame = (fromBeginning = false) => {
    if (fromBeginning) {
      clearProgress();
      setCurrentChallenge(0);
      setScore(0);
      setGameStarted(true);
      setShowResumeDialog(false);
    } else {
      const saved = getProgress();
      if (saved) {
        setCurrentChallenge(saved.currentChallenge);
        setScore(saved.score);
        setGameStarted(true);
        setShowResumeDialog(false);
      } else {
        startGame(true);
      }
    }
    setUserInputs({
      protons: '',
      neutrons: '',
      electrons: '',
      massNumber: '',
      atomicNumber: '',
      charge: ''
    });
    setIsSubmitted(false);
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check answer
  const checkAnswer = () => {
    let correct = true;
    const element = currentQ.element;

    if (parseInt(userInputs.protons) !== element.protons) correct = false;
    if (parseInt(userInputs.neutrons) !== element.neutrons) correct = false;
    if (parseInt(userInputs.electrons) !== element.electrons) correct = false;

    if (correct) {
      setScore(score + currentQ.points);
    }
    setIsSubmitted(true);
  };

  // Next challenge
  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      const nextIndex = currentChallenge + 1;
      setCurrentChallenge(nextIndex);
      setUserInputs({
        protons: '',
        neutrons: '',
        electrons: '',
        massNumber: '',
        atomicNumber: '',
        charge: ''
      });
      setIsSubmitted(false);
      
      // Lưu tiến trình
      saveProgress({
        currentChallenge: nextIndex,
        score
      });
    } else {
      setShowResults(true);
      clearProgress(); // Xóa tiến trình khi hoàn thành
    }
  };

  // Previous challenge
  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1);
      setUserInputs({
        protons: '',
        neutrons: '',
        electrons: '',
        massNumber: '',
        atomicNumber: '',
        charge: ''
      });
      setIsSubmitted(false);
    }
  };

  // Render atom visualization
  const renderAtomVisualization = () => {
    const element = currentQ.element;
    
    // Tính toán vị trí random cho các hạt trong hạt nhân
    const generateParticlePositions = (count, maxDisplay = 30) => {
      const displayCount = Math.min(count, maxDisplay);
      const positions = [];
      const nucleusRadius = 24; // Giảm từ 28 xuống 24
      const particleSize = 5; // Giảm từ 6 xuống 5
      
      for (let i = 0; i < displayCount; i++) {
        let x, y, valid;
        let attempts = 0;
        
        do {
          // Random vị trí trong vòng tròn
          const angle = Math.random() * 2 * Math.PI;
          const r = Math.sqrt(Math.random()) * (nucleusRadius - particleSize);
          x = r * Math.cos(angle);
          y = r * Math.sin(angle);
          
          // Kiểm tra khoảng cách với các hạt khác
          valid = positions.every(pos => {
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            return dist >= particleSize * 1.5; // Khoảng cách tối thiểu
          });
          
          attempts++;
        } while (!valid && attempts < 50);
        
        if (valid || attempts >= 50) {
          positions.push({ x, y });
        }
      }
      
      return positions;
    };
    
    const protonPositions = generateParticlePositions(element.protons);
    const neutronPositions = generateParticlePositions(element.neutrons);
    
    return (
      <div className="atom-visualization">
        {/* Nucleus */}
        <div className="nucleus">
          <div className="nucleus-label">Hạt nhân</div>
          
          {/* Protons với vị trí random */}
          {protonPositions.map((pos, i) => (
            <div 
              key={`p-${i}`} 
              className="particle proton" 
              title="Proton (+)"
              style={{
                position: 'absolute',
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              p⁺
            </div>
          ))}
          
          {/* Neutrons với vị trí random */}
          {neutronPositions.map((pos, i) => (
            <div 
              key={`n-${i}`} 
              className="particle neutron" 
              title="Neutron"
              style={{
                position: 'absolute',
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              n
            </div>
          ))}
          
          {/* Hiển thị số lượng nếu có nhiều hạt */}
          {element.protons > 30 && (
            <div className="particle-count proton-count">
              {element.protons} p⁺
            </div>
          )}
          {element.neutrons > 30 && (
            <div className="particle-count neutron-count">
              {element.neutrons} n
            </div>
          )}
        </div>

        {/* Electron shells */}
        <div className="electron-shells">
          {(() => {
            // Tính phân bố electron đúng theo quy tắc 2n²
            const shellCapacities = [2, 8, 18, 32]; // Lớp 1, 2, 3, 4
            let remainingElectrons = element.electrons;
            const electronDistribution = [];
            
            for (let i = 0; i < 4 && remainingElectrons > 0; i++) {
              const electronsInThisShell = Math.min(remainingElectrons, shellCapacities[i]);
              if (electronsInThisShell > 0) {
                electronDistribution.push({
                  shellIndex: i,
                  count: electronsInThisShell
                });
                remainingElectrons -= electronsInThisShell;
              }
            }
            
            return electronDistribution.map(({ shellIndex, count }) => (
              <div 
                key={shellIndex} 
                className={`shell shell-${shellIndex + 1}`}
                style={{
                  width: `${115 + shellIndex * 46}px`,
                  height: `${115 + shellIndex * 46}px`
                }}
              >
                {Array(count).fill(0).map((_, i) => {
                  const angle = (360 / count) * i;
                  const radius = 57.5 + shellIndex * 23;
                  // duration slightly varies by shell so outer shells rotate slower
                  const duration = 8 + shellIndex * 3;
                  return (
                    <div
                      key={`e-${shellIndex}-${i}`}
                      className="electron"
                      style={{
                        // CSS custom properties used by CSS keyframes
                        '--angle': `${angle}deg`,
                        '--radius': `${radius}px`,
                        '--duration': `${duration}s`,
                        '--delay': `${i * 0.1}s`
                      }}
                      title="Electron (-)"
                    >
                      e⁻
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>

        {/* Element info */}
        <div className="element-info-display">
          <div className="element-symbol">{element.symbol}</div>
          <div className="element-notation">
            <sup>{element.massNumber}</sup>
            <span>{element.symbol}</span>
            <sup>{element.charge !== 0 ? (element.charge > 0 ? `${element.charge}+` : `${Math.abs(element.charge)}-`) : ''}</sup>
          </div>
        </div>
      </div>
    );
  };

  // Results Modal
  if (showResults) {
    return (
      <div className="cau-truc-nguyen-tu-container">
        <div className="results-modal-overlay">
          <div className="results-modal">
            <div className="trophy-icon">
              <Trophy size={80} color="#ffd700" />
            </div>
            <h2>🎉 Hoàn thành!</h2>
            <div className="final-score">
              {score} / {challenges.reduce((sum, c) => sum + c.points, 0)} điểm
            </div>
            <div className="results-summary">
              <p>Bạn đã hoàn thành {challenges.length} thử thách về cấu trúc nguyên tử!</p>
              <p>Tỷ lệ: {((score / challenges.reduce((sum, c) => sum + c.points, 0)) * 100).toFixed(1)}%</p>
            </div>
            <button onClick={() => navigate('/advanced-challenge')} className="btn-return">
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cau-truc-nguyen-tu-container">
      {/* Header */}
      <div className="game-header">
        <Link to="/advanced-challenge" className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </Link>
        <h1 className="game-title">
          <Atom className="title-icon" />
          Cấu Trúc Nguyên Tử
        </h1>
        <div className="score-display">
          <Trophy size={20} />
          {score} điểm
        </div>
      </div>

      <div className="game-content">
        {/* Progress */}
        <div className="progress-section">
          <div className="challenge-info">
            <span className={`difficulty-badge ${currentQ.difficulty === 'Dễ' ? 'easy' : currentQ.difficulty === 'Trung bình' ? 'medium' : 'hard'}`}>
              {currentQ.difficulty}
            </span>
            <span className="challenge-counter">
              Thử thách {currentChallenge + 1}/{challenges.length}
            </span>
            <span className="points-badge">+{currentQ.points} điểm</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenge Title */}
        <div className="challenge-title">
          <h2>{currentQ.title}</h2>
          <p>{currentQ.question}</p>
          {currentQ.isIsotope && (
            <div className="isotope-note">
              ⚛️ Đây là đồng vị của {currentQ.element.symbol}. 
              So sánh với {currentQ.compareWith.name} ({currentQ.compareWith.massNumber}{currentQ.element.symbol}): 
              cùng số proton nhưng khác số neutron ({currentQ.compareWith.neutrons} neutron)
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="two-column-layout">
          {/* Left Column: Visualization */}
          <div className="left-column">
            {/* Atom Visualization */}
            {currentQ.visualization && (
              <div className="visualization-section-compact">
                {renderAtomVisualization()}
              </div>
            )}

            {/* Particle Summary */}
            <div className="particle-summary-compact">
              <div className="summary-item">
                <div className="summary-icon proton-icon">p⁺</div>
                <div className="summary-label">Proton</div>
                <div className="summary-value">{isSubmitted ? currentQ.element.protons : '?'}</div>
              </div>
              <div className="summary-item">
                <div className="summary-icon neutron-icon">n</div>
                <div className="summary-label">Neutron</div>
                <div className="summary-value">{isSubmitted ? currentQ.element.neutrons : '?'}</div>
              </div>
              <div className="summary-item">
                <div className="summary-icon electron-icon">e⁻</div>
                <div className="summary-label">Electron</div>
                <div className="summary-value">{isSubmitted ? currentQ.element.electrons : '?'}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Input Form */}
          <div className="right-column">
            {/* Input Section */}
            <div className="input-section-compact">
              <h3>Nhập số hạt:</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor={`protons-${currentChallenge}`}>
                    <span className="particle-badge proton-badge">p⁺</span>
                    Số Proton:
                  </label>
                  <input
                    id={`protons-${currentChallenge}`}
                    aria-label={`Số proton cho thử thách ${currentChallenge + 1}`}
                    placeholder="Nhập số proton"
                    type="number"
                    min="0"
                    value={userInputs.protons}
                    onChange={(e) => handleInputChange('protons', e.target.value)}
                    disabled={isSubmitted}
                    className={isSubmitted ? (parseInt(userInputs.protons) === currentQ.element.protons ? 'correct' : 'incorrect') : ''}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor={`neutrons-${currentChallenge}`}>
                    <span className="particle-badge neutron-badge">n</span>
                    Số Neutron:
                  </label>
                  <input
                    id={`neutrons-${currentChallenge}`}
                    aria-label={`Số neutron cho thử thách ${currentChallenge + 1}`}
                    placeholder="Nhập số neutron"
                    type="number"
                    min="0"
                    value={userInputs.neutrons}
                    onChange={(e) => handleInputChange('neutrons', e.target.value)}
                    disabled={isSubmitted}
                    className={isSubmitted ? (parseInt(userInputs.neutrons) === currentQ.element.neutrons ? 'correct' : 'incorrect') : ''}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor={`electrons-${currentChallenge}`}>
                    <span className="particle-badge electron-badge">e⁻</span>
                    Số Electron:
                  </label>
                  <input
                    id={`electrons-${currentChallenge}`}
                    aria-label={`Số electron cho thử thách ${currentChallenge + 1}`}
                    placeholder="Nhập số electron"
                    type="number"
                    min="0"
                    value={userInputs.electrons}
                    onChange={(e) => handleInputChange('electrons', e.target.value)}
                    disabled={isSubmitted}
                    className={isSubmitted ? (parseInt(userInputs.electrons) === currentQ.element.electrons ? 'correct' : 'incorrect') : ''}
                  />
                </div>
              </div>

              {/* Formulas */}
              <div className="formulas-section">
                <h4>💡 Công thức:</h4>
                <div className="formula-list">
                  <div className="formula-item">
                    <strong>Số khối (A):</strong> A = p + n = {currentQ.element.massNumber}
                  </div>
                  <div className="formula-item">
                    <strong>Số hiệu nguyên tử (Z):</strong> Z = p = {currentQ.element.atomicNumber}
                  </div>
                  <div className="formula-item">
                    <strong>Nguyên tử trung hòa:</strong> p = e
                  </div>
                  <div className="formula-item">
                    <strong>Ion:</strong> e = p - điện tích ion
                  </div>
                </div>
              </div>

              {/* Hint */}
              {!isSubmitted && (
                <div className="hint-section">
                  <strong>Gợi ý:</strong> {currentQ.hint}
                </div>
              )}

              {/* Answer feedback */}
              {isSubmitted && (
                <div className="answer-feedback">
                  <h4>✅ Đáp án đúng:</h4>
                  <div className="correct-answers">
                    <p>• Số Proton: <strong>{currentQ.element.protons}</strong></p>
                    <p>• Số Neutron: <strong>{currentQ.element.neutrons}</strong></p>
                    <p>• Số Electron: <strong>{currentQ.element.electrons}</strong></p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="button-section">
                {!isSubmitted ? (
                  <button 
                    onClick={checkAnswer} 
                    className="submit-btn"
                    disabled={!userInputs.protons || !userInputs.neutrons || !userInputs.electrons}
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <div className="navigation-buttons">
                    <button 
                      onClick={prevChallenge} 
                      className="btn-nav btn-prev"
                      disabled={currentChallenge === 0}
                    >
                      ← Trước
                    </button>
                    <button 
                      onClick={nextChallenge} 
                      className="btn-nav btn-next"
                    >
                      {currentChallenge === challenges.length - 1 ? 'Hoàn thành' : 'Tiếp theo →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Dialog */}
      <ResumeDialog
        show={showResumeDialog && !gameStarted}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={getProgress() ? {
          current: getProgress().currentChallenge + 1,
          total: challenges.length,
          score: getProgress().score
        } : null}
      />
    </div>
  );
};

export default CauTrucNguyenTu;
