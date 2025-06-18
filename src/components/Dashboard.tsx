import React from 'react';
import { MainGoal, UserStats, SessionLog, TodoItem, Assignment } from '../types/gamification';
import LevelProgress from './LevelProgress';
import StatsOverview from './StatsOverview';
import MilestoneGraph from './MilestoneGraph';
import TodayTasks from './TodayTasks';
import CoachComments from './CoachComments';

interface DashboardProps {
  studentName: string;
  mainGoal: MainGoal;
  recentMessages: number;
  nextSession?: Date;
  userStats: UserStats;
  sessionLogs: SessionLog[];
  todos: TodoItem[];
  assignments: Assignment[];
}

export default function Dashboard({ 
  studentName, 
  mainGoal,
  recentMessages, 
  nextSession,
  userStats,
  sessionLogs,
  todos,
  assignments
}: DashboardProps) {
  const handleTodoToggle = (todoId: string) => {
    console.log(`Todo ${todoId} toggled`);
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const incompleteTodos = todos.filter(t => !t.isCompleted);
  const daysRemaining = Math.ceil((mainGoal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const coachData = {
    name: '山田 太郎',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  return (
    <div className="space-y-6">
      {/* メインステータスヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">おかえりなさい、{studentName}さん</h1>
            <div className="space-y-1">
              <h2 className="text-xl font-medium text-blue-100">{mainGoal.title}</h2>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="text-3xl font-bold">{Math.round(mainGoal.progress)}%</span>
                <span className="text-sm">
                  {daysRemaining > 0 ? `あと${daysRemaining}日` : 
                   daysRemaining === 0 ? '今日が期限' : 
                   `${Math.abs(daysRemaining)}日超過`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(mainGoal.progress)}%</div>
            <div className="text-sm text-blue-200">目標達成度</div>
          </div>
        </div>
        
        {(pendingAssignments.length > 0 || incompleteTodos.length > 0) && (
          <div className="mt-4 flex items-center space-x-4 text-sm">
            {pendingAssignments.length > 0 && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                未提出課題: {pendingAssignments.length}件
              </span>
            )}
            {incompleteTodos.length > 0 && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                未完了ToDo: {incompleteTodos.length}件
              </span>
            )}
          </div>
        )}
      </div>

      {/* メインコンテンツエリア */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左側: レベル進捗と統計 */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* レベル進捗（横幅半分） */}
          <LevelProgress
            level={userStats.level}
            experience={userStats.experience}
            experienceToNext={userStats.experienceToNext}
          />

          {/* 統計概要（2x2グリッド） */}
          <StatsOverview stats={userStats} />
        </div>

        {/* 右側: 本日のタスクとコーチコメント */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* 本日のタスク */}
          <TodayTasks
            todos={todos}
            onToggleComplete={handleTodoToggle}
          />

          {/* コーチからのコメント */}
          <CoachComments
            sessionLogs={sessionLogs}
            coachName={coachData.name}
            coachAvatar={coachData.avatar}
          />
        </div>
      </div>

      {/* 目標マイルストーングラフ（全幅） */}
      <MilestoneGraph goal={mainGoal} />

      {/* 次回セッション */}
      {nextSession && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">次回セッション</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-800 font-medium">
                  {nextSession.toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })} {nextSession.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  対面セッション（60分） - レベルアップのチャンス！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}