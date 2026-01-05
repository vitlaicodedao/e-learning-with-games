/* PHẦN 1: DỮ LIỆU GAME GỐC (DATABASE)
  Chứa TOÀN BỘ thông tin cho tất cả các game
*/

// (THÊM MỚI) Định nghĩa các màu sắc vật lý cơ bản
// Đặt bên ngoài allGameData để có thể được tham chiếu bởi các hàm logic và data
const COLORS = {
  WHITE: '#FFFFFF',
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  MAGENTA: '#FF00FF',
  CYAN: '#00FFFF',
  BLACK: '#000000',
};

const allGameData = {
  // --- Lớp 6 - Bài 1 ---
  'lop6-1': {
    // 1a. Dữ liệu tóm tắt (cho Menu - Lấy từ code mới của bạn)
    type: 'balancechallenge',
    title: 'Thử Thách Cân Bằng - Balance Challenge (Lớp 6)',
    description: 'Sử dụng nguyên tắc mô-men quay L = F × d để làm cho đòn bẩy cân bằng.',
    levelSummary: [ { id: 'lvl1', title: 'Level set 1 (3 sets × 6 puzzles)' } ],

    // 1b. Dữ liệu chi tiết (cho Game - Lấy từ code gốc của bạn)
    pointsPerPuzzle: 2,
    tolerance: 0.1,
    detailedLevels: [
      // Level 1: Cân Bằng Đối Xứng
      {
        id: 'level-1', level: 1, title: 'Cân Bằng Đối Xứng', hint: 'Kéo thả vật nặng để cân bằng đòn bẩy.', showMarks: true,
        puzzles: [
          { id: '1-1', left: [{ mass: 15, distance: 2 }], target: { type: 'balance' } },
          { id: '1-2', left: [{ mass: 20, distance: 1 }], target: { type: 'balance' } },
          { id: '1-3', left: [{ mass: 30, distance: 2 }], target: { type: 'balance' } },
          { id: '1-4', left: [{ mass: 40, distance: 1 }], target: { type: 'balance' } },
          { id: '1-5', left: [{ mass: 20, distance: 2 }], target: { type: 'balance' } },
          { id: '1-6', left: [{ mass: 25, distance: 1 }], target: { type: 'balance' } }
        ]
      },
      // Level 2: Thử Thách Khối Lượng
      {
        id: 'level-2', level: 2, title: 'Thử Thách Khối Lượng', hint: 'Sử dụng các khối lượng để cân bằng đòn bẩy.', showMarks: true,
        puzzles: [
          { id: '2-1', left: [{ mass: 30, distance: 2 }], target: { type: 'balance' } },
          { id: '2-2', left: [{ mass: 25, distance: 4 }], target: { type: 'balance' } },
          { id: '2-3', left: [{ mass: 40, distance: 2 }], target: { type: 'balance' } },
          { id: '2-4', left: [{ mass: 35, distance: 3 }], target: { type: 'balance' } },
          { id: '2-5', left: [{ mass: 30, distance: 2 }], target: { type: 'balance' } },
          { id: '2-6', left: [{ mass: 35, distance: 3 }], target: { type: 'balance' } }
        ]
      },
      // Level 3: Vật Ẩn
      {
        id: 'level-3', level: 3, title: 'Cân Bằng Phức Hợp (Vật Ẩn)', hint: 'Bên trái có vật ẩn (?). Hãy cân bằng đòn bẩy.', showMarks: true,
        puzzles: [
          { id: '3-1', left: [{ mass: '?', distance: 2, hiddenAnswer: 20 }], target: { type: 'balance' } },
          { id: '3-2', left: [{ mass: '?', distance: 3, hiddenAnswer: 20 }], target: { type: 'balance' } },
          { id: '3-3', left: [{ mass: '?', distance: 2, hiddenAnswer: 45 }], target: { type: 'balance' } },
          { id: '3-4', left: [{ mass: '?', distance: 5, hiddenAnswer: 10 }], target: { type: 'balance' } },
          { id: '3-5', left: [{ mass: '?', distance: 4, hiddenAnswer: 15 }], target: { type: 'balance' } },
          { id: '3-6', left: [{ mass: '?', distance: 4, hiddenAnswer: 20 }], target: { type: 'balance' } }
        ]
      },
      // Level 4: Không vạch chia
      {
        id: 'level-4', level: 4, title: 'Thử Thách Nâng Cao (Không vạch)', hint: 'Ước lượng vị trí để cân bằng mà không có vạch chia.', showMarks: false,
        puzzles: [
          { id: '4-1', left: [{ mass: 60, distance: 2 }], target: { type: 'balance' } },
          { id: '4-2', left: [{ mass: 90, distance: 1 }], target: { type: 'balance' } },
          { id: '4-3', left: [{ mass: 7, distance: 5 }], target: { type: 'balance' } },
          { id: '4-4', left: [{ mass: 25, distance: 3 }], target: { type: 'balance' } },
          { id: '4-5', left: [{ mass: 15, distance: 4 }], target: { type: 'balance' } },
          { id: '4-6', left: [{ mass: 50, distance: 2 }], target: { type: 'balance' } }
        ]
      }
    ]
  },

  // --- Lớp 6 - Bài 2 (NANO LAB) ---
  'lop6-2': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'interactivepuzzler', // Loại game mới
    title: 'Phòng Thí Nghiệm Nano - Nano Lab (Lớp 6)',
    description: 'Tương tác với các vật thể để giải đố về Đo lường, Lực và Sự nở vì nhiệt.',
    levelSummary: [
      { id: 'zone1', title: 'Khu Vực 1: Đo Lường' },
      { id: 'zone2', title: 'Khu Vực 2: Lực' },
      { id: 'zone3', title: 'Khu Vực 3: Sự Nở Vì Nhiệt' }
    ],

    // 1b. Dữ liệu chi tiết (Đây là dữ liệu mà NanoLab.jsx sẽ cần)
    // Dữ liệu này được lấy từ file NanoLab.jsx mà chúng ta đã tạo
    detailedLevels: [
      { 
        id: 0, // id (số) khớp với logic trong component NanoLab.jsx
        title: 'Khu Vực 1: Đo Lường',
        objective: 'Đặt chính xác 2.5 kg lên bệ cảm biến để mở cửa.',
        items: [
          { id: 'a', name: 'Hộp A', weight: 1.0 },
          { id: 'b', name: 'Hộp B', weight: 1.5 },
          { id: 'c', name: 'Hộp C', weight: 2.0 }
        ],
        targetWeight: 2.5
      },
      { 
        id: 1, 
        title: 'Khu Vực 2: Lực',
        objective: 'Sử dụng lực đàn hồi để đưa khối hộp lên bục cao. (Đang xây dựng)',
      },
      { 
        id: 2, 
        title: 'Khu Vực 3: Sự Nở Vì Nhiệt',
        objective: 'Làm co thanh kim loại để lấy chìa khóa. (Đang xây dựng)',
      }
    ]
  },

  // === PHẦN CODE MỚI CHO lop6-3 (THERMO LAB) ===
  'lop6-3': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'interactivesimulation', // Kiểu game mô phỏng
    title: 'Phòng Thí Nghiệm Nhiệt - Thermo Lab (Lớp 6)',
    description: 'Thực hiện các thí nghiệm ảo về sự dãn nở vì nhiệt của chất rắn, lỏng, và khí.',
    levelSummary: [
      { id: 1, title: 'Mô-đun 1: Cây Cầu Cong Vênh' },
      { id: 2, title: 'Mô-đun 2: Giải Cứu Cá Vàng' },
      { id: 3, title: 'Mô-đun 3: Khinh Khí Cầu Mini' }
    ],

    // 1b. Dữ liệu chi tiết (Đây là dữ liệu mà ThermoLab.jsx sẽ cần)
    // Dữ liệu này được lấy từ ý tưởng gameModules.js
    detailedLevels: [
      {
        id: 1,
        title: "Mô-đun 1: Cây Cầu Cong Vênh",
        description: "Trời đang nóng dần lên! Hãy tìm cách giúp cây cầu không bị cong vênh khi nhiệt độ đạt 50°C.",
        subject: "Sự nở vì nhiệt của chất rắn",
        initialTemp: 20,
        targetTemp: 50,
        failTemp: 40, // Nhiệt độ bắt đầu hỏng nếu không có tool
        initialValue: 100, // % chiều dài ban đầu
        expansionFactor: 0.2, // % dãn ra mỗi độ C
        requiredTool: "roller",
        unit: "%", // Đơn vị của giá trị (chiều dài)
      },
      {
        id: 2,
        title: "Mô-đun 2: Giải Cứu Cá Vàng",
        description: "Bình nước đã đầy. Nếu đun nóng, nước nở ra sẽ làm vỡ bình! Làm sao để đun nước lên 40°C mà bình vẫn an toàn?",
        subject: "Sự nở vì nhiệt của chất lỏng",
        initialTemp: 10,
        targetTemp: 40,
        failTemp: 30, // Nhiệt độ bắt đầu vỡ/tràn nếu không có tool
        initialValue: 90, // % mực nước ban đầu
        expansionFactor: 0.5, // % mực nước tăng mỗi độ C
        requiredTool: "overflowPipe",
        unit: "%", // Đơn vị của giá trị (mực nước)
      },
      {
        id: 3,
        title: "Mô-đun 3: Khinh Khí Cầu Mini",
        description: "Không khí bên trong bình sẽ nở ra khi bị nung nóng. Hãy làm quả bóng bay lên bằng cách đạt 70°C.",
        subject: "Sự nở vì nhiệt của chất khí",
        initialTemp: 20,
        targetTemp: 70, // Nhiệt độ để bóng bay
        failTemp: 100, // Nhiệt độ làm nổ bóng
        initialValue: 10, // % kích thước bóng ban đầu
        expansionFactor: 1.5, // % kích thước tăng mỗi độ C
        requiredTool: "heatSource", // Đây là công cụ mặc định để chơi, không cần đặt
        unit: "%", // Đơn vị của giá trị (kích thước)
      }
    ],
    // Dữ liệu công cụ (tools) cho riêng game này
    tools: [
      {
        id: "roller",
        name: "Gối đỡ con lăn",
        description: "Cho phép vật rắn trượt khi dãn nở.",
        icon: "🔄",
      },
      {
        id: "overflowPipe",
        name: "Ống tràn",
        description: "Cho phép chất lỏng thừa chảy ra ngoài.",
        icon: " ống ",
      },
      {
        id: "heatSource",
        name: "Đèn cồn",
        description: "Dùng để tăng nhiệt độ.",
        icon: "🔥",
      },
      {
        id: "icePack",
        name: "Túi đá",
        description: "Dùng để giảm nhiệt độ.",
        icon: "🧊",
      }
    ]
  },
  // === KẾT THÚC PHẦN CODE lop6-3 ===

 // === PHẦN CODE MỚI CHO lop6-4 (WATER LAB) ===
  'lop6-4': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'interactivesimulation',
    title: 'Phòng Thí Nghiệm Biến Hình Của Nước - Water Lab (Lớp 6)',
    description: 'Mô phỏng các quá trình Nóng chảy, Đông đặc, Bay hơi và Ngưng tụ của nước.',
    levelSummary: [
      { id: 1, title: 'Thí Nghiệm 1: Sự Nóng Chảy' },
      { id: 2, title: 'Thí Nghiệm 2: Sự Đông Đặc' },
      { id: 3, title: 'Thí Nghiệm 3: Sự Bay Hơi' },
      { id: 4, title: 'Thí Nghiệm 4: Sự Ngưng Tụ' }
    ],

    // 1b. Dữ liệu chi tiết (Đây là dữ liệu mà WaterLab.jsx sẽ cần)
    detailedLevels: [
      {
        id: 1,
        title: "Thí Nghiệm 1: Sự Nóng Chảy",
        goalText: "Làm tan chảy hoàn toàn 100ml nước đá.",
        initialState: {
          iceVolume: 100,
          waterVolume: 0,
          temperature: -10,
          condensedDrops: 0,
          isLidOn: false,
        },
        // Điều kiện thắng: Không còn đá
        winCondition: (state) => state.iceVolume <= 0,
        // Hàm kiểm tra hiệu suất (tính điểm thưởng)
        efficiencyCheck: (state) => {
          // Bị trừ điểm nếu đun nước sôi (quá 90°C)
          if (state.temperature > 90) return -150; 
          return 0; // Hoàn hảo
        },
      },
      {
        id: 2,
        title: "Thí Nghiệm 2: Sự Đông Đặc",
        goalText: "Đóng băng toàn bộ 100ml nước.",
        initialState: {
          iceVolume: 0,
          waterVolume: 100,
          temperature: 25,
          condensedDrops: 0,
          isLidOn: false,
        },
        // Điều kiện thắng: Không còn nước lỏng
        winCondition: (state) => state.waterVolume <= 0,
        efficiencyCheck: (state) => {
          // Không có lỗi cụ thể cho màn này, luôn hiệu quả
          return 0;
        },
      },
      {
        id: 3,
        title: "Thí Nghiệm 3: Sự Bay Hơi",
        goalText: "Làm bay hơi chính xác 50ml nước (còn lại 50ml).",
        initialState: {
          iceVolume: 0,
          waterVolume: 100,
          temperature: 25,
          condensedDrops: 0,
          isLidOn: false,
        },
        // Điều kiện thắng: Nước còn lại 50ml hoặc ít hơn
        winCondition: (state) => state.waterVolume <= 50,
        efficiencyCheck: (state) => {
          // Trừ điểm nếu làm bay hơi quá nhiều (ví dụ: còn dưới 45ml)
          if (state.waterVolume < 45) {
            return -200; // Trừ nhiều điểm vì không "chính xác"
          }
          return 0;
        },
      },
      {
        id: 4,
        title: "Thí Nghiệm 4: Sự Ngưng Tụ",
        goalText: "Thu thập 10 giọt nước ngưng tụ trên nắp.",
        initialState: {
          iceVolume: 0,
          waterVolume: 100,
          temperature: 25,
          condensedDrops: 0,
          isLidOn: true, // Màn này có nắp
        },
        // Điều kiện thắng: Đủ 10 giọt
        winCondition: (state) => state.condensedDrops >= 10,
        efficiencyCheck: (state) => {
           // Không có lỗi cụ thể
          return 0;
        },
      },
    ]
  },
  // === KẾT THÚC PHẦN CODE lop6-4 ===

 // === PHẦN CODE MỚI CHO lop7-1 (COLOR MASTER) ===
  'lop7-1': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'interactivesimulation',
    title: 'Bậc Thầy Sắc Màu - Color Master (Lớp 7)',
    description: 'Thực hiện các thí nghiệm ảo về Quang học: tán sắc, tổng hợp màu, và màu sắc vật thể.',
    levelSummary: [
      { id: 'm1', title: 'Mô-đun 1: Tán Sắc Ánh Sáng' },
      { id: 'm2', title: 'Mô-đun 2: Tổng Hợp Màu' },
      { id: 'm3', title: 'Mô-đun 3: Kính Lọc Màu' },
      { id: 'm4', title: 'Mô-đun 4: Màu Sắc Vật Thể' }
    ],

    // 1b. Dữ liệu chi tiết (Đây là dữ liệu mà ColorMaster.jsx sẽ cần)
    // Component sẽ import hàm getPerceivedColor từ PHẦN 2
    detailedLevels: [
      // --- MODULE 1: Tán sắc ánh sáng ---
      {
        id: 'm1',
        title: 'Thí nghiệm 1: Phân tích Ánh sáng Trắng',
        task: 'Hãy đặt lăng kính và màn hứng vào đúng vị trí để tạo ra cầu vồng!',
        tools: [
          { id: 'lightSource', type: 'static', label: 'Đèn pin (Trắng)' },
          { id: 'prism', type: 'draggable', label: 'Lăng kính' },
          { id: 'screen', type: 'draggable', label: 'Màn hứng' },
        ],
        targets: {
          prism: { x: 40, y: 50, tolerance: 10 }, // Vùng lăng kính (40%, 50%)
          screen: { x: 70, y: 50, tolerance: 10 }, // Vùng màn hứng (70%, 50%)
        },
        hint: 'Ánh sáng trắng cần đi qua lăng kính trước khi tới màn hứng.',
      },
      
      // --- MODULE 2: Tổng hợp ánh sáng ---
      {
        id: 'm2',
        title: 'Thí nghiệm 2: Tổng hợp Ánh sáng màu',
        task: 'Hãy kéo các đèn màu vào 3 vòng tròn để xem chúng trộn màu như thế nào. Nhiệm vụ: Tạo ra ánh sáng TRẮNG ở giữa!',
        tools: [
          { id: 'redLight', type: 'draggable', label: 'Đèn Đỏ', color: COLORS.RED },
          { id: 'greenLight', type: 'draggable', label: 'Đèn Lục', color: COLORS.GREEN },
          { id: 'blueLight', type: 'draggable', label: 'Đèn Lam', color: COLORS.BLUE },
        ],
        targets: {
          redLight: { x: 50, y: 30, tolerance: 15 },
          greenLight: { x: 35, y: 60, tolerance: 15 },
          blueLight: { x: 65, y: 60, tolerance: 15 },
        },
        hint: 'Màu Trắng được tạo ra từ 3 màu cơ bản: Đỏ, Lục, Lam.',
      },

      // --- MODULE 3: Kính lọc màu ---
      {
        id: 'm3',
        title: 'Thí nghiệm 3: Tác dụng của Kính lọc màu',
        task: 'Chiếu ánh sáng trắng qua các tấm lọc màu. Nhiệm vụ: Hãy làm cho màn hứng hiện lên MÀU LỤC (Green)!',
        tools: [
          { id: 'lightSource', type: 'static', label: 'Đèn pin (Trắng)' },
          { id: 'screen', type: 'static', label: 'Màn hứng' },
          { id: 'filterRed', type: 'draggable', label: 'Kính lọc Đỏ', color: COLORS.RED },
          { id: 'filterGreen', type: 'draggable', label: 'Kính lọc Lục', color: COLORS.GREEN },
          { id: 'filterBlue', type: 'draggable', label: 'Kính lọc Lam', color: COLORS.BLUE },
        ],
        targets: {
          filter: { x: 50, y: 50, tolerance: 10 },
        },
        correctAnswer: 'filterGreen',
        hint: 'Kính lọc màu nào thì chỉ cho ánh sáng màu đó đi qua.',
      },

      // --- MODULE 4: Màu sắc vật thể ---
      {
        id: 'm4',
        title: 'Thí nghiệm 4: Nhìn thấy màu sắc',
        task: 'Kéo một vật vào "Sân khấu" và chọn đèn để chiếu sáng nó. Nhiệm vụ: Hãy làm cho CÁI LÁ MÀU XANH LỤC biến thành MÀU ĐEN!',
        tools: [
          { id: 'objApple', type: 'draggable', label: 'Táo Đỏ', color: COLORS.RED },
          { id: 'objLeaf', type: 'draggable', label: 'Lá Xanh', color: COLORS.GREEN },
          { id: 'objPaper', type: 'draggable', label: 'Giấy Trắng', color: COLORS.WHITE },
          { id: 'objCat', type: 'draggable', label: 'Mèo Đen', color: COLORS.BLACK },
        ],
        lights: [
          { id: 'lightWhite', label: 'Đèn Trắng', color: COLORS.WHITE },
          { id: 'lightRed', label: 'Đèn Đỏ', color: COLORS.RED },
          { id: 'lightGreen', label: 'Đèn Lục', color: COLORS.GREEN },
          { id: 'lightBlue', label: 'Đèn Lam', color: COLORS.BLUE },
        ],
        targets: {
          stage: { x: 50, y: 50, tolerance: 20 },
        },
        // Logic để kiểm tra chiến thắng (có thể lưu hàm trong JS)
        checkWinCondition: (objectOnStage, currentLight) => {
          return objectOnStage?.id === 'objLeaf' && (currentLight?.id === 'lightRed' || currentLight?.id === 'lightBlue');
        },
        // Lưu ý: Hàm getPerceivedColor sẽ được export riêng
        // và component ColorMaster.jsx sẽ import nó.
        hint: 'Vật màu xanh lục chỉ phản xạ ánh sáng xanh lục. Nếu chiếu màu khác vào, nó sẽ hấp thụ và...?',
      },
    ]
  },
 // === KẾT THÚC PHẦN CODE lop7-1 ===

 // === PHẦN CODE MỚI CHO lop7-2 (ELECTROMAGNETIC LAB) ===
  'lop7-2': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'electromagneticlab',
    title: 'Phòng Thí Nghiệm Điện Từ - Electromagnetic Lab (Lớp 7)',
    description: 'Khám phá hiện tượng cảm ứng điện từ của Faraday bằng cách di chuyển nam châm gần cuộn dây để tạo ra dòng điện.',
    levelSummary: [
      { id: 1, title: 'Thí nghiệm 1: Cảm ứng điện từ cơ bản' },
      { id: 2, title: 'Thí nghiệm 2: Ảnh hưởng của tốc độ' },
      { id: 3, title: 'Thí nghiệm 3: Thắp sáng bóng đèn' },
      { id: 4, title: 'Thí nghiệm 4: Dòng điện liên tục' }
    ],

    // 1b. Dữ liệu chi tiết (cho Game - được xử lý trực tiếp trong component)
    // Component ElectromagneticLab.jsx tự quản lý logic thí nghiệm
    detailedLevels: [
      {
        id: 1,
        title: 'Thí nghiệm 1: Cảm ứng điện từ cơ bản',
        instruction: 'Di chuyển nam châm vào gần cuộn dây để tạo ra dòng điện cảm ứng',
        goal: 'Tạo ra điện áp > 5V',
        targetVoltage: 5,
        points: 10,
        theory: 'Khi từ trường xuyên qua cuộn dây thay đổi, sẽ xuất hiện dòng điện cảm ứng.'
      },
      {
        id: 2,
        title: 'Thí nghiệm 2: Ảnh hưởng của tốc độ',
        instruction: 'Di chuyển nam châm nhanh qua cuộn dây để tạo điện áp cao',
        goal: 'Đạt điện áp > 8V',
        targetVoltage: 8,
        points: 15,
        theory: 'Điện áp cảm ứng tỉ lệ với tốc độ thay đổi từ trường (dΦ/dt).'
      },
      {
        id: 3,
        title: 'Thí nghiệm 3: Thắp sáng bóng đèn',
        instruction: 'Di chuyển nam châm đủ nhanh để thắp sáng bóng đèn ít nhất 70%',
        goal: 'Độ sáng > 70%',
        targetBrightness: 70,
        targetVoltage: 7,
        points: 20,
        theory: 'Công suất đèn phụ thuộc vào điện áp: P = V²/R.'
      },
      {
        id: 4,
        title: 'Thí nghiệm 4: Dòng điện liên tục',
        instruction: 'Duy trì điện áp trên 6V trong 3 giây',
        goal: 'Giữ điện áp > 6V trong 3 giây',
        targetVoltage: 6,
        duration: 3,
        points: 25,
        theory: 'Để duy trì dòng điện, cần liên tục thay đổi từ trường xuyên qua cuộn dây.'
      }
    ],

    // Các tham số vật lý
    physics: {
      maxDistance: 150, // Khoảng cách tối đa (px) mà từ trường có ảnh hưởng
      maxVoltage: 10, // Điện áp tối đa (V)
      decayRate: 0.9, // Tốc độ suy giảm điện áp khi không di chuyển
      speedMultiplier: 10, // Hệ số nhân tốc độ để tính điện áp
    }
  },
 // === KẾT THÚC PHẦN CODE lop7-2 ===

 // === PHẦN CODE MỚI CHO lop7-3 (STATIC ELECTRICITY) ===
  'lop7-3': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'staticelectricity',
    title: 'Sự Ma Sát - Static Electricity (Lớp 7)',
    description: 'Khám phá hiện tượng điện tĩnh bằng cách cọ xát bóng bay vào áo len và quan sát lực hút tĩnh điện với tường.',
    levelSummary: [
      { id: 1, title: 'Mục tiêu 1: Tạo điện tích' },
      { id: 2, title: 'Mục tiêu 2: Dính vào tường' },
      { id: 3, title: 'Mục tiêu 3: Tích điện mạnh' }
    ],

    // 1b. Dữ liệu chi tiết (cho Game - được xử lý trực tiếp trong component)
    objectives: [
      {
        id: 1,
        description: '🎯 Làm cho bóng bay nhiễm điện âm (cọ xát vào áo len ít nhất 10 lần)',
        points: 15,
        hint: 'Kéo bóng vào áo len và cọ xát. Electron sẽ chuyển từ áo sang bóng.'
      },
      {
        id: 2,
        description: '🧲 Quan sát hiện tượng phân cực điện ở tường (đưa bóng tích điện gần tường)',
        points: 20,
        hint: 'Khi bóng âm điện đến gần, các điện tích trong tường sẽ di chuyển (phân cực).'
      },
      {
        id: 3,
        description: '⚡ Làm bóng bay dính chặt vào tường (cần điện tích rất mạnh)',
        points: 25,
        hint: 'Cọ xát thật nhiều để tạo điện tích mạnh, sau đó đưa bóng rất gần tường.'
      }
    ],

    // Các tham số vật lý
    physics: {
      chargeTransferRate: 300, // ms mỗi lần chuyển điện tích
      maxCharges: 30, // Số điện tích tối đa trên bóng
      attractionDistance: 150, // Khoảng cách tối đa để có lực hút (px)
      stickThreshold: 5, // Điện tích tối thiểu để dính tường
      rubbingDistance: 100, // Khoảng cách để cọ xát (px)
    }
  },
 // === KẾT THÚC PHẦN CODE lop7-3 ===

 // === PHẦN CODE MỚI CHO lop8-2 (PLASMA GAME - MẠCH ĐIỆN) ===
  'lop8-2': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'plasmacircuit', // Kiểu game mới - mô phỏng mạch điện
    title: 'Mạch Điện Plasma - Plasma Circuit (Lớp 8)',
    description: 'Tìm hiểu về mạch điện, dòng điện DC/AC và plasma thông qua các thí nghiệm tương tác.',
    levelSummary: [
      { id: 1, title: 'Màn 1: Mạch Điện Cơ Bản' },
      { id: 2, title: 'Màn 2: Ngắn Mạch và An Toàn' },
      { id: 3, title: 'Màn 3: Dòng Điện AC' },
      { id: 4, title: 'Màn 4: Plasma - Trạng Thái Thứ 4' }
    ],

    // 1b. Dữ liệu chi tiết (Đây là dữ liệu mà PlasmaGame.jsx sẽ cần)
    detailedLevels: [
      {
        id: 1,
        title: "Màn 1: Mạch Điện Cơ Bản",
        description: "Học cách đóng mạch điện để thắp sáng bóng đèn.",
        currentType: 'dc', // Loại dòng điện
        hasSwitch: true,
        targetState: 'closed', // Mục tiêu: đóng mạch
        question: {
          text: "Điều gì cần thiết để bóng đèn sáng?",
          options: [
            { id: 'a', text: 'Mạch điện kín', correct: true },
            { id: 'b', text: 'Mạch điện hở', correct: false }
          ]
        }
      },
      {
        id: 2,
        title: "Màn 2: Ngắn Mạch và An Toàn",
        description: "Tìm hiểu về ngắn mạch và tác hại của nó.",
        currentType: 'dc',
        hasSwitch: true,
        canShortCircuit: true, // Cho phép tạo ngắn mạch
        question: {
          text: "Tại sao ngắn mạch lại nguy hiểm?",
          options: [
            { id: 'a', text: 'Dòng điện quá lớn, gây cháy nổ', correct: true },
            { id: 'b', text: 'Làm hỏng công tắc', correct: false }
          ]
        }
      },
      {
        id: 3,
        title: "Màn 3: Dòng Điện AC",
        description: "Quan sát sự khác biệt giữa dòng điện AC và DC.",
        currentType: 'ac', // Dòng xoay chiều
        hasSwitch: true,
        targetState: 'closed',
        question: {
          text: "Dòng điện AC khác DC như thế nào?",
          options: [
            { id: 'a', text: 'AC đổi chiều liên tục', correct: true },
            { id: 'b', text: 'AC mạnh hơn DC', correct: false }
          ]
        }
      },
      {
        id: 4,
        title: "Màn 4: Plasma - Trạng Thái Thứ 4",
        description: "Khám phá plasma - trạng thái vật chất đặc biệt khi khí bị ion hóa.",
        currentType: 'plasma', // Dòng plasma
        hasSwitch: true,
        targetState: 'closed',
        question: {
          text: "Plasma là gì?",
          options: [
            { id: 'a', text: 'Khí bị ion hóa, có tính dẫn điện', correct: true },
            { id: 'b', text: 'Một loại kim loại lỏng', correct: false }
          ]
        }
      }
    ]
  },
 // === KẾT THÚC PHẦN CODE lop8-2 ===

  // === PHẦN CODE MỚI CHO lop10-1 (PROJECTILE MOTION - ĐỘNG LỰC HỌC) ===
  'lop10-1': {
    // 1a. Dữ liệu tóm tắt (cho Menu)
    type: 'projectilemotion',
    title: 'Ném Xiên - Projectile Motion (Lớp 10)',
    description: 'Sử dụng ná thun để bắn vật theo chuyển động ném xiên. Xác định góc bắn và lực để trúng mục tiêu.',
    levelSummary: [
      { id: 'lvl1', title: 'Level 1: Cơ Bản' },
      { id: 'lvl2', title: 'Level 2: Trung Bình' },
      { id: 'lvl3', title: 'Level 3: Nâng Cao' }
    ],

    // 1b. Dữ liệu chi tiết (cho Game)
    detailedLevels: [
      // Level 1: Cơ Bản
      {
        id: 'level-1',
        level: 1,
        title: 'Cơ Bản',
        hint: 'Kéo ná thun để điều chỉnh góc và lực. Bắn trúng mục tiêu!',
        puzzles: [
          {
            id: '1-1',
            targetX: 50,  // Mục tiêu xa (50m) như ban đầu
            targetY: 0,   // Ngang mặt đất
            targetRadius: 5, // Bia lớn (5m bán kính)
            minAngle: 20,
            maxAngle: 70,
            minForce: 10,
            maxForce: 30,  // Tăng lực lên 30 m/s
            hint: 'Mục tiêu ở xa, kéo mạnh và dùng góc 45°'
          },
          {
            id: '1-2',
            targetX: 60,  // 60m
            targetY: 5,   // Cao 5m
            targetRadius: 4,
            minAngle: 25,
            maxAngle: 65,
            minForce: 12,
            maxForce: 35,  // 35 m/s
            hint: 'Mục tiêu cao và xa, cần lực mạnh'
          },
          {
            id: '1-3',
            targetX: 70,  // 70m - xa nhất
            targetY: 0,
            targetRadius: 3,  // Bia nhỏ hơn
            minAngle: 30,
            maxAngle: 60,
            minForce: 15,
            maxForce: 40,  // 40 m/s
            hint: 'Mục tiêu rất xa! Cần lực tối đa và góc tối ưu'
          }
        ]
      },
      // Level 2: Trung Bình
      {
        id: 'level-2',
        level: 2,
        title: 'Trung Bình',
        hint: 'Có chướng ngại vật! Điều chỉnh quỹ đạo để vượt qua.',
        puzzles: [
          {
            id: '2-1',
            targetX: 30,  // 30m với chướng ngại vật
            targetY: 0,
            targetRadius: 4,
            minAngle: 35,
            maxAngle: 65,
            minForce: 15,
            maxForce: 25,
            obstacles: [
              { x: 15, y: 0, width: 3, height: 8 } // Tường thấp ở giữa
            ],
            hint: 'Bắn qua tường chắn ở giữa - dùng góc cao'
          },
          {
            id: '2-2',
            targetX: 35,  // 35m, cao và có tường
            targetY: 5,
            targetRadius: 3,
            minAngle: 40,
            maxAngle: 70,
            minForce: 18,
            maxForce: 28,
            obstacles: [
              { x: 20, y: 0, width: 3, height: 12 }
            ],
            hint: 'Mục tiêu cao và có tường cao - cần góc lớn'
          },
          {
            id: '2-3',
            targetX: 40,  // 40m với 2 tường
            targetY: 2,
            targetRadius: 3,
            minAngle: 30,
            maxAngle: 60,
            minForce: 20,
            maxForce: 30,
            obstacles: [
              { x: 12, y: 0, width: 3, height: 6 },
              { x: 28, y: 0, width: 3, height: 9 }
            ],
            hint: 'Hai tường! Cần tìm quỹ đạo tối ưu'
          }
        ]
      },
      // Level 3: Nâng Cao
      {
        id: 'level-3',
        level: 3,
        title: 'Nâng Cao',
        hint: 'Mục tiêu di động và điều kiện khó khăn hơn!',
        puzzles: [
          {
            id: '3-1',
            targetX: 45,  // 45m với gió ngược
            targetY: 0,
            targetRadius: 3,
            minAngle: 35,
            maxAngle: 65,
            minForce: 22,
            maxForce: 32,
            wind: { x: -1, y: 0 }, // Gió ngược nhẹ
            obstacles: [
              { x: 25, y: 0, width: 3, height: 12 }
            ],
            hint: 'Có gió ngược! Cần lực mạnh hơn bình thường'
          },
          {
            id: '3-2',
            targetX: 50,  // 50m, cao, gió thuận
            targetY: 8,
            targetRadius: 2,
            minAngle: 45,
            maxAngle: 75,
            minForce: 25,
            maxForce: 35,
            wind: { x: 0.5, y: 0 }, // Gió thuận nhẹ
            obstacles: [
              { x: 20, y: 0, width: 3, height: 10 },
              { x: 38, y: 0, width: 3, height: 8 }
            ],
            hint: 'Gió thuận giúp bay xa hơn - tận dụng!'
          },
          {
            id: '3-3',
            targetX: 55,  // 55m - thử thách cuối
            targetY: 3,
            targetRadius: 2,
            minAngle: 30,
            maxAngle: 60,
            minForce: 28,
            maxForce: 38,
            obstacles: [
              { x: 18, y: 0, width: 3, height: 8 },
              { x: 35, y: 0, width: 3, height: 10 },
              { x: 48, y: 0, width: 3, height: 6 }
            ],
            hint: 'Thử thách cuối! 3 tường và mục tiêu nhỏ'
          }
        ]
      }
    ],
    
    // Cấu hình physics
    physics: {
      gravity: 9.8,           // m/s²
      mass: 1,                // kg
      airResistance: 0.01,    // Hệ số ma sát không khí
      timeStep: 0.02          // Bước thời gian mô phỏng (s)
    }
  },
  // === KẾT THÚC PHẦN CODE lop10-1 ===

};

