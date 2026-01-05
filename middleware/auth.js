// File: middleware/auth.js (Phiên bản đã sửa lỗi ES Module)
import jwt from 'jsonwebtoken'; // ⬅️ Dùng import thay cho require
import mongoose from 'mongoose'; // ⬅️ Dùng import thay cho require
import User from '../models/User.cjs'; // ⬅️ Dùng import thay cho require (Chú ý giữ .cjs cho file CommonJS)

const authMiddleware = async (req, res, next) => {
    // 1. Lấy token 
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // ... kiểm tra token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        let user;
        const potentialId = decoded.userId; // Đây là giá trị lấy từ JWT

        // 🚨 BƯỚC SỬA LỖI CAST: Xử lý ID (Logic này đã đúng)
        if (potentialId && mongoose.Types.ObjectId.isValid(potentialId)) {
            // Trường hợp 1: ID hợp lệ (ObjectId)
            user = await User.findById(potentialId).select('-password');
        } else if (potentialId) {
            // Trường hợp 2: ID không hợp lệ (như email/UID) - Lỗi bạn đang gặp
            console.warn("⚠️ JWT userId is NOT ObjectId. Attempting lookup by email/UID:", potentialId);
            
            user = await User.findOne({ 
                $or: [
                    { email: potentialId }, 
                    { firebaseUid: potentialId } 
                ] 
            }).select('-password');
        }
        
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại hoặc Token sai.' });
        }
        
        // Gán user đã tìm được vào req.user (đã chứa MongoDB _id hợp lệ)
        req.user = user;
        
        // Chuyển sang middleware tracking
        next(); 

    } catch (error) {
        // Bắt lỗi nếu token không thể giải mã
        console.error("❌ Auth Token/Verification Error:", error.message);
        res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn.' });
    }
};

export default authMiddleware; // ⬅️ Dùng export default thay cho module.exports