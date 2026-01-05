const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const mongoose = require('mongoose');

// Đăng ký với email/password
router.post('/register', async (req, res) => {
  try {
    const { username, email, firebaseUid, selectedProgram } = req.body;

    console.log('📝 Register request:', { username, email, firebaseUid, selectedProgram });

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng đã được sử dụng'
      });
    }

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      firebaseUid,
      displayName: username,
      xp: 0,
      level: 1,
      programs: [], // Không tự động enroll, chờ làm placement test
      profile: {}
    });

    await newUser.save();
    console.log('✅ User registered successfully:', newUser.email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        firebaseUid: newUser.firebaseUid 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng ký thành công',
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
        firebaseUid: newUser.firebaseUid,
        uid: newUser.firebaseUid, // Add uid alias for compatibility
        xp: newUser.xp,
        level: newUser.level,
        programs: newUser.programs,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

// Đăng nhập với Google
router.post('/google-login', async (req, res) => {
  try {
    const { firebaseUid, email, displayName, avatar, selectedProgram } = req.body;

    console.log('📝 Google login request:', { firebaseUid, email });

    // Tìm user theo firebaseUid hoặc email
    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });

    if (!user) {
      // Tạo user mới nếu chưa tồn tại
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
      user = new User({
        username,
        email,
        firebaseUid,
        displayName: displayName || username,
        avatar: avatar || '',
        xp: 0,
        level: 1,
        programs: [], // Không tự động enroll, chờ làm placement test
        profile: {}
      });

      await user.save();
      console.log('✅ New user created:', user.email);
    } else {
      // Cập nhật firebaseUid nếu user đã tồn tại nhưng chưa có firebaseUid
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
      console.log('✅ Existing user logged in:', user.email);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        firebaseUid: user.firebaseUid 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        firebaseUid: user.firebaseUid,
        uid: user.firebaseUid, // Add uid alias for compatibility
        xp: user.xp,
        level: user.level,
        programs: user.programs,
        profile: user.profile,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('❌ Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

// Đăng nhập với email/password
router.post('/email-login', async (req, res) => {
  try {
    const { firebaseUid, email } = req.body;

    const user = await User.findOne({ $or: [{ firebaseUid }, { email }] });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        xp: user.xp,
        level: user.level,
        programs: user.programs,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error('Email login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

// Lấy thông tin user
router.get('/me/:idValue', async (req, res) => {
    try {
        const idValue = req.params.idValue;
        let user;

        // Ưu tiên tìm theo _id (Nếu idValue là ObjectId)
        // Regex kiểm tra định dạng MongoDB ObjectId hợp lệ
        if (idValue.match(/^[0-9a-fA-F]{24}$/)) {
            // Đây là trường hợp idValue là MongoDB ObjectId
            user = await User.findById(idValue);
        } else {
            // Đây là trường hợp idValue là Email hoặc FirebaseUID
            user = await User.findOne({ 
                $or: [
                    { email: idValue }, 
                    { firebaseUid: idValue }
                ] 
            });
            console.log("🔍 Tìm user theo Email/FirebaseUID:", idValue, user ? "-> OK" : "-> NOT FOUND");
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        // --- LOGIC TRẢ VỀ THÔNG TIN USER (Đã gộp vào đây) ---
        res.json({
            success: true,
            user: {
                // QUAN TRỌNG: user._id là MongoDB ObjectId, hãy trả về nó
                id: user._id, 
                // Nếu bạn có trường 'userId' trong schema và dùng nó để lưu Firebase UID, 
                // thì có thể trả về 'user.userId' (NHƯNG tốt nhất nên dùng firebaseUid)
                firebaseUid: user.firebaseUid,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                xp: user.xp,
                level: user.level,
                programs: user.programs,
                profile: user.profile,
            }
        });
        // ----------------------------------------------------

    } catch (error) {
        // Khối bắt lỗi chính (nếu có lỗi DB hoặc lỗi khác)
        console.error('❌ Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server: ' + error.message 
        });
    }
});

module.exports = router;