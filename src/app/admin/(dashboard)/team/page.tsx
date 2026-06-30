'use server';

import AdminTeamClient from './AdminTeamClient';
import { getTeamMembers } from './actions';

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return <AdminTeamClient initialMembers={members} />;
}
