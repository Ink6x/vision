import React, { useState } from 'react';
import { MainGoal, SessionLog, TodoItem, Assignment, CalendarEvent } from '../types/gamification';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Target, FileText, CheckSquare, Users } from 'lucide-react';

interface CalendarProps {
  mainGoal: MainGoal;
  sessionLogs: SessionLog[];
  todos: TodoItem[];
  assignments: Assignment[];
  nextSession?: Date;
}

export default function Calendar({ mainGoal, sessionLogs, todos, assignments, nextSession }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // カレンダーイベントの生成
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // セッション
    sessionLogs.forEach(session => {
      events.push({
        id: `session-${session.id}`,
        title: 'コーチングセッション',
        date: session.date,
        type: 'session',
        description: session.summary,
        status: 'completed'
      });
    });

    // 次回セッション
    if (nextSession) {
      events.push({
        id: 'next-session',
        title: '次回セッション',
        date: nextSession,
        type: 'session',
        status: 'pending'
      });
    }

    // 課題
    assignments.forEach(assignment => {
      events.push({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        date: assignment.dueDate,
        type: 'assignment',
        description: assignment.description,
        status: assignment.status === 'completed' ? 'completed' : 
               assignment.dueDate < new Date() ? 'overdue' : 'pending'
      });
    });

    // ToDo（期限があるもの）
    todos.filter(todo => todo.dueDate).forEach(todo => {
      events.push({
        id: `todo-${todo.id}`,
        title: todo.title,
        date: todo.dueDate!,
        type: 'todo',
        description: todo.description,
        status: todo.isCompleted ? 'completed' : 
               todo.dueDate! < new Date() ? 'overdue' : 'pending'
      });
    });

    // マイルストーン
    mainGoal.milestones.filter(m => m.targetDate).forEach(milestone => {
      events.push({
        id: `milestone-${milestone.id}`,
        title: milestone.title,
        date: milestone.targetDate!,
        type: 'milestone',
        description: milestone.description,
        status: milestone.isCompleted ? 'completed' : 
               milestone.targetDate! < new Date() ? 'overdue' : 'pending'
      });
    });

    // 最終目標
    events.push({
      id: 'main-goal',
      title: mainGoal.title,
      date: mainGoal.targetDate,
      type: 'goal',
      description: mainGoal.description,
      status: mainGoal.isCompleted ? 'completed' : 
             mainGoal.targetDate < new Date() ? 'overdue' : 'pending'
    });

    return events;
  };

  const events = generateEvents();

  // カレンダーの日付生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'session': return Users;
      case 'assignment': return FileText;
      case 'todo': return CheckSquare;
      case 'milestone': return Target;
      case 'goal': return Target;
      default: return CalendarIcon;
    }
  };

  const getEventColor = (type: CalendarEvent['type'], status?: CalendarEvent['status']) => {
    if (status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'overdue') return 'bg-red-100 text-red-800 border-red-200';
    
    switch (type) {
      case 'session': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'todo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'milestone': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'goal': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* カレンダーヘッダー */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">カレンダー</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium text-gray-900 min-w-[120px] text-center">
              {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-1">
          {/* 曜日ヘッダー */}
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div key={day} className={`p-3 text-center text-sm font-medium ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {day}
            </div>
          ))}

          {/* カレンダー日付 */}
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`p-2 min-h-[80px] border border-gray-100 hover:bg-gray-50 transition-colors relative ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                } ${!isCurrentMonth(date) ? 'opacity-40' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday(date) ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto' :
                  index % 7 === 0 ? 'text-red-600' :
                  index % 7 === 6 ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>
                
                {/* イベントドット */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded border truncate ${getEventColor(event.type, event.status)}`}
                      >
                        <Icon className="w-3 h-3 inline mr-1" />
                        {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2}件
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日のイベント詳細 */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('ja-JP', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })} のイベント
          </h3>
          
          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">この日にはイベントがありません</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventColor(event.type, event.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm mt-1 opacity-80">{event.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{event.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                          {event.status && (
                            <span className={`px-2 py-1 rounded-full ${
                              event.status === 'completed' ? 'bg-green-200 text-green-800' :
                              event.status === 'overdue' ? 'bg-red-200 text-red-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {event.status === 'completed' ? '完了' :
                               event.status === 'overdue' ? '期限超過' : '予定'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 今月の統計 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">セッション</p>
              <p className="text-xl font-semibold text-gray-900">
                {events.filter(e => e.type === 'session' && e.date.getMonth() === currentDate.getMonth()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">課題</p>
              <p className="text-xl font-semibold text-gray-900">
                {events.filter(e => e.type === 'assignment' && e.date.getMonth() === currentDate.getMonth()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">マイルストーン</p>
              <p className="text-xl font-semibold text-gray-900">
                {events.filter(e => e.type === 'milestone' && e.date.getMonth() === currentDate.getMonth()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">完了済み</p>
              <p className="text-xl font-semibold text-gray-900">
                {events.filter(e => e.status === 'completed' && e.date.getMonth() === currentDate.getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}