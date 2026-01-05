module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 33,
  title: "Bài 33: Bài thực hành 5 - Điều chế và nhận biết hidro",
  description: "Thực hành điều chế H₂ và kiểm tra độ tinh khiết",
  level: "Intermediate", // Đổi từ "Practice" thành "Intermediate"
  order: 33,
  theory: `
      <h2>🧪 Thực hành: Điều chế và nhận biết H₂</h2>
      
      <h3>🎯 Mục tiêu</h3>
      <ul>
        <li>Biết cách điều chế H₂ trong phòng thí nghiệm</li>
        <li>Thu và nhận biết khí H₂</li>
        <li>Kiểm tra độ tinh khiết của H₂</li>
      </ul>

      <h3>🔬 Dụng cụ và hóa chất</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>Dụng cụ:</h4>
        <p>• Bình cầu có ống hút khí</p>
        <p>• Ống nghiệm</p>
        <p>• Chậu thủy tinh</p>
        <p>• Đèn cồn</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Hóa chất:</h4>
        <p>• Kẽm (Zn) dạng hạt</p>
        <p>• Dung dịch H₂SO₄ loãng</p>
      </div>

      <h3>📋 Các bước tiến hành</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>Bước 1: Lắp ráp thiết bị</h4>
        <p>1. Cho kẽm vào bình cầu</p>
        <p>2. Đậy nút có ống dẫn khí</p>
        <p>3. Chuẩn bị ống nghiệm chứa nước úp ngược trong chậu</p>
        
        <h4>Bước 2: Điều chế H₂</h4>
        <p>1. Rót từ từ H₂SO₄ loãng vào bình</p>
        <p>2. Quan sát: Kẽm tan dần, có khí thoát ra</p>
        <p>3. Phương trình: <strong>Zn + H₂SO₄ → ZnSO₄ + H₂↑</strong></p>
        
        <h4>Bước 3: Thu khí H₂</h4>
        <p>1. Đẩy hết không khí trong ống dẫn</p>
        <p>2. Dẫn khí vào ống nghiệm</p>
        <p>3. Thu bằng cách đẩy nước</p>
        
        <h4>Bước 4: Kiểm tra độ tinh khiết</h4>
        <p>1. Đậy kín ống nghiệm chứa H₂</p>
        <p>2. Lật ngược, mở nút</p>
        <p>3. Đưa gần ngọn lửa:</p>
        <p>• Nếu kêu "pop" nhẹ: H₂ tinh khiết ✅</p>
        <p>• Nếu nổ mạnh: H₂ lẫn không khí ⚠️</p>
        
        <h4>Bước 5: Đốt H₂ tinh khiết</h4>
        <p>1. Đưa ống nghiệm chứa H₂ tinh khiết lại gần ngọn lửa</p>
        <p>2. Quan sát: Cháy ngọn lửa xanh nhạt</p>
        <p>3. Đặt bát úp phía trên: Có hơi nước ngưng tụ</p>
      </div>

      <h3>⚠️ An toàn</h3>
      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <p>🔥 Không đốt H₂ khi chưa kiểm tra độ tinh khiết</p>
        <p>👓 Đeo kính bảo hộ</p>
        <p>🧤 Cẩn thận khi sử dụng H₂SO₄</p>
        <p>🚫 Không hít khí H₂ trực tiếp</p>
      </div>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Để điều chế H₂ trong PTN, ta dùng kim loại gì?",
    options: [
      "Cu",
      "Zn",
      "Ag",
      "Au"
    ],
    correctAnswer: 1,
    explanation: "✅ Dùng kẽm (Zn) vì phản ứng dễ dàng với H₂SO₄.",
    points: 10
  },
  {
    type: "true-false",
    question: "Thu khí H₂ bằng cách đẩy nước vì H₂ tan ít trong nước.",
    correctAnswer: true,
    explanation: "✅ Đúng! H₂ tan rất ít trong nước nên thu được.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hiện tượng nào chứng tỏ H₂ tinh khiết?",
    options: [
      "Nổ mạnh khi đốt",
      "Kêu 'pop' nhẹ khi đốt",
      "Không cháy",
      "Cháy có khói đen"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ tinh khiết kêu 'pop' nhẹ, nếu nổ mạnh là lẫn không khí.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phương trình điều chế H₂: Zn + H₂SO₄ → ___ + H₂",
    correctAnswer: "ZnSO₄",
    hint: "💡 Muối kẽm sunfat",
    explanation: "✅ Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    points: 10
  },
  {
    type: "true-false",
    question: "Phải kiểm tra độ tinh khiết của H₂ trước khi đốt.",
    correctAnswer: true,
    explanation: "✅ Đúng! Để tránh nổ nguy hiểm.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước thí nghiệm đúng thứ tự",
    options: [
      "Cho Zn vào bình, rót H₂SO₄",
      "Lắp ráp thiết bị",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết",
      "Đốt H₂ tinh khiết"
    ],
    correctOrder: [
      "Lắp ráp thiết bị",
      "Cho Zn vào bình, rót H₂SO₄",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết",
      "Đốt H₂ tinh khiết"
    ],
    explanation: "✅ Đúng trình tự thí nghiệm an toàn!",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép hiện tượng với giải thích",
    pairs: [
      {
        left: "Kẽm tan dần",
        right: "Phản ứng Zn + H₂SO₄"
      },
      {
        left: "Có khí thoát ra",
        right: "H₂ được tạo ra"
      },
      {
        left: "Kêu 'pop' nhẹ",
        right: "H₂ tinh khiết"
      },
      {
        left: "Có hơi nước",
        right: "H₂ cháy tạo H₂O"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn hiểu rõ các hiện tượng.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Khi đốt H₂ tinh khiết, ngọn lửa có màu ___.",
    correctAnswer: "xanh nhạt",
    hint: "💡 Màu đặc trưng của H₂ cháy",
    explanation: "✅ H₂ cháy cho ngọn lửa XANH NHẠT.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao phải đẩy hết không khí trong ống dẫn trước khi thu H₂?",
    options: [
      "Để H₂ bay nhanh hơn",
      "Để tránh H₂ lẫn không khí gây nổ",
      "Để ống sạch hơn",
      "Không cần thiết"
    ],
    correctAnswer: 1,
    explanation: "✅ Tránh hỗn hợp H₂ + O₂ (không khí) gây nổ!",
    points: 10
  },
  {
    type: "true-false",
    question: "Khi đốt H₂, đặt bát úp phía trên sẽ thấy hơi nước ngưng tụ.",
    correctAnswer: true,
    explanation: "✅ Đúng! H₂ + O₂ → H₂O (hơi nước)",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Để kiểm tra độ tinh khiết H₂, ta ___, nếu ___ thì H₂ tinh khiết, nếu ___ thì H₂ lẫn không khí.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Thao tác",
        correct: "đưa gần lửa"
      },
      {
        id: 2,
        label: "Hiện tượng 1",
        correct: "kêu pop nhẹ"
      },
      {
        id: 3,
        label: "Hiện tượng 2",
        correct: "nổ mạnh"
      }
    ],
    options: [
      "đưa gần lửa",
      "kêu pop nhẹ",
      "nổ mạnh",
      "không cháy"
    ],
    explanation: "✅ Đưa gần lửa: pop nhẹ = tinh khiết, nổ mạnh = lẫn không khí.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tính thể tích H₂ (đktc) thu được khi cho 13g Zn tác dụng với H₂SO₄ dư? (Zn=65)",
    options: [
      "2,24 lít",
      "4,48 lít",
      "6,72 lít",
      "11,2 lít"
    ],
    correctAnswer: 1,
    explanation: "✅ n(Zn)=13/65=0,2 mol → n(H₂)=0,2 mol → V=0,2×22,4=4,48 lít",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nếu dùng 9,8g H₂SO₄ (H=1, S=32, O=16), khối lượng Zn tối thiểu cần dùng là ___ g. (Zn=65)",
    correctAnswer: "6,5",
    hint: "💡 Tính mol H₂SO₄ trước",
    explanation: "✅ n(H₂SO₄)=9,8/98=0,1 mol → n(Zn)=0,1 mol → m(Zn)=0,1×65=6,5g",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Ghép lỗi với hậu quả",
    pairs: [
      {
        left: "Không kiểm tra độ tinh khiết",
        right: "Nguy cơ nổ"
      },
      {
        left: "Dùng H₂SO₄ đặc",
        right: "Phản ứng quá mạnh"
      },
      {
        left: "Không đeo kính",
        right: "Axit bắn vào mắt"
      },
      {
        left: "Hít khí H₂",
        right: "Thiếu oxy, ngạt thở"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu tầm quan trọng của an toàn.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào KHÔNG xảy ra khi điều chế H₂?",
    options: [
      "Zn + H₂SO₄ → ZnSO₄ + H₂",
      "Fe + H₂SO₄ → FeSO₄ + H₂",
      "Cu + H₂SO₄ → CuSO₄ + H₂",
      "Mg + H₂SO₄ → MgSO₄ + H₂"
    ],
    correctAnswer: 2,
    explanation: "❌ Cu KHÔNG phản ứng với H₂SO₄ loãng vì Cu kém hoạt động.",
    points: 10
  }
]
};
