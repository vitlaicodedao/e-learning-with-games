import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useGameCompletion } from '../../hooks/useGameCompletion';
import GameCompletionModal from '../GameCompletionModal/GameCompletionModal';

/**
 * HOC Wrapper để thêm tính năng lưu progress cho các game
 * Sử dụng: <GameWrapper gameId="lop11-c1-1" grade={11} chapter={1} gameTitle="Simple Harmonic Motion Lab">
 *            <SimpleHarmonicMotionLab onComplete={...} />
 *          </GameWrapper>
 */
const GameWrapper = ({ 
  children, 
  gameId, 
  grade, 
  chapter, 
  gameTitle,
  autoCompleteOnScore = 50 // Tự động hoàn thành khi đạt >= 50%
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    isCompleted,
    gameResult,
    isSaving,
    showCompletionModal,
    handleComplete,
    goToJourney,
    playAgain,
    closeCompletionModal
  } = useGameCompletion({ gameId, grade, chapter });

  const [lastResult, setLastResult] = useState(null);

  // Callback cho children khi game kết thúc
  const handleGameComplete = async (result) => {
    const { score = 100, maxScore = 100, details = {} } = result || {};
    
    const completionResult = await handleComplete({
      score,
      maxScore,
      details,
      showModal: true
    });
    
    setLastResult(completionResult);
    return completionResult;
  };

  // Clone children với thêm prop onComplete
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onGameComplete: handleGameComplete,
        isCompleted,
        gameResult
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      
      <GameCompletionModal
        isOpen={showCompletionModal}
        onClose={closeCompletionModal}
        onPlayAgain={playAgain}
        onGoToJourney={goToJourney}
        result={lastResult || gameResult}
        gameTitle={gameTitle}
      />
    </>
  );
};

export default GameWrapper;
