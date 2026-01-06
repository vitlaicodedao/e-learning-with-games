import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../config/api';

const GameProgressContext = createContext(null);

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used within GameProgressProvider');
  }
  return context;
};

export const GameProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progressByGrade, setProgressByGrade] = useState({});
  const [gameResults, setGameResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load progress cho một grade cụ thể
  const loadGradeProgress = useCallback(async (grade) => {
    if (!user?.email) {
      // Nếu chưa đăng nhập, load từ localStorage
      const localData = localStorage.getItem(`physics-games-progress-grade-${grade}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        setProgressByGrade(prev => ({
          ...prev,
          [grade]: {
            completed: parsed.completed || [],
            current: parsed.current || null,
            totalTrophies: (parsed.completed || []).length
          }
        }));
      }
      
      // Load game results từ localStorage
      const localResultsKey = `physics-games-results-grade-${grade}`;
      const localResults = localStorage.getItem(localResultsKey);
      if (localResults) {
        setGameResults(prev => ({
          ...prev,
          [grade]: JSON.parse(localResults)
        }));
      }
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/game-results/${user.email}/progress/${grade}`);
      if (response.data.success) {
        setProgressByGrade(prev => ({
          ...prev,
          [grade]: response.data.progress
        }));
        setGameResults(prev => ({
          ...prev,
          [grade]: response.data.gameResults
        }));
        
        // Sync với localStorage
        localStorage.setItem(`physics-games-progress-grade-${grade}`, JSON.stringify(response.data.progress));
      }
    } catch (err) {
      console.error('Error loading grade progress:', err);
      // Fallback to localStorage
      const localData = localStorage.getItem(`physics-games-progress-grade-${grade}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        setProgressByGrade(prev => ({
          ...prev,
          [grade]: {
            completed: parsed.completed || [],
            current: parsed.current || null,
            totalTrophies: (parsed.completed || []).length
          }
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Hoàn thành game - chỉ đánh dấu hoàn thành khi đạt >= 80% điểm
  const completeGame = useCallback(async ({ gameId, grade, chapter, score, maxScore, playTime, details }) => {
    const actualScore = score || 0;
    const actualMaxScore = maxScore || 100;
    const scorePercent = (actualScore / actualMaxScore) * 100;
    const isPassingScore = scorePercent >= 80;

    // Chỉ đánh dấu hoàn thành nếu đạt >= 80%
    if (isPassingScore) {
      // Cập nhật local state ngay lập tức (optimistic update)
      setProgressByGrade(prev => {
        const gradeProgress = prev[grade] || { completed: [], current: null, totalTrophies: 0 };
        const newCompleted = gradeProgress.completed.includes(gameId) 
          ? gradeProgress.completed 
          : [...gradeProgress.completed, gameId];
        
        const newProgress = {
          ...gradeProgress,
          completed: newCompleted,
          totalTrophies: newCompleted.length
        };
        
        // Cập nhật localStorage
        localStorage.setItem(`physics-games-progress-grade-${grade}`, JSON.stringify(newProgress));
        
        return {
          ...prev,
          [grade]: newProgress
        };
      });
    }

    // Cập nhật game results (hiển thị điểm) bất kể có pass hay không
    const gameResultData = {
      score: actualScore,
      maxScore: actualMaxScore,
      stars: scorePercent >= 90 ? 3 : scorePercent >= 80 ? 2 : scorePercent >= 60 ? 1 : 0,
      playTime: playTime || 0,
      completedAt: new Date().toISOString(),
      passed: isPassingScore
    };

    setGameResults(prev => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [gameId]: gameResultData
      }
    }));

    // Lưu game results vào localStorage
    const localResultsKey = `physics-games-results-grade-${grade}`;
    const existingResults = JSON.parse(localStorage.getItem(localResultsKey) || '{}');
    existingResults[gameId] = gameResultData;
    localStorage.setItem(localResultsKey, JSON.stringify(existingResults));

    // Nếu user đã đăng nhập, lưu vào server
    if (user?.email) {
      try {
        const response = await api.post('/game-results/complete', {
          userId: user.email,
          gameId,
          grade,
          chapter,
          score: actualScore,
          maxScore: actualMaxScore,
          playTime: playTime || 0,
          details: details || {},
          completed: isPassingScore // Server biết game có được đánh dấu hoàn thành không
        });

        if (response.data.success) {
          // Cập nhật với data từ server
          if (isPassingScore) {
            setProgressByGrade(prev => ({
              ...prev,
              [grade]: {
                ...prev[grade],
                completed: response.data.completedGames || prev[grade]?.completed
              }
            }));
          }
          
          return {
            success: true,
            passed: isPassingScore,
            scorePercent,
            ...response.data.result
          };
        }
      } catch (err) {
        console.error('Error completing game:', err);
        setError('Không thể lưu kết quả. Vui lòng thử lại.');
      }
    }

    return { 
      success: true, 
      gameId,
      passed: isPassingScore,
      scorePercent,
      message: isPassingScore 
        ? 'Chúc mừng! Bạn đã vượt qua thử thách!' 
        : `Bạn cần đạt ít nhất 80% để hoàn thành. Điểm hiện tại: ${scorePercent.toFixed(0)}%`
    };
  }, [user]);

  // Lưu kết quả game (không nhất thiết phải hoàn thành)
  const saveGameResult = useCallback(async ({ gameId, grade, chapter, score, maxScore, playTime, details, completed }) => {
    if (!user?.email) {
      // Chỉ lưu local nếu chưa đăng nhập
      const localKey = `game-result-${gameId}`;
      localStorage.setItem(localKey, JSON.stringify({
        gameId, grade, chapter, score, maxScore, playTime, details, completed,
        timestamp: Date.now()
      }));
      return { success: true };
    }

    try {
      const response = await api.post('/game-results/save', {
        userId: user.email,
        gameId,
        grade,
        chapter,
        score,
        maxScore,
        playTime,
        details,
        completed
      });

      if (response.data.success && completed) {
        // Reload progress nếu game hoàn thành
        await loadGradeProgress(grade);
      }

      return response.data;
    } catch (err) {
      console.error('Error saving game result:', err);
      setError('Không thể lưu kết quả. Vui lòng thử lại.');
      return { success: false, error: err.message };
    }
  }, [user, loadGradeProgress]);

  // Lấy kết quả của một game cụ thể
  const getGameResult = useCallback(async (gameId) => {
    if (!user?.email) {
      const localKey = `game-result-${gameId}`;
      const localData = localStorage.getItem(localKey);
      return localData ? JSON.parse(localData) : null;
    }

    try {
      const response = await api.get(`/game-results/${user.email}/${gameId}`);
      return response.data.result;
    } catch (err) {
      console.error('Error getting game result:', err);
      return null;
    }
  }, [user]);

  // Kiểm tra game đã hoàn thành chưa
  const isGameCompleted = useCallback((gameId, grade) => {
    const gradeProgress = progressByGrade[grade];
    return gradeProgress?.completed?.includes(gameId) || false;
  }, [progressByGrade]);

  // Kiểm tra game có được mở khóa không
  const isGameUnlocked = useCallback((gameId, grade, games) => {
    const gameIndex = games.findIndex(g => g.id === gameId);
    if (gameIndex === 0) return true; // Game đầu tiên luôn mở
    
    const previousGame = games[gameIndex - 1];
    return isGameCompleted(previousGame.id, grade);
  }, [isGameCompleted]);

  // Lấy game hiện tại (game tiếp theo chưa hoàn thành)
  const getCurrentGame = useCallback((grade, games) => {
    const gradeProgress = progressByGrade[grade];
    const completed = gradeProgress?.completed || [];
    
    for (const game of games) {
      if (!completed.includes(game.id)) {
        return game.id;
      }
    }
    
    return null; // Tất cả đã hoàn thành
  }, [progressByGrade]);

  // Lấy thống kê
  const getStats = useCallback(async () => {
    if (!user?.email) {
      // Tính từ localStorage
      let totalCompleted = 0;
      let totalStars = 0;
      
      for (let grade = 6; grade <= 12; grade++) {
        const localData = localStorage.getItem(`physics-games-progress-grade-${grade}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          totalCompleted += (parsed.completed || []).length;
        }
      }
      
      return { totalGamesPlayed: totalCompleted, totalCompleted, totalStars };
    }

    try {
      const response = await api.get(`/game-results/${user.email}/stats`);
      return response.data.stats;
    } catch (err) {
      console.error('Error getting stats:', err);
      return null;
    }
  }, [user]);

  // Reset progress cho một grade
  const resetGradeProgress = useCallback(async (grade) => {
    // Clear local
    localStorage.removeItem(`physics-games-progress-grade-${grade}`);
    setProgressByGrade(prev => ({
      ...prev,
      [grade]: { completed: [], current: null, totalTrophies: 0 }
    }));

    // TODO: Nếu cần, thêm API endpoint để reset trên server
  }, []);

  // Tính tổng trophies từ tất cả grades
  const getTotalTrophies = useCallback(() => {
    let total = 0;
    Object.values(progressByGrade).forEach(progress => {
      total += progress?.totalTrophies || progress?.completed?.length || 0;
    });
    return total;
  }, [progressByGrade]);

  const value = {
    progressByGrade,
    gameResults,
    loading,
    error,
    loadGradeProgress,
    completeGame,
    saveGameResult,
    getGameResult,
    isGameCompleted,
    isGameUnlocked,
    getCurrentGame,
    getStats,
    resetGradeProgress,
    getTotalTrophies,
    clearError: () => setError(null)
  };

  return (
    <GameProgressContext.Provider value={value}>
      {children}
    </GameProgressContext.Provider>
  );
};

export default GameProgressContext;
