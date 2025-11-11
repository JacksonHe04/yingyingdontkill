'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface ReadingSectionProps {
  data: ReadmeData['reading'];
}

export default function ReadingSection({ data }: ReadingSectionProps) {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  return (
    <section id="reading" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          读书
        </motion.h2>

        {/* 书桌场景占位 */}
        <div className="mb-12 aspect-video bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white z-10">
            <p className="text-2xl mb-4">书桌上的书</p>
            <p className="text-sm opacity-80">（待实现3D书桌展示）</p>
          </div>
          {/* 占位符：书籍 */}
          <div className="absolute bottom-8 left-1/3 w-12 h-16 bg-red-600 rounded transform rotate-12" />
          <div className="absolute bottom-8 left-1/2 w-12 h-16 bg-blue-600 rounded transform -rotate-12" />
          <div className="absolute bottom-8 right-1/3 w-12 h-16 bg-green-600 rounded transform rotate-6" />
        </div>

        {/* 书籍 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">书籍</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.books.map((book, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer"
                  onClick={() => setSelectedBook(idx)}
                >
                  <h4 className="font-semibold mb-1">{book.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {book.author} · {book.country}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {book.comment}
                  </p>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看详情 →
                  </a>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 作家 */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">作家</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.authors.map((author, idx) => (
              <GlassCard key={idx} hover>
                <h4 className="font-semibold mb-1">{author.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{author.country}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {author.comment}
                </p>
                <a
                  href={author.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  查看详情 →
                </a>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 书籍详情弹窗 */}
        <AnimatePresence>
          {selectedBook !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBook(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBook(null)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold mb-2">
                  {data.books[selectedBook].name}
                </h3>
                <p className="text-gray-500 mb-4">
                  {data.books[selectedBook].author} · {data.books[selectedBook].country}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {data.books[selectedBook].comment}
                </p>
                <a
                  href={data.books[selectedBook].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  查看详情 →
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

