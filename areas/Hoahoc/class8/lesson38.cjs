module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 38,
  title: "Bài 38: Dung dịch",
  description: "Khái niệm dung dịch, chất tan, dung môi và phân loại dung dịch",
  level: "Beginner",
  order: 38,
  theory: `
      <h2>💧 Dung dịch là gì?</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Dung dịch</strong> là hỗn hợp đồng nhất của hai hay nhiều chất.</p>
        <p><strong>Thành phần:</strong></p>
        <p>• <strong>Chất tan:</strong> Chất có lượng ít hơn, bị hòa tan</p>
        <p>• <strong>Dung môi:</strong> Chất có lượng nhiều hơn, làm tan chất khác</p>
        <p><em>Ví dụ:</em> Nước đường = Đường (chất tan) + Nước (dung môi)</p>
      </div>

      <h3>🌊 Đặc điểm của dung dịch</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p>✓ Là hỗn hợp <strong>đồng nhất</strong> (không phân biệt được các thành phần)</p>
        <p>✓ Trong suốt (có thể có màu)</p>
        <p>✓ Không lắng cặn</p>
        <p>✓ Thành phần phân bố đều khắp dung dịch</p>
      </div>

      <h3>📊 Phân loại dung dịch</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Theo trạng thái</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ví dụ</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Dung dịch rắn</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Hợp kim (đồng + kẽm = đồng thau)</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Dung dịch lỏng</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Nước muối, nước đường</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Dung dịch khí</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Không khí (N₂, O₂, CO₂...)</td>
        </tr>
      </table>

      <h3>🔬 Ví dụ về dung dịch trong đời sống</h3>
      <ul>
        <li>🧂 Nước muối (NaCl trong nước)</li>
        <li>🍬 Nước đường (đường trong nước)</li>
        <li>💊 Nước sinh lý (muối trong nước)</li>
        <li>🥤 Nước ngọt có ga (CO₂ trong nước)</li>
        <li>🌫️ Không khí (hỗn hợp các khí)</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Dung dịch là gì?",
    options: [
      "Chất tinh khiết",
      "Hỗn hợp đồng nhất của hai hay nhiều chất",
      "Chỉ là nước",
      "Hỗn hợp không đồng nhất"
    ],
    correctAnswer: 1,
    explanation: "✅ Dung dịch là hỗn hợp ĐỒNG NHẤT của hai hay nhiều chất.",
    points: 10
  },
  {
    type: "true-false",
    question: "Trong dung dịch nước muối, muối là chất tan và nước là dung môi.",
    correctAnswer: true,
    explanation: "✅ Đúng! Muối (ít hơn) là chất tan, nước (nhiều hơn) là dung môi.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Đặc điểm nào KHÔNG phải của dung dịch?",
    options: [
      "Đồng nhất",
      "Trong suốt",
      "Có cặn lắng",
      "Thành phần phân bố đều"
    ],
    correctAnswer: 2,
    explanation: "✅ Dung dịch KHÔNG có cặn lắng, luôn đồng nhất.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Dung dịch gồm ___ (chất ít hơn) và ___ (chất nhiều hơn).",
    correctAnswer: "chất tan, dung môi",
    hint: "💡 Hai thành phần chính của dung dịch",
    explanation: "✅ Dung dịch = CHẤT TAN + DUNG MÔI",
    points: 10
  },
  {
    type: "true-false",
    question: "Không khí là một dung dịch khí.",
    correctAnswer: true,
    explanation: "✅ Đúng! Không khí là dung dịch khí gồm N₂, O₂, CO₂...",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép dung dịch với loại",
    pairs: [
      {
        left: "Nước muối",
        right: "Dung dịch lỏng"
      },
      {
        left: "Không khí",
        right: "Dung dịch khí"
      },
      {
        left: "Đồng thau",
        right: "Dung dịch rắn"
      },
      {
        left: "Nước đường",
        right: "Dung dịch lỏng"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân loại đúng các dung dịch.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong nước đường, đường là ___ và nước là ___.",
    correctAnswer: "chất tan, dung môi",
    hint: "💡 Chất nào nhiều hơn, chất nào ít hơn?",
    explanation: "✅ Đường là CHẤT TAN, nước là DUNG MÔI.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Ví dụ nào KHÔNG phải là dung dịch?",
    options: [
      "Nước muối",
      "Không khí",
      "Nước + cát (có cặn)",
      "Nước đường"
    ],
    correctAnswer: 2,
    explanation: "✅ Nước + cát có cặn lắng, KHÔNG ĐỒNG NHẤT nên không phải dung dịch.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước tạo dung dịch muối",
    options: [
      "Lấy nước (dung môi)",
      "Cho muối vào nước",
      "Khuấy đều",
      "Muối tan hết tạo dung dịch"
    ],
    correctOrder: [
      "Lấy nước (dung môi)",
      "Cho muối vào nước",
      "Khuấy đều",
      "Muối tan hết tạo dung dịch"
    ],
    explanation: "✅ Đúng trình tự pha chế dung dịch!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Dung dịch là hỗn hợp ___, không có ___.",
    correctAnswer: "đồng nhất, cặn",
    hint: "💡 Đặc điểm chính của dung dịch",
    explanation: "✅ Dung dịch ĐỒNG NHẤT, không có CẶN.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Dung dịch = ___ + ___, là hỗn hợp ___.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Thành phần 1",
        correct: "Chất tan"
      },
      {
        id: 2,
        label: "Thành phần 2",
        correct: "Dung môi"
      },
      {
        id: 3,
        label: "Đặc điểm",
        correct: "đồng nhất"
      }
    ],
    options: [
      "Chất tan",
      "Dung môi",
      "đồng nhất",
      "không đồng nhất"
    ],
    explanation: "✅ Dung dịch = CHẤT TAN + DUNG MÔI, là hỗn hợp ĐỒNG NHẤT.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao nước + dầu KHÔNG tạo thành dung dịch?",
    options: [
      "Vì có màu khác nhau",
      "Vì dầu không tan trong nước, tạo hỗn hợp không đồng nhất",
      "Vì nước quá nhiều",
      "Vì dầu quá ít"
    ],
    correctAnswer: 1,
    explanation: "✅ Dầu KHÔNG TAN trong nước, tạo hỗn hợp KHÔNG ĐỒNG NHẤT (2 lớp riêng).",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Hợp kim đồng thau là dung dịch ___ của đồng và ___.",
    correctAnswer: "rắn, kẽm",
    hint: "💡 Trạng thái và kim loại thứ 2",
    explanation: "✅ Đồng thau là dung dịch RẮN của đồng và KẼM.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích thành phần dung dịch",
    pairs: [
      {
        left: "Nước muối sinh lý",
        right: "NaCl + H₂O"
      },
      {
        left: "Nước có ga",
        right: "CO₂ + H₂O"
      },
      {
        left: "Không khí",
        right: "N₂ + O₂ + CO₂..."
      },
      {
        left: "Giấm ăn",
        right: "CH₃COOH + H₂O"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu rõ thành phần các dung dịch.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trong dung dịch, dung môi thường là:",
    options: [
      "Chất có lượng ít nhất",
      "Chất có lượng nhiều nhất",
      "Chất có màu",
      "Chất rắn"
    ],
    correctAnswer: 1,
    explanation: "✅ Dung môi là chất có LƯỢNG NHIỀU NHẤT trong dung dịch.",
    points: 10
  }
]
};
