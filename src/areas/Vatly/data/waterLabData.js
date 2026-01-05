// waterLabData.js - Dữ liệu riêng cho Water Lab Game

export const WATER_LAB_DATA = [
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
];
