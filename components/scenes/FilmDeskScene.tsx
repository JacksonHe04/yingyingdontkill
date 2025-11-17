'use client';

import { motion } from 'framer-motion';
import type { ReadmeData } from '@/types';

interface FilmDeskSceneProps {
  films: ReadmeData['films']['films'];
  onSelect: (detail: {
    title: string;
    description: string;
    link?: string;
    director: string;
    country: string;
  }) => void;
  activeTitle?: string | null;
}

export default function FilmDeskScene({ films, onSelect, activeTitle }: FilmDeskSceneProps) {
  const featured = films.slice(0, 4);

  return (
    <div className="relative mt-8 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 p-6 text-white shadow-2xl shadow-indigo-950/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(99,102,241,0.15),_transparent_60%)] opacity-80" />
      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.5em] text-indigo-100/80">Film Desk</p>
        <h3 className="text-2xl font-semibold">书桌上的碟片 · 旋转查看影片</h3>
        <p className="text-sm text-indigo-100/80">每张唱片对应一部作品，点击旋转并查看摘要链接。</p>
      </div>

      <div className="relative mt-10 h-[320px]">
        <div className="absolute inset-x-0 bottom-0 h-28 rounded-[40px] bg-gradient-to-br from-indigo-400/60 to-purple-400/70 blur-2xl opacity-80" />
        <div className="absolute inset-x-12 bottom-6 h-2 rounded-full bg-blue-100/40 blur-xl" />

        <div className="relative flex h-full items-end justify-center gap-10">
          {featured.map((film, idx) => (
            <motion.button
              key={film.name}
              className={`relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 shadow-[0_25px_45px_rgba(30,58,138,0.45)] ${
                activeTitle === film.name ? 'ring-4 ring-pink-400/60' : 'ring-2 ring-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20 - idx * 2, repeat: Infinity, ease: 'linear' }}
              onClick={() =>
                onSelect({
                  title: film.name,
                  description: film.comment,
                  link: film.link,
                  director: film.director,
                  country: film.country,
                })
              }
            >
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-60" />
              <div className="relative z-10 flex flex-col text-center text-sm font-semibold">
                <span>{film.name}</span>
                <span className="text-xs text-white/80">{film.director}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
