module.exports = {
  classId: 8,
  chapterId: 4,
  lessonId: 24,
  title: "Bài 24: Kim loại - Tính chất vật lý và hóa học chung",
  description: "Tìm hiểu về các tính chất vật lý đặc trưng và các tính chất hóa học chung của kim loại, cùng với dãy hoạt động hóa học.",
  level: "Beginner",
  order: 24,
  theory: `
    <h2>🔩 Bài 24: Kim loại - Tính chất chung</h2>
    <p>Kim loại là nhóm nguyên tố phổ biến nhất, chiếm hơn 80% các nguyên tố hóa học. Chúng có nhiều ứng dụng quan trọng trong đời sống và kỹ thuật.</p>
    
    <h3>I. Tính chất vật lý chung</h3>
    <p>Hầu hết các kim loại đều có những tính chất vật lý đặc trưng sau:</p>
    <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li><strong>Tính dẻo:</strong> Có thể rèn, kéo sợi, dát mỏng (Vàng là kim loại dẻo nhất).</li>
        <li><strong>Tính dẫn điện:</strong> Dẫn điện tốt, giảm dần theo thứ tự: Bạc > Đồng > Vàng > Nhôm > Sắt.</li>
        <li><strong>Tính dẫn nhiệt:</strong> Dẫn nhiệt tốt, thường kim loại nào dẫn điện tốt thì cũng dẫn nhiệt tốt.</li>
        <li><strong>Ánh kim:</strong> Có vẻ sáng lấp lánh do khả năng phản xạ ánh sáng.</li>
      </ul>
      <p>Ngoài ra, kim loại còn có các tính chất riêng như khối lượng riêng, nhiệt độ nóng chảy, độ cứng khác nhau. Ví dụ: Liti là kim loại nhẹ nhất, Crom cứng nhất, Vonfram có nhiệt độ nóng chảy cao nhất, Thủy ngân ở thể lỏng ở điều kiện thường.</p>
    </div>

    <h3>II. Tính chất hóa học chung</h3>
    <p>Tính chất hóa học đặc trưng của kim loại là <strong>tính khử</strong> (dễ nhường electron).</p>
    <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
      <h4>1. Tác dụng với phi kim</h4>
      <p>Hầu hết kim loại tác dụng với nhiều phi kim, đặc biệt là oxi và clo.</p>
      <ul>
        <li><strong>Tác dụng với oxi:</strong> Hầu hết kim loại (trừ Au, Pt, Ag) phản ứng với oxi tạo thành oxit.</li>
        <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">2Mg + O₂ --(t°)--> 2MgO</div>
        <li><strong>Tác dụng với phi kim khác (Cl₂, S...):</strong></li>
        <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">2Fe + 3Cl₂ --(t°)--> 2FeCl₃</div>
      </ul>

      <h4>2. Tác dụng với dung dịch axit</h4>
      <p>Nhiều kim loại tác dụng với dung dịch axit (HCl, H₂SO₄ loãng) tạo muối và giải phóng khí hiđro.</p>
      <p><strong>Điều kiện:</strong> Kim loại phải đứng trước Hiđro (H) trong dãy hoạt động hóa học.</p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">Fe + 2HCl → FeCl₂ + H₂↑</div>
      <p><em>Lưu ý: Kim loại tác dụng với HNO₃ hoặc H₂SO₄ đặc không giải phóng H₂.</em></p>

      <h4>3. Tác dụng với dung dịch muối</h4>
      <p>Kim loại hoạt động hơn có thể đẩy kim loại yếu hơn ra khỏi dung dịch muối của nó.</p>
      <p><strong>Điều kiện:</strong> Kim loại đứng trước (trừ các kim loại tan trong nước như Na, K, Ca...) đẩy kim loại đứng sau ra khỏi muối.</p>
      <div style="text-align: center; font-size: 1.1em; margin: 10px 0;">Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓</div>
    </div>

    <h3>III. Dãy hoạt động hóa học của kim loại</h3>
    <div style="background: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 15px 0;">
      <p>Dãy hoạt động hóa học sắp xếp các kim loại theo chiều giảm dần mức độ hoạt động hóa học.</p>
      <p style="text-align: center; font-weight: bold; font-size: 1.2em;">
        K, Na, Ba, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, (H), Cu, Hg, Ag, Pt, Au
      </p>
      <p><strong>Ý nghĩa:</strong></p>
      <ol>
        <li>Mức độ hoạt động giảm dần từ trái sang phải.</li>
        <li>Kim loại đứng trước H phản ứng với axit (HCl, H₂SO₄ loãng) giải phóng H₂.</li>
        <li>Kim loại đứng trước (trừ K, Na, Ba, Ca) đẩy kim loại đứng sau ra khỏi dung dịch muối.</li>
      </ol>
    </div>
  `,
  game: [
  {
    type: "multiple-choice",
    question: "Tính chất vật lý nào sau đây KHÔNG phải là tính chất chung của kim loại?",
    options: [
      "Tính dẻo",
      "Tính dẫn điện",
      "Tính tan trong nước",
      "Ánh kim"
    ],
    correctAnswer: 2,
    explanation: "✅ Hầu hết các kim loại không tan trong nước. Chỉ một số kim loại kiềm và kiềm thổ tan được.",
    points: 10
  },
  {
    type: "true-false",
    question: "Kim loại Đồng (Cu) dẫn điện tốt hơn kim loại Bạc (Ag).",
    correctAnswer: false,
    explanation: "❌ Sai, Bạc là kim loại dẫn điện tốt nhất, sau đó mới đến Đồng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Tính chất hóa học đặc trưng của kim loại là gì?",
    options: [
      "Tính oxi hóa",
      "Tính khử",
      "Tính axit",
      "Tính bazơ"
    ],
    correctAnswer: 1,
    explanation: "✅ Kim loại dễ nhường electron, thể hiện tính khử. M → Mⁿ⁺ + ne.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Kim loại nào sau đây ở trạng thái lỏng ở điều kiện thường?",
    correctAnswer: "Thủy ngân",
    hint: "Hg",
    explanation: "✅ Thủy ngân (Hg) là kim loại duy nhất ở thể lỏng ở nhiệt độ phòng.",
    points: 10
  },
  {
    type: "true-false",
    question: "Sắt (Fe) có thể đẩy Đồng (Cu) ra khỏi dung dịch muối CuSO₄.",
    correctAnswer: true,
    explanation: "✅ Đúng, vì trong dãy hoạt động hóa học, Sắt đứng trước Đồng.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Kim loại nào sau đây KHÔNG tác dụng với dung dịch HCl?",
    options: [
      "Mg",
      "Al",
      "Fe",
      "Cu"
    ],
    correctAnswer: 3,
    explanation: "✅ Đồng (Cu) đứng sau Hiđro trong dãy hoạt động hóa học nên không phản ứng với HCl.",
    points: 10
  },
  {
    type: "matching",
    question: "🔗 Ghép kim loại với đặc điểm nổi bật của nó.",
    pairs: [
      {
        left: "Vàng (Au)",
        right: "Dẻo nhất"
      },
      {
        left: "Crom (Cr)",
        right: "Cứng nhất"
      },
      {
        left: "Vonfram (W)",
        right: "Nhiệt độ nóng chảy cao nhất"
      },
      {
        left: "Liti (Li)",
        right: "Nhẹ nhất"
      }
    ],
    explanation: "✅ Mỗi kim loại có những tính chất vật lý riêng biệt, tạo nên ứng dụng đa dạng của chúng.",
    points: 10
  },
  {
    type: "ordering",
    question: "📋 Sắp xếp các kim loại sau theo chiều tăng dần mức độ hoạt động hóa học: Fe, Cu, Al, Ag.",
    options: [
      "Ag",
      "Cu",
      "Fe",
      "Al"
    ],
    correctOrder: [
      "Ag",
      "Cu",
      "Fe",
      "Al"
    ],
    explanation: "✅ Dựa vào dãy hoạt động hóa học: ...Al, Fe, ..., Cu, Ag...",
    points: 10
  },
  {
    type: "drag-drop",
    question: "🧩 Hoàn thành phương trình: Zn + ? → ZnCl₂ + H₂↑",
    inline: true,
    slots: [
      {
        id: 1,
        label: "Axit",
        correct: "2HCl"
      }
    ],
    options: [
      "2HCl",
      "Cl₂",
      "H₂O",
      "2NaCl"
    ],
    explanation: "✅ Kẽm (Zn) đứng trước H nên tác dụng với axit HCl tạo muối kẽm clorua và giải phóng khí hiđro.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Khi cho Natri (Na) vào dung dịch CuSO₄, hiện tượng xảy ra là:",
    options: [
      "Có lớp đồng màu đỏ bám vào Na",
      "Dung dịch mất màu xanh và có khí thoát ra",
      "Chỉ có khí thoát ra",
      "Không có hiện tượng gì"
    ],
    correctAnswer: 1,
    explanation: "✅ Na là kim loại mạnh, sẽ phản ứng với nước trước: 2Na + 2H₂O → 2NaOH + H₂↑ (khí). Sau đó: 2NaOH + CuSO₄ → Cu(OH)₂↓ (kết tủa xanh) + Na₂SO₄. Dung dịch sẽ nhạt màu xanh.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Ngâm một lá kẽm trong 100ml dung dịch CuSO₄ 0.1M. Sau phản ứng, khối lượng lá kẽm sẽ thay đổi như thế nào? (Zn=65, Cu=64)",
    options: [
      "Tăng 0.1g",
      "Giảm 0.1g",
      "Tăng 0.01g",
      "Giảm 0.01g"
    ],
    correctAnswer: 3,
    explanation: "✅ Zn + CuSO₄ → ZnSO₄ + Cu. nCuSO₄ = 0.1 * 0.1 = 0.01 mol. Cứ 1 mol Zn (65g) phản ứng sẽ tạo ra 1 mol Cu (64g) bám vào. Khối lượng lá kẽm giảm 65 - 64 = 1g. Vậy với 0.01 mol, khối lượng giảm 0.01g.",
    points: 10
  },
  {
    type: "true-false",
    question: "Dây tóc bóng đèn thường được làm bằng Vonfram vì Vonfram dẫn điện tốt nhất.",
    correctAnswer: false,
    explanation: "❌ Sai. Dây tóc bóng đèn làm bằng Vonfram vì nó có nhiệt độ nóng chảy rất cao (~3422°C), không phải vì nó dẫn điện tốt nhất (Bạc mới dẫn điện tốt nhất).",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Để bảo vệ vỏ tàu biển làm bằng thép (hợp kim của Fe), người ta thường gắn các tấm kim loại nào sau đây vào vỏ tàu?",
    options: [
      "Đồng (Cu)",
      "Chì (Pb)",
      "Kẽm (Zn)",
      "Bạc (Ag)"
    ],
    correctAnswer: 2,
    explanation: "✅ Đây là phương pháp chống ăn mòn điện hóa. Kẽm có tính khử mạnh hơn Sắt, nên nó sẽ bị ăn mòn thay cho Sắt, bảo vệ vỏ tàu. Kẽm đóng vai trò là 'vật hi sinh'.",
    points: 10
  },
  {
    type: "fill-in-blank",
    question: "Khi đốt sắt trong khí clo dư, muối sắt tạo thành có hóa trị ___.",
    correctAnswer: "III",
    hint: "💡 Clo là chất oxi hóa rất mạnh.",
    explanation: "✅ 2Fe + 3Cl₂ --(t°)--> 2FeCl₃. Clo là chất oxi hóa mạnh nên sẽ oxi hóa sắt lên hóa trị cao nhất là +3.",
    points: 10
  },
  {
    type: "multiple-choice",
    question: "Hỗn hợp bột gồm Al và Fe₂O₃ được gọi là hỗn hợp tecmit, dùng để hàn đường ray. Phản ứng này là phản ứng:",
    options: [
      "Nhiệt phân",
      "Nhiệt nhôm",
      "Trung hòa",
      "Trao đổi"
    ],
    correctAnswer: 1,
    explanation: "✅ Phản ứng nhiệt nhôm: 2Al + Fe₂O₃ --(t°)--> Al₂O₃ + 2Fe. Phản ứng tỏa ra lượng nhiệt rất lớn làm sắt nóng chảy.",
    points: 10
  }
]
};
