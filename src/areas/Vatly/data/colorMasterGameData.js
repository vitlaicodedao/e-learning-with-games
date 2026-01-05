// colormasterGameData.js (NÂNG CẤP)

// Định nghĩa màu sắc (Giữ nguyên)
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

// Logic tính màu sắc cảm nhận (Giữ nguyên)
const getPerceivedColor = (objectBaseColor, lightColor) => {
  if (objectBaseColor === COLORS.BLACK) return COLORS.BLACK;
  if (objectBaseColor === COLORS.WHITE) return lightColor;
  if (lightColor === COLORS.WHITE) return objectBaseColor;

  if (lightColor === COLORS.RED) {
    return (objectBaseColor === COLORS.RED || objectBaseColor === COLORS.YELLOW || objectBaseColor === COLORS.MAGENTA) ? COLORS.RED : COLORS.BLACK;
  }
  if (lightColor === COLORS.GREEN) {
    return (objectBaseColor === COLORS.GREEN || objectBaseColor === COLORS.YELLOW || objectBaseColor === COLORS.CYAN) ? COLORS.GREEN : COLORS.BLACK;
  }
  if (lightColor === COLORS.BLUE) {
    return (objectBaseColor === COLORS.BLUE || objectBaseColor === COLORS.MAGENTA || objectBaseColor === COLORS.CYAN) ? COLORS.BLUE : COLORS.BLACK;
  }
  return COLORS.BLACK;
};

