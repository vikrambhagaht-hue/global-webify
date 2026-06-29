import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const websites = [
  { name: "fortemigration", url: "https://www.fortemigration.com.au/" },
  { name: "artival", url: "https://artival.in/" },
  { name: "pyoras", url: "https://pyoras.com/" },
  { name: "rsrfoodstuff", url: "https://rsrfoodstuff.com/" },
  { name: "futurenxt", url: "https://futurenxt.io/index.php" },
  { name: "veltrivo", url: "https://veltrivo.com/" },
  { name: "ethnoenvironjournal", url: "https://ethnoenvironjournal.com/public_html/index" },
  { name: "gangotristeels", url: "https://gangotristeels.com/" },
  { name: "saragroup", url: "https://saragroup.ind.in/" },
  { name: "tarotcardreader", url: "https://tarotcardreaderhealerauthenticquinsoumya.com/" },
  { name: "saltandsea", url: "https://saltandsea.co.in/" },
  { name: "artsandprojects", url: "https://artsandprojects.in/" },
  { name: "jindaltel", url: "https://jindaltel.com/" },
  { name: "dealsonprofit", url: "https://dealsonprofit.com/" },
  { name: "yembroos", url: "https://yembroos.com/" },
  { name: "southindiacabs", url: "https://southindiacabs.info/" },
  { name: "bellainitiis", url: "https://bellainitiis.com/" },
  { name: "amnutsandspices", url: "https://amnutsandspices.in/" },
  { name: "goldpecash", url: "https://goldpecash.com/" },
  { name: "iiqsolutions", url: "https://iiqsolutions.com/" },
  { name: "reinadiamonds", url: "https://reinadiamonds.com/" },
  { name: "healthilotus", url: "https://healthilotus.com/" },
  { name: "signompliance", url: "https://signompliance.com/" },
  { name: "multithread", url: "https://www.multithread.co.in/" },
  { name: "omnioverseas", url: "https://omnioverseas.com/" },
  { name: "varanasimai", url: "https://varanasimai.com/" },
  { name: "manbhavansevasamiti", url: "https://manbhavansevasamiti.in/" },
  { name: "digitalmarkethics", url: "https://digitechmarkethics.com/" },
  { name: "indokosovo", url: "https://ikcoc.org/" },
  { name: "orbiteyes", url: "https://orbiteyes.in/" },
  { name: "drkumarvishal", url: "https://drkumarvishal.com/" },
  { name: "healthpointranchi", url: "https://healthpointranchi.com/" },
  { name: "rpshospital", url: "https://rpshospital.com/" },
  { name: "acs", url: "https://acs-jn.com/" },
  { name: "kaveri", url: "https://kaveri-nextjs.vercel.app/" },
  { name: "kelvinecoproducts", url: "https://kelvinecoproducts.com/" },
  { name: "elevatehrservices", url: "https://elevate-hrservices.com/" },
  { name: "documantraa", url: "https://documantraa.in/crm/login.php" }
];

const OUTPUT_DIR = './public/portfolio';

async function captureAll() {
  // 1. Create or Clean Output Directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  } else {
    // Delete all old files in the directory as requested by the user
    console.log("Cleaning up old images from public/portfolio...");
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
    console.log("Old images deleted successfully!");
  }

  console.log('Starting massive screenshot operation...');
  
  // 2. Launch Puppeteer with Strict SSL disabled
  const browser = await puppeteer.launch({
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
  });

  for (let i = 0; i < websites.length; i++) {
    const site = websites[i];
    console.log(`\n[${i + 1}/${websites.length}] Processing ${site.name} (${site.url})`);

    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1440, height: 900 });

      // Go to site and wait until network is mostly idle
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Wait a few seconds for preloaders/spinners to fade out
      await new Promise(r => setTimeout(r, 4000));

      // Force CSS fixes to avoid cut-off pages
      await page.evaluate(() => {
        document.body.style.overflow = 'visible';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.height = 'auto';
      });

      // Bruteforce Scroll down the page to trigger all lazy-loaded images (Fixes blank white sections)
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= 15000) { // Safety limit
              clearInterval(timer);
              resolve();
            }
          }, 100); // Fast scrolling
        });
      });

      // Wait 2 seconds for the very bottom images to render
      await new Promise(r => setTimeout(r, 2000));

      // Calculate total exact height
      const bodyHeight = await page.evaluate(() => {
        return Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
      });

      // Expand browser to exact height
      await page.setViewport({ width: 1440, height: bodyHeight });

      // Take WEBP Screenshot
      const outputPath = path.join(OUTPUT_DIR, `${site.name}.webp`);
      await page.screenshot({ 
        path: outputPath, 
        type: 'webp'
      });

      console.log(`✓ Successfully captured full page -> ${outputPath}`);
    } catch (error) {
      console.error(`✗ Failed to capture ${site.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n🎉 ALL SCREENSHOTS COMPLETED!');
}

captureAll();
