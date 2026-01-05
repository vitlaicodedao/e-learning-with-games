module.exports = {
  classId: 8,
  chapterId: 2, // Đổi từ 3 về 2
  lessonId: 17,
  title: "Bài 17: Bài luyện tập 3 - Tổng hợp Chương 2",
  description: "Ôn tập và luyện tập về phản ứng hóa học, định luật bảo toàn khối lượng và phương trình hóa học",
  level: "Intermediate",
  order: 17,
  theory: `
      <h2>📝 Ôn tập Chương 2: Phản ứng Hóa học</h2>
      
      <h3>🔍 Tóm tắt kiến thức</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Phản ứng hóa học</h4>
        <p>• Là quá trình biến đổi chất này thành chất khác</p>
        <p>• Dấu hiệu: Có chất mới sinh ra</p>
        <p>• Có thể kèm theo: Đổi màu, tỏa nhiệt, phát sáng, có khí, kết tủa</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Định luật bảo toàn khối lượng</h4>
        <p style="text-align: center; font-size: 18px;">
          <strong>m<sub>sản phẩm</sub> = m<sub>chất tham gia</sub></strong>
        </p>
        <p>• Đúng trong hệ kín</p>
        <p>• Số nguyên tử mỗi nguyên tố không đổi</p>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>3. Phương trình hóa học</h4>
        <p><strong>Các bước lập:</strong></p>
        <p>① Viết sơ đồ phản ứng</p>
        <p>② Cân bằng số nguyên tử</p>
        <p>③ Viết phương trình hoàn chỉnh</p>
        <p><strong>Lưu ý:</strong> Chỉ đổi HỆ SỐ, không đổi CHỈ SỐ</p>
      </div>

      <h3>📊 Bảng tổng hợp</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Khái niệm</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Nội dung chính</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Phản ứng hóa học</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Biến đổi chất → Chất mới</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Định luật bảo toàn KL</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Tổng m trước = Tổng m sau</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Phương trình hóa học</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Biểu diễn phản ứng bằng CTHH</td>
        </tr>
      </table>
    `,
  game: [
{
        type: "multiple-choice",
        question: "Dấu hiệu nào chứng tỏ có phản ứng hóa học?",
        options: [
          "Nước đóng băng",
          "Đường tan trong nước",
          "Sắt bị gỉ",
          "Nước bay hơi"
        ],
        correctAnswer: 2,
        explanation: "✅ Sắt bị gỉ là phản ứng hóa học (có chất mới Fe₂O₃ sinh ra).",
        points: 10
      },
      {
        type: "true-false",
        question: "Định luật bảo toàn khối lượng đúng trong mọi điều kiện.",
        correctAnswer: false,
        explanation: "❌ Sai! Chỉ đúng trong HỆ KÍN.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Khi cân bằng phương trình, ta chỉ được thay đổi gì?",
        options: ["Chỉ số", "Hệ số", "Công thức", "Tên chất"],
        correctAnswer: 1,
        explanation: "✅ Chỉ được đổi HỆ SỐ, không đổi chỉ số trong công thức.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phản ứng hóa học là quá trình biến đổi chất này thành chất ___.",
        correctAnswer: "khác",
        hint: "💡 Tạo ra chất mới",
        explanation: "✅ Biến đổi chất này thành chất KHÁC (chất mới).",
        points: 10
      },
      {
        type: "true-false",
        question: "Phương trình 2H₂ + O₂ → 2H₂O tuân theo định luật bảo toàn khối lượng.",
        correctAnswer: true,
        explanation: "✅ Đúng! Số nguyên tử H và O bằng nhau 2 vế.",
        points: 10
      },
{
        type: "matching",
        question: "🔗 Ghép khái niệm với ví dụ",
        pairs: [
          { left: "Phản ứng hóa học", right: "Sắt cháy trong oxi" },
          { left: "Biến đổi vật lý", right: "Nước đóng băng" },
          { left: "Định luật bảo toàn KL", right: "m trước = m sau" },
          { left: "Phương trình hóa học", right: "2H₂ + O₂ → 2H₂O" }
        ],
        explanation: "✅ Tuyệt vời! Bạn phân biệt đúng các khái niệm.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Đốt 12g C trong oxi, thu được 44g CO₂. Khối lượng O₂ phản ứng là ___ g.",
        correctAnswer: "32",
        hint: "💡 Dùng định luật bảo toàn khối lượng",
        explanation: "✅ m(O₂) = 44 - 12 = 32g",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Phương trình nào cân bằng ĐÚNG?",
        options: [
          "Fe + O₂ → Fe₃O₄",
          "2Fe + O₂ → Fe₂O₃",
          "3Fe + 2O₂ → Fe₃O₄",
          "Fe + 2O₂ → FeO₂"
        ],
        correctAnswer: 2,
        explanation: "✅ 3Fe + 2O₂ → Fe₃O₄ (Fe: 3=3, O: 4=4)",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước giải bài toán bảo toàn khối lượng",
        options: [
          "Xác định các chất tham gia và sản phẩm",
          "Viết công thức tổng quát",
          "Thay số và tính toán",
          "Kiểm tra kết quả"
        ],
        correctOrder: [
          "Xác định các chất tham gia và sản phẩm",
          "Viết công thức tổng quát",
          "Thay số và tính toán",
          "Kiểm tra kết quả"
        ],
        explanation: "✅ Đúng trình tự giải bài!",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Cân bằng: ___ Al + ___ O₂ → 2Al₂O₃. Hệ số Al là ___.",
        correctAnswer: "4",
        hint: "💡 Al₂O₃ có 2 Al",
        explanation: "✅ 4Al + 3O₂ → 2Al₂O₃",
        points: 10
      },
{
        type: "drag-drop",
        question: "🧩 Hoàn thành: Trong phản ứng hóa học, số ___ mỗi nguyên tố ___, do đó tổng ___ được bảo toàn.",
        inline: true,
        slots: [
          { id: 1, label: "Đại lượng", correct: "nguyên tử" },
          { id: 2, label: "Trạng thái", correct: "không đổi" },
          { id: 3, label: "Kết quả", correct: "khối lượng" }
        ],
        options: ["nguyên tử", "không đổi", "khối lượng", "thay đổi"],
        explanation: "✅ Số NGUYÊN TỬ KHÔNG ĐỔI → Tổng KHỐI LƯỢNG bảo toàn.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Đốt 5,4g Al trong O₂ dư thu được m gam Al₂O₃. Giá trị m là: (Al=27, O=16)",
        options: ["8,1g", "10,2g", "15,3g", "20,4g"],
        correctAnswer: 1,
        explanation: "✅ n(Al)=5,4/27=0,2 mol → n(Al₂O₃)=0,1 mol → m=0,1×102=10,2g",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phương trình: C₂H₆ + ___ O₂ → 2CO₂ + 3H₂O. Hệ số O₂ là ___.",
        correctAnswer: "3,5",
        hint: "💡 Tổng O bên phải = 2×2 + 3 = 7",
        explanation: "✅ C₂H₆ + 3,5O₂ → 2CO₂ + 3H₂O (hoặc nhân 2: 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O)",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Phân tích phản ứng",
        pairs: [
          { left: "2Mg + O₂ → 2MgO", right: "Phản ứng hóa hợp" },
          { left: "2KClO₃ → 2KCl + 3O₂", right: "Phản ứng phân hủy" },
          { left: "Zn + 2HCl → ZnCl₂ + H₂", right: "Phản ứng thế" },
          { left: "CuO + H₂ → Cu + H₂O", right: "Phản ứng oxi hóa-khử" }
        ],
        explanation: "✅ Xuất sắc! Bạn phân loại đúng các phản ứng.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Cho phản ứng: aFe₃O₄ + bH₂ → cFe + dH₂O. Tỉ lệ a:b:c:d là:",
        options: ["1:4:3:4", "1:3:3:3", "2:8:6:8", "1:2:3:2"],
        correctAnswer: 0,
        explanation: "✅ Fe₃O₄ + 4H₂ → 3Fe + 4H₂O → 1:4:3:4",
        points: 10
      }

  ]
};
