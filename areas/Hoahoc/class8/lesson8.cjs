module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 8,
  title: "Bài 8: Hóa trị",
  description: "Khái niệm hóa trị, quy tắc hóa trị, lập công thức",
  level: "Beginner",
  order: 8,
  theory: `
      <h2>🔗 Hóa trị là gì?</h2>
      <p><strong>Hóa trị</strong> là con số biểu thị khả năng liên kết của nguyên tử.</p>
      
      <h3>📊 Hóa trị một số nguyên tố</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Nguyên tố</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Hóa trị</th>
        </tr>
        <tr><td style="border: 1px solid #9ca3af; padding: 8px;">H</td><td style="border: 1px solid #9ca3af; padding: 8px;">I</td></tr>
        <tr><td style="border: 1px solid #9ca3af; padding: 8px;">O</td><td style="border: 1px solid #9ca3af; padding: 8px;">II</td></tr>
        <tr><td style="border: 1px solid #9ca3af; padding: 8px;">Na, K</td><td style="border: 1px solid #9ca3af; padding: 8px;">I</td></tr>
        <tr><td style="border: 1px solid #9ca3af; padding: 8px;">Ca, Mg</td><td style="border: 1px solid #9ca3af; padding: 8px;">II</td></tr>
        <tr><td style="border: 1px solid #9ca3af; padding: 8px;">Al</td><td style="border: 1px solid #9ca3af; padding: 8px;">III</td></tr>
      </table>

      <h3>📐 Quy tắc hóa trị</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Công thức: A<sub>x</sub>B<sub>y</sub></strong></p>
        <p style="text-align: center; font-size: 18px;">
          <strong>x × hóa trị A = y × hóa trị B</strong>
        </p>
      </div>

      <h3>💡 Ví dụ: Lập công thức Al và O</h3>
      <p>• Al có hóa trị III</p>
      <p>• O có hóa trị II</p>
      <p>• Công thức: Al<sub>2</sub>O<sub>3</sub> (vì 2×III = 3×II = 6)</p>
    `,
  game: [
    {
      "type": "multiple-choice",
      "question": "Hóa trị là gì?",
      "options": [
        "Khối lượng nguyên tử",
        "Khả năng liên kết của nguyên tử",
        "Số electron",
        "Số proton"
      ],
      "correctAnswer": 1,
      "explanation": "✅ Hóa trị biểu thị khả năng liên kết của nguyên tử.",
      "points": 10
    },
      {
            "type": "true-false",
            "question": "Hidro (H) có hóa trị I.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! H luôn có hóa trị I.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Oxi (O) có hóa trị bao nhiêu?",
            "options": [
                  "I",
                  "II",
                  "III",
                  "IV"
            ],
            "correctAnswer": 1,
            "explanation": "✅ O có hóa trị II.",
            "points": 10
      },
      {
            "type": "true-false",
            "question": "Trong H₂O, H có hóa trị I và O có hóa trị II.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! 2×I = 1×II = 2.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Nguyên tố nào có hóa trị III?",
            "options": [
                  "H",
                  "O",
                  "Al",
                  "Na"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Al (Nhôm) có hóa trị III.",
            "points": 10
      },
    {
            "type": "matching",
            "question": "🔗 Ghép nguyên tố với hóa trị",
            "pairs": [
                  {
                        "left": "H",
                        "right": "I"
                  },
                  {
                        "left": "O",
                        "right": "II"
                  },
                  {
                        "left": "Al",
                        "right": "III"
                  },
                  {
                        "left": "Na",
                        "right": "I"
                  }
            ],
            "explanation": "✅ Nhớ hóa trị các nguyên tố cơ bản!",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Theo quy tắc hóa trị: x × hóa trị A = y × hóa trị ___.",
            "correctAnswer": "B",
            "hint": "💡 Công thức AxBy",
            "explanation": "✅ Quy tắc: x × htA = y × htB.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Công thức nào đúng cho Mg (II) và Cl (I)?",
            "options": [
                  "MgCl",
                  "Mg₂Cl",
                  "MgCl₂",
                  "Mg₂Cl₂"
            ],
            "correctAnswer": 2,
            "explanation": "✅ MgCl₂ vì 1×II = 2×I = 2.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Trong Al₂O₃, Al có hóa trị ___ và O có hóa trị ___.",
            "correctAnswer": "III, II",
            "hint": "💡 Nhôm và Oxi",
            "explanation": "✅ Al: III, O: II (2×III = 3×II = 6).",
            "points": 10
      },
      {
            "type": "ordering",
            "question": "📋 Sắp xếp hóa trị tăng dần",
            "options": [
                  "H (I)",
                  "O (II)",
                  "Al (III)"
            ],
            "correctOrder": [
                  "H (I)",
                  "O (II)",
                  "Al (III)"
            ],
            "explanation": "✅ I < II < III.",
            "points": 10
      },
    {
            "type": "drag-drop",
            "question": "🧩 Lập công thức Ca (II) và O (II): Ca___O___.",
            "inline": true,
            "slots": [
                  {
                        "id": 1,
                        "label": "Chỉ số Ca",
                        "correct": ""
                  },
                  {
                        "id": 2,
                        "label": "Chỉ số O",
                        "correct": ""
                  }
            ],
            "options": [
                  "1",
                  "2",
                  "3",
                  "không có"
            ],
            "explanation": "✅ CaO (1×II = 1×II, không cần chỉ số).",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Lập công thức Fe (III) và O (II)?",
            "options": [
                  "FeO",
                  "Fe₂O₃",
                  "Fe₃O₂",
                  "FeO₂"
            ],
            "correctAnswer": 1,
            "explanation": "✅ Fe₂O₃ vì 2×III = 3×II = 6.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Nếu A có hóa trị II và B có hóa trị III thì công thức là A___B___.",
            "correctAnswer": "3, 2",
            "hint": "💡 Áp dụng quy tắc hóa trị",
            "explanation": "✅ A₃B₂ (3×II = 2×III = 6).",
            "points": 10
      },
      {
            "type": "matching",
            "question": "🧠 Ghép công thức với hóa trị",
            "pairs": [
                  {
                        "left": "H₂O",
                        "right": "H(I), O(II)"
                  },
                  {
                        "left": "Al₂O₃",
                        "right": "Al(III), O(II)"
                  },
                  {
                        "left": "MgCl₂",
                        "right": "Mg(II), Cl(I)"
                  }
            ],
            "explanation": "✅ Kiểm tra: x×htA = y×htB!",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Lập công thức Al (III) và S (II)?",
            "options": [
                  "AlS",
                  "Al₂S₃",
                  "Al₃S₂",
                  "AlS₂"
            ],
            "correctAnswer": 1,
            "explanation": "✅ Al₂S₃ vì 2×III = 3×II = 6.",
            "points": 10
      }
  ]
};