/* PHẦN 2: CÁC HÀM LOGIC (Dùng chung) */

// Hàm tính Mô-men (Không đổi)
const calculateTorque = (objects) => {
  return objects.reduce((sum, obj) => {
    const mass = (obj.mass === '?') ? obj.hiddenAnswer : obj.mass;
    if (isNaN(mass) || isNaN(obj.distance)) return sum;
    return sum + (mass * obj.distance);
  }, 0);
};

// Hàm xử lý data chi tiết (Không đổi, nhưng đọc từ 'detailedLevels')
const processGameLevels = (detailedLevels) => {
  if (!detailedLevels) return [];
  
  return detailedLevels.map(level => {
    return {
      level: level.level,
      title: level.title,
      hint: level.hint,
      showMarks: level.showMarks,
      questions: level.puzzles.map(puzzle => {
        return {
          leftObjects: puzzle.left.map(obj => ({
            mass: obj.mass,
            d: obj.distance,
            hiddenAnswer: obj.hiddenAnswer || 0
          })),
          target: puzzle.target
        };
      })
    };
  });
};

// (THÊM MỚI) Hàm logic cho Color Master (Module 4)
// Logic: Vật màu nào thì phản xạ màu đó, hấp thụ màu khác.
// Vật TRẮNG phản xạ tất cả. Vật ĐEN hấp thụ tất cả.
const getPerceivedColor = (objectBaseColor, lightColor) => {
  if (objectBaseColor === COLORS.BLACK) return COLORS.BLACK;
  if (objectBaseColor === COLORS.WHITE) return lightColor;

  if (lightColor === COLORS.WHITE) return objectBaseColor;

  // Trường hợp ánh sáng màu chiếu vào vật có màu
  if (lightColor === COLORS.RED) {
    return (objectBaseColor === COLORS.RED || objectBaseColor === COLORS.YELLOW || objectBaseColor === COLORS.MAGENTA) ? COLORS.RED : COLORS.BLACK;
  }
  if (lightColor === COLORS.GREEN) {
    return (objectBaseColor === COLORS.GREEN || objectBaseColor === COLORS.YELLOW || objectBaseColor === COLORS.CYAN) ? COLORS.GREEN : COLORS.BLACK;
  }
  // === DÒNG SỬA LỖI LÀ ĐÂY ===
  // Đã xóa chữ "CHUYỂN GIAO:" và thêm "if (lightColor === COLORS.BLUE)"
  if (lightColor === COLORS.BLUE) {
    return (objectBaseColor === COLORS.BLUE || objectBaseColor === COLORS.MAGENTA || objectBaseColor === COLORS.CYAN) ? COLORS.BLUE : COLORS.BLACK;
  }
  // === KẾT THÚC SỬA LỖI ===

  return COLORS.BLACK; // Mặc định
};


