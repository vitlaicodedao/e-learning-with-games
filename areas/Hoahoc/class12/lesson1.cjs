module.exports = {
  classId: 12,
  chapterId: 1,
  lessonId: 1,
  title: "Bài 1: Este",
  description: "Tìm hiểu về este - hợp chất hữu cơ quan trọng",
  level: "Beginner",
  order: 1,
  theory: `
      <h2>🍎 Este</h2>
      
      <h3>📚 Định nghĩa và cấu tạo</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Este</strong> là hợp chất hữu cơ có nhóm chức -COO-</p>
        <p><strong>Công thức cấu tạo chung:</strong> R-COO-R'</p>
        <p>• R: Gốc hydrocacbon (có thể là H)</p>
        <p>• R': Gốc hydrocacbon (không được là H)</p>
        <p><strong>Ví dụ:</strong></p>
        <ul>
          <li>CH₃COOCH₃: Metyl axetat</li>
          <li>CH₃COOC₂H₅: Etyl axetat</li>
          <li>HCOOCH₃: Metyl fomat</li>
        </ul>
      </div>

      <h3>🔬 Tính chất vật lý</h3>
      <ul>
        <li>🌸 Có mùi thơm dễ chịu (hoa quả)</li>
        <li>💧 Nhẹ hơn nước, ít tan trong nước</li>
        <li>🌡️ Nhiệt độ sôi thấp hơn axit và ancol cùng phân tử khối</li>
        <li>🧪 Là dung môi hữu cơ tốt</li>
      </ul>

      <h3>⚗️ Tính chất hóa học</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Phản ứng thủy phân (xà phòng hóa)</h4>
        <p><strong>Trong môi trường axit:</strong></p>
        <p>RCOOR' + H₂O ⇌ RCOOH + R'OH</p>
        
        <p><strong>Trong môi trường bazơ (xà phòng hóa):</strong></p>
        <p>RCOOR' + NaOH → RCOONa + R'OH</p>
        
        <h4>2. Phản ứng với hydro (H₂)</h4>
        <p>RCOOR' + 2H₂ → RCH₂OH + R'OH (xúc tác, t°)</p>
      </div>

      <h3>🌟 Điều chế</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <p><strong>Phản ứng este hóa:</strong></p>
        <p>RCOOH + R'OH ⇌ RCOOR' + H₂O (H₂SO₄ đặc, t°)</p>
        <p><strong>Ví dụ:</strong></p>
        <p>CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O</p>
      </div>

      <h3>🍊 Ứng dụng</h3>
      <ul>
        <li>🍬 Công nghiệp thực phẩm (tạo hương liệu)</li>
        <li>🎨 Dung môi sơn, keo, véc-ni</li>
        <li>💄 Mỹ phẩm và nước hoa</li>
        <li>🧴 Chất dẻo (polyeste)</li>
      </ul>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Este có nhóm chức nào?",
        options: ["-OH", "-CHO", "-COO-", "-COOH"],
        correctAnswer: 2,
        explanation: "Este có nhóm chức -COO-"
      },
      {
        type: "true-false",
        question: "Este thường có mùi thơm dễ chịu",
        correctAnswer: true,
        explanation: "Đúng! Este thường có mùi thơm như hoa quả."
      },
      {
        type: "fill-in-blank",
        question: "Phản ứng giữa axit và ancol tạo este gọi là phản ứng _____",
        correctAnswer: "este hóa",
        explanation: "RCOOH + R'OH ⇌ RCOOR' + H₂O (phản ứng este hóa)"
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Phản ứng xà phòng hóa este cần môi trường gì?",
        options: ["Axit", "Bazơ", "Trung tính", "Muối"],
        correctAnswer: 1,
        explanation: "Phản ứng xà phòng hóa cần NaOH (bazơ): RCOOR' + NaOH → RCOONa + R'OH"
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Đun 12g CH₃COOH với C₂H₅OH dư, H₂SO₄ đặc. Khối lượng este thu được là 13.2g. Hiệu suất phản ứng là:",
        options: ["60%", "75%", "80%", "90%"],
        correctAnswer: 1,
        explanation: "nCH₃COOH = 12/60 = 0.2 mol. neste lý thuyết = 0.2 mol = 17.6g. H = 13.2/17.6 = 75%"
      }
    ]
  }
};
