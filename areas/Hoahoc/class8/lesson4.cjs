module.exports = {
  classId: 8,
  chapterId: 1,
  lessonId: 4,
  title: "Bài 4: Nguyên tử",
  description: "Tìm hiểu cấu tạo nguyên tử, hạt nhân và lớp vỏ electron",
  level: "Beginner",
  order: 4,
  theory: `
      <h2>⚛️ Nguyên tử</h2>
      
      <h3>📚 Khái niệm</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <p><strong>Nguyên tử</strong> là hạt vô cùng nhỏ, trung hòa về điện, là đơn vị cấu tạo nên chất.</p>
        <p>Kích thước: khoảng 10⁻¹⁰ m</p>
      </div>

      <h3>🔬 Cấu tạo nguyên tử</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>1. Hạt nhân (+)</h4>
        <p>• Gồm: <strong>Proton (+)</strong> và <strong>Neutron (không mang điện)</strong></p>
        <p>• Mang điện tích dương</p>
        <p>• Chiếm phần lớn khối lượng nguyên tử</p>
        
        <h4>2. Lớp vỏ (-)</h4>
        <p>• Gồm: <strong>Electron (-)</strong></p>
        <p>• Chuyển động xung quanh hạt nhân</p>
        <p>• Khối lượng rất nhỏ</p>
      </div>

      <h3>⚡ Các hạt cơ bản</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #9ca3af; padding: 10px;">Hạt</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Điện tích</th>
          <th style="border: 1px solid #9ca3af; padding: 10px;">Khối lượng</th>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Proton (p)</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">+1</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">≈ 1</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Neutron (n)</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">0</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">≈ 1</td>
        </tr>
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 10px;">Electron (e)</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">-1</td>
          <td style="border: 1px solid #9ca3af; padding: 10px;">≈ 0</td>
        </tr>
      </table>

      <h3>💡 Tính trung hòa điện</h3>
      <p style="text-align: center; font-size: 18px; background: #fef3c7; padding: 15px;">
        <strong>Số proton = Số electron</strong>
      </p>
    `,
  game: [
    {
      type: "multiple-choice",
      question: "Nguyên tử là gì?",
      options: [
        "Hạt lớn nhất trong tự nhiên",
        "Hạt vô cùng nhỏ, trung hòa điện",
        "Chỉ có ở phòng thí nghiệm",
        "Không tồn tại"
      ],
      correctAnswer: 1,
      explanation: "✅ Nguyên tử là hạt vô cùng nhỏ, trung hòa về điện.",
      points: 10
    },
      {
        type: "true-false",
        question: "Hạt nhân nguyên tử mang điện tích dương.",
        correctAnswer: true,
        explanation: "✅ Đúng! Hạt nhân có proton (+) nên mang điện dương.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Hạt nào mang điện tích âm?",
        options: ["Proton", "Neutron", "Electron", "Hạt nhân"],
        correctAnswer: 2,
        explanation: "✅ Electron mang điện tích âm (-1).",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Hạt nhân nguyên tử gồm proton và ___.",
        correctAnswer: "neutron",
        hint: "💡 Hạt không mang điện",
        explanation: "✅ Hạt nhân = Proton + Neutron.",
        points: 10
      },
      {
        type: "true-false",
        question: "Nguyên tử trung hòa về điện vì số proton bằng số electron.",
        correctAnswer: true,
        explanation: "✅ Đúng! Điện tích (+) của proton cân bằng với (-) của electron.",
        points: 10
      },
    {
        type: "matching",
        question: "🔗 Ghép hạt với đặc điểm",
        pairs: [
          { left: "Proton", right: "Điện tích +1" },
          { left: "Electron", right: "Điện tích -1" },
          { left: "Neutron", right: "Không mang điện" },
          { left: "Hạt nhân", right: "Chứa p và n" }
        ],
        explanation: "✅ Tuyệt vời! Bạn phân biệt đúng các hạt.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Phần lớn khối lượng nguyên tử tập trung ở ___.",
        correctAnswer: "hạt nhân",
        hint: "💡 Nơi có proton và neutron",
        explanation: "✅ Khối lượng tập trung ở HẠT NHÂN (p và n nặng).",
        points: 10
      },
      {
        type: "ordering",
        question: "📋 Sắp xếp theo khối lượng tăng dần",
        options: ["Electron", "Proton", "Neutron"],
        correctOrder: ["Electron", "Proton", "Neutron"],
        explanation: "✅ Electron nhẹ nhất ≈ 0, Proton và Neutron ≈ 1.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tại sao nguyên tử trung hòa điện?",
        options: [
          "Vì không có điện tích",
          "Vì số p = số e",
          "Vì chỉ có neutron",
          "Vì rất nhỏ"
        ],
        correctAnswer: 1,
        explanation: "✅ Số proton (+) = Số electron (-) → Trung hòa điện.",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Electron chuyển động xung quanh ___.",
        correctAnswer: "hạt nhân",
        hint: "💡 Trung tâm nguyên tử",
        explanation: "✅ Electron chuyển động xung quanh HẠT NHÂN.",
        points: 10
      },
    {
        type: "drag-drop",
        question: "🧩 Hoàn thành: Nguyên tử gồm ___ ở trung tâm và ___ chuyển động xung quanh.",
        inline: true,
        slots: [
          { id: 1, label: "Phần 1", correct: "hạt nhân" },
          { id: 2, label: "Phần 2", correct: "electron" }
        ],
        options: ["hạt nhân", "electron", "proton", "neutron"],
        explanation: "✅ Nguyên tử = HẠT NHÂN + ELECTRON xung quanh.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Nguyên tử X có 11 proton và 12 neutron. Số electron là:",
        options: ["11", "12", "23", "Không xác định"],
        correctAnswer: 0,
        explanation: "✅ Số e = Số p = 11 (nguyên tử trung hòa điện).",
        points: 10
      },
      {
        type: "fill-in-blank",
        question: "Nếu nguyên tử có 8 electron thì có ___ proton.",
        correctAnswer: "8",
        hint: "💡 Nguyên tử trung hòa điện",
        explanation: "✅ Số p = Số e = 8.",
        points: 10
      },
      {
        type: "matching",
        question: "🧠 Phân tích cấu tạo nguyên tử",
        pairs: [
          { left: "Hạt nhân", right: "Proton + Neutron" },
          { left: "Lớp vỏ", right: "Electron" },
          { left: "Điện tích dương", right: "Proton" },
          { left: "Khối lượng chính", right: "Hạt nhân" }
        ],
        explanation: "✅ Xuất sắc! Bạn hiểu rõ cấu tạo nguyên tử.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Tại sao electron có khối lượng gần bằng 0?",
        options: [
          "Vì electron không tồn tại",
          "Vì electron rất nhẹ so với p và n",
          "Vì electron không có khối lượng",
          "Vì electron là ánh sáng"
        ],
        correctAnswer: 1,
        explanation: "✅ Electron có khối lượng ≈ 1/1840 khối lượng proton, gần bằng 0.",
        points: 10
      }
  ]
};
