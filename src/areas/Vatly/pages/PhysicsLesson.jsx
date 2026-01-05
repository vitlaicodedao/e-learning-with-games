import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { physicsLessons } from '../data/physicsLessons';

const PhysicsLesson = () => {
  const { classId, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        
        // Fetch from backend
        const response = await axios.get(
          `${API_BASE_URL}/lessons/class/${classId}/chapter/${chapterId}/lesson/${lessonId}`,
          { params: { subject: 'physics' } }
        );
        
        if (response.data) {
          setLessonData(response.data);
        } else {
          // Fallback to frontend data
          const classData = physicsLessons[classId];
          if (classData) {
            const chapter = classData.chapters.find(ch => ch.id === parseInt(chapterId));
            if (chapter) {
              const lesson = chapter.lessons.find(l => l.id === parseInt(lessonId));
              if (lesson) {
                setLessonData({
                  id: `vatly-${classId}-${chapterId}-${lessonId}`,
                  title: lesson.title,
                  classId: parseInt(classId),
                  chapterId: parseInt(chapterId),
                  lessonNumber: parseInt(lessonId),
                  content: {
                    theory: `<h2>${lesson.title}</h2><p>Nội dung bài học đang được cập nhật...</p>`,
                    examples: [],
                    exercises: []
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        // Use fallback data
        const classData = physicsLessons[classId];
        if (classData) {
          const chapter = classData.chapters.find(ch => ch.id === parseInt(chapterId));
          if (chapter) {
            const lesson = chapter.lessons.find(l => l.id === parseInt(lessonId));
            if (lesson) {
              setLessonData({
                id: `vatly-${classId}-${chapterId}-${lessonId}`,
                title: lesson.title,
                classId: parseInt(classId),
                chapterId: parseInt(chapterId),
                lessonNumber: parseInt(lessonId),
                content: {
                  theory: `<h2>${lesson.title}</h2><p>Nội dung bài học đang được cập nhật...</p>`,
                  examples: [],
                  exercises: []
                }
              });
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [classId, chapterId, lessonId]);

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      if (lessonData) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const userEmail = user?.id || user?.email;
          if (userEmail) {
            const response = await axios.get(`${API_BASE_URL}/lesson-completions`, {
              params: {
                userId: userEmail,
                lessonId: lessonData.id
              }
            });
            if (response.data) {
              const { score, quizAnswers, completed } = response.data;
              setScore(score);
              setQuizAnswers(quizAnswers);
              setIsCompleted(completed);
              if (completed) {
                setActiveTab('exercises');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching lesson completion status:', error);
        }
      }
    };
    fetchCompletionStatus();
  }, [lessonData]);

  const saveFinalProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.id || user?.email ;
      
      if (userEmail && lessonData) {
        const progressData = {
          userId: userEmail,
          lessonId: lessonData.id,
          classId: parseInt(classId),
          chapterId: parseInt(chapterId),
          lessonNumber: parseInt(lessonId),
          score: score,
          totalQuestions: exercises.length,
          completed: true,
          quizAnswers: quizAnswers
        };

        await axios.post(`${API_BASE_URL}/lesson-completions`, progressData);
      }
    } catch (error) {
      console.error('Error saving final progress:', error);
    }
  }

  useEffect(() => {
    if (isCompleted) {
      saveFinalProgress();
    }
  }, [isCompleted]);

  const exercises = lessonData?.content?.exercises || [];
  const currentExercise = exercises[currentQuizIndex];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    
    setQuizAnswers([...quizAnswers, {
      questionIndex: currentQuizIndex,
      selectedAnswer,
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < exercises.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleFinish = () => {
    navigate(`/physics-class/${classId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚛️</div>
          <h2 className="text-2xl font-bold text-gray-700">Đang tải bài học...</h2>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài học</h2>
            <button
              onClick={() => navigate(`/physics-class/${classId}`)}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/physics-class/${classId}`)}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách bài học
          </button>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                📚
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{lessonData.title}</h1>
                <p className="text-gray-600">Lớp {classId} - Chương {chapterId} - Bài {lessonId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'theory'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Lý thuyết
            </button>
            {exercises.length > 0 && (
              <button
                onClick={() => setActiveTab('exercises')}
                className={`flex-1 py-4 px-6 font-medium transition-all ${
                  activeTab === 'exercises'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Trophy className="w-5 h-5 inline mr-2" />
                Bài tập ({exercises.length})
              </button>
            )}
          </div>

          <div className="p-8">
            {/* Theory Tab */}
            {activeTab === 'theory' && (
              <div className="prose max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: lessonData.content.theory }}
                  className="text-gray-800 leading-relaxed"
                />
                
                {exercises.length > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setActiveTab('exercises')}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Làm bài tập →
                    </button>
                  </div>
                )}
                
                {exercises.length === 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleFinish}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Hoàn thành bài học
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Exercises Tab */}
            {activeTab === 'exercises' && (
              <div>
                {!isCompleted ? (
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Câu {currentQuizIndex + 1} / {exercises.length}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Điểm: {score} / {exercises.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${((currentQuizIndex + 1) / exercises.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {currentExercise?.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {currentExercise?.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => !showResult && handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showResult
                                ? index === currentExercise.correctAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : index === selectedAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-white'
                                : selectedAnswer === index
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                showResult
                                  ? index === currentExercise.correctAnswer
                                    ? 'bg-green-500 text-white'
                                    : index === selectedAnswer
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                  : selectedAnswer === index
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="flex-1">{option}</span>
                              {showResult && index === currentExercise.correctAnswer && (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              )}
                              {showResult && index === selectedAnswer && index !== currentExercise.correctAnswer && (
                                <XCircle className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {showResult && (
                      <div className={`rounded-xl p-6 mb-6 ${
                        selectedAnswer === currentExercise.correctAnswer
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-red-50 border-2 border-red-200'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          {selectedAnswer === currentExercise.correctAnswer ? (
                            <>
                              <CheckCircle className="w-6 h-6 text-green-600" />
                              <span className="font-bold text-green-600">Chính xác!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 text-red-600" />
                              <span className="font-bold text-red-600">Chưa đúng!</span>
                            </>
                          )}
                        </div>
                        {currentExercise.explanation && (
                          <p className="text-gray-700">{currentExercise.explanation}</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      {!showResult && selectedAnswer !== null && (
                        <button
                          onClick={handleCheckAnswer}
                          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          Kiểm tra đáp án
                        </button>
                      )}
                      
                      {showResult && (
                        <button
                          onClick={handleNextQuestion}
                          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          {currentQuizIndex < exercises.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Hoàn thành bài học!
                      </h2>
                      <p className="text-xl text-gray-600 mb-8">
                        Bạn đã trả lời đúng {score}/{exercises.length} câu hỏi
                      </p>
                      
                      <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                          {exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 100}%
                        </div>
                        <div className="text-gray-600">Độ chính xác</div>
                      </div>
                    </div>

                    {exercises.map((exercise, index) => {
                      const answer = quizAnswers.find(a => a.questionIndex === index);
                      const selected = answer ? answer.selectedAnswer : null;
                      
                      return (
                        <div key={index} className="bg-gray-50 rounded-xl p-6 mb-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Câu {index + 1}: {exercise.question}
                          </h3>
                          
                          <div className="space-y-3">
                            {exercise.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`w-full text-left p-4 rounded-lg border-2 ${
                                  optionIndex === exercise.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : optionIndex === selected
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    optionIndex === exercise.correctAnswer
                                      ? 'bg-green-500 text-white'
                                      : optionIndex === selected
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  <span className="flex-1">{option}</span>
                                  {optionIndex === exercise.correctAnswer && (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                  )}
                                  {optionIndex === selected && optionIndex !== exercise.correctAnswer && (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {exercise.explanation && (
                            <div className="mt-4 rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
                                <p className="text-gray-700">{exercise.explanation}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    <div className="text-center mt-8">
                        <button
                          onClick={handleFinish}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          Quay lại
                        </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsLesson;
