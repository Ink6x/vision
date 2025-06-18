import React from 'react';
import { MainGoal } from '../types/gamification';
import { Target, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface MainGoalCardProps {
  goal: MainGoal;
  onMilestoneComplete?: (goalId: string, milestoneId: string) => void;
}

export default function MainGoalCard({ goal, onMilestoneComplete }: MainGoalCardProps) {
  const getDifficultyColor = (difficulty: MainGoal['difficulty']) => {
    switch (difficulty) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getDifficultyLabel = (difficulty: MainGoal['difficulty']) => {
    switch (difficulty) {
      case 'expert': return 'エキスパート';
      case 'hard': return 'ハード';
      case 'medium': return 'ミディアム';
      default: return 'イージー';
    }
  };

  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = goal.milestones.length;
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 p-6 ${
      goal.isCompleted ? 'border-green-300' : 'border-blue-200'
    }`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
              <p className="text-sm text-gray-600">{goal.category}</p>
            </div>
            {goal.isCompleted && <CheckCircle2 className="w-6 h-6 text-green-600" />}
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">{goal.description}</p>
          
          <div className="flex items-center space-x-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(goal.difficulty)}`}>
              {getDifficultyLabel(goal.difficulty)}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>{goal.experienceReward} XP</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {daysRemaining > 0 ? `あと${daysRemaining}日` : 
                 daysRemaining === 0 ? '今日が期限' : 
                 `${Math.abs(daysRemaining)}日超過`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="ml-6">
          <ProgressRing 
            progress={goal.progress} 
            size={100} 
            strokeWidth={8}
            color={goal.isCompleted ? '#10B981' : '#3B82F6'}
          />
        </div>
      </div>

      {/* マイルストーン */}
      {goal.milestones.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">マイルストーン</h3>
            <span className="text-sm text-gray-600">
              {completedMilestones} / {totalMilestones} 完了
            </span>
          </div>
          <div className="space-y-3">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  milestone.isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => !milestone.isCompleted && onMilestoneComplete?.(goal.id, milestone.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      milestone.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {milestone.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <h4 className={`font-medium ${milestone.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className={`text-sm ${milestone.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {milestone.targetDate && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{milestone.targetDate.toLocaleDateString('ja-JP')}</span>
                    </div>
                  )}
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

      {/* コーチからのメモ */}
      {goal.coachNotes && (
        <div className="bg-white/70 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">コーチからのメモ</h4>
          <p className="text-sm text-gray-700 italic">"{goal.coachNotes}"</p>
        </div>
      )}
    </div>
  );
}