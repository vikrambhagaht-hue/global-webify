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

    const cleanPara = "Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes.\n\nAs a Global Webify franchise partner, you get complete access to our expert development support, advanced tools, and technical assistance. We deliver modern, conversion-focused websites and powerful CRM solutions while handling full project execution behind the scenes—allowing you to focus entirely on client acquisition, brand growth, and unlimited earning potential.";
    let expandPara = settingsMap['partnershipExpandParagraph'] || cleanPara;
    if (expandPara.includes('3. Strategic Co-Development:')) {
      expandPara = cleanPara;
    }

    settings = {
      partnershipPageTitle: settingsMap['partnershipPageTitle'],
      partnershipPageSlug: settingsMap['partnershipPageSlug'],
      partnershipHeroTitle: settingsMap['partnershipHeroTitle'],
      partnershipHeroDesc: settingsMap['partnershipHeroDesc'],
      partnershipHeading: settingsMap['partnershipHeading'],
      partnershipDesc: settingsMap['partnershipDesc'],
      partnershipPageImage: settingsMap['partnershipPageImage'],
      partnershipExpandHeading: settingsMap['partnershipExpandHeading'],
      partnershipExpandParagraph: expandPara
    };
  } catch (err) {
    console.error(err);
  }

  return <PartnershipClient settings={settings} />;
}
