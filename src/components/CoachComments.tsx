import React from 'react';
import { SessionLog } from '../types/gamification';
import { MessageSquare, Calendar, Star } from 'lucide-react';

interface CoachCommentsProps {
  sessionLogs: SessionLog[];
  coachName: string;
  coachAvatar: string;
}

export default function CoachComments({ sessionLogs, coachName, coachAvatar }: CoachCommentsProps) {
  // 最新のセッションログを取得
  const latestSession = sessionLogs.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  
  // 最新のコーチコメントを取得
  const latestComment = latestSession?.coachComments;
  const nextSteps = latestSession?.nextSteps || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={coachAvatar}
          alt={coachName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">コーチからのメッセージ</h3>
          <p className="text-sm text-gray-600">{coachName}</p>
        </div>
      </div>

      {latestSession ? (
        <div className="space-y-4">
          {/* 最新のコメント */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">最新のフィードバック</span>
              <div className="flex items-center space-x-1 ml-auto">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600">
                  {latestSession.date.toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              "{latestComment}"
            </p>
            {latestSession.rating && (
              <div className="flex items-center space-x-1 mt-3">
                <span className="text-xs text-blue-600">セッション評価:</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < latestSession.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 次のステップ */}
          {nextSteps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">次のステップ</h4>
              <div className="space-y-2">
                {nextSteps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 励ましのメッセージ */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💪</span>
              </div>
              <span className="text-sm font-medium text-purple-800">今週の応援メッセージ</span>
            </div>
            <p className="text-sm text-purple-700 italic">
              "継続は力なり。小さな一歩の積み重ねが、必ず大きな成果につながります。今週も一緒に頑張りましょう！"
            </p>
            <p className="text-xs text-purple-600 mt-2 text-right">- {coachName}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">まだセッションが行われていません</p>
          <p className="text-sm text-gray-500">最初のセッションをお楽しみに！</p>
        </div>
      )}
    </div>
  );
}