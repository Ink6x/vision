import React, { useState } from 'react';
import { TodoItem } from '../types/gamification';
import { CheckCircle2, Circle, Calendar, Clock, Zap, Plus, Filter } from 'lucide-react';

interface TodoListProps {
  todos: TodoItem[];
  onToggleComplete?: (todoId: string) => void;
  onAddTodo?: (todo: Omit<TodoItem, 'id'>) => void;
}

export default function TodoList({ todos, onToggleComplete, onAddTodo }: TodoListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as TodoItem['priority'],
    category: '',
    estimatedTime: 30
  });

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLabel = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true;
  });

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;
    
    onAddTodo?.({
      ...newTodo,
      isCompleted: false,
      experienceReward: newTodo.priority === 'high' ? 50 : newTodo.priority === 'medium' ? 30 : 20
    });
    
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      estimatedTime: 30
    });
    setShowAddForm(false);
  };

  const completedCount = todos.filter(t => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ToDoリスト</h2>
          <p className="text-sm text-gray-600">
            {completedCount} / {totalCount} 完了
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>追加</span>
        </button>
      </div>

      {/* フィルター */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        {[
          { key: 'all', label: 'すべて' },
          { key: 'pending', label: '未完了' },
          { key: 'completed', label: '完了済み' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === key
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 新規追加フォーム */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              placeholder="タスクのタイトル"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="詳細（任意）"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex space-x-3">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as TodoItem['priority'] })}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">優先度: 低</option>
                <option value="medium">優先度: 中</option>
                <option value="high">優先度: 高</option>
              </select>
              <input
                type="text"
                value={newTodo.category}
                onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                placeholder="カテゴリ"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddTodo}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ToDoリスト */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${
              todo.isCompleted
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <button
              onClick={() => onToggleComplete?.(todo.id)}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.isCompleted
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {todo.isCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-white" />
              ) : (
                <Circle className="w-3 h-3 text-transparent" />
              )}
            </button>
            
            <div className="flex-1">
              <h4 className={`font-medium ${todo.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                {todo.title}
              </h4>
              {todo.description && (
                <p className={`text-sm mt-1 ${todo.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              <div className="flex items-center space-x-3 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(todo.priority)}`}>
                  {getPriorityLabel(todo.priority)}
                </span>
                {todo.category && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {todo.category}
                  </span>
                )}
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
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>期限: {todo.dueDate.toLocaleDateString('ja-JP')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              {filter === 'completed' ? '完了したタスクはありません' :
               filter === 'pending' ? '未完了のタスクはありません' :
               'タスクがありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}