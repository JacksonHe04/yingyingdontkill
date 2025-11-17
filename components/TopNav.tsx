'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Bell, MapPin, RefreshCw } from 'lucide-react';
import { ReadmeData } from '@/types';
import {
  calculateAge,
  getYearProgress,
  getCurrentTime,
  getCityCoordinates,
  getUserLocation,
  calculateDistance,
} from '@/lib/utils';
import Modal from './Modal';

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
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [notificationsViewed, setNotificationsViewed] = useState(0);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const notificationsStorageKey = 'yingying-notifications-viewed';

  const age = calculateAge(data.life.birth_date);
  const yearProgress = getYearProgress();
  const cityCoords = getCityCoordinates(data.life.current_city);
  const shouldShowBadge = data.notifications.length > notificationsViewed;

  const markNotificationsRead = () => {
    if (typeof window === 'undefined') return;
    const latestCount = data.notifications.length;
    setNotificationsViewed(latestCount);
    window.localStorage.setItem(notificationsStorageKey, String(latestCount));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateUserLocation = useCallback(async () => {
    if (!cityCoords) return;
    setIsRefreshingLocation(true);
    try {
      const userLoc = await getUserLocation();
      if (userLoc) {
        setUserCoords(userLoc);
        const distKm = calculateDistance(userLoc.lat, userLoc.lon, cityCoords.lat, cityCoords.lon);
        setDistance(Math.round(distKm * 1000));
      } else {
        setUserCoords(null);
        setDistance(null);
      }
    } finally {
      setIsRefreshingLocation(false);
    }
  }, [cityCoords]);

  useEffect(() => {
    updateUserLocation();
  }, [updateUserLocation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(notificationsStorageKey);
    if (stored) {
      setNotificationsViewed(Number(stored));
    }
  }, [notificationsStorageKey]);

  const formatDistanceMeters = (meters: number) => `${meters.toLocaleString()} 米`;

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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/20 border-b border-white/30 backdrop-blur-[40px]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-14 lg:h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMobilePanel(true)}
                className="sm:hidden w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-400 text-white font-semibold"
                aria-label="打开个人面板"
              >
                {data.basic.name[0]}
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm lg:text-base">
                  {data.basic.name[0]}
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="hidden sm:flex flex-col text-left text-gray-700 rounded-2xl px-3 py-1.5 bg-white/30 border border-white/40"
                  onClick={() => setShowLocationModal(true)}
                >
                  <span className="flex items-center gap-1 text-xs lg:text-sm font-medium">
                    <MapPin className="h-3 w-3 text-green-500" />
                    {data.life.current_city}
                  </span>
                  {distance !== null && (
                    <span className="text-xs text-gray-500">距离约 {formatDistanceMeters(distance)}</span>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="hidden md:flex flex-col text-left text-gray-700 rounded-2xl px-3 py-1.5 bg-white/30 border border-white/40"
                  onClick={() => setShowLevelModal(true)}
                >
                  <span className="flex items-center gap-2 text-xs lg:text-sm font-medium">
                    Lv.{age}
                    <span className="text-[10px] text-gray-500">
                      {yearProgress.daysPassed}/{yearProgress.totalDays}
                    </span>
                  </span>
                  <div className="w-28 lg:w-32 h-1.5 bg-gray-200/80 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${yearProgress.percentage}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            <motion.div
              className="relative flex-shrink-0 absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0"
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

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden lg:flex items-center gap-2">
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

              <button
                onClick={() => {
                  setShowNotifications((prev) => {
                    const next = !prev;
                    if (next) {
                      markNotificationsRead();
                    }
                    return next;
                  });
                }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-white/40 bg-white/30 text-gray-700 transition hover:border-purple-200 hover:text-purple-600"
                aria-label="查看通知"
              >
                <Bell className="h-4 w-4" />
                {shouldShowBadge && (
                  <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-4 px-1 bg-gray-100 text-gray-700 rounded-full text-[10px] flex items-center justify-center font-semibold">
                    {data.notifications.length}
                  </span>
                )}
              </button>

              <div className="hidden md:block text-xs lg:text-sm font-mono">{currentTime}</div>
            </div>
          </div>
        </div>

        <Modal open={showNotifications} onClose={() => setShowNotifications(false)} position="top-right" className="max-w-sm">
          <h3 className="font-bold mb-2 text-gray-900">通知</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {data.notifications.map((notif, idx) => (
              <div key={idx} className="text-sm border-b border-gray-200 pb-2 last:border-0">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">{notif.date}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 rounded text-blue-700">{notif.type}</span>
                </div>
                <p className="mt-1 text-gray-700">{notif.text}</p>
              </div>
            ))}
          </div>
        </Modal>
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

      <Modal open={showLocationModal} onClose={() => setShowLocationModal(false)}>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="text-xs uppercase text-gray-400">作者位置</p>
            <p className="text-base text-gray-900">{data.life.current_city}</p>
            <p>
              坐标：{cityCoords ? `${cityCoords.lat.toFixed(3)}, ${cityCoords.lon.toFixed(3)}` : '未知'}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-gray-400">我的位置</p>
              <button
                type="button"
                onClick={() => updateUserLocation()}
                disabled={!cityCoords || isRefreshingLocation}
                className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="刷新我的位置"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshingLocation ? 'animate-spin text-blue-500' : ''}`}
                />
              </button>
            </div>
            {userCoords ? (
              <>
                <p>
                  坐标：{userCoords.lat.toFixed(3)}, {userCoords.lon.toFixed(3)}
                </p>
                {distance !== null && (
                  <p className="mt-1 text-blue-500">与作者相距 {formatDistanceMeters(distance)}</p>
                )}
              </>
            ) : (
              <p>需要权限才能获取你的位置。</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal open={showLevelModal} onClose={() => setShowLevelModal(false)}>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">出生日期</p>
              <p className="text-lg font-semibold text-gray-900">{data.life.birth_date}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">当前年龄</p>
              <p className="text-lg font-semibold text-gray-900">{age} 岁</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">
              今年 {yearProgress.totalDays} 天 · 已度过 {yearProgress.daysPassed} 天
            </p>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${yearProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={showMobilePanel} onClose={() => setShowMobilePanel(false)}>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 text-white font-semibold flex items-center justify-center">
              {data.basic.name[0]}
            </div>
            <div>
              <p className="font-semibold">{data.basic.name}</p>
              <p className="text-xs text-gray-500">{data.basic.intro}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 mb-1">社交平台</p>
            <div className="space-y-2">
              {data.contact.platform_accounts.map((platform) => (
                <a
                  key={platform.platform_name}
                  href={platform.homepage_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/40 bg-white/40 px-3 py-2 text-sm text-gray-700"
                >
                  <span>{platform.platform_name}</span>
                  <span className="text-xs text-gray-500">{platform.username}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase text-gray-400">地点与等级</p>
            <div className="rounded-2xl border border-white/40 bg-white/40 px-3 py-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                {data.life.current_city}
              </p>
              {distance !== null && (
                <p className="text-xs text-gray-500 mt-1">与你相距约 {formatDistanceMeters(distance)}</p>
              )}
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/40 px-3 py-2">
              <p className="text-sm font-medium">Lv.{age}</p>
              <p className="text-xs text-gray-500 mb-1">
                {yearProgress.daysPassed}/{yearProgress.totalDays}
              </p>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${yearProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {aiState === 'docked' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-white/30 backdrop-blur-sm"
            onClick={() => setAIState('closed')}
          />
        )}
      </AnimatePresence>
    </>
  );
}
