// gameIntroData.js - Dữ liệu giới thiệu cho tất cả các game

export const GAME_INTRO_DATA = {
  'lop10-1': {
    title: '🎯 Chuyển động ném xiên',
    description: 'Mô phỏng chuyển động ném xiên với ná thun. Tính toán góc bắn và lực để trúng mục tiêu, học về quỹ đạo parabol và các yếu tố ảnh hưởng đến chuyển động.',
    difficulty: 4,
    estimatedTime: '2-5 phút',
    howToPlay: [
      'Kéo ná thun: Nhấn và giữ chuột, kéo ngược để điều chỉnh góc và lực (kéo xa = lực mạnh)',
      'Quan sát quỹ đạo dự đoán màu đỏ trước khi bắn',
      'Nhả chuột hoặc nhấn "Bắn" để phóng viên đạn',
      'Viên đạn phải rơi trúng vào vùng mục tiêu (hình tròn)',
      'Vượt qua nhiều puzzle với độ khó tăng dần (có thể có chướng ngại vật)'
    ],
    scoring: {
      base: '100 điểm/puzzle',
      bonuses: [
        'Trúng tâm mục tiêu: +50 điểm',
        'Trúng gần tâm: +30 điểm',
        'Trúng rìa: +10 điểm'
      ],
      penalties: [
        'Lần thử 2-3: -10 điểm/lần',
        'Lần thử 4+: -20 điểm/lần'
      ],
      max: '~150 điểm/puzzle'
    },
    physics: [
      'Quỹ đạo parabol và chuyển động ném xiên',
      'Gia tốc trọng trường g = 9.8 m/s²',
      'Phân tích lực và vận tốc theo phương ngang/đứng',
      'Ảnh hưởng của góc bắn và vận tốc ban đầu'
    ]
  },

  'lop8-2': {
    title: '⚡ Mạch điện Plasma',
    description: 'Xây dựng mạch điện để tạo ra plasma và hoàn thành thử thách về dòng điện, điện áp. Học cách nối linh kiện và hiểu nguyên lý hoạt động của mạch điện.',
    difficulty: 4,
    estimatedTime: '3-5 phút',
    howToPlay: [
      'Chọn linh kiện từ thanh công cụ: Nguồn điện, Dây dẫn, Điện trở, Tụ điện, Ống plasma',
      'Kéo thả linh kiện vào bảng làm việc',
      'Nối dây: Click vào node (chấm tròn) của linh kiện, kéo đến node khác',
      'Tạo mạch kín: Cực dương → Linh kiện → Cực âm',
      'Game tự động tính toán và hiển thị hiệu ứng plasma khi đạt yêu cầu'
    ],
    scoring: {
      base: '200 điểm/level',
      bonuses: [
        'Dùng đúng số linh kiện tối thiểu: +100 điểm',
        'Hoàn thành < 30 giây: +50 điểm',
        'Hoàn thành 30-60 giây: +25 điểm',
        'Plasma ổn định đẹp: +30 điểm'
      ],
      penalties: [
        'Mỗi linh kiện thừa: -20 điểm'
      ],
      max: '~380 điểm/level'
    },
    physics: [
      'Định luật Ohm: V = I × R',
      'Công suất điện: P = V × I',
      'Mạch nối tiếp và song song',
      'Plasma và khí ion hóa'
    ]
  },

  'lop7-1': {
    title: '🎨 Color Master - Phối màu quang học',
    description: 'Học về phối màu ánh sáng RGB qua thí nghiệm với lăng kính, bộ lọc và đèn màu. Khám phá cách ánh sáng phối hợp tạo nên màu sắc.',
    difficulty: 3,
    estimatedTime: '2-4 phút',
    howToPlay: [
      'Đọc nhiệm vụ của từng module (tạo màu, tách sáng, lọc màu)',
      'Kéo thả công cụ: Đèn LED (RGB), Lăng kính, Bộ lọc màu, Màn hình',
      'Điều chỉnh góc lăng kính (kéo để xoay) và vị trí đèn',
      'Điều chỉnh độ sáng LED bằng slider',
      'Nhấn "Kiểm tra" để xem kết quả đúng/sai'
    ],
    scoring: {
      base: '150 điểm/module',
      bonuses: [
        'Đúng lần đầu: +50 điểm',
        'Đúng lần 2: +25 điểm',
        'Cách làm sáng tạo: +30 điểm'
      ],
      penalties: [
        'Dùng gợi ý: -20 điểm'
      ],
      max: '~230 điểm/module'
    },
    physics: [
      'Phối màu ánh sáng RGB (cộng màu)',
      'Tán sắc ánh sáng qua lăng kính',
      'Hấp thụ và phản xạ ánh sáng',
      'Nguyên lý hoạt động của bộ lọc màu'
    ]
  },

  'lop7-2': {
    title: '🧲 Thí nghiệm điện từ',
    description: 'Mô phỏng thí nghiệm cảm ứng điện từ của Faraday. Di chuyển nam châm qua cuộn dây để tạo dòng điện cảm ứng và làm sáng bóng đèn.',
    difficulty: 3,
    estimatedTime: '2-3 phút',
    howToPlay: [
      'Kéo nam châm bằng chuột, di chuyển xung quanh cuộn dây',
      'Quan sát kim điện kế lệch khi có dòng điện cảm ứng',
      'Di chuyển nhanh/chậm để thấy sự khác biệt về cường độ dòng',
      'Di chuyển nam châm vào/ra cuộn dây để đảo chiều dòng điện',
      'Hoàn thành thử thách: Làm sáng bóng đèn hoặc đạt giá trị dòng điện cụ thể'
    ],
    scoring: {
      base: '100 điểm/level',
      bonuses: [
        'Dòng điện mạnh (> 2A): +50 điểm',
        'Dòng điện trung bình (1-2A): +25 điểm',
        'Dao động ổn định: +30 điểm',
        'Giữ dòng liên tục > 5s: +40 điểm'
      ],
      penalties: [],
      max: '~220 điểm/level'
    },
    physics: [
      'Định luật Faraday về cảm ứng điện từ',
      'Định luật Lenz (chiều dòng điện cảm ứng)',
      'Từ thông và sự biến thiên từ thông',
      'Suất điện động cảm ứng: ε = -N × ΔΦ/Δt'
    ]
  },

  'lop6-1': {
    title: '⚖️ Thử thách đòn bẩy',
    description: 'Game về nguyên lý đòn bẩy và cân bằng moment lực. Đặt vật nặng vào các vị trí khác nhau để đòn bẩy cân bằng.',
    difficulty: 2,
    estimatedTime: '1-2 phút',
    howToPlay: [
      'Quan sát đòn bẩy với điểm tựa ở giữa và các vật đã đặt sẵn',
      'Kéo vật nặng từ kệ phía dưới lên các vị trí trên đòn bẩy',
      'Tính toán: Moment = Khối lượng × Khoảng cách',
      'Cân bằng khi: Moment bên trái = Moment bên phải',
      'Nhấn "Kiểm tra" để xem đòn bẩy có cân bằng không'
    ],
    scoring: {
      base: '120 điểm/puzzle',
      bonuses: [
        'Sai số < 0.1 kg.m (hoàn hảo): +50 điểm',
        'Sai số < 0.5 kg.m: +25 điểm',
        'Sai số < 1.0 kg.m: +10 điểm',
        'Dùng ít vật nhất: +30 điểm'
      ],
      penalties: [
        'Mỗi vật thừa: -5 điểm',
        'Mỗi lần thử lại: -15 điểm'
      ],
      max: '~200 điểm/puzzle'
    },
    physics: [
      'Nguyên lý đòn bẩy',
      'Moment lực: M = F × d',
      'Điều kiện cân bằng: ΣM = 0',
      'Trọng tâm và trọng lực'
    ]
  },

  'lop7-3': {
    title: '🎈 Điện tĩnh và bóng bay',
    description: 'Mô phỏng thí nghiệm điện tĩnh với bóng bay và áo len. Quan sát hiện tượng tích điện, hút và đẩy giữa các vật tích điện.',
    difficulty: 2,
    estimatedTime: '1-2 phút',
    howToPlay: [
      'Kéo bóng bay màu vàng đến áo len',
      'Di chuyển lên xuống nhiều lần để "cọ xát" và tích điện',
      'Quan sát electron (-) di chuyển từ áo sang bóng',
      'Thử nghiệm: Đưa bóng lại gần tường (bị hút), gần bóng khác (đẩy nhau)',
      'Hoàn thành thử thách: Làm bóng dính tường, tích điện 2 bóng'
    ],
    scoring: {
      base: '150 điểm/level',
      bonuses: [
        'Mỗi lần cọ xát thành công: +10 điểm',
        'Bóng dính tường > 3s: +40 điểm',
        '2 bóng đẩy nhau rõ ràng: +30 điểm',
        'Tóc bị hút theo: +20 điểm',
        'Thử tất cả tương tác: +50 điểm'
      ],
      penalties: [],
      max: '~300 điểm/level'
    },
    physics: [
      'Điện tĩnh và cọ xát',
      'Chuyển electron giữa các vật',
      'Lực hút/đẩy điện (định luật Coulomb)',
      'Cảm ứng điện'
    ]
  },

  'lop6-2': {
    title: '🔬 Phòng thí nghiệm Nano',
    description: 'Khám phá thế giới vi mô với công nghệ nano. Sử dụng "găng tay nano" để tương tác với nguyên tử, đo lường, và điều khiển ở cấp độ phân tử.',
    difficulty: 3,
    estimatedTime: '2-3 phút',
    howToPlay: [
      'Chọn găng tay công cụ: DI CHUYỂN, QUÉT (đo), LỰC (đàn hồi), NHIỆT',
      'Khu vực 1 - Cân nano: Dùng QUÉT để đo, dùng DI CHUYỂN để đặt nguyên tử lên cân đạt khối lượng mục tiêu',
      'Khu vực 2 - Bắn mục tiêu: Dùng LỰC để phóng hộp trúng bia',
      'Khu vực 3 - Co dãn nhiệt: Dùng NHIỆT làm lạnh để thanh kim loại co lại, lấy chìa khóa'
    ],
    scoring: {
      base: '180 điểm/khu vực',
      bonuses: [
        'Khu 1 - Sai số < 0.01 kg: +40 điểm',
        'Khu 2 - Trúng tâm bia: +50 điểm',
        'Khu 3 - Đúng nhiệt độ lần đầu: +40 điểm',
        'Hoàn thành < 45s: +30 điểm'
      ],
      penalties: [
        'Mỗi lần thử lại: -10 điểm'
      ],
      max: '~300 điểm/khu vực'
    },
    physics: [
      'Khối lượng nguyên tử',
      'Lực đàn hồi',
      'Co dãn vì nhiệt',
      'Tương tác ở cấp độ phân tử'
    ]
  },

  'lop6-3': {
    title: '🌡️ Phòng thí nghiệm Nhiệt học',
    description: 'Thí nghiệm về nhiệt độ, giãn nở nhiệt và áp suất qua 3 module: Cầu giãn nở, Bể cá, và Bóng bay. Học cách kiểm soát nhiệt độ an toàn.',
    difficulty: 3,
    estimatedTime: '2-4 phút',
    howToPlay: [
      'Module 1 - Cầu: Đặt gối đỡ con lăn để cầu không cong khi nóng, tăng nhiệt độ bằng slider',
      'Module 2 - Bể cá: Đặt ống tràn để nước không tràn khi nóng lên',
      'Module 3 - Bóng bay: Điều chỉnh cường độ nhiệt để thổi phồng bóng đúng kích thước (không nổ)'
    ],
    scoring: {
      base: '200 điểm/module',
      bonuses: [
        'Đặt đúng công cụ: +50 Eureka Points',
        'Điều khiển nhiệt độ tốt: +30 EP',
        'Không gây sự cố: +40 điểm'
      ],
      penalties: [
        'Cầu bị cong: -30 điểm',
        'Bể tràn: -40 điểm',
        'Bóng nổ: -50 điểm'
      ],
      max: '~320 điểm/module'
    },
    physics: [
      'Giãn nở nhiệt của chất rắn: ΔL = α × L × ΔT',
      'Giãn nở nhiệt của chất lỏng',
      'Định luật Gay-Lussac (khí): V/T = const',
      'Quan hệ áp suất và nhiệt độ'
    ]
  },

  'lop6-4': {
    title: '💧 Phòng thí nghiệm Nước',
    description: 'Mô phỏng ba trạng thái của nước và các chuyển thể. Điều khiển nhiệt độ để quan sát nóng chảy, đông đặc, bay hơi và ngưng tụ.',
    difficulty: 3,
    estimatedTime: '2-3 phút',
    howToPlay: [
      'Quan sát trạng thái ban đầu: lượng đá, nước, nhiệt độ',
      'Đặt nhiệt độ mục tiêu bằng slider (-20°C, 0°C, 50°C, 100°C)',
      'Bật/tắt nắp: Nắp đóng thì hơi nước ngưng tụ, nắp mở thì bay ra',
      'Quan sát hiện tượng chuyển thể tự động xảy ra',
      'Hoàn thành mục tiêu: Nấu chảy đá, giữ nhiệt độ, thu thập giọt ngưng tụ'
    ],
    scoring: {
      base: '1000 điểm',
      bonuses: [
        'Hoàn thành < 60s: +500 điểm',
        'Hoàn thành 60-120s: +300 điểm',
        'Hoàn thành 120-180s: +100 điểm',
        'Ít thay đổi nhiệt độ (hiệu suất): +300 điểm'
      ],
      penalties: [],
      max: '~1800 điểm/level'
    },
    physics: [
      'Ba trạng thái của chất: Rắn, Lỏng, Khí',
      'Chuyển thể: Nóng chảy, Đông đặc, Bay hơi, Ngưng tụ',
      'Nhiệt độ nóng chảy: 0°C',
      'Nhiệt độ sôi: 100°C (ở 1 atm)',
      'Nhiệt lượng chuyển thể'
    ]
  },

  // Quiz không cần intro phức tạp, có thể thêm nếu muốn
  'quiz': {
    title: '❓ Trắc nghiệm Vật lý',
    description: 'Kiểm tra kiến thức lý thuyết về các chủ đề vật lý qua câu hỏi trắc nghiệm.',
    difficulty: 1,
    estimatedTime: '5-10 phút',
    howToPlay: [
      'Đọc kỹ câu hỏi',
      'Chọn 1 trong 4 đáp án',
      'Nhận phản hồi ngay: Đúng (xanh ✅) hoặc Sai (đỏ ❌)',
      'Chuyển câu tiếp theo cho đến hết',
      'Xem kết quả tổng và chơi lại nếu muốn'
    ],
    scoring: {
      base: '1 điểm/câu đúng',
      bonuses: [],
      penalties: [],
      max: 'Số câu hỏi'
    },
    physics: [
      'Cơ học (lực, chuyển động)',
      'Nhiệt học (nhiệt độ, chuyển thể)',
      'Điện học (mạch điện, điện từ)',
      'Quang học (ánh sáng, màu sắc)'
    ]
  }
};
