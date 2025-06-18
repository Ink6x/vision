import React from 'react';
import { Star, Trophy, Zap } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  experience: number;
  experienceToNext: number;
  className?: string;
}

export default function LevelProgress({ 
  level, 
  experience, 
  experienceToNext, 
  className = '' 
}: LevelProgressProps) {
  const progressPercentage = (experience / (experience + experienceToNext)) * 100;

  const getLevelIcon = (level: number) => {
    if (level >= 50) return Trophy;
    if (level >= 20) return Star;
    return Zap;
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-yellow-400 to-orange-500';
    if (level >= 20) return 'from-purple-400 to-pink-500';
    if (level >= 10) return 'from-blue-400 to-indigo-500';
    return 'from-green-400 to-blue-500';
  };

  const Icon = getLevelIcon(level);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full bg-gradient-to-r ${getLevelColor(level)}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">レベル {level}</h3>
            <p className="text-sm text-gray-600">
              次のレベルまで {experienceToNext.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{experience.toLocaleString()}</p>
          <p className="text-xs text-gray-500">総経験値</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">進捗</span>
          <span className="text-gray-900 font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(level)} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}