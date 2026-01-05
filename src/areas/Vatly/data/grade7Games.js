// 9 Games cho Vật lý Lớp 7 theo SGK
// Chương 1: Quang học (Optics) - 9 bài học
// Chương 2: Âm học (Acoustics) - 6 bài học  
// Chương 3: Điện học (Electricity) - 14 bài học

export const grade7Games = [
  // CHƯƠNG 1: QUANG HỌC (3 games)
  {
    id: 'lop7-c1-1',
    title: 'Phản Xạ Ánh Sáng',
    slug: 'light-reflection',
    description: 'Khám phá định luật phản xạ ánh sáng và gương phẳng',
    difficulty: 'medium',
    grade: 7,
    chapter: 1,
    icon: '💡',
    color: 'from-yellow-400 to-amber-500',
    topics: ['Phản xạ ánh sáng', 'Định luật phản xạ', 'Gương phẳng'],
    estimatedTime: '15 phút',
    path: '/advanced-physics-challenge/light-reflection'
  },
  {
    id: 'lop7-c1-2',
    title: 'Phòng Thí Nghiệm Gương',
    slug: 'mirror-lab',
    description: 'Thực hành với gương phẳng, gương cầu lồi và lõm',
    difficulty: 'medium',
    grade: 7,
    chapter: 1,
    icon: '🪞',
    color: 'from-cyan-400 to-blue-500',
    topics: ['Gương phẳng', 'Gương cầu lồi', 'Gương cầu lõm', 'Ảnh'],
    estimatedTime: '20 phút',
    path: '/advanced-physics-challenge/mirror-lab'
  },
  {
    id: 'lop7-c1-3',
    title: 'Đường Đi Của Ánh Sáng',
    slug: 'light-path',
    description: 'Điều khiển ánh sáng qua gương và vật cản',
    difficulty: 'hard',
    grade: 7,
    chapter: 1,
    icon: '🔦',
    color: 'from-purple-400 to-indigo-600',
    topics: ['Truyền thẳng ánh sáng', 'Phản xạ', 'Tia sáng'],
    estimatedTime: '20 phút',
    path: '/advanced-physics-challenge/light-path'
  },

  // CHƯƠNG 2: ÂM HỌC (3 games)
  {
    id: 'lop7-c2-1',
    title: 'Thí Nghiệm Truyền Âm',
    slug: 'sound-transmission',
    description: 'Khám phá sự truyền âm qua các môi trường rắn, lỏng, khí.',
    difficulty: 'easy',
    grade: 7,
    chapter: 2,
    icon: '🌊',
    color: 'from-green-400 to-emerald-600',
    topics: ['Môi trường truyền âm', 'Tốc độ âm thanh', 'Vật liệu cách âm'],
    estimatedTime: '15 phút',
    path: '/physics-games/grade/7/sound-transmission'
  },
  {
    id: 'lop7-c2-2',
    title: 'Tần Số Sóng Âm',
    slug: 'wave-frequency',
    description: 'Điều chỉnh tần số và biên độ để tạo ra các nốt nhạc chính xác.',
    difficulty: 'medium',
    grade: 7,
    chapter: 2,
    icon: '🎵',
    color: 'from-pink-400 to-rose-600',
    topics: ['Độ cao âm', 'Độ to âm', 'Tần số', 'Biên độ'],
    estimatedTime: '15 phút',
    path: '/physics-games/grade/7/wave-frequency'
  },
  {
    id: 'lop7-c2-3',
    title: 'Khám Phá Tiếng Vang',
    slug: 'echo-explorer',
    description: 'Sử dụng hiện tượng phản xạ âm và tiếng vang để đo khoảng cách.',
    difficulty: 'medium',
    grade: 7,
    chapter: 2,
    icon: '📢',
    color: 'from-orange-400 to-red-500',
    topics: ['Phản xạ âm', 'Tiếng vang', 'Đo khoảng cách'],
    estimatedTime: '20 phút',
    path: '/physics-games/grade/7/echo-explorer'
  },

  // CHƯƠNG 3: ĐIỆN HỌC (3 games)
  {
    id: 'lop7-c3-1',
    title: 'Phòng Thí Nghiệm Tĩnh Điện',
    slug: 'electric-charge-lab',
    description: 'Thí nghiệm về sự nhiễm điện do cọ xát và tương tác giữa các điện tích.',
    difficulty: 'easy',
    grade: 7,
    chapter: 3,
    icon: '⚡',
    color: 'from-blue-400 to-indigo-600',
    topics: ['Nhiễm điện', 'Điện tích', 'Tương tác điện'],
    estimatedTime: '15 phút',
    path: '/physics-games/grade/7/electric-charge-lab'
  },
  {
    id: 'lop7-c3-2',
    title: 'Xây Dựng Mạch Điện',
    slug: 'circuit-builder',
    description: 'Lắp ráp các mạch điện nối tiếp và song song để làm sáng đèn.',
    difficulty: 'medium',
    grade: 7,
    chapter: 3,
    icon: '🔌',
    color: 'from-amber-400 to-yellow-600',
    topics: ['Mạch điện', 'Dòng điện', 'Hiệu điện thế', 'Điện trở'],
    estimatedTime: '25 phút',
    path: '/physics-games/grade/7/circuit-builder'
  },
  {
    id: 'lop7-c3-3',
    title: 'Các Tác Dụng Của Dòng Điện',
    slug: 'electric-effects',
    description: 'Khám phá tác dụng nhiệt, phát sáng, từ và hóa học của dòng điện.',
    difficulty: 'medium',
    grade: 7,
    chapter: 3,
    icon: '💫',
    color: 'from-purple-500 to-pink-600',
    topics: ['Tác dụng nhiệt', 'Tác dụng phát sáng', 'Tác dụng từ', 'Tác dụng hóa học'],
    estimatedTime: '20 phút',
    path: '/physics-games/grade/7/electric-effects'
  }
];
