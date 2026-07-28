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
  let franchisees: any[] = [];
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const cleanPara = "Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes. Grow your business with the support of an experienced technology partner and achieve your goals with confidence.\n\nGlobal Webify is a trusted web development and SEO company in India, helping businesses build a strong online presence through innovative and result-oriented solutions. Our franchise program allows digital agencies and freelancers to offer professional website design, ecommerce website development, SEO services, and CRM solutions to their clients under a reliable technology partnership.\n\nAs a Global Webify franchise partner, you get access to expert development support, advanced tools, technical assistance, and a skilled team that handles project execution while you focus on client acquisition and business growth.\n\nOur experienced team delivers modern, responsive, and conversion-focused websites along with powerful CRM solutions that help businesses improve customer management, automate processes, and generate better results. With complete backend support and guidance, you can expand your service offerings without investing heavily in technical infrastructure.";
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

    franchisees = await db.franchiseeOnboarding.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        photo: true,
        name: true,
        companyName: true,
        address: true,
        experience: true,
        createdAt: true,
      }
    });
  } catch (err) {
    console.error(err);
  }

  return <PartnershipClient settings={settings} franchisees={franchisees} />;
}
