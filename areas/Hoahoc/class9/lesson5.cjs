module.exports = {
  classId: 9,
  chapterId: 3,
  lessonId: 5,
  title: "Bài 5: Nước - Dung dịch",
  description: "Tính chất của nước và các loại dung dịch",
  level: "Beginner",
  order: 5,
  theory: `
      <h2>💧 Nước và Dung dịch</h2>
      
      <h3>🌊 Thành phần và tính chất của nước</h3>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0;">
        <h4>Thành phần</h4>
        <p>• <strong>Công thức:</strong> H₂O</p>
        <p>• Phân tử khối: 18</p>
        <p>• Thành phần khối lượng: H (11.11%), O (88.89%)</p>
        <p>• Cấu tạo: Phân tử gấp khúc, góc 104.5°</p>
      </div>

      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <h4>Tính chất vật lý</h4>
        <p>• Chất lỏng không màu, không mùi, không vị</p>
        <p>• Sôi ở 100°C, đông đặc ở 0°C (điều kiện thường)</p>
        <p>• Khối lượng riêng: 1g/cm³ (ở 4°C)</p>
        <p>• Là dung môi tốt (hòa tan nhiều chất)</p>
      </div>

      <h3>⚗️ Tính chất hóa học</h3>
      
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <h4>1. Phản ứng với kim loại</h4>
        <p>2Na + 2H₂O → 2NaOH + H₂↑ (phản ứng mãnh liệt)</p>
        <p>2K + 2H₂O → 2KOH + H₂↑ (cháy trên mặt nước)</p>
        <p>Ca + 2H₂O → Ca(OH)₂ + H₂↑</p>
        <p><strong>Lưu ý:</strong> Chỉ kim loại hoạt động mạnh (K, Na, Ca) mới phản ứng với H₂O ở nhiệt độ thường</p>
      </div>

      <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
        <h4>2. Phản ứng với oxit</h4>
        <p><strong>Oxit bazơ + H₂O → Bazơ</strong></p>
        <p>CaO + H₂O → Ca(OH)₂ (phản ứng tỏa nhiệt mạnh)</p>
        <p>Na₂O + H₂O → 2NaOH</p>
        
        <p style="margin-top: 10px;"><strong>Oxit axit + H₂O → Axit</strong></p>
        <p>SO₃ + H₂O → H₂SO₄</p>
        <p>P₂O₅ + 3H₂O → 2H₃PO₄</p>
        <p>CO₂ + H₂O → H₂CO₃</p>
      </div>

      <h3>🧪 Dung dịch</h3>
      <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4>Khái niệm</h4>
        <p><strong>Dung dịch</strong> = Chất tan + Dung môi</p>
        <p>• <strong>Chất tan:</strong> Chất được hòa tan (muối, đường, axit...)</p>
        <p>• <strong>Dung môi:</strong> Chất làm tan (thường là nước)</p>
        <p>• <strong>Dung dịch bão hòa:</strong> Không thể hòa tan thêm chất tan ở nhiệt độ đó</p>
      </div>

      <h3>📊 Nồng độ dung dịch</h3>
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
        <h4>1. Nồng độ phần trăm (C%)</h4>
        <p>C% = (m<sub>chất tan</sub> / m<sub>dung dịch</sub>) × 100%</p>
        <p>m<sub>dung dịch</sub> = m<sub>chất tan</sub> + m<sub>dung môi</sub></p>
        
        <h4 style="margin-top: 15px;">2. Nồng độ mol/lít (CM)</h4>
        <p>C<sub>M</sub> = n / V (mol/L)</p>
        <p>• n: số mol chất tan</p>
        <p>• V: thể tích dung dịch (lít)</p>
      </div>

      <h3>🌍 Vai trò của nước</h3>
      <ul>
        <li>💧 <strong>Sự sống:</strong> Cần thiết cho mọi sinh vật</li>
        <li>🏭 <strong>Công nghiệp:</strong> Sản xuất, làm mát máy móc</li>
        <li>🌾 <strong>Nông nghiệp:</strong> Tưới tiêu, chăn nuôi</li>
        <li>🏠 <strong>Sinh hoạt:</strong> Ăn uống, vệ sinh</li>
        <li>⚡ <strong>Thủy điện:</strong> Sản xuất điện năng</li>
      </ul>

      <h3>🚰 Bảo vệ nguồn nước</h3>
      <div style="background: #dcfce7; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
        <p>• Không xả rác, chất thải xuống nguồn nước</p>
        <p>• Sử dụng nước tiết kiệm, tránh lãng phí</p>
        <p>• Xử lý nước thải trước khi thải ra môi trường</p>
        <p>• Trồng cây gây rừng bảo vệ nguồn nước</p>
      </div>
    `,
  game: {
    basic: [
      {
        type: "multiple-choice",
        question: "Nước có công thức hóa học là:",
        options: ["H₂", "O₂", "H₂O", "H₂O₂"],
        correctAnswer: 2,
        explanation: "Nước có công thức H₂O, gồm 2 nguyên tử H và 1 nguyên tử O."
      },
      {
        type: "true-false",
        question: "Nước sôi ở 100°C và đóng băng ở 0°C ở điều kiện thường",
        correctAnswer: true,
        explanation: "Đúng! Đây là nhiệt độ sôi và đông đặc của nước ở áp suất 1 atm."
      },
      {
        type: "multiple-choice",
        question: "Khi Na tác dụng với H₂O, khí thoát ra là:",
        options: ["O₂", "H₂", "CO₂", "N₂"],
        correctAnswer: 1,
        explanation: "2Na + 2H₂O → 2NaOH + H₂↑. Khí hidro thoát ra."
      },
      {
        type: "fill-in-blank",
        question: "Dung dịch = Chất tan + _____",
        correctAnswer: "dung môi",
        explanation: "Dung dịch được tạo thành từ chất tan và dung môi (thường là nước)."
      },
      {
        type: "multiple-choice",
        question: "CaO tác dụng với nước tạo thành:",
        options: ["Ca", "CaCO₃", "Ca(OH)₂", "CaCl₂"],
        correctAnswer: 2,
        explanation: "CaO + H₂O → Ca(OH)₂ (canxi hidroxit)"
      }
    ],
    intermediate: [
      {
        type: "multiple-choice",
        question: "Hòa tan 20g muối vào 80g nước. Nồng độ % của dung dịch là:",
        options: ["20%", "25%", "80%", "10%"],
        correctAnswer: 0,
        explanation: "C% = (20/100) × 100% = 20%"
      },
      {
        type: "fill-in-blank",
        question: "Hòa tan 5.85g NaCl vào nước được 500ml dung dịch. Nồng độ mol/l là _____ M.",
        correctAnswer: "0.2",
        explanation: "nNaCl = 5.85/58.5 = 0.1 mol. CM = 0.1/0.5 = 0.2M"
      },
      {
        type: "true-false",
        question: "CO₂ tác dụng với nước tạo thành axit cacbonic H₂CO₃",
        correctAnswer: true,
        explanation: "Đúng! CO₂ + H₂O → H₂CO₃"
      },
      {
        type: "multiple-choice",
        question: "Cho 2.3g Na vào nước dư. Thể tích H₂ (đktc) thu được là:",
        options: ["1.12L", "2.24L", "0.56L", "4.48L"],
        correctAnswer: 0,
        explanation: "nNa = 2.3/23 = 0.1 mol. 2Na + 2H₂O → 2NaOH + H₂. nH₂ = 0.05 mol. V = 0.05 × 22.4 = 1.12L"
      },
      {
        type: "multiple-choice",
        question: "Để pha 200g dung dịch NaCl 10%, cần bao nhiêu gam muối?",
        options: ["10g", "20g", "30g", "40g"],
        correctAnswer: 1,
        explanation: "m muối = 200 × 10% = 20g"
      }
    ],
    advanced: [
      {
        type: "multiple-choice",
        question: "Trộn 100g dd NaCl 10% với 150g dd NaCl 20%. Nồng độ % dd sau khi trộn là:",
        options: ["15%", "16%", "14%", "18%"],
        correctAnswer: 1,
        explanation: "m muối = 100×10% + 150×20% = 40g. m dd = 250g. C% = (40/250)×100% = 16%"
      },
      {
        type: "fill-in-blank",
        question: "Cần hòa tan bao nhiêu gam CuSO₄.5H₂O vào 100g nước để được dd CuSO₄ 8%? Đáp án: _____ g",
        correctAnswer: "14.06",
        explanation: "Gọi x là khối lượng CuSO₄.5H₂O. m CuSO₄ = x×(160/250). 8% = [x×(160/250)]/(100+x). x ≈ 14.06g"
      },
      {
        type: "multiple-choice",
        question: "Cho m gam K vào 200ml H₂O, thu được 500ml dd có nồng độ 0.4M. Giá trị m là:",
        options: ["3.9g", "7.8g", "11.7g", "15.6g"],
        correctAnswer: 1,
        explanation: "nKOH = 0.5 × 0.4 = 0.2 mol. 2K + 2H₂O → 2KOH + H₂. nK = 0.2 mol. m = 0.2 × 39 = 7.8g"
      },
      {
        type: "true-false",
        question: "Pha loãng 100ml dd H₂SO₄ 2M bằng nước thành 500ml dd thì nồng độ mới là 0.4M",
        correctAnswer: true,
        explanation: "Đúng! Số mol không đổi: n = 0.1 × 2 = 0.2 mol. CM mới = 0.2/0.5 = 0.4M"
      },
      {
        type: "multiple-choice",
        question: "Cô cạn 200g dung dịch NaCl 20%, thu được bao nhiêu gam muối khan?",
        options: ["20g", "40g", "60g", "80g"],
        correctAnswer: 1,
        explanation: "m muối = 200 × 20% = 40g"
      }
    ]
  }
};
