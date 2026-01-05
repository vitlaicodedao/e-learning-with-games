module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 6,
  title: "Bài 6: Phân tử",
  description: "Khái niệm phân tử, phân tử đơn chất và hợp chất",
  level: "Beginner",
  order: 6,
  theory: `
      <h2>🧬 Phân tử là gì?</h2>
      <p><strong>Phân tử</strong> là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau.</p>
      
      <h3>📊 Phân loại phân tử</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Phân tử đơn chất</h4>
        <p>Gồm các nguyên tử của <strong>cùng 1 nguyên tố</strong></p>
        <p><strong>Ví dụ:</strong> O₂, H₂, N₂, Cl₂</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Phân tử hợp chất</h4>
        <p>Gồm các nguyên tử của <strong>2 nguyên tố trở lên</strong></p>
        <p><strong>Ví dụ:</strong> H₂O, CO₂, NaCl, H₂SO₄</p>
      </div>

      <h3>🔬 Kích thước phân tử</h3>
      <p>Phân tử có kích thước rất nhỏ: ~10⁻¹⁰ m</p>
      <p>Trong 1 giọt nước có khoảng 10²¹ phân tử H₂O!</p>

      <h3>💡 Ứng dụng</h3>
      <ul>
        <li>Hiểu cấu trúc chất</li>
        <li>Giải thích tính chất hóa học</li>
        <li>Dự đoán phản ứng hóa học</li>
      </ul>
    `,
  game: [
    {
      "type": "multiple-choice",
      "question": "Phân tử là gì?",
      "options": [
        "Hạt nhỏ nhất của chất",
        "Hạt đại diện cho chất",
        "Hạt trong hạt nhân",
        "Hạt mang điện"
      ],
      "correctAnswer": 1,
      "explanation": "✅ Phân tử là hạt đại diện cho chất, gồm các nguyên tử liên kết.",
      "points": 10
    },
      {
            "type": "true-false",
            "question": "O₂ là phân tử đơn chất.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! O₂ gồm 2 nguyên tử Oxi nên là phân tử đơn chất.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Phân tử nào là phân tử hợp chất?",
            "options": [
                  "O₂",
                  "H₂",
                  "H₂O",
                  "N₂"
            ],
            "correctAnswer": 2,
            "explanation": "✅ H₂O gồm 2 nguyên tố H và O nên là phân tử hợp chất.",
            "points": 10
      },
      {
            "type": "true-false",
            "question": "Phân tử H₂ gồm 2 nguyên tử Hidro.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! H₂ có 2 nguyên tử H liên kết với nhau.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Phân tử đơn chất gồm bao nhiêu nguyên tố?",
            "options": [
                  "1 nguyên tố",
                  "2 nguyên tố",
                  "3 nguyên tố",
                  "Nhiều nguyên tố"
            ],
            "correctAnswer": 0,
            "explanation": "✅ Phân tử đơn chất chỉ gồm 1 nguyên tố.",
            "points": 10
      },
    {
            "type": "matching",
            "question": "🔗 Ghép phân tử với loại",
            "pairs": [
                  {
                        "left": "O₂",
                        "right": "Phân tử đơn chất"
                  },
                  {
                        "left": "H₂O",
                        "right": "Phân tử hợp chất"
                  },
                  {
                        "left": "N₂",
                        "right": "Phân tử đơn chất"
                  },
                  {
                        "left": "CO₂",
                        "right": "Phân tử hợp chất"
                  }
            ],
            "explanation": "✅ O₂, N₂ là đơn chất (1 nguyên tố), H₂O, CO₂ là hợp chất (≥2 nguyên tố).",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Phân tử H₂O gồm ___ nguyên tử H và ___ nguyên tử O.",
            "correctAnswer": "2, 1",
            "hint": "💡 Nhìn vào công thức H₂O",
            "explanation": "✅ H₂O có 2 nguyên tử H và 1 nguyên tử O.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Trong phân tử CO₂ có bao nhiêu nguyên tố?",
            "options": [
                  "1",
                  "2",
                  "3",
                  "4"
            ],
            "correctAnswer": 1,
            "explanation": "✅ CO₂ gồm 2 nguyên tố: C (cacbon) và O (oxi).",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Phân tử N₂ là phân tử ___ (đơn chất/hợp chất).",
            "correctAnswer": "đơn chất",
            "hint": "💡 N₂ chỉ có nguyên tố N",
            "explanation": "✅ N₂ chỉ gồm nguyên tố Nitơ nên là ĐƠN CHẤT.",
            "points": 10
      },
      {
            "type": "ordering",
            "question": "📋 Sắp xếp theo số nguyên tử trong phân tử",
            "options": [
                  "H₂ (2 nguyên tử)",
                  "H₂O (3 nguyên tử)",
                  "H₂SO₄ (7 nguyên tử)"
            ],
            "correctOrder": [
                  "H₂ (2 nguyên tử)",
                  "H₂O (3 nguyên tử)",
                  "H₂SO₄ (7 nguyên tử)"
            ],
            "explanation": "✅ H₂: 2, H₂O: 3 (2H+1O), H₂SO₄: 7 (2H+1S+4O).",
            "points": 10
      },
    {
            "type": "drag-drop",
            "question": "🧩 Phân tử đơn chất gồm nguyên tử của ___ nguyên tố, phân tử hợp chất gồm ___ nguyên tố trở lên.",
            "inline": true,
            "slots": [
                  {
                        "id": 1,
                        "label": "Số nguyên tố đơn chất",
                        "correct": "1"
                  },
                  {
                        "id": 2,
                        "label": "Số nguyên tố hợp chất",
                        "correct": "2"
                  }
            ],
            "options": [
                  "1",
                  "2",
                  "3",
                  "nhiều"
            ],
            "explanation": "✅ Đơn chất: 1 nguyên tố, Hợp chất: ≥2 nguyên tố.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Phân tử nào có số nguyên tử nhiều nhất?",
            "options": [
                  "H₂",
                  "H₂O",
                  "CO₂",
                  "H₂SO₄"
            ],
            "correctAnswer": 3,
            "explanation": "✅ H₂SO₄ có 7 nguyên tử (2H + 1S + 4O).",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Trong 1 phân tử CO₂ có tổng cộng ___ nguyên tử.",
            "correctAnswer": "3",
            "hint": "💡 Đếm: 1C + 2O",
            "explanation": "✅ CO₂ = 1 nguyên tử C + 2 nguyên tử O = 3 nguyên tử.",
            "points": 10
      },
      {
            "type": "matching",
            "question": "🧠 Ghép phân tử với số nguyên tố",
            "pairs": [
                  {
                        "left": "O₂",
                        "right": "1 nguyên tố"
                  },
                  {
                        "left": "H₂O",
                        "right": "2 nguyên tố"
                  },
                  {
                        "left": "H₂SO₄",
                        "right": "3 nguyên tố"
                  }
            ],
            "explanation": "✅ O₂: 1 (O), H₂O: 2 (H,O), H₂SO₄: 3 (H,S,O).",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Tại sao O₂ không phải là nguyên tử mà là phân tử?",
            "options": [
                  "Vì O₂ quá nhỏ",
                  "Vì O₂ gồm 2 nguyên tử O liên kết",
                  "Vì O₂ là khí",
                  "Vì O₂ không tồn tại"
            ],
            "correctAnswer": 1,
            "explanation": "✅ O₂ là PHÂN TỬ vì gồm 2 nguyên tử O liên kết với nhau.",
            "points": 10
      }
  ]
};
