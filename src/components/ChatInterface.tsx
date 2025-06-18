import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Mic, Circle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'student' | 'coach';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  coachName: string;
  coachAvatar: string;
  coachStatus: 'online' | 'in-session' | 'preparing';
}

export default function ChatInterface({ coachName, coachAvatar, coachStatus }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'おつかれさまです！昨日のセッションでお話しした目標設定の件、どう進んでいますか？😊',
      sender: 'coach',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // タイピングインジケーターのアニメーション
  useEffect(() => {
    if (isCoachTyping) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCoachTyping]);

  const getStatusText = () => {
    switch (coachStatus) {
      case 'online': return 'オンライン';
      case 'in-session': return '他の生徒と指導中';
      case 'preparing': return 'セッション準備中';
      default: return 'オンライン';
    }
  };

  const getStatusColor = () => {
    switch (coachStatus) {
      case 'online': return 'text-green-500';
      case 'in-session': return 'text-yellow-500';
      case 'preparing': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  const simulateCoachResponse = (studentMessage: string) => {
    setIsCoachTyping(true);
    
    // メッセージの長さに応じて返信時間を調整（人間らしい演出）
    const responseDelay = Math.max(2000, studentMessage.length * 50 + Math.random() * 2000);
    
    setTimeout(() => {
      setIsCoachTyping(false);
      
      // AIが生成した返信（実際の実装では OpenAI API を使用）
      const responses = [
        'とても良い質問ですね！そこに気づけたということは、あなたが着実に成長している証拠だと思います。具体的にどの部分で壁を感じているか、もう少し詳しく聞かせてもらえますか？',
        'その気持ち、よく分かります。私も同じような経験をしたことがあります。一歩ずつ進んでいけば大丈夫ですよ。今週の小さな目標から始めてみませんか？',
        'すごく頑張っていますね！その調子です。前回お話しした内容と照らし合わせると、確実に前進していると思います。次のステップについて一緒に考えていきましょう。',
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'coach',
        timestamp: new Date(),
      }]);
    }, responseDelay);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'student',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // コーチの返信をシミュレート
    simulateCoachResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー - コーチ情報 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={coachAvatar}
              alt={coachName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              coachStatus === 'online' ? 'bg-green-500' : 
              coachStatus === 'in-session' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{coachName}</h2>
            <div className="flex items-center space-x-1">
              <Circle className={`w-2 h-2 fill-current ${getStatusColor()}`} />
              <span className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* メッセージ領域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
              {message.sender === 'coach' && (
                <img
                  src={coachAvatar}
                  alt={coachName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* タイピングインジケーター */}
        {isCoachTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
              <img
                src={coachAvatar}
                alt={coachName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">{coachName}が入力中</span>
                  <span className="text-blue-600 font-semibold">{typingDots}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}