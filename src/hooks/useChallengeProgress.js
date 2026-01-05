import { useState, useEffect } from 'react';

/**
 * Custom hook để lưu và khôi phục tiến trình thử thách
 * @param {string} challengeId - ID của thử thách (ví dụ: 'duoi-hinh-bat-chu')
 * @param {object} initialState - State ban đầu của thử thách
 * @returns {object} - { progress, saveProgress, clearProgress, hasProgress }
 */
const useChallengeProgress = (challengeId, initialState = {}) => {
  const STORAGE_KEY = `challenge_progress_${challengeId}`;
  
  // Kiểm tra xem có tiến trình đã lưu không
  const getSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Kiểm tra xem tiến trình có quá hạn không (24 giờ)
        const savedTime = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return parsed.data;
        } else {
          // Xóa tiến trình cũ nếu quá 24 giờ
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading challenge progress:', error);
    }
    return null;
  };

  const [hasProgress, setHasProgress] = useState(!!getSavedProgress());

  // Lưu tiến trình
  const saveProgress = (progressData) => {
    try {
      const dataToSave = {
        data: progressData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setHasProgress(true);
    } catch (error) {
      console.error('Error saving challenge progress:', error);
    }
  };

  // Xóa tiến trình
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasProgress(false);
    } catch (error) {
      console.error('Error clearing challenge progress:', error);
    }
  };

  // Lấy tiến trình đã lưu
  const getProgress = () => {
    return getSavedProgress();
  };

  return {
    hasProgress,
    saveProgress,
    clearProgress,
    getProgress
  };
};

export default useChallengeProgress;
