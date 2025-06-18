import React from 'react';
import { Achievement } from '../types/gamification';
import { Award, Lock, Star, Crown, Gem } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function AchievementBadge({ 
  achievement, 
  size = 'md', 
  showDetails = false 
}: AchievementBadgeProps) {
  const isUnlocked = !!achievement.unlockedAt;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return Crown;
      case 'epic': return Gem;
      case 'rare': return Star;
      default: return Award;
    }
  };

  const Icon = getRarityIcon(achievement.rarity);

  return (
    <div className={`relative ${showDetails ? 'space-y-2' : ''}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center 
          transition-all duration-300 hover:scale-110
          ${isUnlocked 
            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} shadow-lg` 
            : 'bg-gray-200 opacity-50'
          }
        `}
      >
        {isUnlocked ? (
          <Icon className="w-1/2 h-1/2 text-white" />
        ) : (
          <Lock className="w-1/2 h-1/2 text-gray-400" />
        )}
      </div>
      
      {showDetails && (
        <div className="text-center">
          <h4 className={`text-sm font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            {achievement.description}
          </p>
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {achievement.progress} / {achievement.maxProgress}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}