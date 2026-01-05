// Grade 12 Physics Games Data
// Dữ liệu các trò chơi Vật lý lớp 12 - 8 games mới (4 chương × 2 games)
// Dựa theo SGK Vật lý 12 - Kết nối tri thức

export const grade12Games = [
  // ===== CHƯƠNG I: DAO ĐỘNG VÀ SÓNG ĐIỆN TỪ (Bài 1-6) =====
  // Nội dung: Dao động điện từ, mạch LC, năng lượng, sóng điện từ, thông tin liên lạc
  
  {
    id: 'lop12-c1-1',
    title: 'LC Oscillator Lab',
    slug: 'lc-oscillator-lab',
    description: 'Mô phỏng dao động điện từ trong mạch LC với đồ thị năng lượng',
    difficulty: 'hard',
    grade: 12,
    chapter: 1,
    icon: 'Radio',
    color: 'from-blue-500 to-indigo-600',
    topics: ['Dao động điện từ', 'Mạch LC', 'Tần số dao động', 'Năng lượng điện từ', 'Định luật bảo toàn năng lượng'],
    estimatedTime: 18,
    path: '/physics-games/grade/12/lc-oscillator-lab'
  },
  {
    id: 'lop12-c1-2',
    title: 'Electromagnetic Wave Studio',
    slug: 'electromagnetic-wave-studio',
    description: 'Khám phá sóng điện từ, tần số, bước sóng và ứng dụng truyền thông',
    difficulty: 'medium',
    grade: 12,
    chapter: 1,
    icon: 'Waves',
    color: 'from-purple-500 to-pink-600',
    topics: ['Sóng điện từ', 'Tần số & bước sóng', 'Truyền sóng', 'Ứng dụng thông tin', 'Phổ sóng điện từ'],
    estimatedTime: 16,
    path: '/physics-games/grade/12/electromagnetic-wave-studio'
  },

  // ===== CHƯƠNG II: SÓNG ÁNH SÁNG (Bài 7-12) =====
  // Nội dung: Tán sắc, giao thoa, nhiễu xạ, phổ ánh sáng, tia hồng ngoại, tử ngoại, X
  
  {
    id: 'lop12-c2-1',
    title: 'Light Interference Simulator',
    slug: 'light-interference-simulator',
    description: 'Thí nghiệm giao thoa ánh sáng Young với vân sáng, vân tối',
    difficulty: 'hard',
    grade: 12,
    chapter: 2,
    icon: 'Sparkles',
    color: 'from-yellow-400 to-orange-500',
    topics: ['Giao thoa ánh sáng', 'Thí nghiệm Young', 'Vân giao thoa', 'Khoảng vân', 'Bước sóng ánh sáng'],
    estimatedTime: 20,
    path: '/physics-games/grade/12/light-interference-simulator'
  },
  {
    id: 'lop12-c2-2',
    title: 'Spectrum Explorer',
    slug: 'spectrum-explorer',
    description: 'Khám phá phổ ánh sáng: tán sắc, phổ liên tục, phổ vạch',
    difficulty: 'medium',
    grade: 12,
    chapter: 2,
    icon: 'Rainbow',
    color: 'from-pink-400 via-purple-400 to-blue-400',
    topics: ['Tán sắc ánh sáng', 'Lăng kính', 'Phổ liên tục', 'Phổ vạch', 'Ánh sáng đơn sắc'],
    estimatedTime: 15,
    path: '/physics-games/grade/12/spectrum-explorer'
  },

  // ===== CHƯƠNG III: LƯỢNG TỬ ÁNH SÁNG (Bài 13-17) =====
  // Nội dung: Thuyết lượng tử, photon, hiện tượng quang điện, pin quang điện
  
  {
    id: 'lop12-c3-1',
    title: 'Photoelectric Effect Lab',
    slug: 'photoelectric-effect-lab',
    description: 'Thí nghiệm hiện tượng quang điện với photon và electron',
    difficulty: 'hard',
    grade: 12,
    chapter: 3,
    icon: 'Lightbulb',
    color: 'from-cyan-500 to-blue-600',
    topics: ['Hiện tượng quang điện', 'Năng lượng photon', 'Công thoát', 'Động năng electron', 'Định luật Einstein'],
    estimatedTime: 22,
    path: '/physics-games/grade/12/photoelectric-effect-lab'
  },
  {
    id: 'lop12-c3-2',
    title: 'Solar Cell Optimizer',
    slug: 'solar-cell-optimizer',
    description: 'Tối ưu hóa pin mặt trời với hiệu suất và năng lượng',
    difficulty: 'medium',
    grade: 12,
    chapter: 3,
    icon: 'Sun',
    color: 'from-yellow-500 to-amber-600',
    topics: ['Pin quang điện', 'Hiệu suất pin', 'Cường độ ánh sáng', 'Điện áp & dòng điện', 'Ứng dụng năng lượng'],
    estimatedTime: 17,
    path: '/physics-games/grade/12/solar-cell-optimizer'
  },

  // ===== CHƯƠNG IV: VẬT LÝ HạT NHÂN (Bài 18-23) =====
  // Nội dung: Cấu tạo hạt nhân, năng lượng liên kết, phóng xạ, phản ứng hạt nhân
  
  {
    id: 'lop12-c4-1',
    title: 'Nuclear Reaction Chamber',
    slug: 'nuclear-reaction-chamber',
    description: 'Mô phỏng phản ứng hạt nhân: phân hạch và nhiệt hạch',
    difficulty: 'hard',
    grade: 12,
    chapter: 4,
    icon: 'Atom',
    color: 'from-green-500 to-emerald-600',
    topics: ['Phản ứng hạt nhân', 'Phân hạch', 'Nhiệt hạch', 'Năng lượng liên kết', 'Định luật bảo toàn'],
    estimatedTime: 25,
    path: '/physics-games/grade/12/nuclear-reaction-chamber'
  },
  {
    id: 'lop12-c4-2',
    title: 'Radioactive Decay Simulator',
    slug: 'radioactive-decay-simulator',
    description: 'Khám phá phóng xạ với chu kỳ bán rã và định luật phân rã',
    difficulty: 'medium',
    grade: 12,
    chapter: 4,
    icon: 'RadioTower',
    color: 'from-red-500 to-rose-600',
    topics: ['Phóng xạ', 'Chu kỳ bán rã', 'Định luật phân rã', 'Các loại tia phóng xạ', 'Ứng dụng đồng vị'],
    estimatedTime: 18,
    path: '/physics-games/grade/12/radioactive-decay-simulator'
  },
];
