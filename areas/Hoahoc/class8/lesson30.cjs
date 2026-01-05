module.exports = {
  classId: 8,
  chapterId: 4,
  lessonId: 30,
  title: "Bài 30: Phản ứng oxi hóa khử",
  description: "Tìm hiểu khái niệm và nhận biết phản ứng oxi hóa khử",
  level: "Intermediate",
  order: 30,
  theory: `
      <h2>⚡ Phản ứng oxi hóa - khử</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>Sự oxi hóa</h4>
        <p>Là sự <strong>nhận oxi</strong> hoặc <strong>mất hidro</strong></p>
        <p><em>Ví dụ:</em> 2Cu + O₂ → 2CuO (Cu bị oxi hóa)</p>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Sự khử</h4>
        <p>Là sự <strong>mất oxi</strong> hoặc <strong>nhận hidro</strong></p>
        <p><em>Ví dụ:</em> CuO + H₂ → Cu + H₂O (CuO bị khử)</p>
      </div>

      <h3>🔄 Phản ứng oxi hóa - khử</h3>
      <p>Là phản ứng hóa học trong đó <strong>có sự oxi hóa và sự khử xảy ra đồng thời</strong>.</p>
      
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
        <h4>Ví dụ minh họa:</h4>
        <p style="text-align: center; font-size: 18px;">
          <strong>CuO + H₂ → Cu + H₂O</strong>
        </p>
        <p>• CuO <span style="color: red;">bị khử</span> (mất O)</p>
        <p>• H₂ <span style="color: blue;">bị oxi hóa</span> (nhận O)</p>
      </div>

      <h3>🎯 Chất oxi hóa và chất khử</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Chất oxi hóa</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Chất khử</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">
            • Là chất nhận electron<br>
            • Bị khử trong phản ứng<br>
            • Ví dụ: O₂, CuO
          </td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">
            • Là chất cho electron<br>
            • Bị oxi hóa trong phản ứng<br>
            • Ví dụ: H₂, C, CO
          </td>
        </tr>
      </table>
    `,
  game: [
  {
    type: "multiple-choice",
    question: "Sự oxi hóa là gì?",
    options: [
      "Là sự mất oxi",
      "Là sự nhận oxi hoặc mất hidro",
      "Là sự nhận hidro",
      "Là sự không thay đổi"
    ],
    correctAnswer: 1,
    explanation: "✅ Sự oxi hóa là sự nhận oxi hoặc mất hidro.",
    points: 10
  },
  {
    type: "true-false",
    question: "Sự khử là sự mất oxi hoặc nhận hidro.",
    correctAnswer: true,
    explanation: "✅ Đúng! Sự khử ngược lại với sự oxi hóa.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trong phản ứng: 2Cu + O₂ → 2CuO, đồng (Cu) bị:",
    options: [
      "Oxi hóa",
      "Khử",
      "Không đổi",
      "Phân hủy"
    ],
    correctAnswer: 0,
    explanation: "✅ Cu nhận O nên bị OXI HÓA.",
    points: 10
  },
  {
    type: "true-false",
    question: "Trong phản ứng oxi hóa - khử, luôn có cả sự oxi hóa và sự khử xảy ra đồng thời.",
    correctAnswer: true,
    explanation: "✅ Đúng! Oxi hóa và khử luôn đi đôi với nhau.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Chất oxi hóa là chất:",
    options: [
      "Bị oxi hóa",
      "Bị khử",
      "Không đổi",
      "Bị phân hủy"
    ],
    correctAnswer: 1,
    explanation: "✅ Chất oxi hóa BỊ KHỬ trong phản ứng.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép chất với vai trò trong phản ứng",
    pairs: [
      {
        left: "O₂",
        right: "Chất oxi hóa"
      },
      {
        left: "H₂",
        right: "Chất khử"
      },
      {
        left: "CuO",
        right: "Chất oxi hóa"
      },
      {
        left: "C",
        right: "Chất khử"
      }
    ],
    explanation: "✅ Tuyệt vời! Bạn nhận biết đúng chất oxi hóa và chất khử.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong CuO + H₂ → Cu + H₂O, CuO bị ___ và H₂ bị ___.",
    correctAnswer: "khử, oxi hóa",
    hint: "💡 CuO mất O, H₂ nhận O",
    explanation: "✅ CuO bị KHỬ (mất O), H₂ bị OXI HÓA (nhận O).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Phản ứng nào KHÔNG phải là phản ứng oxi hóa - khử?",
    options: [
      "2H₂ + O₂ → 2H₂O",
      "CuO + H₂ → Cu + H₂O",
      "NaCl → Na⁺ + Cl⁻ (trong nước)",
      "C + O₂ → CO₂"
    ],
    correctAnswer: 2,
    explanation: "✅ NaCl tan trong nước là quá trình vật lý, không có oxi hóa - khử.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các bước nhận biết phản ứng oxi hóa - khử",
    options: [
      "Xác định chất nhận/mất oxi (hoặc hidro)",
      "Viết phương trình phản ứng",
      "Kết luận có phản ứng oxi hóa - khử",
      "Xác định chất oxi hóa và chất khử"
    ],
    correctOrder: [
      "Viết phương trình phản ứng",
      "Xác định chất nhận/mất oxi (hoặc hidro)",
      "Xác định chất oxi hóa và chất khử",
      "Kết luận có phản ứng oxi hóa - khử"
    ],
    explanation: "✅ Đúng trình tự phân tích phản ứng.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Chất khử là chất bị ___ trong phản ứng.",
    correctAnswer: "oxi hóa",
    hint: "💡 Chất khử cho electron",
    explanation: "✅ Chất khử bị OXI HÓA (cho electron).",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Trong phản ứng oxi hóa - khử, chất ___ bị ___, chất ___ bị ___.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Chất 1",
        correct: "oxi hóa"
      },
      {
        id: 2,
        label: "Trạng thái 1",
        correct: "khử"
      },
      {
        id: 3,
        label: "Chất 2",
        correct: "khử"
      },
      {
        id: 4,
        label: "Trạng thái 2",
        correct: "oxi hóa"
      }
    ],
    options: [
      "oxi hóa",
      "khử",
      "oxi hóa",
      "khử"
    ],
    explanation: "✅ Chất OXI HÓA bị KHỬ, chất KHỬ bị OXI HÓA.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Trong phản ứng: Fe₂O₃ + 3CO → 2Fe + 3CO₂, vai trò của CO là:",
    options: [
      "Chất oxi hóa",
      "Chất khử",
      "Không tham gia oxi hóa - khử",
      "Vừa oxi hóa vừa khử"
    ],
    correctAnswer: 1,
    explanation: "✅ CO nhận O từ Fe₂O₃, nên CO là CHẤT KHỬ (bị oxi hóa).",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong 2Mg + O₂ → 2MgO, Mg là chất ___ và O₂ là chất ___.",
    correctAnswer: "khử, oxi hóa",
    hint: "💡 Mg nhận O hay cho O?",
    explanation: "✅ Mg nhận O (bị oxi hóa) nên là CHẤT KHỬ, O₂ là CHẤT OXI HÓA.",
    points: 10
  },
  {
    type: "matching",
    question: "🧠 Phân tích phản ứng: C + 2CuO → CO₂ + 2Cu",
    pairs: [
      {
        left: "C",
        right: "Chất khử (bị oxi hóa)"
      },
      {
        left: "CuO",
        right: "Chất oxi hóa (bị khử)"
      },
      {
        left: "CO₂",
        right: "Sản phẩm oxi hóa"
      },
      {
        left: "Cu",
        right: "Sản phẩm khử"
      }
    ],
    explanation: "✅ Hoàn hảo! Bạn phân tích đúng vai trò từng chất.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tại sao phản ứng oxi hóa - khử rất quan trọng trong luyện kim?",
    options: [
      "Vì tạo ra nhiệt",
      "Vì khử oxit kim loại thành kim loại tự do",
      "Vì tạo ra khí",
      "Vì phản ứng nhanh"
    ],
    correctAnswer: 1,
    explanation: "✅ Luyện kim sử dụng phản ứng khử oxit thành kim loại: Fe₂O₃ + 3CO → 2Fe + 3CO₂",
    points: 10
  }
]
};
