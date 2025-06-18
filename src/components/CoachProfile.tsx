import React from 'react';
import { Calendar, Clock, Users, Award } from 'lucide-react';

interface CoachProfileProps {
  name: string;
  avatar: string;
  specialties: string[];
  experience: string;
  recentActivity: string;
  nextSession?: Date;
}

export default function CoachProfile({ 
  name, 
  avatar, 
  specialties, 
  experience, 
  recentActivity,
  nextSession 
}: CoachProfileProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* プロフィール基本情報 */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">あなた専属のライフコーチ</p>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-600">現在オンライン</span>
          </div>
        </div>
      </div>

      {/* 専門分野 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Award className="w-4 h-4 mr-1" />
          専門分野
        </h4>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* 指導歴 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          指導歴
        </h4>
        <p className="text-gray-600 text-sm">{experience}</p>
      </div>

      {/* 最近の活動 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          最近の活動
        </h4>
        <p className="text-gray-600 text-sm">{recentActivity}</p>
      </div>

      {/* 次回セッション */}
      {nextSession && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            次回セッション
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              {nextSession.toLocaleDateString('ja-JP', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })} {nextSession.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              対面セッション（60分）
            </p>
          </div>
        </div>
      )}

      {/* コーチからの一言 */}
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 italic">
          "今週も一歩ずつ、着実に前進していきましょう。あなたの成長を心から応援しています！"
        </p>
        <p className="text-xs text-gray-500 mt-2">- {name}</p>
      </div>
    </div>
  );
}