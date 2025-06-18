import React from 'react';
import { TodoItem } from '../types/gamification';
import { CheckCircle2, Circle, Clock, Zap, AlertCircle } from 'lucide-react';

interface TodayTasksProps {
  todos: TodoItem[];
  onToggleComplete?: (todoId: string) => void;
}

export default function TodayTasks({ todos, onToggleComplete }: TodayTasksProps) {
  // 今日のタスクをフィルタリング（期限が今日または優先度が高いもの）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTasks = todos.filter(todo => {
    if (todo.isCompleted) return false;
    
    // 期限が今日のもの
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate.getTime() === today.getTime()) return true;
    }
    
    // 優先度が高いもの
    if (todo.priority === 'high') return true;
    
    // 期限が過ぎているもの
    if (todo.dueDate && todo.dueDate < today) return true;
    
    return false;
  }).slice(0, 5); // 最大5件

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
    }
  };

  const isOverdue = (todo: TodoItem) => {
    if (!todo.dueDate) return false;
    return todo.dueDate < new Date();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">本日のタスク</h3>
        <div className="text-sm text-gray-600">
          {todayTasks.length}件
        </div>
      </div>

      {todayTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">本日のタスクはありません</p>
          <p className="text-sm text-gray-500">お疲れさまでした！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayTasks.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                isOverdue(todo) ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => onToggleComplete?.(todo.id)}
                className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all border-gray-300 hover:border-green-400"
              >
                <Circle className="w-3 h-3 text-transparent" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {todo.title}
                </h4>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center space-x-3 mt-2">
                  <div className={`flex items-center space-x-1 text-xs ${getPriorityColor(todo.priority)}`}>
                    <AlertCircle className="w-3 h-3" />
                    <span>{todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}</span>
                  </div>
                  {todo.estimatedTime && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{todo.estimatedTime}分</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>{todo.experienceReward} XP</span>
                  </div>
                </div>
                {todo.dueDate && (
                  <div className={`text-xs mt-1 ${isOverdue(todo) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    期限: {todo.dueDate.toLocaleDateString('ja-JP')}
                    {isOverdue(todo) && ' (期限超過)'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}