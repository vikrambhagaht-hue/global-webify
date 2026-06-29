import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const websites = [
  { name: "yembroos", url: "https://yembroos.com/" },
  { name: "southindiacabs", url: "https://southindiacabs.info/" },
  { name: "rsrfoodstuff", url: "https://rsrfoodstuff.com/" }
];

const OUTPUT_DIR = './public/portfolio';

async function captureTrickySites() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Starting specialized screenshot capture for tricky websites...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
  });

  for (let i = 0; i < websites.length; i++) {
    const site = websites[i];
    console.log(`\nLoading ${site.name}...`);

    const page = await browser.newPage();
    try {
      // Standard desktop monitor size
      await page.setViewport({ width: 1440, height: 900 });
      
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 });

      console.log('Waiting 8 full seconds for heavy loaders and hero animations to finish...');
      await new Promise(r => setTimeout(r, 8000));

      console.log('Scrolling like a real human to trigger every single animation...');
      
      // Extremely smooth human-like scroll to trigger all IntersectionObservers
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100; // Small jumps
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            
            // Check if we reached the absolute bottom
            if (totalHeight >= document.body.scrollHeight || totalHeight >= 15000) { 
              clearInterval(timer);
              resolve();
            }
          }, 250); 
        });
      });

      console.log('Scrolling back up to the top slowly...');
      // Scroll back up to ensure fixed headers reset properly
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

      // ONLY fix overflow, DO NOT touch height (which broke the rsrfoodstuff hero section!)
      await page.evaluate(() => {
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflow = 'visible';
      });

      const outputPath = path.join(OUTPUT_DIR, `${site.name}.webp`);
      
      console.log('Taking full page screenshot...');
      await page.screenshot({ 
        path: outputPath, 
        type: 'webp',
        fullPage: true // Let Puppeteer handle the full page size natively to prevent stretching!
      });

      console.log(`✅ Success! Beautiful screenshot saved as ${site.name}.webp!`);
    } catch (error) {
      console.error(`❌ Failed to capture ${site.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n🎉 ALL TRICKY SITES CAPTURED PERFECTLY!');
}

captureTrickySites();
