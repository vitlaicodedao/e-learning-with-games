module.exports = {
  classId: 8,
  chapterId: 4,
  lessonId: 23,
  title: "Bài 23: Luyện tập về Axit - Bazơ - Muối và Phản ứng trao đổi",
  description: "Ôn tập các tính chất hóa học của axit, bazơ, muối và tìm hiểu về điều kiện xảy ra phản ứng trao đổi trong dung dịch.",
  level: "Intermediate",
  order: 23,
  theory: `
    <h2>🔄 Luyện tập và Phản ứng trao đổi</h2>
    <p>Bài học này củng cố kiến thức về các hợp chất vô cơ và giới thiệu một loại phản ứng quan trọng: phản ứng trao đổi.</p>
    
    <h3>I. Tính chất hóa học của Axit, Bazơ, Muối</h3>
    
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <h4>1. Axit</h4>
      <ul>
        <li>Làm đổi màu chất chỉ thị (quỳ tím → đỏ).</li>
        <li>Tác dụng với kim loại (đứng trước H) → Muối + H₂.</li>
        <li>Tác dụng với bazơ → Muối + H₂O (Phản ứng trung hòa).</li>
        <li>Tác dụng với oxit bazơ → Muối + H₂O.</li>
        <li>Tác dụng với muối → Muối mới + Axit mới.</li>
      </ul>
    </div>

    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <h4>2. Bazơ</h4>
      <ul>
        <li>Làm đổi màu chất chỉ thị (quỳ tím → xanh, phenolphtalein → hồng). (Chỉ bazơ tan/kiềm)</li>
        <li>Tác dụng với axit → Muối + H₂O.</li>
        <li>Tác dụng với oxit axit → Muối + H₂O. (Chỉ bazơ tan/kiềm)</li>
        <li>Tác dụng với muối → Muối mới + Bazơ mới. (Chỉ bazơ tan/kiềm)</li>
        <li>Bazơ không tan bị nhiệt phân hủy → Oxit + H₂O.</li>
      </ul>
    </div>

    <div style="background: #fff7ed; padding: 15px; border-left: 4px solid #fb923c; margin: 15px 0;">
      <h4>3. Muối</h4>
      <ul>
        <li>Tác dụng với kim loại (mạnh hơn) → Muối mới + Kim loại mới.</li>
        <li>Tác dụng với axit → Muối mới + Axit mới.</li>
        <li>Tác dụng với bazơ (kiềm) → Muối mới + Bazơ mới.</li>
        <li>Tác dụng với muối → Hai muối mới.</li>
        <li>Nhiều muối bị nhiệt phân hủy.</li>
      </ul>
    </div>

    <h3>II. Phản ứng trao đổi trong dung dịch</h3>

    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p><strong>1. Định nghĩa:</strong> Phản ứng trao đổi là phản ứng hóa học, trong đó hai hợp chất tham gia phản ứng trao đổi với nhau những thành phần cấu tạo của chúng để tạo ra những hợp chất mới.</p>
      <p><strong>Ví dụ:</strong></p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">
        AgNO₃ + NaCl → AgCl↓ + NaNO₃
      </div>
      <p>Trong phản ứng trên, Ag⁺ và Na⁺ đã trao đổi vị trí cho nhau.</p>
      
      <p><strong>2. Điều kiện xảy ra phản ứng trao đổi:</strong></p>
      <p>Phản ứng trao đổi trong dung dịch của các chất chỉ xảy ra nếu sản phẩm tạo thành có ít nhất một trong các điều kiện sau:</p>
      <ul>
        <li><strong>Là chất kết tủa (không tan).</strong> Ví dụ: BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl.</li>
        <li><strong>Là chất khí (bay hơi).</strong> Ví dụ: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑.</li>
        <li><strong>Là chất điện li yếu (ví dụ: nước).</strong> Ví dụ: NaOH + HCl → NaCl + H₂O.</li>
      </ul>
      <p>Nếu không thỏa mãn các điều kiện trên, phản ứng được coi là không xảy ra.</p>
      <p><strong>Ví dụ không xảy ra:</strong> KCl + NaNO₃ → không phản ứng (vì sản phẩm giả định là KNO₃ và NaCl đều tan).</p>
    </div>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Phản ứng giữa axit và bazơ được gọi là gì?",
    options: [
      "Phản ứng thế",
      "Phản ứng hóa hợp",
      "Phản ứng phân hủy",
      "Phản ứng trung hòa"
    ],
    correctAnswer: 3,
    explanation: "✅ Phản ứng trung hòa là phản ứng giữa axit và bazơ, tạo ra muối và nước.",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng trao đổi luôn tạo ra chất kết tủa.",
    correctAnswer: false,
    explanation: "❌ Sai, điều kiện là sản phẩm phải có chất kết tủa, hoặc chất khí, hoặc chất điện li yếu (như nước).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Sản phẩm của phản ứng Cu(OH)₂ --(t°)--> là gì?",
    options: [
      "Cu và H₂O",
      "CuO và H₂O",
      "Cu₂O và H₂O",
      "Không bị nhiệt phân"
    ],
    correctAnswer: 1,
    explanation: "✅ Bazơ không tan như Cu(OH)₂ bị nhiệt phân tạo ra oxit bazơ tương ứng và nước.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phản ứng giữa BaCl₂ và Na₂SO₄ xảy ra vì sản phẩm tạo thành có chất kết tủa là ___.",
    correctAnswer: "BaSO₄",
    explanation: "✅ BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl. BaSO₄ là chất kết tủa màu trắng.",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng: 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O là một phản ứng trao đổi.",
    correctAnswer: true,
    explanation: "✅ Đúng, hai hợp chất trao đổi thành phần (Na⁺ và H⁺) và sản phẩm tạo thành là nước (chất điện li yếu).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Cặp chất nào sau đây khi phản ứng với nhau sẽ tạo ra chất khí?",
    options: [
      "BaCl₂ và H₂SO₄",
      "NaOH và HCl",
      "CaCO₃ và HCl",
      "AgNO₃ và NaCl"
    ],
    correctAnswer: 2,
    explanation: "✅ CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑. Khí CO₂ được giải phóng.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép cặp chất phản ứng với điều kiện xảy ra phản ứng trao đổi.",
    pairs: [
      {
        left: "AgNO₃ + KCl",
        right: "Tạo chất kết tủa (AgCl)"
      },
      {
        left: "K₂CO₃ + H₂SO₄",
        right: "Tạo chất khí (CO₂)"
      },
      {
        left: "Ba(OH)₂ + HNO₃",
        right: "Tạo nước (H₂O)"
      }
    ],
    explanation: "✅ Mỗi phản ứng đều thỏa mãn ít nhất một trong ba điều kiện của phản ứng trao đổi.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào sau đây KHÔNG xảy ra?",
    options: [
      "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
      "Fe + 2HCl → FeCl₂ + H₂↑",
      "2KCl + Mg(NO₃)₂ → 2KNO₃ + MgCl₂",
      "Zn + CuSO₄ → ZnSO₄ + Cu"
    ],
    correctAnswer: 2,
    explanation: "✅ Phản ứng giữa KCl và Mg(NO₃)₂ không xảy ra vì các sản phẩm giả định (KNO₃, MgCl₂) đều tan.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành phương trình: CaCO₃ + 2HCl → CaCl₂ + H₂O + ?",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Sản phẩm khí",
        correct: "CO₂↑"
      }
    ],
    options: [
      "CO₂↑",
      "O₂↑",
      "H₂↑",
      "Cl₂↑"
    ],
    explanation: "✅ Muối cacbonat tác dụng với axit tạo ra muối mới, nước và khí CO₂.",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng thế (ví dụ: Zn + CuSO₄) cũng là một loại phản ứng trao đổi.",
    correctAnswer: false,
    explanation: "❌ Sai. Phản ứng thế là phản ứng giữa đơn chất và hợp chất. Phản ứng trao đổi là phản ứng giữa hai hợp chất.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Để nhận biết 3 dung dịch không nhãn: H₂SO₄, BaCl₂, NaCl, ta chỉ cần dùng thêm một thuốc thử là:",
    options: [
      "Dung dịch NaOH",
      "Dung dịch AgNO₃",
      "Quỳ tím",
      "Dung dịch HCl"
    ],
    correctAnswer: 2,
    explanation: "✅ Dùng quỳ tím: H₂SO₄ làm quỳ hóa đỏ. Dùng H₂SO₄ vừa nhận biết được cho vào 2 dung dịch còn lại: BaCl₂ tạo kết tủa trắng, NaCl không hiện tượng.",
    points: 10
  },
  {
    type: "true-false",
    question: "Mọi phản ứng trung hòa đều là phản ứng trao đổi.",
    correctAnswer: true,
    explanation: "✅ Đúng, vì phản ứng trung hòa luôn tạo ra sản phẩm là H₂O (chất điện li yếu), thỏa mãn điều kiện của phản ứng trao đổi.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trộn dung dịch chứa 0.1 mol Ba(OH)₂ với dung dịch chứa 0.1 mol H₂SO₄. Khối lượng kết tủa thu được là: (Ba=137, S=32, O=16)",
    options: [
      "23.3g",
      "17.1g",
      "32.3g",
      "2.33g"
    ],
    correctAnswer: 0,
    explanation: "✅ Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O. Phản ứng 1:1. nBaSO₄ = nH₂SO₄ = 0.1 mol. mBaSO₄ = 0.1 * (137+32+16*4) = 23.3g.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Hiện tượng khi cho từ từ dung dịch HCl vào dung dịch Na₂CO₃ là lúc đầu chưa có khí, sau đó mới có khí thoát ra. Điều này là do ban đầu xảy ra phản ứng tạo ra muối ___.",
    correctAnswer: "axit",
    hint: "💡 HCl + Na₂CO₃ → NaHCO₃ + NaCl",
    explanation: "✅ Ban đầu, HCl phản ứng với Na₂CO₃ tạo ra muối axit NaHCO₃. Khi HCl dư, nó mới phản ứng tiếp với NaHCO₃ để sinh ra khí CO₂.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào sau đây có phương trình ion rút gọn là Ca²⁺ + CO₃²⁻ → CaCO₃↓?",
    options: [
      "CaCl₂ + Na₂CO₃",
      "Ca(OH)₂ + CO₂",
      "Ca(HCO₃)₂ + NaOH",
      "Tất cả các đáp án trên"
    ],
    correctAnswer: 0,
    explanation: "✅ Chỉ có phản ứng CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl có phương trình ion rút gọn như trên. Các phản ứng khác có sự tham gia của H₂O, H⁺ hoặc OH⁻.",
    points: 10
  }
]
};
