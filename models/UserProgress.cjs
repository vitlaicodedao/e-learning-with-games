const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    // Tham chiếu đến người dùng (nếu bạn có mô hình User riêng)
    // Nếu chưa có, bạn có thể dùng một ID hoặc tên người dùng tạm thời.
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Giả sử bạn có model 'User'
        required: true,
        unique: true // Mỗi người dùng chỉ có một tài liệu tiến trình
    },
    
    // 1. Theo dõi Lớp học (Class) và Chương học (Chapter)
    // Lưu trạng thái học tập hiện tại và đã hoàn thành
    learningProgress: {
        type: [
            {
                area: { type: String, enum: ['Vatly', 'Hoahoc'], required: true }, // 'Vatly' hoặc 'Hoahoc'
                class: { type: String, required: true }, // Ví dụ: 'class6', 'class10', v.v.
                completedChapters: {
                    type: [
                        {
                            chapterId: { type: String, required: true }, // ID/slug/tên của chương
                            completedAt: { type: Date, default: Date.now }
                        }
                    ],
                    default: []
                },
                lastAccessed: { type: Date } // Thời gian truy cập gần nhất vào lớp này
            }
        ],
        default: []
    },

    // 2. Theo dõi Trò chơi (Games) đã chơi
    // Lưu các trò chơi đã chơi và kết quả (tùy chọn)
    gameProgress: {
        type: [
            {
                gameId: { type: String, required: true }, // ID/slug/tên của trò chơi
                area: { type: String, enum: ['Vatly', 'Hoahoc'] },
                class: { type: String },
                score: { type: Number }, // Điểm số hoặc kết quả cuối cùng
                playedAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },

   // 2. Theo dõi Trò chơi (Games) đã chơi
    // Lưu các trò chơi đã chơi và kết quả (tùy chọn)
    gameProgress: {
        type: [
            {
                gameId: { type: String, required: true }, // ID/slug/tên của trò chơi
                area: { type: String, enum: ['Vatly', 'Hoahoc'] },
                class: { type: String },
                score: { type: Number }, // Điểm số hoặc kết quả cuối cùng
                playedAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },

    // Tự động quản lý thời gian tạo/cập nhật
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);