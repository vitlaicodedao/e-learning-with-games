// Grade 11 Physics Games Data
// Dữ liệu các trò chơi Vật lý lớp 11 - 12 games mới (4 chương × 3 games)
// Dựa theo SGK Vật lý 11 - Kết nối tri thức

export const grade11Games = [
  // ===== CHƯƠNG I: DAO ĐỘNG CƠ (Bài 1-7) =====
  // Nội dung: Dao động điều hòa, con lắc lò xo, con lắc đơn, năng lượng dao động, tổng hợp dao động, dao động tắt dần, cưỡng bức, cộng hưởng
  
  {
    id: 'lop11-c1-1',
    title: 'Simple Harmonic Motion Lab',
    slug: 'simple-harmonic-motion-lab',
    description: 'Thí nghiệm dao động điều hòa với lò xo và con lắc đơn',
    difficulty: 'medium',
    grade: 11,
    chapter: 1,
    icon: 'Activity',
    color: 'from-blue-500 to-cyan-600',
    topics: ['Dao động điều hòa', 'Con lắc lò xo', 'Con lắc đơn', 'Phương trình dao động', 'Đồ thị x-t, v-t, a-t'],
    estimatedTime: 15,
    path: '/physics-games/grade/11/simple-harmonic-motion-lab'
  },
  {
    id: 'lop11-c1-2',
    title: 'Oscillation Energy Master',
    slug: 'oscillation-energy-master',
    description: 'Khám phá năng lượng dao động và sự chuyển hóa năng lượng',
    difficulty: 'medium',
    grade: 11,
    chapter: 1,
    icon: 'Zap',
    color: 'from-purple-500 to-pink-500',
    topics: ['Động năng dao động', 'Thế năng dao động', 'Cơ năng', 'Bảo toàn năng lượng', 'Dao động tắt dần'],
    estimatedTime: 14,
    path: '/physics-games/grade/11/oscillation-energy-master'
  },
  {
    id: 'lop11-c1-3',
    title: 'Resonance Arena',
    slug: 'resonance-arena',
    description: 'Thử thách hiện tượng cộng hưởng và dao động cưỡng bức',
    difficulty: 'hard',
    grade: 11,
    chapter: 1,
    icon: 'Radio',
    color: 'from-red-500 to-orange-600',
    topics: ['Dao động cưỡng bức', 'Cộng hưởng', 'Tần số riêng', 'Biên độ cộng hưởng', 'Ứng dụng thực tế'],
    estimatedTime: 16,
    path: '/physics-games/grade/11/resonance-arena'
  },

  // ===== CHƯƠNG II: SÓNG CƠ VÀ ÂM (Bài 8-13) =====
  // Nội dung: Sóng cơ, phương trình sóng, giao thoa sóng, sóng dừng, đặc trưng âm, hiệu ứng Doppler
  
  {
    id: 'lop11-c2-1',
    title: 'Wave Interference Studio',
    slug: 'wave-interference-studio',
    description: 'Studio mô phỏng giao thoa sóng và sóng dừng',
    difficulty: 'medium',
    grade: 11,
    chapter: 2,
    icon: 'Waves',
    color: 'from-green-500 to-emerald-600',
    topics: ['Giao thoa sóng', 'Sóng dừng', 'Vân giao thoa', 'Bụng sóng', 'Nút sóng'],
    estimatedTime: 15,
    path: '/physics-games/grade/11/wave-interference-studio'
  },
  {
    id: 'lop11-c2-2',
    title: 'Sound Wave Explorer',
    slug: 'sound-wave-explorer',
    description: 'Khám phá sóng âm và các đặc trưng của âm',
    difficulty: 'medium',
    grade: 11,
    chapter: 2,
    icon: 'Volume2',
    color: 'from-indigo-500 to-purple-600',
    topics: ['Tần số âm', 'Cường độ âm', 'Mức cường độ âm', 'Độ cao âm', 'Âm sắc'],
    estimatedTime: 14,
    path: '/physics-games/grade/11/sound-wave-explorer'
  },
  {
    id: 'lop11-c2-3',
    title: 'Ultrasound Application Lab',
    slug: 'ultrasound-application-lab',
    description: 'Ứng dụng siêu âm trong y tế và công nghiệp',
    difficulty: 'hard',
    grade: 11,
    chapter: 2,
    icon: 'Activity',
    color: 'from-yellow-500 to-orange-500',
    topics: ['Siêu âm', 'Hiệu ứng Doppler', 'SONAR', 'Đo khoảng cách', 'Y học'],
    estimatedTime: 16,
    path: '/physics-games/grade/11/ultrasound-application-lab'
  },

  // ===== CHƯƠNG III: ĐIỆN HỌC (Bài 14-20) =====
  // Nội dung: Điện tích, điện trường, tụ điện, dòng điện không đổi, định luật Ohm, công suất điện
  
  {
    id: 'lop11-c3-1',
    title: 'Electric Field Visualizer',
    slug: 'electric-field-visualizer',
    description: 'Trực quan hóa điện trường và lực điện',
    difficulty: 'medium',
    grade: 11,
    chapter: 3,
    icon: 'Zap',
    color: 'from-cyan-500 to-blue-600',
    topics: ['Điện trường', 'Đường sức điện', 'Điện thế', 'Lực điện', 'Định luật Coulomb'],
    estimatedTime: 15,
    path: '/physics-games/grade/11/electric-field-visualizer'
  },
  {
    id: 'lop11-c3-2',
    title: 'Capacitor Circuit Lab',
    slug: 'capacitor-circuit-lab',
    description: 'Thí nghiệm tụ điện và mạch điện tụ',
    difficulty: 'hard',
    grade: 11,
    chapter: 3,
    icon: 'Battery',
    color: 'from-lime-500 to-green-600',
    topics: ['Tụ điện', 'Điện dung', 'Nạp tụ', 'Xả tụ', 'Năng lượng tụ điện', 'Ghép tụ'],
    estimatedTime: 16,
    path: '/physics-games/grade/11/capacitor-circuit-lab'
  },
  {
    id: 'lop11-c3-3',
    title: 'DC Circuit Master',
    slug: 'dc-circuit-master',
    description: 'Thành thạo phân tích mạch điện một chiều phức tạp',
    difficulty: 'hard',
    grade: 11,
    chapter: 3,
    icon: 'GitBranch',
    color: 'from-sky-500 to-cyan-600',
    topics: ['Định luật Kirchhoff', 'Mạch phức tạp', 'Cầu Wheatstone', 'Công suất', 'Hiệu suất'],
    estimatedTime: 17,
    path: '/physics-games/grade/11/dc-circuit-master'
  },

  // ===== CHƯƠNG IV: TỪ TRƯỜNG VÀ CẢM ỨNG ĐIỆN TỪ (Bài 21-26) =====
  // Nội dung: Từ trường, lực từ, cảm ứng điện từ, dòng điện xoay chiều, máy biến áp
  
  {
    id: 'lop11-c4-1',
    title: 'Magnetic Field Explorer',
    slug: 'magnetic-field-explorer',
    description: 'Khám phá từ trường và lực từ',
    difficulty: 'medium',
    grade: 11,
    chapter: 4,
    icon: 'Magnet',
    color: 'from-violet-500 to-purple-600',
    topics: ['Từ trường', 'Lực Lorentz', 'Lực từ', 'Chuyển động hạt trong từ trường', 'Quy tắc bàn tay trái'],
    estimatedTime: 15,
    path: '/physics-games/grade/11/magnetic-field-explorer'
  },
  {
    id: 'lop11-c4-2',
    title: 'Electromagnetic Induction Lab',
    slug: 'electromagnetic-induction-lab',
    description: 'Thí nghiệm cảm ứng điện từ và định luật Faraday',
    difficulty: 'hard',
    grade: 11,
    chapter: 4,
    icon: 'Cpu',
    color: 'from-orange-500 to-red-600',
    topics: ['Cảm ứng điện từ', 'Định luật Faraday', 'Định luật Lenz', 'Suất điện động cảm ứng', 'Máy phát điện'],
    estimatedTime: 16,
    path: '/physics-games/grade/11/electromagnetic-induction-lab'
  },
  {
    id: 'lop11-c4-3',
    title: 'AC Circuit Simulator',
    slug: 'ac-circuit-simulator',
    description: 'Mô phỏng mạch điện xoay chiều RLC',
    difficulty: 'hard',
    grade: 11,
    chapter: 4,
    icon: 'Radio',
    color: 'from-amber-500 to-orange-600',
    topics: ['Dòng điện xoay chiều', 'Mạch RLC', 'Cộng hưởng điện', 'Hệ số công suất', 'Giản đồ vector'],
    estimatedTime: 18,
    path: '/physics-games/grade/11/ac-circuit-simulator'
  }
];

export default grade11Games;
