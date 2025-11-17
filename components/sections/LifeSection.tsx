'use client';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface LifeSectionProps {
  data: ReadmeData['life'];
}

export default function LifeSection({ data }: LifeSectionProps) {
  return (
    <section id="life" className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-semibold mb-4">基本信息</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">当前城市：</span>
                <span className="ml-2">{data.current_city}</span>
              </div>
              <div>
                <span className="text-gray-500">MBTI：</span>
                <span className="ml-2">
                  生活 {data.mbti.life_mbti} / 工作 {data.mbti.work_mbti}
                </span>
              </div>
              <div>
                <span className="text-gray-500">星座：</span>
                <span className="ml-2">{data.zodiac_sign}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">习惯</h3>
            <div className="flex flex-wrap gap-2">
              {data.habits.map((habit, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {habit}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">最爱食物</h3>
            <div className="flex flex-wrap gap-2">
              {data.diet.favorite_food.map((food, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {food}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">最爱饮品</h3>
            <div className="flex flex-wrap gap-2">
              {data.diet.favorite_drinks.map((drink, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {drink}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
