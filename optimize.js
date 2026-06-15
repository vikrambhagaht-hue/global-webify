const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function optimizeImages() {
  console.log('Scanning public directory for heavy PNG files...');
  const files = fs.readdirSync(publicDir);
  
  let savedBytes = 0;

  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);
      
      // Optimize if larger than 200KB
      if (stats.size > 200 * 1024) {
        console.log(`Optimizing ${file} (${(stats.size / 1024).toFixed(2)} KB)...`);
        const tempPath = filePath + '.tmp.png';
        
        try {
          await sharp(filePath)
            .png({ quality: 80, compressionLevel: 9, effort: 10 })
            .toFile(tempPath);
            
          const newStats = fs.statSync(tempPath);
          const saved = stats.size - newStats.size;
          
          if (saved > 0) {
            savedBytes += saved;
            fs.renameSync(tempPath, filePath);
            console.log(`✅ Saved ${(saved / 1024).toFixed(2)} KB on ${file}`);
          } else {
            fs.unlinkSync(tempPath);
            console.log(`⏭️ No savings for ${file}, skipping.`);
          }
        } catch (e) {
          console.error(`❌ Failed to optimize ${file}:`, e);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
  
  console.log(`\n🎉 Total savings: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
