module.exports = {
  classId: 8,
  chapterId: 2, // Đổi từ 3 về 2
  lessonId: 15,
  title: "Bài 15: Định luật bảo toàn khối lượng",
  description: "Tìm hiểu định luật bảo toàn khối lượng trong phản ứng hóa học",
  level: "Beginner",
  order: 15,
  theory: `
      <h2>⚖️ Định luật bảo toàn khối lượng</h2>
      
      <h3>📚 Phát biểu</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p style="font-size: 18px; font-weight: bold; text-align: center;">
          "Trong một phản ứng hóa học, tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia phản ứng."
        </p>
        <p style="text-align: center; margin-top: 10px;">
          <strong>m<sub>sản phẩm</sub> = m<sub>chất tham gia</sub></strong>
        </p>
      </div>

      <h3>🔬 Thí nghiệm minh họa</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Thí nghiệm: Đốt cháy sắt trong bình kín</h4>
        <p><strong>Tiến hành:</strong></p>
        <p>1. Cân bình kín chứa bột sắt: m₁ = 100g</p>
        <p>2. Đốt nóng để sắt cháy trong oxi</p>
        <p>3. Để nguội và cân lại: m₂ = 100g</p>
        <p><strong>Kết luận:</strong> m₁ = m₂ → Khối lượng không đổi</p>
        <p><strong>Phương trình:</strong> 3Fe + 2O₂ → Fe₃O₄</p>
      </div>

      <h3>💡 Giải thích</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <p>Trong phản ứng hóa học:</p>
        <p>• Số nguyên tử mỗi nguyên tố <strong>không đổi</strong></p>
        <p>• Các nguyên tử chỉ <strong>sắp xếp lại</strong> thành chất mới</p>
        <p>• Do đó: Tổng khối lượng <strong>được bảo toàn</strong></p>
      </div>

      <h3>⚠️ Chú ý quan trọng</h3>
      <ul>
        <li>Định luật chỉ đúng trong <strong>hệ kín</strong> (không có chất thoát ra hoặc vào)</li>
        <li>Nếu có khí thoát ra → Khối lượng hệ thống <strong>giảm</strong></li>
        <li>Nếu có khí từ ngoài vào → Khối lượng hệ thống <strong>tăng</strong></li>
      </ul>
    `,
  game: [
{
        type: "multiple-choice",
        question: "Định luật bảo toàn khối lượng phát biểu như thế nào?",
        options: [
          "Khối lượng luôn tăng sau phản ứng",
          "Tổng khối lượng sản phẩm bằng tổng khối lượng chất tham gia",
          "Khối lượng luôn giảm sau phản ứng",
          "Khối lượng không liên quan đến phản ứng"
        ],
        correctAnswer: 1,
        explanation: "✅ Trong phản ứng hóa học: m<sub>sản phẩm</sub> = m<sub>chất tham gia</sub>",
        points: 10
      },
      {
        type: "true-false",
        question: "Trong phản ứng hóa học, số nguyên tử mỗi nguyên tố không đổi.",
        correctAnswer: true,
        explanation: "✅ Đúng! Các nguyên tử chỉ sắp xếp lại, không sinh ra hay mất đi.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Định luật bảo toàn khối lượng đúng trong điều kiện nào?",
        options: [
          "Bất kỳ điều kiện nào",
          "Chỉ trong hệ kín",
          "Chỉ khi có khí thoát ra",
          "Chỉ khi nhiệt độ cao"
        ],
        correctAnswer: 1,
        explanation: "✅ Định luật chỉ đúng trong HỆ KÍN (không có chất thoát ra hay vào).",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Công thức định luật bảo toàn khối lượng: m<sub>sản phẩm</sub> = m<sub>___</sub>",
        correctAnswer: "chất tham gia",
        hint: "💡 Các chất trước phản ứng",
        explanation: "✅ m<sub>sản phẩm</sub> = m<sub>chất tham gia</sub>",
        points: 10
      },
      {
        type: "true-false",
        question: "Nếu đốt cháy sắt trong không khí, khối lượng sản phẩm lớn hơn khối lượng sắt ban đầu.",
        correctAnswer: true,
        explanation: "✅ Đúng! Vì sắt kết hợp với oxi trong không khí tạo oxit sắt nặng hơn.",
        points: 10
      },
{
        type: "matching",
        question: "🔗 Ghép trường hợp với kết quả",
        pairs: [
          { left: "Phản ứng trong bình kín", right: "Khối lượng không đổi" },
          { left: "Có khí thoát ra ngoài", right: "Khối lượng giảm" },
          { left: "Có khí từ ngoài vào", right: "Khối lượng tăng" },
          { left: "Đốt Mg trong O₂ dư", right: "Khối lượng tăng" }
        ],
        explanation: "✅ Tuyệt vời! Bạn hiểu rõ các trường hợp áp dụng định luật.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Đốt 12g C trong oxi, thu được 44g CO₂. Khối lượng oxi đã phản ứng là ___ g.",
        correctAnswer: "32",
        hint: "💡 m<sub>O₂</sub> = m<sub>CO₂</sub> - m<sub>C</sub>",
        explanation: "✅ m<sub>O₂</sub> = 44 - 12 = 32g",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tại sao khối lượng giấy giảm khi đốt cháy trong không khí?",
        options: [
          "Vì giấy biến mất",
          "Vì có khí CO₂ và hơi nước thoát ra",
          "Vì định luật bảo toàn khối lượng sai",
          "Vì giấy bay đi"
        ],
        correctAnswer: 1,
        explanation: "✅ Khí CO₂ và hơi nước thoát ra ngoài nên khối lượng hệ thống giảm.",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước áp dụng định luật bảo toàn khối lượng",
        options: [
          "Xác định các chất tham gia",
          "Xác định các chất sản phẩm",
          "Tính tổng khối lượng chất tham gia",
          "Tính tổng khối lượng sản phẩm",
          "So sánh hai tổng khối lượng"
        ],
        correctOrder: [
          "Xác định các chất tham gia",
          "Xác định các chất sản phẩm",
          "Tính tổng khối lượng chất tham gia",
          "Tính tổng khối lượng sản phẩm",
          "So sánh hai tổng khối lượng"
        ],
        explanation: "✅ Đúng trình tự áp dụng định luật!",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Đốt 7g Fe trong oxi thu được 10g Fe₃O₄. Khối lượng O₂ đã dùng là ___ g.",
        correctAnswer: "3",
        hint: "💡 Dùng định luật bảo toàn khối lượng",
        explanation: "✅ m<sub>O₂</sub> = 10 - 7 = 3g",
        points: 10
      },
{
        type: "drag-drop",
        question: "🧩 Hoàn thành: Định luật bảo toàn khối lượng: Tổng ___ của các chất ___ bằng tổng ___ của các chất ___.",
        inline: true,
        slots: [
          { id: 1, label: "Đại lượng", correct: "khối lượng" },
          { id: 2, label: "Trước phản ứng", correct: "tham gia" },
          { id: 3, label: "Đại lượng", correct: "khối lượng" },
          { id: 4, label: "Sau phản ứng", correct: "sản phẩm" }
        ],
        options: ["khối lượng", "tham gia", "khối lượng", "sản phẩm"],
        explanation: "✅ Tổng KHỐI LƯỢNG các chất THAM GIA = Tổng KHỐI LƯỢNG các chất SẢN PHẨM.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Đốt 5,6g Fe trong bình kín chứa 2,4g O₂. Sau phản ứng thu được m gam Fe₃O₄ và còn dư Fe. Giá trị m là:",
        options: ["6,4g", "7,2g", "8,0g", "Không tính được"],
        correctAnswer: 2,
        explanation: "✅ m = 5,6 + 2,4 = 8,0g (bảo toàn khối lượng trong bình kín)",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Nung nóng 24,5g KClO₃ thu được 14,9g KCl và V lít O₂ (đktc). Khối lượng O₂ là ___ g. (Cho O=16)",
        correctAnswer: "9,6",
        hint: "💡 m<sub>O₂</sub> = m<sub>KClO₃</sub> - m<sub>KCl</sub>",
        explanation: "✅ m<sub>O₂</sub> = 24,5 - 14,9 = 9,6g",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Phân tích các trường hợp",
        pairs: [
          { left: "Đốt Mg trong bình kín chứa O₂", right: "Khối lượng hệ không đổi" },
          { left: "Đốt Mg ngoài không khí", right: "Khối lượng Mg tăng (hút O₂)" },
          { left: "Nung KClO₃ trong bình hở", right: "Khối lượng giảm (O₂ thoát ra)" },
          { left: "Nung CaCO₃ trong bình kín", right: "Khối lượng không đổi" }
        ],
        explanation: "✅ Xuất sắc! Bạn phân biệt được hệ kín và hệ hở.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Phát biểu nào SAI về định luật bảo toàn khối lượng?",
        options: [
          "Định luật đúng với mọi phản ứng hóa học",
          "Khối lượng luôn bằng nhau trong hệ kín",
          "Khối lượng hệ mở có thể thay đổi do khí thoát ra/vào",
          "Định luật chỉ đúng ở nhiệt độ thấp"
        ],
        correctAnswer: 3,
        explanation: "❌ SAI! Định luật đúng ở MỌI nhiệt độ, chỉ cần là hệ kín.",
        points: 10
      }

  ]
};
