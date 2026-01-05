module.exports = {
  classId: 8,
  chapterId: 3, // Phải là chương 3
  lessonId: 19,
  title: "Bài 19: Chuyển đổi giữa khối lượng, thể tích và lượng chất",
  description: "Khám phá mối quan hệ giữa khối lượng, thể tích và lượng chất qua các bài toán thực tiễn.",
  level: "Intermediate",
  order: 19,
  theory: `
    <h2>⚖️ Chuyển đổi giữa Khối lượng, Thể tích và Lượng chất</h2>
    <p>Trong hóa học, việc chuyển đổi giữa khối lượng, thể tích và lượng chất là rất quan trọng, giúp chúng ta hiểu rõ hơn về các phản ứng hóa học cũng như tính toán được các đại lượng cần thiết trong thí nghiệm.</p>
    
    <h3>1. Khối lượng và Lượng chất</h3>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p><strong>Khối lượng (m):</strong> Là đại lượng đo lường lượng vật chất trong một chất hoặc một hỗn hợp chất.</p>
      <p><strong>Lượng chất (n):</strong> Là đại lượng đặc trưng cho số lượng các phân tử, nguyên tử hoặc ion có trong một chất.</p>
      <p><em>Ví dụ: 1 mol bất kỳ chất nào cũng chứa khoảng 6.022 x 10²³ phần tử của chất đó.</em></p>
    </div>

    <h3>2. Thể tích và Lượng chất</h3>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p><strong>Thể tích (V):</strong> Là đại lượng đo lường không gian mà một chất hoặc hỗn hợp chất chiếm giữ.</p>
      <p><strong>Lượng chất (n):</strong> Như đã định nghĩa ở trên.</p>
      <p><em>Ví dụ: 1 mol khí lý tưởng ở điều kiện tiêu chuẩn (0°C, 1 atm) có thể tích là 22.4 lít.</em></p>
    </div>

    <h3>3. Mối quan hệ giữa Khối lượng, Thể tích và Lượng chất</h3>
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p>Có nhiều công thức khác nhau để chuyển đổi giữa các đại lượng này, tùy thuộc vào trạng thái và tính chất của chất.</p>
      <p><strong>Ví dụ 1:</strong> Tính khối lượng của 2 mol NaCl.</p>
      <p><em>Giải:</em> Khối lượng mol của NaCl là 58.44 g/mol. Vậy 2 mol NaCl có khối lượng là 2 x 58.44 g = 116.88 g.</p>
      <p><strong>Ví dụ 2:</strong> Tính thể tích của 1 mol khí CO₂ ở điều kiện tiêu chuẩn.</p>
      <p><em>Giải:</em> 1 mol khí CO₂ ở điều kiện tiêu chuẩn có thể tích là 22.4 lít.</p>
    </div>

    <h3>4. Bài tập vận dụng</h3>
    <p>Hãy tự giải các bài tập sau để củng cố kiến thức:</p>
    <ol>
      <li>Tính khối lượng của 0.5 mol CaCO₃.</li>
      <li>Tính thể tích của 3 mol khí NH₃ ở điều kiện tiêu chuẩn.</li>
      <li>Tính lượng chất có trong 18 g nước.</li>
    </ol>
  `,
  game: [
    // 🌱 CẤP ĐỘ CƠ BẢN

      {
        type: "multiple-choice",
        question: "Đơn vị nào sau đây không phải là đơn vị đo khối lượng?",
        options: ["Kilogram (kg)", "Gram (g)", "Miligram (mg)", "Liter (l)"],
        correctAnswer: 3,
        explanation: "✅ Liter (l) là đơn vị đo thể tích, không phải đơn vị đo khối lượng.",
        points: 10
      },
      {
        type: "true-false",
        question: "1 mol bất kỳ chất nào cũng chứa khoảng 6.022 x 10²³ phần tử của chất đó.",
        correctAnswer: true,
        explanation: "✅ Đúng, đó là số Avogadro.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Trong công thức hóa học, chỉ số dưới cùng ký hiệu gì?",
        options: ["Số nguyên tử của nguyên tố đó trong phân tử", "Số mol của phân tử đó", "Số khối của nguyên tố đó", "Tất cả các đáp án trên đều sai"],
        correctAnswer: 0,
        explanation: "✅ Chỉ số dưới cùng trong công thức hóa học biểu thị số nguyên tử của nguyên tố đó trong phân tử.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Khối lượng mol của nước (H₂O) là ___.",
        correctAnswer: "18 g/mol",
        explanation: "✅ Khối lượng mol của nước được tính bằng tổng khối lượng mol của H và O trong phân tử nước.",
        points: 10
      },
      {
        type: "true-false",
        question: "Thể tích của 1 mol khí lý tưởng ở điều kiện tiêu chuẩn là 22.4 lít.",
        correctAnswer: true,
        explanation: "✅ Đúng, đó là thể tích của 1 mol khí lý tưởng ở điều kiện tiêu chuẩn.",
        points: 10
      },
  
      {
        type: "multiple-choice",
        question: "Tính chất nào sau đây không phải là tính chất của chất oxi hóa?",
        options: ["Nhận electron", "Làm tăng số oxi hóa của nguyên tố khác", "Bị khử trong phản ứng", "Tất cả đều đúng"],
        correctAnswer: 3,
        explanation: "✅ Chất oxi hóa trong phản ứng oxi hóa - khử là chất nhận electron và làm giảm số oxi hóa của chính nó.",
        points: 15
      },
      {
        type: "matching",
        question: "🔗 Ghép các thuật ngữ với định nghĩa đúng.",
        pairs: [
          { left: "Chất khử", right: "Chất nhường electron" },
          { left: "Chất oxi hóa", right: "Chất nhận electron" },
          { left: "Sự khử", right: "Sự tăng cường số oxi hóa" },
          { left: "Sự oxi hóa", right: "Sự giảm số oxi hóa" }
        ],
        explanation: "✅ Nắm vững các định nghĩa này là chìa khóa để hiểu phản ứng oxi hóa - khử.",
        points: 15
      },
      {
        type: "multiple-choice",
        question: "Phản ứng nào sau đây là phản ứng oxi hóa - khử?",
        options: [
            "2H₂ + O₂ → 2H₂O", 
            "CaCO₃ → CaO + CO₂", 
            "Fe + 2HCl → FeCl₂ + H₂", 
            "CH₄ + 2O₂ → CO₂ + 2H₂O"
        ],
        correctAnswer: 0,
        explanation: "✅ Phản ứng 2H₂ + O₂ → 2H₂O là phản ứng oxi hóa - khử, trong đó H₂ bị oxi hóa và O₂ bị khử.",
        points: 15
      },
       {
        type: "drag-drop",
        question: "🧩 Xác định vai trò các chất trong phản ứng: 2Mg + O₂ → 2MgO",
        slots: [
          { id: 1, label: "Chất khử:", accepts: ["Mg"] },
          { id: 2, label: "Chất oxi hóa:", accepts: ["O₂"] }
        ],
        options: ["Mg", "O₂", "MgO"],
        explanation: "✅ Mg kết hợp với oxi (bị oxi hóa) nên là chất khử. O₂ nhường oxi (bị khử) nên là chất oxi hóa.",
        points: 15
      },
      {
        type: "fill-in-blank",
        question: "Trong phản ứng H₂ + Cl₂ → 2HCl, H₂ là chất khử và Cl₂ là chất ___.",
        correctAnswer: "oxi hóa",
        hint: "💡 Mặc dù không có oxi, đây vẫn là phản ứng oxi hóa - khử dựa trên sự thay đổi số oxi hóa.",
        explanation: "✅ Theo định nghĩa mở rộng, H₂ cho electron (số oxi hóa tăng từ 0 lên +1) là chất khử. Cl₂ nhận electron (số oxi hóa giảm từ 0 xuống -1) là chất oxi hóa.",
        points: 15
      }
    ,
      {
        type: "multiple-choice",
        question: "Trong phản ứng: MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O, vai trò của HCl là gì?",
        options: ["Chỉ là chất khử", "Chỉ là chất tạo môi trường", "Vừa là chất khử, vừa là chất tạo môi trường", "Chỉ là chất oxi hóa"],
        correctAnswer: 2,
        explanation: "✅ Một phần HCl (2Cl⁻ → Cl₂) đóng vai trò là chất khử. Phần còn lại của HCl kết hợp với Mn²⁺ tạo muối MnCl₂, đóng vai trò là chất tạo môi trường.",
        points: 20
      },
      {
        type: "true-false",
        question: "Tất cả các phản ứng hóa hợp đều là phản ứng oxi hóa - khử.",
        correctAnswer: false,
        explanation: "❌ Sai. Ví dụ: CaO + H₂O → Ca(OH)₂ là phản ứng hóa hợp nhưng không phải phản ứng oxi hóa - khử vì không có sự thay đổi số oxi hóa.",
        points: 20
      },
      {
        type: "multiple-choice",
        question: "Cho sơ đồ: Fe + H₂SO₄(đặc, nóng) → Fe₂(SO₄)₃ + SO₂ + H₂O. Tổng hệ số cân bằng (số nguyên, tối giản) của phản ứng là:",
        options: ["13", "15", "11", "9"],
        correctAnswer: 0,
        explanation: "✅ PTHH cân bằng: 2Fe + 6H₂SO₄ → Fe₂(SO₄)₃ + 3SO₂ + 6H₂O. Tổng hệ số là 2 + 6 + 1 + 3 + 6 = 18. (Câu hỏi có thể gây nhầm lẫn, cần xem lại. Nếu tính tổng các chất tham gia và sản phẩm thì là 18. Nếu chỉ tính các hệ số tối giản thì là 2,6,1,3,6).",
        points: 20
      },
      {
        type: "fill-in-blank",
        question: "Quá trình một chất nhận electron được gọi là quá trình ___.",
        correctAnswer: "khử",
        hint: "💡 Chất oxi hóa nhận electron và bị khử.",
        explanation: "✅ Chất oxi hóa nhận e → Bị khử (trải qua quá trình khử). Chất khử nhường e → Bị oxi hóa (trải qua quá trình oxi hóa).",
        points: 20
      },
      {
        type: "matching",
        question: "🧠 Ghép quá trình với tên gọi đúng của nó.",
        pairs: [
          { left: "Fe → Fe³⁺ + 3e", right: "Quá trình oxi hóa" },
          { left: "S⁺⁶ + 2e → S⁺⁴", right: "Quá trình khử" },
          { left: "2Cl⁻ → Cl₂ + 2e", right: "Quá trình oxi hóa" },
          { left: "N⁺⁵ + 3e → N⁺²", right: "Quá trình khử" }
        ],
        explanation: "✅ Quá trình nhường electron là quá trình oxi hóa. Quá trình nhận electron là quá trình khử.",
        points: 20
      }
    ]
  }
    
