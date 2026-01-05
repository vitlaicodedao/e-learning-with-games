module.exports = {
  classId: 8,
  chapterId: 4,
  lessonId: 29,
  title: "Bài 29: Tính chất – Ứng dụng của hidro",
  description: "Tìm hiểu tính chất vật lý, hóa học và ứng dụng của khí hidro",
  level: "Beginner",
  order: 29,
  theory: `
      <h2>💨 Khí Hidro (H₂)</h2>
      <p><strong>Hidro</strong> là nguyên tố hóa học nhẹ nhất, kí hiệu H, phân tử H₂.</p>
      
      <h3>🔬 Tính chất vật lý</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p>• Khí không màu, không mùi, không vị</p>
        <p>• Nhẹ nhất trong các chất khí (nhẹ hơn không khí 14,5 lần)</p>
        <p>• Tan rất ít trong nước</p>
        <p>• Nhiệt độ sôi: -253°C</p>
      </div>
      
      <h3>⚗️ Tính chất hóa học</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Tác dụng với oxi (phản ứng cháy)</h4>
        <p>2H₂ + O₂ → 2H₂O (tỏa nhiệt)</p>
        <p><em>Lưu ý:</em> Hỗn hợp H₂ và O₂ cháy nổ mạnh!</p>
        
        <h4>2. Tác dụng với oxit kim loại (khử oxit)</h4>
        <p>CuO + H₂ → Cu + H₂O</p>
        <p>Fe₂O₃ + 3H₂ → 2Fe + 3H₂O</p>
      </div>

      <h3>🏭 Ứng dụng</h3>
      <ul>
        <li>🎈 Bơm bóng bay, khí cầu (nhẹ)</li>
        <li>🔥 Nhiên liệu sạch (tên lửa, xe hơi)</li>
        <li>🏭 Sản xuất amoniac NH₃</li>
        <li>⚙️ Hàn cắt kim loại</li>
        <li>🍞 Công nghiệp thực phẩm (hydrohóa dầu mỡ)</li>
      </ul>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Hidro có công thức phân tử là gì?",
    options: [
      "H",
      "H₂",
      "H₂O",
      "HO"
    ],
    correctAnswer: 1,
    explanation: "✅ Hidro tồn tại dưới dạng phân tử H₂.",
    points: 10
  },
  {
    type: "true-false",
    question: "Hidro là chất khí nhẹ nhất.",
    correctAnswer: true,
    explanation: "✅ Đúng! H₂ nhẹ hơn không khí 14,5 lần.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Khi hidro cháy trong oxi tạo ra chất gì?",
    options: [
      "H₂",
      "O₂",
      "H₂O",
      "H₂O₂"
    ],
    correctAnswer: 2,
    explanation: "✅ 2H₂ + O₂ → 2H₂O (nước)",
    points: 10
  },
  {
    type: "true-false",
    question: "Hidro có màu xanh và mùi hắc.",
    correctAnswer: false,
    explanation: "❌ Sai! Hidro không màu, không mùi, không vị.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hidro được dùng làm nhiên liệu vì:",
    options: [
      "Rẻ tiền",
      "Cháy tỏa nhiều nhiệt và sạch",
      "Dễ tìm",
      "Có màu đẹp"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ là nhiên liệu sạch, cháy chỉ tạo ra nước.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép tính chất với loại tương ứng",
    pairs: [
      {
        left: "Không màu, không mùi",
        right: "Tính chất vật lý"
      },
      {
        left: "Cháy trong oxi",
        right: "Tính chất hóa học"
      },
      {
        left: "Nhẹ nhất",
        right: "Tính chất vật lý"
      },
      {
        left: "Khử oxit kim loại",
        right: "Tính chất hóa học"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân biệt được tính chất vật lý và hóa học.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Phương trình: CuO + H₂ → ___ + H₂O",
    correctAnswer: "Cu",
    hint: "💡 Kim loại được tạo ra",
    explanation: "✅ H₂ khử CuO thành Cu (đồng).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao không dùng H₂ bơm bóng bay phổ biến?",
    options: [
      "Vì quá đắt",
      "Vì nguy hiểm, dễ cháy nổ",
      "Vì quá nhẹ",
      "Vì có màu xấu"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ rất dễ cháy nổ khi gặp lửa hoặc tia lửa điện.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước phản ứng H₂ cháy",
    options: [
      "Cung cấp nhiệt (lửa)",
      "H₂ + O₂ tiếp xúc",
      "Phản ứng tỏa nhiệt",
      "Tạo ra H₂O"
    ],
    correctOrder: [
      "H₂ + O₂ tiếp xúc",
      "Cung cấp nhiệt (lửa)",
      "Phản ứng tỏa nhiệt",
      "Tạo ra H₂O"
    ],
    explanation: "✅ Đúng trình tự phản ứng cháy của H₂.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Hidro nhẹ hơn không khí ___ lần.",
    correctAnswer: "14,5",
    hint: "💡 Một con số thập phân",
    explanation: "✅ H₂ nhẹ hơn không khí 14,5 lần.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: H₂ có tính ___ vì khử được ___ kim loại thành ___.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Tính chất",
        correct: "khử"
      },
      {
        id: 2,
        label: "Chất bị khử",
        correct: "oxit"
      },
      {
        id: 3,
        label: "Sản phẩm",
        correct: "kim loại"
      }
    ],
    options: [
      "khử",
      "oxit",
      "kim loại",
      "muối"
    ],
    explanation: "✅ H₂ có tính KHỬ, khử OXIT kim loại thành KIM LOẠI.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào SAI?",
    options: [
      "2H₂ + O₂ → 2H₂O",
      "H₂ + CuO → Cu + H₂O",
      "H₂ + Fe₂O₃ → Fe + H₂O",
      "3H₂ + Fe₂O₃ → 2Fe + 3H₂O"
    ],
    correctAnswer: 2,
    explanation: "❌ Sai! Cần cân bằng: 3H₂ + Fe₂O₃ → 2Fe + 3H₂O",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Ưu điểm của H₂ làm nhiên liệu là cháy ___ và không gây ___.",
    correctAnswer: "sạch, ô nhiễm",
    hint: "💡 Môi trường và sản phẩm",
    explanation: "✅ H₂ cháy SẠCH, chỉ tạo H₂O, không gây Ô NHIỄM.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Ghép ứng dụng với lý do",
    pairs: [
      {
        left: "Bơm bóng bay",
        right: "Nhẹ nhất"
      },
      {
        left: "Nhiên liệu tên lửa",
        right: "Cháy tỏa nhiều nhiệt"
      },
      {
        left: "Hàn cắt kim loại",
        right: "Ngọn lửa nhiệt độ cao"
      },
      {
        left: "Khử quặng sắt",
        right: "Có tính khử"
      }
    ],
    explanation: "✅ Xuất sắc! Bạn hiểu rõ ứng dụng dựa trên tính chất.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao hỗn hợp H₂ và O₂ theo tỉ lệ 2:1 nguy hiểm nhất?",
    options: [
      "Vì đó là tỉ lệ phản ứng hoàn toàn, cháy nổ mạnh nhất",
      "Vì H₂ quá nhiều",
      "Vì O₂ quá ít",
      "Vì không phản ứng được"
    ],
    correctAnswer: 0,
    explanation: "✅ Tỉ lệ 2:1 là tỉ lệ phản ứng đúng, cháy nổ cực mạnh!",
    points: 10
  }
]
};
