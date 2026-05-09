import AdminContentEditor from '@/components/admin/AdminContentEditor';
import { requireAdminPage } from '@/lib/admin/auth';
import { getReadmeData } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  await requireAdminPage('/admin/content');
  const data = await getReadmeData();

  return <AdminContentEditor initialData={data} />;
}
