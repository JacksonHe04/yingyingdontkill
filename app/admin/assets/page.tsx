import AdminAssetsManager from '@/components/admin/AdminAssetsManager';
import { requireAdminPage } from '@/lib/admin/auth';
import { listAdminAssets } from '@/lib/content/admin-data';

export const dynamic = 'force-dynamic';

export default async function AdminAssetsPage() {
  await requireAdminPage('/admin/assets');
  const assets = await listAdminAssets();

  return <AdminAssetsManager initialAssets={assets} />;
}
