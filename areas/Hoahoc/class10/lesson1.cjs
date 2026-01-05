module.exports = {
  classId: 10,
  chapterId: 1,
  lessonId: 1,
  title: "Bài 1: Alkane (Ankan)",
  description: "Tìm hiểu về hydrocacbon no mạch hở",
  level: "Beginner",
  order: 1,
  theory: `
      <h2>🧪 Alkane (Ankan) - Hydrocacbon no</h2>
      
      <h3>📚 Định nghĩa</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Ankan</strong> là hydrocacbon mạch hở, trong phân tử chỉ có liên kết đơn C-C.</p>
        <p><strong>Công thức chung:</strong> C<sub>n</sub>H<sub>2n+2</sub> (n ≥ 1)</p>
        <p><strong>Ví dụ:</strong></p>
        <ul>
          <li>Metan: CH₄</li>
          <li>Etan: C₂H₆</li>
          <li>Propan: C₃H₈</li>
          <li>Butan: C₄H₁₀</li>
        </ul>
      </div>

      <h3>🔬 Tính chất vật lý</h3>
      <ul>
        <li>💨 C₁ - C₄: Thể khí</li>
        <li>💧 C₅ - C₁₅: Thể lỏng</li>
        <li>🧊 C₁₆ trở lên: Thể rắn</li>
        <li>📊 Nhiệt độ sôi tăng dần khi phân tử khối tăng</li>
        <li>⚖️ Nhẹ hơn nước, không tan trong nước</li>
      </ul>

      <h3>⚗️ Tính chất hóa học</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Phản ứng thế halogen</h4>
        <p>CH₄ + Cl₂ → CH₃Cl + HCl (có ánh sáng)</p>
        
        <h4>2. Phản ứng cháy</h4>
        <p>CH₄ + 2O₂ → CO₂ + 2H₂O (tỏa nhiệt)</p>
        
        <h4>3. Phản ứng tách (cracking)</h4>
        <p>C₄H₁₀ → C₂H₄ + C₂H₆ (nhiệt độ cao, xúc tác)</p>
      </div>

      <h3>🌍 Ứng dụng</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <p>• <strong>Metan:</strong> Nhiên liệu (khí đốt), nguyên liệu công nghiệp</p>
        <p>• <strong>Propan, Butan:</strong> Khí ga nấu ăn</p>
        <p>• <strong>Benzen:</strong> Nhiên liệu động cơ, dung môi</p>
      </div>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Công thức tổng quát của ankan là:",
        options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
        correctAnswer: 0,
        explanation: "Ankan có công thức tổng quát CnH2n+2 với n ≥ 1"
      },
      {
        type: "true-false",
        question: "Metan có công thức hóa học là CH₄",
        correctAnswer: true,
        explanation: "Đúng! CH₄ là công thức của metan (ankan đơn giản nhất)."
      },
      {
        type: "fill-in-blank",
        question: "Ankan là hydrocacbon mạch hở, trong phân tử chỉ có liên kết _____ C-C",
        correctAnswer: "đơn",
        explanation: "Ankan chỉ có liên kết đơn C-C."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Ankan nào sau đây ở thể khí ở điều kiện thường?",
        options: ["C₅H₁₂", "C₆H₁₄", "C₃H₈", "C₁₆H₃₄"],
        correctAnswer: 2,
        explanation: "C₃H₈ (propan) ở thể khí. C₁-C₄ là khí, C₅-C₁₅ là lỏng."
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Đốt cháy hoàn toàn 1 mol ankan cần 5 mol O₂. Công thức phân tử của ankan là:",
        options: ["CH₄", "C₂H₆", "C₃H₈", "C₄H₁₀"],
        correctAnswer: 2,
        explanation: "CnH2n+2 + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O. Với (3n+1)/2 = 5 → n = 3 → C₃H₈"
      }
    ]
  }
};