/* PHẦN 3: EXPORT BIẾN VÀ HÀM */

// EXPORT 1: Hàm logic chính (Không đổi)
export const checkPuzzleResult = (leftObjects, rightObjects, puzzleTarget, tolerance) => {
  // (logic tính toán y như cũ, không cần thay đổi)
  const L_left = calculateTorque(leftObjects);
  const L_right = calculateTorque(rightObjects);
  const difference = L_left - L_right;
  let isSuccess = false;

  switch (puzzleTarget.type) {
    case 'balance':
    default:
      if (L_right === 0 && L_left > 0) {
        isSuccess = false;
      } else {
        isSuccess = Math.abs(difference) < tolerance;
      }
  }
  const angle = Math.max(-25, Math.min(25, -difference * 0.5));
  return { isSuccess: isSuccess, angle: isSuccess ? 0 : angle };
};


// EXPORT 2: Dữ liệu TÓM TẮT cho Menu (Tự động tạo, khớp với code mới của bạn)
// Code này sẽ tự động đọc 'lop6-1', 'lop6-2', 'lop6-3', 'lop6-4' VÀ 'lop7-1' từ allGameData
export const gameData = Object.keys(allGameData).reduce((acc, gameId) => {
  const game = allGameData[gameId];
  
  // Kiểm tra dữ liệu hợp lệ
  if (!game || !game.type || !game.title) {
    console.warn(`⚠️ Game ${gameId} thiếu dữ liệu cần thiết:`, game);
    return acc;
  }
  
  acc[gameId] = {
    id: gameId,
    type: game.type,
    title: game.title,
    description: game.description,
    levels: game.levelSummary // QUAN TRỌNG: Lấy dữ liệu tóm tắt
  };
  return acc;
}, {});

