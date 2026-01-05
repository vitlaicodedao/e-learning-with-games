// Script mẫu để áp dụng nhanh cho các thử thách còn lại

/*
HƯỚNG DẪN NHANH:

1. Import dependencies:
```jsx
import useChallengeProgress from '../../hooks/useChallengeProgress';
import ResumeDialog from '../../components/ResumeDialog';
```

2. Khởi tạo hook và states:
```jsx
const { hasProgress, saveProgress, clearProgress, getProgress } = useChallengeProgress('challenge-id');
const [showResumeDialog, setShowResumeDialog] = useState(false);
const [gameStarted, setGameStarted] = useState(false);

useEffect(() => {
  if (hasProgress && !gameStarted && !showResults) {
    setShowResumeDialog(true);
  }
}, []);
```

3. Hàm startGame:
```jsx
const startGame = (fromBeginning = false) => {
  if (fromBeginning) {
    clearProgress();
    // Reset all states
  } else {
    const saved = getProgress();
    if (saved) {
      // Restore states
      setCurrentChallenge(saved.currentChallenge);
      setScore(saved.score);
    } else {
      startGame(true);
    }
  }
  setGameStarted(true);
  setShowResumeDialog(false);
};
```

4. Lưu tiến trình trong nextChallenge:
```jsx
const nextChallenge = () => {
  if (currentChallenge < total - 1) {
    const nextIndex = currentChallenge + 1;
    setCurrentChallenge(nextIndex);
    
    saveProgress({
      currentChallenge: nextIndex,
      score
    });
  } else {
    setGameCompleted(true);
    clearProgress();
  }
};
```

5. Thêm Dialog vào JSX (trước closing tag):
```jsx
<ResumeDialog
  show={showResumeDialog && !gameStarted}
  onResume={() => startGame(false)}
  onRestart={() => startGame(true)}
  progressInfo={getProgress() ? {
    current: getProgress().currentChallenge + 1,
    total: totalChallenges,
    score: getProgress().score
  } : null}
/>
```

DANH SÁCH CHALLENGE IDs:
- 'nhan-biet-dung-dich'
- 'xay-dung-phan-tu'
- 'pha-che-dung-dich'
- 'tro-choi-can-bang'
- 'suy-luan-phan-ung'
- 'ghep-nguyen-tu'

*/

export const CHALLENGE_IDS = {
  DUOI_HINH: 'duoi-hinh-bat-chu',
  CAU_TRUC: 'cau-truc-nguyen-tu',
  GHEP_NGUYEN_TU: 'ghep-nguyen-tu',
  PHONG_THI_NGHIEM: 'phong-thi-nghiem',
  NHAN_BIET: 'nhan-biet-dung-dich',
  XAY_DUNG: 'xay-dung-phan-tu',
  PHA_CHE: 'pha-che-dung-dich',
  CAN_BANG: 'tro-choi-can-bang',
  SUY_LUAN: 'suy-luan-phan-ung',
  TINH_OXI_HOA: 'tinh-oxi-hoa'
};
