import React from 'react';
import { MainGoal } from '../types/gamification';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface MilestoneGraphProps {
  goal: MainGoal;
}

export default function MilestoneGraph({ goal }: MilestoneGraphProps) {
  const totalMilestones = goal.milestones.length;
  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
  
  // 指数関数的な配置のための計算
  const getPositionY = (index: number) => {
    const progress = index / (totalMilestones - 1);
    // 指数関数的な曲線 (y = x^2 を反転)
    const exponentialProgress = Math.pow(progress, 0.5);
    return 100 - (exponentialProgress * 80); // 80%の高さを使用
  };

  const getPositionX = (index: number) => {
    return (index / (totalMilestones - 1)) * 80 + 10; // 10%から90%の範囲
  };

  // SVGパスの生成
  const generatePath = () => {
    if (totalMilestones === 0) return '';
    
    let path = `M ${getPositionX(0)} ${getPositionY(0)}`;
    for (let i = 1; i < totalMilestones; i++) {
      const x = getPositionX(i);
      const y = getPositionY(i);
      // 滑らかな曲線のためのベジェ曲線
      const prevX = getPositionX(i - 1);
      const prevY = getPositionY(i - 1);
      const cp1x = prevX + (x - prevX) * 0.5;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) * 0.5;
      const cp2y = y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }
    return path;
  };

  const currentMilestoneIndex = completedMilestones;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          目標への道のり
        </h3>
        <div className="text-sm text-gray-600">
          {completedMilestones} / {totalMilestones} 完了
        </div>
      </div>

      <div className="relative h-80 bg-gradient-to-t from-blue-50 to-white rounded-lg overflow-hidden">
        {/* 背景グリッド */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-300">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* メインパス */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* 完了済みパス */}
          {completedMilestones > 0 && (
            <path
              d={generatePath().split(' ').slice(0, completedMilestones * 6 + 2).join(' ')}
              stroke="#10B981"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
          )}
          
          {/* 未完了パス */}
          <path
            d={generatePath()}
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            strokeLinecap="round"
            className="opacity-60"
          />
        </svg>

        {/* マイルストーン点 */}
        {goal.milestones.map((milestone, index) => {
          const x = getPositionX(index);
          const y = getPositionY(index);
          const isCompleted = milestone.isCompleted;
          const isCurrent = index === currentMilestoneIndex && !isCompleted;
          
          return (
            <div
              key={milestone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* マイルストーン点 */}
              <div
                className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 border-green-400 shadow-lg scale-110'
                    : isCurrent
                    ? 'bg-blue-500 border-blue-400 shadow-lg scale-125 animate-pulse'
                    : 'bg-white border-gray-300 shadow-md'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-400" />
                )}
              </div>

              {/* マイルストーンラベル */}
              <div
                className={`absolute top-8 left-1/2 transform -translate-x-1/2 min-w-max ${
                  index % 2 === 0 ? 'text-left' : 'text-right'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg shadow-sm text-xs font-medium transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className="font-semibold">{milestone.title}</div>
                  {milestone.targetDate && (
                    <div className="text-xs opacity-75 mt-1">
                      {milestone.targetDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* 現在位置インジケーター */}
        {currentMilestoneIndex < totalMilestones && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${getPositionX(currentMilestoneIndex)}%`,
              top: `${getPositionY(currentMilestoneIndex)}%`
            }}
          >
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                現在地
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600 mx-auto"></div>
            </div>
          </div>
        )}

        {/* ゴール */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
            <Target className="w-4 h-4" />
            <span className="text-sm font-semibold">GOAL</span>
          </div>
        </div>
      </div>

      {/* 進捗サマリー */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{completedMilestones}</div>
          <div className="text-xs text-green-700">完了</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">
            {totalMilestones - completedMilestones}
          </div>
          <div className="text-xs text-blue-700">残り</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600">{Math.round(goal.progress)}%</div>
          <div className="text-xs text-purple-700">達成率</div>
        </div>
      </div>
    </div>
  );
}