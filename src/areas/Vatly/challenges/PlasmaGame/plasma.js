// --- LỚP GAME ENGINE CHÍNH ---
export class GameEngine {
  constructor(ctx, onScoreUpdate) {
    this.ctx = ctx; // "Bút vẽ" Canvas
    this.onScoreUpdate = onScoreUpdate; // Hàm gọi về React để cập nhật điểm
    this.simulationState = { isLit: false, isShort: false, currentType: 'none' }; // Trạng thái mô phỏng
    this.electronParticles = []; // Mảng các hạt electron để vẽ animation
    this.smokeParticles = []; // Mảng chứa các hạt khói (MỚI)
    this.lastLitState = false; // Theo dõi trạng thái trước đó
    this.lastShortState = false;
  }

  // Hàm chạy 60 lần/giây
  run(components, wires) {
    // 1. Tính toán logic mô phỏng
    this.checkSimulation(components, wires);

    // 2. Xóa Canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // 3. Vẽ mọi thứ
    this.drawWires(wires, components);
    this.drawComponents(components);

    // 4. Vẽ hiệu ứng
    this.drawAnimations(components, wires);
    
    // 5. CẬP NHẬT VÀ VẼ HIỆU ỨNG (KHÓI) - MỚI
    this.updateAndDrawParticles();
  }

  // --- PHẦN LOGIC MÔ PHỎNG ---

  checkSimulation(components, wires) {
    // Reset trạng thái
    const pins = components.filter(c => c.type === 'pin');
    
    if (pins.length === 0) {
      this.simulationState = { isLit: false, isShort: false, currentType: 'none' };
      return;
    }

    const pin = pins[0]; // Chỉ xử lý 1 pin cho đơn giản

    // Tìm đường đi từ cực âm (-) của pin
    let path = this.findPath(pin, 'node_neg', components, wires);
    
    let isLit = false;
    let isShort = false;

    // Phân tích đường đi
    if (path.foundEnd) {
      if (path.hasLoad) {
        // Có đi qua tải (bóng đèn) -> Mạch đúng!
        isLit = true;
      } else {
        // Không đi qua tải -> NGẮN MẠCH!
        isShort = true;
      }
    }

    // Cập nhật trạng thái và tính điểm (chỉ khi thay đổi)
    if (isLit && !this.lastLitState) {
      this.onScoreUpdate(10); // Cộng 10 điểm
      this.lastLitState = true;
    } else if (!isLit && this.lastLitState) {
      this.lastLitState = false;
    }
    
    if (isShort && !this.lastShortState) {
      this.onScoreUpdate(-5); // Trừ 5 điểm
      this.lastShortState = true;
    } else if (!isShort && this.lastShortState) {
      this.lastShortState = false;
    }
    
    // MỚI: Nếu ngắn mạch, TẠO RA KHÓI
    if (isShort) {
      this.emitSmoke(pin.x, pin.y); // Tạo khói từ vị trí Pin
    }
    
    this.simulationState = { isLit, isShort, currentType: isLit ? 'dc' : 'none' };
  }

  // Thuật toán DFS để tìm đường đi
  findPath(startComponent, startNodeId, components, wires, visited = {}) {
    let path = { foundEnd: false, hasLoad: false };
    const startId = `${startComponent.id}-${startNodeId}`;
    if (visited[startId]) return path;
    visited[startId] = true;

    // Tìm tất cả các dây nối từ điểm hiện tại
    const connectedWires = wires.filter(w =>
      (w.from.componentId === startComponent.id && w.from.nodeId === startNodeId) ||
      (w.to.componentId === startComponent.id && w.to.nodeId === startNodeId)
    );

    for (const wire of connectedWires) {
      // Xác định đầu kia của dây
      const otherEnd = (wire.from.componentId === startComponent.id && wire.from.nodeId === startNodeId) ? wire.to : wire.from;
      const nextComponent = components.find(c => c.id === otherEnd.componentId);
      
      if (!nextComponent) continue;

      // 1. Kiểm tra xem có phải tải (đèn) không
      if (nextComponent.type === 'bulb') {
        path.hasLoad = true;
        // Đi xuyên qua đèn, từ node 1 -> node 2
        const nextNodeId = (otherEnd.nodeId === 'node_in') ? 'node_out' : 'node_in';
        const result = this.findPath(nextComponent, nextNodeId, components, wires, visited);
        if (result.foundEnd) path.foundEnd = true;
        path.hasLoad = path.hasLoad || result.hasLoad;
      }
      
      // 2. LOGIC MỚI CHO CÔNG TẮC
      else if (nextComponent.type === 'switch') {
        // QUAN TRỌNG: Chỉ đi qua nếu công tắc ĐÓNG
        if (nextComponent.isClosed) {
          const nextNodeId = (otherEnd.nodeId === 'node_in') ? 'node_out' : 'node_in';
          const result = this.findPath(nextComponent, nextNodeId, components, wires, visited);
          if (result.foundEnd) path.foundEnd = true;
          path.hasLoad = path.hasLoad || result.hasLoad;
        }
        // Nếu công tắc Mở (isClosed = false), đây là đường cụt, không làm gì cả.
      }
      
      // 3. Kiểm tra xem có về đến cực dương (+) của pin không
      else if (nextComponent.type === 'pin' && otherEnd.nodeId === 'node_pos') {
        path.foundEnd = true;
      }
      
      // 4. Nếu là dây dẫn (hoặc component khác), tiếp tục đi
      else {
         const result = this.findPath(nextComponent, otherEnd.nodeId, components, wires, visited);
         if (result.foundEnd) path.foundEnd = true;
         path.hasLoad = path.hasLoad || result.hasLoad;
      }
    }
    return path;
  }

