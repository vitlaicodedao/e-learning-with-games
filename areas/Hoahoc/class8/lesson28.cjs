module.exports = {
  classId: 8,
  chapterId: 4,
  lessonId: 28,
  title: "Bài 28: Bài thực hành 4 - Tổng hợp Chương 4",
  description: "Tìm hiểu cấu trúc của Bảng tuần hoàn, quy luật biến đổi tính chất của các nguyên tố và ý nghĩa của nó trong hóa học.",
  level: "Intermediate",
  order: 28,
  theory: `
    <h2>📜 Bảng tuần hoàn các nguyên tố hóa học</h2>
    <p>Bảng tuần hoàn, do nhà hóa học Dmitri Mendeleev khởi xướng, là một công cụ vô giá giúp hệ thống hóa kiến thức về các nguyên tố hóa học.</p>
    
    <h3>I. Nguyên tắc sắp xếp các nguyên tố</h3>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <p>Các nguyên tố trong bảng tuần hoàn hiện đại được sắp xếp theo chiều tăng dần của <strong>điện tích hạt nhân</strong> nguyên tử.</p>
    </div>

    <h3>II. Cấu tạo của Bảng tuần hoàn</h3>
    <p>Bảng tuần hoàn gồm có các ô nguyên tố, chu kỳ và nhóm.</p>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <h4>1. Ô nguyên tố</h4>
      <p>Mỗi ô cho biết: Số hiệu nguyên tử, Kí hiệu hóa học, Tên nguyên tố, và Nguyên tử khối.</p>
      <p><strong>Số hiệu nguyên tử = số proton = số electron.</strong></p>

      <h4>2. Chu kỳ</h4>
      <p>Chu kỳ là một hàng ngang trong bảng tuần hoàn. Các nguyên tố trong cùng một chu kỳ có <strong>cùng số lớp electron</strong>.</p>
      <ul>
        <li>Bảng tuần hoàn có 7 chu kỳ.</li>
        <li>Số thứ tự của chu kỳ bằng số lớp electron.</li>
      </ul>

      <h4>3. Nhóm</h4>
      <p>Nhóm là một cột dọc trong bảng tuần hoàn. Các nguyên tố trong cùng một nhóm (nhóm A) có <strong>cùng số electron lớp ngoài cùng</strong>.</p>
      <ul>
        <li>Số thứ tự của nhóm A bằng số electron lớp ngoài cùng.</li>
        <li>Các nguyên tố trong cùng một nhóm có tính chất hóa học tương tự nhau.</li>
        <li><strong>Nhóm IA:</strong> Gồm các kim loại kiềm (rất hoạt động).</li>
        <li><strong>Nhóm VIIA:</strong> Gồm các phi kim halogen (rất hoạt động).</li>
        <li><strong>Nhóm VIIIA:</strong> Gồm các khí hiếm (rất trơ).</li>
      </ul>
    </div>

    <h3>III. Sự biến đổi tuần hoàn tính chất của các nguyên tố</h3>
    <p>Khi đi từ trái sang phải trong một chu kỳ, hoặc từ trên xuống dưới trong một nhóm, tính chất của các nguyên tố biến đổi một cách có quy luật.</p>
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <h4>1. Trong một chu kỳ (theo chiều tăng dần điện tích hạt nhân)</h4>
      <ul>
        <li><strong>Tính kim loại giảm dần, tính phi kim tăng dần.</strong></li>
        <li>Bắt đầu chu kỳ là một kim loại kiềm mạnh, kết thúc là một phi kim halogen mạnh, cuối cùng là một khí hiếm.</li>
      </ul>
      <p>Ví dụ chu kỳ 3: Na (kim loại mạnh) → Mg → Al → Si → P → S → Cl (phi kim mạnh) → Ar (khí hiếm).</p>

      <h4>2. Trong một nhóm A (theo chiều tăng dần điện tích hạt nhân)</h4>
      <ul>
        <li><strong>Tính kim loại tăng dần, tính phi kim giảm dần.</strong></li>
      </ul>
      <p>Ví dụ nhóm IA: Li → Na → K... (tính kim loại tăng dần).</p>
      <p>Ví dụ nhóm VIIA: F → Cl → Br → I... (tính phi kim giảm dần).</p>
    </div>

    <h3>IV. Ý nghĩa của Bảng tuần hoàn</h3>
    <div style="background: #fdf2f8; padding: 15px; border-left: 4px solid #db2777; margin: 15px 0;">
      <ol>
        <li><strong>Biết vị trí, suy ra cấu tạo và tính chất:</strong> Khi biết vị trí của một nguyên tố (chu kỳ, nhóm), ta có thể suy ra cấu tạo nguyên tử (số p, số e, số lớp e, số e lớp ngoài cùng) và dự đoán tính chất hóa học cơ bản của nó (là kim loại, phi kim hay khí hiếm; hoạt động mạnh hay yếu).</li>
        <li><strong>Biết cấu tạo, suy ra vị trí và tính chất:</strong> Ngược lại, khi biết cấu tạo nguyên tử, ta có thể xác định vị trí và dự đoán tính chất của nó.</li>
        <li><strong>So sánh tính chất:</strong> Dựa vào quy luật biến đổi, ta có thể so sánh tính chất của một nguyên tố với các nguyên tố lân cận.</li>
      </ol>
    </div>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Các nguyên tố trong bảng tuần hoàn được sắp xếp theo chiều tăng dần của đại lượng nào?",
    options: [
      "Nguyên tử khối",
      "Số nơtron",
      "Điện tích hạt nhân",
      "Bán kính nguyên tử"
    ],
    correctAnswer: 2,
    explanation: "✅ Điện tích hạt nhân (hay số hiệu nguyên tử Z) là cơ sở để sắp xếp các nguyên tố trong bảng tuần hoàn hiện đại.",
    points: 10
  },
  {
    type: "true-false",
    question: "Các nguyên tố trong cùng một chu kỳ có cùng số electron lớp ngoài cùng.",
    correctAnswer: false,
    explanation: "❌ Sai. Các nguyên tố trong cùng một CHU KỲ có cùng SỐ LỚP ELECTRON. Các nguyên tố trong cùng một NHÓM A mới có cùng số electron lớp ngoài cùng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Nguyên tố Natri (Na) có số hiệu nguyên tử là 11. Nó thuộc chu kỳ và nhóm nào?",
    options: [
      "Chu kỳ 3, nhóm IA",
      "Chu kỳ 1, nhóm IIIA",
      "Chu kỳ 3, nhóm IIA",
      "Chu kỳ 2, nhóm IA"
    ],
    correctAnswer: 0,
    explanation: "✅ Cấu hình e của Na (Z=11) là 2-8-1. Có 3 lớp e → Chu kỳ 3. Có 1 e lớp ngoài cùng → Nhóm IA.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Trong một chu kỳ, khi đi từ trái sang phải, tính kim loại ___.",
    correctAnswer: "giảm dần",
    explanation: "✅ Tính kim loại giảm dần, đồng thời tính phi kim tăng dần.",
    points: 10
  },
  {
    type: "true-false",
    question: "Nhóm VIIIA trong bảng tuần hoàn chứa các kim loại hoạt động mạnh.",
    correctAnswer: false,
    explanation: "❌ Sai, nhóm VIIIA chứa các khí hiếm, là những nguyên tố rất trơ về mặt hóa học.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Nguyên tố X có 3 lớp electron và 7 electron lớp ngoài cùng. X là nguyên tố nào?",
    options: [
      "Flo (F)",
      "Lưu huỳnh (S)",
      "Clo (Cl)",
      "Photpho (P)"
    ],
    correctAnswer: 2,
    explanation: "✅ 3 lớp electron → Chu kỳ 3. 7 electron lớp ngoài cùng → Nhóm VIIA. Nguyên tố đó là Clo (Cl).",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép nhóm với tên gọi đặc trưng của nó.",
    pairs: [
      {
        left: "Nhóm IA",
        right: "Kim loại kiềm"
      },
      {
        left: "Nhóm IIA",
        right: "Kim loại kiềm thổ"
      },
      {
        left: "Nhóm VIIA",
        right: "Halogen"
      },
      {
        left: "Nhóm VIIIA",
        right: "Khí hiếm"
      }
    ],
    explanation: "✅ Đây là tên gọi của các nhóm A tiêu biểu trong bảng tuần hoàn.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các nguyên tố sau theo chiều tăng dần tính phi kim: P, S, Cl, Si.",
    options: [
      "Si",
      "P",
      "S",
      "Cl"
    ],
    correctOrder: [
      "Si",
      "P",
      "S",
      "Cl"
    ],
    explanation: "✅ Các nguyên tố này cùng thuộc chu kỳ 3. Theo chiều từ trái sang phải, tính phi kim tăng dần.",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành: Trong chu kỳ, khi đi từ trái sang phải, tính kim loại __.",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Quy luật",
        correct: "giảm dần"
      }
    ],
    options: [
      "giảm dần",
      "tăng dần",
      "không đổi",
      "tăng rồi giảm"
    ],
    explanation: "✅ Trong chu kỳ, theo chiều từ trái sang phải, tính kim loại giảm dần, tính phi kim tăng dần.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Vị trí của nguyên tố có Z=16 trong bảng tuần hoàn là:",
    options: [
      "Chu kỳ 3, nhóm IVA",
      "Chu kỳ 3, nhóm VIA",
      "Chu kỳ 4, nhóm VIA",
      "Chu kỳ 2, nhóm VIA"
    ],
    correctAnswer: 1,
    explanation: "✅ Cấu hình e của S (Z=16) là 2-8-6. Có 3 lớp e → Chu kỳ 3. Có 6 e lớp ngoài cùng → Nhóm VIA.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Oxit cao nhất của một nguyên tố R có công thức RO₃. R thuộc nhóm nào?",
    options: [
      "Nhóm IIIA",
      "Nhóm IVA",
      "Nhóm VA",
      "Nhóm VIA"
    ],
    correctAnswer: 3,
    explanation: "✅ Trong oxit cao nhất, hóa trị của R là VI (vì O hóa trị II). Hóa trị cao nhất với oxi bằng số thứ tự nhóm A. Vậy R thuộc nhóm VIA.",
    points: 10
  },
  {
    type: "true-false",
    question: "Bán kính nguyên tử của các nguyên tố trong cùng một chu kỳ tăng dần từ trái sang phải.",
    correctAnswer: false,
    explanation: "❌ Sai. Trong một chu kỳ, đi từ trái sang phải, điện tích hạt nhân tăng, lực hút giữa hạt nhân và electron lớp ngoài cùng mạnh hơn, làm bán kính nguyên tử GIẢM dần.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "So sánh tính axit của các hiđroxit sau: H₂SiO₃, H₃PO₄, H₂SO₄, HClO₄.",
    options: [
      "H₂SiO₃ < H₃PO₄ < H₂SO₄ < HClO₄",
      "HClO₄ < H₂SO₄ < H₃PO₄ < H₂SiO₃",
      "H₂SiO₃ < H₂SO₄ < H₃PO₄ < HClO₄",
      "Không so sánh được"
    ],
    correctAnswer: 0,
    explanation: "✅ Các nguyên tố Si, P, S, Cl cùng thuộc chu kỳ 3. Đi từ trái sang phải, tính phi kim tăng dần, do đó tính axit của các oxit và hiđroxit tương ứng cũng tăng dần.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Nguyên tố R tạo hợp chất khí với hiđro có công thức RH₃. Trong bảng tuần hoàn, R thuộc nhóm ___.",
    correctAnswer: "VA",
    hint: "💡 Hóa trị của R trong hợp chất với H là 3.",
    explanation: "✅ Hóa trị của phi kim trong hợp chất khí với hiđro = 8 - số thứ tự nhóm. Vì hóa trị là 3, nên số thứ tự nhóm là 8 - 3 = 5. Vậy R thuộc nhóm VA.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Nguyên tử của nguyên tố X có tổng số hạt (p, n, e) là 40. Số hạt mang điện nhiều hơn số hạt không mang điện là 12. X là nguyên tố nào?",
    options: [
      "Mg (Z=12)",
      "Al (Z=13)",
      "Na (Z=11)",
      "Si (Z=14)"
    ],
    correctAnswer: 1,
    explanation: "✅ Ta có hệ: (p+e)+n = 40 và (p+e)-n = 12. Mà p=e, nên 2p+n=40 và 2p-n=12. Giải hệ, ta được p=13, n=14. Z=p=13, vậy X là Nhôm (Al).",
    points: 10
  }
]
};
