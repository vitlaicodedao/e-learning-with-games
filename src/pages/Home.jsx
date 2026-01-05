import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Redirect logic based on user state
    if (user && user.programs && user.programs.length > 0) {
      // User has enrolled programs - redirect to the active program
      const activeProgram = user.programs.find(p => p.isActive);
      if (activeProgram) {
        navigate(`/program/${activeProgram.programId}`);
      } else {
        // No active program, go to selection
        navigate('/');
      }
    } else {
      // No programs enrolled, redirect to program selection
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Logout Button - Fixed Position */}
      {user && (
        <button
          onClick={handleLogout}
          className="fixed top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl border border-gray-200 hover:border-red-300 z-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      )}

      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
};

export default Home;
