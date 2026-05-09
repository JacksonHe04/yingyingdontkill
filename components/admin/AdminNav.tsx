'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSignOutButton from './AdminSignOutButton';

const navItems = [
  { href: '/admin/content', label: '内容编辑' },
  { href: '/admin/messages', label: '留言审核' },
  { href: '/admin/assets', label: '资产库' },
];

type AdminNavProps = {
  email?: string;
};

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="sticky top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-lg font-semibold text-gray-900">
            Supabase CMS
          </Link>
          {!isLoginPage && (
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      active
                        ? 'bg-gray-900 text-white'
                        : 'bg-white/70 text-gray-600 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {!isLoginPage && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {email && <span className="hidden sm:inline">{email}</span>}
            <AdminSignOutButton />
          </div>
        )}
      </div>
    </div>
  );
}
