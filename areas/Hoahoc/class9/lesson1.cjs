module.exports = {
  classId: 9,
  chapterId: 1,
  lessonId: 1,
  title: "Bài 1: Tính chất hóa học của oxit",
  description: "Tìm hiểu về tính chất hóa học cơ bản của các oxit",
  level: "Beginner",
  order: 1,
  theory: `
      <h2>🧪 Tính chất hóa học của Oxit</h2>
      <p><strong>Oxit</strong> là hợp chất của oxi với một nguyên tố hóa học khác.</p>
      
      <h3>🔍 Phân loại Oxit</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Oxit axit</h4>
        <p>• Tác dụng với nước tạo thành axit</p>
        <p>• Ví dụ: CO₂, SO₂, P₂O₅</p>
        <p>• Công thức: CO₂ + H₂O → H₂CO₃</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Oxit bazơ</h4>
        <p>• Tác dụng với nước tạo thành bazơ</p>
        <p>• Ví dụ: Na₂O, CaO, K₂O</p>
        <p>• Công thức: CaO + H₂O → Ca(OH)₂</p>
      </div>

      <h3>⚗️ Tính chất hóa học quan trọng</h3>
      <ul>
        <li>🔥 <strong>Oxit bazơ + Axit:</strong> Tạo muối và nước</li>
        <li>💧 <strong>Oxit axit + Bazơ:</strong> Tạo muối và nước</li>
        <li>🧪 <strong>Oxit axit + Oxit bazơ:</strong> Tạo muối</li>
      </ul>

      <h3>📝 Ví dụ thực tế</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <p>• <strong>CaO + H₂O:</strong> Phản ứng tỏa nhiệt mạnh (vôi tôi)</p>
        <p>• <strong>CO₂:</strong> Gây hiệu ứng nhà kính</p>
        <p>• <strong>SO₂:</strong> Gây mưa axit</p>
      </div>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Oxit là hợp chất của oxi với:",
        options: [
          "Một nguyên tố hóa học khác",
          "Chỉ với kim loại",
          "Chỉ với phi kim",
          "Với hydro"
        ],
        correctAnswer: 0,
        explanation: "Oxit là hợp chất của oxi với một nguyên tố hóa học bất kỳ (có thể là kim loại hoặc phi kim)."
      },
      {
        type: "multiple-choice",
        question: "CO₂ thuộc loại oxit nào?",
        options: [
          "Oxit bazơ",
          "Oxit axit",
          "Oxit lưỡng tính",
          "Oxit trung tính"
        ],
        correctAnswer: 1,
        explanation: "CO₂ là oxit axit vì tác dụng với nước tạo thành axit cacbonic (H₂CO₃)."
      },
      {
        type: "true-false",
        question: "CaO + H₂O tạo thành Ca(OH)₂",
        correctAnswer: true,
        explanation: "Đúng! CaO là oxit bazơ, tác dụng với nước tạo thành bazơ Ca(OH)₂."
      },
      {
        type: "fill-in-blank",
        question: "Oxit bazơ tác dụng với axit tạo thành _____ và nước.",
        correctAnswer: "muối",
        explanation: "Oxit bazơ + Axit → Muối + Nước (phản ứng trung hòa)."
      },
      {
        type: "multiple-choice",
        question: "Oxit nào sau đây là oxit bazơ?",
        options: [
          "SO₂",
          "CO₂",
          "Na₂O",
          "P₂O₅"
        ],
        correctAnswer: 2,
        explanation: "Na₂O là oxit bazơ, các oxit còn lại đều là oxit axit."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Phản ứng nào sau đây KHÔNG đúng?",
        options: [
          "CaO + H₂O → Ca(OH)₂",
          "CO₂ + H₂O → H₂CO₃",
          "SO₂ + NaOH → Na₂SO₃ + H₂O",
          "Na₂O + HCl → NaCl + H₂"
        ],
        correctAnswer: 3,
        explanation: "Đáp án D sai. Phản ứng đúng: Na₂O + 2HCl → 2NaCl + H₂O (tạo nước, không tạo H₂)."
      },
      {
        type: "fill-in-blank",
        question: "Hoàn thành phương trình: CaO + 2HCl → _____ + H₂O",
        correctAnswer: "CaCl₂",
        explanation: "CaO + 2HCl → CaCl₂ + H₂O (canxi clorua và nước)."
      },
      {
        type: "multiple-choice",
        question: "Khí CO₂ gây ra hiện tượng gì?",
        options: [
          "Mưa axit",
          "Hiệu ứng nhà kính",
          "Phá hủy tầng ozon",
          "Ô nhiễm không khí độc hại"
        ],
        correctAnswer: 1,
        explanation: "CO₂ gây hiệu ứng nhà kính, làm trái đất nóng lên. SO₂ mới gây mưa axit."
      },
      {
        type: "true-false",
        question: "SO₂ tác dụng với Ca(OH)₂ tạo muối canxi sunfit",
        correctAnswer: true,
        explanation: "Đúng! SO₂ + Ca(OH)₂ → CaSO₃ + H₂O (canxi sunfit)."
      },
      {
        type: "multiple-choice",
        question: "Để phân biệt CO₂ và O₂, dùng chất nào?",
        options: [
          "Nước vôi trong",
          "Giấy quỳ tím",
          "Que đóm còn tàn đỏ",
          "Cả A và C"
        ],
        correctAnswer: 3,
        explanation: "CO₂ làm đục nước vôi trong, không duy trì sự cháy. O₂ không làm đục nước vôi, làm que đóm bùng cháy."
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Cho 5.6g CaO tác dụng với HCl dư. Khối lượng muối thu được là:",
        options: [
          "11.1g",
          "22.2g",
          "5.6g",
          "14.8g"
        ],
        correctAnswer: 0,
        explanation: "nCaO = 5.6/56 = 0.1 mol. CaO + 2HCl → CaCl₂ + H₂O. nCaCl₂ = 0.1 mol. mCaCl₂ = 0.1 × 111 = 11.1g"
      },
      {
        type: "fill-in-blank",
        question: "Sục 4.48 lít CO₂ (đktc) vào nước vôi trong dư. Khối lượng kết tủa thu được là _____ gam.",
        correctAnswer: "20",
        explanation: "nCO₂ = 4.48/22.4 = 0.2 mol. CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O. nCaCO₃ = 0.2 mol. m = 0.2 × 100 = 20g"
      },
      {
        type: "multiple-choice",
        question: "Hòa tan hoàn toàn 8g hỗn hợp CaO và MgO trong HCl dư thu được 23g muối. Khối lượng CaO là:",
        options: [
          "2.8g",
          "5.6g",
          "4.2g",
          "3.5g"
        ],
        correctAnswer: 1,
        explanation: "Gọi x, y là số mol CaO, MgO. Ta có: 56x + 40y = 8 và 111x + 95y = 23. Giải hệ được x = 0.1 mol. mCaO = 5.6g"
      },
      {
        type: "true-false",
        question: "1 mol CO₂ tác dụng được với 1 mol NaOH tạo Na₂CO₃",
        correctAnswer: false,
        explanation: "Sai! 1 mol CO₂ + 2 mol NaOH → Na₂CO₃ + H₂O. Cần 2 mol NaOH để tạo muối trung hòa."
      },
      {
        type: "multiple-choice",
        question: "Để hấp thụ hoàn toàn 6.72 lít SO₂ (đktc), cần dùng bao nhiêu lít dung dịch NaOH 2M?",
        options: [
          "0.15L",
          "0.3L",
          "0.6L",
          "1.2L"
        ],
        correctAnswer: 1,
        explanation: "nSO₂ = 6.72/22.4 = 0.3 mol. SO₂ + 2NaOH → Na₂SO₃ + H₂O. nNaOH = 0.6 mol. V = 0.6/2 = 0.3L"
      }
    ]
  }
};
