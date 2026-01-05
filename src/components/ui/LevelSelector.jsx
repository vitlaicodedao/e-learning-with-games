import { useState } from 'react';
import Card from './Card';
import Button from './Button';

const LevelSelector = ({ onSelectLevel, progress }) => {
  const [selectedLevel, setSelectedLevel] = useState('basic');

  const levels = [
    {
      id: 'basic',
      name: 'Cơ bản',
      icon: '🌱',
      color: 'from-green-400 to-emerald-500',
      description: 'Dành cho người mới bắt đầu',
      star: progress?.stars?.basic,
      score: progress?.levelScores?.basic || 0,
      unlocked: true
    },
    {
      id: 'intermediate',
      name: 'Trung bình',
      icon: '🔥',
      color: 'from-orange-400 to-red-500',
      description: 'Nâng cao độ khó, thử thách hơn',
      star: progress?.stars?.intermediate,
      score: progress?.levelScores?.intermediate || 0,
      unlocked: progress?.stars?.basic || false // Cần hoàn thành cơ bản
    },
    {
      id: 'advanced',
      name: 'Nâng cao',
      icon: '⚡',
      color: 'from-purple-400 to-pink-500',
      description: 'Dành cho học sinh giỏi',
      star: progress?.stars?.advanced,
      score: progress?.levelScores?.advanced || 0,
      unlocked: progress?.stars?.intermediate || false // Cần hoàn thành trung bình
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn cấp độ</h2>
        <p className="text-gray-600">Chọn độ khó phù hợp với trình độ của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all border-2 ${
              !level.unlocked 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : selectedLevel === level.id
                ? 'border-primary-500 shadow-lg'
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => level.unlocked && setSelectedLevel(level.id)}
          >
            <div className={`bg-gradient-to-r ${level.color} text-white p-4 -m-6 mb-4 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{level.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{level.name}</h3>
                    <p className="text-sm opacity-90">{level.description}</p>
                  </div>
                </div>
                {level.unlocked ? (
                  <div className="text-right">
                    <div className={`text-2xl ${level.star ? 'text-yellow-300' : 'text-white/30'}`}>
                      ⭐
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl">🔒</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {level.unlocked ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Điểm cao nhất:</span>
                    <span className="font-medium text-gray-800">{level.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`font-medium ${level.star ? 'text-success' : 'text-gray-500'}`}>
                      {level.star ? '✓ Đạt sao' : '○ Chưa đạt'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  🔒 Hoàn thành cấp độ {level.id === 'intermediate' ? 'Cơ bản' : 'Trung bình'} để mở khóa
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button
          onClick={() => {
            const level = levels.find(l => l.id === selectedLevel);
            if (level?.unlocked) {
              onSelectLevel(selectedLevel);
            }
          }}
          disabled={!levels.find(l => l.id === selectedLevel)?.unlocked}
          size="lg"
          className="px-8"
        >
          Bắt đầu chơi
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Hướng dẫn:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hoàn thành ≥80% số câu hỏi để đạt sao ⭐</li>
          <li>• Mở khóa cấp độ cao hơn bằng cách đạt sao ở cấp trước</li>
          <li>• Mỗi bài học có thể đạt tối đa 3 sao (1 sao/cấp độ)</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelSelector;
