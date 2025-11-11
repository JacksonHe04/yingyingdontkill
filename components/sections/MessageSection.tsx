'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';

export default function MessageSection() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const quickGreetings = [
    '你好！',
    '很高兴认识你！',
    '期待交流！',
    '祝好！',
  ];

  return (
    <section id="message" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          留言
        </motion.h2>

        {/* 白板背景 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-2xl">
          {!isLoggedIn ? (
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">快速登录</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  使用 GitHub 登录
                </button>
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  匿名留言
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              <GlassCard>
                <h3 className="text-xl font-semibold mb-4">快捷问候</h3>
                <div className="flex flex-wrap gap-2">
                  {quickGreetings.map((greeting, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(greeting)}
                      className="px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
                    >
                      {greeting}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-semibold mb-4">留言</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你想说的话..."
                  className="w-full h-32 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    退出登录
                  </button>
                  <button
                    onClick={() => {
                      alert('留言功能待实现');
                      setMessage('');
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    发送
                  </button>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

