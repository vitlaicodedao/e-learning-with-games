module.exports = {
  classId: 8,
  chapterId: 3, // Phải là chương 3
  lessonId: 18,
  title: "Bài 18: Mol",
  description: "Khám phá về nguyên tố Hiđro, tính chất vật lí, tính chất hóa học (tính khử) và các ứng dụng quan trọng của nó.",
  level: "Beginner",
  order: 18,
  theory: `
    <h2>💨 Hiđro (H₂)</h2>
    <p>Hiđro là nguyên tố phổ biến nhất trong vũ trụ, chiếm khoảng 75% tổng khối lượng vũ trụ. Ở điều kiện thường, hiđro tồn tại ở dạng phân tử H₂.</p>
    
    <h3>1. Kí hiệu hóa học và Công thức hóa học</h3>
    <ul>
      <li><strong>Kí hiệu hóa học (KHHH):</strong> H</li>
      <li><strong>Công thức hóa học (CTHH) của đơn chất:</strong> H₂</li>
      <li><strong>Nguyên tử khối:</strong> 1</li>
      <li><strong>Phân tử khối:</strong> 2</li>
    </ul>

    <h3>2. Tính chất vật lí</h3>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p>Khí hiđro (H₂) là:</p>
      <ul>
        <li>Chất khí không màu, không mùi, không vị.</li>
        <li>Nhẹ nhất trong các chất khí, nhẹ hơn không khí khoảng 14,5 lần.</li>
        <li>Tan rất ít trong nước.</li>
      </ul>
      <p><em>Lưu ý: Vì rất nhẹ nên quả bóng bay bơm khí hiđro có thể bay lên cao.</em></p>
    </div>

    <h3>3. Tính chất hóa học</h3>
    <p>Ở nhiệt độ thích hợp, khí hiđro có <strong>tính khử</strong>. Nó có thể chiếm nguyên tử oxi của một số oxit kim loại để tạo ra kim loại và nước.</p>
    
    <h4>a. Tác dụng với Oxi (Phản ứng cháy)</h4>
    <p>Khí hiđro cháy trong oxi với ngọn lửa màu xanh nhạt và tỏa nhiều nhiệt.</p>
    <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #fffbeb;">
      2H₂ + O₂ → 2H₂O (t°)
    </div>
    <p><strong>Lưu ý:</strong> Hỗn hợp khí H₂ và O₂ là một hỗn hợp dễ cháy, cần cẩn thận khi thực hiện thí nghiệm.</p>

    <h4>b. Tác dụng với một số oxit kim loại (Tính khử)</h4>
    <p>Khí H₂ khử được oxit của các kim loại đứng sau Nhôm (Al) trong dãy hoạt động hóa học (ví dụ: Cu, Fe, Pb...).</p>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p><strong>Ví dụ 1: Khử Đồng(II) oxit (CuO)</strong></p>
      <p>Khi cho luồng khí H₂ đi qua bột CuO màu đen nung nóng, CuO sẽ chuyển dần thành kim loại đồng (Cu) màu đỏ và có hơi nước tạo thành.</p>
      <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #f0fdf4;">
        H₂ + CuO → Cu + H₂O (t°)
        <br>
        (Chất khử) (Chất oxi hóa)
      </div>
      <p>Trong phản ứng này, H₂ là chất khử (chiếm oxi của chất khác), CuO là chất oxi hóa (nhường oxi cho chất khác).</p>
    </div>

    <h3>4. Ứng dụng của Hiđro</h3>
    <p>Hiđro có nhiều ứng dụng quan trọng trong công nghiệp và đời sống:</p>
    <ul>
      <li><strong>Nhiên liệu:</strong> Dùng làm nhiên liệu cho động cơ, và đang được nghiên cứu làm nhiên liệu sạch.</li>
      <li><strong>Sản xuất hóa chất:</strong> Dùng để sản xuất amoniac (NH₃), axit clohiđric (HCl),...</li>
      <li><strong>Luyện kim:</strong> Dùng làm chất khử để điều chế một số kim loại từ oxit của chúng.</li>
      <li><strong>Hàn cắt kim loại:</strong> Đèn xì oxi-hiđro có thể tạo ra nhiệt độ rất cao.</li>
      <li><strong>Bơm vào khinh khí cầu, bóng bay:</strong> Do tính chất nhẹ.</li>
    </ul>
  `,
  game:[
      {
        type: "multiple-choice",
        question: "Khí nào sau đây nhẹ nhất trong các loại khí?",
        options: ["Oxi (O₂)", "Cacbonic (CO₂)", "Hiđro (H₂)", "Nitơ (N₂)"],
        correctAnswer: 2,
        explanation: "✅ Hiđro (H₂) là khí nhẹ nhất, nhẹ hơn không khí khoảng 14,5 lần.",
        points: 10
      },
      {
        type: "true-false",
        question: "Khí hiđro có màu xanh nhạt.",
        correctAnswer: false,
        explanation: "❌ Sai, khí hiđro là chất khí không màu, không mùi, không vị.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tính chất hóa học đặc trưng của hiđro là gì?",
        options: ["Tính axit", "Tính bazơ", "Tính oxi hóa", "Tính khử"],
        correctAnswer: 3,
        explanation: "✅ Ở nhiệt độ cao, hiđro thể hiện tính khử, có khả năng chiếm oxi của các chất khác.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phản ứng giữa H₂ và O₂ tạo ra sản phẩm là ___.",
        correctAnswer: "nước",
        hint: "💡 Công thức hóa học là H₂O",
        explanation: "✅ 2H₂ + O₂ → 2H₂O.",
        points: 10
      },
      {
        type: "true-false",
        question: "Hỗn hợp khí hiđro và oxi là một hỗn hợp dễ bắt lửa.",
        correctAnswer: true,
        explanation: "✅ Đúng, hỗn hợp này sẽ cháy mạnh khi có tia lửa điện hoặc nhiệt độ cao.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Trong phản ứng: H₂ + CuO → Cu + H₂O, chất nào là chất khử?",
        options: ["H₂", "CuO", "Cu", "H₂O"],
        correctAnswer: 0,
        explanation: "✅ H₂ đã chiếm oxi của CuO, do đó H₂ là chất khử.",
        points: 15
      },
      {
        type: "matching",
        question: "🔗 Ghép ứng dụng với tính chất tương ứng của hiđro.",
        pairs: [
          { left: "Bơm vào bóng bay", right: "Tính chất nhẹ" },
          { left: "Làm nhiên liệu", right: "Cháy tỏa nhiều nhiệt" },
          { left: "Điều chế kim loại từ oxit", right: "Tính khử" }
        ],
        explanation: "✅ Mỗi ứng dụng của hiđro đều dựa trên một tính chất vật lí hoặc hóa học đặc trưng của nó.",
        points: 15
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp các bước của thí nghiệm khử CuO bằng H₂.",
        options: [
          "Cho luồng khí H₂ đi qua ống nghiệm một thời gian để đuổi hết không khí.",
          "Nung nóng ống nghiệm ở vị trí chứa CuO.",
          "Quan sát hiện tượng CuO màu đen chuyển thành Cu màu đỏ.",
          "Ngừng đun nóng, tiếp tục cho H₂ đi qua cho đến khi ống nghiệm nguội hẳn."
        ],
        correctOrder: [
          "Cho luồng khí H₂ đi qua ống nghiệm một thời gian để đuổi hết không khí.",
          "Nung nóng ống nghiệm ở vị trí chứa CuO.",
          "Quan sát hiện tượng CuO màu đen chuyển thành Cu màu đỏ.",
          "Ngừng đun nóng, tiếp tục cho H₂ đi qua cho đến khi ống nghiệm nguội hẳn."
        ],
        explanation: "✅ Đây là quy trình chuẩn để thực hiện phản ứng an toàn và hiệu quả.",
        points: 15
      },
       {
        type: "drag-drop",
        question: "🧩 Hoàn thành phương trình: H₂ + Fe₂O₃ → ? + ?",
        slots: [
          { id: 1, label: "Sản phẩm 1", accepts: ["Fe"] },
          { id: 2, label: "Sản phẩm 2", accepts: ["H₂O"] }
        ],
        options: ["Fe", "H₂O", "FeO", "Fe(OH)₃"],
        explanation: "✅ H₂ khử oxit sắt (III) tạo ra sắt và nước. PTHH cân bằng: 3H₂ + Fe₂O₃ → 2Fe + 3H₂O.",
        points: 15
      },
      {
        type: "fill-in-blank",
        question: "Hỗn hợp khí H₂ và O₂ cháy mạnh nhất khi tỉ lệ thể tích H₂:O₂ là ___:___.",
        correctAnswer: "2:1",
        explanation: "✅ Tỉ lệ 2:1 đúng bằng tỉ lệ các chất tham gia trong phương trình phản ứng 2H₂ + O₂ → 2H₂O.",
        points: 15
      },
      {
        type: "multiple-choice",
        question: "Để khử hoàn toàn 16g CuO cần dùng bao nhiêu lít khí H₂ (ở đktc)? (Cu=64, O=16)",
        options: ["2.24 lít", "4.48 lít", "1.12 lít", "3.36 lít"],
        correctAnswer: 1,
        explanation: "✅ nCuO = 16/80 = 0.2 mol. Theo PTHH: H₂ + CuO → Cu + H₂O, nH₂ = nCuO = 0.2 mol. VH₂ = 0.2 * 22.4 = 4.48 lít.",
        points: 20
      },
      {
        type: "true-false",
        question: "Khí H₂ có thể khử được oxit của tất cả các kim loại.",
        correctAnswer: false,
        explanation: "❌ Sai, H₂ chỉ khử được oxit của các kim loại đứng sau Al trong dãy hoạt động hóa học. Nó không khử được các oxit như Na₂O, CaO, Al₂O₃.",
        points: 20
      },
      {
        type: "multiple-choice",
        question: "Tại sao khi kết thúc thí nghiệm khử oxit kim loại bằng H₂, phải để khí H₂ tiếp tục thổi qua cho đến khi nguội hẳn?",
        options: [
            "Để tiết kiệm khí H₂", 
            "Để ngăn kim loại nóng đỏ mới tạo thành tác dụng trở lại với oxi trong không khí", 
            "Để làm sạch ống nghiệm", 
            "Để phản ứng xảy ra nhanh hơn"
        ],
        correctAnswer: 1,
        explanation: "✅ Nếu ngừng thổi H₂ ngay, kim loại nóng đỏ sẽ phản ứng lại với oxi trong không khí, làm mất sản phẩm vừa tạo thành.",
        },
        {
            "type": "fill-in-blank",
            "question": "Tính toán phức tạp: Giá trị = ___",
            "correctAnswer": "42",
            "hint": "💡 Cần tính toán nhiều bước",
            "explanation": "✅ Chính xác!",
            "points": 20
        },
        {
            "type": "matching",
            "question": "🧠 Ghép nguyên nhân-kết quả",
            "pairs": [
                {
                    "left": "Nguyên nhân A",
                    "right": "Kết quả A"
                },
                {
                    "left": "Nguyên nhân B",
                    "right": "Kết quả B"
                },
                {
                    "left": "Nguyên nhân C",
                    "right": "Kết quả C"
                }
            ],
            "explanation": "✅ Tuyệt vời!",
            "points": 20
        },
        {
            "type": "multiple-choice",
            "question": "Ứng dụng/vận dụng cao?",
            "options": [
                "Ứng dụng A",
                "Ứng dụng B",
                "Ứng dụng C (Đúng)",
                "Ứng dụng D"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Bạn vận dụng tốt!",
            "points": 20
        }
    ]
}

