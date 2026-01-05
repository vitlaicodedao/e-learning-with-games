const express = require('express');
const router = express.Router();
const { trackProgress } = require('../middleware/ProgressTracker');
const authMiddleware = require('../middleware/auth'); // Giả sử có middleware xác thực

// Endpoint để báo cáo hoàn thành một chương
router.post('/complete-chapter', authMiddleware, trackProgress, (req, res) => {
    // Middleware trackProgress đã chạy và lưu dữ liệu.
    res.status(200).json({ 
        message: 'Tiến trình học tập đã được ghi nhận.' 
    });
});
// Yêu cầu body: { area: 'Vatly', class: 'class10', chapterId: 'chuong-1-co-hoc' }

// Endpoint để lấy tiến trình của người dùng
const UserProgress = require('../models/UserProgress'); 
router.get('/my-progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const progress = await UserProgress.findOne({ userId });
        if (!progress) {
            return res.status(404).json({ message: 'Không tìm thấy tiến trình.' });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

module.exports = router;


// Endpoint để báo cáo kết quả chơi game
router.post('/complete-game', authMiddleware, trackProgress, (req, res) => {
    // Middleware trackProgress đã chạy và lưu dữ liệu.
    res.status(200).json({ 
        message: 'Kết quả trò chơi đã được ghi nhận.' 
    });
});
// Yêu cầu body: { gameId: 'game-do-thi-chuyen-dong', area: 'Vatly', class: 'class10', gameScore: 85 }