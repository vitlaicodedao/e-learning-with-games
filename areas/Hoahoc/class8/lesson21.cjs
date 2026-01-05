module.exports = {
  classId: 8,
  chapterId: 3, // Phải là chương 3
  lessonId: 21,
  title: "Bài 21: Tính theo phương trình hóa học",
  description: "Khám phá thành phần hóa học, các tính chất vật lý và hóa học quan trọng của nước, cũng như vai trò không thể thiếu của nó.",
  level: "Beginner",
  order: 21,
  theory: `
    <h2>💧 Bài 21: Nước - Hợp chất quen thuộc</h2>
    <p>Nước là một trong những hợp chất quan trọng nhất trên Trái Đất, bao phủ khoảng 71% bề mặt hành tinh. Bài học này sẽ giúp chúng ta hiểu rõ hơn về nước.</p>
    
    <h3>I. Thành phần hóa học của Nước</h3>
    
    <h4>1. Sự phân hủy nước</h4>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p>Khi cho dòng điện một chiều đi qua nước, trên bề mặt hai điện cực, ta sẽ thu được khí hiđro và khí oxi.</p>
      <p><strong>Phương trình hóa học:</strong></p>
      <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #fffbeb;">
        2H₂O --(điện phân)--> 2H₂↑ + O₂↑
      </div>
      <p><strong>Kết luận:</strong> Nước được tạo thành từ hai nguyên tố là Hiđro (H) và Oxi (O).</p>
    </div>

    <h4>2. Sự tổng hợp nước</h4>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p>Nếu đốt hỗn hợp khí hiđro và oxi theo đúng tỉ lệ thể tích 2:1, chúng sẽ phản ứng hết và tạo thành nước.</p>
      <p><strong>Phương trình hóa học:</strong></p>
      <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #fffbeb;">
        2H₂ + O₂ --(t°)--> 2H₂O
      </div>
      <p><strong>Kết luận về thành phần hóa học:</strong></p>
      <ul>
        <li>Về khối lượng: 2 phần H và 16 phần O. Tỉ lệ mH : mO = 1 : 8.</li>
        <li><strong>Công thức hóa học của nước là H₂O.</strong></li>
      </ul>
    </div>

    <h3>II. Tính chất của Nước</h3>

    <h4>1. Tính chất vật lí</h4>
    <ul style="list-style-type: disc; padding-left: 20px;">
      <li><strong>Trạng thái:</strong> Nước là chất lỏng, không màu, không mùi, không vị.</li>
      <li><strong>Nhiệt độ sôi:</strong> 100°C (ở áp suất 1 atm).</li>
      <li><strong>Nhiệt độ đông đặc:</strong> 0°C, tạo thành nước đá.</li>
      <li><strong>Khối lượng riêng:</strong> Ở 4°C, D = 1 g/ml.</li>
      <li><strong>Tính tan:</strong> Nước có thể hòa tan được nhiều chất rắn (muối, đường), lỏng (cồn), và khí (amoniac). Nước là dung môi phổ biến nhất.</li>
    </ul>

    <h4>2. Tính chất hóa học</h4>
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p>Nước có thể tác dụng với nhiều chất hóa học:</p>
      <p><strong>a. Tác dụng với kim loại:</strong> Ở nhiệt độ thường, nước tác dụng với một số kim loại như Na, K, Ca, Ba...</p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">
        2Na + 2H₂O → 2NaOH + H₂↑
      </div>
      <p><strong>b. Tác dụng với oxit bazơ:</strong> Tác dụng với các oxit bazơ tan (Na₂O, K₂O, CaO...) tạo ra dung dịch bazơ (kiềm).</p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">
        CaO + H₂O → Ca(OH)₂
      </div>
      <p><strong>c. Tác dụng với oxit axit:</strong> Tác dụng với nhiều oxit axit (SO₃, P₂O₅...) tạo ra axit tương ứng.</p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">
        P₂O₅ + 3H₂O → 2H₃PO₄
      </div>
    </div>

    <h3>III. Vai trò của Nước</h3>
    <p>Nước có vai trò cực kỳ quan trọng trong đời sống và sản xuất. Nó cần thiết cho sự sống của mọi sinh vật, tham gia vào nhiều quá trình sản xuất công nghiệp, nông nghiệp và là một phần không thể thiếu trong sinh hoạt hàng ngày.</p>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Công thức hóa học của nước là gì?",
    options: [
      "HO",
      "H₂O",
      "HO₂",
      "H₂O₂"
    ],
    correctAnswer: 1,
    explanation: "✅ Nước được cấu tạo từ 2 nguyên tử Hiđro và 1 nguyên tử Oxi, nên công thức là H₂O.",
    points: 10
  },
  {
    type: "true-false",
    question: "Nước sôi ở 100°C và đông đặc ở 4°C.",
    correctAnswer: false,
    explanation: "❌ Sai, nước sôi ở 100°C và đông đặc ở 0°C.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Khi điện phân nước, ta thu được hai khí nào?",
    options: [
      "Hiđro và Nitơ",
      "Oxi và Cacbonic",
      "Hiđro và Oxi",
      "Hiđro và Clo"
    ],
    correctAnswer: 2,
    explanation: "✅ 2H₂O --(điện phân)--> 2H₂↑ + O₂↑.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nước có thể hòa tan được nhiều chất nên được gọi là ___ phổ biến.",
    correctAnswer: "dung môi",
    explanation: "✅ Dung môi là chất có khả năng hòa tan chất khác để tạo thành dung dịch.",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng giữa CaO và H₂O tạo ra một bazơ.",
    correctAnswer: true,
    explanation: "✅ CaO (oxit bazơ) + H₂O → Ca(OH)₂ (bazơ).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Sản phẩm của phản ứng giữa Natri (Na) và nước là:",
    options: [
      "NaOH và O₂",
      "Na₂O và H₂",
      "NaOH và H₂",
      "Không phản ứng"
    ],
    correctAnswer: 2,
    explanation: "✅ 2Na + 2H₂O → 2NaOH + H₂. Phản ứng tỏa nhiều nhiệt và giải phóng khí hiđro.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép chất phản ứng với nước và sản phẩm tạo thành.",
    pairs: [
      {
        left: "Na",
        right: "Bazơ + Khí H₂"
      },
      {
        left: "P₂O₅",
        right: "Axit"
      },
      {
        left: "CaO",
        right: "Bazơ"
      }
    ],
    explanation: "✅ Nước tác dụng với kim loại kiềm tạo bazơ và H₂, với oxit axit tạo axit, với oxit bazơ tan tạo bazơ.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các chất sau theo khả năng tan trong nước giảm dần.",
    options: [
      "Muối ăn (NaCl)",
      "Cát (SiO₂)",
      "Đường (C₁₂H₂₂O₁₁)",
      "Dầu ăn"
    ],
    correctOrder: [
      "Muối ăn (NaCl)",
      "Đường (C₁₂H₂₂O₁₁)",
      "Dầu ăn",
      "Cát (SiO₂)"
    ],
    explanation: "✅ Muối và đường tan tốt, dầu ăn không tan và nổi lên trên, cát không tan và chìm xuống.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành phương trình: P₂O₅ + 3H₂O → ?",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Sản phẩm",
        correct: "2H₃PO₄"
      }
    ],
    options: [
      "2H₃PO₄",
      "H₂PO₄",
      "2H₃P",
      "P(OH)₅"
    ],
    explanation: "✅ Oxit axit P₂O₅ tác dụng với nước tạo ra axit tương ứng là axit photphoric (H₃PO₄).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tỉ lệ thể tích khí H₂ và O₂ thu được khi điện phân nước là bao nhiêu?",
    options: [
      "1:1",
      "1:2",
      "2:1",
      "2:2"
    ],
    correctAnswer: 2,
    explanation: "✅ Từ phương trình 2H₂O → 2H₂ + O₂, tỉ lệ thể tích H₂ : O₂ là 2:1.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hòa tan 20g NaOH vào 80g nước. Nồng độ phần trăm của dung dịch thu được là:",
    options: [
      "20%",
      "25%",
      "10%",
      "80%"
    ],
    correctAnswer: 0,
    explanation: "✅ mdd = mct + mdm = 20 + 80 = 100g. C% = (mct / mdd) * 100% = (20 / 100) * 100% = 20%.",
    points: 10
  },
  {
    type: "true-false",
    question: "Nước đá (thể rắn) có khối lượng riêng lớn hơn nước lỏng.",
    correctAnswer: false,
    explanation: "❌ Sai. Nước đá có cấu trúc rỗng hơn nên khối lượng riêng nhỏ hơn nước lỏng, đó là lý do tại sao nước đá nổi trên mặt nước.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Dãy chất nào sau đây chỉ gồm các chất tác dụng được với nước ở điều kiện thường?",
    options: [
      "Na, CaO, SO₃",
      "Cu, SO₂, MgO",
      "K, Fe₂O₃, CO₂",
      "Fe, BaO, N₂O₅"
    ],
    correctAnswer: 0,
    explanation: "✅ Na, CaO, SO₃ đều phản ứng dễ dàng với nước ở điều kiện thường.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Hệ thống hai lớp chất lỏng gồm nước và dầu ăn, trong đó ___ sẽ nổi lên trên.",
    correctAnswer: "dầu ăn",
    hint: "💡 So sánh khối lượng riêng của dầu ăn và nước.",
    explanation: "✅ Dầu ăn nhẹ hơn nước (có khối lượng riêng nhỏ hơn) và không tan trong nước nên sẽ nổi lên trên.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Để phân hủy hoàn toàn 18g nước bằng phương pháp điện phân, cần bao nhiêu mol electron trao đổi?",
    options: [
      "0.5 mol",
      "1 mol",
      "2 mol",
      "4 mol"
    ],
    correctAnswer: 2,
    explanation: "✅ nH₂O = 18/18 = 1 mol. Quá trình oxi hóa: 2H₂O → O₂ + 4H⁺ + 4e. Quá trình khử: 2H₂O + 2e → H₂ + 2OH⁻. Tổng quát: 2H₂O → 2H₂ + O₂. Cứ 2 mol H₂O cần 4 mol e. Vậy 1 mol H₂O cần 2 mol e.",
    points: 10
  }
]
};
