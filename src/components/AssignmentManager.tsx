import React, { useState } from 'react';
import { Assignment } from '../types/gamification';
import { FileText, Calendar, Clock, Send, CheckCircle, AlertCircle, Zap, Filter, Eye } from 'lucide-react';

interface AssignmentManagerProps {
  assignments: Assignment[];
  onSubmit?: (assignmentId: string, submission: string) => void;
}

export default function AssignmentManager({ assignments, onSubmit }: AssignmentManagerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'completed'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTypeLabel = (type: Assignment['type']) => {
    switch (type) {
      case 'reflection': return '振り返り';
      case 'action': return '行動課題';
      case 'research': return '調査・研究';
      case 'practice': return '実践課題';
      default: return type;
    }
  };

  const getTypeColor = (type: Assignment['type']) => {
    switch (type) {
      case 'reflection': return 'bg-purple-100 text-purple-800';
      case 'action': return 'bg-green-100 text-green-800';
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'reviewed': return 'text-blue-600';
      case 'submitted': return 'text-yellow-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: Assignment['status']) => {
    switch (status) {
      case 'completed': return '完了';
      case 'reviewed': return 'レビュー済み';
      case 'submitted': return '提出済み';
      case 'pending': return '未提出';
      default: return status;
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'reviewed': return CheckCircle;
      case 'submitted': return Clock;
      case 'pending': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return assignment.status === 'pending';
    if (filter === 'submitted') return assignment.status === 'submitted';
    if (filter === 'completed') return assignment.status === 'completed' || assignment.status === 'reviewed';
    return true;
  });

  const handleSubmit = async (assignmentId: string) => {
    if (!submission.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(assignmentId, submission);
      setSubmission('');
      setSelectedAssignment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = (assignment: Assignment) => {
    return assignment.dueDate < new Date() && assignment.status === 'pending';
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const completedCount = assignments.filter(a => a.status === 'completed' || a.status === 'reviewed').length;
  const overdueCount = assignments.filter(a => isOverdue(a)).length;

  return (
    <div className="space-y-6">
      {/* ヘッダー統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">未提出</p>
              <p className="text-xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">提出済み</p>
              <p className="text-xl font-semibold text-gray-900">{submittedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">完了</p>
              <p className="text-xl font-semibold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">期限超過</p>
              <p className="text-xl font-semibold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">課題管理</h2>
            <p className="text-sm text-gray-600">コーチからの課題と提出状況</p>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="w-4 h-4 text-gray-500" />
          {[
            { key: 'all', label: 'すべて' },
            { key: 'pending', label: '未提出' },
            { key: 'submitted', label: '提出済み' },
            { key: 'completed', label: '完了' }
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

        {/* 課題一覧 */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const StatusIcon = getStatusIcon(assignment.status);
            const overdue = isOverdue(assignment);
            
            return (
              <div
                key={assignment.id}
                className={`border-2 rounded-xl p-6 transition-all ${
                  overdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(assignment.status)}`} />
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(assignment.type)}`}>
                        {getTypeLabel(assignment.type)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusLabel(assignment.status)}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Zap className="w-3 h-3" />
                        <span>{assignment.experienceReward} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>詳細</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">課題内容</h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{assignment.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>出題: {assignment.assignedDate.toLocaleDateString('ja-JP')}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${overdue ? 'text-red-600' : ''}`}>
                      <Clock className="w-4 h-4" />
                      <span>期限: {assignment.dueDate.toLocaleDateString('ja-JP')}</span>
                      {overdue && <span className="text-red-600 font-medium">（期限超過）</span>}
                    </div>
                  </div>

                  {/* 簡易提出フォーム（未提出の場合） */}
                  {assignment.status === 'pending' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="簡単な提出コメント（詳細は詳細画面で）"
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                        >
                          提出
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 提出済み内容の概要 */}
                  {assignment.submission && assignment.status !== 'pending' && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">提出内容</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-2">{assignment.submission}</p>
                        {assignment.submittedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            提出日時: {assignment.submittedAt.toLocaleString('ja-JP')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* コーチフィードバック */}
                  {assignment.coachFeedback && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">コーチからのフィードバック</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 line-clamp-2">{assignment.coachFeedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {filter === 'pending' ? '未提出の課題はありません' :
                 filter === 'submitted' ? '提出済みの課題はありません' :
                 filter === 'completed' ? '完了した課題はありません' :
                 '課題がありません'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedAssignment.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(selectedAssignment.type)}`}>
                      {getTypeLabel(selectedAssignment.type)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedAssignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedAssignment.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      selectedAssignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusLabel(selectedAssignment.status)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">課題内容</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedAssignment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">出題日:</span>
                    <span className="ml-2 text-gray-900">{selectedAssignment.assignedDate.toLocaleDateString('ja-JP')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">期限:</span>
                    <span className={`ml-2 ${isOverdue(selectedAssignment) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {selectedAssignment.dueDate.toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">獲得XP:</span>
                    <span className="ml-2 text-gray-900">{selectedAssignment.experienceReward}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">タイプ:</span>
                    <span className="ml-2 text-gray-900">{getTypeLabel(selectedAssignment.type)}</span>
                  </div>
                </div>

                {/* 提出エリア */}
                {selectedAssignment.status === 'pending' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">課題提出</h3>
                    <div className="space-y-4">
                      <textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="課題の回答や取り組み内容を詳しく記入してください..."
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={6}
                      />
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setSelectedAssignment(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleSubmit(selectedAssignment.id)}
                          disabled={!submission.trim() || isSubmitting}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmitting ? '提出中...' : '提出する'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 提出済み内容 */}
                {selectedAssignment.submission && selectedAssignment.status !== 'pending' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">提出内容</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.submission}</p>
                      {selectedAssignment.submittedAt && (
                        <p className="text-xs text-gray-500 mt-3">
                          提出日時: {selectedAssignment.submittedAt.toLocaleString('ja-JP')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* コーチからのフィードバック */}
                {selectedAssignment.coachFeedback && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">コーチからのフィードバック</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">{selectedAssignment.coachFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}