import React, { useState } from 'react';
import { TodoItem } from '../types/gamification';
import { CheckCircle2, Circle, Calendar, Clock, Zap, Plus, Filter, Edit3, Trash2, RotateCcw } from 'lucide-react';

interface TodoManagerProps {
  todos: TodoItem[];
  onToggleComplete?: (todoId: string) => void;
  onAddTodo?: (todo: Omit<TodoItem, 'id'>) => void;
  onEditTodo?: (todoId: string, todo: Partial<TodoItem>) => void;
  onDeleteTodo?: (todoId: string) => void;
}

export default function TodoManager({ todos, onToggleComplete, onAddTodo, onEditTodo, onDeleteTodo }: TodoManagerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'daily'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as TodoItem['priority'],
    category: '',
    estimatedTime: 30,
    dueDate: '',
    isDaily: false,
    recurringDays: [] as number[]
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
    if (filter === 'daily') return todo.isDaily;
    return true;
  });

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;
    
    onAddTodo?.({
      ...newTodo,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined,
      isCompleted: false,
      experienceReward: newTodo.priority === 'high' ? 50 : newTodo.priority === 'medium' ? 30 : 20
    });
    
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      estimatedTime: 30,
      dueDate: '',
      isDaily: false,
      recurringDays: []
    });
    setShowAddForm(false);
  };

  const handleEditTodo = (todoId: string, updates: Partial<TodoItem>) => {
    onEditTodo?.(todoId, updates);
    setEditingTodo(null);
  };

  const completedCount = todos.filter(t => t.isCompleted).length;
  const totalCount = todos.length;
  const dailyTodos = todos.filter(t => t.isDaily);

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-6">
      {/* ヘッダー統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">完了済み</p>
              <p className="text-xl font-semibold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Circle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">未完了</p>
              <p className="text-xl font-semibold text-gray-900">{totalCount - completedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">デイリータスク</p>
              <p className="text-xl font-semibold text-gray-900">{dailyTodos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">獲得可能XP</p>
              <p className="text-xl font-semibold text-gray-900">
                {todos.filter(t => !t.isCompleted).reduce((sum, t) => sum + t.experienceReward, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">ToDo管理</h2>
            <p className="text-sm text-gray-600">
              {completedCount} / {totalCount} 完了
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新規追加</span>
          </button>
        </div>

        {/* フィルター */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="w-4 h-4 text-gray-500" />
          {[
            { key: 'all', label: 'すべて' },
            { key: 'pending', label: '未完了' },
            { key: 'completed', label: '完了済み' },
            { key: 'daily', label: 'デイリー' }
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">新しいタスクを追加</h3>
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
              <div className="grid grid-cols-2 gap-3">
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
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={newTodo.estimatedTime}
                  onChange={(e) => setNewTodo({ ...newTodo, estimatedTime: parseInt(e.target.value) })}
                  placeholder="予想時間（分）"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTodo.isDaily}
                    onChange={(e) => setNewTodo({ ...newTodo, isDaily: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">デイリータスク</span>
                </label>
              </div>
              {newTodo.isDaily && (
                <div>
                  <p className="text-sm text-gray-700 mb-2">繰り返し曜日:</p>
                  <div className="flex space-x-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const days = newTodo.recurringDays.includes(index)
                            ? newTodo.recurringDays.filter(d => d !== index)
                            : [...newTodo.recurringDays, index];
                          setNewTodo({ ...newTodo, recurringDays: days });
                        }}
                        className={`w-8 h-8 text-xs rounded-full border transition-colors ${
                          newTodo.recurringDays.includes(index)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${todo.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                      {todo.title}
                      {todo.isDaily && <RotateCcw className="w-4 h-4 inline ml-2 text-purple-600" />}
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
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <button
                      onClick={() => setEditingTodo(todo.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTodo?.(todo.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>
                {filter === 'completed' ? '完了したタスクはありません' :
                 filter === 'pending' ? '未完了のタスクはありません' :
                 filter === 'daily' ? 'デイリータスクはありません' :
                 'タスクがありません'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}