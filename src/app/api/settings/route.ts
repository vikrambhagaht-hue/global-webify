import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      hostingMenuEnabled: settingsMap['hostingMenuEnabled'] === 'false' ? false : true,
      brandingMenuEnabled: settingsMap['brandingMenuEnabled'] === 'false' ? false : true,
      partnershipPageSlug: settingsMap['partnershipPageSlug'] || 'partnership',
      partnershipPageTitle: settingsMap['partnershipPageTitle'] || 'Partner Network | GlobalWeblify',
      partnershipHeroTitle: settingsMap['partnershipHeroTitle'] || 'Partner With GlobalWeblify',
      partnershipHeroDesc: settingsMap['partnershipHeroDesc'] || 'Expand your service catalog, increase your revenue, and deliver state-of-the-art technological experiences to your clients.',
      partnershipHeading: settingsMap['partnershipHeading'] || 'Accelerate Growth Together',
      partnershipDesc: settingsMap['partnershipDesc'] || 'Whether you run an agency looking to outsource development, a consultant recommending leading web platforms, or an integration provider, we construct synergistic structures that deliver results.',
      partnershipPageImage: settingsMap['partnershipPageImage'] || '/partnership/Partner1.jpg'
    });
  } catch (error: any) {
    console.error('API Settings GET Error:', error);
    return NextResponse.json({ 
      hostingMenuEnabled: true, 
      brandingMenuEnabled: true,
      partnershipPageSlug: 'partnership'
    });
  }
}

export async function POST(request: Request) {
  try {
    try {
      await requireAdmin(true);
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    
    const updatableKeys = [
      'hostingMenuEnabled',
      'brandingMenuEnabled',
      'partnershipPageSlug',
      'partnershipPageTitle',
      'partnershipHeroTitle',
      'partnershipHeroDesc',
      'partnershipHeading',
      'partnershipDesc',
      'partnershipPageImage'
    ];

    const promises = [];
    for (const key of updatableKeys) {
      if (body && body[key] !== undefined) {
        const value = String(body[key]);
        promises.push(
          db.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
          })
        );
      }
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }

    // Revalidate paths
    revalidatePath('/');
    revalidateTag('services');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Settings POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
