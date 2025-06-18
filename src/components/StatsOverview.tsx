import React from 'react';
import { UserStats } from '../types/gamification';
import { Target, Flame, Calendar, Trophy } from 'lucide-react';

interface StatsOverviewProps {
  stats: UserStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">完了したToDo</p>
            <p className="text-xl font-semibold text-gray-900">{stats.totalGoalsCompleted}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">現在の連続記録</p>
            <p className="text-xl font-semibold text-gray-900">{stats.currentStreak}日</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">セッション回数</p>
            <p className="text-xl font-semibold text-gray-900">{stats.totalSessionsCompleted}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">獲得バッジ</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.achievements.filter(a => a.unlockedAt).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}