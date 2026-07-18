import { cookies, headers } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { verifyCsrf } from '@/lib/csrf';

export async function requireAdmin(requireCsrf = false) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    throw new Error('Unauthorized: No active session.');
  }

  if (requireCsrf) {
    verifyCsrf();
  }

  const payload = await verifyJWT(token);

  if (!payload || payload.role !== 'admin') {
    throw new Error('Unauthorized: Invalid session.');
  }

  return payload;
}
