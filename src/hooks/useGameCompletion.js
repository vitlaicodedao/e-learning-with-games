import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameProgress } from '../contexts/GameProgressContext';

/**
 * Hook để quản lý việc hoàn thành game
 * Sử dụng trong các game component để lưu kết quả và điều hướng
 */
export const useGameCompletion = ({ 
  gameId, 
  grade, 
  chapter,
  onComplete: onCompleteProp 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { completeGame, saveGameResult, getGameResult, isGameCompleted } = useGameProgress();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Load previous result on mount
  useEffect(() => {
    const loadPreviousResult = async () => {
      if (gameId) {
        const result = await getGameResult(gameId);
        if (result) {
          setGameResult(result);
          setIsCompleted(result.completed);
        }
      }
    };
    loadPreviousResult();
  }, [gameId, getGameResult]);

  // Check if already completed
  useEffect(() => {
    if (gameId && grade) {
      setIsCompleted(isGameCompleted(gameId, grade));
    }
  }, [gameId, grade, isGameCompleted]);

  // Reset start time when game restarts
  const resetTimer = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Calculate play time
  const getPlayTime = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  // Complete game với điểm số
  const handleComplete = useCallback(async ({ 
    score = 100, 
    maxScore = 100, 
    details = {},
    showModal = true 
  } = {}) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const playTime = getPlayTime();
      
      const result = await completeGame({
        gameId,
        grade,
        chapter,
        score,
        maxScore,
        playTime,
        details
      });

      setGameResult(result);
      setIsCompleted(true);
      
      if (showModal) {
        setShowCompletionModal(true);
      }

      // Callback prop nếu có
      if (onCompleteProp) {
        onCompleteProp(result);
      }

      return result;
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [gameId, grade, chapter, completeGame, getPlayTime, onCompleteProp, isSaving]);

  // Lưu tiến trình mà không hoàn thành
  const saveProgress = useCallback(async ({ 
    score, 
    maxScore, 
    details = {} 
  }) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const playTime = getPlayTime();
      
      const result = await saveGameResult({
        gameId,
        grade,
        chapter,
        score,
        maxScore,
        playTime,
        details,
        completed: false
      });

      return result;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [gameId, grade, chapter, saveGameResult, getPlayTime, isSaving]);

  // Quay về game journey
  const goToJourney = useCallback(() => {
    setShowCompletionModal(false);
    navigate('/game-journey');
  }, [navigate]);

  // Chơi lại game
  const playAgain = useCallback(() => {
    setShowCompletionModal(false);
    resetTimer();
    // Reset local state but keep completion status
  }, [resetTimer]);

  // Đóng modal hoàn thành
  const closeCompletionModal = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  return {
    // State
    isCompleted,
    gameResult,
    isSaving,
    showCompletionModal,
    playTime: getPlayTime(),
    
    // Actions
    handleComplete,
    saveProgress,
    goToJourney,
    playAgain,
    closeCompletionModal,
    resetTimer,
    
    // User info
    user,
    isLoggedIn: !!user
  };
};

export default useGameCompletion;
