import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Beaker, Flame, Droplet } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './PhongThiNghiem.css';

const PhongThiNghiem = () => {
  const navigate = useNavigate();
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('phong-thi-nghiem');
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [reactionComplete, setReactionComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState({ gas: '', salt: '', color: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
    resetExperiment();
  };

  // Danh sách kim loại
  const metals = [
    { id: 'Fe', name: 'Fe (Sắt)', color: '#8B7E74', shape: 'angular' },
    { id: 'Zn', name: 'Zn (Kẽm)', color: '#C0C0C8', shape: 'angular' },
    { id: 'Al', name: 'Al (Nhôm)', color: '#D3D3D8', shape: 'smooth' },
    { id: 'Mg', name: 'Mg (Magie)', color: '#E8E8E8', shape: 'smooth' },
    { id: 'Cu', name: 'Cu (Đồng)', color: '#B87333', shape: 'smooth' },
    { id: 'Ag', name: 'Ag (Bạc)', color: '#C0C0C0', shape: 'shiny' },
    { id: 'Na', name: 'Na (Natri)', color: '#E0E0E0', shape: 'soft' },
    { id: 'Ca', name: 'Ca (Canxi)', color: '#F5F5F5', shape: 'angular' }
  ];

  // Danh sách axit
  const acids = [
    { id: 'HCl', name: 'HCl',  color: 'transparent' },
    { id: 'H2SO4', name: 'H₂SO₄', color: 'transparent' },
    { id: 'HNO3', name: 'HNO₃', color: 'transparent' }
  ];

  // 10 thử thách
  const challenges = [
    {
      id: 1,
      title: "Sắt tác dụng với HCl",
      difficulty: "Dễ",
      points: 20,
      instruction: "Cho sắt (Fe) vào axit HCl. Quan sát và xác định sản phẩm.",
      metal: 'Fe',
      acid: 'HCl',
      reaction: 'Fe + 2HCl → FeCl₂ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'FeCl2',
        saltName: 'Sắt(II) clorua',
        color: 'light-green',
        colorName: 'Xanh lục nhạt',
        bubbles: 'moderate',
        heat: false
      },
      hint: "Kim loại tác dụng với axit → Muối + Khí H₂"
    },
    {
      id: 2,
      title: "Kẽm tác dụng với H₂SO₄",
      difficulty: "Dễ",
      points: 20,
      instruction: "Cho kẽm (Zn) vào axit H₂SO₄ loãng. Xác định khí và muối tạo thành.",
      metal: 'Zn',
      acid: 'H2SO4',
      reaction: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'ZnSO4',
        saltName: 'Kẽm sunfat',
        color: 'colorless',
        colorName: 'Không màu',
        bubbles: 'strong',
        heat: false
      },
      hint: "Zn hoạt động mạnh hơn Fe → Phản ứng mạnh hơn"
    },
    {
      id: 3,
      title: "Nhôm tác dụng với HCl",
      difficulty: "Dễ",
      points: 25,
      instruction: "Cho nhôm (Al) vào dung dịch HCl. Quan sát hiện tượng.",
      metal: 'Al',
      acid: 'HCl',
      reaction: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'AlCl3',
        saltName: 'Nhôm clorua',
        color: 'colorless',
        colorName: 'Không màu',
        bubbles: 'strong',
        heat: true
      },
      hint: "Al có hệ số lớn trong phương trình"
    },
    {
      id: 4,
      title: "Magie tác dụng với H₂SO₄",
      difficulty: "Trung bình",
      points: 25,
      instruction: "Cho magie (Mg) vào H₂SO₄ loãng. Phản ứng diễn ra như thế nào?",
      metal: 'Mg',
      acid: 'H2SO4',
      reaction: 'Mg + H₂SO₄ → MgSO₄ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'MgSO4',
        saltName: 'Magie sunfat',
        color: 'colorless',
        colorName: 'Không màu',
        bubbles: 'very-strong',
        heat: true
      },
      hint: "Mg rất hoạt động → Phản ứng rất mạnh, tỏa nhiều nhiệt"
    },
    {
      id: 5,
      title: "Đồng KHÔNG tác dụng với HCl",
      difficulty: "Trung bình",
      points: 30,
      instruction: "Cho đồng (Cu) vào HCl loãng. Có phản ứng xảy ra không?",
      metal: 'Cu',
      acid: 'HCl',
      reaction: 'Không phản ứng',
      products: {
        gas: 'none',
        gasName: 'Không có khí',
        salt: 'none',
        saltName: 'Không có muối',
        color: 'no-change',
        colorName: 'Không đổi màu',
        bubbles: 'none',
        heat: false
      },
      hint: "Cu đứng sau H trong dãy hoạt động hóa học → Không đẩy được H₂"
    },
    {
      id: 6,
      title: "Sắt tác dụng với H₂SO₄ loãng",
      difficulty: "Trung bình",
      points: 25,
      instruction: "Thả sắt vào H₂SO₄ loãng. Dung dịch sau phản ứng có màu gì?",
      metal: 'Fe',
      acid: 'H2SO4',
      reaction: 'Fe + H₂SO₄ → FeSO₄ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'FeSO4',
        saltName: 'Sắt(II) sunfat',
        color: 'light-green',
        colorName: 'Xanh lục nhạt',
        bubbles: 'moderate',
        heat: false
      },
      hint: "FeSO₄ có màu xanh lục nhạt"
    },
    {
      id: 7,
      title: "Natri tác dụng với HCl",
      difficulty: "Khó",
      points: 30,
      instruction: "Thả Na vào HCl (NGUY HIỂM!). Phản ứng rất mãnh liệt!",
      metal: 'Na',
      acid: 'HCl',
      reaction: '2Na + 2HCl → 2NaCl + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'NaCl',
        saltName: 'Natri clorua',
        color: 'colorless',
        colorName: 'Không màu',
        bubbles: 'explosive',
        heat: true,
        danger: true
      },
      hint: "Kim loại kiềm → Phản ứng Cực mạnh, nguy hiểm!"
    },
    {
      id: 8,
      title: "Canxi tác dụng với nước (không phải axit)",
      difficulty: "Khó",
      points: 30,
      instruction: "Ca là kim loại hoạt động mạnh, phản ứng với cả H₂O!",
      metal: 'Ca',
      acid: 'H2SO4',
      reaction: 'Ca + H₂SO₄ → CaSO₄ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'CaSO4',
        saltName: 'Canxi sunfat',
        color: 'white-turbid',
        colorName: 'Vẩn đục trắng',
        bubbles: 'strong',
        heat: true
      },
      hint: "CaSO₄ ít tan → Dung dịch đục"
    },
    {
      id: 9,
      title: "Bạc KHÔNG tác dụng với H₂SO₄ loãng",
      difficulty: "Khó",
      points: 30,
      instruction: "Thả bạc (Ag) vào H₂SO₄ loãng. Quan sát hiện tượng.",
      metal: 'Ag',
      acid: 'H2SO4',
      reaction: 'Không phản ứng',
      products: {
        gas: 'none',
        gasName: 'Không có khí',
        salt: 'none',
        saltName: 'Không có muối',
        color: 'no-change',
        colorName: 'Không đổi màu',
        bubbles: 'none',
        heat: false
      },
      hint: "Ag là kim loại kém hoạt động"
    },
    {
      id: 10,
      title: "So sánh Fe với FeCl₂",
      difficulty: "Khó",
      points: 30,
      instruction: "Sau phản ứng Fe + HCl, thu được dung dịch FeCl₂ màu gì?",
      metal: 'Fe',
      acid: 'HCl',
      reaction: 'Fe + 2HCl → FeCl₂ + H₂↑',
      products: {
        gas: 'H2',
        gasName: 'Hydro',
        salt: 'FeCl2',
        saltName: 'Sắt(II) clorua',
        color: 'light-green',
        colorName: 'Xanh lục nhạt',
        bubbles: 'moderate',
        heat: false
      },
      hint: "Fe²⁺ (sắt II) có màu xanh lục nhạt, khác với Fe³⁺ (vàng nâu)"
    }
  ];

  const currentQ = challenges[currentChallenge];

  // Reset khi chuyển câu
  useEffect(() => {
    setIsReacting(false);
    setReactionComplete(false);
  }, [currentChallenge]);

  // Bắt đầu phản ứng
  const startReaction = () => {
    setIsReacting(true);
    setTimeout(() => {
      setIsReacting(false);
      setReactionComplete(true);
    }, 3000); // Phản ứng 3 giây
  };

  // Kiểm tra đáp án
  const checkAnswer = () => {
    let correct = true;
    const products = currentQ.products;

    // So sánh khí (cho phép nhiều định dạng: H2, h2, hydro, không, none)
    const gasInput = userAnswer.gas.toLowerCase().trim();
    const correctGas = products.gas.toLowerCase();
    const gasMatch = 
      gasInput === correctGas || 
      (correctGas === 'h2' && (gasInput === 'h2' || gasInput === 'hydro')) ||
      (correctGas === 'o2' && (gasInput === 'o2' || gasInput === 'oxi')) ||
      (correctGas === 'co2' && (gasInput === 'co2' || gasInput === 'carbon dioxide')) ||
      (correctGas === 'none' && (gasInput === 'none' || gasInput === 'không' || gasInput === 'khong'));
    
    if (!gasMatch) correct = false;

    // So sánh muối (cho phép nhiều định dạng: FeCl2, fecl2, etc)
    const saltInput = userAnswer.salt.toLowerCase().trim();
    const correctSalt = products.salt.toLowerCase();
    const saltMatch = 
      saltInput === correctSalt ||
      (correctSalt === 'none' && (saltInput === 'none' || saltInput === 'không' || saltInput === 'khong'));
    
    if (!saltMatch) correct = false;

    // So sánh màu (vẫn dùng select nên exact match)
    if (userAnswer.color !== products.color) correct = false;

    if (correct) {
      setScore(score + currentQ.points);
    }
    setIsSubmitted(true);
  };

  // Chuyển câu tiếp
  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      const nextIndex = currentChallenge + 1;
      setCurrentChallenge(nextIndex);
      resetExperiment();
      
      saveProgress({
        currentChallenge: nextIndex,
        score
      });
    } else {
      setShowResults(true);
      clearProgress();
    }
  };

  // Quay lại câu trước
  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1);
      resetExperiment();
    }
  };

  // Reset thí nghiệm
  const resetExperiment = () => {
    setUserAnswer({ gas: '', salt: '', color: '' });
    setIsSubmitted(false);
    // Không reset isReacting và reactionComplete vì useEffect sẽ xử lý
  };

  // Render beaker experiment
  const renderBeaker = () => {
    const products = currentQ.products;
    const showReaction = isReacting || reactionComplete;
    const metal = metals.find(m => m.id === currentQ.metal);
    
    return (
      <div className="beaker-container">
        <div className="beaker">
          {/* Dung dịch axit */}
          <div className={`solution ${showReaction ? 'reacting' : ''}`}>
            <div className="acid-layer"></div>
          </div>

          {/* Kim loại */}
          <div className={`metal-piece ${isReacting ? 'dissolving' : ''}`} style={{ backgroundColor: metal?.color || '#95a5a6' }}>
            {currentQ.metal}
          </div>

          {/* Bọt khí */}
          {showReaction && products.bubbles !== 'none' && (
            <div className={`bubbles ${products.bubbles}`}>
              {Array(products.bubbles === 'explosive' ? 20 : products.bubbles === 'very-strong' ? 15 : products.bubbles === 'strong' ? 12 : 8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bubble" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>
          )}

          {/* Màu sắc sản phẩm */}
          {reactionComplete && (
            <div className={`product-solution color-${products.color}`}></div>
          )}

          {/* Cảnh báo nguy hiểm */}
          {isReacting && products.danger && (
            <div className="danger-warning">
              <Flame size={30} color="#ff4444" />
              <span>NGUY HIỂM!</span>
            </div>
          )}
        </div>

        {/* Label beaker */}
        <div className="beaker-label">Cốc thí nghiệm</div>
      </div>
    );
  };

  // Results Modal
  if (showResults) {
    return (
      <div className="phong-thi-nghiem-container">
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
              <p>Bạn đã hoàn thành {challenges.length} thí nghiệm!</p>
              <p>Tỷ lệ: {((score / challenges.reduce((sum, c) => sum + c.points, 0)) * 100).toFixed(1)}%</p>
            </div>
            <button className="btn-return" onClick={() => navigate('/advanced-challenge')}>
              Quay lại danh sách thử thách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phong-thi-nghiem-container">
      {/* Header */}
      <div className="game-header">
        <Link to="/advanced-challenge" className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </Link>
        <h1 className="game-title">
          <Beaker className="title-icon" size={32} />
          Phòng Thí Nghiệm Hóa Học
        </h1>
        <div className="score-display">
          <Trophy size={24} />
          {score} điểm
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="challenge-info">
          <span className={`difficulty-badge ${currentQ.difficulty.toLowerCase()}`}>
            {currentQ.difficulty}
          </span>
          <span className="challenge-counter">
            Thí nghiệm {currentChallenge + 1}/{challenges.length}
          </span>
          <span className="points-badge">+{currentQ.points} điểm</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Challenge Title */}
      <div className="challenge-title">
        <h2>{currentQ.title}</h2>
        <p>{currentQ.instruction}</p>
        <div className="hint-section">
          <strong>💡 Gợi ý:</strong> {currentQ.hint}
        </div>
      </div>

      {/* Main Lab Area */}
      <div className="lab-area">
        {/* Beaker thí nghiệm */}
        <div className="experiment-zone">
          {renderBeaker()}
          
          {!reactionComplete && !isReacting && (
            <button
              className="btn-react"
              onClick={startReaction}
            >
              🔬 Bắt đầu phản ứng
            </button>
          )}
          
          {isReacting && (
            <div className="reacting-message">⚗️ Đang phản ứng...</div>
          )}
        </div>

        {/* Answer Section - Luôn hiển thị bên phải */}
        {!isSubmitted ? (
          <div className="answer-section">
            <h3>Xác định sản phẩm:</h3>
            <div className="answer-grid">
              <div className="answer-group">
                <label>Khí thoát ra:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: H2, O2, CO2, hoặc 'không'"
                  value={userAnswer.gas}
                  onChange={(e) => setUserAnswer({ ...userAnswer, gas: e.target.value })}
                  disabled={!reactionComplete}
                />
                <small className="input-hint">Gợi ý: H2, O2, CO2, hoặc gõ "không"</small>
              </div>

              <div className="answer-group">
                <label>Muối tạo thành:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: FeCl2, ZnSO4, hoặc 'không'"
                  value={userAnswer.salt}
                  onChange={(e) => setUserAnswer({ ...userAnswer, salt: e.target.value })}
                  disabled={!reactionComplete}
                />
                <small className="input-hint">Gợi ý: FeCl2, ZnSO4, NaCl, hoặc gõ "không"</small>
              </div>

              <div className="answer-group">
                <label>Màu dung dịch:</label>
                <select
                  value={userAnswer.color}
                  onChange={(e) => setUserAnswer({ ...userAnswer, color: e.target.value })}
                  disabled={!reactionComplete}
                >
                  <option value="">-- Chọn --</option>
                  <option value="colorless">Không màu</option>
                  <option value="light-blue">Xanh lam nhạt</option>

                  <option value="light-green">Xanh lục nhạt</option>
                  <option value="blue">Xanh lam</option>
                  <option value="white-turbid">Vẩn đục trắng</option>
                  <option value="yellow-brown">Vàng nâu</option>
                  <option value="no-change">Không đổi màu</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-submit" 
              onClick={checkAnswer}
              disabled={!reactionComplete}
            >
              Kiểm tra đáp án
            </button>
          </div>
        ) : (
          /* Phương trình - Hiện sau khi submit */
          <div className="reaction-equation">
            <h3>Phương trình hóa học:</h3>
            <div className="equation">{currentQ.reaction}</div>
          </div>
        )}
      </div>

      {/* Answer Feedback */}
      {isSubmitted && (
        <div className="answer-feedback">
          <h4>✅ Đáp án đúng:</h4>
          <div className="correct-answers">
            <p><strong>Khí:</strong> {currentQ.products.gasName}</p>
            <p><strong>Muối:</strong> {currentQ.products.saltName}</p>
            <p><strong>Màu:</strong> {currentQ.products.colorName}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {isSubmitted && (
        <div className="button-section">
          <div className="navigation-buttons">
            <button
              className="btn-nav btn-prev"
              onClick={prevChallenge}
              disabled={currentChallenge === 0}
            >
              ← Trước
            </button>
            <button className="btn-nav btn-next" onClick={nextChallenge}>
              {currentChallenge === challenges.length - 1 ? 'Hoàn thành' : 'Tiếp →'}
            </button>
          </div>
        </div>
      )}

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

export default PhongThiNghiem;