// Debug log (Đã cập nhật)
console.log('🔍 gameData keys:', Object.keys(gameData));
console.log('🔍 lop6-4 exists:', gameData['lop6-4']);
console.log('🔍 lop7-1 exists:', gameData['lop7-1']); // Thêm log cho lop7-1
console.log('🔍 lop10-1 exists:', gameData['lop10-1']); // Thêm log cho lop10-1
console.log('🔍 allGameData keys:', Object.keys(allGameData));

// EXPORT 3: Dữ liệu CHI TIẾT cho Game (Để "vá" lỗi màn hình trắng)
// File .jsx của bạn đang cần biến 'GAME_DATA' (chữ hoa)
// Biến này chứa data CHI TIẾT của 'lop6-1'
const processedLop6Levels = processGameLevels(allGameData['lop6-1'].detailedLevels);

export const GAME_DATA = processedLop6Levels;


// === PHẦN EXPORT MỚI ĐƯỢC THÊM VÀO ===
// EXPORT 4: Dữ liệu CHI TIẾT cho Game 'lop6-2' (Nano Lab)
// Component NanoLab.jsx (bạn đã có) nên được sửa đổi để import
// và sử dụng biến này, thay vì hardcode dữ liệu bên trong component.
export const NANO_LAB_DATA = allGameData['lop6-2'].detailedLevels;
// === KẾT THÚC PHẦN EXPORT MỚI ===


