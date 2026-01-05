const UserProgress = require('../models/UserProgress'); // Điều chỉnh đường dẫn

// Hàm chung để cập nhật tiến trình
async function trackProgress(req, res, next) {
    // 1. Lấy thông tin người dùng
    // **QUAN TRỌNG:** Bạn phải có cơ chế xác thực để lấy được `userId`
    const userId = req.user._id; // Giả sử `req.user` được thiết lập sau khi xác thực

    // 2. Lấy thông tin từ request (lớp, chương, trò chơi)
    // Bạn sẽ truyền các thông tin này từ route handler
    const { 
        area, 
        class: classPath, 
        chapterId, 
        gameId, 
        gameScore 
    } = req.body; 

    // Lấy hoặc tạo tài liệu tiến trình của người dùng
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
        progress = new UserProgress({ userId });
    }

    try {
        // --- 2a. Xử lý Tracking Học tập (Chapter) ---
        if (area && classPath && chapterId) {
            let classEntry = progress.learningProgress.find(
                p => p.area === area && p.class === classPath
            );

            // Nếu lớp/khu vực chưa tồn tại, thêm mới
            if (!classEntry) {
                classEntry = { 
                    area, 
                    class: classPath, 
                    completedChapters: [], 
                    lastAccessed: new Date() 
                };
                progress.learningProgress.push(classEntry);
            }

            // Cập nhật thời gian truy cập gần nhất
            classEntry.lastAccessed = new Date();

            // Nếu chương chưa được hoàn thành, thêm vào
            const isCompleted = classEntry.completedChapters.some(c => c.chapterId === chapterId);
            if (!isCompleted) {
                classEntry.completedChapters.push({ chapterId, completedAt: new Date() });
            }
        }

        // --- 2b. Xử lý Tracking Trò chơi (Game) ---
        if (gameId) {
            progress.gameProgress.push({
                gameId,
                area: area || null, // Có thể có hoặc không
                class: classPath || null, // Có thể có hoặc không
                score: gameScore || null,
                playedAt: new Date()
            });
        }
        
        // Lưu lại tiến trình đã cập nhật
        await progress.save();

    } catch (error) {
        console.error("Lỗi khi theo dõi tiến trình:", error);
        // Có thể chọn trả về lỗi hoặc bỏ qua tùy theo yêu cầu
    }
    
    // Tiếp tục xử lý request
    next();
}

module.exports = { trackProgress };