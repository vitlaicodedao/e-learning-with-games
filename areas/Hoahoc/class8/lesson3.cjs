module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 3,
  title: "Bài 3: Bài thực hành 1 - Quan sát và phân biệt chất",
  description: "Thực hành quan sát và phân biệt các chất khác nhau",
  level: "Beginner",
  order: 3,
  theory: `
      <h2>🔬 Thực hành: Quan sát và phân biệt chất</h2>
      
      <h3>🎯 Mục tiêu</h3>
      <ul>
        <li>Quan sát và mô tả tính chất vật lý của các chất</li>
        <li>Phân biệt chất tinh khiết và hỗn hợp</li>
        <li>Rèn luyện kỹ năng quan sát và ghi chép</li>
      </ul>

      <h3>🧪 Dụng cụ và hóa chất</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Dụng cụ:</strong></p>
        <p>• Ống nghiệm, kẹp gỗ</p>
        <p>• Nam châm</p>
        <p>• Đèn cồn</p>
        
        <p><strong>Hóa chất:</strong></p>
        <p>• Muối ăn (NaCl)</p>
        <p>• Bột sắt (Fe)</p>
        <p>• Lưu huỳnh (S)</p>
        <p>• Nước cất</p>
      </div>

      <h3>📋 Các bước tiến hành</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Thí nghiệm 1: Quan sát các chất</h4>
        <p>1. Quan sát màu sắc của từng chất</p>
        <p>2. Ghi chép trạng thái (rắn, lỏng, khí)</p>
        <p>3. Mô tả đặc điểm riêng biệt</p>
        
        <h4>Thí nghiệm 2: Phân biệt bằng nam châm</h4>
        <p>1. Đưa nam châm lại gần từng chất</p>
        <p>2. Quan sát chất nào bị hút</p>
        <p>3. Kết luận: Sắt bị nam châm hút, các chất khác không</p>
      </div>

      <h3>⚠️ An toàn</h3>
      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <p>👓 Đeo kính bảo hộ</p>
        <p>🧤 Không chạm tay vào hóa chất</p>
        <p>🔥 Cẩn thận khi dùng đèn cồn</p>
      </div>
    `,
  game: [
    {
      type: "multiple-choice",
      question: "Mục đích của bài thực hành là gì?",
      options: [
        "Chơi với hóa chất",
        "Quan sát và phân biệt các chất",
        "Làm phép màu",
        "Không có mục đích"
      ],
      correctAnswer: 1,
      explanation: "✅ Mục đích là quan sát và phân biệt các chất khác nhau.",
      points: 10
    },
      {
        type: "true-false",
        question: "Sắt có thể bị nam châm hút.",
        correctAnswer: true,
        explanation: "✅ Đúng! Sắt là chất có tính từ, bị nam châm hút.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Trong thí nghiệm, ta phải đeo gì để bảo vệ mắt?",
        options: ["Mũ", "Kính bảo hộ", "Găng tay", "Áo choàng"],
        correctAnswer: 1,
        explanation: "✅ Phải đeo kính bảo hộ để bảo vệ mắt.",
        points: 10
      },
      {
        type: "true-false",
        question: "Có thể dùng tay để chạm vào hóa chất.",
        correctAnswer: false,
        explanation: "❌ Sai! Không được chạm tay vào hóa chất.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Chất nào bị nam châm hút?",
        options: ["Muối ăn", "Lưu huỳnh", "Sắt", "Nước"],
        correctAnswer: 2,
        explanation: "✅ Sắt bị nam châm hút.",
        points: 10
      },
    {
        type: "matching",
        question: "🔗 Ghép chất với tính chất",
        pairs: [
          { left: "Sắt", right: "Bị nam châm hút" },
          { left: "Muối ăn", right: "Màu trắng, tan trong nước" },
          { left: "Lưu huỳnh", right: "Màu vàng" },
          { left: "Nước cất", right: "Trong suốt, không màu" }
        ],
        explanation: "✅ Tuyệt vời! Bạn phân biệt đúng các chất.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Để phân biệt sắt với các chất khác, ta dùng ___.",
        correctAnswer: "nam châm",
        hint: "💡 Dụng cụ có tính từ",
        explanation: "✅ Dùng NAM CHÂM để phân biệt sắt.",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước thí nghiệm",
        options: [
          "Chuẩn bị dụng cụ và hóa chất",
          "Quan sát màu sắc và trạng thái",
          "Thử nghiệm với nam châm",
          "Ghi chép kết quả"
        ],
        correctOrder: [
          "Chuẩn bị dụng cụ và hóa chất",
          "Quan sát màu sắc và trạng thái",
          "Thử nghiệm với nam châm",
          "Ghi chép kết quả"
        ],
        explanation: "✅ Đúng trình tự thí nghiệm!",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tại sao phải đeo kính bảo hộ?",
        options: [
          "Để nhìn rõ hơn",
          "Để bảo vệ mắt khỏi hóa chất",
          "Để đẹp hơn",
          "Không cần thiết"
        ],
        correctAnswer: 1,
        explanation: "✅ Đeo kính để bảo vệ mắt khỏi hóa chất.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Muối ăn có màu ___ và tan trong ___.",
        correctAnswer: "trắng, nước",
        hint: "💡 Màu sắc và dung môi",
        explanation: "✅ Muối ăn màu TRẮNG và tan trong NƯỚC.",
        points: 10
      },
    {
        type: "drag-drop",
        question: "🧩 Hoàn thành: Trong thí nghiệm, ta quan sát ___, ___ và ___ của các chất.",
        inline: true,
        slots: [
          { id: 1, label: "Tính chất 1", correct: "màu sắc" },
          { id: 2, label: "Tính chất 2", correct: "trạng thái" },
          { id: 3, label: "Tính chất 3", correct: "tính chất đặc trưng" }
        ],
        options: ["màu sắc", "trạng thái", "tính chất đặc trưng", "khối lượng"],
        explanation: "✅ Quan sát MÀU SẮC, TRẠNG THÁI và TÍNH CHẤT ĐẶC TRƯNG.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Vì sao phải ghi chép kết quả thí nghiệm?",
        options: [
          "Để làm đẹp vở",
          "Để so sánh và rút ra kết luận khoa học",
          "Không cần ghi chép",
          "Chỉ ghi khi thầy cô yêu cầu"
        ],
        correctAnswer: 1,
        explanation: "✅ Ghi chép để SO SÁNH và RÚT RA KẾT LUẬN khoa học.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Nếu một chất bị nam châm hút, ta kết luận chất đó có tính ___.",
        correctAnswer: "từ",
        hint: "💡 Tính chất liên quan đến nam châm",
        explanation: "✅ Chất bị nam châm hút có TÍNH TỪ.",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Ghép phương pháp với mục đích",
        pairs: [
          { left: "Quan sát bằng mắt", right: "Xác định màu sắc, trạng thái" },
          { left: "Dùng nam châm", right: "Phân biệt sắt" },
          { left: "Hòa tan vào nước", right: "Kiểm tra độ tan" },
          { left: "Ghi chép", right: "Lưu lại kết quả" }
        ],
        explanation: "✅ Xuất sắc! Bạn hiểu rõ mục đích từng phương pháp.",
        points: 20
      },
      {
        type: "multiple-choice",
        question: "Trong thực tế, ta có thể dùng nam châm để làm gì?",
        options: [
          "Chỉ để chơi",
          "Tách sắt ra khỏi hỗn hợp với các chất khác",
          "Không có ứng dụng",
          "Chỉ dùng trong phòng thí nghiệm"
        ],
        correctAnswer: 1,
        explanation: "✅ Nam châm giúp TÁCH SẮT ra khỏi hỗn hợp (ứng dụng thực tế).",
        points: 10
      }
  ]
};
