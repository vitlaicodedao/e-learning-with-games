import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Zap, Play, RotateCcw, Lightbulb } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './TinhOxiHoa.css';

const TinhOxiHoa = () => {
  const navigate = useNavigate();
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('tinh-oxi-hoa');
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (hasProgress && !gameStarted && !showResults) {
      setShowResumeDialog(true);
    }
  }, []);

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
    setUserAnswers({ q1: '', q2: '', q3: '' });
    setIsSubmitted(false);
    setShowHint(false);
  };

  const challenges = [
    {
      id: 1,
      title: 'Zn + CuSO₄ → ZnSO₄ + Cu',
      description: 'Kim loại Zn khử ion Cu²⁺',
      difficulty: 'Dễ',
      points: 20,
      oxidizer: {
        formula: 'Cu²⁺',
        name: 'Ion đồng',
        color: '#3b82f6',
        oxidationState: { before: '+2', after: '0' },
        electrons: 2
      },
      reducer: {
        formula: 'Zn',
        name: 'Kẽm',
        color: '#94a3b8',
        oxidationState: { before: '0', after: '+2' },
        electrons: 2
      },
      allCompounds: [
        { formula: 'Zn', name: 'Kẽm', color: '#94a3b8', shells: [2, 8, 18, 2], type: 'reactant' },
        { formula: 'CuSO₄', name: 'Đồng(II) sunfat', color: '#3b82f6', shells: [2, 8, 17], type: 'reactant' },
        { formula: 'ZnSO₄', name: 'Kẽm sunfat', color: '#e0e7ff', shells: [2, 8, 18], type: 'product' },
        { formula: 'Cu', name: 'Đồng', color: '#f97316', shells: [2, 8, 18, 1], type: 'product' }
      ],
      phenomenon: '🔵 Dung dịch CuSO₄ xanh lam nhạt dần, Cu đỏ bám trên Zn',
      hint: 'Zn đứng trước Cu trong dãy kim loại hoạt động → Zn khử được Cu²⁺',
      questions: [
        {
          id: 'q1',
          question: 'Chất khử trong phản ứng này là gì?',
          placeholder: 'Ví dụ: Zn, Cu, Fe...',
          correct: 'Zn'
        },
        {
          id: 'q2',
          question: 'Số electron trao đổi trong phản ứng?',
          placeholder: 'Nhập số (1, 2, 3...)',
          correct: '2',
          type: 'number'
        },
        {
          id: 'q3',
          question: 'Chất oxi hóa trong phản ứng là gì?',
          placeholder: 'Ví dụ: Cu²⁺, Fe³⁺...',
          correct: 'Cu²⁺'
        }
      ]
    },
    {
      id: 2,
      title: 'Fe + CuSO₄ → FeSO₄ + Cu',
      description: 'Sắt đẩy đồng ra khỏi muối',
      difficulty: 'Dễ',
      points: 20,
      oxidizer: {
        formula: 'Cu²⁺',
        name: 'Ion đồng',
        color: '#3b82f6',
        oxidationState: { before: '+2', after: '0' },
        electrons: 2
      },
      reducer: {
        formula: 'Fe',
        name: 'Sắt',
        color: '#71717a',
        oxidationState: { before: '0', after: '+2' },
        electrons: 2
      },
      allCompounds: [
        { formula: 'Fe', name: 'Sắt', color: '#71717a', shells: [2, 8, 14, 2], type: 'reactant' },
        { formula: 'CuSO₄', name: 'Đồng(II) sunfat', color: '#3b82f6', shells: [2, 8, 17], type: 'reactant' },
        { formula: 'FeSO₄', name: 'Sắt(II) sunfat', color: '#a8d5ba', shells: [2, 8, 14], type: 'product' },
        { formula: 'Cu', name: 'Đồng', color: '#f97316', shells: [2, 8, 18, 1], type: 'product' }
      ],
      phenomenon: '🟠 Dung dịch xanh nhạt dần, Cu đỏ bám trên Fe',
      hint: 'Fe hoạt động hơn Cu nên có thể khử Cu²⁺ thành Cu',
      questions: [
        {
          id: 'q1',
          question: 'Chất oxi hóa trong phản ứng là gì?',
          placeholder: 'Ví dụ: Cu²⁺, Fe³⁺...',
          correct: 'Cu²⁺'
        },
        {
          id: 'q2',
          question: 'Chất nào bị oxi hóa?',
          placeholder: 'Ví dụ: Fe, Cu...',
          correct: 'Fe'
        },
        {
          id: 'q3',
          question: 'Số electron trao đổi?',
          placeholder: 'Nhập số',
          correct: '2',
          type: 'number'
        }
      ]
    },
    {
      id: 3,
      title: '2HCl + Mg → MgCl₂ + H₂↑',
      description: 'Magie khử H⁺ tạo khí H₂',
      difficulty: 'Trung bình',
      points: 25,
      oxidizer: {
        formula: 'H⁺',
        name: 'Ion hidro',
        color: '#fbbf24',
        oxidationState: { before: '+1', after: '0' },
        electrons: 1
      },
      reducer: {
        formula: 'Mg',
        name: 'Magie',
        color: '#d1d5db',
        oxidationState: { before: '0', after: '+2' },
        electrons: 2
      },
      allCompounds: [
        { formula: 'HCl', name: 'Axit clohidric', color: '#fef3c7', shells: [1], type: 'reactant' },
        { formula: 'Mg', name: 'Magie', color: '#d1d5db', shells: [2, 8, 2], type: 'reactant' },
        { formula: 'MgCl₂', name: 'Magie clorua', color: '#e0e7ff', shells: [2, 8], type: 'product' },
        { formula: 'H₂', name: 'Khí hidro', color: '#bfdbfe', shells: [2], type: 'product' }
      ],
      phenomenon: '💨 Sủi bọt khí H₂ mạnh, Mg tan dần',
      hint: 'Mg là kim loại kiềm thổ, hoạt động mạnh với axit',
      questions: [
        {
          id: 'q1',
          question: 'Chất khử trong phản ứng?',
          placeholder: 'Ví dụ: Mg, H⁺...',
          correct: 'Mg'
        },
        {
          id: 'q2',
          question: 'Mg nhường bao nhiêu electron?',
          placeholder: 'Nhập số',
          correct: '2',
          type: 'number'
        },
        {
          id: 'q3',
          question: 'Chất oxi hóa là gì?',
          placeholder: 'Ví dụ: H⁺, Cl⁻...',
          correct: 'H⁺'
        }
      ]
    }
  ];

  const currentQ = challenges[currentChallenge];

  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const normalizeAnswer = (answer) => {
    return answer.trim().toLowerCase().replace(/\s+/g, '');
  };

  const checkAnswer = () => {
    let correctCount = 0;
    currentQ.questions.forEach(q => {
      const userAnswer = normalizeAnswer(userAnswers[q.id] || '');
      const correctAnswer = normalizeAnswer(q.correct);
      
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount === currentQ.questions.length) {
      setScore(score + currentQ.points);
    }
    setIsSubmitted(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      const nextIndex = currentChallenge + 1;
      setCurrentChallenge(nextIndex);
      setUserAnswers({ q1: '', q2: '', q3: '' });
      setIsSubmitted(false);
      setReactionProgress(0);
      setIsReacting(false);
      setShowHint(false);
      
      saveProgress({
        currentChallenge: nextIndex,
        score
      });
    } else {
      setShowResults(true);
      clearProgress();
    }
  };

  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1);
      setUserAnswers({ q1: '', q2: '', q3: '' });
      setIsSubmitted(false);
      setReactionProgress(0);
      setIsReacting(false);
      setShowHint(false);
    }
  };

  const startReaction = () => {
    setIsReacting(true);
    setReactionProgress(0);
    
    const interval = setInterval(() => {
      setReactionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReacting(false);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  };

  const resetReaction = () => {
    setReactionProgress(0);
    setIsReacting(false);
  };

  // Results Modal
  if (showResults) {
    return (
      <div className="tinh-oxi-hoa-container">
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
              <p>Bạn đã hoàn thành {challenges.length} thử thách về phản ứng oxi hóa khử!</p>
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
    <div className="tinh-oxi-hoa-container">
      {/* Header */}
      <div className="game-header">
        <Link to="/advanced-challenge" className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </Link>
        <h1 className="game-title">
          <Zap className="title-icon" />
          Tính Oxi Hóa - Khử
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
          <p>{currentQ.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="two-column-layout">
          {/* Left Column: Visualization */}
          <div className="left-column">
            {/* Reaction Visualization */}
            <div className="visualization-section-compact">
              {/* Phương trình phản ứng */}
              <div className="reaction-equation-display">
                <h3 className="equation-title">Phương trình phản ứng với cấu trúc electron</h3>
                
                <div className="equation-compounds">
                  {currentQ.allCompounds.map((compound, idx) => {
                    const isReactant = compound.type === 'reactant';
                    
                    return (
                      <React.Fragment key={`compound-${idx}`}>
                        {/* Dấu + trước chất thứ 2 (giữa 2 chất phản ứng) */}
                        {idx === 1 && (
                          <div className="equation-symbol plus">+</div>
                        )}
                        
                        {/* Compound với electron shells */}
                        <div className="compound-item">
                          <div className="compound-visual">
                            <div 
                              className="compound-nucleus"
                              style={{ 
                                backgroundColor: compound.color,
                                opacity: isReactant || reactionProgress >= 100 ? 1 : 0.3,
                                transform: (!isReactant && reactionProgress >= 100) ? 'scale(1.05)' : 'scale(1)'
                              }}
                            >
                              {compound.formula}
                            </div>
                            
                            {/* Electron Shells */}
                            {compound.shells.map((electronCount, shellIndex) => {
                              if (electronCount === 0) return null;
                              const shellSize = 50 + shellIndex * 18;
                              
                              return (
                                <div 
                                  key={`shell-${idx}-${shellIndex}`}
                                  className="compound-shell"
                                  style={{
                                    width: `${shellSize}px`,
                                    height: `${shellSize}px`,
                                    borderColor: compound.color,
                                    opacity: isReactant || reactionProgress >= 100 ? 0.5 : 0.2,
                                    animation: `rotate-shell ${12 + shellIndex * 4}s linear infinite ${isReactant ? '' : 'reverse'}`
                                  }}
                                >
                                  {Array(electronCount).fill(0).map((_, eIdx) => {
                                    const angle = (360 / electronCount) * eIdx;
                                    
                                    return (
                                      <div
                                        key={`e-${eIdx}`}
                                        className="compound-electron"
                                        style={{
                                          transform: `rotate(${angle}deg) translateX(${shellSize / 2}px)`,
                                          backgroundColor: isReactant ? '#3b82f6' : '#10b981',
                                          boxShadow: `0 0 5px ${isReactant ? '#3b82f6' : '#10b981'}`,
                                          opacity: isReactant || reactionProgress >= 100 ? 1 : 0.3
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="compound-info">
                            <div className="compound-name">{compound.name}</div>
                            <div className={`compound-type ${isReactant ? 'reactant' : 'product'}`}>
                              {isReactant ? 'Chất phản ứng' : 'Sản phẩm'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Mũi tên sau chất phản ứng cuối cùng (idx 1) */}
                        {idx === 1 && (
                          <div className="equation-symbol arrow">→</div>
                        )}
                        
                        {/* Dấu + trước chất sản phẩm thứ 2 (idx 2) */}
                        {idx === 2 && (
                          <div className="equation-symbol plus">+</div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="reaction-divider"></div>

              {/* Reaction Display - Chi tiết QUÁ TRÌNH OXI HÓA KHỬ */}
              <div className="reaction-detail-display">
                <h3 className="detail-title">Quá trình oxi hóa - khử electron</h3>
                
                <div className="redox-process">
                  {/* QUÁ TRÌNH OXI HÓA */}
                  <div className="redox-half-reaction oxidation">
                    <div className="half-reaction-header">
                      <span className="process-label oxidation-label">Quá trình OXI HÓA</span>
                    </div>
                    <div className="half-reaction-content">
                      <div className="species-change">
                        <span className="species-formula">{currentQ.reducer.formula}</span>
                        <span className="arrow">→</span>
                        <span className="species-formula">{currentQ.reducer.formula}<sup>{currentQ.reducer.oxidationState.after > 0 ? `${currentQ.reducer.oxidationState.after}+` : currentQ.reducer.oxidationState.after}</sup></span>
                        <span className="electron-transfer">+ {currentQ.reducer.electrons}e⁻</span>
                      </div>
                      <div className="oxidation-state-change">
                        Số oxi hóa: <strong>{currentQ.reducer.oxidationState.before}</strong> → <strong className="increased">{currentQ.reducer.oxidationState.after}</strong> (tăng)
                      </div>
                      <div className="process-description">
                        {currentQ.reducer.name} nhường {currentQ.reducer.electrons} electron
                      </div>
                    </div>
                  </div>

                  {/* MŨI TÊN ELECTRON */}
                  <div className="electron-transfer-arrow">
                    {reactionProgress > 20 && reactionProgress < 80 && (
                      <div className="electron-animation">
                        {Array(currentQ.reducer.electrons).fill(0).map((_, i) => (
                          <div
                            key={`e-flow-${i}`}
                            className="electron-particle"
                            style={{
                              animationDelay: `${i * 0.3}s`,
                              top: `${i * 12}px`
                            }}
                          >
                            e⁻
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="arrow-label">{currentQ.reducer.electrons}e⁻</div>
                  </div>

                  {/* QUÁ TRÌNH KHỬ */}
                  <div className="redox-half-reaction reduction">
                    <div className="half-reaction-header">
                      <span className="process-label reduction-label">Quá trình KHỬ</span>
                    </div>
                    <div className="half-reaction-content">
                      <div className="species-change">
                        <span className="species-formula">{currentQ.oxidizer.formula}</span>
                        <span className="electron-transfer">+ {currentQ.oxidizer.electrons}e⁻</span>
                        <span className="arrow">→</span>
                        <span className="species-formula">{currentQ.oxidizer.formula.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, '')}</span>
                      </div>
                      <div className="oxidation-state-change">
                        Số oxi hóa: <strong>{currentQ.oxidizer.oxidationState.before}</strong> → <strong className="decreased">{currentQ.oxidizer.oxidationState.after}</strong> (giảm)
                      </div>
                      <div className="process-description">
                        {currentQ.oxidizer.name} nhận {currentQ.oxidizer.electrons} electron
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reaction Progress */}
              <div className="reaction-progress-section">
                <div className="progress-label">
                  Tiến trình phản ứng: {reactionProgress}%
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${reactionProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Phenomenon Display */}
            {reactionProgress >= 100 && (
              <div className="particle-summary-compact">
                <div className="summary-item phenomenon-item">
                  <Zap className="phenomenon-icon" />
                  <div className="summary-label">Hiện tượng</div>
                  <div className="phenomenon-text">{currentQ.phenomenon}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Questions & Input */}
          <div className="right-column">
            <div className="input-section-compact">
              <h3>Trả lời câu hỏi</h3>

              {/* Questions Section */}
              <div className="questions-section">
                {currentQ.questions.map((question, qIndex) => (
                  <div key={question.id} className={`question-block q${qIndex + 1}`}>
                    <p className="question-title">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="answer-input-group">
                      <input
                        type={question.type || 'text'}
                        className={`answer-input ${isSubmitted ? (normalizeAnswer(userAnswers[question.id] || '') === normalizeAnswer(question.correct) ? 'correct' : 'incorrect') : ''}`}
                        placeholder={question.placeholder}
                        value={userAnswers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        disabled={isSubmitted}
                      />
                    </div>
                    {isSubmitted && (
                      <div className={`answer-result ${normalizeAnswer(userAnswers[question.id] || '') === normalizeAnswer(question.correct) ? 'correct' : 'incorrect'}`}>
                        {normalizeAnswer(userAnswers[question.id] || '') === normalizeAnswer(question.correct) 
                          ? '✅ Chính xác!' 
                          : `❌ Sai. Đáp án đúng: ${question.correct}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Hint Section */}
              {showHint && !isSubmitted && (
                <div className="hint-section">
                  <strong>💡 Gợi ý:</strong> {currentQ.hint}
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons-container">
                <button
                  onClick={startReaction}
                  disabled={isReacting || reactionProgress === 100}
                  className="action-btn start-btn"
                >
                  <Play className="btn-icon" />
                  Bắt đầu
                </button>
                
                <button
                  onClick={resetReaction}
                  className="action-btn reset-btn"
                >
                  <RotateCcw className="btn-icon" />
                  Làm lại
                </button>
                
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="action-btn hint-btn"
                  disabled={isSubmitted}
                >
                  <Lightbulb className="btn-icon" />
                  Gợi ý
                </button>
              </div>

              {/* Submit/Navigation */}
              <div className="button-section">
                {!isSubmitted ? (
                  <button 
                    onClick={checkAnswer} 
                    className="submit-btn"
                    disabled={!userAnswers.q1 || !userAnswers.q2 || !userAnswers.q3}
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

export default TinhOxiHoa;