  // --- PHẦN LOGIC VẼ ---

  drawComponents(components) {
    components.forEach(c => {
      if (c.type === 'pin') this.drawPin(c);
      if (c.type === 'bulb') this.drawBulb(c);
      if (c.type === 'switch') this.drawSwitch(c);
    });
  }

  drawPin(c) {
    const ctx = this.ctx;
    // Thân pin (cam hoặc đỏ nếu ngắn mạch)
    ctx.fillStyle = this.simulationState.isShort ? '#FF0000' : '#f9a825';
    ctx.fillRect(c.x - 20, c.y - 15, 40, 30);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x - 20, c.y - 15, 40, 30);
    
    // Cực âm (-)
    this.drawNode(c, 'node_neg', -25, 0);
    // Cực dương (+)
    this.drawNode(c, 'node_pos', 25, 0);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DC', c.x, c.y + 4);

    if (this.simulationState.isShort) {
      ctx.fillStyle = '#FF0000';
      ctx.fillText('NGẮN MẠCH!', c.x, c.y + 25);
    }
    
    ctx.lineWidth = 1;
  }

  drawBulb(c) {
    const ctx = this.ctx;
    const isLit = this.simulationState.isLit;
    
    // Hào quang nếu sáng
    if (isLit) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 253, 224, 0.7)';
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Đui đèn
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(c.x - 10, c.y + 5, 20, 15);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x - 10, c.y + 5, 20, 15);
    
    // Vỏ bóng
    ctx.beginPath();
    ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = isLit ? '#fffde7' : '#e0e0e0';
    ctx.fill();
    ctx.stroke();
    
    // Sợi tóc
    ctx.beginPath();
    ctx.moveTo(c.x - 5, c.y - 3);
    ctx.lineTo(c.x, c.y + 3);
    ctx.lineTo(c.x + 5, c.y - 3);
    ctx.strokeStyle = isLit ? '#fdd835' : '#888';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 2 node của đèn
    ctx.lineWidth = 1;
    this.drawNode(c, 'node_in', -10, 20);
    this.drawNode(c, 'node_out', 10, 20);
  }

  drawSwitch(c) {
    const ctx = this.ctx;
    const isClosed = c.isClosed || false;
    
    // Hộp công tắc
    ctx.fillStyle = isClosed ? '#c8e6c9' : '#ffccbc';
    ctx.fillRect(c.x - 30, c.y - 15, 60, 30);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x - 30, c.y - 15, 60, 30);

    // Hai chốt
    ctx.beginPath();
    ctx.arc(c.x - 15, c.y, 5, 0, Math.PI * 2);
    ctx.arc(c.x + 15, c.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#555';
    ctx.fill();
    
    // Thanh gạt
    ctx.beginPath();
    ctx.moveTo(c.x - 15, c.y);
    if (isClosed) {
      ctx.lineTo(c.x + 15, c.y);
      ctx.strokeStyle = '#2e7d32';
    } else {
      ctx.lineTo(c.x + 10, c.y - 12);
      ctx.strokeStyle = '#c62828';
    }
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 2 nodes
    ctx.lineWidth = 1;
    this.drawNode(c, 'node_1', -15, 15);
    this.drawNode(c, 'node_2', 15, 15);
  }

  drawNode(component, nodeId, offsetX, offsetY) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(component.x + offsetX, component.y + offsetY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  drawWires(wires, components) {
    const ctx = this.ctx;
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    
    wires.forEach(w => {
      const fromPos = this.getNodePos(w.from, components);
      const toPos = this.getNodePos(w.to, components);
      if (!fromPos || !toPos) return;
      
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.stroke();
    });
    ctx.lineWidth = 1;
  }
  
  drawAnimations() {
    // Vẽ các hạt electron nếu mạch đang hoạt động
    if (this.simulationState.isLit) {
      // Tạo hạt electron mới mỗi 10 frames
      if (Math.random() < 0.1) {
        this.electronParticles.push({
          x: 0,
          y: 0,
          progress: 0
        });
      }
      
      // Cập nhật và vẽ các hạt
      const ctx = this.ctx;
      this.electronParticles.forEach((particle, index) => {
        particle.progress += 0.02;
        
        if (particle.progress > 1) {
          this.electronParticles.splice(index, 1);
          return;
        }
        
        // Vẽ hạt electron xanh
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#2196f3';
        ctx.fill();
      });
    }
  }

  // --- HÀM HỖ TRỢ TÌM KIẾM ---

  getNodePos(nodeRef, components) {
    const c = components.find(comp => comp.id === nodeRef.componentId);
    if (!c) return null;
    
    // Map ID node ra offset
    if (c.type === 'pin') {
      if (nodeRef.nodeId === 'node_neg') return { x: c.x - 25, y: c.y };
      if (nodeRef.nodeId === 'node_pos') return { x: c.x + 25, y: c.y };
    }
    if (c.type === 'bulb') {
      if (nodeRef.nodeId === 'node_in') return { x: c.x - 10, y: c.y + 20 };
      if (nodeRef.nodeId === 'node_out') return { x: c.x + 10, y: c.y + 20 };
    }
    // MỚI: Node cho công tắc (phải khớp với drawSwitch)
    if (c.type === 'switch') {
      if (nodeRef.nodeId === 'node_in') return { x: c.x - 25, y: c.y };
      if (nodeRef.nodeId === 'node_out') return { x: c.x + 25, y: c.y };
    }
    return null;
  }
  
  // Tìm component tại vị trí (x, y)
  getComponentAt(pos, components) {
    // Tìm ngược để ưu tiên cái mới vẽ (ở trên)
    for (let i = components.length - 1; i >= 0; i--) {
      const c = components[i];
      // Bounding box theo kích thước thực tế của component
      let left, right, top, bottom;
      
      if (c.type === 'pin') {
        // Pin: fillRect(c.x - 20, c.y - 15, 40, 30)
        left = c.x - 20;
        right = c.x + 20;
        top = c.y - 15;
        bottom = c.y + 15;
      } else if (c.type === 'bulb') {
        // Bulb: vòng tròn bán kính 15 + nodes ở y+20
        left = c.x - 15;
        right = c.x + 15;
        top = c.y - 15;
        bottom = c.y + 25; // Bao gồm cả nodes
      } else if (c.type === 'switch') {
        // Switch: nodes ở y+15, thanh gạt ở y-12 đến y
        left = c.x - 20;
        right = c.x + 20;
        top = c.y - 15;
        bottom = c.y + 20; // Bao gồm cả nodes ở y+15
      }
      
      if (pos.x >= left && pos.x <= right && 
          pos.y >= top && pos.y <= bottom) {
        return c;
      }
    }
    return null;
  }
  
  // Tìm node tại vị trí (x, y)
  getNodeAt(pos, components) {
    for (const c of components) {
        const nodes = [];
        if (c.type === 'pin') {
            nodes.push({ id: 'node_neg', x: c.x - 25, y: c.y });
            nodes.push({ id: 'node_pos', x: c.x + 25, y: c.y });
        }
        if (c.type === 'bulb') {
            nodes.push({ id: 'node_in', x: c.x - 10, y: c.y + 20 });
            nodes.push({ id: 'node_out', x: c.x + 10, y: c.y + 20 });
        }
        // MỚI: Node cho công tắc (khớp với getNodePos)
        if (c.type === 'switch') {
            nodes.push({ id: 'node_in', x: c.x - 25, y: c.y });
            nodes.push({ id: 'node_out', x: c.x + 25, y: c.y });
        }
        
        for (const node of nodes) {
            const dist = Math.hypot(pos.x - node.x, pos.y - node.y);
            if (dist < 8) { // Bán kính 8px
                return { componentId: c.id, nodeId: node.id };
            }
        }
    }
    return null;
  }
  
  // --- HỆ THỐNG HẠT (KHÓI) - MỚI ---
  
  emitSmoke(x, y) {
    // Chỉ tạo thêm 1-2 hạt mỗi frame để tránh lag
    if (Math.random() > 0.5) {
      const particle = {
        x: x + (Math.random() - 0.5) * 10, // Vị trí ngẫu nhiên quanh pin
        y: y - 10,
        size: Math.random() * 5 + 3,
        opacity: 1,
        // Tốc độ di chuyển ngẫu nhiên (chủ yếu là đi lên)
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.5,
      };
      this.smokeParticles.push(particle);
    }
    
    // Giới hạn số lượng hạt để không làm sập trình duyệt
    if (this.smokeParticles.length > 100) {
      this.smokeParticles.shift(); // Xóa hạt cũ nhất
    }
  }
  
  updateAndDrawParticles() {
    const ctx = this.ctx;
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      
      // 1. Update
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= 0.01; // Mờ dần
      p.size += 0.05; // To dần
      
      // 2. Draw
      if (p.opacity > 0) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(100, 100, 100, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Xóa hạt đã biến mất
        this.smokeParticles.splice(i, 1);
      }
    }
  }
}
