import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { listAdminMessages } from '@/lib/content/admin-data';

export async function GET() {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await listAdminMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages', detail: (error as Error).message },
      { status: 500 }
    );
  }
}
