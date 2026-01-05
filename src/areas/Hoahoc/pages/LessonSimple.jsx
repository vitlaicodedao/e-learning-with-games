import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const LessonSimple = () => {
  const { classId, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bắt đầu trò chơi (không còn cơ chế bỏ qua tự động khi đã đọc trước đó)
  const handleStartGame = () => {
    navigate(`/gameplay/${classId}/${chapterId}/${lessonId}`);
  };

  useEffect(() => {
    console.log('Fetching lesson...', { classId, chapterId, lessonId });
    console.log('API_URL:', API_URL);
    
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const url = `${API_URL}/lessons/class/${classId}/chapter/${chapterId}/lesson/${lessonId}`;
        console.log('Making request to:', url);
        
        const response = await axios.get(url);
        console.log('Lesson data:', response.data);
        setLessonData(response.data);
        setError(null);

        // Bỏ cơ chế tự động chuyển sang gameplay nếu đã đọc trước đó
      } catch (err) {
        console.error('Error fetching lesson:', err);
        console.error('Error details:', err.response);
        setError(err.response?.data?.message || 'Không thể tải bài học');
      } finally {
        setLoading(false);
      }
    };

    if (classId && chapterId && lessonId) {
      fetchLesson();
    }
  }, [classId, chapterId, lessonId, navigate]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f0f9ff' }}>
        <h2>⏳ Đang tải bài học...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fee' }}>
        <h2 style={{ color: 'red' }}>⚠️ Có lỗi xảy ra</h2>
        <p>{error}</p>
        <div style={{ marginTop: '12px', color: '#444' }}>
          <div>Khả năng cao là dữ liệu bài học đang trống.</div>
          <div>Hãy chạy lại lệnh seed để tạo dữ liệu mẫu:</div>
          <pre style={{ background: '#111', color: '#fff', padding: '10px', borderRadius: '6px', display: 'inline-block' }}>npm run seed</pre>
          <div style={{ marginTop: '6px' }}>Sau đó F5 trang và thử lại.</div>
        </div>
        <button style={{ marginTop: '16px' }} onClick={() => navigate('/program/chemistry/dashboard')}>Quay về Dashboard</button>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>📚 Không tìm thấy bài học</h2>
        <button onClick={() => navigate('/program/chemistry/dashboard')}>Quay về Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
     

      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{lessonData.title}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>{lessonData.description}</p>

      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>📖 Lý thuyết</h2>
        <div dangerouslySetInnerHTML={{ __html: lessonData.theory }} />
        
        {/* Nút đã đọc */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={handleStartGame}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            🎮 Bắt đầu trò chơi
          </button>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Bạn cần đọc nội dung trước rồi chủ động chọn bắt đầu trò chơi.
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default LessonSimple;
