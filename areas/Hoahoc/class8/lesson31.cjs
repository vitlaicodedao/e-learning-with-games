module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 31,
  title: "Bài 31: Điều chế khí hidro – Phản ứng thế",
  description: "Các phương pháp điều chế H₂ và phản ứng thế trong hóa học",
  level: "Intermediate",
  order: 31,
  theory: `
      <h2>🔬 Điều chế khí Hidro (H₂)</h2>
      
      <h3>⚗️ Trong phòng thí nghiệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>Phương pháp: Kim loại + Axit</h4>
        <p><strong>Zn + H₂SO₄ loãng → ZnSO₄ + H₂↑</strong></p>
        <p><strong>Fe + 2HCl → FeCl₂ + H₂↑</strong></p>
        <p><em>Chú ý:</em> Thu khí H₂ bằng cách đẩy nước hoặc đẩy không khí</p>
      </div>
      
      <h3>🏭 Trong công nghiệp</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Điện phân nước</h4>
        <p>2H₂O → 2H₂ + O₂ (có điện)</p>
        
        <h4>2. Từ khí thiên nhiên</h4>
        <p>CH₄ + H₂O → CO + 3H₂ (nhiệt độ cao)</p>
        
        <h4>3. Từ than cốc</h4>
        <p>C + H₂O → CO + H₂ (nhiệt độ cao)</p>
      </div>

      <h3>🔄 Phản ứng thế</h3>
      <p><strong>Định nghĩa:</strong> Là phản ứng hóa học trong đó nguyên tử của đơn chất thay thế nguyên tử của nguyên tố trong hợp chất.</p>
      
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>Dạng tổng quát:</h4>
        <p style="text-align: center; font-size: 18px;">
          <strong>A + BC → AC + B</strong>
        </p>
        <p><em>Ví dụ:</em></p>
        <p>• Zn + CuSO₄ → ZnSO₄ + Cu</p>
        <p>• Fe + CuSO₄ → FeSO₄ + Cu</p>
        <p>• Zn + 2HCl → ZnCl₂ + H₂</p>
      </div>

      <h3>⚠️ An toàn khi điều chế H₂</h3>
      <ul>
        <li>🔥 Không để lửa gần khí H₂</li>
        <li>✋ Không hít khí H₂ trực tiếp</li>
        <li>🧪 Dùng axit loãng, không dùng axit đặc</li>
        <li>🔬 Kiểm tra độ tinh khiết trước khi đốt</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Trong phòng thí nghiệm, H₂ được điều chế bằng cách nào?",
    options: [
      "Đun nóng nước",
      "Kim loại tác dụng với axit",
      "Nung đá vôi",
      "Hòa tan muối vào nước"
    ],
    correctAnswer: 1,
    explanation: "✅ Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng Zn + H₂SO₄ → ZnSO₄ + H₂ là phản ứng thế.",
    correctAnswer: true,
    explanation: "✅ Đúng! Zn thay thế H trong H₂SO₄.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng thế có dạng tổng quát là:",
    options: [
      "A + B → AB",
      "AB → A + B",
      "A + BC → AC + B",
      "AB + CD → AD + BC"
    ],
    correctAnswer: 2,
    explanation: "✅ Phản ứng thế: A + BC → AC + B",
    points: 10
  },
  {
    type: "true-false",
    question: "Có thể thu khí H₂ bằng cách đẩy nước.",
    correctAnswer: true,
    explanation: "✅ Đúng! H₂ tan rất ít trong nước nên thu được bằng đẩy nước.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao không để lửa gần khí H₂?",
    options: [
      "Vì H₂ không cháy",
      "Vì H₂ dễ cháy nổ",
      "Vì H₂ ẩm",
      "Vì H₂ nặng"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ rất dễ cháy và gây nổ mạnh.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép phương pháp với quy mô sản xuất",
    pairs: [
      {
        left: "Zn + H₂SO₄",
        right: "Phòng thí nghiệm"
      },
      {
        left: "Điện phân nước",
        right: "Công nghiệp"
      },
      {
        left: "CH₄ + H₂O",
        right: "Công nghiệp"
      },
      {
        left: "Fe + HCl",
        right: "Phòng thí nghiệm"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân biệt được quy mô sản xuất.",
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
    question: "Phản ứng nào KHÔNG phải là phản ứng thế?",
    options: [
      "Zn + CuSO₄ → ZnSO₄ + Cu",
      "2H₂ + O₂ → 2H₂O",
      "Fe + H₂SO₄ → FeSO₄ + H₂",
      "Mg + 2HCl → MgCl₂ + H₂"
    ],
    correctAnswer: 1,
    explanation: "✅ 2H₂ + O₂ → 2H₂O là phản ứng hóa hợp, không phải phản ứng thế.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước điều chế H₂ trong PTN",
    options: [
      "Cho Zn vào bình phản ứng",
      "Thêm H₂SO₄ loãng",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết"
    ],
    correctOrder: [
      "Cho Zn vào bình phản ứng",
      "Thêm H₂SO₄ loãng",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết"
    ],
    explanation: "✅ Đúng trình tự thí nghiệm.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong phản ứng Zn + CuSO₄ → ZnSO₄ + Cu, Zn thay thế ___.",
    correctAnswer: "Cu",
    hint: "💡 Kim loại nào bị thay thế?",
    explanation: "✅ Zn thay thế Cu trong hợp chất CuSO₄.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Trong phản ứng thế, nguyên tử của ___ thay thế nguyên tử của ___ trong ___.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Chất 1",
        correct: "đơn chất"
      },
      {
        id: 2,
        label: "Chất 2",
        correct: "nguyên tố"
      },
      {
        id: 3,
        label: "Chất 3",
        correct: "hợp chất"
      }
    ],
    options: [
      "đơn chất",
      "nguyên tố",
      "hợp chất",
      "muối"
    ],
    explanation: "✅ ĐƠN CHẤT thay thế NGUYÊN TỐ trong HỢP CHẤT.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao phải kiểm tra độ tinh khiết của H₂ trước khi đốt?",
    options: [
      "Để biết H₂ có màu gì",
      "Để tránh nổ khi H₂ lẫn không khí",
      "Để đếm số mol H₂",
      "Để H₂ cháy đẹp hơn"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ lẫn O₂ hoặc không khí sẽ nổ mạnh khi đốt!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong công nghiệp, H₂ được sản xuất từ khí thiên nhiên: CH₄ + H₂O → ___ + ___",
    correctAnswer: "CO, 3H₂",
    hint: "💡 Một khí chứa C và O, một khí là H₂",
    explanation: "✅ CH₄ + H₂O → CO + 3H₂ (nhiệt độ cao)",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân loại phản ứng",
    pairs: [
      {
        left: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        right: "Phản ứng thế"
      },
      {
        left: "2H₂ + O₂ → 2H₂O",
        right: "Phản ứng hóa hợp"
      },
      {
        left: "CuO + H₂ → Cu + H₂O",
        right: "Phản ứng oxi hóa - khử"
      },
      {
        left: "Fe + CuSO₄ → FeSO₄ + Cu",
        right: "Phản ứng thế"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn phân loại đúng các phản ứng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phương pháp nào tiết kiệm nhất để sản xuất H₂ quy mô lớn?",
    options: [
      "Dùng Zn + H₂SO₄",
      "Điện phân nước bằng năng lượng mặt trời",
      "Từ khí thiên nhiên CH₄",
      "Dùng Fe + HCl"
    ],
    correctAnswer: 2,
    explanation: "✅ Từ CH₄ (khí thiên nhiên) là phương pháp phổ biến và kinh tế nhất hiện nay.",
    points: 10
  }
]
};
