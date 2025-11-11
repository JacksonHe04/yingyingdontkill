'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface HiphopSectionProps {
  data: ReadmeData['hiphop'];
}

export default function HiphopSection({ data }: HiphopSectionProps) {
  return (
    <section id="hiphop" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          嘻哈
        </motion.h2>

        {/* 专辑 - 2行水平排列 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">专辑</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.albums.map((album, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover>
                  <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-400 rounded-lg mb-2" />
                  <h4 className="font-semibold text-sm mb-1 truncate">{album.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{album.artist}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {album.comment}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 单曲 - 2行水平排列 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">单曲</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.songs.map((song, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover>
                  <div className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg mb-2" />
                  <h4 className="font-semibold text-sm mb-1 truncate">{song.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                  <p className="text-xs text-gray-500 truncate">{song.album}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 音乐人 - 2行水平排列 */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">音乐人</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.musicians.map((musician, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover>
                  <div className="aspect-square bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg mb-2" />
                  <h4 className="font-semibold text-sm mb-1 truncate">{musician.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{musician.region}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {musician.comment}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

