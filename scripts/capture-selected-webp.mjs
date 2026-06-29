import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// EXACT names to overwrite your old images perfectly!
const websites = [
  { name: "rsrfoodstuff", url: "https://rsrfoodstuff.com/" },
  { name: "veltrivo", url: "https://veltrivo.com/" },
  { name: "yembroos", url: "https://yembroos.com/" },
  { name: "southindiacabs", url: "https://southindiacabs.info/" },
  { name: "jindaltel", url: "https://jindaltel.com/" },
  { name: "iiqsolutions", url: "https://iiqsolutions.com/" },
  { name: "reinadiamonds", url: "https://reinadiamonds.com/" },
  { name: "multithread", url: "https://www.multithread.co.in/" },
  { name: "healthilotus", url: "https://healthilotus.com/" },
  { name: "digitalmarkethics", url: "https://digitechmarkethics.com/" },
  { name: "indokosovo", url: "https://ikcoc.org/" },
  { name: "bellainitiis", url: "https://bellainitiis.com/" },
  { name: "saragroup", url: "https://saragroup.ind.in/" },
  { name: "pyoras", url: "https://pyoras.com/" },
  { name: "artival", url: "https://artival.in/" }
];

const OUTPUT_DIR = './public/portfolio';

async function captureSelected() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Starting extremely slow & careful screenshot capture to guarantee NO blank white images...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors', '--window-size=1440,900']
  });

  for (let i = 0; i < websites.length; i++) {
    const site = websites[i];
    console.log(`\n[${i + 1}/${websites.length}] Loading ${site.name} -> ${site.url}`);

    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 });

      console.log('Waiting 5 seconds for any loaders/pre-screens to disappear...');
      await new Promise(r => setTimeout(r, 5000));

      console.log('Destroying any popups or modals that might block the screen...');
      await page.evaluate(() => {
        // Brutal popup destroyer
        const popupClasses = [
          '.popup', '.modal', '.overlay', '.dialog', '.newsletter', '.cookie-banner',
          '[id*="popup"]', '[id*="modal"]', '[class*="popup"]', '[class*="modal"]',
          '[role="dialog"]', '.elementor-popup-modal', '.sgpb-popup-builder'
        ];
        
        popupClasses.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Remove crazy big overlay elements
        document.querySelectorAll('*').forEach(el => {
          const style = window.getComputedStyle(el);
          if ((style.position === 'fixed' || style.position === 'absolute') && 
              parseInt(style.zIndex, 10) > 900 && 
              el.offsetHeight > 200) {
            el.remove();
          }
        });
      });

      await page.evaluate(() => {
        document.body.style.overflow = 'visible';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.height = 'auto';
      });

      console.log('Scrolling extremely slowly to      // Very smooth human-like scroll down');
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 150;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            
            if (totalHeight >= document.body.scrollHeight || totalHeight >= 15000) { 
              clearInterval(timer);
              resolve();
            }
          }, 300);
        });
      });

      console.log('Scrolling back up to reset headers...');
      // Scroll back up to ensure sticky headers return to normal
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = document.body.scrollHeight;
          const distance = -200;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight <= 0) {
              window.scrollTo(0, 0);
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      await new Promise(r => setTimeout(r, 2000));

      // ONLY remove overflow so fullPage works, do NOT touch height!
      await page.evaluate(() => {
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflow = 'visible';
      });

      const outputPath = path.join(OUTPUT_DIR, `${site.name}.webp`);
      await page.screenshot({ 
        path: outputPath, 
        type: 'webp',
        fullPage: true // Native fullPage prevents stretched hero sections!
      });

      console.log(`✅ Success! Beautiful, fully-loaded screenshot saved as ${site.name}.webp!`);
    } catch (error) {
      console.error(`❌ Failed to capture ${site.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n🎉 ALL SELECTED SITES CAPTURED PERFECTLY!');
}

captureSelected();
