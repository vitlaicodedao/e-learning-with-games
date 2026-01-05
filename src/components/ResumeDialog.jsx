import React from 'react';
import { PlayCircle, RotateCcw } from 'lucide-react';

/**
 * Component dialog để hỏi người dùng có muốn tiếp tục thử thách hay không
 * @param {boolean} show - Hiển thị dialog
 * @param {function} onResume - Callback khi tiếp tục
 * @param {function} onRestart - Callback khi bắt đầu lại
 * @param {object} progressInfo - Thông tin tiến trình {current, total, score}
 */
const ResumeDialog = ({ show, onResume, onRestart, progressInfo }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💾</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Tiếp tục thử thách?
          </h3>
          <p className="text-gray-600">
            Bạn có muốn tiếp tục từ nơi đã dừng lại không?
          </p>
        </div>
        
        {progressInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến trình:</span>
              <span className="font-bold text-blue-600">
                {progressInfo.current}/{progressInfo.total}
              </span>
            </div>
            {progressInfo.score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Điểm hiện tại:</span>
                <span className="font-bold text-green-600">
                  {progressInfo.score} điểm
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onResume}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
          >
            <PlayCircle className="w-5 h-5" />
            Tiếp tục
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Bắt đầu lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeDialog;
