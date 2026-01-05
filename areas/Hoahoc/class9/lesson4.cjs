module.exports = {
  classId: 9,
  chapterId: 2,
  lessonId: 4,
  title: "Bài 4: Phản ứng giữa oxit kim loại với hidro",
  description: "Tính chất khử của hidro và ứng dụng",
  level: "Beginner",
  order: 4,
  theory: `
      <h2>⚗️ Phản ứng khử oxit kim loại bằng Hidro</h2>
      
      <h3>💨 Tính chất hóa học của H₂</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Tính khử</h4>
        <p><strong>Hidro</strong> là chất khử mạnh, có khả năng khử nhiều oxit kim loại ở nhiệt độ cao.</p>
        <p>H₂ + CuO → Cu + H₂O (màu đen → đỏ)</p>
        <p>3H₂ + Fe₂O₃ → 2Fe + 3H₂O (màu nâu đỏ → xám)</p>
        <p>H₂ + PbO → Pb + H₂O (màu vàng → xám)</p>
      </div>

      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Phản ứng cháy</h4>
        <p>2H₂ + O₂ → 2H₂O + nhiệt (ngọn lửa xanh nhạt)</p>
        <p><strong>Ứng dụng:</strong> Đèn khò hàn cắt kim loại</p>
        <p><strong>Lưu ý:</strong> Hỗn hợp H₂ và O₂ (hoặc không khí) nổ mạnh khi đốt</p>
      </div>

      <h3>🔬 Thí nghiệm khử CuO bằng H₂</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <h4>Các bước tiến hành:</h4>
        <p>1. Cho bột CuO (màu đen) vào ống nghiệm</p>
        <p>2. Dẫn khí H₂ qua ống nghiệm</p>
        <p>3. Đun nóng ống nghiệm</p>
        <p>4. <strong>Hiện tượng:</strong> Bột CuO từ màu đen chuyển sang màu đỏ (Cu), hơi nước ngưng tụ</p>
        <p>5. <strong>Phương trình:</strong> H₂ + CuO → Cu + H₂O</p>
      </div>

      <h3>⚠️ An toàn phòng thí nghiệm</h3>
      <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <p>• Không được đốt H₂ khi chưa kiểm tra độ tinh khiết</p>
        <p>• Phải dẫn H₂ qua ống nghiệm một lúc trước khi đun nóng (đẩy hết không khí)</p>
        <p>• Sau phản ứng phải tắt đèn cồn trước, sau đó mới ngừng dẫn H₂</p>
        <p>• Tránh hỗn hợp H₂ với không khí gây nổ</p>
      </div>

      <h3>🌟 Ứng dụng</h3>
      <ul>
        <li>🏭 <strong>Luyện kim:</strong> Khử oxit kim loại để thu kim loại tinh khiết</li>
        <li>🔥 <strong>Nhiên liệu:</strong> Đèn khò hàn, nhiên liệu tên lửa</li>
        <li>🧪 <strong>Công nghiệp hóa chất:</strong> Sản xuất amoniac, metanol</li>
        <li>⚡ <strong>Năng lượng sạch:</strong> Pin nhiên liệu hidro</li>
      </ul>

      <h3>📝 Nhận xét</h3>
      <p>• H₂ chỉ khử được oxit của kim loại đứng sau Al trong dãy hoạt động</p>
      <p>• Kim loại có tính oxi hóa mạnh (K, Na, Ca...) không bị H₂ khử</p>
      <p>• Sản phẩm luôn là kim loại và nước</p>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "H₂ có tính chất hóa học nào?",
        options: ["Chỉ có tính oxi hóa", "Chỉ có tính khử", "Có cả tính oxi hóa và khử", "Không có tính oxi hóa và khử"],
        correctAnswer: 1,
        explanation: "H₂ là chất khử mạnh, có khả năng khử nhiều oxit kim loại."
      },
      {
        type: "true-false",
        question: "Phản ứng H₂ + CuO → Cu + H₂O, CuO chuyển từ màu đen sang màu đỏ",
        correctAnswer: true,
        explanation: "Đúng! CuO màu đen bị khử thành Cu màu đỏ."
      },
      {
        type: "multiple-choice",
        question: "Khi đốt H₂ trong không khí, ngọn lửa có màu gì?",
        options: ["Đỏ", "Vàng", "Xanh nhạt", "Không màu"],
        correctAnswer: 2,
        explanation: "H₂ cháy với ngọn lửa xanh nhạt: 2H₂ + O₂ → 2H₂O"
      },
      {
        type: "fill-in-blank",
        question: "Sản phẩm của phản ứng khử oxit kim loại bằng H₂ là kim loại và _____",
        correctAnswer: "nước",
        explanation: "H₂ + Oxit kim loại → Kim loại + H₂O"
      },
      {
        type: "multiple-choice",
        question: "Tại sao phải dẫn H₂ qua ống nghiệm trước khi đun nóng?",
        options: [
          "Để làm nguội ống nghiệm",
          "Để đẩy hết không khí tránh nổ",
          "Để làm ẩm CuO",
          "Để tạo áp suất"
        ],
        correctAnswer: 1,
        explanation: "Phải đẩy hết không khí để tránh hỗn hợp H₂ và O₂ gây nổ."
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Dẫn H₂ qua 16g CuO nung nóng. Khối lượng Cu thu được là:",
        options: ["12.8g", "6.4g", "3.2g", "1.6g"],
        correctAnswer: 0,
        explanation: "nCuO = 16/80 = 0.2 mol. H₂ + CuO → Cu + H₂O. nCu = 0.2 mol. mCu = 0.2 × 64 = 12.8g"
      },
      {
        type: "fill-in-blank",
        question: "Khử hoàn toàn 32g Fe₂O₃ bằng H₂, khối lượng Fe thu được là _____ g.",
        correctAnswer: "22.4",
        explanation: "nFe₂O₃ = 32/160 = 0.2 mol. 3H₂ + Fe₂O₃ → 2Fe + 3H₂O. nFe = 0.4 mol. mFe = 0.4 × 56 = 22.4g"
      },
      {
        type: "true-false",
        question: "H₂ có thể khử Na₂O thành Na",
        correctAnswer: false,
        explanation: "Sai! Na quá hoạt động, H₂ không thể khử oxit của kim loại kiềm."
      },
      {
        type: "multiple-choice",
        question: "Dẫn 4.48 lít H₂ (đktc) qua CuO dư nung nóng. Khối lượng H₂O tạo thành là:",
        options: ["3.6g", "1.8g", "7.2g", "9g"],
        correctAnswer: 0,
        explanation: "nH₂ = 4.48/22.4 = 0.2 mol. H₂ + CuO → Cu + H₂O. nH₂O = 0.2 mol. m = 0.2 × 18 = 3.6g"
      },
      {
        type: "multiple-choice",
        question: "Hiện tượng nào xảy ra khi dẫn H₂ qua Fe₂O₃ nung nóng?",
        options: [
          "Màu nâu đỏ chuyển sang màu xám",
          "Màu đen chuyển sang màu đỏ",
          "Màu xám chuyển sang màu đỏ",
          "Không có hiện tượng"
        ],
        correctAnswer: 0,
        explanation: "Fe₂O₃ màu nâu đỏ bị khử thành Fe màu xám: 3H₂ + Fe₂O₃ → 2Fe + 3H₂O"
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Khử hoàn toàn 48g hỗn hợp CuO và Fe₂O₃ bằng H₂ dư, thu được 36g hỗn hợp kim loại. Khối lượng CuO là:",
        options: ["32g", "24g", "16g", "40g"],
        correctAnswer: 0,
        explanation: "Khối lượng O = 48 - 36 = 12g. nO = 12/16 = 0.75 mol. Gọi x, y là mol CuO, Fe₂O₃. 80x + 160y = 48 và x + 1.5y = 0.75. Giải được x = 0.4 mol. mCuO = 0.4 × 80 = 32g"
      },
      {
        type: "fill-in-blank",
        question: "Dẫn 6.72 lít H₂ (đktc) qua m gam Fe₃O₄ nung nóng, thu được 20.88g chất rắn. Giá trị m = _____ g.",
        correctAnswer: "23.2",
        explanation: "nH₂ = 6.72/22.4 = 0.3 mol. 4H₂ + Fe₃O₄ → 3Fe + 4H₂O. nFe₃O₄ = 0.3/4 = 0.075 mol. nFe = 0.225 mol. mFe = 12.6g. m = 20.88 + (0.3 × 16) - 12.6 = 23.2g"
      },
      {
        type: "multiple-choice",
        question: "Dẫn H₂ dư qua ống sứ đựng 0.2 mol hỗn hợp CuO và Fe₂O₃ nung nóng. Thể tích H₂ (đktc) cần dùng tối thiểu là:",
        options: ["Không đủ dữ kiện", "4.48L", "6.72L", "8.96L"],
        correctAnswer: 0,
        explanation: "Không đủ dữ kiện vì không biết tỉ lệ mol CuO và Fe₂O₃. CuO cần 1 mol H₂, Fe₂O₃ cần 3 mol H₂."
      },
      {
        type: "true-false",
        question: "Để điều chế H₂ tinh khiết trong phòng thí nghiệm, ta cho Zn tác dụng với H₂SO₄ loãng",
        correctAnswer: true,
        explanation: "Đúng! Zn + H₂SO₄ → ZnSO₄ + H₂↑. Đây là phương pháp phổ biến."
      },
      {
        type: "multiple-choice",
        question: "Khử hoàn toàn hỗn hợp Fe₂O₃ và CuO bằng H₂, thu được 16g hỗn hợp Fe và Cu. Nếu khử cùng lượng oxit bằng CO thì khối lượng CO₂ thu được là:",
        options: ["Không đủ dữ kiện", "11g", "22g", "44g"],
        correctAnswer: 0,
        explanation: "Không đủ dữ kiện vì không biết khối lượng oxit ban đầu và thành phần."
      }
    ]
  }
};
