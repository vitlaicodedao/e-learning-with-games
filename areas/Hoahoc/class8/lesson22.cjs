module.exports = {
  classId: 8,
  chapterId: 3, // Phải là chương 3
  lessonId: 22,
  title: "Bài 22: Bài luyện tập 4 - Tổng hợp Chương 3",
  description: "Làm quen với ba loại hợp chất vô cơ quan trọng: Axit, Bazơ và Muối. Học cách định nghĩa, phân loại và gọi tên chúng.",
  level: "Beginner",
  order: 22,
  theory: `
    <h2>🧪 Axit - Bazơ - Muối</h2>
    <p>Đây là ba loại hợp chất vô cơ cơ bản và cực kỳ quan trọng trong hóa học. Hãy cùng tìm hiểu về chúng!</p>
    
    <h3>I. Axit</h3>
    
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p><strong>1. Định nghĩa:</strong> Phân tử axit gồm có một hay nhiều nguyên tử hiđro liên kết với gốc axit. Các nguyên tử hiđro này có thể thay thế bằng nguyên tử kim loại.</p>
      <p><strong>Ví dụ:</strong> HCl, H₂SO₄, HNO₃, H₃PO₄.</p>
      <p><strong>2. Công thức hóa học:</strong> HₙA, trong đó H là hiđro, A là gốc axit, n là hóa trị của gốc axit.</p>
      <p><strong>3. Phân loại và Tên gọi:</strong></p>
      <ul>
        <li>
          <strong>Axit không có oxi:</strong>
          <p>Tên axit = "axit" + tên phi kim + "hiđric"</p>
          <p>Ví dụ: HCl (axit clohiđric), H₂S (axit sunfuhiđric).</p>
        </li>
        <li>
          <strong>Axit có oxi:</strong>
          <ul>
            <li>Axit có nhiều oxi: Tên axit = "axit" + tên phi kim + "ic" (ví dụ: H₂SO₄ - axit sunfuric, HNO₃ - axit nitric).</li>
            <li>Axit có ít oxi: Tên axit = "axit" + tên phi kim + "ơ" (ví dụ: H₂SO₃ - axit sunfurơ).</li>
          </ul>
        </li>
      </ul>
      <p><strong>4. Tính chất:</strong> Dung dịch axit làm quỳ tím chuyển sang màu <strong>đỏ</strong>.</p>
    </div>

    <h3>II. Bazơ</h3>
    
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p><strong>1. Định nghĩa:</strong> Phân tử bazơ gồm có một nguyên tử kim loại liên kết với một hay nhiều nhóm hiđroxit (-OH).</p>
      <p><strong>Ví dụ:</strong> NaOH, Ca(OH)₂, Fe(OH)₃.</p>
      <p><strong>2. Công thức hóa học:</strong> M(OH)ₙ, trong đó M là kim loại, n là hóa trị của kim loại.</p>
      <p><strong>3. Tên gọi:</strong> Tên bazơ = Tên kim loại (+ hóa trị nếu kim loại có nhiều hóa trị) + "hiđroxit".</p>
      <p>Ví dụ: NaOH (Natri hiđroxit), Fe(OH)₂ (Sắt(II) hiđroxit), Cu(OH)₂ (Đồng(II) hiđroxit).</p>
      <p><strong>4. Phân loại:</strong></p>
      <ul>
        <li><strong>Bazơ tan (Kiềm):</strong> NaOH, KOH, Ca(OH)₂, Ba(OH)₂. Làm quỳ tím chuyển sang màu <strong>xanh</strong>.</li>
        <li><strong>Bazơ không tan:</strong> Cu(OH)₂, Fe(OH)₃, Mg(OH)₂. Không làm đổi màu quỳ tím.</li>
      </ul>
    </div>

    <h3>III. Muối</h3>

    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p><strong>1. Định nghĩa:</strong> Phân tử muối gồm có một hay nhiều nguyên tử kim loại liên kết với một hay nhiều gốc axit.</p>
      <p><strong>Ví dụ:</strong> NaCl, CuSO₄, Fe(NO₃)₃.</p>
      <p><strong>2. Công thức hóa học:</strong> MₓAᵧ, trong đó M là kim loại, A là gốc axit.</p>
      <p><strong>3. Tên gọi:</strong> Tên muối = Tên kim loại (+ hóa trị nếu cần) + Tên gốc axit.</p>
      <p>Ví dụ: NaCl (Natri clorua), Fe₂(SO₄)₃ (Sắt(III) sunfat), CaCO₃ (Canxi cacbonat).</p>
      <p><strong>4. Phân loại:</strong></p>
      <ul>
        <li><strong>Muối trung hòa:</strong> Gốc axit không còn hiđro có thể thay thế bằng kim loại (ví dụ: Na₂SO₄, KCl).</li>
        <li><strong>Muối axit:</strong> Gốc axit vẫn còn hiđro chưa được thay thế (ví dụ: NaHCO₃, NaHSO₄).</li>
      </ul>
    </div>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Chất nào sau đây là một axit?",
    options: [
      "NaOH",
      "HCl",
      "NaCl",
      "H₂O"
    ],
    correctAnswer: 1,
    explanation: "✅ HCl (axit clohiđric) là một axit mạnh.",
    points: 10
  },
  {
    type: "true-false",
    question: "Dung dịch bazơ làm quỳ tím hóa đỏ.",
    correctAnswer: false,
    explanation: "❌ Sai, dung dịch bazơ (kiềm) làm quỳ tím hóa xanh. Dung dịch axit làm quỳ tím hóa đỏ.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tên gọi của NaOH là gì?",
    options: [
      "Natri oxit",
      "Natri hiđroxit",
      "Natri clorua",
      "Natri sunfat"
    ],
    correctAnswer: 1,
    explanation: "✅ NaOH là một bazơ, có tên là Natri hiđroxit.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Công thức hóa học của Canxi cacbonat là ___.",
    correctAnswer: "CaCO₃",
    explanation: "✅ Canxi (Ca) hóa trị II, gốc cacbonat (CO₃) hóa trị II, nên công thức là CaCO₃.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Chất nào sau đây là muối?",
    options: [
      "H₂SO₄",
      "Cu(OH)₂",
      "Fe₂(SO₄)₃",
      "SO₃"
    ],
    correctAnswer: 2,
    explanation: "✅ Fe₂(SO₄)₃ (Sắt(III) sunfat) là một muối.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Dãy chất nào sau đây chỉ gồm các bazơ tan (kiềm)?",
    options: [
      "NaOH, Ca(OH)₂, Cu(OH)₂",
      "KOH, Ba(OH)₂, NaOH",
      "Fe(OH)₃, Mg(OH)₂, KOH",
      "Al(OH)₃, Zn(OH)₂, Ba(OH)₂"
    ],
    correctAnswer: 1,
    explanation: "✅ KOH, Ba(OH)₂, NaOH đều là các bazơ mạnh và tan tốt trong nước.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép công thức hóa học với tên gọi tương ứng.",
    pairs: [
      {
        left: "H₂SO₃",
        right: "Axit sunfurơ"
      },
      {
        left: "Fe(OH)₂",
        right: "Sắt(II) hiđroxit"
      },
      {
        left: "Na₂CO₃",
        right: "Natri cacbonat"
      },
      {
        left: "H₂SO₄",
        right: "Axit sunfuric"
      }
    ],
    explanation: "✅ Việc gọi tên đúng phụ thuộc vào việc xác định loại hợp chất, hóa trị của nguyên tố và quy tắc tên gọi.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Muối NaHCO₃ có tên gọi là gì?",
    options: [
      "Natri cacbonat",
      "Natri hiđrocacbonat",
      "Natri hiđroxit",
      "Natri cacbua"
    ],
    correctAnswer: 1,
    explanation: "✅ Đây là muối axit, gốc axit là -HCO₃ (hiđrocacbonat). Tên đầy đủ là Natri hiđrocacbonat.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Công thức của axit sunfuric là __",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Công thức",
        correct: "H₂SO₄"
      }
    ],
    options: [
      "H₂SO₄",
      "H₂SO₃",
      "H₂S",
      "SO₄"
    ],
    explanation: "✅ Axit sunfuric có công thức H₂SO₄, là một trong những axit mạnh và quan trọng nhất.",
    points: 10
  },
  {
    type: "true-false",
    question: "Tất cả các bazơ đều làm đổi màu quỳ tím.",
    correctAnswer: false,
    explanation: "❌ Sai, chỉ có các bazơ tan (kiềm) mới làm quỳ tím hóa xanh. Bazơ không tan không làm đổi màu quỳ tím.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Oxit axit tương ứng của axit H₃PO₄ là:",
    options: [
      "P₂O₃",
      "PO₂",
      "P₂O₅",
      "PO"
    ],
    correctAnswer: 2,
    explanation: "✅ P₂O₅ + 3H₂O → 2H₃PO₄. P₂O₅ là anhiđrit photphoric.",
    points: 10
  },
  {
    type: "true-false",
    question: "Muối axit là muối có khả năng phản ứng với cả axit và bazơ.",
    correctAnswer: true,
    explanation: "✅ Đúng, muối axit có tính lưỡng tính. Ví dụ: NaHCO₃ + HCl → NaCl + H₂O + CO₂ và NaHCO₃ + NaOH → Na₂CO₃ + H₂O.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Dung dịch X có pH = 1. Dung dịch X có môi trường gì và làm quỳ tím hóa màu gì?",
    options: [
      "Axit, đỏ",
      "Bazơ, xanh",
      "Trung tính, không đổi màu",
      "Axit, xanh"
    ],
    correctAnswer: 0,
    explanation: "✅ pH < 7 là môi trường axit, làm quỳ tím hóa đỏ.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để phân biệt dung dịch HCl và dung dịch H₂SO₄, ta có thể dùng dung dịch chứa ion ___.",
    correctAnswer: "Ba²⁺",
    hint: "💡 Nghĩ đến phản ứng tạo kết tủa đặc trưng.",
    explanation: "✅ Dùng dung dịch BaCl₂ hoặc Ba(OH)₂. H₂SO₄ sẽ tạo kết tủa trắng BaSO₄, còn HCl thì không.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Cho kim loại Sắt (Fe) lần lượt tác dụng với dung dịch HCl và dung dịch H₂SO₄ đặc, nóng. Muối sắt tạo thành có hóa trị lần lượt là:",
    options: [
      "II và II",
      "III và III",
      "II và III",
      "III và II"
    ],
    correctAnswer: 2,
    explanation: "✅ Fe + 2HCl → FeCl₂ + H₂ (sắt II). 2Fe + 6H₂SO₄(đặc) → Fe₂(SO₄)₃ + 3SO₂ + 6H₂O (sắt III).",
    points: 10
  }
]
};
