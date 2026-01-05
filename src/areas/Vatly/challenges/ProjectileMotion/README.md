# 🎯 Projectile Motion Game

Game Động Lực Học - Ném Xiên với ná thun Angry Birds style.

## 🎮 Tính năng

- ✅ Ná thun kéo thả như Angry Birds
- ✅ Vật lý chuyển động ném xiên chuẩn xác
- ✅ Hiển thị góc bắn và lực cho người chơi
- ✅ 3 levels với độ khó tăng dần
- ✅ Chướng ngại vật và gió
- ✅ Mục tiêu di động ở level cao
- ✅ Quỹ đạo dự đoán khi ngắm
- ✅ Animation mượt mà
- ✅ UI đẹp với gradient và glass morphism

## 🔧 Công thức vật lý

```
x = v₀ × cos(θ) × t
y = v₀ × sin(θ) × t - ½ × g × t²
```

- g = 9.8 m/s² (trọng lực)
- Có lực cản không khí 1%
- Tính toán ảnh hưởng của gió

## 📊 Data Structure

```javascript
{
  targetX: 50,          // Vị trí mục tiêu X (m)
  targetY: 0,           // Vị trí mục tiêu Y (m)
  targetRadius: 5,      // Bán kính mục tiêu (m)
  minAngle: 20,         // Góc bắn tối thiểu
  maxAngle: 70,         // Góc bắn tối đa
  minForce: 5,          // Lực tối thiểu (m/s)
  maxForce: 15,         // Lực tối đa (m/s)
  obstacles: [...],     // Chướng ngại vật (optional)
  wind: {x, y},        // Gió (optional)
  movingTarget: {...}   // Mục tiêu di động (optional)
}
```

## 🎓 Giáo dục

Dành cho **Vật lý lớp 10**:
- Chuyển động ném xiên
- Phân tích thành phần vận tốc
- Ảnh hưởng của góc bắn
- Lực và gia tốc

## 🎨 Design

- Canvas 800x500px
- Scale: 4 pixels = 1 mét
- Gradient tím-hồng background
- Angry Bird style projectile

See [PROJECTILE_MOTION_SETUP.md](../../../PROJECTILE_MOTION_SETUP.md) for full documentation.
