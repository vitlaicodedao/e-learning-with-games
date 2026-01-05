module.exports = {
  classId: 8,
  chapterId: 3, // Phải là chương 3
  lessonId: 20,
  title: "Bài 20: Tính theo công thức hóa học",
  description: "Tìm hiểu các phương pháp điều chế khí Hiđro trong phòng thí nghiệm và trong công nghiệp, cùng với khái niệm về phản ứng thế.",
  level: "Beginner",
  order: 20,
  theory: `
    <h2>🛠️ Điều chế Hiđro - Phản ứng thế</h2>
    <p>Bài này sẽ giới thiệu cách chúng ta có thể tạo ra khí hiđro và một loại phản ứng hóa học mới: phản ứng thế.</p>
    
    <h3>1. Điều chế khí Hiđro</h3>
    
    <h4>a. Trong phòng thí nghiệm</h4>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p><strong>Nguyên tắc:</strong> Cho kim loại (như Zn, Al, Fe...) tác dụng với dung dịch axit (như HCl, H₂SO₄ loãng).</p>
      <p><strong>Ví dụ:</strong></p>
      <p>Cho kẽm (Zn) tác dụng với dung dịch axit clohiđric (HCl):</p>
      <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #fffbeb;">
        Zn + 2HCl → ZnCl₂ + H₂↑
      </div>
      <p>Cho sắt (Fe) tác dụng với dung dịch axit sunfuric loãng (H₂SO₄):</p>
      <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 15px 0; padding: 10px; background: #fffbeb;">
        Fe + H₂SO₄ → FeSO₄ + H₂↑
      </div>
      <p><strong>Cách thu khí H₂:</strong> Khí H₂ có thể được thu bằng 2 cách:</p>
      <ul>
        <li><strong>Đẩy nước:</strong> Vì H₂ rất ít tan trong nước.</li>
        <li><strong>Đẩy không khí (úp ngược ống nghiệm):</strong> Vì H₂ nhẹ hơn không khí.</li>
      </ul>
    </div>

    <h4>b. Trong công nghiệp</h4>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p>Trong công nghiệp, người ta sản xuất hiđro với lượng lớn và giá thành rẻ hơn bằng các phương pháp:</p>
      <ul>
        <li><strong>Điện phân nước:</strong> Dùng dòng điện để phân hủy nước thành khí H₂ và O₂.</li>
        <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 10px 0;">
          2H₂O --(điện phân)--> 2H₂↑ + O₂↑
        </div>
        <li><strong>Dùng than khử oxi của nước:</strong> Cho hơi nước đi qua than nung đỏ.</li>
        <div style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 10px 0;">
           C + H₂O --(t°)--> CO + H₂
        </div>
        <li><strong>Từ khí tự nhiên, khí dầu mỏ.</strong></li>
      </ul>
    </div>

    <h3>2. Phản ứng thế</h3>
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p>Hãy quan sát lại phản ứng: Zn + 2HCl → ZnCl₂ + H₂</p>
      <p>Ta thấy rằng, nguyên tử của đơn chất Kẽm (Zn) đã thay thế cho nguyên tử hiđro (H) trong hợp chất axit clohiđric (HCl).</p>
      <p><strong>Định nghĩa:</strong> Phản ứng thế là phản ứng hóa học giữa đơn chất và hợp chất, trong đó nguyên tử của đơn chất thay thế nguyên tử của một nguyên tố khác trong hợp chất.</p>
    </div>

    <p><strong>Ví dụ khác về phản ứng thế:</strong></p>
    <ul>
      <li>Fe + CuSO₄ → FeSO₄ + Cu</li>
      <li>Cl₂ + 2NaBr → 2NaCl + Br₂</li>
    </ul>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Trong phòng thí nghiệm, người ta dùng cặp chất nào sau đây để điều chế H₂?",
    options: [
      "Zn và H₂O",
      "Zn và dung dịch HCl",
      "Cu và dung dịch HCl",
      "Zn và dung dịch NaCl"
    ],
    correctAnswer: 1,
    explanation: "✅ Nguyên tắc là cho kim loại (như Zn) tác dụng với dung dịch axit (như HCl).",
    points: 10
  },
  {
    type: "true-false",
    question: "Có thể thu khí hiđro bằng cách đặt đứng bình (ngửa miệng bình).",
    correctAnswer: false,
    explanation: "❌ Sai, vì hiđro rất nhẹ nên phải úp ngược bình để thu bằng cách đẩy không khí.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng thế là phản ứng giữa...",
    options: [
      "Hai đơn chất",
      "Hai hợp chất",
      "Đơn chất và hợp chất",
      "Một chất và oxi"
    ],
    correctAnswer: 2,
    explanation: "✅ Phản ứng thế xảy ra giữa một đơn chất và một hợp chất.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong công nghiệp, người ta có thể điều chế H₂ bằng cách ___ nước.",
    correctAnswer: "điện phân",
    explanation: "✅ Điện phân nước (2H₂O → 2H₂ + O₂) là một phương pháp phổ biến trong công nghiệp.",
    points: 10
  },
  {
    type: "true-false",
    question: "Phản ứng Zn + 2HCl → ZnCl₂ + H₂ là một phản ứng thế.",
    correctAnswer: true,
    explanation: "✅ Đúng, nguyên tử Zn (đơn chất) đã thay thế nguyên tử H (trong hợp chất HCl).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Sản phẩm của phản ứng giữa Al và dung dịch H₂SO₄ loãng là:",
    options: [
      "AlSO₄ và H₂",
      "Al₂(SO₄)₃ và H₂O",
      "Al₂(SO₄)₃ và H₂",
      "Không phản ứng"
    ],
    correctAnswer: 2,
    explanation: "✅ 2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂. Đây là một phản ứng thế.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép phương pháp điều chế H₂ với nơi ứng dụng.",
    pairs: [
      {
        left: "Điện phân nước",
        right: "Công nghiệp"
      },
      {
        left: "Cho Zn tác dụng với HCl",
        right: "Phòng thí nghiệm"
      },
      {
        left: "Cho hơi nước qua than nóng đỏ",
        right: "Công nghiệp"
      }
    ],
    explanation: "✅ Các phương pháp trong công nghiệp ưu tiên quy mô lớn và giá rẻ, trong khi phòng thí nghiệm ưu tiên sự tiện lợi và nhanh chóng.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước để điều chế và thu khí H₂ bằng cách đẩy nước.",
    options: [
      "Cho vài viên kẽm vào ống nghiệm.",
      "Rót dung dịch HCl vào ống nghiệm.",
      "Đậy ống nghiệm bằng nút có ống dẫn khí xuyên qua.",
      "Dẫn đầu ống dẫn khí vào ống nghiệm úp ngược trong chậu nước."
    ],
    correctOrder: [
      "Cho vài viên kẽm vào ống nghiệm.",
      "Rót dung dịch HCl vào ống nghiệm.",
      "Đậy ống nghiệm bằng nút có ống dẫn khí xuyên qua.",
      "Dẫn đầu ống dẫn khí vào ống nghiệm úp ngược trong chậu nước."
    ],
    explanation: "✅ Đây là quy trình chuẩn để điều chế và thu khí hiđro tinh khiết trong phòng thí nghiệm.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành phương trình: Fe + H₂SO₄ (loãng) → ? + ?",
    slots: [
      {
        id: 1,
        label: "Muối",
        accepts: [
          "FeSO₄"
        ]
      },
      {
        id: 2,
        label: "Khí",
        accepts: [
          "H₂"
        ]
      }
    ],
    options: [
      "FeSO₄",
      "H₂",
      "Fe₂(SO₄)₃",
      "H₂O"
    ],
    explanation: "✅ Sắt tác dụng với H₂SO₄ loãng tạo ra muối sắt(II) sunfat và giải phóng khí hiđro.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào sau đây là phản ứng thế?",
    options: [
      "2Na + 2H₂O → 2NaOH + H₂",
      "2KClO₃ → 2KCl + 3O₂",
      "SO₃ + H₂O → H₂SO₄",
      "BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl"
    ],
    correctAnswer: 0,
    explanation: "✅ Nguyên tử Na (đơn chất) đã thay thế một nguyên tử H trong hợp chất H₂O.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Để điều chế 4.48 lít khí H₂ (đktc), cần dùng bao nhiêu gam Kẽm (Zn)? (Zn=65)",
    options: [
      "6.5g",
      "13g",
      "19.5g",
      "26g"
    ],
    correctAnswer: 1,
    explanation: "✅ nH₂ = 4.48/22.4 = 0.2 mol. PTHH: Zn + 2HCl → ZnCl₂ + H₂. nZn = nH₂ = 0.2 mol. mZn = 0.2 * 65 = 13g.",
    points: 10
  },
  {
    type: "true-false",
    question: "Tất cả các phản ứng thế đều là phản ứng oxi hóa - khử.",
    correctAnswer: true,
    explanation: "✅ Đúng, vì trong phản ứng thế luôn có sự thay đổi số oxi hóa của nguyên tử đơn chất và nguyên tử bị thay thế.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao không dùng axit H₂SO₄ đặc, nóng để điều chế H₂?",
    options: [
      "Phản ứng xảy ra quá chậm",
      "H₂SO₄ đặc, nóng không phản ứng với kim loại",
      "Phản ứng tạo ra sản phẩm khử khác (SO₂) thay vì H₂",
      "Phản ứng quá nguy hiểm"
    ],
    correctAnswer: 2,
    explanation: "✅ H₂SO₄ đặc, nóng là chất oxi hóa mạnh. Khi tác dụng với kim loại, nó sẽ bị khử xuống SO₂ (hoặc S, H₂S) chứ không giải phóng H₂.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Ngâm một đinh sắt sạch trong dung dịch CuSO₄. Hiện tượng quan sát được là có một lớp kim loại màu ___ bám vào đinh sắt.",
    correctAnswer: "đỏ",
    hint: "💡 Fe + CuSO₄ → FeSO₄ + Cu. Đồng (Cu) có màu gì?",
    explanation: "✅ Sắt đẩy đồng ra khỏi dung dịch muối, tạo thành một lớp đồng màu đỏ bám trên bề mặt đinh sắt. Đây là một phản ứng thế.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Cho cùng một khối lượng các kim loại sau: Fe, Zn, Al, Mg vào dung dịch HCl dư. Kim loại nào sẽ giải phóng nhiều khí H₂ nhất?",
    options: [
      "Fe",
      "Zn",
      "Al",
      "Mg"
    ],
    correctAnswer: 2,
    explanation: "✅ Xét cùng khối lượng m, số mol H₂ sinh ra tỉ lệ với (hóa trị / Nguyên tử khối). Tỉ lệ này của Al là lớn nhất (3/27), do đó Al giải phóng nhiều H₂ nhất.",
    points: 10
  }
]
};
