module.exports = {
  classId: 9,
  chapterId: 1,
  lessonId: 2,
  title: "Bài 2: Axit - Bazơ - Muối",
  description: "Tìm hiểu về tính chất và phản ứng của axit, bazơ và muối",
  level: "Beginner",
  order: 2,
  theory: `
      <h2>🧪 Axit - Bazơ - Muối</h2>
      
      <h3>🔴 Axit</h3>
      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <h4>Định nghĩa</h4>
        <p>Axit là hợp chất mà phân tử gồm có một hay nhiều nguyên tử hydro liên kết với gốc axit.</p>
        <p><strong>Ví dụ:</strong> HCl, H₂SO₄, HNO₃</p>
        
        <h4>Tính chất hóa học</h4>
        <p>• Làm quỳ tím chuyển màu đỏ</p>
        <p>• Tác dụng với kim loại → Muối + H₂</p>
        <p>• Tác dụng với bazơ → Muối + H₂O</p>
        <p>• Tác dụng với oxit bazơ → Muối + H₂O</p>
      </div>
      
      <h3>🔵 Bazơ</h3>
      <div style="background: #eff6ff; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0;">
        <h4>Định nghĩa</h4>
        <p>Bazơ là hợp chất mà phân tử gồm có nguyên tử kim loại liên kết với một hay nhiều nhóm OH.</p>
        <p><strong>Ví dụ:</strong> NaOH, Ca(OH)₂, KOH</p>
        
        <h4>Tính chất hóa học</h4>
        <p>• Làm quỳ tím chuyển màu xanh</p>
        <p>• Tác dụng với axit → Muối + H₂O</p>
        <p>• Tác dụng với oxit axit → Muối + H₂O</p>
        <p>• Bazơ tan làm phenolphtalein chuyển màu hồng</p>
      </div>

      <h3>⚪ Muối</h3>
      <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Định nghĩa</h4>
        <p>Muối là hợp chất mà phân tử gồm có nguyên tử kim loại liên kết với gốc axit.</p>
        <p><strong>Ví dụ:</strong> NaCl, CaSO₄, KNO₃</p>
        
        <h4>Cách gọi tên</h4>
        <p>Tên muối = Tên kim loại + Tên gốc axit</p>
        <p><strong>Ví dụ:</strong> NaCl - Natri clorua, CaSO₄ - Canxi sunfat</p>
      </div>

      <h3>⚗️ Phản ứng trung hòa</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <p><strong>Axit + Bazơ → Muối + Nước</strong></p>
        <p>Ví dụ: HCl + NaOH → NaCl + H₂O</p>
        <p>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</p>
      </div>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Axit là hợp chất có chứa nguyên tố nào?",
        options: [
          "Oxi",
          "Hydro",
          "Nitơ",
          "Cacbon"
        ],
        correctAnswer: 1,
        explanation: "Axit là hợp chất có chứa nguyên tử hydro liên kết với gốc axit."
      },
      {
        type: "true-false",
        question: "Bazơ làm quỳ tím chuyển màu đỏ",
        correctAnswer: false,
        explanation: "Sai! Bazơ làm quỳ tím chuyển màu xanh. Axit mới làm quỳ tím chuyển màu đỏ."
      },
      {
        type: "multiple-choice",
        question: "Chất nào sau đây là muối?",
        options: [
          "HCl",
          "NaOH",
          "NaCl",
          "H₂O"
        ],
        correctAnswer: 2,
        explanation: "NaCl (Natri clorua) là muối. HCl là axit, NaOH là bazơ, H₂O là nước."
      },
      {
        type: "fill-in-blank",
        question: "Phản ứng giữa axit và bazơ tạo thành muối và _____",
        correctAnswer: "nước",
        explanation: "Axit + Bazơ → Muối + Nước (phản ứng trung hòa)."
      },
      {
        type: "multiple-choice",
        question: "Bazơ tan làm phenolphtalein chuyển sang màu gì?",
        options: [
          "Đỏ",
          "Xanh",
          "Hồng",
          "Không màu"
        ],
        correctAnswer: 2,
        explanation: "Bazơ tan làm phenolphtalein chuyển sang màu hồng."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Phản ứng nào sau đây KHÔNG xảy ra?",
        options: [
          "HCl + NaOH → NaCl + H₂O",
          "H₂SO₄ + Cu → CuSO₄ + H₂",
          "HCl + CaO → CaCl₂ + H₂O",
          "NaOH + CO₂ → Na₂CO₃ + H₂O"
        ],
        correctAnswer: 1,
        explanation: "Đồng (Cu) đứng sau H trong dãy hoạt động hóa học nên không đẩy được H₂ ra khỏi axit."
      },
      {
        type: "fill-in-blank",
        question: "Công thức hóa học của axit sunfuric là _____",
        correctAnswer: "H₂SO₄",
        explanation: "H₂SO₄ là công thức của axit sunfuric (có 2 nguyên tử H)."
      },
      {
        type: "true-false",
        question: "Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O",
        correctAnswer: true,
        explanation: "Đúng! Đây là phản ứng trung hòa giữa bazơ Ca(OH)₂ và axit HCl."
      },
      {
        type: "multiple-choice",
        question: "Muối nào tan trong nước?",
        options: [
          "AgCl",
          "BaSO₄",
          "NaCl",
          "CaCO₃"
        ],
        correctAnswer: 2,
        explanation: "NaCl tan trong nước. AgCl, BaSO₄, CaCO₃ không tan."
      },
      {
        type: "multiple-choice",
        question: "Để trung hòa 1 lít dung dịch HCl 1M, cần bao nhiêu gam NaOH?",
        options: [
          "20g",
          "40g",
          "60g",
          "80g"
        ],
        correctAnswer: 1,
        explanation: "nHCl = 1 mol. HCl + NaOH → NaCl + H₂O. nNaOH = 1 mol. mNaOH = 1 × 40 = 40g"
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Trộn 200ml HCl 1M với 300ml NaOH 0.5M. pH của dung dịch sau phản ứng là:",
        options: [
          "pH < 7",
          "pH = 7",
          "pH > 7",
          "Không xác định được"
        ],
        correctAnswer: 2,
        explanation: "nHCl = 0.2 mol, nNaOH = 0.15 mol. HCl phản ứng hết, NaOH dư 0.05 mol → môi trường bazơ → pH > 7"
      },
      {
        type: "fill-in-blank",
        question: "Hòa tan 11.2 lít HCl (đktc) vào nước được 500ml dung dịch. Nồng độ mol/l của dung dịch là _____ M",
        correctAnswer: "1",
        explanation: "nHCl = 11.2/22.4 = 0.5 mol. CM = 0.5/0.5 = 1M"
      },
      {
        type: "multiple-choice",
        question: "Để điều chế 29.25g NaCl từ HCl và NaOH, cần dùng bao nhiêu gam NaOH?",
        options: [
          "10g",
          "15g",
          "20g",
          "25g"
        ],
        correctAnswer: 2,
        explanation: "nNaCl = 29.25/58.5 = 0.5 mol. HCl + NaOH → NaCl + H₂O. nNaOH = 0.5 mol. mNaOH = 0.5 × 40 = 20g"
      },
      {
        type: "true-false",
        question: "Dung dịch NaOH 1M có pH = 14",
        correctAnswer: true,
        explanation: "Đúng! Với dung dịch NaOH 1M (bazơ mạnh), [OH⁻] = 1M, pOH = 0, pH = 14."
      },
      {
        type: "multiple-choice",
        question: "Trộn 100ml H₂SO₄ 0.1M với 100ml Ba(OH)₂ 0.1M thu được kết tủa X. Khối lượng X là:",
        options: [
          "1.165g",
          "2.33g",
          "3.495g",
          "4.66g"
        ],
        correctAnswer: 1,
        explanation: "nH₂SO₄ = 0.01 mol, nBa(OH)₂ = 0.01 mol. H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O. nBaSO₄ = 0.01 mol. m = 0.01 × 233 = 2.33g"
      }
    ]
  }
};