export const COLOR_MASTER_DATA = {
  id: 'lop7-1',
  title: 'Bậc Thầy Sắc Màu',
  modules: [
    // --- NÂNG CẤP: Thêm Module 0 làm màn hình giới thiệu ---
    {
      id: 'm0',
      title: 'Chào mừng đến Phòng thí nghiệm Ánh sáng!',
      task: 'Trong trò chơi này, bạn sẽ khám phá các bí ẩn về tán sắc, trộn màu, kính lọc và cách chúng ta nhìn thấy vật thể. Bạn đã sẵn sàng chưa?',
      tools: [],
      lights: [],
      targets: {},
      hint: 'Chỉ cần nhấn nút "Bắt đầu" để vào Thí nghiệm 1.',
      isIntro: true, // Thêm cờ để nhận diện đây là màn giới thiệu
    },
    {
      id: 'm1',
      title: 'Thí nghiệm 1: Phân tích Ánh sáng Trắng',
      task: 'Hãy đặt lăng kính và màn hứng vào đúng vị trí để phân tích ánh sáng trắng thành cầu vồng!',
      tools: [
        { id: 'lightSource', type: 'static', label: 'Đèn pin (Trắng)' },
        // NÂNG CẤP: Thêm spawnLocation và icon
        { id: 'prism', type: 'draggable', label: 'Lăng kính', icon: '📐', spawnLocation: 'workbench' },
        { id: 'screen', type: 'draggable', label: 'Màn hứng', icon: '📺', spawnLocation: 'workbench' },
      ],
      lights: [],
      targets: {
        prism: { id: 'zone-prism', x: 40, y: 50, tolerance: 10, label: 'Đặt Lăng kính' },
        screen: { id: 'zone-screen', x: 70, y: 50, tolerance: 10, label: 'Đặt Màn hứng' },
      },
      hint: 'Ánh sáng trắng cần đi qua lăng kính trước khi tới màn hứng.',
    },
    {
      id: 'm2',
      title: 'Thí nghiệm 2: Tổng hợp Ánh sáng màu',
      task: 'Kéo các đèn màu vào 3 vòng tròn để xem chúng trộn màu. Nhiệm vụ: Tạo ra ánh sáng TRẮNG ở giữa!',
      tools: [
        // NÂNG CẤP: Thêm spawnLocation và icon (dùng 💡 cho đèn)
        { id: 'redLight', type: 'draggable', label: 'Đèn Đỏ', icon: '💡', color: COLORS.RED, spawnLocation: 'workbench' },
        { id: 'greenLight', type: 'draggable', label: 'Đèn Lục', icon: '💡', color: COLORS.GREEN, spawnLocation: 'workbench' },
        { id: 'blueLight', type: 'draggable', label: 'Đèn Lam', icon: '💡', color: COLORS.BLUE, spawnLocation: 'workbench' },
      ],
      lights: [],
      targets: {
        // NÂNG CẤP: Giãn vị trí ra 1 chút và thêm ID
        redLight: { id: 'zone-red', x: 50, y: 30, tolerance: 12 },
        greenLight: { id: 'zone-green', x: 38, y: 65, tolerance: 12 },
        blueLight: { id: 'zone-blue', x: 62, y: 65, tolerance: 12 },
      },
      hint: 'Màu Trắng được tạo ra từ 3 màu cơ bản: Đỏ, Lục, Lam.',
    },
    {
      id: 'm3',
      title: 'Thí nghiệm 3: Tác dụng của Kính lọc màu',
      task: 'Chiếu ánh sáng trắng qua các tấm lọc màu. Nhiệm vụ: Hãy làm cho màn hứng hiện lên MÀU LỤC (Green)!',
      tools: [
        { id: 'lightSource', type: 'static', label: 'Đèn pin (Trắng)' },
        { id: 'screen', type: 'static', label: 'Màn hứng' },
        // NÂNG CẤP: Thêm spawnLocation và icon
        { id: 'filterRed', type: 'draggable', label: 'Kính lọc Đỏ', icon: '🟥', color: COLORS.RED, spawnLocation: 'workbench' },
        { id: 'filterGreen', type: 'draggable', label: 'Kính lọc Lục', icon: '🟩', color: COLORS.GREEN, spawnLocation: 'workbench' },
        { id: 'filterBlue', type: 'draggable', label: 'Kính lọc Lam', icon: '🟦', color: COLORS.BLUE, spawnLocation: 'workbench' },
      ],
      lights: [],
      targets: {
        filter: { id: 'zone-filter', x: 50, y: 50, tolerance: 10, label: 'Đặt Kính lọc' },
      },
      correctAnswer: 'filterGreen',
      hint: 'Kính lọc màu nào thì chỉ cho ánh sáng màu đó đi qua.',
    },
    {
      id: 'm4',
      title: 'Thí nghiệm 4: Nhìn thấy màu sắc',
      task: 'Kéo một vật vào "Sân khấu" và chọn đèn để chiếu sáng nó. Nhiệm vụ: Hãy làm cho CÁI LÁ MÀU XANH LỤC biến thành MÀU ĐEN!',
      tools: [
        // NÂNG CẤP: spawnLocation là 'toolbox' và thêm icon
        { id: 'objApple', type: 'draggable', label: 'Táo Đỏ', icon: '🍎', color: COLORS.RED, spawnLocation: 'toolbox' },
        { id: 'objLeaf', type: 'draggable', label: 'Lá Xanh', icon: '🍃', color: COLORS.GREEN, spawnLocation: 'toolbox' },
        { id: 'objPaper', type: 'draggable', label: 'Giấy Trắng', icon: '📄', color: COLORS.WHITE, spawnLocation: 'toolbox' },
        { id: 'objCat', type: 'draggable', label: 'Mèo Đen', icon: '🐈', color: COLORS.BLACK, spawnLocation: 'toolbox' },
      ],
      lights: [
        { id: 'lightWhite', label: 'Đèn Trắng', color: COLORS.WHITE, dataColor: 'white' },
        { id: 'lightRed', label: 'Đèn Đỏ', color: COLORS.RED, dataColor: 'red' },
        { id: 'lightGreen', label: 'Đèn Lục', color: COLORS.GREEN, dataColor: 'green' },
        { id: 'lightBlue', label: 'Đèn Lam', color: COLORS.BLUE, dataColor: 'blue' },
      ],
      targets: {
        stage: { id: 'zone-stage', x: 50, y: 50, tolerance: 20, label: 'Sân khấu' },
      },
      checkWinCondition: (objectOnStage, currentLight) => {
        // Logic thắng: Lá xanh (objLeaf) dưới đèn Đỏ (lightRed) hoặc Lam (lightBlue)
        return objectOnStage?.id === 'objLeaf' && (currentLight?.id === 'lightRed' || currentLight?.id === 'lightBlue');
      },
      getPerceivedColor: getPerceivedColor, // Sử dụng hàm đã định nghĩa ở trên
      hint: 'Vật màu xanh lục chỉ phản xạ ánh sáng xanh lục. Nếu chiếu màu khác vào (như Đỏ hoặc Lam), nó sẽ hấp thụ và...?',
    },
  ],
};