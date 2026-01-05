module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 35,
  title: "Bài 35: Axit – Bazơ – Muối",
  description: "Tìm hiểu về axit, bazơ, muối và vai trò trong đời sống",
  level: "Intermediate",
  order: 35,
  theory: `
      <h2>🧪 Axit - Bazơ - Muối</h2>
      
      <h3>🔴 Axit</h3>
      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <p><strong>Định nghĩa:</strong> Là hợp chất có chứa hydro, có khả năng phân ly ra ion H⁺ trong dung dịch nước.</p>
        <p><strong>Ví dụ:</strong></p>
        <p>• HCl (axit clohidric)</p>
        <p>• H₂SO₄ (axit sunfuric)</p>
        <p>• HNO₃ (axit nitric)</p>
        <p>• CH₃COOH (axit axetic - giấm ăn)</p>
        
        <h4>Tính chất:</h4>
        <p>• Vị chua</p>
        <p>• Làm quỳ tím hóa đỏ</p>
        <p>• Tác dụng với kim loại: Zn + 2HCl → ZnCl₂ + H₂</p>
        <p>• Tác dụng với bazơ: HCl + NaOH → NaCl + H₂O</p>
      </div>

      <h3>🔵 Bazơ</h3>
      <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0;">
        <p><strong>Định nghĩa:</strong> Là hợp chất có chứa nhóm OH, có khả năng phân ly ra ion OH⁻ trong dung dịch nước.</p>
        <p><strong>Ví dụ:</strong></p>
        <p>• NaOH (natri hidroxit - xút ăn da)</p>
        <p>• Ca(OH)₂ (canxi hidroxit - nước vôi trong)</p>
        <p>• KOH (kali hidroxit)</p>
        
        <h4>Tính chất:</h4>
        <p>• Vị chát, trơn (không nếm!)</p>
        <p>• Làm quỳ tím hóa xanh</p>
        <p>• Tác dụng với axit: NaOH + HCl → NaCl + H₂O</p>
        <p>• Tác dụng với muối: 2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄</p>
      </div>

      <h3>🟡 Muối</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <p><strong>Định nghĩa:</strong> Là hợp chất tạo bởi một gốc axit và một kim loại (hoặc nhóm NH₄⁺).</p>
        <p><strong>Ví dụ:</strong></p>
        <p>• NaCl (natri clorua - muối ăn)</p>
        <p>• CaCO₃ (canxi cacbonat - đá vôi)</p>
        <p>• CuSO₄ (đồng(II) sunfat)</p>
        <p>• AgNO₃ (bạc nitrat)</p>
        
        <h4>Cách tạo thành muối:</h4>
        <p>• Axit + Bazơ → Muối + Nước</p>
        <p>• Kim loại + Axit → Muối + H₂</p>
        <p>• Oxit kim loại + Axit → Muối + Nước</p>
      </div>

      <h3>📊 Bảng so sánh</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Loại</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Thành phần</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Quỳ tím</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ví dụ</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Axit</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Có H⁺</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Hóa đỏ</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">HCl, H₂SO₄</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Bazơ</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Có OH⁻</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Hóa xanh</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">NaOH, Ca(OH)₂</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Muối</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Kim loại + Gốc axit</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Không đổi màu</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">NaCl, CaCO₃</td>
        </tr>
      </table>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Axit có khả năng làm quỳ tím chuyển sang màu gì?",
    options: [
      "Xanh",
      "Đỏ",
      "Vàng",
      "Không đổi màu"
    ],
    correctAnswer: 1,
    explanation: "✅ Axit làm quỳ tím hóa ĐỎ.",
    points: 10
  },
  {
    type: "true-false",
    question: "Bazơ làm quỳ tím chuyển sang màu xanh.",
    correctAnswer: true,
    explanation: "✅ Đúng! Bazơ làm quỳ tím hóa XANH.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Muối ăn có công thức hóa học là gì?",
    options: [
      "NaOH",
      "HCl",
      "NaCl",
      "CaCO₃"
    ],
    correctAnswer: 2,
    explanation: "✅ Muối ăn là NaCl (natri clorua).",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Axit có chứa ion ___ trong dung dịch.",
    correctAnswer: "H⁺",
    hint: "💡 Ion mang điện tích dương của hydro",
    explanation: "✅ Axit phân ly ra ion H⁺.",
    points: 10
  },
  {
    type: "true-false",
    question: "NaOH được gọi là xút ăn da.",
    correctAnswer: true,
    explanation: "✅ Đúng! NaOH (natri hidroxit) là xút, ăn da nên rất nguy hiểm.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép chất với loại tương ứng",
    pairs: [
      {
        left: "HCl",
        right: "Axit"
      },
      {
        left: "NaOH",
        right: "Bazơ"
      },
      {
        left: "NaCl",
        right: "Muối"
      },
      {
        left: "Ca(OH)₂",
        right: "Bazơ"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân biệt được axit, bazơ, muối.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phản ứng: HCl + NaOH → ___ + H₂O",
    correctAnswer: "NaCl",
    hint: "💡 Muối được tạo thành",
    explanation: "✅ HCl + NaOH → NaCl + H₂O (phản ứng trung hòa)",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào tạo ra muối?",
    options: [
      "H₂ + O₂ → H₂O",
      "HCl + NaOH → NaCl + H₂O",
      "2H₂O → 2H₂ + O₂",
      "C + O₂ → CO₂"
    ],
    correctAnswer: 1,
    explanation: "✅ Axit + Bazơ → Muối + Nước",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các chất theo độ pH tăng dần (axit → trung tính → bazơ)",
    options: [
      "HCl (axit mạnh)",
      "Nước tinh khiết",
      "NaOH (bazơ mạnh)"
    ],
    correctOrder: [
      "HCl (axit mạnh)",
      "Nước tinh khiết",
      "NaOH (bazơ mạnh)"
    ],
    explanation: "✅ Axit có pH < 7, trung tính pH = 7, bazơ pH > 7",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Bazơ có chứa nhóm ___ trong phân tử.",
    correctAnswer: "OH",
    hint: "💡 Nhóm hidroxit",
    explanation: "✅ Bazơ chứa nhóm OH (hidroxit).",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Axit + Bazơ → ___ + ___",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Sản phẩm 1",
        correct: "Muối"
      },
      {
        id: 2,
        label: "Sản phẩm 2",
        correct: "Nước"
      }
    ],
    options: [
      "Muối",
      "Nước",
      "Khí",
      "Kim loại"
    ],
    explanation: "✅ Axit + Bazơ → MUỐI + NƯỚC (phản ứng trung hòa)",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào SAI?",
    options: [
      "Zn + 2HCl → ZnCl₂ + H₂",
      "HCl + NaOH → NaCl + H₂O",
      "NaOH + HCl → Na + H₂O + Cl₂",
      "CuO + H₂SO₄ → CuSO₄ + H₂O"
    ],
    correctAnswer: 2,
    explanation: "❌ Sai! NaOH + HCl → NaCl + H₂O (không tạo Na và Cl₂ riêng biệt)",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để nhận biết axit và bazơ, ta dùng chất chỉ thị ___ tím.",
    correctAnswer: "quỳ",
    hint: "💡 Chất chỉ thị màu",
    explanation: "✅ Dùng giấy QUỲ TÍM: axit hóa đỏ, bazơ hóa xanh.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Ghép phản ứng với tên loại phản ứng",
    pairs: [
      {
        left: "HCl + NaOH → NaCl + H₂O",
        right: "Phản ứng trung hòa"
      },
      {
        left: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        right: "Phản ứng thế"
      },
      {
        left: "CuO + 2HCl → CuCl₂ + H₂O",
        right: "Oxit + Axit"
      },
      {
        left: "2NaOH + CuSO₄ → Cu(OH)₂ + Na₂SO₄",
        right: "Bazơ + Muối"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu rõ các loại phản ứng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao không được nếm thử dung dịch NaOH?",
    options: [
      "Vì không có vị gì",
      "Vì rất độc, ăn mòn da và niêm mạc",
      "Vì quá đắt",
      "Vì có mùi khó chịu"
    ],
    correctAnswer: 1,
    explanation: "✅ NaOH rất nguy hiểm, ăn mòn da, niêm mạc, gây bỏng nghiêm trọng!",
    points: 10
  }
]
};
