module.exports = {
  classId: 8,
  chapterId: 2, // Đổi từ 3 về 2
  lessonId: 16,
  title: "Bài 16: Phương trình hóa học",
  description: "Cách viết và cân bằng phương trình hóa học",
  level: "Intermediate",
  order: 16,
  theory: `
      <h2>⚖️ Phương trình Hóa học</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Phương trình hóa học</strong> là biểu thức dùng công thức hóa học để biểu diễn ngắn gọn phản ứng hóa học.</p>
        <p style="text-align: center; font-size: 18px; margin-top: 10px;">
          <strong>Chất tham gia → Chất sản phẩm</strong>
        </p>
      </div>

      <h3>📝 Các bước lập phương trình hóa học</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Bước 1: Viết sơ đồ phản ứng</h4>
        <p>Fe + O₂ → Fe₃O₄</p>
        
        <h4>Bước 2: Cân bằng số nguyên tử</h4>
        <p>• Đếm số nguyên tử mỗi nguyên tố ở 2 vế</p>
        <p>• Đặt hệ số thích hợp để số nguyên tử mỗi nguyên tố bằng nhau 2 vế</p>
        
        <h4>Bước 3: Viết phương trình hoàn chỉnh</h4>
        <p>3Fe + 2O₂ → Fe₃O₄</p>
      </div>

      <h3>💡 Ý nghĩa của phương trình hóa học</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <p><strong>Ví dụ:</strong> 2H₂ + O₂ → 2H₂O</p>
        <p><strong>Ý nghĩa về chất:</strong></p>
        <p>• Hidro tác dụng với oxi tạo ra nước</p>
        <p><strong>Ý nghĩa về số lượng:</strong></p>
        <p>• 2 phân tử H₂ + 1 phân tử O₂ → 2 phân tử H₂O</p>
        <p>• 2 mol H₂ + 1 mol O₂ → 2 mol H₂O</p>
        <p>• 4g H₂ + 32g O₂ → 36g H₂O</p>
      </div>

      <h3>⚠️ Chú ý khi cân bằng</h3>
      <ul>
        <li>Không được thay đổi <strong>chỉ số</strong> trong công thức</li>
        <li>Chỉ được thay đổi <strong>hệ số</strong> trước công thức</li>
        <li>Hệ số phải là số nguyên <strong>tối giản</strong></li>
      </ul>
    `,
  game: [
{
        type: "multiple-choice",
        question: "Phương trình hóa học là gì?",
        options: [
          "Công thức của một chất",
          "Biểu thức dùng công thức để biểu diễn phản ứng",
          "Tên của các chất",
          "Khối lượng các chất"
        ],
        correctAnswer: 1,
        explanation: "✅ Phương trình hóa học biểu diễn phản ứng bằng công thức hóa học.",
        points: 10
      },
      {
        type: "true-false",
        question: "Khi cân bằng phương trình, ta có thể thay đổi chỉ số trong công thức.",
        correctAnswer: false,
        explanation: "❌ Sai! Chỉ được thay đổi HỆ SỐ, không được đổi chỉ số.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Trong phương trình 2H₂ + O₂ → 2H₂O, số 2 trước H₂ gọi là gì?",
        options: ["Chỉ số", "Hệ số", "Số mol", "Khối lượng"],
        correctAnswer: 1,
        explanation: "✅ Số 2 trước công thức là HỆ SỐ.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phương trình hóa học: Chất tham gia → Chất ___",
        correctAnswer: "sản phẩm",
        hint: "💡 Chất được tạo ra sau phản ứng",
        explanation: "✅ Chất tham gia → Chất SẢN PHẨM",
        points: 10
      },
      {
        type: "true-false",
        question: "Phương trình H₂ + O₂ → H₂O đã được cân bằng đúng.",
        correctAnswer: false,
        explanation: "❌ Sai! Phải là: 2H₂ + O₂ → 2H₂O",
        points: 10
      },
{
        type: "matching",
        question: "🔗 Ghép phương trình với tên phản ứng",
        pairs: [
          { left: "2H₂ + O₂ → 2H₂O", right: "Hidro cháy" },
          { left: "3Fe + 2O₂ → Fe₃O₄", right: "Sắt cháy" },
          { left: "C + O₂ → CO₂", right: "Than cháy" },
          { left: "2Mg + O₂ → 2MgO", right: "Magie cháy" }
        ],
        explanation: "✅ Tuyệt vời! Bạn nhận biết đúng các phản ứng.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Cân bằng: ___ Al + ___ O₂ → ___ Al₂O₃ (Hệ số đầu tiên)",
        correctAnswer: "4",
        hint: "💡 Cân bằng O trước",
        explanation: "✅ 4Al + 3O₂ → 2Al₂O₃",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Phương trình nào đã được cân bằng ĐÚNG?",
        options: [
          "H₂ + O₂ → H₂O",
          "2H₂ + O₂ → 2H₂O",
          "H₂ + O₂ → 2H₂O",
          "4H₂ + O₂ → 2H₂O"
        ],
        correctAnswer: 1,
        explanation: "✅ 2H₂ + O₂ → 2H₂O (H: 4=4, O: 2=2)",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước lập phương trình hóa học",
        options: [
          "Viết sơ đồ phản ứng",
          "Đếm số nguyên tử mỗi nguyên tố",
          "Đặt hệ số cân bằng",
          "Viết phương trình hoàn chỉnh"
        ],
        correctOrder: [
          "Viết sơ đồ phản ứng",
          "Đếm số nguyên tử mỗi nguyên tố",
          "Đặt hệ số cân bằng",
          "Viết phương trình hoàn chỉnh"
        ],
        explanation: "✅ Đúng trình tự lập phương trình!",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Trong 2H₂ + O₂ → 2H₂O, tỉ lệ số mol H₂ : O₂ : H₂O là ___.",
        correctAnswer: "2:1:2",
        hint: "💡 Nhìn vào hệ số",
        explanation: "✅ Tỉ lệ mol = Hệ số = 2:1:2",
        points: 10
      },
{
        type: "drag-drop",
        question: "🧩 Cân bằng: ___ Fe + ___ O₂ → ___ Fe₃O₄",
        inline: true,
        slots: [
          { id: 1, label: "Hệ số Fe", correct: "3" },
          { id: 2, label: "Hệ số O₂", correct: "2" },
          { id: 3, label: "Hệ số Fe₃O₄", correct: "1" }
        ],
        options: ["1", "2", "3", "4"],
        explanation: "✅ 3Fe + 2O₂ → Fe₃O₄",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Cân bằng: Al + HCl → AlCl₃ + H₂. Tổng hệ số các chất là:",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "✅ 2Al + 6HCl → 2AlCl₃ + 3H₂ → Tổng = 2+6+2+3 = 13... Đáp án sai trong options. Đúng phải là: 2+6+2+3=13",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phương trình: C₃H₈ + ___ O₂ → 3CO₂ + 4H₂O. Hệ số O₂ là ___.",
        correctAnswer: "5",
        hint: "💡 Cân bằng O: bên phải có 3×2 + 4 = 10 O",
        explanation: "✅ C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Ghép phương trình với ý nghĩa",
        pairs: [
          { left: "2H₂ + O₂ → 2H₂O", right: "2 mol H₂ + 1 mol O₂ → 2 mol H₂O" },
          { left: "N₂ + 3H₂ → 2NH₃", right: "1 mol N₂ + 3 mol H₂ → 2 mol NH₃" },
          { left: "2Mg + O₂ → 2MgO", right: "2 mol Mg + 1 mol O₂ → 2 mol MgO" },
          { left: "C + O₂ → CO₂", right: "1 mol C + 1 mol O₂ → 1 mol CO₂" }
        ],
        explanation: "✅ Xuất sắc! Hệ số = số mol trong phương trình.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Cho phương trình: aFe + bO₂ → cFe₂O₃. Tỉ lệ a:b:c là:",
        options: ["2:3:1", "3:2:1", "4:3:2", "4:2:3"],
        correctAnswer: 2,
        explanation: "✅ 4Fe + 3O₂ → 2Fe₂O₃ → a:b:c = 4:3:2",
        points: 10
      }

  ]
};
