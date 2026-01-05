module.exports = {
  classId: 8,
  chapterId: 6,
  lessonId: 40,
  title: "Bài 40: Nồng độ dung dịch",
  description: "Nồng độ phần trăm (C%) và nồng độ mol (CM), cách tính và ứng dụng",
  level: "Intermediate",
  order: 40,
  theory: `
      <h2>📊 Nồng độ dung dịch</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Nồng độ dung dịch</strong> cho biết lượng chất tan có trong một lượng dung dịch hoặc dung môi nhất định.</p>
      </div>

      <h3>📈 1. Nồng độ phần trăm (C%)</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p><strong>Định nghĩa:</strong> Số gam chất tan có trong 100g dung dịch.</p>
        <p style="text-align: center; font-size: 20px; background: #fff; padding: 10px; border-radius: 8px;">
          <strong>C% = (m<sub>ct</sub> / m<sub>dd</sub>) × 100%</strong>
        </p>
        <p>Trong đó:</p>
        <p>• m<sub>ct</sub>: khối lượng chất tan (g)</p>
        <p>• m<sub>dd</sub>: khối lượng dung dịch (g)</p>
        <p>• m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dm</sub> (dung môi)</p>
        
        <p><strong>Ví dụ:</strong> Dung dịch muối 10% nghĩa là trong 100g dung dịch có 10g muối.</p>
      </div>

      <h3>🧪 2. Nồng độ mol (C<sub>M</sub>)</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <p><strong>Định nghĩa:</strong> Số mol chất tan có trong 1 lít dung dịch.</p>
        <p style="text-align: center; font-size: 20px; background: #fff; padding: 10px; border-radius: 8px;">
          <strong>C<sub>M</sub> = n / V</strong>
        </p>
        <p>Trong đó:</p>
        <p>• C<sub>M</sub>: nồng độ mol (mol/lít hoặc M)</p>
        <p>• n: số mol chất tan (mol)</p>
        <p>• V: thể tích dung dịch (lít)</p>
        
        <p><strong>Ví dụ:</strong> Dung dịch NaCl 0,5M có 0,5 mol NaCl trong 1 lít dung dịch.</p>
      </div>

      <h3>🔄 Công thức liên quan</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Công thức</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ý nghĩa</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">n = m/M</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Số mol = Khối lượng / Khối lượng mol</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dm</sub></td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Khối lượng dung dịch</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">m<sub>ct</sub> = (C% × m<sub>dd</sub>) / 100</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Khối lượng chất tan</td>
        </tr>
      </table>

      <h3>💡 Ứng dụng</h3>
      <ul>
        <li>💊 Pha chế thuốc theo đúng liều lượng</li>
        <li>🧂 Pha nước muối sinh lý (0,9%)</li>
        <li>🧪 Chuẩn bị dung dịch trong phòng thí nghiệm</li>
        <li>🏭 Kiểm soát nồng độ trong sản xuất công nghiệp</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Nồng độ phần trăm (C%) cho biết điều gì?",
    options: [
      "Số mol chất tan trong 1 lít",
      "Số gam chất tan trong 100g dung dịch",
      "Thể tích dung dịch",
      "Khối lượng dung môi"
    ],
    correctAnswer: 1,
    explanation: "✅ C% = số gam chất tan trong 100g dung dịch.",
    points: 10
  },
  {
    type: "true-false",
    question: "Công thức tính C% là: C% = (m chất tan / m dung dịch) × 100%",
    correctAnswer: true,
    explanation: "✅ Đúng! C% = (m<sub>ct</sub> / m<sub>dd</sub>) × 100%",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Đơn vị của nồng độ mol (C<sub>M</sub>) là gì?",
    options: [
      "%",
      "g/lít",
      "mol/lít (M)",
      "g/100g"
    ],
    correctAnswer: 2,
    explanation: "✅ C<sub>M</sub> có đơn vị: mol/lít hoặc M.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Khối lượng dung dịch = khối lượng chất tan + khối lượng ___.",
    correctAnswer: "dung môi",
    hint: "💡 Thành phần còn lại của dung dịch",
    explanation: "✅ m<sub>dd</sub> = m<sub>ct</sub> + m<sub>dung môi</sub>",
    points: 10
  },
  {
    type: "true-false",
    question: "Dung dịch muối 10% có nghĩa là trong 100g dung dịch có 10g muối.",
    correctAnswer: true,
    explanation: "✅ Đúng! 10% = 10g chất tan trong 100g dung dịch.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép đại lượng với ký hiệu",
    pairs: [
      {
        left: "Nồng độ phần trăm",
        right: "C%"
      },
      {
        left: "Nồng độ mol",
        right: "C<sub>M</sub>"
      },
      {
        left: "Số mol",
        right: "n"
      },
      {
        left: "Khối lượng mol",
        right: "M"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn nhớ đúng các ký hiệu.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Hòa tan 20g muối vào 80g nước, nồng độ % của dung dịch là ___%. (Làm tròn 1 chữ số)",
    correctAnswer: "20",
    hint: "💡 C% = (20 / (20+80)) × 100%",
    explanation: "✅ C% = (20/100) × 100% = 20%",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Công thức tính nồng độ mol là:",
    options: [
      "C<sub>M</sub> = m/V",
      "C<sub>M</sub> = n/V",
      "C<sub>M</sub> = V/n",
      "C<sub>M</sub> = n×V"
    ],
    correctAnswer: 1,
    explanation: "✅ C<sub>M</sub> = n/V (số mol / thể tích lít)",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước pha chế dung dịch",
    options: [
      "Tính khối lượng chất tan cần dùng",
      "Cân chất tan",
      "Hòa tan vào dung môi",
      "Khuấy đều tạo dung dịch"
    ],
    correctOrder: [
      "Tính khối lượng chất tan cần dùng",
      "Cân chất tan",
      "Hòa tan vào dung môi",
      "Khuấy đều tạo dung dịch"
    ],
    explanation: "✅ Đúng trình tự pha chế dung dịch!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để tính số mol từ khối lượng, ta dùng công thức: n = m / ___.",
    correctAnswer: "M",
    hint: "💡 Khối lượng mol",
    explanation: "✅ n = m/M (M là khối lượng mol)",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: C% = (___ / ___) × 100%, C<sub>M</sub> = ___ / ___",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Tử số C%",
        correct: "m chất tan"
      },
      {
        id: 2,
        label: "Mẫu số C%",
        correct: "m dung dịch"
      },
      {
        id: 3,
        label: "Tử số CM",
        correct: "n"
      },
      {
        id: 4,
        label: "Mẫu số CM",
        correct: "V"
      }
    ],
    options: [
      "m chất tan",
      "m dung dịch",
      "n",
      "V"
    ],
    explanation: "✅ C% = (m<sub>ct</sub>/m<sub>dd</sub>)×100%, C<sub>M</sub> = n/V",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hòa tan 40g NaCl vào 160g nước. Nồng độ % của dung dịch là:",
    options: [
      "20%",
      "25%",
      "40%",
      "50%"
    ],
    correctAnswer: 0,
    explanation: "✅ C% = 40/(40+160) × 100% = 40/200 × 100% = 20%",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Dung dịch NaCl 0,1M có ___ mol NaCl trong 1 lít dung dịch.",
    correctAnswer: "0,1",
    hint: "💡 Đọc giá trị C<sub>M</sub>",
    explanation: "✅ 0,1M nghĩa là 0,1 mol/lít.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Tính toán nồng độ",
    pairs: [
      {
        left: "10g muối + 90g nước",
        right: "C% = 10%"
      },
      {
        left: "25g đường + 75g nước",
        right: "C% = 25%"
      },
      {
        left: "0,5 mol NaCl trong 2 lít",
        right: "C<sub>M</sub> = 0,25M"
      },
      {
        left: "1 mol HCl trong 1 lít",
        right: "C<sub>M</sub> = 1M"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn tính đúng các nồng độ.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Muốn pha 200g dung dịch NaCl 15%, cần bao nhiêu gam NaCl?",
    options: [
      "15g",
      "30g",
      "45g",
      "60g"
    ],
    correctAnswer: 1,
    explanation: "✅ m<sub>NaCl</sub> = (15 × 200)/100 = 30g",
    points: 10
  }
]
};
