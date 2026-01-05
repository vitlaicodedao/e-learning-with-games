const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const User = require('../models/User.cjs');
router.post('/submit-physics-lesson', async (req, res) => {

    // 1. Lấy user ID từ Body (Vẫn giữ như yêu cầu của bạn)
    const { userId: incomingId, programId, classId, chapterId, lessonId, score, completed } = req.body;
    
    let user = null;
    
    // --- BẮT ĐẦU LOGIC TÌM KIẾM THÔNG MINH ---
    
    // 2. Kiểm tra xem ID có phải là ObjectId HỢP LỆ không
    if (incomingId && mongoose.Types.ObjectId.isValid(incomingId)) {
        // Trường hợp 1: ID hợp lệ, tìm bằng findById
        user = await User.findById(incomingId).select('_id');
    } 
    
    if (!user && incomingId) {
        // Trường hợp 2: ID không hợp lệ (như email/UID), tìm kiếm bằng Email
        // Đây là cách fix lỗi Cast to ObjectId failed khi gửi email
        console.log("🔍 Attempting user lookup by email/UID:", incomingId);
        user = await User.findOne({ 
            $or: [
                { email: incomingId }, 
                { firebaseUid: incomingId } 
            ] 
        }).select('_id');
    }
    
    // --- KẾT THÚC LOGIC TÌM KIẾM THÔNG MINH ---

    if (!user) {
        console.log("❌ User not found:", incomingId);
        return res.status(401).json({ success: false, message: 'Người dùng không tồn tại. Vui lòng đăng nhập lại.' });
    }
    
    // 3. Lấy ID MongoDB hợp lệ và tiếp tục logic tracking
    const finalUserId = user._id; // ⬅️ ID MongoDB HỢP LỆ được lấy từ DB
    
    // ... Bắt đầu Logic Tracking của bạn (Dùng finalUserId) ...
    try {
        await updateProgressInDB({
            userId: finalUserId, // ⬅️ Dùng ID HỢP LỆ
            area: programId, 
            class: classId, 
            chapterId: chapterId,
            lessonId: lessonId,
            score: score,
            completed: completed
        });
        
        return res.json({ success: true, message: 'Dữ liệu bài học đã được ghi nhận.' });
        
    } catch (error) {
        console.error("❌ Lesson Submission Error:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật tiến trình.' });
    }
});