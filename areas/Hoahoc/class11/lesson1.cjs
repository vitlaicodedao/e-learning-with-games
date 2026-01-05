module.exports = {
  classId: 11,
  chapterId: 1,
  lessonId: 1,
  title: "Bài 1: Sự điện li",
  description: "Tìm hiểu về sự điện li của chất trong nước",
  level: "Beginner",
  order: 1,
  theory: `
      <h2>⚡ Sự điện li</h2>
      
      <h3>📚 Định nghĩa</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Sự điện li</strong> là quá trình phân li các chất trong nước thành các ion.</p>
        <p><strong>Chất điện li:</strong> Là chất khi tan trong nước phân li thành ion.</p>
        <p><strong>Ví dụ:</strong> NaCl, HCl, H₂SO₄, NaOH...</p>
      </div>

      <h3>🔬 Phân loại chất điện li</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Chất điện li mạnh</h4>
        <p>• Phân li hoàn toàn thành ion</p>
        <p>• Ví dụ: HCl, NaOH, NaCl</p>
        <p>• Phương trình: HCl → H⁺ + Cl⁻</p>
        
        <h4>2. Chất điện li yếu</h4>
        <p>• Chỉ phân li một phần thành ion</p>
        <p>• Ví dụ: CH₃COOH, NH₃, H₂O</p>
        <p>• Phương trình: CH₃COOH ⇌ CH₃COO⁻ + H⁺</p>
      </div>

      <h3>⚗️ Độ điện li (α)</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <p>α = (Số phân tử điện li)/(Tổng số phân tử hòa tan)</p>
        <p>• α = 1: Chất điện li mạnh</p>
        <p>• α < 1: Chất điện li yếu</p>
        <p>• α = 0: Chất không điện li</p>
      </div>

      <h3>📊 Ứng dụng</h3>
      <ul>
        <li>🔋 Pin và ắc quy</li>
        <li>🧪 Phản ứng hóa học trong dung dịch</li>
        <li>💧 Xử lý nước</li>
        <li>⚕️ Y học (dung dịch truyền)</li>
      </ul>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Sự điện li là gì?",
        options: [
          "Quá trình phân li chất thành ion",
          "Quá trình hòa tan chất",
          "Quá trình kết tinh",
          "Quá trình bay hơi"
        ],
        correctAnswer: 0,
        explanation: "Sự điện li là quá trình phân li các chất trong nước thành ion."
      },
      {
        type: "true-false",
        question: "HCl là chất điện li mạnh",
        correctAnswer: true,
        explanation: "Đúng! HCl phân li hoàn toàn: HCl → H⁺ + Cl⁻"
      },
      {
        type: "fill-in-blank",
        question: "Chất điện li mạnh có độ điện li α = _____",
        correctAnswer: "1",
        explanation: "Chất điện li mạnh phân li hoàn toàn nên α = 1."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Chất nào sau đây là chất điện li yếu?",
        options: ["NaCl", "HCl", "CH₃COOH", "NaOH"],
        correctAnswer: 2,
        explanation: "CH₃COOH (axit axetic) là chất điện li yếu, chỉ phân li một phần."
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Dung dịch có 0.1 mol HCl trong 1 lít, nồng độ ion H⁺ là:",
        options: ["0.05M", "0.1M", "0.2M", "0.01M"],
        correctAnswer: 1,
        explanation: "HCl → H⁺ + Cl⁻. HCl điện li hoàn toàn nên [H⁺] = [HCl] = 0.1M"
      }
    ]
  }
};
