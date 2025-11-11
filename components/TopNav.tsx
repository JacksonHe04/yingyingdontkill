'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadmeData } from '@/types';
import { calculateAge, getYearProgress, getCurrentTime, getCityCoordinates, getUserLocation, calculateDistance } from '@/lib/utils';

interface TopNavProps {
  data: ReadmeData;
}

export default function TopNav({ data }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [distance, setDistance] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
          const dist = calculateDistance(
            userLoc.lat,
            userLoc.lon,
            cityCoords.lat,
            cityCoords.lon
          );
          setDistance(Math.round(dist));
        }
      });
    }
  }, [cityCoords]);


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* 左侧 */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm lg:text-base">
              {data.basic.name[0]}
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xs lg:text-sm font-medium">{data.life.current_city}</span>
              {distance !== null && (
                <span className="text-xs text-gray-500">距离 {distance}km</span>
              )}
            </div>
            <div className="flex flex-col hidden md:flex">
              <span className="text-xs lg:text-sm font-medium">Lv.{age}</span>
              <div className="w-20 lg:w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
            onClick={() => setShowAI(!showAI)}
          >
            <motion.div
              className="px-4 lg:px-6 py-1.5 lg:py-2 rounded-full bg-black/20 dark:bg-white/20 backdrop-blur-md cursor-pointer"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-xs lg:text-sm font-medium">小缨缨 AI</span>
            </motion.div>
          </motion.div>

          {/* 右侧 */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* 平台链接 */}
            <div className="flex items-center gap-2">
              {data.contact.platform_accounts.map((platform) => (
                <a
                  key={platform.platform_name}
                  href={platform.homepage_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-lg">{platform.platform_name === 'GitHub' ? '⚡' : '🐦'}</span>
                </a>
              ))}
            </div>

            {/* 通知 */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-lg">🔔</span>
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
            className="absolute right-2 lg:right-4 top-16 lg:top-20 w-72 lg:w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl p-4"
          >
            <h3 className="font-bold mb-2">通知</h3>
            <div className="space-y-2">
              {data.notifications.map((notif, idx) => (
                <div key={idx} className="text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">{notif.date}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">
                      {notif.type}
                    </span>
                  </div>
                  <p className="mt-1">{notif.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI 对话框 */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 w-[calc(100vw-2rem)] lg:w-96 h-96 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 lg:p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">小缨缨 AI</h3>
              <button onClick={() => setShowAI(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                你好！我是小缨缨，可以帮你了解 {data.basic.name} 的信息。
              </div>
              <div className="text-sm">
                <p className="font-medium mb-2">预置问题：</p>
                <button className="text-left w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm">
                  MBTI匹配度测试
                </button>
                <button className="text-left w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm">
                  星座匹配度测试
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="输入问题..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                发送
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

