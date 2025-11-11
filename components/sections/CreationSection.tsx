'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface CreationSectionProps {
  data: ReadmeData['creation'];
}

export default function CreationSection({ data }: CreationSectionProps) {
  const [activePlanet, setActivePlanet] = useState(0);
  const planets = ['视频', '文章', '演讲', '座右铭', '语录'];

  return (
    <section id="creation" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          创作
        </motion.h2>

        {/* 星球切换场景占位 */}
        <div className="mb-12 aspect-video bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white z-10">
            <p className="text-2xl mb-4">多个星球之间切换</p>
            <p className="text-sm opacity-80">（待实现3D星球展示）</p>
          </div>
          {/* 占位符：星球 */}
          <div className="absolute inset-0 flex items-center justify-center gap-8">
            {planets.map((planet, idx) => (
              <motion.div
                key={idx}
                className={`w-16 h-16 rounded-full ${
                  activePlanet === idx
                    ? 'bg-yellow-400 scale-125'
                    : 'bg-gray-600 scale-100'
                }`}
                onClick={() => setActivePlanet(idx)}
                whileHover={{ scale: 1.2 }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* 视频 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">视频</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.videos.map((video, idx) => (
              <GlassCard key={idx} hover>
                <div className="text-sm text-gray-500 mb-2">{video.series}</div>
                <h4 className="font-semibold mb-2">{video.title}</h4>
                <div className="flex gap-2">
                  {video.video_link && (
                    <a
                      href={video.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      视频 →
                    </a>
                  )}
                  {video.podcast_link && (
                    <a
                      href={video.podcast_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      播客 →
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 文章 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.articles.map((article, idx) => (
              <GlassCard key={idx} hover>
                <h4 className="font-semibold mb-2">{article.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {article.excerpt}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  阅读全文 →
                </a>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 演讲 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">演讲</h3>
          <div className="grid grid-cols-1 gap-4">
            {data.speeches.map((speech, idx) => (
              <GlassCard key={idx} hover>
                <h4 className="font-semibold mb-2">{speech.speech_name}</h4>
                <div className="flex flex-wrap gap-2">
                  {speech.link && (
                    <a
                      href={speech.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      演示文稿 →
                    </a>
                  )}
                  {speech.outline_doc && (
                    <a
                      href={speech.outline_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      大纲文档 →
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 座右铭 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">座右铭</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.mottos.map((motto, idx) => (
              <GlassCard key={idx}>
                <p className="text-center text-lg italic">{motto}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 经典语录 */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">经典语录</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.quotes.map((quote, idx) => (
              <GlassCard key={idx}>
                <p className="text-center text-lg italic">{quote}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

