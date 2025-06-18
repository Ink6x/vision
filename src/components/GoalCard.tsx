import React from 'react';
import { GoalWithGameData } from '../types/gamification';
import { Calendar, Target, Zap, CheckCircle2 } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface GoalCardProps {
  goal: GoalWithGameData;
  onMilestoneComplete?: (goalId: string, milestoneId: string) => void;
}

export default function GoalCard({ goal, onMilestoneComplete }: GoalCardProps) {
  const getDifficultyColor = (difficulty: GoalWithGameData['difficulty']) => {
    switch (difficulty) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getDifficultyLabel = (difficulty: GoalWithGameData['difficulty']) => {
    switch (difficulty) {
      case 'expert': return 'エキスパート';
      case 'hard': return 'ハード';
      case 'medium': return 'ミディアム';
      default: return 'イージー';
    }
  };

  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = goal.milestones.length;

  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
      goal.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`font-semibold ${goal.isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
              {goal.title}
            </h3>
            {goal.isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(goal.difficulty)}`}>
              {getDifficultyLabel(goal.difficulty)}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {goal.category}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Zap className="w-3 h-3" />
              <span>{goal.experienceReward} XP</span>
            </div>
          </div>
        </div>
        <ProgressRing 
          progress={goal.progress} 
          size={80} 
          strokeWidth={6}
          color={goal.isCompleted ? '#10B981' : '#3B82F6'}
        />
      </div>

      {/* マイルストーン */}
      {goal.milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">マイルストーン</h4>
            <span className="text-xs text-gray-500">
              {completedMilestones} / {totalMilestones} 完了
            </span>
          </div>
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  milestone.isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => !milestone.isCompleted && onMilestoneComplete?.(goal.id, milestone.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      milestone.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {milestone.isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-sm ${milestone.isCompleted ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                    {milestone.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Zap className="w-3 h-3" />
                    <span>{milestone.experienceReward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>期限: {goal.deadline.toLocaleDateString('ja-JP')}</span>
        </div>
        {goal.completedAt && (
          <div className="text-green-600 font-medium">
            {goal.completedAt.toLocaleDateString('ja-JP')} 完了
          </div>
        )}
      </div>
    </div>
  );
}