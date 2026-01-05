module.exports = {
  classId: 8,
  chapterId: 1, // Phải là chương 1
  lessonId: 11,
  title: "Bài 11: Bài luyện tập 2 - Tổng hợp Chương 1",
  description: "Chuyển đổi giữa các đại lượng",
  level: "Advanced",
  order: 11,
  theory: `
      <h2>🔄 Chuyển đổi giữa các đại lượng</h2>
      <p>Trong hóa học, chúng ta thường phải chuyển đổi giữa khối lượng, thể tích và số mol.</p>
      
      <h3>📐 Các công thức cơ bản</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Đối với chất rắn, lỏng:</h4>
        <p style="text-align: center; font-size: 18px;">n = m/M</p>
        <p>• n: số mol (mol)</p>
        <p>• m: khối lượng (g)</p>
        <p>• M: khối lượng mol (g/mol)</p>
      </div>

      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Đối với chất khí (ở đktc):</h4>
        <p style="text-align: center; font-size: 18px;">n = V/22,4</p>
        <p>• V: thể tích khí (lít)</p>
        <p>• 22,4: thể tích mol khí ở đktc (lít/mol)</p>
      </div>

      <h3>⚖️ Tỉ khối khí</h3>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>Tỉ khối</strong> là tỉ số khối lượng mol của hai chất khí.</p>
        <p style="text-align: center; font-size: 18px;">
          d<sub>A/B</sub> = M<sub>A</sub>/M<sub>B</sub>
        </p>
        <p>• d<sub>A/không khí</sub> = M<sub>A</sub>/29</p>
        <p>• d<sub>A/H₂</sub> = M<sub>A</sub>/2</p>
      </div>

      <h3>💡 Ví dụ minh họa</h3>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4>Tính thể tích của 8g O₂ ở đktc</h4>
        <p>• M<sub>O₂</sub> = 32 g/mol</p>
        <p>• n = m/M = 8/32 = 0,25 mol</p>
        <p>• V = n × 22,4 = 0,25 × 22,4 = 5,6 lít</p>
      </div>
    `,
  game: [
    {
      "type": "multiple-choice",
      "question": "Ở đktc, 1 mol khí bất kỳ chiếm thể tích bao nhiêu?",
      "options": [
        "11,2 lít",
        "22,4 lít",
        "33,6 lít",
        "44,8 lít"
      ],
      "correctAnswer": 1,
      "explanation": "✅ Ở đktc, 1 mol khí chiếm thể tích 22,4 lít.",
      "points": 10
    },
    {
      "type": "true-false",
      "question": "Công thức tính số mol từ thể tích khí là n = V/22,4 (ở đktc).",
      "correctAnswer": true,
      "explanation": "✅ Đúng! n = V/22,4 với V tính bằng lít.",
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Tỉ khối của khí A so với không khí là d = M_A/x. Giá trị x là?",
      "options": [
        "2",
        "29",
        "32",
        "28"
      ],
      "correctAnswer": 1,
      "explanation": "✅ Khối lượng mol trung bình của không khí là 29 g/mol.",
      "points": 10
    },
    {
      "type": "true-false",
      "question": "Khối lượng mol của CO₂ là 44 g/mol.",
      "correctAnswer": true,
      "explanation": "✅ Đúng! M_CO₂ = 12 + 2×16 = 44 g/mol",
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Tính số mol của 44,8 lít CO₂ ở đktc?",
      "options": [
        "1 mol",
        "2 mol",
        "3 mol",
        "4 mol"
      ],
      "correctAnswer": 1,
      "explanation": "✅ n = V/22,4 = 44,8/22,4 = 2 mol",
      "points": 10
    },
    {
      "type": "matching",
      "question": "🔗 Ghép công thức với đại lượng",
      "pairs": [
        {
          "left": "n = m/M",
          "right": "Tính mol từ khối lượng"
        },
        {
          "left": "n = V/22,4",
          "right": "Tính mol từ thể tích khí"
        },
        {
          "left": "d = M₁/M₂",
          "right": "Tỉ khối giữa 2 khí"
        },
        {
          "left": "V = n × 22,4",
          "right": "Tính thể tích từ mol"
        }
      ],
      "explanation": "✅ Tuyệt vời! Bạn nắm vững các công thức chuyển đổi.",
      "points": 10
    },
    {
      "type": "fill-in-blank",
      "question": "Ở đktc, 0,5 mol H₂ chiếm thể tích ___ lít",
      "correctAnswer": "11.2",
      "hint": "💡 V = n × 22,4",
      "explanation": "✅ V = 0,5 × 22,4 = 11,2 lít",
      "points": 10
    },
    {
      "type": "ordering",
      "question": "📋 Sắp xếp bước tính thể tích từ khối lượng",
      "options": [
        "Xác định khối lượng m",
        "Tính khối lượng mol M",
        "Tính số mol n = m/M",
        "Tính thể tích V = n × 22,4"
      ],
      "correctOrder": [
        "Xác định khối lượng m",
        "Tính khối lượng mol M",
        "Tính số mol n = m/M",
        "Tính thể tích V = n × 22,4"
      ],
      "explanation": "✅ Đúng! Đây là trình tự tính toán chuẩn.",
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Tính tỉ khối của CO₂ (M=44) so với không khí?",
      "options": [
        "1,38",
        "1,52",
        "1,66",
        "1,72"
      ],
      "correctAnswer": 1,
      "explanation": "✅ d = 44/29 ≈ 1,52",
      "points": 10
    },
    {
      "type": "fill-in-blank",
      "question": "16g O₂ ở đktc có thể tích là ___ lít",
      "correctAnswer": "11.2",
      "hint": "💡 n = 16/32 = 0,5 mol → V = ?",
      "explanation": "✅ n = 0,5 mol → V = 0,5 × 22,4 = 11,2 lít",
      "points": 10
    },
    {
      "type": "drag-drop",
      "question": "🧩 Hoàn thành công thức: V = n × ___",
      "inline": true,
      "slots": [
        {
          "id": 1,
          "label": "Hệ số",
          "correct": "22.4"
        }
      ],
      "options": [
        "11.2",
        "22.4",
        "33.6",
        "44.8"
      ],
      "explanation": "✅ V = n × 22,4 (ở đktc)",
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Tìm phát biểu SAI:",
      "options": [
        "Ở đktc, 1 mol khí chiếm 22,4 lít",
        "Tỉ khối không phụ thuộc vào nhiệt độ, áp suất",
        "V = n × 22,4 chỉ đúng ở đktc",
        "Mọi khí đều có M = 22,4 g/mol"
      ],
      "correctAnswer": 3,
      "explanation": "❌ SAI! Mỗi khí có khối lượng mol M khác nhau!",
      "points": 10
    },
    {
      "type": "fill-in-blank",
      "question": "Khí X có d_X/H₂ = 16. Khối lượng mol của X là ___ g/mol",
      "correctAnswer": "32",
      "hint": "💡 M_X = d × M_H₂ = 16 × 2",
      "explanation": "✅ M_X = 16 × 2 = 32 g/mol",
      "points": 10
    },
    {
      "type": "matching",
      "question": "🧠 Ghép khí với tỉ khối so với không khí",
      "pairs": [
        {
          "left": "H₂ (M=2)",
          "right": "d < 1 (nhẹ hơn)"
        },
        {
          "left": "N₂ (M=28)",
          "right": "d ≈ 1 (gần bằng)"
        },
        {
          "left": "CO₂ (M=44)",
          "right": "d > 1 (nặng hơn)"
        },
        {
          "left": "O₂ (M=32)",
          "right": "d > 1 (nặng hơn)"
        }
      ],
      "explanation": "✅ So với không khí (M=29), khí nhẹ có d<1, khí nặng có d>1",
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Hỗn hợp 1 mol O₂ và 1 mol N₂ ở đktc có thể tích?",
      "options": [
        "22,4 lít",
        "33,6 lít",
        "44,8 lít",
        "56,0 lít"
      ],
      "correctAnswer": 2,
      "explanation": "✅ Tổng số mol = 2 mol → V = 2 × 22,4 = 44,8 lít",
      "points": 10
    }
  ]
};
