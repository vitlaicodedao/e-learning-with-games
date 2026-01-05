module.exports = {
  classId: 8,
  chapterId: 6,
  lessonId: 42,
  title: "Bài 42: Bài thực hành 7 - Pha chế và tính toán dung dịch",
  description: "Thực hành pha chế dung dịch với nồng độ xác định và tính toán liên quan",
  level: "Advanced", // Đổi từ "Practice" thành "Advanced"
  order: 42,
  theory: `
      <h2>🧪 Thực hành: Pha chế dung dịch</h2>
      
      <h3>🎯 Mục tiêu</h3>
      <ul>
        <li>Biết cách pha chế dung dịch có nồng độ xác định</li>
        <li>Rèn luyện kỹ năng tính toán và cân đong chính xác</li>
        <li>Thực hành pha loãng và cô đặc dung dịch</li>
        <li>Kiểm tra nồng độ dung dịch</li>
      </ul>

      <h3>🔬 Thí nghiệm 1: Pha chế dung dịch từ chất rắn</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>Bài toán: Pha 100g dung dịch NaCl 10%</h4>
        
        <p><strong>Bước 1: Tính toán</strong></p>
        <p>• m<sub>NaCl</sub> = (10 × 100)/100 = 10g</p>
        <p>• m<sub>nước</sub> = 100 - 10 = 90g</p>
        
        <p><strong>Bước 2: Cân chất tan</strong></p>
        <p>• Đặt cốc cân trên cân</p>
        <p>• Cân chính xác 10g NaCl</p>
        
        <p><strong>Bước 3: Đong dung môi</strong></p>
        <p>• Dùng bình chia độ đong 90ml nước (≈ 90g)</p>
        <p>• Hoặc cân 90g nước</p>
        
        <p><strong>Bước 4: Pha chế</strong></p>
        <p>• Cho NaCl vào cốc</p>
        <p>• Thêm nước, khuấy đều cho tan hết</p>
        <p>• Được dung dịch NaCl 10%</p>
      </div>

      <h3>🔬 Thí nghiệm 2: Pha loãng dung dịch</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Bài toán: Từ dung dịch NaCl 20% pha thành 10%</h4>
        
        <p><strong>Nguyên tắc:</strong> Khối lượng chất tan không đổi</p>
        <p>m<sub>ct ban đầu</sub> = m<sub>ct sau</sub></p>
        <p>(C%<sub>1</sub> × m<sub>dd1</sub>)/100 = (C%<sub>2</sub> × m<sub>dd2</sub>)/100</p>
        
        <p><strong>Ví dụ:</strong> Từ 50g dd 20% pha thành dd 10%</p>
        <p>• Khối lượng chất tan: 50 × 20/100 = 10g</p>
        <p>• Khối lượng dd mới: 10g/(10/100) = 100g</p>
        <p>• Cần thêm nước: 100 - 50 = 50g</p>
      </div>

      <h3>🔬 Thí nghiệm 3: Cô đặc dung dịch</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>Phương pháp: Làm bay hơi dung môi</h4>
        
        <p><strong>Cách làm:</strong></p>
        <p>• Đổ dung dịch vào chén sứ</p>
        <p>• Đun nhẹ trên bếp cồn</p>
        <p>• Khuấy đều, không để khô cạn</p>
        <p>• Cân lại để xác định khối lượng còn lại</p>
        
        <p><strong>Lưu ý:</strong> Khối lượng chất tan không đổi, chỉ có nước bay hơi</p>
      </div>

      <h3>⚗️ Dụng cụ cần thiết</h3>
      <ul>
        <li>⚖️ Cân điện tử (độ chính xác 0,1g)</li>
        <li>🧪 Bình chia độ (100ml, 250ml)</li>
        <li>🥄 Đũa thủy tinh, thìa múc</li>
        <li>🔬 Cốc thủy tinh, chén sứ</li>
        <li>🔥 Đèn cồn (nếu cô đặc)</li>
      </ul>

      <h3>⚠️ An toàn</h3>
      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <p>✅ Kiểm tra độ chính xác của cân</p>
        <p>✅ Khuấy nhẹ nhàng, tránh văng dung dịch</p>
        <p>✅ Cẩn thận khi đun nóng (đeo găng tay)</p>
        <p>✅ Rửa sạch dụng cụ sau khi sử dụng</p>
      </div>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Để pha 100g dung dịch NaCl 10%, cần bao nhiêu gam NaCl?",
    options: [
      "5g",
      "10g",
      "15g",
      "20g"
    ],
    correctAnswer: 1,
    explanation: "✅ m<sub>NaCl</sub> = (10 × 100)/100 = 10g",
    points: 10
  },
  {
    type: "true-false",
    question: "Khi pha loãng dung dịch, khối lượng chất tan không đổi.",
    correctAnswer: true,
    explanation: "✅ Đúng! Chỉ thêm nước, chất tan không thay đổi.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Để pha 100g dung dịch NaCl 10%, cần bao nhiêu gam nước?",
    options: [
      "10g",
      "50g",
      "90g",
      "100g"
    ],
    correctAnswer: 2,
    explanation: "✅ m<sub>nước</sub> = 100 - 10 = 90g",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Khi cô đặc dung dịch, ta làm bay hơi ___.",
    correctAnswer: "nước",
    hint: "💡 Dung môi",
    explanation: "✅ Cô đặc bằng cách làm bay hơi NƯỚC.",
    points: 10
  },
  {
    type: "true-false",
    question: "Cân điện tử phải có độ chính xác 0,1g khi pha chế dung dịch.",
    correctAnswer: true,
    explanation: "✅ Đúng! Cần cân chính xác để đảm bảo nồng độ.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép bước với thao tác",
    pairs: [
      {
        left: "Bước 1",
        right: "Tính toán m<sub>ct</sub> và m<sub>dm</sub>"
      },
      {
        left: "Bước 2",
        right: "Cân chất tan"
      },
      {
        left: "Bước 3",
        right: "Đong dung môi"
      },
      {
        left: "Bước 4",
        right: "Hòa tan và khuấy đều"
      }
    ],
    explanation: "✅ Đúng trình tự pha chế dung dịch!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Từ 50g dung dịch 20%, muốn pha loãng thành dung dịch 10%, cần thêm ___ g nước.",
    correctAnswer: "50",
    hint: "💡 Khối lượng chất tan không đổi",
    explanation: "✅ m<sub>ct</sub> = 10g → m<sub>dd mới</sub> = 100g → Thêm 50g nước",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước pha loãng dung dịch",
    options: [
      "Tính khối lượng nước cần thêm",
      "Lấy lượng dung dịch ban đầu",
      "Thêm nước và khuấy đều",
      "Kiểm tra nồng độ"
    ],
    correctOrder: [
      "Tính khối lượng nước cần thêm",
      "Lấy lượng dung dịch ban đầu",
      "Thêm nước và khuấy đều",
      "Kiểm tra nồng độ"
    ],
    explanation: "✅ Đúng trình tự pha loãng!",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Khi cô đặc dung dịch bằng cách đun nóng, điều gì xảy ra?",
    options: [
      "Chất tan bay hơi",
      "Nước bay hơi, nồng độ tăng",
      "Nồng độ giảm",
      "Không có gì thay đổi"
    ],
    correctAnswer: 1,
    explanation: "✅ Nước bay hơi → khối lượng dung dịch giảm → nồng độ TĂNG.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Công thức pha loãng: C%₁ × m<sub>dd1</sub> = C%₂ × ___.",
    correctAnswer: "m<sub>dd2</sub>",
    hint: "💡 Khối lượng dung dịch sau",
    explanation: "✅ C%₁ × m<sub>dd1</sub> = C%₂ × m<sub>dd2</sub>",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Khi pha loãng từ C%₁ thành C%₂ (C%₁ > C%₂), ta có: ___ × ___ = ___ × ___, từ đó tính được khối lượng ___ cần thêm.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Nồng độ 1",
        correct: "C%₁"
      },
      {
        id: 2,
        label: "KL dd 1",
        correct: "m<sub>dd1</sub>"
      },
      {
        id: 3,
        label: "Nồng độ 2",
        correct: "C%₂"
      },
      {
        id: 4,
        label: "KL dd 2",
        correct: "m<sub>dd2</sub>"
      },
      {
        id: 5,
        label: "Chất thêm",
        correct: "nước"
      }
    ],
    options: [
      "C%₁",
      "m<sub>dd1</sub>",
      "C%₂",
      "m<sub>dd2</sub>",
      "nước"
    ],
    explanation: "✅ C%₁ × m<sub>dd1</sub> = C%₂ × m<sub>dd2</sub>, sau đó tính khối lượng NƯỚC cần thêm.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Có 200g dung dịch muối 15%. Cần thêm bao nhiêu gam muối để được dung dịch 20%?",
    options: [
      "10g",
      "12,5g",
      "15g",
      "20g"
    ],
    correctAnswer: 1,
    explanation: "✅ Gọi x là khối lượng muối thêm:\n(30 + x)/(200 + x) = 20/100 → x = 12,5g",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Đun bay hơi 50g nước từ 100g dung dịch NaCl 10%, nồng độ mới là ___%. (Làm tròn 1 chữ số)",
    correctAnswer: "20",
    hint: "💡 m<sub>ct</sub> không đổi = 10g, m<sub>dd mới</sub> = ?",
    explanation: "✅ m<sub>ct</sub> = 10g, m<sub>dd mới</sub> = 50g → C% = 10/50 × 100% = 20%",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích thao tác pha chế",
    pairs: [
      {
        left: "Pha từ chất rắn",
        right: "Cân chất tan + Đong nước"
      },
      {
        left: "Pha loãng",
        right: "Thêm nước vào dung dịch đặc"
      },
      {
        left: "Cô đặc",
        right: "Làm bay hơi nước"
      },
      {
        left: "Pha đặc hơn",
        right: "Thêm chất tan vào dung dịch"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu rõ các phương pháp pha chế.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trộn 100g dd A (20%) với 200g dd A (10%). Nồng độ % dd mới là:",
    options: [
      "12%",
      "13,33%",
      "15%",
      "16,67%"
    ],
    correctAnswer: 1,
    explanation: "✅ m<sub>ct</sub> = 100×20/100 + 200×10/100 = 40g\nm<sub>dd</sub> = 300g → C% = 40/300 × 100% = 13,33%",
    points: 10
  }
]
};
