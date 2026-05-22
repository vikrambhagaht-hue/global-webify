'use server';

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'homepageFaqs.json');
const heroTextsPath = path.join(process.cwd(), 'src', 'data', 'homepageHeroTexts.json');

const defaultHeroTexts = [
  "वेबसाइट जो ब्रांड भी बनाए, बिज़नेस भी बढ़ाए।",
  "Websites that build brands, and grow businesses."
];

export async function getHomepageFaqs() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Failed to read homepage FAQs", error);
    return [];
  }
}

export async function saveHomepageFaqs(faqs: { question: string, answer: string }[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(faqs, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage FAQs", error);
    return { success: false, error: error.message };
  }
}

export async function getHeroTexts() {
  try {
    if (fs.existsSync(heroTextsPath)) {
      const data = fs.readFileSync(heroTextsPath, 'utf8');
      return JSON.parse(data);
    }
    return defaultHeroTexts;
  } catch (error) {
    console.error("Failed to read homepage hero texts", error);
    return defaultHeroTexts;
  }
}

export async function saveHeroTexts(texts: string[]) {
  try {
    fs.writeFileSync(heroTextsPath, JSON.stringify(texts, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage hero texts", error);
    return { success: false, error: error.message };
  }
}

const aboutSeoPath = path.join(process.cwd(), 'src', 'data', 'homepageAboutSeo.json');
const cityHeroSettingsPath = path.join(process.cwd(), 'src', 'data', 'cityHeroSettings.json');

import { CITIES } from './cities';

const defaultAboutSeo = {
  title: "Web Design & Web Development <span class=\"text-[#1a8b4c]\">Services in India</span>",
  subtitle: "Professional Web Design Solutions for Global Brands",
  content: "<p>Need to lift your online presence? Yes. We at <strong>Global Webify</strong> are your trusted partner to boost your digital growth within the shortest time possible. As a prominent Web Design and Web Development Company in India, we are here to empower businesses worldwide with pioneering, user-focused, and SEO-optimized web solutions. Our team brings global excellence with local proficiency, serving clients across India, UAE, Canada, Australia, USA, and UK.</p><p>Based in India, we're not simply a top Web Design Company, but also a preferred Web Development partner for startups and enterprises alike. Our team is dedicated to delivering visually stunning, high-performance websites focused on driving more engagement and conversions. Our expert web developers, web designers, and digital strategists work together to give you the best tailor-made websites that meet the goals of every brand.</p><p>Starting from E-commerce to Real Estate, Travel & Tourism to Healthcare, Manufacturing to Fashion, we serve a broad spectrum of industries with accuracy and creativity. Whether you're a startup searching for a digital kickstart or an enterprise focusing on digital transformation, as the best Digital Marketing Agency in India, we have the right solution for you.</p><p>But that's not all - <strong>Global Webify</strong> has even driven success as a leading SEO Company and a full-service Digital Marketing Agency. Our data-backed policies in SEO, social media marketing, PPC, email marketing, and content marketing confirm that your brand not only gets noticed but succeeds in the digital space.</p><p>At Global Webify, we don't simply develop or design websites - we build highly presentable brands online. We focus on creating digital experiences that resonate with your audience and turn visitors into loyal customers.</p><p>So, are you ready to unlock your digital potential? Partner with one of the most reliable and trusted web design and development companies in India - Global Webify. Contact our team today and set your goals to meet new digital heights!</p>"
};

export async function getAboutSeo(cityKey: string = 'default') {
  try {
    if (fs.existsSync(aboutSeoPath)) {
      const data = fs.readFileSync(aboutSeoPath, 'utf8');
      let parsed = JSON.parse(data);
      
      // Migrate from paragraphs: string[] to content: string
      if (parsed && Array.isArray(parsed.paragraphs) && !parsed.content) {
        parsed.content = parsed.paragraphs.map((p: string) => `<p>${p}</p>`).join('');
        delete parsed.paragraphs;
      }
      
      // If old format (flat object) and doesn't have 'default' key, wrap it
      if (parsed && parsed.title && !parsed.default) {
        parsed = {
          default: {
            title: parsed.title,
            subtitle: parsed.subtitle || '',
            content: parsed.content || ''
          }
        };
        fs.writeFileSync(aboutSeoPath, JSON.stringify(parsed, null, 2), 'utf8');
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
    let allData: any = {};
    if (fs.existsSync(aboutSeoPath)) {
      const data = fs.readFileSync(aboutSeoPath, 'utf8');
      allData = JSON.parse(data);
      
      // Migrate root format if present
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
    fs.writeFileSync(aboutSeoPath, JSON.stringify(allData, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage AboutSEO settings", error);
    return { success: false, error: error.message };
  }
}

export async function getCityHeroSettings(cityKey: string) {
  try {
    const city = CITIES.find(c => c.key === cityKey);
    const cityName = city ? city.name : cityKey;
    
    const defaultSettings = {
      title: `Your Website Isn’t Bringing Leads—and It’s Costing You Business in <span class="text-[#1a8b4c]">${cityName}</span>`,
      description: `We combine result-oriented Digital Marketing, modern Web Design, and branding strategies to help <span class="text-[#1a8b4c] font-bold">${cityName}</span> businesses stand out online and grow faster without wasted ad spend.`
    };

    if (fs.existsSync(cityHeroSettingsPath)) {
      const data = fs.readFileSync(cityHeroSettingsPath, 'utf8');
      const parsed = JSON.parse(data);
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
    let allData: any = {};
    if (fs.existsSync(cityHeroSettingsPath)) {
      const fileContent = fs.readFileSync(cityHeroSettingsPath, 'utf8');
      allData = JSON.parse(fileContent);
    }
    allData[cityKey] = data;
    fs.writeFileSync(cityHeroSettingsPath, JSON.stringify(allData, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save city hero settings", error);
    return { success: false, error: error.message };
  }
}

const homepageHeroDescPath = path.join(process.cwd(), 'src', 'data', 'homepageHeroDesc.json');
const defaultHeroDesc = "We build AI-integrated websites that generate leads and scale your growth automatically.";

export async function getHomepageHeroDesc() {
  try {
    if (fs.existsSync(homepageHeroDescPath)) {
      const data = fs.readFileSync(homepageHeroDescPath, 'utf8');
      const parsed = JSON.parse(data);
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
    const data = { description };
    fs.writeFileSync(homepageHeroDescPath, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage hero description", error);
    return { success: false, error: error.message };
  }
}


