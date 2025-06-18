import React, { useState } from 'react';
import { Assignment } from '../types/gamification';
import { Calendar, Clock, FileText, Send, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: (assignmentId: string, submission: string) => void;
}

export default function AssignmentCard({ assignment, onSubmit }: AssignmentCardProps) {
  const [submission, setSubmission] = useState(assignment.submission || '');
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

  const handleSubmit = async () => {
    if (!submission.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(assignment.id, submission);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = assignment.dueDate < new Date() && assignment.status === 'pending';
  const StatusIcon = getStatusIcon(assignment.status);

  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
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
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">課題内容</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{assignment.description}</p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>出題: {assignment.assignedDate.toLocaleDateString('ja-JP')}</span>
          </div>
          <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
            <Clock className="w-4 h-4" />
            <span>期限: {assignment.dueDate.toLocaleDateString('ja-JP')}</span>
            {isOverdue && <span className="text-red-600 font-medium">（期限超過）</span>}
          </div>
        </div>

        {/* 提出エリア */}
        {assignment.status === 'pending' && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">課題提出</h4>
            <div className="space-y-3">
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="課題の回答や取り組み内容を記入してください..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
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
        {assignment.submission && assignment.status !== 'pending' && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">提出内容</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.submission}</p>
              {assignment.submittedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  提出日時: {assignment.submittedAt.toLocaleString('ja-JP')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* コーチからのフィードバック */}
        {assignment.coachFeedback && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">コーチからのフィードバック</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">{assignment.coachFeedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}