module.exports = {
  classId: 8,
  chapterId: 2,
  lessonId: 14,
  title: "Bài 14: Tính theo phương trình hoá học",
  description: "Học cách giải các bài toán hóa học định lượng dựa vào phương trình hóa học, bao gồm cả bài toán chất dư và hiệu suất phản ứng.",
  level: "Advanced",
  order: 14,
  theory: `
    <h2>⚗️ Tính toán theo phương trình hóa học (PTHH)</h2>
    <p>PTHH là công cụ cốt lõi để giải các bài toán hóa học định lượng. Dựa vào PTHH, ta có thể tìm được khối lượng hoặc thể tích của các chất tham gia và sản phẩm.</p>
    
    <h3>1. Các bước tiến hành</h3>
    <p>Để giải một bài toán tính theo PTHH, ta thường thực hiện theo các bước sau:</p>
    <ol>
      <li><strong>Viết PTHH:</strong> Viết đúng và cân bằng phương trình phản ứng.</li>
      <li><strong>Chuyển đổi dữ liệu:</strong> Chuyển đổi các đại lượng đề bài cho (khối lượng, thể tích) về số mol.</li>
      <li><strong>Dựa vào PTHH:</strong> Dựa vào tỉ lệ mol trong phương trình để tìm số mol của chất cần tìm.</li>
      <li><strong>Chuyển đổi kết quả:</strong> Chuyển đổi số mol vừa tìm được thành khối lượng hoặc thể tích theo yêu cầu của đề bài.</li>
    </ol>
    
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <h4>Ví dụ: Đốt cháy hoàn toàn 6.5g Kẽm (Zn) trong khí Oxi (O₂), thu được Kẽm oxit (ZnO). Tính khối lượng ZnO thu được. (Zn=65, O=16)</h4>
      <p><strong>Bước 1:</strong> Viết và cân bằng PTHH.</p>
      <p style="text-align: center; font-weight: bold;">2Zn + O₂ → 2ZnO</p>
      <p><strong>Bước 2:</strong> Tính số mol Zn.</p>
      <p>n<sub>Zn</sub> = m / M = 6.5 / 65 = 0.1 mol.</p>
      <p><strong>Bước 3:</strong> Dựa vào PTHH tìm số mol ZnO.</p>
      <p>Theo PTHH, tỉ lệ n<sub>Zn</sub> : n<sub>ZnO</sub> = 2 : 2 = 1 : 1.</p>
      <p>Vậy n<sub>ZnO</sub> = n<sub>Zn</sub> = 0.1 mol.</p>
      <p><strong>Bước 4:</strong> Tính khối lượng ZnO.</p>
      <p>M<sub>ZnO</sub> = 65 + 16 = 81 g/mol.</p>
      <p>m<sub>ZnO</sub> = n × M = 0.1 × 81 = 8.1g.</p>
      <p><strong>Kết quả:</strong> Khối lượng ZnO thu được là 8.1g.</p>
    </div>

    <h3>2. Bài toán liên quan đến chất dư</h3>
    <p>Khi cho hai chất tham gia phản ứng, có thể một chất sẽ hết trước, chất còn lại sẽ dư. Bài toán sẽ được tính theo chất hết.</p>
    <p>Để xác định chất nào hết, ta lấy số mol của mỗi chất chia cho hệ số tương ứng của nó trong PTHH. So sánh hai kết quả, kết quả nào nhỏ hơn thì chất đó hết trước.</p>
    
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <h4>Ví dụ: Cho 13g Zn tác dụng với dung dịch chứa 0.4 mol HCl. Tính thể tích khí H₂ (đktc) thu được.</h4>
      <p><strong>PTHH:</strong> Zn + 2HCl → ZnCl₂ + H₂</p>
      <p><strong>Số mol:</strong> n<sub>Zn</sub> = 13 / 65 = 0.2 mol; n<sub>HCl</sub> = 0.4 mol.</p>
      <p><strong>Xét tỉ lệ:</strong></p>
      <ul>
        <li>Zn: 0.2 / 1 = 0.2</li>
        <li>HCl: 0.4 / 2 = 0.2</li>
      </ul>
      <p>Tỉ lệ bằng nhau, vậy cả hai chất đều phản ứng hết. Ta có thể tính theo Zn hoặc HCl.</p>
      <p>Theo PTHH, n<sub>H₂</sub> = n<sub>Zn</sub> = 0.2 mol.</p>
      <p>V<sub>H₂</sub> = n × 22.4 = 0.2 × 22.4 = 4.48 lít.</p>
    </div>
  `,
  game: [
{
        type: "multiple-choice",
        question: "Trong PTHH: 2H₂ + O₂ → 2H₂O, tỉ lệ số mol của H₂, O₂, H₂O là:",
        options: ["2:1:2", "1:1:1", "2:2:2", "1:2:1"],
        correctAnswer: 0,
        explanation: "✅ Tỉ lệ mol chính là hệ số cân bằng của các chất trong phương trình.",
        points: 10
      },
      {
        type: "true-false",
        question: "Để tính toán theo PTHH, bước đầu tiên luôn là cân bằng phương trình.",
        correctAnswer: true,
        explanation: "✅ Đúng, phương trình phải được cân bằng để đảm bảo định luật bảo toàn khối lượng.",
        points: 10
      },
      {
        type: "multiple-choice",
        question: "Oxi là chất khí không màu, không mùi.",
        correctAnswer: true,
        explanation: "✅ Đúng! Oxi không màu, không mùi.",
        points: 10
      },
      {
            type: "multiple-choice",
            question: "Khối lượng mol của O₂ là:",
            options: [
                  "16 g/mol",
                  "24 g/mol",
                  "32 g/mol",
                  "48 g/mol"
            ],
            "correctAnswer": 2,
            "explanation": "✅ M(O₂) = 2 × 16 = 32 g/mol",
            "points": 10
      },
      {
            "type": "true-false",
            "question": "Oxi là chất oxi hóa mạnh.",
            "correctAnswer": true,
            "explanation": "✅ Đúng! Oxi dễ dàng phản ứng với nhiều chất.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Sản phẩm của phản ứng: C + O₂ → ?",
            "options": [
                  "CO",
                  "CO₂",
                  "C₂O",
                  "CO₃"
            ],
            "correctAnswer": 1,
            "explanation": "✅ C + O₂ → CO₂",
            "points": 10
      },
{
            "type": "matching",
            "question": "🔗 Ghép phản ứng với hiện tượng",
            "pairs": [
                  {
                        "left": "P cháy trong O₂",
                        "right": "Khói trắng"
                  },
                  {
                        "left": "S cháy trong O₂",
                        "right": "Khí mùi hắc"
                  },
                  {
                        "left": "Mg cháy trong O₂",
                        "right": "Ánh sáng chói"
                  }
            ],
            "explanation": "✅ Tuyệt vời! Bạn nhận biết đúng hiện tượng.",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Oxi ít tan trong nước, giúp ___ sống dưới nước.",
            "correctAnswer": "sinh vật",
            "hint": "💡 Cá, tôm, cua...",
            "explanation": "✅ Oxi hòa tan giúp sinh vật sống dưới nước.",
            "points": 10
      },
      {
            "type": "ordering",
            "question": "📋 Sắp xếp theo độ hoạt động với O₂ (tăng dần)",
            "options": [
                  "Cu",
                  "Fe",
                  "Mg",
                  "Au"
            ],
            "correctOrder": [
                  "Au",
                  "Cu",
                  "Fe",
                  "Mg"
            ],
            "explanation": "✅ Au < Cu < Fe < Mg (Mg hoạt động mạnh nhất)",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Ứng dụng nào KHÔNG phải của oxi?",
            "options": [
                  "Hô hấp nhân tạo",
                  "Hàn cắt kim loại",
                  "Làm chất bảo quản thực phẩm",
                  "Sản xuất thép"
            ],
            "correctAnswer": 2,
            "explanation": "✅ Oxi không dùng bảo quản thực phẩm (dùng N₂ hoặc CO₂)",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Tỉ khối của O₂ so với không khí là ___ (làm tròn 1 chữ số)",
            "correctAnswer": "1.1",
            "hint": "💡 d = M_O₂ / M_kk = 32/29",
            "explanation": "✅ d = 32/29 ≈ 1,1",
            "points": 10
      },
{
            "type": "drag-drop",
            "question": "🧩 Hoàn thành phương trình cháy của Photpho",
            "inline": true,
            "slots": [
                  {
                        "id": 1,
                        "label": "Hệ số P",
                        "correct": "4"
                  },
                  {
                        "id": 2,
                        "label": "Hệ số O₂",
                        "correct": "5"
                  },
                  {
                        "id": 3,
                        "label": "Sản phẩm",
                        "correct": "P₂O₅"
                  }
            ],
            "options": [
                  "4",
                  "5",
                  "P₂O₅",
                  "PO₂"
            ],
            "explanation": "✅ 4P + 5O₂ → 2P₂O₅",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Đốt cháy hoàn toàn 9,3g P trong oxi. Khối lượng P₂O₅ tạo thành?",
            "options": [
                  "14,2g",
                  "21,3g",
                  "28,4g",
                  "42,6g"
            ],
            "correctAnswer": 1,
            "explanation": "✅ n_P = 9,3/31 = 0,3 mol → n_P₂O₅ = 0,15 mol → m = 21,3g",
            "points": 10
      },
      {
            "type": "fill-in-blank",
            "question": "Để đốt cháy hết 16g S cần ___ lít O₂ (đktc)",
            "correctAnswer": "11.2",
            "hint": "💡 S + O₂ → SO₂; n_S = 16/32 = 0,5 mol",
            "explanation": "✅ n_O₂ = 0,5 mol → V = 11,2 lít",
            "points": 10
      },
      {
            "type": "matching",
            "question": "🧠 Ghép kim loại với màu oxit",
            "pairs": [
                  {
                        "left": "CuO",
                        "right": "Màu đen"
                  },
                  {
                        "left": "MgO",
                        "right": "Màu trắng"
                  },
                  {
                        "left": "Fe₃O₄",
                        "right": "Màu đen"
                  }
            ],
            "explanation": "✅ Xuất sắc! Bạn nhớ màu sắc các oxit.",
            "points": 10
      },
      {
            "type": "multiple-choice",
            "question": "Trong không khí có 210ml O₂. Thể tích không khí là bao nhiêu ml?",
            "options": [
                  "500ml",
                  "1000ml",
                  "1500ml",
                  "2000ml"
            ],
            "correctAnswer": 1,
            "explanation": "✅ V_kk = 210/0,21 = 1000ml (O₂ chiếm 21%)",
            "points": 10
      }

  ]
};
