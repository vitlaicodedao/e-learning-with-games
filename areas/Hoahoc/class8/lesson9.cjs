module.exports = {
  classId: 8,
  chapterId: 1, // Phải là chương 1
  lessonId: 9,
  title: "Bài 9: Bài luyện tập 1 - Hóa trị cơ bản",
  description: "Lập và cân bằng phương trình hóa học",
  level: "Intermediate",
  order: 9,
  theory: `
      <h2>⚗️ Phương trình hóa học là gì?</h2>
      <p><strong>Phương trình hóa học</strong> là cách biểu diễn ngắn gọn phản ứng hóa học bằng công thức hóa học.</p>
      
      <h3>� Cấu trúc phương trình hóa học</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p style="text-align: center; font-size: 18px;">
          <strong>Chất tham gia → Chất sản phẩm</strong>
        </p>
        <p><em>Ví dụ:</em> 2H₂ + O₂ → 2H₂O</p>
      </div>

      <h3>⚖️ Định luật bảo toàn khối lượng</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p><strong>Trong phản ứng hóa học:</strong></p>
        <p>Tổng khối lượng chất tham gia = Tổng khối lượng sản phẩm</p>
        <p>Số nguyên tử mỗi nguyên tố được bảo toàn</p>
      </div>

      <h3>🔧 Cách lập phương trình hóa học</h3>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4>Ví dụ: Hidro cháy trong oxi tạo nước</h4>
        <p><strong>Bước 1:</strong> Viết sơ đồ: H₂ + O₂ → H₂O</p>
        <p><strong>Bước 2:</strong> Cân bằng số nguyên tử:</p>
        <p>• Bên trái: 2H, 2O</p>
        <p>• Bên phải: 2H, 1O (chưa cân bằng)</p>
        <p><strong>Bước 3:</strong> Thêm hệ số: 2H₂ + O₂ → 2H₂O</p>
        <p><strong>Kiểm tra:</strong> Trái: 4H, 2O | Phải: 4H, 2O ✅</p>
      </div>

      <h3>💡 Ý nghĩa của hệ số</h3>
      <p>Trong phương trình 2H₂ + O₂ → 2H₂O:</p>
      <ul>
        <li>2 phân tử H₂ phản ứng với 1 phân tử O₂</li>
        <li>Tạo ra 2 phân tử H₂O</li>
      </ul>
    `,
  game: [
    {
      type: "multiple-choice",
      question: "Phương trình hóa học dùng để biểu diễn điều gì?",
      options: [
        "Công thức hóa học",
        "Phản ứng hóa học",
        "Nguyên tố hóa học",
        "Hóa trị"
      ],
      correctAnswer: 1,
      explanation: "✅ Phương trình hóa học biểu diễn phản ứng hóa học bằng công thức hóa học.",
      points: 10
    },
      {
        type: "true-false",
        question: "Trong phản ứng hóa học, tổng khối lượng chất tham gia bằng tổng khối lượng sản phẩm.",
        correctAnswer: true,
        explanation: "✅ Đúng! Đây là định luật bảo toàn khối lượng.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Trong phương trình 2H₂ + O₂ → 2H₂O, số 2 trước H₂ gọi là gì?",
        options: [
          "Chỉ số",
          "Hệ số",
          "Số hiệu",
          "Hóa trị"
        ],
        correctAnswer: 1,
        explanation: "✅ Số 2 trước H₂ là hệ số, cho biết số phân tử tham gia.",
        points: 10
      },
      {
        type: "true-false",
        question: "Phương trình hóa học phải cân bằng số nguyên tử mỗi nguyên tố.",
        correctAnswer: true,
        explanation: "✅ Đúng! Số nguyên tử mỗi nguyên tố phải bằng nhau ở 2 vế.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Phương trình nào đã được cân bằng?",
        options: [
          "H₂ + O₂ → H₂O",
          "2H₂ + O₂ → 2H₂O",
          "H₂ + O₂ → 2H₂O",
          "3H₂ + O₂ → 2H₂O"
        ],
        correctAnswer: 1,
        explanation: "✅ 2H₂ + O₂ → 2H₂O đã cân bằng: 4H, 2O ở cả 2 vế.",
        points: 10
      },
    {
        type: "matching",
        question: "🔗 Ghép phần tử phương trình với ý nghĩa",
        pairs: [
          { left: "Chất tham gia", right: "Chất ban đầu trước phản ứng" },
          { left: "Sản phẩm", right: "Chất tạo ra sau phản ứng" },
          { left: "Hệ số", right: "Số đứng trước công thức" },
          { left: "Mũi tên →", right: "Hướng phản ứng xảy ra" }
        ],
        explanation: "✅ Tuyệt vời! Bạn hiểu các thành phần của phương trình hóa học.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Trong phản ứng hóa học, số nguyên tử mỗi nguyên tố được ___.",
        correctAnswer: "bảo toàn",
        hint: "💡 Gợi ý: Không tăng, không giảm",
        explanation: "✅ Chính xác! Số nguyên tử được BẢO TOÀN theo định luật bảo toàn khối lượng.",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước lập phương trình hóa học",
        options: [
          "Viết sơ đồ phản ứng",
          "Cân bằng số nguyên tử",
          "Đặt hệ số thích hợp",
          "Kiểm tra lại"
        ],
        correctOrder: [
          "Viết sơ đồ phản ứng",
          "Cân bằng số nguyên tử",
          "Đặt hệ số thích hợp",
          "Kiểm tra lại"
        ],
        explanation: "✅ Đúng rồi! Đây là quy trình lập phương trình chuẩn.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Phương trình C + O₂ → CO₂ có cân bằng không?",
        options: [
          "Chưa cân bằng",
          "Đã cân bằng",
          "Thiếu thông tin",
          "Sai công thức"
        ],
        correctAnswer: 1,
        explanation: "✅ Đã cân bằng! Trái: 1C, 2O | Phải: 1C, 2O.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Cân bằng: Fe + O₂ → Fe₂O₃. Hệ số của Fe là ___",
        correctAnswer: "4",
        hint: "💡 4Fe + 3O₂ → 2Fe₂O₃",
        explanation: "✅ Đúng! Phương trình: 4Fe + 3O₂ → 2Fe₂O₃",
        points: 10
      },
    {
        type: "drag-drop",
        question: "🧩 Hoàn thành phương trình: ___ + 3O₂ → 2Fe₂O₃",
        inline: true,
        slots: [
          {
            id: 1,
            label: "Hệ số và công thức chất tham gia",
            correct: "4Fe"
          }
        ],
        options: ["2Fe", "3Fe", "4Fe", "Fe"],
        explanation: "✅ Hoàn hảo! 4Fe + 3O₂ → 2Fe₂O₃ (4Fe = 8Fe, 3O₂ = 6O cân bằng với 2Fe₂O₃)",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tìm phát biểu SAI về phương trình hóa học:",
        options: [
          "Hệ số cho biết số phân tử tham gia",
          "Có thể thay đổi chỉ số để cân bằng phương trình",
          "Số nguyên tử mỗi nguyên tố phải bằng nhau 2 vế",
          "Tổng khối lượng trước và sau phản ứng bằng nhau"
        ],
        correctAnswer: 1,
        explanation: "❌ SAI! KHÔNG được thay đổi chỉ số vì sẽ thay đổi bản chất chất. Chỉ thay đổi hệ số!",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Cân bằng: ___Al + ___O₂ → ___Al₂O₃. Tổng các hệ số là?",
        correctAnswer: "9",
        hint: "💡 4Al + 3O₂ → 2Al₂O₃ → Tổng = 4+3+2",
        explanation: "✅ Xuất sắc! 4Al + 3O₂ → 2Al₂O₃. Tổng hệ số: 4+3+2 = 9",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Ghép phương trình với loại phản ứng",
        pairs: [
          { left: "C + O₂ → CO₂", right: "Phản ứng cháy" },
          { left: "2H₂O → 2H₂ + O₂", right: "Phản ứng phân hủy" },
          { left: "Fe + CuSO₄ → FeSO₄ + Cu", right: "Phản ứng thế" },
          { left: "CaO + H₂O → Ca(OH)₂", right: "Phản ứng hóa hợp" }
        ],
        explanation: "✅ Tuyệt vời! Bạn phân loại được các loại phản ứng.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Cho phản ứng: aFe + bO₂ → cFe₃O₄. Tỉ lệ a:b:c đúng là:",
        options: [
          "2:3:1",
          "3:2:1",
          "3:4:2",
          "4:3:2"
        ],
        correctAnswer: 1,
        explanation: "✅ Chính xác! 3Fe + 2O₂ → Fe₃O₄. Tỉ lệ 3:2:1",
        points: 10
      }
  ]
};
