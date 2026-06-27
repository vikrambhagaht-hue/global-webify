import { Metadata } from 'next';
import PartnershipClient from '@/features/company/components/PartnershipClient';
import { db } from '@/lib/db';

export const revalidate = 0; // Fetch immediately when loaded

export async function generateMetadata(): Promise<Metadata> {
  try {
    const titleSetting = await db.siteSetting.findUnique({
      where: { key: 'partnershipPageTitle' }
    });
    const descSetting = await db.siteSetting.findUnique({
      where: { key: 'partnershipHeroDesc' }
    });
    return {
      title: titleSetting?.value || 'Join Global Webify Franchisee – Web Development, Web Design, SEO & CRM Business Partner',
      description: descSetting?.value || 'Join Global Webify franchisee program for Web Development, Web Design, SEO & CRM solutions. Start your own digital business with expert support. Enquire now and grow faster!',
      keywords: ['Franchisee Opportunity in Web Development', 'Franchisee Opportunity in CRM', 'Global Webify Partnership', 'CRM Business Partner', 'SEO Service Business Partner']
    };
  } catch {
    return {
      title: 'Join Global Webify Franchisee – Web Development, Web Design, SEO & CRM Business Partner',
      description: 'Join Global Webify franchisee program for Web Development, Web Design, SEO & CRM solutions. Start your own digital business with expert support. Enquire now and grow faster!',
      keywords: ['Franchisee Opportunity in Web Development', 'Franchisee Opportunity in CRM', 'Global Webify Partnership', 'CRM Business Partner', 'SEO Service Business Partner']
    };
  }
}

export default async function PartnershipPage() {
  let settings = {};
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    settings = {
      partnershipPageTitle: settingsMap['partnershipPageTitle'],
      partnershipPageSlug: settingsMap['partnershipPageSlug'],
      partnershipHeroTitle: settingsMap['partnershipHeroTitle'],
      partnershipHeroDesc: settingsMap['partnershipHeroDesc'],
      partnershipHeading: settingsMap['partnershipHeading'],
      partnershipDesc: settingsMap['partnershipDesc'],
      partnershipPageImage: settingsMap['partnershipPageImage'],
      partnershipExpandHeading: settingsMap['partnershipExpandHeading'],
      partnershipExpandParagraph: settingsMap['partnershipExpandParagraph']
    };
  } catch (err) {
    console.error(err);
  }

  return <PartnershipClient settings={settings} />;
}
