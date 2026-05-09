'use client';

import { useMemo, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';

type AdminLoginFormProps = {
  nextPath: string;
};

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const redirectTarget = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`;
  }, [nextPath]);

  const handleLogin = async () => {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('请输入管理员邮箱');
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTarget,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage('登录链接已发送，请到邮箱完成确认。');
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/30 bg-white/85 p-8 shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">管理员登录</h1>
      <p className="mb-6 text-sm text-gray-600">
        使用已加入 `admin_users` 白名单的邮箱接收 Magic Link。
      </p>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isPending}
          className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
        >
          {isPending ? '发送中...' : '发送登录链接'}
        </button>
      </div>
    </div>
  );
}
