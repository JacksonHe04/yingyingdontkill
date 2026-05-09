import AdminMessagesManager from '@/components/admin/AdminMessagesManager';
import { requireAdminPage } from '@/lib/admin/auth';
import { listAdminMessages } from '@/lib/content/admin-data';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  await requireAdminPage('/admin/messages');
  const messages = await listAdminMessages();

  return <AdminMessagesManager initialMessages={messages} />;
}
