import React, { useState } from 'react';
import { SessionLog } from '../types/gamification';
import { Calendar, Clock, MessageSquare, Star, ChevronDown, ChevronUp, User } from 'lucide-react';

interface SessionLogCardProps {
  session: SessionLog;
  onReflectionUpdate?: (sessionId: string, reflection: string) => void;
}

export default function SessionLogCard({ session, onReflectionUpdate }: SessionLogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflection, setReflection] = useState(session.studentReflection || '');
  const [isEditingReflection, setIsEditingReflection] = useState(false);

  const getTypeLabel = (type: SessionLog['type']) => {
    switch (type) {
      case 'face-to-face': return '対面';
      case 'online': return 'オンライン';
      case 'phone': return '電話';
      default: return type;
    }
  };

  const getTypeColor = (type: SessionLog['type']) => {
    switch (type) {
      case 'face-to-face': return 'bg-green-100 text-green-800';
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReflectionSave = () => {
    onReflectionUpdate?.(session.id, reflection);
    setIsEditingReflection(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              セッション #{session.id.slice(-4)}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(session.type)}`}>
                {getTypeLabel(session.type)}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{session.date.toLocaleDateString('ja-JP')}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{session.duration}分</span>
              </div>
            </div>
          </div>
        </div>
        
        {session.rating && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < session.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">セッション概要</h4>
          <p className="text-gray-600 text-sm">{session.summary}</p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{isExpanded ? '詳細を閉じる' : '詳細を見る'}</span>
        </button>

        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">コーチからのコメント</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">{session.coachComments}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">次のステップ</h4>
              <ul className="space-y-1">
                {session.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">あなたの振り返り</h4>
                {!isEditingReflection && (
                  <button
                    onClick={() => setIsEditingReflection(true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {session.studentReflection ? '編集' : '追加'}
                  </button>
                )}
              </div>
              
              {isEditingReflection ? (
                <div className="space-y-2">
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="セッションを振り返って、気づいたことや感じたことを記録しましょう..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleReflectionSave}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingReflection(false);
                        setReflection(session.studentReflection || '');
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    {session.studentReflection || 'まだ振り返りが記録されていません'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}