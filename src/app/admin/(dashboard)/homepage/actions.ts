'use server';

import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { CITIES } from './cities';
import { revalidatePath } from 'next/cache';

const defaultHeroTexts = [
  "वेबसाइट जो ब्रांड भी बनाए, बिज़नेस भी बढ़ाए।",
  "Websites that build brands, and grow businesses."
];

// 1. FAQs
export async function getHomepageFaqs() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageFaqs' } });
    if (setting) return JSON.parse(setting.value);
    return [];
  } catch (error) {
    console.error("Failed to read homepage FAQs", error);
    return [];
  }
}

export async function saveHomepageFaqs(faqs: { question: string, answer: string }[]) {
  try {
    await requireAdmin();
    const value = JSON.stringify(faqs);
    await db.siteSetting.upsert({
      where: { key: 'homepageFaqs' },
      update: { value },
      create: { key: 'homepageFaqs', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage FAQs", error);
    return { success: false, error: error.message };
  }
}

// 2. Hero Texts
export async function getHeroTexts() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageHeroTexts' } });
    if (setting) return JSON.parse(setting.value);
    return defaultHeroTexts;
  } catch (error) {
    console.error("Failed to read homepage hero texts", error);
    return defaultHeroTexts;
  }
}

export async function saveHeroTexts(texts: string[]) {
  try {
    await requireAdmin();
    const value = JSON.stringify(texts);
    await db.siteSetting.upsert({
      where: { key: 'homepageHeroTexts' },
      update: { value },
      create: { key: 'homepageHeroTexts', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage hero texts", error);
    return { success: false, error: error.message };
  }
}

// 3. About SEO
const defaultAboutSeo = {
  title: "Web Design & Web Development <span class=\"text-[#1a8b4c]\">Services in India</span>",
  subtitle: "Professional Web Design Solutions for Global Brands",
  content: "<p>Need to lift your online presence? Yes. We at <strong>Global Webify</strong> are your trusted partner to boost your digital growth within the shortest time possible. As a prominent Web Design and Web Development Company in India, we are here to empower businesses worldwide with pioneering, user-focused, and SEO-optimized web solutions. Our team brings global excellence with local proficiency, serving clients across India, UAE, Canada, Australia, USA, and UK.</p><p>Based in India, we're not simply a top Web Design Company, but also a preferred Web Development partner for startups and enterprises alike. Our team is dedicated to delivering visually stunning, high-performance websites focused on driving more engagement and conversions. Our expert web developers, web designers, and digital strategists work together to give you the best tailor-made websites that meet the goals of every brand.</p><p>Starting from E-commerce to Real Estate, Travel & Tourism to Healthcare, Manufacturing to Fashion, we serve a broad spectrum of industries with accuracy and creativity. Whether you're a startup searching for a digital kickstart or an enterprise focusing on digital transformation, as the best Digital Marketing Agency in India, we have the right solution for you.</p><p>But that's not all - <strong>Global Webify</strong> has even driven success as a leading SEO Company and a full-service Digital Marketing Agency. Our data-backed policies in SEO, social media marketing, PPC, email marketing, and content marketing confirm that your brand not only gets noticed but succeeds in the digital space.</p><p>At Global Webify, we don't simply develop or design websites - we build highly presentable brands online. We focus on creating digital experiences that resonate with your audience and turn visitors into loyal customers.</p><p>So, are you ready to unlock your digital potential? Partner with one of the most reliable and trusted web design and development companies in India - Global Webify. Contact our team today and set your goals to meet new digital heights!</p>"
};

export async function getAboutSeo(cityKey: string = 'default') {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageAboutSeo' } });
    if (setting) {
      let parsed = JSON.parse(setting.value);
      if (parsed && Array.isArray(parsed.paragraphs) && !parsed.content) {
        parsed.content = parsed.paragraphs.map((p: string) => `<p>${p}</p>`).join('');
        delete parsed.paragraphs;
      }
      if (parsed && parsed.title && !parsed.default) {
        parsed = {
          default: {
            title: parsed.title,
            subtitle: parsed.subtitle || '',
            content: parsed.content || ''
          }
        };
      }
      return parsed[cityKey] || null;
    }
    return cityKey === 'default' ? defaultAboutSeo : null;
  } catch (error) {
    console.error("Failed to read homepage AboutSEO settings", error);
    return cityKey === 'default' ? defaultAboutSeo : null;
  }
}

export async function saveAboutSeo(cityKey: string, aboutData: { title: string; subtitle: string; content: string }) {
  try {
    await requireAdmin();
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageAboutSeo' } });
    let allData: any = {};
    if (setting) {
      allData = JSON.parse(setting.value);
      if (allData && allData.title && !allData.default) {
        allData = {
          default: {
            title: allData.title,
            subtitle: allData.subtitle || '',
            content: allData.content || ''
          }
        };
      }
    }
    
    allData[cityKey] = aboutData;
    const value = JSON.stringify(allData);
    await db.siteSetting.upsert({
      where: { key: 'homepageAboutSeo' },
      update: { value },
      create: { key: 'homepageAboutSeo', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage AboutSEO settings", error);
    return { success: false, error: error.message };
  }
}

// 4. City Hero Settings
export async function getCityHeroSettings(cityKey: string) {
  try {
    const city = CITIES.find(c => c.key === cityKey);
    const cityName = city ? city.name : cityKey;
    
    const defaultSettings = {
      title: `Your Website Isn’t Bringing Leads—and It’s Costing You Business in <span class="text-[#1a8b4c]">${cityName}</span>`,
      description: `We combine result-oriented Digital Marketing, modern Web Design, and branding strategies to help <span class="text-[#1a8b4c] font-bold">${cityName}</span> businesses stand out online and grow faster without wasted ad spend.`
    };

    const setting = await db.siteSetting.findUnique({ where: { key: 'cityHeroSettings' } });
    if (setting) {
      const parsed = JSON.parse(setting.value);
      return parsed[cityKey] || defaultSettings;
    }
    return defaultSettings;
  } catch (error) {
    console.error("Failed to read city hero settings", error);
    return { title: '', description: '' };
  }
}

export async function saveCityHeroSettings(cityKey: string, data: { title: string; description: string }) {
  try {
    await requireAdmin();
    let allData: any = {};
    const setting = await db.siteSetting.findUnique({ where: { key: 'cityHeroSettings' } });
    if (setting) {
      allData = JSON.parse(setting.value);
    }
    allData[cityKey] = data;
    const value = JSON.stringify(allData);
    
    await db.siteSetting.upsert({
      where: { key: 'cityHeroSettings' },
      update: { value },
      create: { key: 'cityHeroSettings', value }
    });
    revalidatePath(`/${cityKey}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save city hero settings", error);
    return { success: false, error: error.message };
  }
}

// 5. Homepage Hero Desc
const defaultHeroDesc = "We build AI-integrated websites that generate leads and scale your growth automatically.";

export async function getHomepageHeroDesc() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageHeroDesc' } });
    if (setting) {
      const parsed = JSON.parse(setting.value);
      return parsed.description || defaultHeroDesc;
    }
    return defaultHeroDesc;
  } catch (error) {
    console.error("Failed to read homepage hero description", error);
    return defaultHeroDesc;
  }
}

export async function saveHomepageHeroDesc(description: string) {
  try {
    await requireAdmin();
    const data = { description };
    const value = JSON.stringify(data);
    await db.siteSetting.upsert({
      where: { key: 'homepageHeroDesc' },
      update: { value },
      create: { key: 'homepageHeroDesc', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage hero description", error);
    return { success: false, error: error.message };
  }
}

// 6. SEO Settings
export async function getHomepageSeo() {
  try {
    const defaultSeo = {
      title: "GlobalWebify | Web Development & Digital Marketing Agency",
      description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
      keywords: "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWebify"
    };
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageSeo' } });
    if (setting) {
      return JSON.parse(setting.value);
    }
    return defaultSeo;
  } catch (error) {
    console.error("Failed to read homepage SEO", error);
    return { title: '', description: '', keywords: '' };
  }
}

export async function saveHomepageSeo(data: { title: string; description: string; keywords: string }) {
  try {
    await requireAdmin();
    const value = JSON.stringify(data);
    await db.siteSetting.upsert({
      where: { key: 'homepageSeo' },
      update: { value },
      create: { key: 'homepageSeo', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage SEO", error);
    return { success: false, error: error.message };
  }
}

export async function getCitySeo(cityKey: string) {
  try {
    const city = CITIES.find(c => c.key === cityKey);
    const cityName = city ? city.name : cityKey;

    const defaultCityKeywords = [
      `Web Development Company in ${cityName}`,
      `Website Development Services in ${cityName}`,
      `Web Development Services in ${cityName}`,
      `Web Development Agency in ${cityName}`,
      `Software Development Company in ${cityName}`,
      `Professional Web Developers in ${cityName}`,
      `CMS Website Development in ${cityName}`,
      `WordPress Development Services in ${cityName}`,
      `Corporate Website Development in ${cityName}`,
      `SEO Friendly Website Development in ${cityName}`
    ].join(', ');

    const defaultSeo = {
      title: `Best Web Development & Digital Marketing Services in ${cityName} | GlobalWebify`,
      description: `Explore GlobalWebify's professional web development, SEO, digital marketing, and branding services in ${cityName}. Custom solutions tailored to your local market.`,
      keywords: defaultCityKeywords
    };
    
    // Completely ignore the database for City SEO because the UI for it has been removed by the user.
    return defaultSeo;
  } catch (error) {
    console.error("Failed to read city SEO", error);
    return { title: '', description: '', keywords: '' };
  }
}

export async function saveCitySeo(cityKey: string, data: { title: string; description: string; keywords: string }) {
  try {
    await requireAdmin();
    let allData: any = {};
    const setting = await db.siteSetting.findUnique({ where: { key: 'citySeoSettings' } });
    if (setting) {
      allData = JSON.parse(setting.value);
    }
    allData[cityKey] = data;
    const value = JSON.stringify(allData);
    await db.siteSetting.upsert({
      where: { key: 'citySeoSettings' },
      update: { value },
      create: { key: 'citySeoSettings', value }
    });
    revalidatePath(`/${cityKey}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save city SEO", error);
    return { success: false, error: error.message };
  }
}

// 7. Homepage About Card (Growth Agency)
const defaultAboutCard = {
  title: "Data-Driven <br /> Growth Agency",
  content: "We offer AI-powered digital marketing services to help businesses appear in Google AI, ChatGPT, and Perplexity recommendations.\n\nOur strategies are focused on sustainable, ethical, and conversion-oriented growth for brands worldwide.",
  buttonText: "Read More"
};

export async function getHomepageAboutCard() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageAboutCard' } });
    if (setting) {
      const parsed = JSON.parse(setting.value);
      return { ...defaultAboutCard, ...parsed };
    }
    return defaultAboutCard;
  } catch (error) {
    console.error("Failed to read homepage About Card settings", error);
    return defaultAboutCard;
  }
}

export async function saveHomepageAboutCard(data: { title: string; content: string; buttonText: string }) {
  try {
    await requireAdmin();
    const value = JSON.stringify(data);
    await db.siteSetting.upsert({
      where: { key: 'homepageAboutCard' },
      update: { value },
      create: { key: 'homepageAboutCard', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage About Card settings", error);
    return { success: false, error: error.message };
  }
}

// 8. Section Headers
const defaultSectionHeaders = {
  services: { title: "Our Premium Services", description: "Elevate your business with our top-tier digital solutions." },
  portfolio: { title: "Our Digital Masterpieces", description: "A showcase of our best work and client successes." },
  techStack: { title: "Our Technology Arsenal", description: "We use the latest technology stack to build robust and scalable solutions." },
  latestBlog: { title: "Digital Insights & Strategies", description: "Stay ahead of the curve with our latest articles and news." },
  trust: { title: "Why Leading Brands Trust Us", description: "We deliver results that matter to your bottom line." },
  faq: { title: "Frequently Asked Questions", description: "Everything you need to know about our services." },
  results: { title: "Results That Speak Louder Than Words", description: "Explore our milestones, client success reviews, and AI-powered performance statistics that define our journey." }
};

export async function getSectionHeaders() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'homepageSectionHeaders' } });
    if (setting) return { ...defaultSectionHeaders, ...JSON.parse(setting.value) };
    return defaultSectionHeaders;
  } catch (error) {
    console.error("Failed to read homepage section headers", error);
    return defaultSectionHeaders;
  }
}

export async function saveSectionHeaders(headers: any) {
  try {
    await requireAdmin();
    const value = JSON.stringify(headers);
    await db.siteSetting.upsert({
      where: { key: 'homepageSectionHeaders' },
      update: { value },
      create: { key: 'homepageSectionHeaders', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage section headers", error);
    return { success: false, error: error.message };
  }
}

export async function getPartnershipSettings() {
  try {
    const allSettings = await db.siteSetting.findMany({
      where: {
        key: {
          in: [
            'partnershipPageSlug',
            'partnershipPageTitle',
            'partnershipHeroTitle',
            'partnershipHeroDesc',
            'partnershipHeading',
            'partnershipDesc',
            'partnershipPageImage',
            'partnershipExpandHeading',
            'partnershipExpandParagraph'
          ]
        }
      }
    });

    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const cleanPara = 'Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes.\n\nAs a Global Webify franchise partner, you get complete access to our expert development support, advanced tools, and technical assistance. We deliver modern, conversion-focused websites and powerful CRM solutions while handling full project execution behind the scenes—allowing you to focus entirely on client acquisition, brand growth, and unlimited earning potential.';
    let expandPara = settingsMap['partnershipExpandParagraph'] || cleanPara;
    if (expandPara.includes('3. Strategic Co-Development:')) {
      expandPara = cleanPara;
    }

    return {
      partnershipPageSlug: settingsMap['partnershipPageSlug'] || 'partnership',
      partnershipPageTitle: settingsMap['partnershipPageTitle'] || 'Partner Network | GlobalWeblify',
      partnershipHeroTitle: settingsMap['partnershipHeroTitle'] || 'Partner With GlobalWeblify',
      partnershipHeroDesc: settingsMap['partnershipHeroDesc'] || 'Expand your service catalog, increase your revenue, and deliver state-of-the-art technological experiences to your clients.',
      partnershipHeading: settingsMap['partnershipHeading'] || 'Web Design Franchise of Global Webify in your City',
      partnershipDesc: settingsMap['partnershipDesc'] || 'Whether you run an agency looking to outsource development, a consultant recommending leading web platforms, or an integration provider, we construct synergistic structures that deliver results.',
      partnershipPageImage: settingsMap['partnershipPageImage'] || '/partnership/Partner1.jpg',
      partnershipExpandHeading: settingsMap['partnershipExpandHeading'] || 'Website Designing, Ecommerce Website Development, Digital Marketing, SEO - Franchise',
      partnershipExpandParagraph: expandPara
    };
  } catch (error) {
    console.error("Failed to load partnership settings", error);
    return {
      partnershipPageSlug: 'partnership',
      partnershipPageTitle: 'Partner Network | GlobalWeblify',
      partnershipHeroTitle: 'Partner With GlobalWeblify',
      partnershipHeroDesc: 'Expand your service catalog, increase your revenue, and deliver state-of-the-art technological experiences to your clients.',
      partnershipHeading: 'Web Design Franchise of Global Webify in your City',
      partnershipDesc: 'Whether you run an agency looking to outsource development, a consultant recommending leading web platforms, or an integration provider, we construct synergistic structures that deliver results.',
      partnershipPageImage: '/partnership/Partner1.jpg',
      partnershipExpandHeading: 'Website Designing, Ecommerce Website Development, Digital Marketing, SEO - Franchise',
      partnershipExpandParagraph: 'Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes.\n\nAs a Global Webify franchise partner, you get complete access to our expert development support, advanced tools, and technical assistance. We deliver modern, conversion-focused websites and powerful CRM solutions while handling full project execution behind the scenes—allowing you to focus entirely on client acquisition, brand growth, and unlimited earning potential.'
    };
  }
}

export async function savePartnershipSettings(data: any) {
  try {
    await requireAdmin();
    const updatableKeys = [
      'partnershipPageSlug',
      'partnershipPageTitle',
      'partnershipHeroTitle',
      'partnershipHeroDesc',
      'partnershipHeading',
      'partnershipDesc',
      'partnershipPageImage',
      'partnershipExpandHeading',
      'partnershipExpandParagraph'
    ];

    for (const key of updatableKeys) {
      if (data[key] !== undefined) {
        await db.siteSetting.upsert({
          where: { key },
          update: { value: String(data[key]) },
          create: { key, value: String(data[key]) }
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/[slug]');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save partnership settings", error);
    return { success: false, error: error.message };
  }
}

export interface GlobalContactInfoData {
  phone: string;
  phone2?: string;
  usOfficePhone?: string;
  usOfficeAddress?: string;
  dubaiOfficePhone?: string;
  dubaiOfficeAddress?: string;
  whatsapp: string;
  email: string;
  address: string;
  address2?: string;
  mapQuery?: string;
  mapScreenshotUrl?: string;
  socials?: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

export async function getGlobalContactInfo(): Promise<GlobalContactInfoData> {
  const defaultInfo: GlobalContactInfoData = {
    phone: '+91 75639 01100',
    phone2: '1800-890-5489',
    usOfficePhone: '+1 9175908135',
    usOfficeAddress: '473 Mundet Place, Ste US\nHillside, NJ 07205',
    dubaiOfficePhone: '+97 150 846 1253',
    dubaiOfficeAddress: 'Office 18, 2nd Floor\nAspin Commercial Tower',
    whatsapp: '917563901100',
    email: 'help@globalwebify.com',
    address: '2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002',
    address2: '36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India.',
    mapQuery: 'https://www.google.com/maps/place/Global+Webify/@23.3495578,85.3086946,17z/data=!3m1!5s0x39f4e0528e2c8fa7:0xf0b8c1d5d5dbe41a!4m6!3m5!1s0x39f4e195a816671d:0xa9ebf12893abb828!8m2!3d23.3496601!4d85.3104862!16s%2Fg%2F11wbvkw_tm?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D',
    socials: {
      facebook: 'https://www.facebook.com/global.webify',
      twitter: 'https://x.com/globalwebify',
      linkedin: 'https://www.linkedin.com/company/global-webify/',
      instagram: 'https://www.instagram.com/global.webify/',
      youtube: 'https://www.youtube.com/@globalwebify'
    }
  };

  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'globalContactInfo' } });
    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultInfo,
        ...parsed,
        socials: {
          ...defaultInfo.socials,
          ...(parsed.socials || {})
        }
      };
    }
  } catch (error) {
    console.error("Failed to fetch globalContactInfo", error);
  }
  return defaultInfo;
}

export async function saveGlobalContactInfo(data: GlobalContactInfoData) {
  await requireAdmin();
  try {
    const value = JSON.stringify(data);
    await db.siteSetting.upsert({
      where: { key: 'globalContactInfo' },
      update: { value },
      create: { key: 'globalContactInfo', value }
    });
    revalidatePath('/', 'layout');
    revalidatePath('/[slug]', 'layout');
    revalidatePath('/contact');
    revalidatePath('/book');
    revalidatePath('/admin/(dashboard)/homepage/contact-info');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save global contact info", error);
    return { success: false, error: error.message };
  }
}
