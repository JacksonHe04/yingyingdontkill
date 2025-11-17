'use client';

import { motion } from 'framer-motion';
import type { ReadmeData } from '@/types';

interface ReadingDeskSceneProps {
  books: ReadmeData['reading']['books'];
  onSelect: (detail: {
    title: string;
    description: string;
    link?: string;
    author: string;
    country: string;
  }) => void;
  activeTitle?: string | null;
}

export default function ReadingDeskScene({ books, onSelect, activeTitle }: ReadingDeskSceneProps) {
  const featured = books.slice(0, 5);

  return (
    <div className="relative mt-8 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-indigo-900 to-slate-900 p-6 text-white shadow-2xl shadow-rose-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(248,113,113,0.12)_0%,_transparent_55%)] opacity-80" />
      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.5em] text-rose-100/80">Reading Orbit</p>
        <h3 className="text-2xl font-semibold">书桌上的书 · 可点击的立体书脊</h3>
        <p className="text-sm text-rose-100/80">挑选一本书，查看简介与链接。</p>
      </div>

      <div className="relative mt-10 h-[320px]">
        <div className="absolute inset-x-0 bottom-0 h-28 rounded-[40px] bg-gradient-to-br from-rose-200/60 to-pink-200/70 blur-2xl opacity-80" />
        <div className="absolute inset-x-8 bottom-4 h-2 rounded-full bg-white/30 blur-xl" />

        <div className="relative flex h-full items-end justify-center gap-6">
          {featured.map((book, idx) => (
            <motion.button
              key={book.name}
              className={`group relative flex h-60 w-20 flex-col items-center justify-end rounded-t-[10px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-3 pb-4 text-center text-xs font-semibold uppercase tracking-widest ${
                activeTitle === book.name ? 'shadow-[0_25px_35px_rgba(244,114,182,0.45)]' : ''
              }`}
              style={{
                transform: `rotateX(20deg) rotateY(${(-10 + idx * 4).toFixed(1)}deg)`,
              }}
              whileHover={{ y: -10 }}
              onClick={() =>
                onSelect({
                  title: book.name,
                  description: book.comment,
                  link: book.link,
                  author: book.author,
                  country: book.country,
                })
              }
            >
              <div className="absolute inset-0 rounded-t-[10px] bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="text-[10px] text-rose-100/60">{book.author}</span>
              <span className="mt-2 text-sm text-white">{book.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
