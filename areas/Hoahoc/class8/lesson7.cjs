module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 7,
  title: "Bài 7: Công thức hóa học",
  description: "Cách viết và ý nghĩa của công thức hóa học",
  level: "Beginner",
  order: 7,
  theory: `
      <h2>📝 Công thức hóa học là gì?</h2>
      <p><strong>Công thức hóa học</strong> là cách biểu diễn chất bằng ký hiệu hóa học.</p>
      
      <h3>✍️ Cách viết công thức</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Quy tắc:</strong></p>
        <p>• Viết ký hiệu nguyên tố</p>
        <p>• Viết chỉ số (số nguyên tử) ở dưới bên phải</p>
        <p>• Nếu chỉ 1 nguyên tử thì không viết chỉ số</p>
      </div>

      <h3>📊 Ví dụ</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Công thức</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Đọc</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ý nghĩa</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px;">H₂O</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Ha-hai-ô</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">2H, 1O</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px;">CO₂</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Xê-ô-hai</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">1C, 2O</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px;">NaCl</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Na-clo</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">1Na, 1Cl</td>
        </tr>
      </table>

      <h3>💡 Ý nghĩa công thức</h3>
      <p>Công thức H₂O cho biết:</p>
      <ul>
        <li>Chất: Nước</li>
        <li>Thành phần: H và O</li>
        <li>Số lượng: 2 nguyên tử H, 1 nguyên tử O</li>
      </ul>
    `,
  game: [
    {
      "type": "multiple-choice",
      "question": "Công thức hóa học dùng để làm gì?",
      "options": [
        "Biểu diễn chất",
        "Tính toán",
        "Vẽ hình",
        "Đo lường"
      ],
      "correctAnswer": 0,
      "explanation": "✅ Công thức hóa học dùng để biểu diễn chất bằng ký hiệu.",
      "points": 10
    },
      {
            "type": "true-false",
            "question": "Trong H₂O, chỉ số 2 nghĩa là có 2 nguyên tử H.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! Chỉ số viết dưới bên phải cho biết số nguyên tử.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Công thức nào đúng cho nước?",
            "options": [
                  "HO",
                  "H2O",
                  "H₂O",
                  "HO₂"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Nước có công thức H₂O (2 nguyên tử H, 1 nguyên tử O).",
            "points": 10
      },
      {
            "type": "true-false",
            "question": "NaCl có 1 nguyên tử Na và 1 nguyên tử Cl.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! Khi không có chỉ số thì mặc định là 1.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Trong CO₂ có bao nhiêu nguyên tử Oxi?",
            "options": [
                  "1",
                  "2",
                  "3",
                  "4"
            ],
            "correctAnswer": 1,
            "explanation": "✅ CO₂ có chỉ số 2 ở O nên có 2 nguyên tử Oxi.",
            "points": 10
      },
    {
            "type": "matching",
            "question": "🔗 Ghép công thức với tên",
            "pairs": [
                  {
                        "left": "H₂O",
                        "right": "Nước"
                  },
                  {
                        "left": "CO₂",
                        "right": "Khí cacbonic"
                  },
                  {
                        "left": "NaCl",
                        "right": "Muối ăn"
                  },
                  {
                        "left": "O₂",
                        "right": "Khí oxi"
                  }
            ],
            "explanation": "✅ Bạn đã nhớ tên các chất phổ biến!",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Công thức H₂SO₄ có ___ nguyên tử H, ___ nguyên tử S, ___ nguyên tử O.",
            "correctAnswer": "2, 1, 4",
            "hint": "💡 Nhìn vào chỉ số trong công thức",
            "explanation": "✅ H₂SO₄: 2H + 1S + 4O.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Công thức nào cho biết có 3 nguyên tử O?",
            "options": [
                  "O₂",
                  "O₃",
                  "CO₂",
                  "H₂O"
            ],
            "correctAnswer": 1,
            "explanation": "✅ O₃ (ozon) có 3 nguyên tử Oxi.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Trong phân tử NH₃ có ___ nguyên tử tổng cộng.",
            "correctAnswer": "4",
            "hint": "💡 1N + 3H = ?",
            "explanation": "✅ NH₃ có 1N + 3H = 4 nguyên tử.",
            "points": 10
      },
      {
            "type": "ordering",
            "question": "📋 Sắp xếp theo số nguyên tử tăng dần",
            "options": [
                  "NaCl (2)",
                  "H₂O (3)",
                  "NH₃ (4)",
                  "H₂SO₄ (7)"
            ],
            "correctOrder": [
                  "NaCl (2)",
                  "H₂O (3)",
                  "NH₃ (4)",
                  "H₂SO₄ (7)"
            ],
            "explanation": "✅ NaCl:2, H₂O:3, NH₃:4, H₂SO₄:7.",
            "points": 10
      },
    {
            "type": "drag-drop",
            "question": "🧩 Công thức H₂SO₄ gồm ___ nguyên tố: H, ___, và O.",
            "inline": true,
            "slots": [
                  {
                        "id": 1,
                        "label": "Số nguyên tố",
                        "correct": "3"
                  },
                  {
                        "id": 2,
                        "label": "Nguyên tố còn thiếu",
                        "correct": "S"
                  }
            ],
            "options": [
                  "2",
                  "3",
                  "S",
                  "N"
            ],
            "explanation": "✅ H₂SO₄ có 3 nguyên tố: H, S, O.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Nếu công thức là X₂Y₃, tổng số nguyên tử là bao nhiêu?",
            "options": [
                  "2",
                  "3",
                  "5",
                  "6"
            ],
            "correctAnswer": 2,
            "explanation": "✅ X₂Y₃ = 2 nguyên tử X + 3 nguyên tử Y = 5 nguyên tử.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Công thức Ca(OH)₂ có ___ nguyên tử O và ___ nguyên tử H.",
            "correctAnswer": "2, 2",
            "hint": "💡 Chỉ số ngoài ngoặc nhân với chỉ số trong ngoặc",
            "explanation": "✅ (OH)₂ = 2 nhóm OH = 2O + 2H.",
            "points": 10
      },
      {
            "type": "matching",
            "question": "🧠 Ghép công thức với số nguyên tử",
            "pairs": [
                  {
                        "left": "H₂",
                        "right": "2 nguyên tử"
                  },
                  {
                        "left": "H₂O",
                        "right": "3 nguyên tử"
                  },
                  {
                        "left": "CO₂",
                        "right": "3 nguyên tử"
                  },
                  {
                        "left": "H₂SO₄",
                        "right": "7 nguyên tử"
                  }
            ],
            "explanation": "✅ Tính đúng số nguyên tử trong mỗi công thức!",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Công thức Al₂(SO₄)₃ có tất cả bao nhiêu nguyên tử O?",
            "options": [
                  "4",
                  "8",
                  "12",
                  "16"
            ],
            "correctAnswer": 2,
            "explanation": "✅ (SO₄)₃ = 3 nhóm SO₄ = 3×4 = 12 nguyên tử O.",
            "points": 10
      }
  ]
};
