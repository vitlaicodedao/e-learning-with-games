module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 39,
  title: "Bài 39: Độ tan của một chất trong nước",
  description: "Tìm hiểu độ tan, các yếu tố ảnh hưởng và đường cong độ tan",
  level: "Intermediate",
  order: 39,
  theory: `
      <h2>📈 Độ tan là gì?</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Độ tan (S)</strong> của một chất trong nước là số gam chất đó tan tối đa trong 100g nước ở một nhiệt độ xác định.</p>
        <p><strong>Đơn vị:</strong> gam/100g nước (g/100g H₂O)</p>
        <p><em>Ví dụ:</em> Ở 20°C, độ tan của NaCl là 36g/100g H₂O</p>
      </div>

      <h3>🌡️ Các yếu tố ảnh hưởng đến độ tan</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Bản chất của chất tan</h4>
        <p>• Mỗi chất có độ tan khác nhau</p>
        <p>• NaCl tan nhiều, CaCO₃ tan rất ít</p>
        
        <h4>2. Nhiệt độ</h4>
        <p><strong>Chất rắn:</strong> Đa số độ tan tăng khi nhiệt độ tăng</p>
        <p><em>Ví dụ:</em> KNO₃: 13,3g (0°C) → 246g (100°C)</p>
        <p><strong>Chất khí:</strong> Độ tan giảm khi nhiệt độ tăng</p>
        <p><em>Ví dụ:</em> CO₂ tan nhiều ở nhiệt độ thấp</p>
      </div>

      <h3>📊 Phân loại dung dịch theo độ tan</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Loại dung dịch</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Đặc điểm</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;"><strong>Dung dịch chưa bão hòa</strong></td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Có thể hòa tan thêm chất tan ở nhiệt độ đó</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;"><strong>Dung dịch bão hòa</strong></td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Không thể hòa tan thêm chất tan ở nhiệt độ đó</td>
        </tr>
      </table>

      <h3>📉 Đường cong độ tan</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <p>Đồ thị biểu diễn sự thay đổi độ tan theo nhiệt độ</p>
        <p><strong>Ứng dụng:</strong></p>
        <p>• Dự đoán độ tan ở nhiệt độ khác</p>
        <p>• So sánh độ tan của các chất</p>
        <p>• Tính lượng chất kết tinh khi hạ nhiệt độ</p>
      </div>

      <h3>💡 Ứng dụng thực tế</h3>
      <ul>
        <li>☕ Hòa tan đường vào nước nóng dễ hơn nước lạnh</li>
        <li>🧂 Sản xuất muối bằng cách làm bốc hơi nước biển</li>
        <li>🏭 Tinh chế các chất bằng phương pháp kết tinh</li>
        <li>🥤 Nước ngọt có ga mát hơn (CO₂ tan nhiều)</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Độ tan của một chất là gì?",
    options: [
      "Khối lượng chất tan trong 1 lít nước",
      "Số gam chất tan tối đa trong 100g nước ở nhiệt độ xác định",
      "Thể tích dung dịch",
      "Khối lượng dung môi"
    ],
    correctAnswer: 1,
    explanation: "✅ Độ tan (S) = số gam chất tan TỐI ĐA trong 100g nước ở nhiệt độ xác định.",
    points: 10
  },
  {
    type: "true-false",
    question: "Độ tan của đa số chất rắn tăng khi nhiệt độ tăng.",
    correctAnswer: true,
    explanation: "✅ Đúng! Đa số chất rắn tan nhiều hơn khi nước nóng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Đơn vị của độ tan là gì?",
    options: [
      "gam",
      "g/100g H₂O",
      "mol/lít",
      "%"
    ],
    correctAnswer: 1,
    explanation: "✅ Độ tan có đơn vị: gam/100g nước (g/100g H₂O).",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Dung dịch ___ là dung dịch không thể hòa tan thêm chất tan ở nhiệt độ đó.",
    correctAnswer: "bão hòa",
    hint: "💡 Dung dịch đã đủ chất tan",
    explanation: "✅ Dung dịch BÃO HÒA không tan thêm được.",
    points: 10
  },
  {
    type: "true-false",
    question: "Độ tan của khí giảm khi nhiệt độ tăng.",
    correctAnswer: true,
    explanation: "✅ Đúng! Khí tan ít hơn khi nước nóng (VD: CO₂ trong nước ngọt).",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép yếu tố với ảnh hưởng",
    pairs: [
      {
        left: "Nhiệt độ tăng",
        right: "Độ tan chất rắn tăng"
      },
      {
        left: "Nhiệt độ tăng",
        right: "Độ tan chất khí giảm"
      },
      {
        left: "Bản chất chất tan",
        right: "Mỗi chất độ tan khác nhau"
      },
      {
        left: "Dung dịch bão hòa",
        right: "Không tan thêm được"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn hiểu các yếu tố ảnh hưởng độ tan.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Ở 20°C, độ tan của NaCl là 36g/100g H₂O nghĩa là tan tối đa ___ gam NaCl trong 100g nước.",
    correctAnswer: "36",
    hint: "💡 Đọc giá trị độ tan",
    explanation: "✅ Độ tan 36g/100g H₂O = tan tối đa 36 gam.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao đường tan nhanh hơn trong nước nóng?",
    options: [
      "Vì nước nóng có nhiều hơn",
      "Vì độ tan tăng khi nhiệt độ tăng",
      "Vì đường thích nước nóng",
      "Vì nước nóng nhẹ hơn"
    ],
    correctAnswer: 1,
    explanation: "✅ Độ tan của đường TĂNG khi nhiệt độ tăng.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp độ tan của KNO₃ theo nhiệt độ tăng dần",
    options: [
      "0°C: 13,3g",
      "20°C: 31,6g",
      "60°C: 110g",
      "100°C: 246g"
    ],
    correctOrder: [
      "0°C: 13,3g",
      "20°C: 31,6g",
      "60°C: 110g",
      "100°C: 246g"
    ],
    explanation: "✅ Đúng! Độ tan KNO₃ tăng mạnh theo nhiệt độ.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Dung dịch ___ là dung dịch có thể hòa tan thêm chất tan.",
    correctAnswer: "chưa bão hòa",
    hint: "💡 Dung dịch chưa đủ chất tan",
    explanation: "✅ Dung dịch CHƯA BÃO HÒA còn tan thêm được.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Độ tan = số gam chất tan ___ trong ___ gam nước ở nhiệt độ ___.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Mức độ",
        correct: "tối đa"
      },
      {
        id: 2,
        label: "Khối lượng nước",
        correct: "100"
      },
      {
        id: 3,
        label: "Điều kiện",
        correct: "xác định"
      }
    ],
    options: [
      "tối đa",
      "100",
      "xác định",
      "bất kỳ"
    ],
    explanation: "✅ Độ tan = số gam chất tan TỐI ĐA trong 100g nước ở nhiệt độ XÁC ĐỊNH.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Ở 20°C, độ tan của KNO₃ là 31,6g/100g H₂O. Hòa tan 50g KNO₃ vào 100g nước ở 20°C, dung dịch thu được là:",
    options: [
      "Dung dịch chưa bão hòa",
      "Dung dịch bão hòa, còn dư 18,4g KNO₃",
      "Dung dịch bão hòa không dư",
      "Không tạo dung dịch"
    ],
    correctAnswer: 1,
    explanation: "✅ Tan tối đa 31,6g, còn dư: 50 - 31,6 = 18,4g KNO₃.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nếu độ tan của muối A ở 20°C là 30g/100g H₂O, thì trong 200g nước ở 20°C tan tối đa ___ gam muối A.",
    correctAnswer: "60",
    hint: "💡 Gấp đôi lượng nước",
    explanation: "✅ 200g nước = 2 × 100g → tan 2 × 30 = 60g.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích ứng dụng độ tan",
    pairs: [
      {
        left: "Hòa tan đường vào trà nóng",
        right: "Độ tan tăng theo nhiệt độ"
      },
      {
        left: "Nước ngọt để lạnh ngon hơn",
        right: "Độ tan CO₂ tăng khi lạnh"
      },
      {
        left: "Sản xuất muối từ nước biển",
        right: "Làm bốc hơi nước"
      },
      {
        left: "Tinh chế KNO₃",
        right: "Kết tinh khi hạ nhiệt độ"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu ứng dụng của độ tan.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao không nên đun sôi nước có gas (CO₂)?",
    options: [
      "Vì nước sẽ cạn",
      "Vì CO₂ bay hết, mất gas",
      "Vì nước sẽ đổi màu",
      "Vì tốn điện"
    ],
    correctAnswer: 1,
    explanation: "✅ Độ tan của khí GIẢM khi nhiệt độ tăng, CO₂ sẽ thoát ra → MẤT GAS.",
    points: 10
  }
]
};
