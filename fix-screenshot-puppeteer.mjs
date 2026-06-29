import puppeteer from 'puppeteer';

(async () => {
  console.log("Starting local Puppeteer browser...");
  const browser = await puppeteer.launch({ 
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors', '--window-size=1200,800']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });

  console.log("Loading website...");
  await page.goto('https://healthpointranchi.com/', { waitUntil: 'networkidle2', timeout: 60000 });

  console.log("Waiting a few seconds for the website's loading screen to disappear...");
  await new Promise(r => setTimeout(r, 5000)); // Wait for any preloader to fade out

  // Force remove any overflow hidden or fixed heights that break screenshots
  await page.evaluate(() => {
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'visible';
    document.documentElement.style.height = 'auto';
  });

  console.log("Scrolling to the absolute bottom...");
  
  // Bruteforce scroll down the whole page
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 15000) { // Limit to 15k pixels
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });

  await new Promise(r => setTimeout(r, 2000));

  const bodyHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  });

  console.log(`Detected page length: ${bodyHeight} pixels long!`);

  await page.setViewport({ width: 1200, height: bodyHeight });

  console.log("Taking FULL page screenshot...");
  await page.screenshot({
    path: './public/portfolio/healthpointranchi.webp',
    type: 'webp'
  });

  await browser.close();
  console.log("✅ SUCCESS! Perfect screenshot saved!");
  console.log("⚠️ IMPORTANT: Next.js has cached the old image! You MUST do this to see the new one:");
  console.log("1. Press Ctrl + C in your terminal to stop the Next.js server.");
  console.log("2. Run: rm -rf .next (or manually delete the .next folder in VS Code)");
  console.log("3. Run: npm run dev");
})();
