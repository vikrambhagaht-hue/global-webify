import fs from 'fs';
import https from 'https';

console.log("Starting cloud screenshot process...");
console.log("Fetching the FULL page this time...");

// Removed the "crop" part so it takes the full entire page!
const url = "https://image.thum.io/get/width/1200/noanimate/https://healthpointranchi.com/";
const filePath = "./public/portfolio/healthpointranchi.webp";

const fetchImage = (targetUrl) => {
  https.get(targetUrl, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
      console.log("Redirecting...");
      fetchImage(res.headers.location);
      return;
    }

    if (res.statusCode !== 200) {
      console.error("Failed to fetch image. Status Code:", res.statusCode);
      return;
    }

    const file = fs.createWriteStream(filePath);
    res.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log("✅ SUCCESS! The FULL screenshot has been saved to: " + filePath);
    });
  }).on('error', (err) => {
    console.error("❌ Error fetching image:", err.message);
  });
};

fetchImage(url);
