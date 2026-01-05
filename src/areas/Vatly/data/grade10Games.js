// Grade 10 Physics Games Data
// Dữ liệu các trò chơi Vật lý lớp 10 - 14 games mới (7 chương × 2 games)
// Dựa theo SGK Vật lý 10 cơ bản

export const grade10Games = [
  // ===== CHƯƠNG I: ĐỘNG HỌC CHẤT ĐIỂM (Bài 1-7) =====
  // Nội dung: Chuyển động thẳng đều, chuyển động thẳng biến đổi đều, rơi tự do, chuyển động tròn đều
  
  {
    id: 'lop10-c1-1',
    title: 'Motion Tracker',
    slug: 'motion-tracker',
    description: 'Mô phỏng và phân tích các loại chuyển động thẳng đều và biến đổi đều',
    difficulty: 'medium',
    grade: 10,
    chapter: 1,
    icon: 'TrendingUp',
    color: 'from-blue-500 to-cyan-600',
    topics: ['Chuyển động thẳng đều', 'Chuyển động biến đổi đều', 'Phương trình chuyển động', 'Đồ thị v-t, x-t'],
    estimatedTime: 15,
    path: '/physics-games/grade/10/motion-tracker'
  },
  {
    id: 'lop10-c1-2',
    title: 'Free Fall Lab',
    slug: 'free-fall-lab',
    description: 'Thí nghiệm rơi tự do và chuyển động ném theo phương thẳng đứng',
    difficulty: 'medium',
    grade: 10,
    chapter: 1,
    icon: 'ArrowDown',
    color: 'from-purple-500 to-pink-500',
    topics: ['Rơi tự do', 'Gia tốc trọng trường', 'Ném lên cao', 'Ném xuống', 'Phương trình chuyển động'],
    estimatedTime: 14,
    path: '/physics-games/grade/10/free-fall-lab'
  },

  // ===== CHƯƠNG II: ĐỘNG LỰC HỌC CHẤT ĐIỂM (Bài 8-15) =====
  // Nội dung: Ba định luật Newton, lực hấp dẫn, lực đàn hồi, lực ma sát, chuyển động ném ngang
  
  {
    id: 'lop10-c2-1',
    title: 'Newton\'s Laws Arena',
    slug: 'newtons-laws-arena',
    description: 'Khám phá ba định luật Newton qua các tình huống tương tác',
    difficulty: 'hard',
    grade: 10,
    chapter: 2,
    icon: 'Atom',
    color: 'from-red-500 to-orange-600',
    topics: ['Định luật I Newton', 'Định luật II Newton', 'Định luật III Newton', 'Lực và gia tốc'],
    estimatedTime: 16,
    path: '/physics-games/grade/10/newtons-laws-arena'
  },
  {
    id: 'lop10-c2-2',
    title: 'Friction & Tension Master',
    slug: 'friction-tension-master',
    description: 'Thí nghiệm với lực ma sát và lực căng dây',
    difficulty: 'hard',
    grade: 10,
    chapter: 2,
    icon: 'Grip',
    color: 'from-green-500 to-emerald-600',
    topics: ['Lực ma sát', 'Lực căng dây', 'Mặt phẳng nghiêng', 'Hệ ròng rọc'],
    estimatedTime: 17,
    path: '/physics-games/grade/10/friction-tension-master'
  },

  // ===== CHƯƠNG III: CÂN BẰNG VÀ CHUYỂN ĐỘNG CỦA VẬT RẮN (Bài 16-19) =====
  // Nội dung: Moment lực, quy tắc moment, trọng tâm, các dạng cân bằng
  
  {
    id: 'lop10-c3-1',
    title: 'Equilibrium Challenge',
    slug: 'equilibrium-challenge',
    description: 'Thử thách điều kiện cân bằng và phân tích lực',
    difficulty: 'medium',
    grade: 10,
    chapter: 3,
    icon: 'Scale',
    color: 'from-indigo-500 to-purple-600',
    topics: ['Điều kiện cân bằng', 'Phân tích lực', 'Cân bằng tịnh tiến', 'Cân bằng quay'],
    estimatedTime: 14,
    path: '/physics-games/grade/10/equilibrium-challenge'
  },
  {
    id: 'lop10-c3-2',
    title: 'Rotation Dynamics',
    slug: 'rotation-dynamics',
    description: 'Khám phá chuyển động quay và moment lực',
    difficulty: 'hard',
    grade: 10,
    chapter: 3,
    icon: 'RotateCw',
    color: 'from-yellow-500 to-orange-500',
    topics: ['Moment lực', 'Chuyển động quay', 'Moment quán tính', 'Quy tắc moment'],
    estimatedTime: 15,
    path: '/physics-games/grade/10/rotation-dynamics'
  },

  // ===== CHƯƠNG IV: CÁC ĐỊNH LUẬT BẢO TOÀN (Bài 20-26) =====
  // Nội dung: Động lượng, định luật bảo toàn động lượng, công và công suất, động năng, thế năng
  
  {
    id: 'lop10-c4-1',
    title: 'Work Energy Theorem Lab',
    slug: 'work-energy-theorem-lab',
    description: 'Thí nghiệm định lý động năng và công',
    difficulty: 'hard',
    grade: 10,
    chapter: 4,
    icon: 'Zap',
    color: 'from-cyan-500 to-blue-600',
    topics: ['Công', 'Động năng', 'Định lý động năng', 'Công suất'],
    estimatedTime: 16,
    path: '/physics-games/grade/10/work-energy-theorem-lab'
  },
  {
    id: 'lop10-c4-2',
    title: 'Mechanical Energy Quest',
    slug: 'mechanical-energy-quest',
    description: 'Hành trình năng lượng cơ học và bảo toàn',
    difficulty: 'medium',
    grade: 10,
    chapter: 4,
    icon: 'Battery',
    color: 'from-lime-500 to-green-600',
    topics: ['Cơ năng', 'Động năng', 'Thế năng', 'Bảo toàn cơ năng'],
    estimatedTime: 15,
    path: '/physics-games/grade/10/mechanical-energy-quest'
  },

  // ===== CHƯƠNG V: CHẤT KHÍ (Bài 27-30) =====
  // Nội dung: Cấu trúc chất, thuyết động học phân tử, các định luật về chất khí
  
  {
    id: 'lop10-c5-1',
    title: 'Heat Transfer Simulator',
    slug: 'heat-transfer-simulator',
    description: 'Mô phỏng truyền nhiệt và nhiệt lượng',
    difficulty: 'medium',
    grade: 10,
    chapter: 5,
    icon: 'Flame',
    color: 'from-sky-500 to-cyan-600',
    topics: ['Truyền nhiệt', 'Nhiệt lượng', 'Q=mcΔT', 'Cân bằng nhiệt'],
    estimatedTime: 14,
    path: '/physics-games/grade/10/heat-transfer-simulator'
  },
  {
    id: 'lop10-c5-2',
    title: 'Gas Laws Explorer',
    slug: 'gas-laws-explorer',
    description: 'Khám phá các định luật khí lý tưởng',
    difficulty: 'medium',
    grade: 10,
    chapter: 5,
    icon: 'Wind',
    color: 'from-violet-500 to-purple-600',
    topics: ['PV=nRT', 'Đẳng nhiệt', 'Đẳng áp', 'Đẳng tích'],
    estimatedTime: 12,
    path: '/physics-games/grade/10/gas-laws-explorer'
  },

  // ===== CHƯƠNG VI: CƠ SỞ CỦA NHIỆT ĐỘNG LỰC HỌC (Bài 31-35) =====
  // Nội dung: Nội năng, nhiệt lượng, nguyên lý I nhiệt động lực học, các nguyên lý II
  
  {
    id: 'lop10-c6-1',
    title: 'Ideal Gas Playground',
    slug: 'ideal-gas-playground',
    description: 'Sân chơi khí lý tưởng và các định luật',
    difficulty: 'medium',
    grade: 10,
    chapter: 6,
    icon: 'Atom',
    color: 'from-orange-500 to-red-600',
    topics: ['Boyle', 'Charles', 'Gay-Lussac', 'Combined Gas Law'],
    estimatedTime: 17,
    path: '/physics-games/grade/10/ideal-gas-playground'
  },
  {
    id: 'lop10-c6-2',
    title: 'Molecular Motion Studio',
    slug: 'molecular-motion-studio',
    description: 'Studio chuyển động phân tử và động học',
    difficulty: 'hard',
    grade: 10,
    chapter: 6,
    icon: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    topics: ['Động học phân tử', 'RMS speed', 'Mean free path', 'P-T relation'],
    estimatedTime: 14,
    path: '/physics-games/grade/10/molecular-motion-studio'
  },

  // ===== CHƯƠNG VII: CHẤT RẮN VÀ CHẤT LỎNG - SỰ CHUYỂN THỂ (Bài 36-40) =====
  // Nội dung: Cấu trúc chất rắn, biến dạng, sức căng bề mặt, sự nóng chảy và bay hơi
  
  {
    id: 'lop10-c7-1',
    title: 'Thermodynamic Cycles',
    slug: 'thermodynamic-cycles',
    description: 'Chu trình nhiệt động: Carnot, Otto, Diesel',
    difficulty: 'hard',
    grade: 10,
    chapter: 7,
    icon: 'Repeat',
    color: 'from-slate-500 to-gray-600',
    topics: ['Carnot', 'Otto', 'Diesel', 'Hiệu suất', 'P-V diagram'],
    estimatedTime: 13,
    path: '/physics-games/grade/10/thermodynamic-cycles'
  },
  {
    id: 'lop10-c7-2',
    title: 'Heat Engine Optimizer',
    slug: 'heat-engine-optimizer',
    description: 'Tối ưu hóa động cơ nhiệt và máy lạnh',
    difficulty: 'hard',
    grade: 10,
    chapter: 7,
    icon: 'Settings',
    color: 'from-blue-500 to-indigo-600',
    topics: ['Động cơ nhiệt', 'Máy lạnh', 'COP', 'η = W/Qh'],
    estimatedTime: 15,
    path: '/physics-games/grade/10/heat-engine-optimizer'
  }
];

export default grade10Games;
