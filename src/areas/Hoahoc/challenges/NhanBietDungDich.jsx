import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Lightbulb, Droplet, TestTube, Beaker, FlaskConical, AlertCircle } from 'lucide-react';
import useChallengeProgress from '../../../hooks/useChallengeProgress';
import ResumeDialog from '../../../components/ResumeDialog';
import './NhanBietDungDich.css';

// Dữ liệu về các hợp chất và dấu hiệu nhận biết (dành cho lớp 8-9)
const ionDatabase = {
  // Axit
  'HCl': {
    name: 'Axit clohidric',
    formula: 'HCl',
    color: 'không màu',
    solutionColor: '#e3f2fd',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa đỏ', precipitateColor: '#ff6b9d', isLitmusTest: true, equation: 'HCl → H⁺ + Cl⁻' },
      { reagent: 'Dung dịch AgNO₃', result: 'Kết tủa trắng AgCl', precipitateColor: '#fafafa', equation: 'HCl + AgNO₃ → AgCl↓ + HNO₃' },
      { reagent: 'Kim loại Zn', result: 'Sủi bọt khí H₂', precipitateColor: 'transparent', hasBubbles: true, equation: 'Zn + 2HCl → ZnCl₂ + H₂↑' }
    ]
  },
  'H2SO4': {
    name: 'Axit sunfuric',
    formula: 'H₂SO₄',
    color: 'không màu',
    solutionColor: '#e3f2fd',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa đỏ', precipitateColor: '#ff6b9d', isLitmusTest: true, equation: 'H₂SO₄ → 2H⁺ + SO₄²⁻' },
      { reagent: 'Dung dịch BaCl₂', result: 'Kết tủa trắng BaSO₄', precipitateColor: '#fefefe', equation: 'H₂SO₄ + BaCl₂ → BaSO₄↓ + 2HCl' },
      { reagent: 'Kim loại Zn', result: 'Sủi bọt khí H₂', precipitateColor: 'transparent', hasBubbles: true, equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑' }
    ]
  },
  
  // Bazơ
  'NaOH': {
    name: 'Natri hidroxit',
    formula: 'NaOH',
    color: 'không màu',
    solutionColor: '#e8f5e9',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa xanh', precipitateColor: '#6b9dff', isLitmusTest: true, equation: 'NaOH → Na⁺ + OH⁻' },
      { reagent: 'Dung dịch CuSO₄', result: 'Kết tủa xanh lam Cu(OH)₂', precipitateColor: '#2196f3', equation: '2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄' },
      { reagent: 'Dung dịch FeCl₃', result: 'Kết tủa nâu đỏ Fe(OH)₃', precipitateColor: '#a0522d', equation: '3NaOH + FeCl₃ → Fe(OH)₃↓ + 3NaCl' }
    ]
  },
  'Ca(OH)2': {
    name: 'Canxi hidroxit (nước vôi trong)',
    formula: 'Ca(OH)₂',
    color: 'không màu',
    solutionColor: '#f0f8ff',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa xanh', precipitateColor: '#6b9dff', isLitmusTest: true, equation: 'Ca(OH)₂ → Ca²⁺ + 2OH⁻' },
      { reagent: 'Khí CO₂', result: 'Xuất hiện kết tủa trắng CaCO₃', precipitateColor: '#fcfcfc', equation: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O' },
      { reagent: 'Dung dịch Na₂CO₃', result: 'Kết tủa trắng CaCO₃', precipitateColor: '#fcfcfc', equation: 'Ca(OH)₂ + Na₂CO₃ → CaCO₃↓ + 2NaOH' }
    ]
  },
  
  // Muối
  'NaCl': {
    name: 'Natri clorua (muối ăn)',
    formula: 'NaCl',
    color: 'không màu',
    solutionColor: '#e3f2fd',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím không đổi màu', precipitateColor: 'transparent', isSolutionChange: false, equation: '' },
      { reagent: 'Dung dịch AgNO₃', result: 'Kết tủa trắng AgCl', precipitateColor: '#fafafa', equation: 'NaCl + AgNO₃ → AgCl↓ + NaNO₃' }
    ]
  },
  'CuSO4': {
    name: 'Đồng(II) sunfat',
    formula: 'CuSO₄',
    color: 'xanh lam',
    solutionColor: '#42a5f5',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím không đổi màu', precipitateColor: 'transparent', isSolutionChange: false, equation: '' },
      { reagent: 'Dung dịch NaOH', result: 'Kết tủa xanh lam Cu(OH)₂', precipitateColor: '#2196f3', equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄' },
      { reagent: 'Dung dịch BaCl₂', result: 'Kết tủa trắng BaSO₄', precipitateColor: '#fefefe', equation: 'CuSO₄ + BaCl₂ → BaSO₄↓ + CuCl₂' },
      { reagent: 'Kim loại Fe', result: 'Bề mặt Fe phủ lớp Cu màu đỏ', precipitateColor: '#d84315', isMetalReaction: true, equation: 'Fe + CuSO₄ → FeSO₄ + Cu' }
    ]
  },
  'FeCl3': {
    name: 'Sắt(III) clorua',
    formula: 'FeCl₃',
    color: 'vàng nâu',
    solutionColor: '#ffb74d',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa đỏ nhạt', precipitateColor: '#ff9999', isLitmusTest: true, equation: 'FeCl₃ + H₂O ⇌ Fe(OH)Cl₂ + HCl' },
      { reagent: 'Dung dịch NaOH', result: 'Kết tủa nâu đỏ Fe(OH)₃', precipitateColor: '#a0522d', equation: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl' },
      { reagent: 'Dung dịch AgNO₃', result: 'Kết tủa trắng AgCl', precipitateColor: '#fafafa', equation: 'FeCl₃ + 3AgNO₃ → 3AgCl↓ + Fe(NO₃)₃' }
    ]
  },
  'Na2CO3': {
    name: 'Natri cacbonat',
    formula: 'Na₂CO₃',
    color: 'không màu',
    solutionColor: '#e8f5e9',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím hóa xanh nhạt', precipitateColor: '#9dc3ff', isLitmusTest: true, equation: 'Na₂CO₃ + H₂O ⇌ NaHCO₃ + NaOH' },
      { reagent: 'Dung dịch HCl', result: 'Sủi bọt khí CO₂', precipitateColor: 'transparent', hasBubbles: true, equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑' },
      { reagent: 'Dung dịch CaCl₂', result: 'Kết tủa trắng CaCO₃', precipitateColor: '#fcfcfc', equation: 'Na₂CO₃ + CaCl₂ → CaCO₃↓ + 2NaCl' },
      { reagent: 'Dung dịch BaCl₂', result: 'Kết tủa trắng BaCO₃', precipitateColor: '#f9f9f9', equation: 'Na₂CO₃ + BaCl₂ → BaCO₃↓ + 2NaCl' }
    ]
  },
  'BaCl2': {
    name: 'Bari clorua',
    formula: 'BaCl₂',
    color: 'không màu',
    solutionColor: '#e3f2fd',
    reactions: [
      { reagent: 'Quỳ tím', result: 'Quỳ tím không đổi màu', precipitateColor: 'transparent', isSolutionChange: false, equation: '' },
      { reagent: 'Dung dịch H₂SO₄', result: 'Kết tủa trắng BaSO₄', precipitateColor: '#fefefe', equation: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl' },
      { reagent: 'Dung dịch Na₂CO₃', result: 'Kết tủa trắng BaCO₃', precipitateColor: '#f9f9f9', equation: 'BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl' },
      { reagent: 'Dung dịch Na₂SO₄', result: 'Kết tủa trắng BaSO₄', precipitateColor: '#fefefe', equation: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl' }
    ]
  }
};

// Các câu hỏi dạng thí nghiệm
const experimentQuestions = [
  {
    id: 1,
    unknownSolution: 'HCl',
    availableReagents: ['Quỳ tím', 'Dung dịch AgNO₃', 'Kim loại Zn'],
    minTests: 1,
    hint: 'Chất này làm quỳ tím chuyển màu và có phản ứng đặc trưng với bạc',
    difficulty: 'easy'
  },
  {
    id: 2,
    unknownSolution: 'NaOH',
    availableReagents: ['Quỳ tím', 'Dung dịch CuSO₄', 'Dung dịch FeCl₃'],
    minTests: 1,
    hint: 'Chất này là bazơ mạnh, dễ nhận biết với quỳ tím',
    difficulty: 'easy'
  },
  {
    id: 3,
    unknownSolution: 'Na2CO3',
    availableReagents: ['Quỳ tím', 'Dung dịch HCl', 'Dung dịch CaCl₂', 'Dung dịch BaCl₂'],
    minTests: 1,
    hint: 'Chất này tạo khí CO₂ với axit',
    difficulty: 'easy'
  },
  {
    id: 4,
    unknownSolution: 'CuSO4',
    availableReagents: ['Quỳ tím', 'Dung dịch NaOH', 'Dung dịch BaCl₂', 'Kim loại Fe'],
    minTests: 2,
    hint: 'Dung dịch có màu xanh lam đặc trưng',
    difficulty: 'medium'
  },
  {
    id: 5,
    unknownSolution: 'H2SO4',
    availableReagents: ['Quỳ tím', 'Dung dịch BaCl₂', 'Kim loại Zn'],
    minTests: 2,
    hint: 'Axit mạnh, tạo kết tủa trắng không tan với muối bari',
    difficulty: 'medium'
  },
  {
    id: 6,
    unknownSolution: 'BaCl2',
    availableReagents: ['Quỳ tím', 'Dung dịch H₂SO₄', 'Dung dịch Na₂CO₃', 'Dung dịch Na₂SO₄'],
    minTests: 2,
    hint: 'Muối bari, tạo kết tủa trắng với nhiều chất',
    difficulty: 'medium'
  },
  {
    id: 7,
    unknownSolution: 'FeCl3',
    availableReagents: ['Quỳ tím', 'Dung dịch NaOH', 'Dung dịch AgNO₃'],
    minTests: 2,
    hint: 'Dung dịch màu vàng nâu, muối sắt III',
    difficulty: 'hard'
  },
  {
    id: 8,
    unknownSolution: 'Ca(OH)2',
    availableReagents: ['Quỳ tím', 'Khí CO₂', 'Dung dịch Na₂CO₃'],
    minTests: 2,
    hint: 'Nước vôi trong, phản ứng đặc trưng với khí CO₂',
    difficulty: 'hard'
  }
];

// Câu hỏi trò chơi (giữ lại cho chế độ cũ nếu cần)
const gameQuestions = [
  {
    id: 1,
    question: "Nhỏ dung dịch NaOH vào dung dịch A, thấy xuất hiện kết tủa xanh lam. Dung dịch A chứa ion gì?",
    options: ['Fe2+', 'Cu2+', 'Zn2+', 'Al3+'],
    correctAnswer: 'Cu2+',
    explanation: "Kết tủa xanh lam Cu(OH)2 là dấu hiệu đặc trưng của ion Cu2+",
    hint: "Màu xanh lam đặc trưng của ion kim loại nào?"
  },
  {
    id: 2,
    question: "Cho dung dịch KSCN vào dung dịch B, dung dịch chuyển sang màu đỏ máu. Dung dịch B chứa ion nào?",
    options: ['Fe2+', 'Fe3+', 'Cu2+', 'Ag+'],
    correctAnswer: 'Fe3+',
    explanation: "Phản ứng tạo phức màu đỏ máu [Fe(SCN)]2+ là phản ứng đặc trưng nhận biết Fe3+",
    hint: "Phản ứng tạo màu đỏ máu đặc trưng với ion sắt"
  },
  {
    id: 3,
    question: "Thêm dung dịch AgNO3 vào dung dịch C, xuất hiện kết tủa trắng, tan trong dung dịch NH3. Ion nào có trong dung dịch C?",
    options: ['Br-', 'Cl-', 'I-', 'SO42-'],
    correctAnswer: 'Cl-',
    explanation: "Kết tủa trắng AgCl tan trong NH3, trong khi AgBr và AgI không tan",
    hint: "Kết tủa bạc halogenua nào tan trong amoniac?"
  },
  {
    id: 4,
    question: "Cho HCl vào dung dịch D, thấy sủi bọt khí làm đục nước vôi trong. Dung dịch D chứa ion gì?",
    options: ['SO42-', 'CO32-', 'NO3-', 'Cl-'],
    correctAnswer: 'CO32-',
    explanation: "CO32- + 2HCl → CO2↑ + H2O + 2Cl-. Khí CO2 làm đục nước vôi trong",
    hint: "Ion nào phản ứng với axit tạo khí làm đục nước vôi?"
  },
  {
    id: 5,
    question: "Nhỏ dung dịch NaOH vào dung dịch E, thấy kết tủa trắng xanh, để ngoài không khí chuyển nâu. Ion nào trong dung dịch E?",
    options: ['Fe2+', 'Fe3+', 'Zn2+', 'Al3+'],
    correctAnswer: 'Fe2+',
    explanation: "Fe(OH)2 màu trắng xanh bị oxi hóa thành Fe(OH)3 màu nâu đỏ ngoài không khí",
    hint: "Kết tủa hydroxit nào bị oxi hóa ngoài không khí?"
  },
  {
    id: 6,
    question: "Thêm BaCl2 vào dung dịch F, xuất hiện kết tủa trắng không tan trong axit. Dung dịch F chứa ion nào?",
    options: ['CO32-', 'SO42-', 'Cl-', 'NO3-'],
    correctAnswer: 'SO42-',
    explanation: "BaSO4 là kết tủa trắng không tan trong axit, còn BaCO3 tan trong axit",
    hint: "Muối bari nào không tan trong axit?"
  },
  {
    id: 7,
    question: "Cho dung dịch NH3 dư vào dung dịch G màu xanh lam, dung dịch chuyển sang màu xanh thẫm. Ion nào có trong G?",
    options: ['Ni2+', 'Cu2+', 'Co2+', 'Fe2+'],
    correctAnswer: 'Cu2+',
    explanation: "Cu2+ tạo phức [Cu(NH3)4]2+ màu xanh thẫm với NH3 dư",
    hint: "Ion nào tạo phức màu xanh thẫm với amoniac?"
  },
  {
    id: 8,
    question: "Thêm H2S vào dung dịch H, xuất hiện kết tủa đen. Ion kim loại nào có trong dung dịch H?",
    options: ['Zn2+', 'Al3+', 'Cu2+', 'Ca2+'],
    correctAnswer: 'Cu2+',
    explanation: "CuS là kết tủa màu đen. ZnS màu trắng, Al3+ và Ca2+ không tạo kết tủa với H2S",
    hint: "Sunfua kim loại nào có màu đen?"
  },
  {
    id: 9,
    question: "Cho NaOH vào dung dịch I, thấy kết tủa trắng, thêm NaOH dư thì kết tủa tan. Ion nào trong dung dịch I?",
    options: ['Cu2+', 'Fe3+', 'Al3+', 'Ag+'],
    correctAnswer: 'Al3+',
    explanation: "Al(OH)3 có tính lưỡng tính, tan trong NaOH dư tạo [Al(OH)4]-",
    hint: "Hidroxit kim loại nào có tính lưỡng tính?"
  },
  {
    id: 10,
    question: "Cho AgNO3 vào dung dịch J, thấy kết tủa vàng. Ion nào có trong dung dịch J?",
    options: ['Cl-', 'Br-', 'I-', 'SO42-'],
    correctAnswer: 'I-',
    explanation: "AgI có màu vàng, AgCl trắng, AgBr vàng nhạt",
    hint: "Muối bạc halogenua nào có màu vàng đậm nhất?"
  },
  {
    id: 11,
    question: "Nhỏ dung dịch NaOH vào dung dịch K, thấy kết tủa nâu đỏ. Dung dịch K chứa ion gì?",
    options: ['Fe2+', 'Fe3+', 'Cu2+', 'Zn2+'],
    correctAnswer: 'Fe3+',
    explanation: "Fe(OH)3 có màu nâu đỏ đặc trưng",
    hint: "Hidroxit sắt nào có màu nâu đỏ?"
  },
  {
    id: 12,
    question: "Cho HCl vào dung dịch L, có khí thoát ra mùi trứng thối. Ion nào trong dung dịch L?",
    options: ['SO42-', 'S2-', 'CO32-', 'NO3-'],
    correctAnswer: 'S2-',
    explanation: "S2- + 2HCl → H2S↑ + 2Cl-. H2S có mùi trứng thối đặc trưng",
    hint: "Khí nào có mùi trứng thối?"
  },
  {
    id: 13,
    question: "Thêm dung dịch Pb(NO3)2 vào dung dịch M, xuất hiện kết tủa đen. Ion nào có trong M?",
    options: ['Cl-', 'SO42-', 'S2-', 'CO32-'],
    correctAnswer: 'S2-',
    explanation: "PbS là kết tủa màu đen đặc trưng",
    hint: "Muối chì nào có màu đen?"
  },
  {
    id: 14,
    question: "Cho dung dịch Na2CO3 vào dung dịch N, thấy kết tủa trắng. Sau đó cho dung dịch H2SO4, kết tủa không tan. Ion nào trong N?",
    options: ['Ca2+', 'Ba2+', 'Mg2+', 'Zn2+'],
    correctAnswer: 'Ba2+',
    explanation: "BaCO3 + H2SO4 → BaSO4↓ + CO2 + H2O. BaSO4 không tan trong axit",
    hint: "Cacbonat kim loại nào chuyển thành sunfat không tan trong axit?"
  },
  {
    id: 15,
    question: "Cho dung dịch Cl2 vào dung dịch O không màu, dung dịch chuyển sang màu nâu đỏ. Ion nào trong dung dịch O?",
    options: ['Cl-', 'Br-', 'I-', 'SO42-'],
    correctAnswer: 'Br-',
    explanation: "Cl2 + 2Br- → Br2 + 2Cl-. Br2 có màu nâu đỏ",
    hint: "Halogen đơn chất nào có màu nâu đỏ?"
  }
];

const NhanBietDungDich = () => {
  const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('nhan-biet-dung-dich');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Lab experiment states
  const [selectedReagent, setSelectedReagent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isDropping, setIsDropping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [ionOptions, setIonOptions] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);
  
  const currentQ = experimentQuestions[currentQuestion];
  const unknownIon = ionDatabase[currentQ.unknownSolution];

  useEffect(() => {
    if (hasProgress && !gameStarted && !gameCompleted) {
      setShowResumeDialog(true);
    }
  }, []);

  const startGame = (fromBeginning = false) => {
    if (fromBeginning) {
      clearProgress();
      setCurrentQuestion(0);
      setScore(0);
      setCorrectAnswers(0);
      setGameStarted(true);
      setShowResumeDialog(false);
    } else {
      const saved = getProgress();
      if (saved) {
        setCurrentQuestion(saved.currentQuestion);
        setScore(saved.score);
        setCorrectAnswers(saved.correctAnswers);
        setGameStarted(true);
        setShowResumeDialog(false);
      } else {
        startGame(true);
      }
    }
    setTestResults([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowHint(false);
    setCanSubmit(false);
  };

  // Tạo danh sách đáp án khi câu hỏi thay đổi
  useEffect(() => {
    const allCompounds = ['HCl', 'H2SO4', 'NaOH', 'Ca(OH)2', 'NaCl', 'CuSO4', 'FeCl3', 'Na2CO3', 'BaCl2'];
    const correctCompound = currentQ.unknownSolution;
    let options = [correctCompound];
    
    // Thêm 3 đáp án nhiễu ngẫu nhiên
    const otherCompounds = allCompounds.filter(compound => compound !== correctCompound);
    while (options.length < 4) {
      const randomCompound = otherCompounds[Math.floor(Math.random() * otherCompounds.length)];
      if (!options.includes(randomCompound)) {
        options.push(randomCompound);
      }
    }
    
    // Trộn ngẫu nhiên
    setIonOptions(options.sort(() => Math.random() - 0.5));
  }, [currentQuestion, currentQ.unknownSolution]);

  // Phân loại chất thử
  const getReagentType = (reagent) => {
    if (reagent.includes('Quỳ')) return 'litmus';
    if (reagent.includes('Kim loại')) return 'metal';
    if (reagent.includes('Khí')) return 'gas';
    return 'solution';
  };

  const getReagentColor = (reagent) => {
    if (reagent.includes('Quỳ tím')) return '#9c27b0';
    if (reagent.includes('Kim loại Zn')) return '#b0bec5';
    if (reagent.includes('Kim loại Fe')) return '#78909c';
    if (reagent.includes('AgNO₃')) return 'transparent';
    if (reagent.includes('CuSO₄')) return '#42a5f5';
    if (reagent.includes('FeCl₃')) return '#ffb74d';
    if (reagent.includes('NaOH')) return 'transparent';
    if (reagent.includes('BaCl₂')) return 'transparent';
    if (reagent.includes('CaCl₂')) return 'transparent';
    if (reagent.includes('Na₂CO₃')) return 'transparent';
    if (reagent.includes('Na₂SO₄')) return 'transparent';
    if (reagent.includes('HCl')) return 'transparent';
    if (reagent.includes('H₂SO₄')) return 'transparent';
    return 'transparent';
  };

  // Lấy màu quỳ sau khi phản ứng
  const getLitmusColorAfterReaction = (color) => {
    // color là precipitateColor từ reaction (màu trong isSolutionChange)
    if (color === '#ff6b9d' || color === '#ff9999') return '#e91e63'; // Đỏ (axit)
    if (color === '#6b9dff' || color === '#9dc3ff') return '#2196f3'; // Xanh (bazơ)
    return '#9c27b0'; // Tím (trung tính)
  };

  
  // Xử lý nhỏ thuốc thử
  const handleDropReagent = (reagent) => {
    if (isDropping || showAnswer) return;
    
    setSelectedReagent(reagent);
    setIsDropping(true);
    
    // Tìm phản ứng tương ứng
    const reaction = unknownIon.reactions.find(r => r.reagent === reagent);
    setCurrentReaction(reaction);
    
    setTimeout(() => {
      if (reaction) {
        setTestResults([...testResults, {
          reagent: reagent,
          result: reaction.result,
          color: reaction.precipitateColor,
          equation: reaction.equation,
          hasBubbles: reaction.hasBubbles === true,
          isSolutionChange: reaction.isSolutionChange === true,
          isLitmusTest: reaction.isLitmusTest === true,
          isMetalReaction: reaction.isMetalReaction === true
        }]);
      }
      setIsDropping(false);
      setSelectedReagent(null);
      setCurrentReaction(null);
      
      // Kiểm tra xem đã đủ số lần test chưa
      if (testResults.length + 1 >= currentQ.minTests) {
        setCanSubmit(true);
      }
    }, 1500);
  };

  // Xử lý chọn đáp án
  const handleSelectAnswer = (ionKey) => {
    if (!canSubmit) return;
    setSelectedAnswer(ionKey);
  };

  // Xử lý submit đáp án
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowAnswer(true);
    const isCorrect = selectedAnswer === currentQ.unknownSolution;
    
    if (isCorrect) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 15 : 20;
      setScore(score + points);
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  // Chuyển câu tiếp theo
  const handleNextQuestion = () => {
    if (currentQuestion < experimentQuestions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setTestResults([]);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setShowHint(false);
      setCanSubmit(false);
      
      saveProgress({
        currentQuestion: nextIndex,
        score,
        correctAnswers
      });
    } else {
      setGameCompleted(true);
      clearProgress();
    }
  };

  // Reset thí nghiệm
  const handleReset = () => {
    setTestResults([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setCanSubmit(false);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTestResults([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowHint(false);
    setGameCompleted(false);
    setCorrectAnswers(0);
    setCanSubmit(false);
  };

  if (gameCompleted) {
    const percentage = (correctAnswers / experimentQuestions.length * 100).toFixed(0);
    const maxScore = experimentQuestions.reduce((sum, q) => {
      return sum + (q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 15 : 20);
    }, 0);
    
    return (
      <div className="suy-luan-container">
        <div className="result-modal show">
          <div className="result-content">
            <Trophy className="result-icon" size={80} />
            <h2>Hoàn thành!</h2>
            <div className="result-stats">
              <p className="result-score">Điểm số: {score}/{maxScore}</p>
              <p className="result-accuracy">Độ chính xác: {percentage}%</p>
              <p className="result-correct">Đúng: {correctAnswers}/{experimentQuestions.length}</p>
            </div>
            <div className="result-message">
              {percentage >= 80 && <p>🏆 Xuất sắc! Bạn là chuyên gia nhận biết dung dịch!</p>}
              {percentage >= 60 && percentage < 80 && <p>👍 Tốt lắm! Tiếp tục rèn luyện nhé!</p>}
              {percentage >= 40 && percentage < 60 && <p>💪 Khá đấy! Hãy ôn lại kiến thức!</p>}
              {percentage < 40 && <p>📚 Cần cố gắng hơn! Hãy học lại phần nhận biết ion!</p>}
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
    <div className="suy-luan-container">
      <div className="suy-luan-header">
        <Link to="/advanced-challenge" className="back-button">
          <ArrowLeft size={24} />
          <span>Quay lại</span>
        </Link>
        <h1 className="game-title">
          <FlaskConical className="title-icon" />
          Nhận Biết Dung Dịch - Phòng Thí Nghiệm
        </h1>
        <div className="score-display">
          <Trophy size={24} />
          <span>{score} điểm</span>
        </div>
      </div>

      <div className="game-content">
        <div className="progress-section">
          <div className="question-counter">
            Thí nghiệm {currentQuestion + 1}/{experimentQuestions.length}
            <span className={`difficulty-badge ${currentQ.difficulty}`}>
              {currentQ.difficulty === 'easy' ? '⭐ Dễ' : currentQ.difficulty === 'medium' ? '⭐⭐ Trung bình' : '⭐⭐⭐ Khó'}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / experimentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Phần thí nghiệm */}
        <div className="lab-container">
          <div className="lab-instruction">
            <AlertCircle size={20} />
            <p>Nhỏ các thuốc thử vào dung dịch X để quan sát hiện tượng, sau đó đoán xem dung dịch X chứa ion gì. 
               <strong> Cần ít nhất {currentQ.minTests} lần thử nghiệm!</strong>
            </p>
          </div>

          {/* Khu vực thuốc thử */}
          <div className="reagents-section">
            <h3><TestTube size={20} /> Thuốc thử có sẵn:</h3>
            <div className="reagents-grid">
              {currentQ.availableReagents.map((reagent, idx) => {
                const reagentType = getReagentType(reagent);
                const reagentColor = getReagentColor(reagent);
                
                return (
                  <button
                    key={idx}
                    className={`reagent-btn ${selectedReagent === reagent ? 'dropping' : ''} ${
                      testResults.some(r => r.reagent === reagent) ? 'used' : ''
                    }`}
                    onClick={() => handleDropReagent(reagent)}
                    disabled={isDropping || showAnswer || testResults.some(r => r.reagent === reagent)}
                  >
                    {reagentType === 'litmus' ? (
                      <div className="reagent-litmus">
                        <div className="litmus-paper" style={{ backgroundColor: reagentColor }}></div>
                      </div>
                    ) : reagentType === 'metal' ? (
                      <div className="reagent-metal">
                        <div className="metal-rod" style={{ backgroundColor: reagentColor }}></div>
                      </div>
                    ) : (
                      <div className="reagent-tube">
                        <div className="reagent-liquid" style={{ backgroundColor: reagentColor }}></div>
                      </div>
                    )}
                    <span className="reagent-name">{reagent}</span>
                    {testResults.some(r => r.reagent === reagent) && <span className="check-mark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Khu vực thí nghiệm - Số bình tự động dựa trên số chất thử */}
          <div className="experiment-area">
            <div className="beakers-row">
              {currentQ.availableReagents.map((_, beakerIndex) => {
                const testResult = testResults[beakerIndex];
                const isActive = selectedReagent && beakerIndex === testResults.length;
                
                return (
                  <div key={beakerIndex} className="beaker-container">
                    <div className="lab-stand">
                      {/* Animation cho thuốc thử ở bình đang active */}
                      {isActive && (
                        <div className="reagent-action-animation">
                          {getReagentType(selectedReagent) === 'litmus' ? (
                            <div className="litmus-dipping">
                              <div 
                                className="litmus-paper-dip"
                                style={{
                                  '--litmus-changed-color': currentReaction && currentReaction.isLitmusTest 
                                    ? getLitmusColorAfterReaction(currentReaction.precipitateColor)
                                    : '#7d5185ff'
                                }}
                              >
                                <div className="litmus-top" style={{ backgroundColor: getReagentColor(selectedReagent) }}></div>
                                <div className="litmus-bottom"></div>
                              </div>
                            </div>
                          ) : getReagentType(selectedReagent) === 'metal' ? (
                            <div className="metal-dipping">
                              <div 
                                className="metal-rod-dip"
                                style={{
                                  '--metal-changed-color': currentReaction && currentReaction.isMetalReaction 
                                    ? currentReaction.precipitateColor
                                    : getReagentColor(selectedReagent)
                                }}
                              >
                                <div className="metal-rod-top" style={{ backgroundColor: getReagentColor(selectedReagent) }}></div>
                                <div className="metal-rod-bottom"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="dropper-animation">
                              <div className="dropper">
                                <div className="dropper-bulb"></div>
                                <div className="dropper-tip"></div>
                                <div className="drop"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Bình tam giác chứa dung dịch */}
                      <div className="erlenmeyer-flask">
                        <div className="flask-neck"></div>
                        <div className="flask-body">
                          <div 
                            className="unknown-solution"
                            style={{ 
                              backgroundColor: testResult && testResult.isSolutionChange 
                                ? testResult.color 
                                : unknownIon.solutionColor,
                              position: 'relative',
                              transition: 'background-color 1.5s ease'
                            }}
                          >
                            {/* Hiệu ứng sủi bọt khí */}
                            {testResult && testResult.hasBubbles && (
                              <div className="bubbles-container">
                                {[...Array(15)].map((_, i) => {
                                  const sizeClasses = ['tiny', 'tiny', 'small', 'small', 'medium', 'medium', 'large', 'xlarge'];
                                  const randomSize = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
                                  return (
                                    <div 
                                      key={i}
                                      className={`bubble ${randomSize}`}
                                      style={{
                                        left: `${15 + Math.random() * 70}%`,
                                        animationDelay: `${Math.random() * 2.5}s`,
                                        animationDuration: `${2 + Math.random() * 1.5}s`
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            )}
                            
                            {/* Hiệu ứng kết tủa */}
                            {testResult && 
                             testResult.color !== 'transparent' && 
                             !testResult.hasBubbles && 
                             !testResult.isSolutionChange &&
                             !testResult.isLitmusTest &&
                             !testResult.isMetalReaction && (
                              <>
                                {/* Lớp kết tủa chính */}
                                <div 
                                  className="precipitate"
                                  style={{ backgroundColor: testResult.color }}
                                >
                                  {/* Các hạt kết tủa nhỏ lắng xuống */}
                                  <div className="precipitate-particles">
                                    {[...Array(18)].map((_, i) => {
                                      const sizeClasses = ['small', 'small', 'medium', 'medium', 'medium', 'large'];
                                      const randomSize = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
                                      return (
                                        <div 
                                          key={i}
                                          className={`precipitate-particle ${randomSize}`}
                                          style={{
                                            left: `${Math.random() * 85 + 5}%`,
                                            animationDelay: `${Math.random() * 1.2}s`,
                                            animationDuration: `${1.5 + Math.random() * 0.8}s`,
                                            backgroundColor: testResult.color
                                          }}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                            
                            {/* Hiển thị tờ quỳ đổi màu trong bình */}
                            {testResult && testResult.isLitmusTest && (
                              <div className="litmus-in-solution">
                                <div 
                                  className="litmus-paper-in-flask"
                                  style={{ backgroundColor: getLitmusColorAfterReaction(testResult.color) }}
                                >
                                  <div className="litmus-shine"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flask-label">
                            {testResult ? testResult.reagent : `Bình ${beakerIndex + 1}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kết quả thí nghiệm - Hiển thị ngay khi có kết quả */}
          {testResults.length > 0 && (
            <div className="test-results">
              <h3>📋 Kết quả quan sát:</h3>
              <div className="results-list">
                {testResults.map((test, idx) => (
                  <div key={idx} className="result-item">
                    <div className="result-header">
                      <strong>Thí nghiệm {idx + 1}:</strong> {test.reagent}
                    </div>
                    <div className="result-content">
                      {/* Hiển thị tờ quỳ đã đổi màu nếu là quỳ tím */}
                      {test.reagent.includes('Quỳ') && test.isLitmusTest && (
                        <div className="litmus-result">
                          <div 
                            className="litmus-paper-result" 
                            style={{ backgroundColor: getLitmusColorAfterReaction(test.color) }}
                          >
                            <div className="litmus-shine"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Hiển thị thanh kim loại đã đổi màu nếu là phản ứng kim loại */}
                      {test.reagent.includes('Kim loại') && test.isMetalReaction && (
                        <div className="metal-result">
                          <div className="metal-rod-result">
                            {/* Phần trên: Màu kim loại gốc */}
                            <div className="metal-result-top" style={{ backgroundColor: getReagentColor(test.reagent) }}></div>
                            {/* Phần dưới: Màu đã phủ */}
                            <div className="metal-result-bottom" style={{ backgroundColor: test.color }}></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="result-phenomenon">
                        <span className="phenomenon-label">Hiện tượng:</span>
                        <span className="phenomenon-text">{test.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nút gợi ý */}
          {!showAnswer && (
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
                  <Lightbulb size={20} />
                  <p>{currentQ.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Phần chọn đáp án */}
          {canSubmit && !showAnswer && (
            <div className="answer-section">
              <h3>🔬 Dung dịch X là chất gì?</h3>
              <div className="ion-options">
                {ionOptions.map((ionKey) => {
                  const ion = ionDatabase[ionKey];
                  return (
                    <button
                      key={ionKey}
                      className={`ion-option ${selectedAnswer === ionKey ? 'selected' : ''}`}
                      onClick={() => handleSelectAnswer(ionKey)}
                    >
                      <span className="ion-formula">{ion.formula}</span>
                      <span className="ion-name">{ion.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="submit-section">
                <button 
                  className="reset-btn"
                  onClick={handleReset}
                >
                  🔄 Làm lại thí nghiệm
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                >
                  ✓ Xác nhận đáp án
                </button>
              </div>
            </div>
          )}

          {/* Hiển thị kết quả */}
          {showAnswer && (
            <div className={`answer-result ${selectedAnswer === currentQ.unknownSolution ? 'correct' : 'incorrect'}`}>
              <h3>
                {selectedAnswer === currentQ.unknownSolution ? '✓ Chính xác!' : '✗ Chưa đúng'}
              </h3>
              <div className="correct-answer">
                <p>Đáp án đúng: <strong>{ionDatabase[currentQ.unknownSolution].formula} - {ionDatabase[currentQ.unknownSolution].name}</strong></p>
              </div>
              <div className="explanation-section">
                <h4>Giải thích:</h4>
                <div className="all-reactions">
                  <p><strong>Các phản ứng đặc trưng của {ionDatabase[currentQ.unknownSolution].name}:</strong></p>
                  <ul>
                    {ionDatabase[currentQ.unknownSolution].reactions.map((reaction, idx) => (
                      <li key={idx}>
                        <strong>{reaction.reagent}:</strong> {reaction.result}
                        <br />
                        <code>{reaction.equation}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                onClick={handleNextQuestion}
                className="next-button"
              >
                {currentQuestion < experimentQuestions.length - 1 ? 'Thí nghiệm tiếp theo →' : 'Hoàn thành'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ResumeDialog
        show={showResumeDialog && !gameStarted}
        onResume={() => startGame(false)}
        onRestart={() => startGame(true)}
        progressInfo={getProgress() ? {
          current: getProgress().currentQuestion + 1,
          total: experimentQuestions.length,
          score: getProgress().score
        } : null}
      />
    </div>
  );
};

export default NhanBietDungDich;
