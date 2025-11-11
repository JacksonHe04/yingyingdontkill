'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface FilmsSectionProps {
  data: ReadmeData['films'];
}

export default function FilmsSection({ data }: FilmsSectionProps) {
  const [selectedFilm, setSelectedFilm] = useState<number | null>(null);

  return (
    <section id="films" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          影片
        </motion.h2>

        {/* 书桌场景占位 */}
        <div className="mb-12 aspect-video bg-gradient-to-br from-purple-600 to-indigo-800 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white z-10">
            <p className="text-2xl mb-4">书桌上的碟片</p>
            <p className="text-sm opacity-80">（待实现3D书桌展示）</p>
          </div>
          {/* 占位符：碟片 */}
          <div className="absolute bottom-8 left-1/3 w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-600" />
          <div className="absolute bottom-8 left-1/2 w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-600" />
          <div className="absolute bottom-8 right-1/3 w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-600" />
        </div>

        {/* 影片 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">影片</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.films.map((film, idx) => (
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
                  onClick={() => setSelectedFilm(idx)}
                >
                  <h4 className="font-semibold mb-1">{film.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {film.director} · {film.country}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {film.comment}
                  </p>
                  <a
                    href={film.link}
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

        {/* 导演 */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">导演</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.directors.map((director, idx) => (
              <GlassCard key={idx} hover>
                <h4 className="font-semibold mb-1">{director.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{director.country}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {director.comment}
                </p>
                <a
                  href={director.link}
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

        {/* 影片详情弹窗 */}
        <AnimatePresence>
          {selectedFilm !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFilm(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedFilm(null)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold mb-2">
                  {data.films[selectedFilm].name}
                </h3>
                <p className="text-gray-500 mb-4">
                  {data.films[selectedFilm].director} · {data.films[selectedFilm].country}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {data.films[selectedFilm].comment}
                </p>
                <a
                  href={data.films[selectedFilm].link}
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

