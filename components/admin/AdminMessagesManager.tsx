'use client';

import { useState } from 'react';
import type { AdminMessage } from '@/lib/content/admin-data';

type AdminMessagesManagerProps = {
  initialMessages: AdminMessage[];
};

type PendingState = Record<string, boolean>;

export default function AdminMessagesManager({ initialMessages }: AdminMessagesManagerProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [pending, setPending] = useState<PendingState>({});
  const [error, setError] = useState('');

  const updateStatus = async (
    messageId: string,
    status: 'approved' | 'rejected' | 'spam'
  ) => {
    setPending((prev) => ({ ...prev, [messageId]: true }));
    setError('');

    try {
      const response = await fetch('/api/admin/content/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, status }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error || '更新失败');
        return;
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? { ...message, status } : message
        )
      );
    } finally {
      setPending((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className="rounded-3xl border border-white/30 bg-white/85 p-6 shadow-lg"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-900">{message.nickname || '访客'}</span>
            <span>{new Date(message.created_at).toLocaleString('zh-CN')}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs uppercase">
              {message.status}
            </span>
            {message.contact && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {message.contact}
              </span>
            )}
          </div>

          <p className="mb-4 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {message.content}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending[message.id]}
              onClick={() => updateStatus(message.id, 'approved')}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white"
            >
              通过
            </button>
            <button
              type="button"
              disabled={pending[message.id]}
              onClick={() => updateStatus(message.id, 'rejected')}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm text-white"
            >
              拒绝
            </button>
            <button
              type="button"
              disabled={pending[message.id]}
              onClick={() => updateStatus(message.id, 'spam')}
              className="rounded-full bg-red-600 px-4 py-2 text-sm text-white"
            >
              标记垃圾
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
