module.exports = {
  classId: 8,
  chapterId: 1, // Phải là chương 1
  lessonId: 10,
  title: "Bài 10: Hóa trị (Nâng cao)",
  description: "Đơn vị mol, số Avogadro, khối lượng mol",
  level: "Advanced",
  order: 10,
  theory: `
      <h2>🔢 Mol là gì?</h2>
      <p><strong>Mol</strong> là đơn vị đo lượng chất, dùng để đếm số hạt (nguyên tử, phân tử, ion).</p>
      
      <h3>🌟 Số Avogadro (N<sub>A</sub>)</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p style="text-align: center; font-size: 20px; color: #0284c7;">
          <strong>N<sub>A</sub> = 6,022 × 10²³</strong>
        </p>
        <p><strong>1 mol</strong> của bất kỳ chất nào cũng chứa <strong>6,022 × 10²³</strong> hạt (nguyên tử, phân tử, ion)</p>
      </div>

      <h3>⚖️ Khối lượng mol (M)</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p><strong>Khối lượng mol</strong> là khối lượng của 1 mol chất, đơn vị: g/mol</p>
        <p>• Khối lượng mol = khối lượng nguyên tử/phân tử (đơn vị u)</p>
        <p>• Ví dụ: M<sub>C</sub> = 12 g/mol, M<sub>O₂</sub> = 32 g/mol</p>
      </div>

      <h3>📐 Công thức tính toán</h3>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>1. Số mol (n):</strong></p>
        <p style="text-align: center; font-size: 18px;">n = m/M = N/N<sub>A</sub></p>
        <p>Trong đó:</p>
        <p>• n: số mol (mol)</p>
        <p>• m: khối lượng (g)</p>
        <p>• M: khối lượng mol (g/mol)</p>
        <p>• N: số hạt</p>
        <p>• N<sub>A</sub>: số Avogadro</p>
      </div>

      <h3>� Ví dụ minh họa</h3>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4>Tính số mol của 24g C (M<sub>C</sub> = 12 g/mol)</h4>
        <p>n = m/M = 24/12 = 2 mol</p>
        <p>Số nguyên tử C: N = n × N<sub>A</sub> = 2 × 6,022×10²³ = 1,2×10²⁴ nguyên tử</p>
      </div>
    `,
  game: [
    {
      type: "multiple-choice",
      question: "Mol là đơn vị đo gì?",
      options: [
        "Khối lượng",
        "Lượng chất",
        "Thể tích",
        "Nhiệt độ"
      ],
      correctAnswer: 1,
      explanation: "✅ Mol là đơn vị đo lượng chất.",
      points: 10
    },
      {
        type: "true-false",
        question: "Số Avogadro bằng 6,022 × 10²³.",
        correctAnswer: true,
        explanation: "✅ Đúng! N_A = 6,022 × 10²³ hạt/mol",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "1 mol chất chứa bao nhiêu hạt?",
        options: [
          "6,022 × 10²²",
          "6,022 × 10²³",
          "6,022 × 10²⁴",
          "6,022 × 10²⁵"
        ],
        correctAnswer: 1,
        explanation: "✅ 1 mol chứa 6,022 × 10²³ hạt (số Avogadro).",
        points: 10
      },
      {
        type: "true-false",
        question: "Khối lượng mol của C là 12 g/mol.",
        correctAnswer: true,
        explanation: "✅ Đúng! M_C = 12 g/mol",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Công thức tính số mol từ khối lượng là?",
        options: [
          "n = M × m",
          "n = m/M",
          "n = M/m",
          "n = m + M"
        ],
        correctAnswer: 1,
        explanation: "✅ n = m/M (số mol = khối lượng/khối lượng mol)",
        points: 10
      },
    {
        type: "matching",
        question: "🔗 Ghép đại lượng với đơn vị",
        pairs: [
          { left: "Số mol (n)", right: "mol" },
          { left: "Khối lượng (m)", right: "g (gam)" },
          { left: "Khối lượng mol (M)", right: "g/mol" },
          { left: "Số hạt (N)", right: "hạt" }
        ],
        explanation: "✅ Tuyệt vời! Bạn nhớ đơn vị của các đại lượng.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Số Avogadro N_A = 6,022 × 10 mũ ___",
        correctAnswer: "23",
        hint: "💡 Một số rất lớn!",
        explanation: "✅ Chính xác! N_A = 6,022 × 10²³",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước tính số mol từ khối lượng",
        options: [
          "Xác định khối lượng m (g)",
          "Xác định khối lượng mol M (g/mol)",
          "Áp dụng công thức n = m/M",
          "Tính toán kết quả"
        ],
        correctOrder: [
          "Xác định khối lượng m (g)",
          "Xác định khối lượng mol M (g/mol)",
          "Áp dụng công thức n = m/M",
          "Tính toán kết quả"
        ],
        explanation: "✅ Đúng rồi! Đây là quy trình tính toán chuẩn.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tính số mol của 32g O₂ (M = 32 g/mol)?",
        options: [
          "0,5 mol",
          "1 mol",
          "2 mol",
          "4 mol"
        ],
        correctAnswer: 1,
        explanation: "✅ n = m/M = 32/32 = 1 mol",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Khối lượng mol của H₂O (H=1, O=16) là ___ g/mol",
        correctAnswer: "18",
        hint: "💡 M = 2×1 + 16",
        explanation: "✅ Đúng! M_H₂O = 2×1 + 16 = 18 g/mol",
        points: 10
      },
    {
        type: "drag-drop",
        question: "🧩 Hoàn thành công thức: n = ___ / M = N / ___",
        inline: true,
        slots: [
          { id: 1, label: "Tử số 1", correct: "m" },
          { id: 2, label: "Mẫu số 2", correct: "NA" }
        ],
        options: ["m", "M", "N", "NA"],
        explanation: "✅ Hoàn hảo! n = m/M = N/N_A",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tìm phát biểu SAI:",
        options: [
          "Số Avogadro là hằng số",
          "1 mol O₂ và 1 mol H₂ có cùng khối lượng",
          "1 mol mọi chất đều chứa 6,022×10²³ hạt",
          "Khối lượng mol có đơn vị g/mol"
        ],
        correctAnswer: 1,
        explanation: "❌ SAI! 1 mol O₂ (32g) và 1 mol H₂ (2g) có khối lượng KHÁC NHAU!",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Có bao nhiêu nguyên tử trong 0,5 mol C? (Kết quả: ___×10²³)",
        correctAnswer: "3.011",
        hint: "💡 N = n × N_A = 0,5 × 6,022×10²³",
        explanation: "✅ Xuất sắc! N = 0,5 × 6,022×10²³ = 3,011×10²³ nguyên tử",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Ghép số mol với khối lượng tương ứng",
        pairs: [
          { left: "1 mol H₂O (M=18)", right: "18 gam" },
          { left: "2 mol NaCl (M=58,5)", right: "117 gam" },
          { left: "0,5 mol CO₂ (M=44)", right: "22 gam" },
          { left: "3 mol H₂ (M=2)", right: "6 gam" }
        ],
        explanation: "✅ Tuyệt vời! Bạn tính toán chính xác: m = n × M",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tính số phân tử trong 8,8g CO₂ (M=44 g/mol)?",
        options: [
          "1,2×10²³",
          "3,011×10²³",
          "6,022×10²³",
          "1,2×10²⁴"
        ],
        correctAnswer: 0,
        explanation: "✅ n = 8,8/44 = 0,2 mol → N = 0,2 × 6,022×10²³ = 1,2×10²³ phân tử",
        points: 10
      }
  ]
};
