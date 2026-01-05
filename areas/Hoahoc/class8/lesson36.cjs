module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 36,
  title: "Bài 36: Bài luyện tập 7 - Nước và các chất",
  description: "Ôn tập về nước, axit, bazơ, muối và các phản ứng liên quan",
  level: "Intermediate",
  order: 36,
  theory: `
      <h2>📝 Ôn tập Chương 5: Hidro - Nước</h2>
      
      <h3>🔍 Tóm tắt kiến thức</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Hidro (H₂)</h4>
        <p><strong>Tính chất:</strong></p>
        <p>• Khí nhẹ nhất, không màu, không mùi</p>
        <p>• Cháy trong oxi: 2H₂ + O₂ → 2H₂O</p>
        <p>• Khử oxit kim loại: CuO + H₂ → Cu + H₂O</p>
        <p><strong>Điều chế:</strong> Zn + H₂SO₄ → ZnSO₄ + H₂</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Nước (H₂O)</h4>
        <p><strong>Tính chất vật lý:</strong> Lỏng, không màu, sôi 100°C, đóng băng 0°C</p>
        <p><strong>Tính chất hóa học:</strong></p>
        <p>• Tác dụng với kim loại: 2Na + 2H₂O → 2NaOH + H₂</p>
        <p>• Tác dụng với oxit: CaO + H₂O → Ca(OH)₂</p>
        <p>• Điện phân: 2H₂O → 2H₂ + O₂</p>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>3. Axit - Bazơ - Muối</h4>
        <p><strong>Axit:</strong> Có H⁺, làm quỳ tím hóa đỏ (HCl, H₂SO₄)</p>
        <p><strong>Bazơ:</strong> Có OH⁻, làm quỳ tím hóa xanh (NaOH, Ca(OH)₂)</p>
        <p><strong>Muối:</strong> Kim loại + Gốc axit (NaCl, CaCO₃)</p>
        <p><strong>Phản ứng trung hòa:</strong> Axit + Bazơ → Muối + Nước</p>
      </div>

      <h3>📊 Các loại phản ứng quan trọng</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Loại phản ứng</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ví dụ</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Hóa hợp</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">2H₂ + O₂ → 2H₂O</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Phân hủy</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">2H₂O → 2H₂ + O₂</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Thế</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Zn + H₂SO₄ → ZnSO₄ + H₂</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Oxi hóa - khử</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">CuO + H₂ → Cu + H₂O</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Trung hòa</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">HCl + NaOH → NaCl + H₂O</td>
        </tr>
      </table>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Công thức hóa học của nước là gì?",
    options: [
      "H₂",
      "O₂",
      "H₂O",
      "HO"
    ],
    correctAnswer: 2,
    explanation: "✅ Nước có công thức H₂O.",
    points: 10
  },
  {
    type: "true-false",
    question: "Hidro cháy trong oxi tạo ra nước.",
    correctAnswer: true,
    explanation: "✅ Đúng! 2H₂ + O₂ → 2H₂O",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Axit làm quỳ tím chuyển sang màu gì?",
    options: [
      "Xanh",
      "Đỏ",
      "Vàng",
      "Không đổi"
    ],
    correctAnswer: 1,
    explanation: "✅ Axit làm quỳ tím hóa ĐỎ.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phản ứng: HCl + NaOH → NaCl + ___",
    correctAnswer: "H₂O",
    hint: "💡 Chất lỏng được tạo ra",
    explanation: "✅ HCl + NaOH → NaCl + H₂O",
    points: 10
  },
  {
    type: "true-false",
    question: "Nước sôi ở 100°C và đóng băng ở 0°C.",
    correctAnswer: true,
    explanation: "✅ Đúng! Ở áp suất thường.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép phản ứng với loại",
    pairs: [
      {
        left: "2H₂ + O₂ → 2H₂O",
        right: "Hóa hợp"
      },
      {
        left: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        right: "Thế"
      },
      {
        left: "CuO + H₂ → Cu + H₂O",
        right: "Oxi hóa - khử"
      },
      {
        left: "HCl + NaOH → NaCl + H₂O",
        right: "Trung hòa"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân loại đúng các phản ứng.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để điều chế H₂ trong PTN: Zn + H₂SO₄ → ___ + H₂",
    correctAnswer: "ZnSO₄",
    hint: "💡 Muối kẽm",
    explanation: "✅ Zn + H₂SO₄ → ZnSO₄ + H₂",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào tạo ra bazơ?",
    options: [
      "HCl + Zn → ZnCl₂ + H₂",
      "CaO + H₂O → Ca(OH)₂",
      "H₂ + O₂ → H₂O",
      "NaCl → Na + Cl₂"
    ],
    correctAnswer: 1,
    explanation: "✅ Oxit bazơ + Nước → Bazơ: CaO + H₂O → Ca(OH)₂",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước điều chế H₂",
    options: [
      "Cho Zn vào bình",
      "Thêm H₂SO₄ loãng",
      "Thu khí H₂",
      "Kiểm tra độ tinh khiết"
    ],
    correctOrder: [
      "Cho Zn vào bình",
      "Thêm H₂SO₄ loãng",
      "Thu khí H₂",
      "Kiểm tra độ tinh khiết"
    ],
    explanation: "✅ Đúng trình tự thí nghiệm!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Bazơ làm quỳ tím chuyển sang màu ___.",
    correctAnswer: "xanh",
    hint: "💡 Màu của bazơ",
    explanation: "✅ Bazơ làm quỳ tím hóa XANH.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Cân bằng: ___ H₂ + O₂ → ___ H₂O",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Hệ số H₂",
        correct: "2"
      },
      {
        id: 2,
        label: "Hệ số H₂O",
        correct: "2"
      }
    ],
    options: [
      "2",
      "1",
      "3",
      "2"
    ],
    explanation: "✅ 2H₂ + O₂ → 2H₂O",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tính khối lượng H₂O tạo thành khi đốt cháy 4g H₂? (H=1, O=16)",
    options: [
      "18g",
      "36g",
      "9g",
      "72g"
    ],
    correctAnswer: 1,
    explanation: "✅ n(H₂)=4/2=2 mol → n(H₂O)=2 mol → m=2×18=36g",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong phản ứng: 3H₂ + Fe₂O₃ → 2Fe + 3H₂O, H₂ đóng vai trò là chất ___.",
    correctAnswer: "khử",
    hint: "💡 H₂ bị oxi hóa hay khử?",
    explanation: "✅ H₂ là CHẤT KHỬ (bị oxi hóa).",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Ghép chất với công dụng",
    pairs: [
      {
        left: "H₂",
        right: "Nhiên liệu sạch"
      },
      {
        left: "H₂O",
        right: "Dung môi phổ biến"
      },
      {
        left: "HCl",
        right: "Sản xuất hóa chất"
      },
      {
        left: "NaOH",
        right: "Sản xuất xà phòng"
      }
    ],
    explanation: "✅ Hoàn hảo! Bạn hiểu ứng dụng của các chất.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Cho 13g Zn tác dụng với HCl dư, thể tích H₂ (đktc) thu được là? (Zn=65)",
    options: [
      "2,24 lít",
      "4,48 lít",
      "6,72 lít",
      "11,2 lít"
    ],
    correctAnswer: 1,
    explanation: "✅ n(Zn)=13/65=0,2 mol → n(H₂)=0,2 mol → V=0,2×22,4=4,48 lít",
    points: 10
  }
]
};
