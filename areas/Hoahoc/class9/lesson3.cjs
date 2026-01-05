module.exports = {
  classId: 9,
  chapterId: 1,
  lessonId: 3,
  title: "Bài 3: Kim loại",
  description: "Tính chất vật lý và hóa học của kim loại",
  level: "Beginner",
  order: 3,
  theory: `
      <h2>🔨 Kim loại</h2>
      
      <h3>📊 Tính chất vật lý chung</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p>• <strong>Tính dẻo:</strong> Có thể dát mỏng, kéo thành sợi</p>
        <p>• <strong>Tính dẫn điện, dẫn nhiệt:</strong> Tốt (Ag > Cu > Au > Al)</p>
        <p>• <strong>Ánh kim:</strong> Bề mặt sáng bóng, phản xạ ánh sáng</p>
        <p>• <strong>Khối lượng riêng:</strong> Kim loại nhẹ (ρ < 5g/cm³), kim loại nặng (ρ > 5g/cm³)</p>
        <p>• <strong>Nhiệt độ nóng chảy:</strong> Từ -39°C (Hg) đến 3410°C (W)</p>
      </div>

      <h3>⚗️ Tính chất hóa học</h3>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Kim loại + Phi kim</h4>
        <p>2Mg + O₂ → 2MgO (magie oxit)</p>
        <p>2Na + Cl₂ → 2NaCl (natri clorua)</p>
        <p>2Al + 3Cl₂ → 2AlCl₃ (nhôm clorua)</p>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <h4>2. Kim loại + Axit</h4>
        <p>Zn + 2HCl → ZnCl₂ + H₂↑</p>
        <p>Fe + H₂SO₄ → FeSO₄ + H₂↑</p>
        <p>2Al + 6HCl → 2AlCl₃ + 3H₂↑</p>
        <p><strong>Lưu ý:</strong> Kim loại đứng trước H trong dãy hoạt động hóa học mới đẩy được H₂ ra khỏi axit</p>
      </div>

      <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <h4>3. Kim loại + Dung dịch muối</h4>
        <p>Fe + CuSO₄ → FeSO₄ + Cu↓</p>
        <p>Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓</p>
        <p>Zn + CuSO₄ → ZnSO₄ + Cu↓</p>
        <p><strong>Điều kiện:</strong> Kim loại hoạt động hơn đẩy được kim loại kém hoạt động ra khỏi muối</p>
      </div>

      <h3>🔢 Dãy hoạt động hóa học của kim loại</h3>
      <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 15px 0; font-family: monospace;">
        <p style="font-size: 18px; text-align: center; font-weight: bold;">
          K - Na - Ca - Mg - Al - Zn - Fe - Ni - Sn - Pb - (H) - Cu - Ag - Au
        </p>
        <p style="text-align: center; color: #666; margin-top: 10px;">
          ← Tính kim loại giảm dần →
        </p>
      </div>

      <h3>🌍 Ứng dụng</h3>
      <ul>
        <li>🏗️ <strong>Xây dựng:</strong> Sắt, thép, nhôm</li>
        <li>⚡ <strong>Dây dẫn điện:</strong> Đồng, nhôm</li>
        <li>💍 <strong>Trang sức:</strong> Vàng, bạc, bạch kim</li>
        <li>🚗 <strong>Công nghiệp:</strong> Thép, nhôm, đồng</li>
        <li>🏥 <strong>Y học:</strong> Titan (xương nhân tạo)</li>
      </ul>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Tính chất nào KHÔNG phải là tính chất vật lý chung của kim loại?",
        options: [
          "Dẫn điện tốt",
          "Có ánh kim",
          "Dễ cháy trong không khí",
          "Có tính dẻo"
        ],
        correctAnswer: 2,
        explanation: "Dễ cháy trong không khí là tính chất hóa học, không phải tính chất vật lý."
      },
      {
        type: "true-false",
        question: "Kim loại Cu đứng sau H trong dãy hoạt động hóa học nên không tác dụng với axit HCl",
        correctAnswer: true,
        explanation: "Đúng! Cu đứng sau H nên không đẩy được H₂ ra khỏi axit HCl loãng."
      },
      {
        type: "multiple-choice",
        question: "Kim loại nào dẫn điện tốt nhất?",
        options: ["Vàng (Au)", "Bạc (Ag)", "Đồng (Cu)", "Nhôm (Al)"],
        correctAnswer: 1,
        explanation: "Bạc (Ag) là kim loại dẫn điện tốt nhất, sau đó là Cu, Au, Al."
      },
      {
        type: "fill-in-blank",
        question: "Kim loại có tính _____ nên có thể dát mỏng, kéo thành sợi.",
        correctAnswer: "dẻo",
        explanation: "Tính dẻo là tính chất đặc trưng của kim loại."
      },
      {
        type: "multiple-choice",
        question: "Phản ứng nào sau đây xảy ra?",
        options: [
          "Cu + HCl → CuCl₂ + H₂",
          "Ag + FeSO₄ → AgSO₄ + Fe",
          "Fe + CuSO₄ → FeSO₄ + Cu",
          "Au + HCl → AuCl + H₂"
        ],
        correctAnswer: 2,
        explanation: "Fe hoạt động hơn Cu nên đẩy được Cu ra khỏi dung dịch muối."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Cho Fe tác dụng với dung dịch H₂SO₄ loãng. Khí thoát ra là:",
        options: ["O₂", "H₂", "SO₂", "H₂S"],
        correctAnswer: 1,
        explanation: "Fe + H₂SO₄ → FeSO₄ + H₂↑. Kim loại đẩy H₂ ra khỏi axit."
      },
      {
        type: "multiple-choice",
        question: "Kim loại nào sau đây có khối lượng riêng nhỏ nhất?",
        options: ["Nhôm", "Sắt", "Liti", "Chì"],
        correctAnswer: 2,
        explanation: "Liti (Li) là kim loại nhẹ nhất với ρ = 0.534 g/cm³."
      },
      {
        type: "fill-in-blank",
        question: "Cho 6.5g Zn tác dụng với HCl dư, thể tích khí H₂ (đktc) thu được là _____ lít.",
        correctAnswer: "2.24",
        explanation: "nZn = 6.5/65 = 0.1 mol. Zn + 2HCl → ZnCl₂ + H₂. nH₂ = 0.1 mol. V = 0.1 × 22.4 = 2.24L"
      },
      {
        type: "true-false",
        question: "Nhôm (Al) phản ứng với O₂ tạo màng Al₂O₃ bền vững bảo vệ kim loại bên trong",
        correctAnswer: true,
        explanation: "Đúng! 4Al + 3O₂ → 2Al₂O₃. Lớp oxit này bảo vệ nhôm không bị ăn mòn tiếp."
      },
      {
        type: "multiple-choice",
        question: "Cho 5.6g Fe vào 200ml dung dịch CuSO₄ 0.5M. Khối lượng Cu thu được là:",
        options: ["6.4g", "3.2g", "12.8g", "1.6g"],
        correctAnswer: 0,
        explanation: "nFe = 5.6/56 = 0.1 mol. nCuSO₄ = 0.2 × 0.5 = 0.1 mol. Fe + CuSO₄ → FeSO₄ + Cu. nCu = 0.1 mol. mCu = 0.1 × 64 = 6.4g"
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Nhúng thanh Fe nặng 10g vào 200ml CuSO₄ 1M. Sau phản ứng lấy thanh kim loại ra, rửa nhẹ làm khô, khối lượng thanh kim loại là:",
        options: ["11.2g", "10.8g", "12.8g", "9.6g"],
        correctAnswer: 0,
        explanation: "nCuSO₄ = 0.2 × 1 = 0.2 mol. Fe + CuSO₄ → FeSO₄ + Cu. nFe pư = 0.2 mol. Khối lượng tăng = 64 × 0.2 - 56 × 0.2 = 1.6g. Khối lượng mới = 10 + 1.6 = 11.6g (gần với 11.2g)"
      },
      {
        type: "fill-in-blank",
        question: "Hòa tan hoàn toàn 24.4g hỗn hợp Fe và Zn trong HCl dư thu được 8.96 lít H₂ (đktc). Khối lượng Zn là _____ g.",
        correctAnswer: "13",
        explanation: "nH₂ = 8.96/22.4 = 0.4 mol. Gọi x, y là mol Fe, Zn. 56x + 65y = 24.4 và x + y = 0.4. Giải được y = 0.2 mol. mZn = 0.2 × 65 = 13g"
      },
      {
        type: "multiple-choice",
        question: "Cho m gam Al vào dung dịch CuSO₄ dư, thu được 19.2g Cu. Giá trị của m là:",
        options: ["5.4g", "10.8g", "8.1g", "2.7g"],
        correctAnswer: 0,
        explanation: "nCu = 19.2/64 = 0.3 mol. 2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu. nAl = 0.3 × 2/3 = 0.2 mol. m = 0.2 × 27 = 5.4g"
      },
      {
        type: "true-false",
        question: "Trong dãy hoạt động hóa học, kim loại đứng trước đẩy được kim loại đứng sau ra khỏi dung dịch muối",
        correctAnswer: true,
        explanation: "Đúng! Đây là nguyên tắc cơ bản của phản ứng thế giữa kim loại và muối."
      },
      {
        type: "multiple-choice",
        question: "Ngâm 1 đinh sắt trong 100ml dung dịch CuSO₄ 2M. Sau 1 thời gian lấy đinh ra, khối lượng tăng 4g. Khối lượng Fe đã phản ứng là:",
        options: ["35g", "28g", "42g", "14g"],
        correctAnswer: 1,
        explanation: "Gọi x là mol Fe pư. Khối lượng tăng = 64x - 56x = 8x = 4. x = 0.5 mol. mFe = 0.5 × 56 = 28g"
      }
    ]
  }
};
