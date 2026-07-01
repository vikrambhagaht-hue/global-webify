'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

const TEAM_FILE_PATH = path.join(process.cwd(), 'src/data/team.json');

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  education: string;
  experience: string;
  isExEmployee: boolean;
  order?: number;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

async function getTeamFromFile(): Promise<TeamMember[]> {
  try {
    const data = await fs.readFile(TEAM_FILE_PATH, 'utf-8');
    const parsed: TeamMember[] = JSON.parse(data);
    // Ensure every item has an order value
    return parsed.map((item, idx) => ({
      ...item,
      order: typeof item.order === 'number' ? item.order : idx + 1,
      education: item.education || '',
      experience: item.experience || '',
      socials: {
        facebook: item.socials?.facebook || '',
        instagram: item.socials?.instagram || '',
        linkedin: item.socials?.linkedin || '',
        twitter: item.socials?.twitter || '',
      }
    })).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('Error reading team file:', err);
    return [];
  }
}

async function saveTeamToFile(members: TeamMember[]): Promise<void> {
  try {
    await fs.writeFile(TEAM_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing team file:', err);
  }
}

export async function getLiveTeamMembers(): Promise<TeamMember[]> {
  try {
    // Check SiteSetting first - guaranteed to work 100% on Vercel production
    const setting = await db.siteSetting.findUnique({
      where: { key: 'team_members_list' }
    });
    if (setting && setting.value) {
      const parsed: TeamMember[] = JSON.parse(setting.value);
      return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    // If not in SiteSetting yet, seed from team.json file
    const fileMembers = await getTeamFromFile();
    await db.siteSetting.upsert({
      where: { key: 'team_members_list' },
      update: { value: JSON.stringify(fileMembers) },
      create: { key: 'team_members_list', value: JSON.stringify(fileMembers) }
    }).catch(() => {});

    return fileMembers;
  } catch (err) {
    console.error('Error fetching live team members:', err);
    return await getTeamFromFile();
  }
}

export async function getTeamMembers() {
  await requireAdmin();
  return await getLiveTeamMembers();
}

export async function saveTeamMember(formData: TeamMember) {
  await requireAdmin();

  if (formData.image && formData.image.startsWith('data:image/')) {
    try {
      const matches = formData.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `team-${formData.id || Date.now()}-${Date.now()}.webp`;
        const uploadDir = path.join(process.cwd(), 'public/assets/images/team');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        formData.image = `/assets/images/team/${filename}`;
      }
    } catch (err) {
      console.error('Failed to save base64 image to disk:', err);
    }
  }

  const members = await getLiveTeamMembers();
  members.sort((a, b) => (a.order || 0) - (b.order || 0));

  if (formData.id) {
    const idx = members.findIndex((m) => m.id === formData.id);
    if (idx !== -1) {
      if (formData.order && formData.order !== members[idx].order) {
        members.splice(idx, 1);
        const targetIndex = Math.max(0, Math.min(members.length, formData.order - 1));
        members.splice(targetIndex, 0, formData);
      } else {
        members[idx] = { ...formData };
      }
    } else {
      members.push(formData);
    }
  } else {
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    formData.id = newId;
    if (formData.order) {
      const targetIndex = Math.max(0, Math.min(members.length, formData.order - 1));
      members.splice(targetIndex, 0, formData);
    } else {
      members.push(formData);
    }
  }

  // Reassign exact order
  members.forEach((m, idx) => {
    m.order = idx + 1;
  });

  // Save to SiteSetting (production Vercel store)
  try {
    await db.siteSetting.upsert({
      where: { key: 'team_members_list' },
      update: { value: JSON.stringify(members) },
      create: { key: 'team_members_list', value: JSON.stringify(members) }
    });
  } catch (e) {
    console.error('Save team SiteSetting error:', e);
  }

  // Try updating Prisma table if pushed
  try {
    await (db as any).teamMember?.upsert({
      where: { id: formData.id },
      update: {
        name: formData.name,
        role: formData.role,
        image: formData.image,
        bio: formData.bio || '',
        education: formData.education || '',
        experience: formData.experience || '',
        isExEmployee: formData.isExEmployee,
        order: formData.order || 1,
        facebook: formData.socials?.facebook || '',
        instagram: formData.socials?.instagram || '',
        linkedin: formData.socials?.linkedin || '',
        twitter: formData.socials?.twitter || '',
      },
      create: {
        id: formData.id,
        name: formData.name,
        role: formData.role,
        image: formData.image,
        bio: formData.bio || '',
        education: formData.education || '',
        experience: formData.experience || '',
        isExEmployee: formData.isExEmployee,
        order: formData.order || 1,
        facebook: formData.socials?.facebook || '',
        instagram: formData.socials?.instagram || '',
        linkedin: formData.socials?.linkedin || '',
        twitter: formData.socials?.twitter || '',
      }
    });
  } catch (e) {}

  // Save to file on localhost
  await saveTeamToFile(members);

  revalidatePath('/team');
  revalidatePath('/about');
  revalidatePath('/admin/team');

  return { success: true };
}

export async function deleteTeamMember(id: number) {
  await requireAdmin();

  let members = await getLiveTeamMembers();
  members = members.filter((m) => m.id !== id);

  try {
    await db.siteSetting.upsert({
      where: { key: 'team_members_list' },
      update: { value: JSON.stringify(members) },
      create: { key: 'team_members_list', value: JSON.stringify(members) }
    });
  } catch (e) {}

  try {
    await (db as any).teamMember?.delete({ where: { id } });
  } catch (e) {}

  await saveTeamToFile(members);

  revalidatePath('/team');
  revalidatePath('/about');
  revalidatePath('/admin/team');

  return { success: true };
}

export async function reorderTeamMembers(reorderedIds: number[]) {
  await requireAdmin();

  const members = await getLiveTeamMembers();
  const map = new Map(members.map((m) => [m.id, m]));

  const updated: TeamMember[] = [];
  reorderedIds.forEach((id, idx) => {
    const member = map.get(id);
    if (member) {
      member.order = idx + 1;
      updated.push(member);
      map.delete(id);
    }
  });

  Array.from(map.values()).forEach((member, idx) => {
    member.order = reorderedIds.length + idx + 1;
    updated.push(member);
  });

  // Save reordered sequence to SiteSetting (Vercel Production)
  try {
    await db.siteSetting.upsert({
      where: { key: 'team_members_list' },
      update: { value: JSON.stringify(updated) },
      create: { key: 'team_members_list', value: JSON.stringify(updated) }
    });
  } catch (e) {
    console.error('Error saving reordered sequence to SiteSetting:', e);
  }

  await saveTeamToFile(updated);

  revalidatePath('/team');
  revalidatePath('/about');
  revalidatePath('/admin/team');

  return { success: true };
}
