# Game Plasma - Mạch Điện (lop8-2)

## Mô tả
Game Plasma là một trò chơi giáo dục về điện học dành cho học sinh lớp 8, giúp học sinh hiểu về:
- Mạch điện cơ bản
- Dòng điện DC (một chiều) và AC (xoay chiều)
- Hiện tượng ngắn mạch
- Trạng thái plasma của vật chất

## Cấu trúc thư mục

```
PlasmaGame/
├── PlasmaGame.jsx       # Component chính của game
├── PlasmaGame.css       # Styles cho game
├── plasma.js            # Logic game (câu hỏi, kiểm tra mạch)
└── index.js             # Export component
```

## Các tính năng

### 1. Mô phỏng mạch điện trực quan
- Pin (nguồn điện DC)
- Bóng đèn (hiển thị trạng thái sáng/tắt)
- Công tắc (đóng/mở mạch)
- Dây dẫn với hiệu ứng dòng điện

### 2. Hiệu ứng dòng điện
- **DC (Dòng một chiều)**: Hiệu ứng các hạt electron di chuyển theo một chiều
- **AC (Dòng xoay chiều)**: Hiệu ứng dao động màu sắc
- **Plasma**: Hiệu ứng rực rỡ với gradient màu tím-xanh cyan

### 3. Hệ thống màn chơi
Gồm 4 màn với độ khó tăng dần:
- **Màn 1**: Học về mạch điện kín cơ bản
- **Màn 2**: Hiểu về ngắn mạch và nguy hiểm
- **Màn 3**: Quan sát dòng điện AC
- **Màn 4**: Khám phá trạng thái plasma

### 4. Câu hỏi kiến thức
Mỗi màn có câu hỏi trắc nghiệm để kiểm tra hiểu biết của học sinh

## Cách sử dụng

### 1. Thêm vào dữ liệu game
Dữ liệu game đã được thêm vào `src/data/games.js` với ID `lop8-2`

### 2. Truy cập game
- Từ trang chủ, chọn môn Vật Lý lớp 8
- Chọn game "Mạch Điện Plasma"
- Hoặc truy cập trực tiếp: `/game/lop8-2`

### 3. Cách chơi
1. Đọc mô tả màn chơi
2. Click vào công tắc để đóng/mở mạch
3. Quan sát hiệu ứng dòng điện
4. Trả lời câu hỏi để nhận điểm
5. Chuyển sang màn tiếp theo

## Tùy chỉnh và mở rộng

### Thêm màn chơi mới
Chỉnh sửa `src/data/games.js`, thêm object mới vào `detailedLevels`:

\`\`\`javascript
{
  id: 5,
  title: "Màn 5: Tên màn mới",
  description: "Mô tả màn chơi",
  currentType: 'dc', // hoặc 'ac', 'plasma'
  hasSwitch: true,
  targetState: 'closed',
  question: {
    text: "Câu hỏi của bạn?",
    options: [
      { id: 'a', text: 'Đáp án A', correct: true },
      { id: 'b', text: 'Đáp án B', correct: false }
    ]
  }
}
\`\`\`

### Thêm linh kiện mới
Trong file `PlasmaGame.jsx`, thêm component mới:

\`\`\`javascript
const Resistor = () => <div className="component resistor">Điện trở</div>;
\`\`\`

Sau đó thêm vào khu vực mô phỏng.

### Tùy chỉnh hiệu ứng
Chỉnh sửa animations trong `PlasmaGame.css`:

\`\`\`css
@keyframes custom-animation {
  /* Định nghĩa keyframes của bạn */
}
\`\`\`

## Công nghệ sử dụng
- React 18
- CSS3 Animations
- JavaScript ES6+

## Cải tiến trong tương lai
- [ ] Thêm Canvas/SVG để vẽ mạch phức tạp hơn
- [ ] Cho phép kéo thả linh kiện để tự thiết kế mạch
- [ ] Thêm đồng hồ đo điện áp/dòng điện
- [ ] Mô phỏng chính xác hơn về plasma
- [ ] Thêm âm thanh hiệu ứng
- [ ] Chế độ thử nghiệm tự do (sandbox mode)

## Ghi chú kỹ thuật
- Component được thiết kế responsive với width cố định 600px
- Sử dụng state management với React hooks
- Dữ liệu game được quản lý tập trung trong `games.js`
- CSS animations cho hiệu ứng mượt mà không cần thư viện ngoài
