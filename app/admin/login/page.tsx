import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { getAdminContext } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getAdminContext();
  if (admin) {
    redirect('/admin/content');
  }

  const params = await searchParams;
  const nextPath = params.next || '/admin/content';

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
