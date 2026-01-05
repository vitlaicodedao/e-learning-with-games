module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 5,
  title: "Bài 5: Đơn chất và hợp chất",
  description: "Phân biệt đơn chất và hợp chất, ví dụ và ứng dụng",
  level: "Beginner",
  order: 5,
  theory: `
      <h2>🔬 Phân loại chất tinh khiết</h2>
      <p>Chất tinh khiết được chia thành 2 loại:</p>
      
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h3>1. Đơn chất</h3>
        <p><strong>Định nghĩa:</strong> Chất được tạo nên từ 1 nguyên tố hóa học.</p>
        <p><strong>Ví dụ:</strong></p>
        <p>• Kim loại: Fe (sắt), Cu (đồng), Au (vàng)</p>
        <p>• Phi kim: O₂ (oxi), S (lưu huỳnh), C (than chì)</p>
      </div>

      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h3>2. Hợp chất</h3>
        <p><strong>Định nghĩa:</strong> Chất được tạo nên từ 2 nguyên tố hóa học trở lên.</p>
        <p><strong>Ví dụ:</strong></p>
        <p>• H₂O (nước): gồm H và O</p>
        <p>• NaCl (muối ăn): gồm Na và Cl</p>
        <p>• CO₂ (khí cacbonic): gồm C và O</p>
      </div>

      <h3>📊 Bảng so sánh</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Tiêu chí</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Đơn chất</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Hợp chất</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Số nguyên tố</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">1 nguyên tố</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">≥ 2 nguyên tố</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Ví dụ</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Fe, Cu, O₂</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">H₂O, NaCl, CO₂</td>
        </tr>
      </table>
    `,
  game: [
    {
      "type": "multiple-choice",
      "question": "Đơn chất là gì?",
      "options": [
        "Chất gồm 1 nguyên tố",
        "Chất gồm 2 nguyên tố",
        "Chất gồm nhiều nguyên tố",
        "Chất gồm nhiều phân tử"
      ],
      "correctAnswer": 0,
      "explanation": "✅ Đơn chất được tạo nên từ 1 nguyên tố hóa học duy nhất.",
      "points": 10
    },
      {
            "type": "true-false",
            "question": "Nước (H₂O) là đơn chất.",
            "correctAnswer": false,
            "explanation": "❌ Sai! Nước gồm 2 nguyên tố H và O, nên là hợp chất.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Chất nào là đơn chất?",
            "options": [
                  "H₂O",
                  "NaCl",
                  "Fe",
                  "CO₂"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Fe (sắt) chỉ gồm 1 nguyên tố Fe nên là đơn chất.",
            "points": 10
      },
      {
            "type": "true-false",
            "question": "Muối ăn (NaCl) là hợp chất.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! NaCl gồm 2 nguyên tố Na và Cl nên là hợp chất.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Hợp chất được tạo nên từ bao nhiêu nguyên tố?",
            "options": [
                  "Chỉ 1",
                  "Chỉ 2",
                  "2 hoặc nhiều hơn",
                  "Không có nguyên tố nào"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Hợp chất gồm 2 nguyên tố trở lên.",
            "points": 10
      },
    {
            "type": "matching",
            "question": "🔗 Ghép chất với loại tương ứng",
            "pairs": [
                  {
                        "left": "Fe (sắt)",
                        "right": "Đơn chất kim loại"
                  },
                  {
                        "left": "O₂ (oxi)",
                        "right": "Đơn chất phi kim"
                  },
                  {
                        "left": "H₂O (nước)",
                        "right": "Hợp chất"
                  },
                  {
                        "left": "NaCl (muối)",
                        "right": "Hợp chất"
                  }
            ],
            "explanation": "✅ Tuyệt vời! Bạn phân biệt được đơn chất và hợp chất.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "CO₂ là hợp chất vì gồm ___ nguyên tố.",
            "correctAnswer": "2",
            "hint": "💡 Đếm số loại nguyên tố trong CO₂",
            "explanation": "✅ CO₂ gồm 2 nguyên tố: C (cacbon) và O (oxi).",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Chất nào KHÔNG phải là đơn chất?",
            "options": [
                  "Cu (đồng)",
                  "S (lưu huỳnh)",
                  "CO₂ (khí cacbonic)",
                  "O₂ (oxi)"
            ],
            "correctAnswer": 2,
            "explanation": "✅ CO₂ gồm 2 nguyên tố C và O, nên là hợp chất.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Sắt (Fe) là đơn chất ___ (kim loại/phi kim).",
            "correctAnswer": "kim loại",
            "hint": "💡 Fe có tính chất của kim loại",
            "explanation": "✅ Fe là đơn chất KIM LOẠI.",
            "points": 10
      },
      {
            "type": "ordering",
            "question": "📋 Sắp xếp theo số nguyên tố tăng dần",
            "options": [
                  "Fe (1 nguyên tố)",
                  "H₂O (2 nguyên tố)",
                  "H₂SO₄ (3 nguyên tố)"
            ],
            "correctOrder": [
                  "Fe (1 nguyên tố)",
                  "H₂O (2 nguyên tố)",
                  "H₂SO₄ (3 nguyên tố)"
            ],
            "explanation": "✅ Fe: 1, H₂O: 2 (H+O), H₂SO₄: 3 (H+S+O).",
            "points": 10
      },
    {
            "type": "drag-drop",
            "question": "🧩 Phân loại: Đơn chất gồm ___ nguyên tố, hợp chất gồm ___ nguyên tố trở lên.",
            "inline": true,
            "slots": [
                  {
                        "id": 1,
                        "label": "Số nguyên tố của đơn chất",
                        "correct": "1"
                  },
                  {
                        "id": 2,
                        "label": "Số nguyên tố của hợp chất",
                        "correct": "2"
                  }
            ],
            "options": [
                  "1",
                  "2",
                  "3",
                  "nhiều"
            ],
            "explanation": "✅ Hoàn hảo! Đơn chất: 1 nguyên tố, Hợp chất: ≥2 nguyên tố.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Tìm nhóm chất ĐỀU là đơn chất:",
            "options": [
                  "Fe, Cu, H₂O",
                  "O₂, S, NaCl",
                  "Fe, Cu, O₂",
                  "H₂O, NaCl, CO₂"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Fe, Cu, O₂ đều là đơn chất (mỗi chất chỉ 1 nguyên tố).",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Oxi (O₂) là đơn chất ___ (kim loại/phi kim).",
            "correctAnswer": "phi kim",
            "hint": "💡 Oxi là khí, không có tính chất kim loại",
            "explanation": "✅ Xuất sắc! O₂ là đơn chất PHI KIM.",
            "points": 10
      },
      {
            "type": "matching",
            "question": "🧠 Ghép công thức với tên",
            "pairs": [
                  {
                        "left": "H₂O",
                        "right": "Nước"
                  },
                  {
                        "left": "NaCl",
                        "right": "Muối ăn"
                  },
                  {
                        "left": "CO₂",
                        "right": "Khí cacbonic"
                  },
                  {
                        "left": "O₂",
                        "right": "Khí oxi"
                  }
            ],
            "explanation": "✅ Tuyệt vời! Bạn nhớ tên và công thức các chất.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Trong phản ứng hóa học, hợp chất có thể phân tích thành:",
            "options": [
                  "Chỉ đơn chất",
                  "Đơn chất hoặc hợp chất khác",
                  "Không thể phân tích",
                  "Chỉ nguyên tố"
            ],
            "correctAnswer": 1,
            "explanation": "✅ Hợp chất có thể phân tích thành đơn chất hoặc hợp chất đơn giản hơn.",
            "points": 10
      }
  ]
};
