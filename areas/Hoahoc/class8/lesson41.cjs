module.exports = {
  classId: 8,
  chapterId: 6,
  lessonId: 41,
  title: "Bài 41: Bài luyện tập 8 - Tính toán về dung dịch",
  description: "Ôn tập và luyện tập về dung dịch, độ tan, nồng độ phần trăm và nồng độ mol",
  level: "Intermediate",
  order: 41,
  theory: `
      <h2>📝 Ôn tập Chương 6: Dung dịch</h2>
      
      <h3>🔍 Tóm tắt kiến thức</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Dung dịch</h4>
        <p>• Dung dịch = Chất tan + Dung môi</p>
        <p>• Là hỗn hợp đồng nhất, không có cặn</p>
        <p>• Phân loại: rắn, lỏng, khí</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Độ tan (S)</h4>
        <p>• S = số gam chất tan tối đa trong 100g nước ở nhiệt độ xác định</p>
        <p>• Đơn vị: g/100g H₂O</p>
        <p>• Chất rắn: độ tan tăng khi nhiệt độ tăng (đa số)</p>
        <p>• Chất khí: độ tan giảm khi nhiệt độ tăng</p>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>3. Nồng độ dung dịch</h4>
        <p><strong>a) Nồng độ phần trăm (C%):</strong></p>
        <p style="text-align: center; font-size: 18px; background: #fff; padding: 10px; border-radius: 8px;">
          C% = (m<sub>ct</sub> / m<sub>dd</sub>) × 100%
        </p>
        
        <p><strong>b) Nồng độ mol (C<sub>M</sub>):</strong></p>
        <p style="text-align: center; font-size: 18px; background: #fff; padding: 10px; border-radius: 8px;">
          C<sub>M</sub> = n / V
        </p>
      </div>

      <h3>📊 Công thức quan trọng</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Công thức</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ý nghĩa</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dm</sub></td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Khối lượng dung dịch</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">n = m/M</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Số mol</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">m<sub>ct</sub> = (C% × m<sub>dd</sub>)/100</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Khối lượng chất tan</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">n = C<sub>M</sub> × V</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Số mol từ nồng độ mol</td>
        </tr>
      </table>

      <h3>💡 Các dạng bài tập thường gặp</h3>
      <ul>
        <li>📐 Tính nồng độ % khi biết khối lượng chất tan và dung môi</li>
        <li>⚖️ Tính khối lượng chất tan cần pha chế dung dịch</li>
        <li>🧪 Tính nồng độ mol từ khối lượng và thể tích</li>
        <li>🔄 Chuyển đổi giữa C% và C<sub>M</sub></li>
        <li>📈 Bài toán về độ tan và dung dịch bão hòa</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Công thức tính nồng độ % là gì?",
    options: [
      "C% = m<sub>ct</sub> / m<sub>dm</sub> × 100%",
      "C% = m<sub>ct</sub> / m<sub>dd</sub> × 100%",
      "C% = m<sub>dd</sub> / m<sub>ct</sub> × 100%",
      "C% = n / V × 100%"
    ],
    correctAnswer: 1,
    explanation: "✅ C% = (m<sub>chất tan</sub> / m<sub>dung dịch</sub>) × 100%",
    points: 10
  },
  {
    type: "true-false",
    question: "Khối lượng dung dịch = Khối lượng chất tan + Khối lượng dung môi.",
    correctAnswer: true,
    explanation: "✅ Đúng! m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dm</sub>",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hòa tan 10g muối vào 90g nước, nồng độ % là bao nhiêu?",
    options: [
      "10%",
      "11,1%",
      "9%",
      "20%"
    ],
    correctAnswer: 0,
    explanation: "✅ C% = 10/(10+90) × 100% = 10%",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để tính số mol từ khối lượng, ta dùng công thức: n = m / ___",
    correctAnswer: "M",
    hint: "💡 Khối lượng mol",
    explanation: "✅ n = m/M (M là khối lượng mol)",
    points: 10
  },
  {
    type: "true-false",
    question: "Độ tan của đa số chất rắn tăng khi nhiệt độ tăng.",
    correctAnswer: true,
    explanation: "✅ Đúng! Chất rắn thường tan nhiều hơn ở nhiệt độ cao.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép công thức với đại lượng tính",
    pairs: [
      {
        left: "C% = (m<sub>ct</sub>/m<sub>dd</sub>) × 100%",
        right: "Nồng độ phần trăm"
      },
      {
        left: "C<sub>M</sub> = n/V",
        right: "Nồng độ mol"
      },
      {
        left: "n = m/M",
        right: "Số mol"
      },
      {
        left: "m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dm</sub>",
        right: "Khối lượng dung dịch"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn nhớ chính xác các công thức.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Muốn pha 500g dung dịch NaCl 20%, cần ___ g NaCl.",
    correctAnswer: "100",
    hint: "💡 m<sub>ct</sub> = (C% × m<sub>dd</sub>)/100",
    explanation: "✅ m<sub>NaCl</sub> = (20 × 500)/100 = 100g",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hòa tan 25g đường vào bao nhiêu gam nước để được dung dịch 20%?",
    options: [
      "75g",
      "100g",
      "125g",
      "150g"
    ],
    correctAnswer: 1,
    explanation: "✅ 20% = 25/(25+x) × 100% → 20(25+x) = 2500 → x = 100g",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước tính nồng độ %",
    options: [
      "Xác định m<sub>chất tan</sub>",
      "Tính m<sub>dung dịch</sub> = m<sub>ct</sub> + m<sub>dm</sub>",
      "Áp dụng công thức C% = (m<sub>ct</sub>/m<sub>dd</sub>) × 100%",
      "Tính toán và ghi kết quả"
    ],
    correctOrder: [
      "Xác định m<sub>chất tan</sub>",
      "Tính m<sub>dung dịch</sub> = m<sub>ct</sub> + m<sub>dm</sub>",
      "Áp dụng công thức C% = (m<sub>ct</sub>/m<sub>dd</sub>) × 100%",
      "Tính toán và ghi kết quả"
    ],
    explanation: "✅ Đúng trình tự giải bài!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nồng độ mol C<sub>M</sub> = ___ / V, trong đó V tính bằng đơn vị ___.",
    correctAnswer: "n, lít",
    hint: "💡 Số mol và đơn vị thể tích",
    explanation: "✅ C<sub>M</sub> = n/V (V tính bằng LÍT)",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Để pha dung dịch C% từ chất rắn, ta cần tính m<sub>ct</sub> = ___ × ___ / 100, sau đó cân ___ gam chất tan và hòa tan vào ___ gam nước.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Tử số 1",
        correct: "C%"
      },
      {
        id: 2,
        label: "Tử số 2",
        correct: "m<sub>dd</sub>"
      },
      {
        id: 3,
        label: "KL chất tan",
        correct: "m<sub>ct</sub>"
      },
      {
        id: 4,
        label: "KL nước",
        correct: "(m<sub>dd</sub> - m<sub>ct</sub>)"
      }
    ],
    options: [
      "C%",
      "m<sub>dd</sub>",
      "m<sub>ct</sub>",
      "(m<sub>dd</sub> - m<sub>ct</sub>)"
    ],
    explanation: "✅ m<sub>ct</sub> = (C% × m<sub>dd</sub>)/100, sau đó cân và hòa tan vào (m<sub>dd</sub> - m<sub>ct</sub>) gam nước.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hòa tan 11,7g NaCl (M=58,5) vào nước được 0,5 lít dung dịch. Nồng độ mol là:",
    options: [
      "0,2M",
      "0,4M",
      "0,5M",
      "1M"
    ],
    correctAnswer: 1,
    explanation: "✅ n = 11,7/58,5 = 0,2 mol → C<sub>M</sub> = 0,2/0,5 = 0,4M",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Ở 20°C, độ tan của KNO₃ là 31,6g/100g H₂O. Hòa tan 50g KNO₃ vào 100g nước ở 20°C, khối lượng KNO₃ dư là ___ g.",
    correctAnswer: "18,4",
    hint: "💡 Tan tối đa bao nhiêu?",
    explanation: "✅ Tan tối đa 31,6g, dư: 50 - 31,6 = 18,4g",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích bài toán dung dịch",
    pairs: [
      {
        left: "Biết m<sub>ct</sub>, m<sub>dm</sub> → Tìm C%",
        right: "C% = m<sub>ct</sub>/(m<sub>ct</sub>+m<sub>dm</sub>) × 100%"
      },
      {
        left: "Biết C%, m<sub>dd</sub> → Tìm m<sub>ct</sub>",
        right: "m<sub>ct</sub> = (C% × m<sub>dd</sub>)/100"
      },
      {
        left: "Biết m, M → Tìm n",
        right: "n = m/M"
      },
      {
        left: "Biết n, V → Tìm C<sub>M</sub>",
        right: "C<sub>M</sub> = n/V"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn nắm vững các dạng bài toán dung dịch.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trộn 200g dung dịch NaCl 10% với 300g dung dịch NaCl 20%. Nồng độ % dung dịch mới là:",
    options: [
      "12%",
      "14%",
      "16%",
      "18%"
    ],
    correctAnswer: 2,
    explanation: "✅ m<sub>ct</sub> = 200×10/100 + 300×20/100 = 80g\nm<sub>dd</sub> = 500g → C% = 80/500 × 100% = 16%",
    points: 10
  }
]
};
