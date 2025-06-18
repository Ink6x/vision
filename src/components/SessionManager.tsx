import React, { useState } from 'react';
import { SessionLog } from '../types/gamification';
import { Users, Calendar, Clock, Star, MessageSquare, ChevronDown, ChevronUp, Video, Phone, User } from 'lucide-react';

interface SessionManagerProps {
  sessionLogs: SessionLog[];
  nextSession?: Date;
  coachName: string;
  coachAvatar: string;
  onReflectionUpdate?: (sessionId: string, reflection: string) => void;
}

export default function SessionManager({ 
  sessionLogs, 
  nextSession, 
  coachName, 
  coachAvatar, 
  onReflectionUpdate 
}: SessionManagerProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [editingReflection, setEditingReflection] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');

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

  const getTypeIcon = (type: SessionLog['type']) => {
    switch (type) {
      case 'face-to-face': return User;
      case 'online': return Video;
      case 'phone': return Phone;
      default: return Users;
    }
  };

  const handleReflectionSave = (sessionId: string) => {
    onReflectionUpdate?.(sessionId, reflectionText);
    setEditingReflection(null);
    setReflectionText('');
  };

  const startEditingReflection = (session: SessionLog) => {
    setEditingReflection(session.id);
    setReflectionText(session.studentReflection || '');
  };

  const sortedSessions = sessionLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
  const totalSessions = sessionLogs.length;
  const averageRating = sessionLogs.length > 0 ? 
    sessionLogs.reduce((sum, s) => sum + (s.rating || 0), 0) / sessionLogs.length : 0;
  const totalDuration = sessionLogs.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      {/* セッション統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">総セッション数</p>
              <p className="text-xl font-semibold text-gray-900">{totalSessions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">総時間</p>
              <p className="text-xl font-semibold text-gray-900">{totalDuration}分</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">平均評価</p>
              <p className="text-xl font-semibold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">振り返り記録</p>
              <p className="text-xl font-semibold text-gray-900">
                {sessionLogs.filter(s => s.studentReflection).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 次回セッション */}
      {nextSession && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-4">
            <img
              src={coachAvatar}
              alt={coachName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">次回セッション</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {nextSession.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span>
                    {nextSession.toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - 60分間
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700">
                  <User className="w-4 h-4" />
                  <span>対面セッション</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                <div className="text-sm">あと</div>
                <div className="text-xl font-bold">
                  {Math.ceil((nextSession.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* セッション履歴 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">セッション履歴</h2>
            <p className="text-sm text-gray-600">過去のセッション記録と振り返り</p>
          </div>
        </div>

        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            const TypeIcon = getTypeIcon(session.type);
            
            return (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(session.type).replace('text-', 'bg-').replace('800', '100')}`}>
                      <TypeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        セッション #{session.id.slice(-4)}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
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
                  
                  <div className="flex items-center space-x-3">
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
                    <button
                      onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{isExpanded ? '閉じる' : '詳細'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">セッション概要</h4>
                  <p className="text-gray-600 text-sm">{session.summary}</p>
                </div>

                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
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
                        {!editingReflection && (
                          <button
                            onClick={() => startEditingReflection(session)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            {session.studentReflection ? '編集' : '追加'}
                          </button>
                        )}
                      </div>
                      
                      {editingReflection === session.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={reflectionText}
                            onChange={(e) => setReflectionText(e.target.value)}
                            placeholder="セッションを振り返って、気づいたことや感じたことを記録しましょう..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReflectionSave(session.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingReflection(null)}
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
            );
          })}
          
          {sessionLogs.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">まだセッション履歴がありません</p>
              <p className="text-sm text-gray-500">最初のセッションをお楽しみに！</p>
            </div>
          )}
        </div>
      </div>

      {/* セッション統計グラフ（簡易版） */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">セッション評価の推移</h3>
        <div className="space-y-3">
          {sortedSessions.slice(0, 5).map((session, index) => (
            <div key={session.id} className="flex items-center space-x-3">
              <div className="w-20 text-xs text-gray-600">
                {session.date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${((session.rating || 0) / 5) * 100}%` }}
                />
              </div>
              <div className="w-12 text-xs text-gray-600 text-right">
                {session.rating || 0}/5
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}