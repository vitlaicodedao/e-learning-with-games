module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 34,
  title: "Bài 34: Nước",
  description: "Tính chất, vai trò và ứng dụng của nước trong đời sống",
  level: "Beginner",
  order: 34,
  theory: `
      <h2>💧 Nước - Nguồn sống</h2>
      
      <h3>🔬 Thành phần và cấu tạo</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Công thức:</strong> H₂O</p>
        <p><strong>Thành phần:</strong></p>
        <p>• 2 nguyên tử hidro (H)</p>
        <p>• 1 nguyên tử oxi (O)</p>
        <p><strong>Khối lượng phân tử:</strong> 18 (H=1, O=16)</p>
      </div>

      <h3>🌡️ Tính chất vật lý</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p>• Chất lỏng không màu, không mùi, không vị</p>
        <p>• Nhiệt độ nóng chảy: 0°C</p>
        <p>• Nhiệt độ sôi: 100°C (ở áp suất thường)</p>
        <p>• Khối lượng riêng: 1g/cm³</p>
        <p>• Hòa tan được nhiều chất</p>
      </div>

      <h3>⚗️ Tính chất hóa học</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>1. Tác dụng với kim loại</h4>
        <p>2Na + 2H₂O → 2NaOH + H₂↑</p>
        <p><em>Lưu ý:</em> Chỉ kim loại hoạt động mạnh mới phản ứng</p>
        
        <h4>2. Tác dụng với oxit</h4>
        <p><strong>Oxit axit:</strong> SO₃ + H₂O → H₂SO₄</p>
        <p><strong>Oxit bazơ:</strong> CaO + H₂O → Ca(OH)₂</p>
        
        <h4>3. Phân hủy (điện phân)</h4>
        <p>2H₂O → 2H₂ + O₂ (có điện)</p>
      </div>

      <h3>🌍 Vai trò của nước</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Lĩnh vực</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Vai trò</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Sinh học</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Cấu thành cơ thể (60-70%)</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Nông nghiệp</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Tưới tiêu, nuôi trồng</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Công nghiệp</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Làm mát, nguyên liệu</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Sinh hoạt</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Uống, nấu ăn, vệ sinh</td>
        </tr>
      </table>

      <h3>♻️ Bảo vệ nguồn nước</h3>
      <ul>
        <li>🚫 Không xả rác xuống nguồn nước</li>
        <li>💧 Tiết kiệm nước sinh hoạt</li>
        <li>🏭 Xử lý nước thải trước khi xả</li>
        <li>🌳 Trồng cây bảo vệ nguồn nước</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Công thức hóa học của nước là gì?",
    options: [
      "H₂",
      "O₂",
      "H₂O",
      "HO₂"
    ],
    correctAnswer: 2,
    explanation: "✅ Nước có công thức H₂O (2 nguyên tử H, 1 nguyên tử O).",
    points: 10
  },
  {
    type: "true-false",
    question: "Nước sôi ở nhiệt độ 100°C ở áp suất thường.",
    correctAnswer: true,
    explanation: "✅ Đúng! Nước sôi ở 100°C, đóng băng ở 0°C.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Khối lượng phân tử của nước là bao nhiêu? (H=1, O=16)",
    options: [
      "16",
      "17",
      "18",
      "19"
    ],
    correctAnswer: 2,
    explanation: "✅ M(H₂O) = 2×1 + 16 = 18",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nước chiếm khoảng ___% khối lượng cơ thể người.",
    correctAnswer: "60-70",
    hint: "💡 Một con số phần trăm khá lớn",
    explanation: "✅ Nước chiếm 60-70% khối lượng cơ thể.",
    points: 10
  },
  {
    type: "true-false",
    question: "Nước có thể hòa tan được nhiều chất.",
    correctAnswer: true,
    explanation: "✅ Đúng! Nước là dung môi phổ biến nhất.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép tính chất với loại",
    pairs: [
      {
        left: "Không màu, không mùi",
        right: "Tính chất vật lý"
      },
      {
        left: "Tác dụng với Na",
        right: "Tính chất hóa học"
      },
      {
        left: "Sôi ở 100°C",
        right: "Tính chất vật lý"
      },
      {
        left: "Bị điện phân",
        right: "Tính chất hóa học"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân biệt được hai loại tính chất.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phương trình điện phân nước: 2H₂O → ___ + ___",
    correctAnswer: "2H₂, O₂",
    hint: "💡 Hai khí được tạo ra",
    explanation: "✅ 2H₂O → 2H₂ + O₂",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào đúng với nước?",
    options: [
      "H₂O + Na → NaOH + H₂",
      "2H₂O + 2Na → 2NaOH + H₂",
      "H₂O + 2Na → NaOH + H₂",
      "H₂O + Na → Na₂O + H₂"
    ],
    correctAnswer: 1,
    explanation: "✅ 2Na + 2H₂O → 2NaOH + H₂↑",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp theo nhiệt độ tăng dần",
    options: [
      "Nước đóng băng",
      "Nước ở nhiệt độ phòng",
      "Nước sôi"
    ],
    correctOrder: [
      "Nước đóng băng",
      "Nước ở nhiệt độ phòng",
      "Nước sôi"
    ],
    explanation: "✅ 0°C < 25°C < 100°C",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Khi CaO tác dụng với nước: CaO + H₂O → ___",
    correctAnswer: "Ca(OH)₂",
    hint: "💡 Bazơ canxi",
    explanation: "✅ CaO + H₂O → Ca(OH)₂ (vôi tôi)",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Nước có công thức ___, gồm ___ nguyên tử H và ___ nguyên tử O.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Công thức",
        correct: "H₂O"
      },
      {
        id: 2,
        label: "Số H",
        correct: "2"
      },
      {
        id: 3,
        label: "Số O",
        correct: "1"
      }
    ],
    options: [
      "H₂O",
      "2",
      "1",
      "3"
    ],
    explanation: "✅ H₂O có 2 nguyên tử H và 1 nguyên tử O.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tính khối lượng nước cần điện phân để thu được 2,24 lít O₂ (đktc)? (H=1, O=16)",
    options: [
      "1,8g",
      "3,6g",
      "7,2g",
      "18g"
    ],
    correctAnswer: 1,
    explanation: "✅ n(O₂)=2,24/22,4=0,1 mol → n(H₂O)=0,2 mol → m=0,2×18=3,6g",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Oxit axit tác dụng với nước tạo ___.",
    correctAnswer: "axit",
    hint: "💡 Sản phẩm của oxit axit + nước",
    explanation: "✅ Oxit axit + H₂O → Axit. VD: SO₃ + H₂O → H₂SO₄",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Ghép phản ứng với loại oxit",
    pairs: [
      {
        left: "CaO + H₂O → Ca(OH)₂",
        right: "Oxit bazơ"
      },
      {
        left: "SO₃ + H₂O → H₂SO₄",
        right: "Oxit axit"
      },
      {
        left: "Na₂O + H₂O → 2NaOH",
        right: "Oxit bazơ"
      },
      {
        left: "P₂O₅ + 3H₂O → 2H₃PO₄",
        right: "Oxit axit"
      }
    ],
    explanation: "✅ Hoàn hảo! Oxit bazơ tạo bazơ, oxit axit tạo axit.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao nước rất quan trọng đối với sự sống?",
    options: [
      "Vì nước có nhiều ở Trái Đất",
      "Vì nước tham gia mọi quá trình sinh học",
      "Vì nước rẻ tiền",
      "Vì nước trong suốt"
    ],
    correctAnswer: 1,
    explanation: "✅ Nước tham gia tất cả quá trình sinh học, không thể thiếu được.",
    points: 10
  }
]
};
