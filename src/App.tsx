import React, { useState } from 'react';
import { MessageCircle, Home, User, Settings, Calendar as CalendarIcon, CheckSquare, BookOpen, FileText, Target, Users } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import CoachProfile from './components/CoachProfile';
import Calendar from './components/Calendar';
import TodoManager from './components/TodoManager';
import DailyJournal from './components/DailyJournal';
import AssignmentManager from './components/AssignmentManager';
import GoalManager from './components/GoalManager';
import SessionManager from './components/SessionManager';
import { MainGoal, UserStats, Achievement, SessionLog, TodoItem, Assignment, JournalEntry } from './types/gamification';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile' | 'settings' | 'calendar' | 'todos' | 'journal' | 'assignments' | 'goals' | 'sessions'>('dashboard');

  // サンプルデータ（1つのメイン目標に集中）
  const studentData = {
    name: '田中 花子',
    mainGoal: {
      id: '1',
      title: '英語でのプレゼンテーション能力向上',
      description: '国際会議で自信を持って英語でプレゼンテーションができるようになる。専門分野の内容を分かりやすく伝え、質疑応答にも適切に対応できるレベルを目指す。',
      progress: 65,
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-06-30'),
      category: 'スキルアップ',
      difficulty: 'hard' as const,
      experienceReward: 1000,
      isCompleted: false,
      coachNotes: '発音とボディランゲージが大幅に改善されています。次は論理的な構成力を重点的に鍛えていきましょう。',
      milestones: [
        {
          id: '1-1',
          title: '基本的な英語表現を習得',
          description: 'プレゼンテーションで使用する基本表現100個をマスター',
          progress: 100,
          isCompleted: true,
          experienceReward: 200,
          completedAt: new Date('2024-02-15'),
          targetDate: new Date('2024-02-15')
        },
        {
          id: '1-2',
          title: '5分間のプレゼンテーション作成',
          description: '自分の専門分野について5分間の英語プレゼンテーションを作成',
          progress: 80,
          isCompleted: false,
          experienceReward: 300,
          targetDate: new Date('2024-04-15')
        },
        {
          id: '1-3',
          title: '実際のプレゼンテーション実施',
          description: '社内の国際会議で実際に英語プレゼンテーションを実施',
          progress: 0,
          isCompleted: false,
          experienceReward: 500,
          targetDate: new Date('2024-06-30')
        }
      ]
    } as MainGoal,
    recentMessages: 12,
    nextSession: new Date('2024-02-10T14:00:00')
  };

  const userStats: UserStats = {
    level: 12,
    experience: 2450,
    experienceToNext: 550,
    totalGoalsCompleted: 8,
    currentStreak: 15,
    longestStreak: 23,
    totalSessionsCompleted: 24,
    achievements: [
      {
        id: 'first_goal',
        title: '初めの一歩',
        description: '最初の目標を設定しました',
        icon: 'target',
        rarity: 'common',
        unlockedAt: new Date('2024-01-01')
      },
      {
        id: 'streak_7',
        title: '継続は力なり',
        description: '7日連続で活動しました',
        icon: 'flame',
        rarity: 'rare',
        unlockedAt: new Date('2024-01-15')
      },
      {
        id: 'level_10',
        title: 'レベル10到達',
        description: 'レベル10に到達しました',
        icon: 'star',
        rarity: 'epic',
        unlockedAt: new Date('2024-02-01')
      },
      {
        id: 'goal_master',
        title: '目標マスター',
        description: '5つの目標を完了しました',
        icon: 'crown',
        rarity: 'legendary',
        unlockedAt: new Date('2024-02-05')
      },
      {
        id: 'future_achievement',
        title: 'セッション王',
        description: '50回のセッションを完了する',
        icon: 'trophy',
        rarity: 'legendary',
        progress: 24,
        maxProgress: 50
      }
    ] as Achievement[]
  };

  const sessionLogs: SessionLog[] = [
    {
      id: 'session-001',
      date: new Date('2024-02-05'),
      duration: 60,
      type: 'face-to-face',
      summary: '英語プレゼンテーションの構成について詳しく学習。PREP法を使った論理的な組み立て方を練習しました。',
      coachComments: '論理的思考力が向上しています。次回は実際の発表練習を行いましょう。緊張せずに自信を持って話すことを意識してください。',
      nextSteps: [
        '5分間のプレゼンテーション原稿を完成させる',
        '毎日10分間の音読練習を継続する',
        '専門用語の英語表現リストを作成する'
      ],
      rating: 5
    },
    {
      id: 'session-002',
      date: new Date('2024-01-29'),
      duration: 60,
      type: 'online',
      summary: '発音矯正とイントネーションの練習。特にRとLの音の区別、THの発音を重点的に練習しました。',
      coachComments: '発音が格段に改善されました。特にRの音が自然になってきています。この調子で継続していきましょう。',
      nextSteps: [
        'シャドーイング練習を毎日20分実施',
        'TED Talksを週3本視聴し、表現をメモする',
        '録音して自分の発音をチェックする'
      ],
      rating: 4,
      studentReflection: '発音練習は思っていたより難しかったですが、コーチの指導で少しずつ改善されているのを実感できました。'
    }
  ];

  const todos: TodoItem[] = [
    {
      id: 'todo-001',
      title: 'プレゼンテーション原稿の作成',
      description: '5分間の英語プレゼンテーション原稿を完成させる',
      dueDate: new Date('2024-02-15'),
      priority: 'high',
      isCompleted: false,
      experienceReward: 100,
      category: 'プレゼン準備',
      estimatedTime: 120
    },
    {
      id: 'todo-002',
      title: '専門用語リストの作成',
      description: '自分の専門分野で使用する英語表現50個をリストアップ',
      dueDate: new Date('2024-02-12'),
      priority: 'medium',
      isCompleted: true,
      completedAt: new Date('2024-02-10'),
      experienceReward: 50,
      category: '語彙強化',
      estimatedTime: 60
    },
    {
      id: 'todo-003',
      title: '毎日の音読練習',
      description: '英語のニュース記事を毎日10分間音読する',
      priority: 'medium',
      isCompleted: false,
      experienceReward: 30,
      category: '発音練習',
      estimatedTime: 10
    },
    {
      id: 'todo-004',
      title: 'TED Talk視聴',
      description: '今週のTED Talk 3本を視聴し、表現をメモする',
      dueDate: new Date(),
      priority: 'high',
      isCompleted: false,
      experienceReward: 40,
      category: 'リスニング',
      estimatedTime: 90
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 'assignment-001',
      title: '自己紹介プレゼンテーション',
      description: '3分間で自分の経歴と専門分野について英語で紹介するプレゼンテーションを作成し、録画して提出してください。PREP法を使用し、聞き手にとって分かりやすい構成を心がけてください。',
      assignedDate: new Date('2024-02-01'),
      dueDate: new Date('2024-02-14'),
      type: 'practice',
      isSubmitted: false,
      experienceReward: 150,
      status: 'pending'
    },
    {
      id: 'assignment-002',
      title: '発音練習の振り返り',
      description: '今週の発音練習を振り返り、改善された点と今後の課題について300字程度でまとめてください。',
      assignedDate: new Date('2024-01-28'),
      dueDate: new Date('2024-02-04'),
      type: 'reflection',
      isSubmitted: true,
      submittedAt: new Date('2024-02-03'),
      submission: '今週はRとLの音の区別を重点的に練習しました。最初は違いが分からなかったのですが、コーチの指導により舌の位置を意識することで改善されました。特に「right」と「light」の発音が自然にできるようになったと思います。今後はTHの音とVの音の練習に取り組みたいです。',
      coachFeedback: '素晴らしい振り返りです。自分の成長を客観視できており、次の課題も明確になっています。THとVの音の練習、頑張りましょう！',
      experienceReward: 100,
      status: 'completed'
    }
  ];

  const journalEntries: JournalEntry[] = [
    {
      id: 'journal-001',
      date: new Date('2024-02-08'),
      title: '今日の学習記録',
      content: '今日は発音練習に集中しました。特にTHの音が難しく、何度も練習しました。コーチからのアドバイス通り、舌の位置を意識することで少しずつ改善されているのを感じます。明日も継続して練習したいと思います。',
      mood: 'good',
      achievements: ['発音練習30分完了', 'TED Talk 1本視聴'],
      challenges: ['THの発音が難しい', '時間管理に苦労'],
      coachComment: '継続的な練習が成果に繋がっています。THの音は難しいですが、確実に上達していますよ！',
      rating: 4
    },
    {
      id: 'journal-002',
      date: new Date('2024-02-07'),
      title: 'プレゼン準備進捗',
      content: 'プレゼンテーションの構成を考えました。PREP法を使って論理的な流れを作ることができました。まだ細かい表現で迷う部分がありますが、全体的な方向性は見えてきました。',
      mood: 'excellent',
      achievements: ['プレゼン構成完成', '専門用語リスト20個追加'],
      challenges: ['細かい表現の選択', '時間配分'],
      rating: 5
    }
  ];

  const coachData = {
    name: '山田 太郎',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['英語コーチング', 'プレゼンテーション', 'ビジネス英語', 'モチベーション管理'],
    experience: '英語教育歴10年。外資系企業での勤務経験を活かし、実践的なビジネス英語指導を得意とする。',
    recentActivity: '先週は8名のクライアントとセッションを実施。英語プレゼンテーション特化コースを新たに開始。',
    status: 'online' as const
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            studentName={studentData.name}
            mainGoal={studentData.mainGoal}
            recentMessages={studentData.recentMessages}
            nextSession={studentData.nextSession}
            userStats={userStats}
            sessionLogs={sessionLogs}
            todos={todos}
            assignments={assignments}
          />
        );
      case 'chat':
        return (
          <div className="h-screen">
            <ChatInterface
              coachName={coachData.name}
              coachAvatar={coachData.avatar}
              coachStatus={coachData.status}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-md mx-auto">
            <CoachProfile
              name={coachData.name}
              avatar={coachData.avatar}
              specialties={coachData.specialties}
              experience={coachData.experience}
              recentActivity={coachData.recentActivity}
              nextSession={studentData.nextSession}
            />
          </div>
        );
      case 'calendar':
        return (
          <Calendar
            mainGoal={studentData.mainGoal}
            sessionLogs={sessionLogs}
            todos={todos}
            assignments={assignments}
            nextSession={studentData.nextSession}
          />
        );
      case 'todos':
        return (
          <TodoManager
            todos={todos}
            onToggleComplete={(id) => console.log('Toggle todo:', id)}
            onAddTodo={(todo) => console.log('Add todo:', todo)}
            onEditTodo={(id, todo) => console.log('Edit todo:', id, todo)}
            onDeleteTodo={(id) => console.log('Delete todo:', id)}
          />
        );
      case 'journal':
        return (
          <DailyJournal
            entries={journalEntries}
            onAddEntry={(entry) => console.log('Add journal entry:', entry)}
            onEditEntry={(id, entry) => console.log('Edit journal entry:', id, entry)}
            coachName={coachData.name}
          />
        );
      case 'assignments':
        return (
          <AssignmentManager
            assignments={assignments}
            onSubmit={(id, submission) => console.log('Submit assignment:', id, submission)}
          />
        );
      case 'goals':
        return (
          <GoalManager
            mainGoal={studentData.mainGoal}
            onUpdateGoal={(goal) => console.log('Update goal:', goal)}
            onUpdateMilestone={(goalId, milestoneId, milestone) => console.log('Update milestone:', goalId, milestoneId, milestone)}
          />
        );
      case 'sessions':
        return (
          <SessionManager
            sessionLogs={sessionLogs}
            nextSession={studentData.nextSession}
            coachName={coachData.name}
            coachAvatar={coachData.avatar}
            onReflectionUpdate={(sessionId, reflection) => console.log('Update reflection:', sessionId, reflection)}
          />
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">設定</h2>
            <p className="text-gray-600">設定画面は開発中です。</p>
          </div>
        );
      default:
        return null;
    }
  };

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'ダッシュボード' },
    { id: 'calendar', icon: CalendarIcon, label: 'カレンダー' },
    { id: 'todos', icon: CheckSquare, label: 'ToDo管理' },
    { id: 'journal', icon: BookOpen, label: '日々の記録' },
    { id: 'assignments', icon: FileText, label: '課題' },
    { id: 'goals', icon: Target, label: '目標管理' },
    { id: 'sessions', icon: Users, label: 'セッション' },
    { id: 'chat', icon: MessageCircle, label: 'コーチチャット' },
    { id: 'profile', icon: User, label: 'コーチ情報' },
    { id: 'settings', icon: Settings, label: '設定' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル対応ナビゲーション */}
      <div className="lg:hidden">
        {activeTab === 'chat' ? (
          renderContent()
        ) : (
          <div className="p-4 pb-20">
            {renderContent()}
          </div>
        )}
        
        {/* ボトムナビゲーション（主要機能のみ） */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 5).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* デスクトップ対応レイアウト */}
      <div className="hidden lg:flex">
        {/* サイドバー */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-8">自分ビジョン</h1>
            <nav className="space-y-1">
              {navigationItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {activeTab === 'chat' ? (
            renderContent()
          ) : (
            <div className="p-8">
              {renderContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;