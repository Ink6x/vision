import React, { useState } from 'react';
import { MainGoal, Milestone } from '../types/gamification';
import { Target, Calendar, Plus, Edit3, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface GoalManagerProps {
  mainGoal: MainGoal;
  onUpdateGoal?: (goal: Partial<MainGoal>) => void;
  onUpdateMilestone?: (goalId: string, milestoneId: string, milestone: Partial<Milestone>) => void;
}

export default function GoalManager({ mainGoal, onUpdateGoal, onUpdateMilestone }: GoalManagerProps) {
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: mainGoal.title,
    description: mainGoal.description,
    targetDate: mainGoal.targetDate.toISOString().split('T')[0],
    difficulty: mainGoal.difficulty,
    coachNotes: mainGoal.coachNotes
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
    experienceReward: 100
  });

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

  const handleUpdateGoal = () => {
    onUpdateGoal?.({
      ...goalForm,
      targetDate: new Date(goalForm.targetDate)
    });
    setEditingGoal(false);
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) return;
    
    const milestone: Omit<Milestone, 'id'> = {
      ...newMilestone,
      targetDate: newMilestone.targetDate ? new Date(newMilestone.targetDate) : undefined,
      progress: 0,
      isCompleted: false
    };
    
    // 実際の実装では新しいマイルストーンを追加
    console.log('Add milestone:', milestone);
    
    setNewMilestone({
      title: '',
      description: '',
      targetDate: '',
      experienceReward: 100
    });
    setShowAddMilestone(false);
  };

  const completedMilestones = mainGoal.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = mainGoal.milestones.length;
  const daysRemaining = Math.ceil((mainGoal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((new Date().getTime() - mainGoal.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((mainGoal.targetDate.getTime() - mainGoal.startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* 目標概要統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">進捗率</p>
              <p className="text-xl font-semibold text-gray-900">{Math.round(mainGoal.progress)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">完了マイルストーン</p>
              <p className="text-xl font-semibold text-gray-900">{completedMilestones}/{totalMilestones}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">残り日数</p>
              <p className="text-xl font-semibold text-gray-900">
                {daysRemaining > 0 ? `${daysRemaining}日` : '期限超過'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">獲得可能XP</p>
              <p className="text-xl font-semibold text-gray-900">{mainGoal.experienceReward}</p>
            </div>
          </div>
        </div>
      </div>

      {/* メイン目標詳細 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">メイン目標</h2>
                <p className="text-sm text-gray-600">最終的に達成したい目標</p>
              </div>
              <button
                onClick={() => setEditingGoal(true)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="ml-6">
            <ProgressRing 
              progress={mainGoal.progress} 
              size={100} 
              strokeWidth={8}
              color={mainGoal.isCompleted ? '#10B981' : '#3B82F6'}
            />
          </div>
        </div>

        {editingGoal ? (
          <div className="space-y-4">
            <input
              type="text"
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="目標タイトル"
            />
            <textarea
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="目標の詳細説明"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={goalForm.difficulty}
                onChange={(e) => setGoalForm({ ...goalForm, difficulty: e.target.value as MainGoal['difficulty'] })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">イージー</option>
                <option value="medium">ミディアム</option>
                <option value="hard">ハード</option>
                <option value="expert">エキスパート</option>
              </select>
            </div>
            <textarea
              value={goalForm.coachNotes}
              onChange={(e) => setGoalForm({ ...goalForm, coachNotes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="コーチからのメモ"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingGoal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleUpdateGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{mainGoal.title}</h3>
              <p className="text-gray-700 leading-relaxed">{mainGoal.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(mainGoal.difficulty)}`}>
                {getDifficultyLabel(mainGoal.difficulty)}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>期限: {mainGoal.targetDate.toLocaleDateString('ja-JP')}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Zap className="w-4 h-4" />
                <span>{mainGoal.experienceReward} XP</span>
              </div>
            </div>

            {mainGoal.coachNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">コーチからのメモ</h4>
                <p className="text-sm text-blue-700 italic">"{mainGoal.coachNotes}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 進捗可視化 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          進捗の可視化
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 時間軸進捗 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">時間軸進捗</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>経過日数</span>
                <span>{daysElapsed}日 / {totalDays}日</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(daysElapsed / totalDays) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {Math.round((daysElapsed / totalDays) * 100)}% 経過
              </div>
            </div>
          </div>

          {/* マイルストーン進捗 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">マイルストーン進捗</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>完了数</span>
                <span>{completedMilestones} / {totalMilestones}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(completedMilestones / totalMilestones) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {Math.round((completedMilestones / totalMilestones) * 100)}% 完了
              </div>
            </div>
          </div>

          {/* 全体進捗 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">全体進捗</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>達成率</span>
                <span>{Math.round(mainGoal.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${mainGoal.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                目標達成まで {100 - Math.round(mainGoal.progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* マイルストーン管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">マイルストーン管理</h3>
          <button
            onClick={() => setShowAddMilestone(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>マイルストーン追加</span>
          </button>
        </div>

        {/* 新規マイルストーン追加フォーム */}
        {showAddMilestone && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">新しいマイルストーンを追加</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="マイルストーンのタイトル"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="詳細説明（任意）"
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newMilestone.targetDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  value={newMilestone.experienceReward}
                  onChange={(e) => setNewMilestone({ ...newMilestone, experienceReward: parseInt(e.target.value) })}
                  placeholder="獲得XP"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddMilestone(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* マイルストーン一覧 */}
        <div className="space-y-3">
          {mainGoal.milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                milestone.isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${milestone.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                    {milestone.title}
                  </h4>
                  {milestone.description && (
                    <p className={`text-sm ${milestone.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {milestone.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 mt-1">
                    {milestone.targetDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{milestone.targetDate.toLocaleDateString('ja-JP')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Zap className="w-3 h-3" />
                      <span>{milestone.experienceReward} XP</span>
                    </div>
                    {milestone.isCompleted && milestone.completedAt && (
                      <div className="text-xs text-green-600">
                        完了: {milestone.completedAt.toLocaleDateString('ja-JP')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingMilestone(milestone.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {milestone.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <button
                    onClick={() => onUpdateMilestone?.(mainGoal.id, milestone.id, { 
                      isCompleted: true, 
                      completedAt: new Date(),
                      progress: 100
                    })}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-400 transition-colors"
                  />
                )}
              </div>
            </div>
          ))}
          
          {mainGoal.milestones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>まだマイルストーンがありません</p>
              <p className="text-sm">目標達成のためのステップを追加しましょう</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}