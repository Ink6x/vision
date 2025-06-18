import React, { useState } from 'react';
import { JournalEntry } from '../types/gamification';
import { BookOpen, Plus, Calendar, Star, MessageSquare, TrendingUp, Smile, Meh, Frown } from 'lucide-react';

interface DailyJournalProps {
  entries: JournalEntry[];
  onAddEntry?: (entry: Omit<JournalEntry, 'id'>) => void;
  onEditEntry?: (entryId: string, entry: Partial<JournalEntry>) => void;
  coachName: string;
}

export default function DailyJournal({ entries, onAddEntry, onEditEntry, coachName }: DailyJournalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'good' as JournalEntry['mood'],
    achievements: [''],
    challenges: [''],
    rating: 3
  });

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'excellent': return { icon: '😊', color: 'text-green-600', bg: 'bg-green-100' };
      case 'good': return { icon: '🙂', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'neutral': return { icon: '😐', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'challenging': return { icon: '😔', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'difficult': return { icon: '😞', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const getMoodLabel = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'excellent': return '最高';
      case 'good': return '良い';
      case 'neutral': return '普通';
      case 'challenging': return '困難';
      case 'difficult': return '辛い';
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    onAddEntry?.({
      ...newEntry,
      date: new Date(),
      achievements: newEntry.achievements.filter(a => a.trim()),
      challenges: newEntry.challenges.filter(c => c.trim())
    });
    
    setNewEntry({
      title: '',
      content: '',
      mood: 'good',
      achievements: [''],
      challenges: [''],
      rating: 3
    });
    setShowAddForm(false);
  };

  const addAchievement = () => {
    setNewEntry({
      ...newEntry,
      achievements: [...newEntry.achievements, '']
    });
  };

  const addChallenge = () => {
    setNewEntry({
      ...newEntry,
      challenges: [...newEntry.challenges, '']
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const achievements = [...newEntry.achievements];
    achievements[index] = value;
    setNewEntry({ ...newEntry, achievements });
  };

  const updateChallenge = (index: number, value: string) => {
    const challenges = [...newEntry.challenges];
    challenges[index] = value;
    setNewEntry({ ...newEntry, challenges });
  };

  const removeAchievement = (index: number) => {
    setNewEntry({
      ...newEntry,
      achievements: newEntry.achievements.filter((_, i) => i !== index)
    });
  };

  const removeChallenge = (index: number) => {
    setNewEntry({
      ...newEntry,
      challenges: newEntry.challenges.filter((_, i) => i !== index)
    });
  };

  const sortedEntries = entries.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      {/* ヘッダー統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">総記録数</p>
              <p className="text-xl font-semibold text-gray-900">{entries.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">今月の記録</p>
              <p className="text-xl font-semibold text-gray-900">
                {entries.filter(e => e.date.getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">平均評価</p>
              <p className="text-xl font-semibold text-gray-900">
                {entries.length > 0 ? 
                  (entries.reduce((sum, e) => sum + (e.rating || 0), 0) / entries.length).toFixed(1) : 
                  '0.0'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">コーチコメント</p>
              <p className="text-xl font-semibold text-gray-900">
                {entries.filter(e => e.coachComment).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">日々の記録</h2>
            <p className="text-sm text-gray-600">学習の振り返りと成長の記録</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新規記録</span>
          </button>
        </div>

        {/* 新規記録フォーム */}
        {showAddForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">今日の振り返りを記録</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="今日のタイトル（例：英語学習の進捗）"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                placeholder="今日の学習内容や感じたことを詳しく記録してください..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />

              {/* 気分選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">今日の気分</label>
                <div className="flex space-x-3">
                  {(['excellent', 'good', 'neutral', 'challenging', 'difficult'] as const).map((mood) => {
                    const moodData = getMoodIcon(mood);
                    return (
                      <button
                        key={mood}
                        onClick={() => setNewEntry({ ...newEntry, mood })}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                          newEntry.mood === mood
                            ? `${moodData.bg} border-current ${moodData.color}`
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl mb-1">{moodData.icon}</span>
                        <span className="text-xs">{getMoodLabel(mood)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 達成したこと */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">今日達成したこと</label>
                <div className="space-y-2">
                  {newEntry.achievements.map((achievement, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        placeholder="達成したことを記入..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {newEntry.achievements.length > 1 && (
                        <button
                          onClick={() => removeAchievement(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAchievement}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 達成項目を追加
                  </button>
                </div>
              </div>

              {/* 課題・困ったこと */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">課題・困ったこと</label>
                <div className="space-y-2">
                  {newEntry.challenges.map((challenge, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={challenge}
                        onChange={(e) => updateChallenge(index, e.target.value)}
                        placeholder="課題や困ったことを記入..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {newEntry.challenges.length > 1 && (
                        <button
                          onClick={() => removeChallenge(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addChallenge}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 課題項目を追加
                  </button>
                </div>
              </div>

              {/* 自己評価 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  今日の学習を5段階で評価 ({newEntry.rating}/5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewEntry({ ...newEntry, rating })}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        rating <= newEntry.rating
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      <Star className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddEntry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  記録を保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 記録一覧 */}
        <div className="space-y-4">
          {sortedEntries.map((entry) => {
            const moodData = getMoodIcon(entry.mood);
            return (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${moodData.bg} flex items-center justify-center`}>
                      <span className="text-lg">{moodData.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{entry.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{entry.date.toLocaleDateString('ja-JP', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'short'
                        })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {entry.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < entry.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${moodData.bg} ${moodData.color}`}>
                      {getMoodLabel(entry.mood)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{entry.content}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {entry.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-700 mb-1">達成したこと</h4>
                      <ul className="space-y-1">
                        {entry.achievements.slice(0, 2).map((achievement, index) => (
                          <li key={index} className="text-green-600 text-xs">• {achievement}</li>
                        ))}
                        {entry.achievements.length > 2 && (
                          <li className="text-green-500 text-xs">他 {entry.achievements.length - 2} 件</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {entry.challenges.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-700 mb-1">課題・困ったこと</h4>
                      <ul className="space-y-1">
                        {entry.challenges.slice(0, 2).map((challenge, index) => (
                          <li key={index} className="text-orange-600 text-xs">• {challenge}</li>
                        ))}
                        {entry.challenges.length > 2 && (
                          <li className="text-orange-500 text-xs">他 {entry.challenges.length - 2} 件</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {entry.coachComment && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">{coachName}からのコメント</span>
                    </div>
                    <p className="text-sm text-blue-700">"{entry.coachComment}"</p>
                  </div>
                )}
              </div>
            );
          })}
          
          {entries.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">まだ記録がありません</p>
              <p className="text-sm text-gray-500">最初の振り返りを記録してみましょう</p>
            </div>
          )}
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${getMoodIcon(selectedEntry.mood).bg} flex items-center justify-center`}>
                    <span className="text-xl">{getMoodIcon(selectedEntry.mood).icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedEntry.title}</h2>
                    <p className="text-gray-600">
                      {selectedEntry.date.toLocaleDateString('ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">記録内容</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEntry.content}</p>
                </div>

                {selectedEntry.achievements.length > 0 && (
                  <div>
                    <h3 className="font-medium text-green-700 mb-2">達成したこと</h3>
                    <ul className="space-y-1">
                      {selectedEntry.achievements.map((achievement, index) => (
                        <li key={index} className="text-green-600">• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntry.challenges.length > 0 && (
                  <div>
                    <h3 className="font-medium text-orange-700 mb-2">課題・困ったこと</h3>
                    <ul className="space-y-1">
                      {selectedEntry.challenges.map((challenge, index) => (
                        <li key={index} className="text-orange-600">• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntry.rating && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">自己評価</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < selectedEntry.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">({selectedEntry.rating}/5)</span>
                    </div>
                  </div>
                )}

                {selectedEntry.coachComment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {coachName}からのコメント
                    </h3>
                    <p className="text-blue-700">"{selectedEntry.coachComment}"</p>
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