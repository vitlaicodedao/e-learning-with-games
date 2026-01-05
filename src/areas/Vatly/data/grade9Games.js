// Grade 9 Physics Games Data
// Dữ liệu các trò chơi Vật lý lớp 9 - 12 games mới + games legacy

export const grade9Games = [
  // ===== CHƯƠNG I: ĐIỆN HỌC =====
  {
    id: 'lop9-c1-1',
    title: 'Ohm Law Circuit Lab',
    slug: 'ohm-law-circuit-lab',
    description: 'Khám phá định luật Ôm qua thí nghiệm mạch điện tương tác',
    difficulty: 'medium',
    grade: 9,
    chapter: 1,
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-500',
    topics: ['Định luật Ôm', 'Điện trở', 'Hiệu điện thế', 'Cường độ dòng điện'],
    estimatedTime: 12,
    path: '/physics-games/grade/9/ohm-law-circuit-lab'
  },
  {
    id: 'lop9-c1-2',
    title: 'Circuit Builder Pro',
    slug: 'circuit-builder-pro',
    description: 'Xây dựng mạch điện nối tiếp và song song với tính toán chính xác',
    difficulty: 'hard',
    grade: 9,
    chapter: 1,
    icon: 'CircuitBoard',
    color: 'from-blue-500 to-indigo-600',
    topics: ['Mạch nối tiếp', 'Mạch song song', 'Tính toán mạch điện', 'Biến trở'],
    estimatedTime: 15,
    path: '/physics-games/grade/9/circuit-builder-pro'
  },
  {
    id: 'lop9-c1-3',
    title: 'Power & Heat Master',
    slug: 'power-heat-master',
    description: 'Quản lý công suất điện và tác dụng nhiệt của dòng điện',
    difficulty: 'hard',
    grade: 9,
    chapter: 1,
    icon: 'Flame',
    color: 'from-red-500 to-orange-600',
    topics: ['Công suất điện', 'Định luật Jun-Lenxơ', 'Điện năng', 'Tiết kiệm điện'],
    estimatedTime: 13,
    path: '/physics-games/grade/9/power-heat-master'
  },

  // ===== CHƯƠNG II: ĐIỆN TỪ HỌC =====
  {
    id: 'lop9-c2-1',
    title: 'Magnetic Field Explorer',
    slug: 'magnetic-field-explorer',
    description: 'Khám phá từ trường của nam châm và dòng điện',
    difficulty: 'medium',
    grade: 9,
    chapter: 2,
    icon: 'Magnet',
    color: 'from-purple-500 to-pink-500',
    topics: ['Nam châm', 'Từ trường', 'Từ phổ', 'Đường sức từ'],
    estimatedTime: 11,
    path: '/physics-games/grade/9/magnetic-field-explorer'
  },
  {
    id: 'lop9-c2-2',
    title: 'Electromagnetic Induction Lab',
    slug: 'electromagnetic-induction-lab',
    description: 'Thí nghiệm cảm ứng điện từ và tạo dòng điện cảm ứng',
    difficulty: 'hard',
    grade: 9,
    chapter: 2,
    icon: 'Sparkles',
    color: 'from-cyan-500 to-blue-600',
    topics: ['Cảm ứng điện từ', 'Dòng điện cảm ứng', 'Từ thông', 'Quy tắc Lenxơ'],
    estimatedTime: 14,
    path: '/physics-games/grade/9/electromagnetic-induction-lab'
  },
  {
    id: 'lop9-c2-3',
    title: 'AC Generator Simulator',
    slug: 'ac-generator-simulator',
    description: 'Mô phỏng máy phát điện xoay chiều và truyền tải điện năng',
    difficulty: 'hard',
    grade: 9,
    chapter: 2,
    icon: 'PlugZap',
    color: 'from-green-500 to-teal-600',
    topics: ['Dòng điện xoay chiều', 'Máy phát điện', 'Máy biến thế', 'Truyền tải điện'],
    estimatedTime: 16,
    path: '/physics-games/grade/9/ac-generator-simulator'
  },

  // ===== CHƯƠNG III: QUANG HỌC =====
  {
    id: 'lop9-c3-1',
    title: 'Light Refraction Lab',
    slug: 'light-refraction-lab',
    description: 'Nghiên cứu hiện tượng khúc xạ ánh sáng qua các môi trường',
    difficulty: 'medium',
    grade: 9,
    chapter: 3,
    icon: 'Lightbulb',
    color: 'from-yellow-400 to-amber-500',
    topics: ['Khúc xạ ánh sáng', 'Chiết suất', 'Góc tới', 'Góc khúc xạ'],
    estimatedTime: 12,
    path: '/physics-games/grade/9/light-refraction-lab'
  },
  {
    id: 'lop9-c3-2',
    title: 'Lens Optics Challenge',
    slug: 'lens-optics-challenge',
    description: 'Giải các bài toán về thấu kính hội tụ và phân kì',
    difficulty: 'hard',
    grade: 9,
    chapter: 3,
    icon: 'Focus',
    color: 'from-indigo-500 to-purple-600',
    topics: ['Thấu kính hội tụ', 'Thấu kính phân kì', 'Tiêu cự', 'Tạo ảnh'],
    estimatedTime: 15,
    path: '/physics-games/grade/9/lens-optics-challenge'
  },
  {
    id: 'lop9-c3-3',
    title: 'Color Spectrum Studio',
    slug: 'color-spectrum-studio',
    description: 'Khám phá phổ màu và sự phân tích ánh sáng trắng',
    difficulty: 'medium',
    grade: 9,
    chapter: 3,
    icon: 'Palette',
    color: 'from-pink-500 to-rose-500',
    topics: ['Ánh sáng trắng', 'Phổ màu', 'Tán sắc', 'Trộn màu'],
    estimatedTime: 10,
    path: '/physics-games/grade/9/color-spectrum-studio'
  },

  // ===== CHƯƠNG IV: BẢO TOÀN VÀ CHUYỂN HÓA NĂNG LƯỢNG =====
  {
    id: 'lop9-c4-1',
    title: 'Energy Transformation Quest',
    slug: 'energy-transformation-quest',
    description: 'Hành trình khám phá sự chuyển hóa năng lượng trong tự nhiên',
    difficulty: 'medium',
    grade: 9,
    chapter: 4,
    icon: 'Zap',
    color: 'from-lime-500 to-green-600',
    topics: ['Chuyển hóa năng lượng', 'Bảo toàn năng lượng', 'Các dạng năng lượng'],
    estimatedTime: 11,
    path: '/physics-games/grade/9/energy-transformation-quest'
  },
  {
    id: 'lop9-c4-2',
    title: 'Power Plant Manager',
    slug: 'power-plant-manager',
    description: 'Quản lý các nhà máy điện: nhiệt điện, thủy điện, gió, mặt trời',
    difficulty: 'hard',
    grade: 9,
    chapter: 4,
    icon: 'Factory',
    color: 'from-slate-500 to-gray-600',
    topics: ['Nhiệt điện', 'Thủy điện', 'Năng lượng tái tạo', 'Hiệu suất'],
    estimatedTime: 14,
    path: '/physics-games/grade/9/power-plant-manager'
  },
  {
    id: 'lop9-c4-3',
    title: 'Energy Conservation Hero',
    slug: 'energy-conservation-hero',
    description: 'Trở thành anh hùng tiết kiệm năng lượng trong cuộc sống',
    difficulty: 'easy',
    grade: 9,
    chapter: 4,
    icon: 'Leaf',
    color: 'from-emerald-500 to-teal-500',
    topics: ['Tiết kiệm năng lượng', 'Bảo vệ môi trường', 'Sử dụng hiệu quả'],
    estimatedTime: 10,
    path: '/physics-games/grade/9/energy-conservation-hero'
  }
];

export default grade9Games;
