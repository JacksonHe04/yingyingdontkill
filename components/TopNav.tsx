'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Bell, MapPin } from 'lucide-react';
import { ReadmeData } from '@/types';
import {
  calculateAge,
  getYearProgress,
  getCurrentTime,
  getCityCoordinates,
  getUserLocation,
  calculateDistance,
} from '@/lib/utils';

interface TopNavProps {
  data: ReadmeData;
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const aiSuggestions = ['MBTI匹配度测试', '星座匹配度测试', '推荐一本书', '最近的创作灵感'];
const platformIconMap = {
  GitHub: Github,
  Twitter,
} as const;

export default function TopNav({ data }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [distance, setDistance] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiState, setAIState] = useState<'closed' | 'docked' | 'floating'>('closed');
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAIInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const age = calculateAge(data.life.birth_date);
  const yearProgress = getYearProgress();
  const cityCoords = getCityCoordinates(data.life.current_city);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cityCoords) {
      getUserLocation().then((userLoc) => {
        if (userLoc) {
          setUserCoords(userLoc);
          const dist = calculateDistance(userLoc.lat, userLoc.lon, cityCoords.lat, cityCoords.lon);
          setDistance(Math.round(dist));
        }
      });
    }
  }, [cityCoords]);

  const handleIslandClick = () => {
    setAIState((prev) => {
      if (prev === 'closed') return 'docked';
      if (prev === 'docked') return 'closed';
      return 'closed';
    });
  };

  const handleSend = async (prompt?: string) => {
    const text = (prompt ?? aiInput).trim();
    if (!text) return;
    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setAIInput('');
    setAIState('floating');
    setIsStreaming(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('AI 服务不可用');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantReply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          if (!prev.length) return prev;
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = { ...updated[lastIndex], content: assistantReply };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('AI assistant error:', error);
      setErrorMessage('小缨缨暂时离线，请稍后重试。');
      setMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: '抱歉，我现在无法连接大脑，请稍后再试。',
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const overlayActive = aiState === 'docked' || showLocationModal;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/20 border-b border-white/30 backdrop-blur-[40px]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* 左侧 */}
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm lg:text-base">
                {data.basic.name[0]}
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="hidden sm:flex flex-col text-left text-gray-700"
              >
                <span className="flex items-center gap-1 text-xs lg:text-sm font-medium">
                  <MapPin className="h-3 w-3 text-green-500" />
                  {data.life.current_city}
                  {distance !== null && (
                    <span className="ml-1 text-[10px] text-blue-500">查看</span>
                  )}
                </span>
                {distance !== null && (
                  <span className="text-xs text-gray-500">距离 {distance}km</span>
                )}
              </button>
              <div className="flex flex-col hidden md:flex">
                <div className="flex items-center gap-2">
                  <span className="text-xs lg:text-sm font-medium">Lv.{age}</span>
                  <span className="text-[10px] text-gray-500">
                    {yearProgress.daysPassed}/{yearProgress.totalDays}
                  </span>
                </div>
                <div className="w-28 lg:w-32 h-1.5 bg-gray-200/80 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${yearProgress.percentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* 中间 - 灵动岛 */}
            <motion.div
              className="relative hidden sm:block"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleIslandClick}
            >
            <motion.div
              className="px-6 py-2 rounded-full border border-white/20 bg-black text-white/90 backdrop-blur-2xl cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
              animate={{
                scale: isHovered || aiState !== 'closed' ? 1.08 : 1,
                boxShadow:
                  aiState !== 'closed'
                    ? '0 10px 40px rgba(139,92,246,0.35)'
                    : '0 10px 20px rgba(0,0,0,0.08)',
              }}
              transition={{ type: 'spring', stiffness: 260 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex h-4 w-7 items-center justify-center rounded-full bg-white/20">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-white"
                    animate={{ scaleY: [1, 0.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span className="text-xs tracking-wide uppercase">小缨缨 AI</span>
              </div>
            </motion.div>

            <AnimatePresence>
              {aiState === 'docked' && (
                <motion.div
                    layoutId="ai-panel"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 12, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute left-1/2 top-full z-50 mt-4 w-80 -translate-x-1/2 rounded-3xl border border-white/40 bg-white/60 p-4 text-sm shadow-2xl backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3 text-gray-600">
                      你好，我是小缨缨。想了解 Yingying 的哪些故事？
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {aiSuggestions.map((suggest) => (
                        <button
                          key={suggest}
                          className="rounded-full border border-white/50 bg-white/30 px-3 py-1 text-xs text-gray-600 hover:bg-white/60"
                          onClick={() => handleSend(suggest)}
                        >
                          {suggest}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAIInput(e.target.value)}
                        placeholder="输入问题..."
                        className="flex-1 rounded-2xl border border-white/50 bg-white/40 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSend()}
                        className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white text-sm disabled:opacity-50"
                        disabled={isStreaming}
                      >
                        发送
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 右侧 */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* 平台链接 */}
              <div className="flex items-center gap-2">
                {data.contact.platform_accounts.map((platform) => {
                  const Icon =
                    platformIconMap[platform.platform_name as keyof typeof platformIconMap];
                  return (
                    <a
                      key={platform.platform_name}
                      href={platform.homepage_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/40 bg-white/30 text-gray-700 transition hover:border-purple-200 hover:text-purple-600"
                    >
                      {Icon ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">
                          {platform.platform_name.slice(0, 1)}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>

              {/* 通知 */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-white/40 bg-white/30 text-gray-700 transition hover:border-purple-200 hover:text-purple-600"
              >
                <Bell className="h-4 w-4" />
                {data.notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {data.notifications.length}
                  </span>
                )}
              </button>

              {/* 当前时间 */}
              <div className="text-xs lg:text-sm font-mono hidden sm:block">{currentTime}</div>
            </div>
          </div>
        </div>

        {/* 通知卡片 */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-2 lg:right-4 top-16 lg:top-20 w-72 lg:w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-4"
            >
              <h3 className="font-bold mb-2">通知</h3>
              <div className="space-y-2">
                {data.notifications.map((notif, idx) => (
                  <div key={idx} className="text-sm border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">{notif.date}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 rounded">{notif.type}</span>
                    </div>
                    <p className="mt-1">{notif.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* AI 浮窗 */}
      <AnimatePresence>
        {aiState === 'floating' && (
          <motion.div
            layoutId="ai-panel"
            initial={{ opacity: 0, x: 60, y: 60 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 w-[calc(100vw-2rem)] max-w-md h-[28rem] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 flex flex-col z-40"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/50">
              <div>
                <p className="text-sm font-semibold">小缨缨 AI</p>
                <p className="text-xs text-gray-500">基于 Yingying 的数字花园</p>
              </div>
              <div className="flex items-center gap-2">
                {isStreaming && <span className="text-[10px] text-purple-500">回答中...</span>}
                <button
                  onClick={() => setAIState('closed')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-white/50 p-4 text-sm text-gray-600 shadow-inner">
                  你可以问“小缨缨”关于作品、经历、音乐、阅读或任何和 Yingying 相关的故事。
                </div>
              )}
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/80 text-gray-800 shadow'
                    }`}
                  >
                    {message.content || (message.role === 'assistant' ? '......' : '')}
                  </div>
                </div>
              ))}
              {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
            </div>
            <div className="border-t border-white/50 px-5 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  placeholder="继续提问..."
                  className="flex-1 rounded-2xl border border-white/50 bg-white/60 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white text-sm disabled:opacity-50"
                  disabled={isStreaming}
                >
                  发送
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 位置详情 */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-md px-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-2xl border border-white/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">位置详情</h3>
                <button onClick={() => setShowLocationModal(false)} className="text-gray-500">
                  ✕
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase text-gray-400">作者位置</p>
                  <p className="text-base text-gray-900">{data.life.current_city}</p>
                  <p>
                    坐标：
                    {cityCoords ? `${cityCoords.lat.toFixed(3)}, ${cityCoords.lon.toFixed(3)}` : '未知'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">我的位置</p>
                  {userCoords ? (
                    <>
                      <p>
                        坐标：{userCoords.lat.toFixed(3)}, {userCoords.lon.toFixed(3)}
                      </p>
                      {distance !== null && (
                        <p className="mt-1 text-blue-500">与作者相距 {distance}km</p>
                      )}
                    </>
                  ) : (
                    <p>需要权限才能获取你的位置。</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景遮罩 */}
      <AnimatePresence>
        {overlayActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-white/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}