// === PHẦN EXPORT MỚI CHO LOP6-3 ===
// EXPORT 5: Dữ liệu CHI TIẾT cho Game 'lop6-3' (Thermo Lab)
export const THERMO_LAB_DATA = {
  modules: allGameData['lop6-3']?.detailedLevels || [],
  tools: allGameData['lop6-3']?.tools || []
};
// === KẾT THÚC PHẦN EXPORT MỚI ===


// === PHẦN EXPORT MỚI CHO LOP6-4 ===
// EXPORT 6: Dữ liệu CHI TIẾT cho Game 'lop6-4' (Water Lab)
// Component WaterLab.jsx (bạn đã có) nên được sửa đổi để import
// và sử dụng biến này, thay vì 'import { LEVELS } from ...'
export const WATER_LAB_DATA = allGameData['lop6-4']?.detailedLevels || [];
// === KẾT THÚC PHẦN EXPORT MỚI ===


// === PHẦN EXPORT MỚI CHO LOP8-2 ===
// EXPORT 7: Dữ liệu CHI TIẾT cho Game 'lop8-2' (Plasma Game)
// Component PlasmaGame.jsx sẽ sử dụng biến này để lấy dữ liệu các màn chơi
export const PLASMA_GAME_DATA = allGameData['lop8-2']?.detailedLevels || [];
// === KẾT THÚC PHẦN EXPORT MỚI ===


// === PHẦN EXPORT MỚI CHO LOP10-1 ===
// EXPORT 8: Dữ liệu CHI TIẾT cho Game 'lop10-1' (Projectile Motion)
// Component ProjectileMotion.jsx sẽ sử dụng biến này để lấy dữ liệu các màn chơi
export const PROJECTILE_MOTION_DATA = {
  levels: allGameData['lop10-1']?.detailedLevels || [],
  physics: allGameData['lop10-1']?.physics || {}
};
// === KẾT THÚC PHẦN EXPORT MỚI ===

