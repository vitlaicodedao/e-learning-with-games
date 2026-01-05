module.exports = {
  classId: 8,
  chapterId: 5,
  lessonId: 32,
  title: "Bài 32: Bài luyện tập 6 - Hidro",
  description: "Ôn tập và luyện tập về tính chất, điều chế và ứng dụng của hidro",
  level: "Intermediate",
  order: 32,
  theory: `
      <h2>📝 Ôn tập về Hidro</h2>
      
      <h3>🔍 Tóm tắt kiến thức</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>1. Tính chất vật lý</h4>
        <p>• Khí không màu, không mùi, không vị</p>
        <p>• Nhẹ nhất (nhẹ hơn không khí 14,5 lần)</p>
        <p>• Tan rất ít trong nước</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>2. Tính chất hóa học</h4>
        <p><strong>a) Cháy trong oxi:</strong> 2H₂ + O₂ → 2H₂O</p>
        <p><strong>b) Khử oxit kim loại:</strong></p>
        <p>• CuO + H₂ → Cu + H₂O</p>
        <p>• Fe₂O₃ + 3H₂ → 2Fe + 3H₂O</p>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>3. Điều chế</h4>
        <p><strong>PTN:</strong> Zn + H₂SO₄ → ZnSO₄ + H₂↑</p>
        <p><strong>Công nghiệp:</strong></p>
        <p>• Điện phân nước: 2H₂O → 2H₂ + O₂</p>
        <p>• Từ khí thiên nhiên: CH₄ + H₂O → CO + 3H₂</p>
      </div>

      <h3>📊 Bảng so sánh phản ứng</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Loại phản ứng</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Ví dụ</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Vai trò H₂</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Hóa hợp</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">2H₂ + O₂ → 2H₂O</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Bị oxi hóa</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Thế</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Zn + H₂SO₄ → ZnSO₄ + H₂</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Sản phẩm</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Oxi hóa-khử</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">CuO + H₂ → Cu + H₂O</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Chất khử</td>
        </tr>
      </table>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Công thức phân tử của hidro là gì?",
    options: [
      "H",
      "H₂",
      "H₂O",
      "HO₂"
    ],
    correctAnswer: 1,
    explanation: "✅ Hidro tồn tại dưới dạng phân tử H₂.",
    points: 10
  },
  {
    type: "true-false",
    question: "H₂ nhẹ hơn không khí nên có thể dùng để bơm bóng bay.",
    correctAnswer: true,
    explanation: "✅ Đúng! Nhưng nguy hiểm vì dễ cháy nổ.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phương trình nào SAI?",
    options: [
      "2H₂ + O₂ → 2H₂O",
      "H₂ + CuO → Cu + H₂O",
      "H₂ + Cl₂ → HCl",
      "H₂ + O₂ → H₂O₂"
    ],
    correctAnswer: 3,
    explanation: "❌ Sai! Phải là: 2H₂ + O₂ → 2H₂O (không phải H₂O₂)",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong PTN, H₂ được điều chế bằng phản ứng: Zn + H₂SO₄ → ZnSO₄ + ___",
    correctAnswer: "H₂",
    hint: "💡 Khí được tạo ra",
    explanation: "✅ Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    points: 10
  },
  {
    type: "true-false",
    question: "H₂ có tính khử vì có thể khử oxit kim loại.",
    correctAnswer: true,
    explanation: "✅ Đúng! H₂ khử CuO → Cu + H₂O",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép phản ứng với loại phản ứng",
    pairs: [
      {
        left: "2H₂ + O₂ → 2H₂O",
        right: "Hóa hợp"
      },
      {
        left: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        right: "Thế"
      },
      {
        left: "CuO + H₂ → Cu + H₂O",
        right: "Oxi hóa - khử"
      },
      {
        left: "Fe + 2HCl → FeCl₂ + H₂",
        right: "Thế"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn phân loại đúng các phản ứng.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Để điều chế H₂ trong công nghiệp, người ta điện phân nước: 2H₂O → ___ + ___",
    correctAnswer: "2H₂, O₂",
    hint: "💡 Hai khí được tạo ra",
    explanation: "✅ 2H₂O → 2H₂ + O₂",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trong phản ứng: 3H₂ + Fe₂O₃ → 2Fe + 3H₂O, H₂ đóng vai trò gì?",
    options: [
      "Chất oxi hóa",
      "Chất khử",
      "Xúc tác",
      "Không tham gia"
    ],
    correctAnswer: 1,
    explanation: "✅ H₂ là CHẤT KHỬ (bị oxi hóa), Fe₂O₃ bị khử.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước điều chế H₂ trong PTN",
    options: [
      "Chuẩn bị dụng cụ và hóa chất",
      "Cho Zn vào bình, thêm H₂SO₄",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết"
    ],
    correctOrder: [
      "Chuẩn bị dụng cụ và hóa chất",
      "Cho Zn vào bình, thêm H₂SO₄",
      "Thu khí H₂ bằng đẩy nước",
      "Kiểm tra độ tinh khiết"
    ],
    explanation: "✅ Đúng trình tự thí nghiệm!",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "H₂ cháy trong không khí tạo ngọn lửa màu ___ và sản phẩm là ___.",
    correctAnswer: "xanh nhạt, nước",
    hint: "💡 Màu ngọn lửa và chất tạo ra",
    explanation: "✅ Ngọn lửa XANH NHẠT, tạo ra NƯỚC (H₂O).",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Cân bằng: ___ H₂ + Fe₂O₃ → ___ Fe + ___ H₂O",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Hệ số H₂",
        correct: "3"
      },
      {
        id: 2,
        label: "Hệ số Fe",
        correct: "2"
      },
      {
        id: 3,
        label: "Hệ số H₂O",
        correct: "3"
      }
    ],
    options: [
      "2",
      "3",
      "3",
      "1"
    ],
    explanation: "✅ 3H₂ + Fe₂O₃ → 2Fe + 3H₂O",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tính khối lượng H₂ cần để khử hoàn toàn 16g CuO (Cu=64, O=16, H=1)?",
    options: [
      "0,2g",
      "0,4g",
      "0,8g",
      "1,6g"
    ],
    correctAnswer: 1,
    explanation: "✅ n(CuO)=16/80=0,2 mol → n(H₂)=0,2 mol → m(H₂)=0,2×2=0,4g",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong công nghiệp, phương pháp sản xuất H₂ từ CH₄: CH₄ + H₂O → CO + ___ H₂",
    correctAnswer: "3",
    hint: "💡 Hệ số của H₂",
    explanation: "✅ CH₄ + H₂O → CO + 3H₂",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích vai trò H₂ trong các phản ứng",
    pairs: [
      {
        left: "2H₂ + O₂ → 2H₂O",
        right: "H₂ bị oxi hóa"
      },
      {
        left: "H₂ + CuO → Cu + H₂O",
        right: "H₂ là chất khử"
      },
      {
        left: "H₂ + Cl₂ → 2HCl",
        right: "H₂ tạo hợp chất"
      },
      {
        left: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        right: "H₂ là sản phẩm"
      }
    ],
    explanation: "✅ Hoàn hảo! Bạn hiểu rõ vai trò của H₂.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Cho 6,5g Zn tác dụng với H₂SO₄ dư. Thể tích H₂ (đktc) thu được là? (Zn=65)",
    options: [
      "1,12 lít",
      "2,24 lít",
      "3,36 lít",
      "4,48 lít"
    ],
    correctAnswer: 1,
    explanation: "✅ n(Zn)=6,5/65=0,1 mol → n(H₂)=0,1 mol → V=0,1×22,4=2,24 lít",
    points: 10
  }
]
};
