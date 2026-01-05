import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, CheckCircle, Star, Target, Clock, Zap } from 'lucide-react';
import { grade6Games } from '../areas/Vatly/data/grade6Games';
import { grade7Games } from '../areas/Vatly/data/grade7Games';
import { grade8Games } from '../areas/Vatly/data/grade8Games';
import { grade9Games } from '../areas/Vatly/data/grade9Games';
import { grade10Games } from '../areas/Vatly/data/grade10Games';
import { grade11Games } from '../areas/Vatly/data/grade11Games';
import { grade12Games } from '../areas/Vatly/data/grade12Games';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import './GameJourney.css';

const GameJourney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(11);
  const [completedGames, setCompletedGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách game theo lớp đã chọn
  const getGamesForGrade = (grade) => {
    switch (grade) {
      case 6: return grade6Games;
      case 7: return grade7Games;
      case 8: return grade8Games;
      case 9: return grade9Games;
      case 10: return grade10Games;
      case 11: return grade11Games;
      case 12: return grade12Games;
      default: return [];
    }
  };

  const games = getGamesForGrade(selectedGrade);

  // Thông tin các lớp
  const grades = [
    { id: 6, name: 'Lớp 6', icon: '📚', color: 'from-purple-400 to-purple-600' },
    { id: 7, name: 'Lớp 7', icon: '🔬', color: 'from-blue-400 to-blue-600' },
    { id: 8, name: 'Lớp 8', icon: '⚡', color: 'from-green-400 to-green-600' },
    { id: 9, name: 'Lớp 9', icon: '🔋', color: 'from-yellow-400 to-yellow-600' },
    { id: 10, name: 'Lớp 10', icon: '🎯', color: 'from-orange-400 to-orange-600' },
    { id: 11, name: 'Lớp 11', icon: '🔥', color: 'from-red-400 to-red-600' },
    { id: 12, name: 'Lớp 12', icon: '⚛️', color: 'from-pink-400 to-pink-600' },
  ];

  // Load tiến trình từ database khi component mount hoặc khi chuyển lớp
  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      
      // Nếu user đã đăng nhập
      if (user && user.email) {
        try {
          const response = await api.get(`/users/physics-game-progress/${user.email}/${selectedGrade}`);
          if (response.data.success) {
            const dbProgress = response.data.progress;
            setCompletedGames(dbProgress.completed || []);
            setCurrentGame(dbProgress.current || games[0]?.id);
            // Cập nhật localStorage từ DB để sync
            localStorage.setItem(`physics-games-progress-grade-${selectedGrade}`, JSON.stringify(dbProgress));
          } else {
            // Không có data từ DB, reset
            setCompletedGames([]);
            setCurrentGame(games[0]?.id);
            localStorage.removeItem(`physics-games-progress-grade-${selectedGrade}`);
          }
        } catch (error) {
          // Nếu lỗi (user không tồn tại hoặc error khác), reset
          setCompletedGames([]);
          setCurrentGame(games[0]?.id);
          localStorage.removeItem(`physics-games-progress-grade-${selectedGrade}`);
        }
      } else {
        // User chưa đăng nhập, lấy từ localStorage
        const savedProgress = localStorage.getItem(`physics-games-progress-grade-${selectedGrade}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setCompletedGames(progress.completed || []);
          setCurrentGame(progress.current || games[0]?.id);
        } else {
          setCompletedGames([]);
          setCurrentGame(games[0]?.id);
        }
      }
      
      setLoading(false);
    };

    loadProgress();
  }, [selectedGrade, user]);

  // Cập nhật currentGame khi games thay đổi (nhưng giữ nguyên completedGames)
  useEffect(() => {
    if (games.length > 0 && !currentGame && !loading) {
      setCurrentGame(games[0]?.id);
    }
  }, [games, currentGame, loading]);

  // Lưu tiến trình vào localStorage và DB
  const saveProgress = async (gameId) => {
    const newCompleted = [...completedGames, gameId];
    const nextGameIndex = games.findIndex(g => g.id === gameId) + 1;
    const nextGame = games[nextGameIndex]?.id || null;

    setCompletedGames(newCompleted);
    setCurrentGame(nextGame);

    const progressData = {
      completed: newCompleted,
      current: nextGame
    };

    // Lưu vào localStorage
    localStorage.setItem(`physics-games-progress-grade-${selectedGrade}`, JSON.stringify(progressData));

    // Lưu vào DB nếu user đã đăng nhập
    if (user && user.email) {
      try {
        await api.post(`/users/physics-game-progress/${user.email}`, {
          grade: selectedGrade,
          completed: newCompleted,
          current: nextGame
        });
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    }
  };

  // Kiểm tra game đã hoàn thành
  const isCompleted = (gameId) => completedGames.includes(gameId);

  // Kiểm tra game đang chơi
  const isCurrent = (gameId) => gameId === currentGame;

  // Kiểm tra game bị khóa
  const isLocked = (gameId) => {
    const gameIndex = games.findIndex(g => g.id === gameId);
    if (gameIndex === 0) return false;
    const previousGame = games[gameIndex - 1];
    return !isCompleted(previousGame.id);
  };

  // Xử lý click vào game node
  const handleGameClick = (game) => {
    if (isLocked(game.id)) {
      return;
    }
    navigate(game.path);
  };

  // Xử lý đánh dấu hoàn thành
  const handleCompleteGame = (e, gameId) => {
    e.stopPropagation(); // Ngăn không cho trigger handleGameClick
    saveProgress(gameId);
  };

  // Xử lý reset tiến độ (nếu cần)
  const handleResetProgress = () => {
    if (confirm('Bạn có chắc muốn reset tiến độ không?')) {
      setCompletedGames([]);
      setCurrentGame(games[0]?.id);
      localStorage.removeItem(`physics-games-progress-grade-${selectedGrade}`);
    }
  };

  // Nhóm games theo chapter
  const groupGamesByChapter = () => {
    const chapters = {};
    games.forEach(game => {
      const chapterKey = `chapter-${game.chapter}`;
      if (!chapters[chapterKey]) {
        chapters[chapterKey] = {
          number: game.chapter,
          games: []
        };
      }
      chapters[chapterKey].games.push(game);
    });
    return Object.values(chapters);
  };

  const chapters = groupGamesByChapter();

  // Tính toán thống kê cho lớp hiện tại
  const totalGames = games.length;
  const completedCount = completedGames.length;
  const progress = totalGames > 0 ? Math.round((completedCount / totalGames) * 100) : 0;

  // Tính toán tổng cúp của tất cả các lớp
  const getTotalTrophies = () => {
    let total = 0;
    grades.forEach(grade => {
      const savedProgress = localStorage.getItem(`physics-games-progress-grade-${grade.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        total += (progress.completed || []).length;
      }
    });
    return total;
  };

  const totalTrophies = getTotalTrophies();

  return (
    <div className="game-journey-container">
      {/* Header */}
      <div className="journey-header">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="journey-title">Hành Trình Vật Lý</h1>
        <div className="header-actions">
          <div className="journey-stats current-grade">
            <Trophy className="trophy-icon" />
            <div className="stats-text">
              <div className="stats-label">Lớp {selectedGrade}</div>
              <div className="stats-value">{completedCount}/{totalGames}</div>
            </div>
          </div>
          {totalTrophies > 0 && (
            <div className="journey-stats total-trophies">
              <Trophy className="trophy-icon-large" />
              <div className="stats-text">
                <div className="stats-label">Tổng cúp</div>
                <div className="stats-value">{totalTrophies}</div>
              </div>
            </div>
          )}
          {completedCount > 0 && (
            <button
              onClick={handleResetProgress}
              className="reset-button"
              title="Reset tiến độ"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Grade Selector */}
      <div className="grade-selector">
        {grades.map(grade => {
          // Tính tiến độ cho từng lớp
          const gradeProgress = localStorage.getItem(`physics-games-progress-grade-${grade.id}`);
          const gradeCompleted = gradeProgress ? JSON.parse(gradeProgress).completed?.length || 0 : 0;
          const gradeTotal = getGamesForGrade(grade.id).length;
          const gradePercent = gradeTotal > 0 ? Math.round((gradeCompleted / gradeTotal) * 100) : 0;
          
          return (
            <button
              key={grade.id}
              onClick={() => setSelectedGrade(grade.id)}
              className={`grade-button ${selectedGrade === grade.id ? 'active' : ''}`}
              data-color={grade.color}
            >
              <span className="grade-icon">{grade.icon}</span>
              <div className="grade-info">
                <span className="grade-name">{grade.name}</span>
                {gradeCompleted > 0 && (
                  <span className="grade-progress">{gradePercent}%</span>
                )}
              </div>
              {gradeCompleted > 0 && (
                <div className="grade-trophy-count">
                  <Trophy size={14} />
                  {gradeCompleted}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Tiến độ Lớp {selectedGrade}</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-details">
          <span>{completedCount} hoàn thành</span>
          <span>•</span>
          <span>{totalGames - completedCount} còn lại</span>
        </div>
      </div>

      {/* Journey Path */}
      <div className="journey-path">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.number} className="chapter-section">
            <div className="chapter-header">
              <h2 className="chapter-title">Chương {chapter.number}</h2>
              <div className="chapter-stats">
                <CheckCircle size={16} />
                <span>{chapter.games.filter(g => isCompleted(g.id)).length}/{chapter.games.length}</span>
              </div>
            </div>

            <div className="games-path">
              {chapter.games.map((game, gameIndex) => {
                const completed = isCompleted(game.id);
                const current = isCurrent(game.id);
                const locked = isLocked(game.id);
                const position = gameIndex % 2 === 0 ? 'left' : 'right';

                return (
                  <div key={game.id} className="game-node-wrapper">
                    {/* Connection Line */}
                    {gameIndex > 0 && <div className="connection-line" />}

                    {/* Game Node */}
                    <div 
                      className={`game-node ${position} ${completed ? 'completed' : ''} ${current ? 'current' : ''} ${locked ? 'locked' : ''}`}
                      onClick={() => handleGameClick(game)}
                    >
                      {/* Node Icon/Circle */}
                      <div className={`node-circle bg-gradient-to-br ${game.color}`}>
                        {locked ? (
                          <Lock size={24} />
                        ) : completed ? (
                          <CheckCircle size={28} />
                        ) : current ? (
                          <Star size={28} className="pulse" />
                        ) : (
                          <Target size={24} />
                        )}
                      </div>

                      {/* Node Info Card */}
                      <div className={`node-card ${position}`}>
                        <div className="node-card-header">
                          <h3 className="node-title">{game.title}</h3>
                          {completed && (
                            <div className="completion-badge">
                              <CheckCircle size={16} />
                            </div>
                          )}
                        </div>
                        
                        <p className="node-description">{game.description}</p>
                        
                        <div className="node-meta">
                          <div className="meta-item">
                            <Clock size={14} />
                            <span>{game.estimatedTime} phút</span>
                          </div>
                          <div className={`meta-item difficulty-${game.difficulty}`}>
                            <Zap size={14} />
                            <span>
                              {game.difficulty === 'easy' ? 'Dễ' : 
                               game.difficulty === 'medium' ? 'TB' : 'Khó'}
                            </span>
                          </div>
                        </div>

                        {!locked && (
                          <div className="node-actions">
                            <button 
                              className={`play-button ${completed ? 'replay' : current ? 'primary' : ''}`}
                              onClick={() => handleGameClick(game)}
                            >
                              {completed ? 'Chơi lại' : current ? 'Bắt đầu' : 'Chơi'}
                            </button>
                            {!completed && (
                              <button 
                                className="complete-button"
                                onClick={(e) => handleCompleteGame(e, game.id)}
                                title="Đánh dấu hoàn thành"
                              >
                                <CheckCircle size={16} />
                                Hoàn thành
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Milestone Badge */}
                    {gameIndex === chapter.games.length - 1 && (
                      <div className="milestone-badge">
                        <Trophy size={24} />
                        <span>Hoàn thành Chương {chapter.number}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Journey Complete */}
        {completedCount === totalGames && totalGames > 0 && (
          <div className="journey-complete">
            <div className="complete-icon">
              <Trophy size={48} />
            </div>
            <h2>Xuất sắc!</h2>
            <p>Bạn đã hoàn thành tất cả các trò chơi lớp {selectedGrade}</p>
            {selectedGrade < 12 && (
              <button 
                className="next-grade-button"
                onClick={() => setSelectedGrade(selectedGrade + 1)}
              >
                Tiếp tục lớp {selectedGrade + 1}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameJourney;
