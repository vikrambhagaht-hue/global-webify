const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function scanAndOptimize(dir, state) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanAndOptimize(fullPath, state);
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      const stats = fs.statSync(fullPath);
      
      // Optimize if larger than 200KB
      if (stats.size > 200 * 1024) {
        const relativeName = path.relative(publicDir, fullPath);
        console.log(`Optimizing ${relativeName} (${(stats.size / 1024).toFixed(2)} KB)...`);
        const tempPath = fullPath + '.tmp.png';
        
        try {
          await sharp(fullPath)
            .png({ quality: 80, compressionLevel: 9, effort: 10 })
            .toFile(tempPath);
            
          const newStats = fs.statSync(tempPath);
          const saved = stats.size - newStats.size;
          
          if (saved > 0) {
            state.savedBytes += saved;
            fs.renameSync(tempPath, fullPath);
            console.log(`✅ Saved ${(saved / 1024).toFixed(2)} KB on ${relativeName}`);
          } else {
            fs.unlinkSync(tempPath);
            console.log(`⏭️ No savings for ${relativeName}, skipping.`);
          }
        } catch (e) {
          console.error(`❌ Failed to optimize ${relativeName}:`, e);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

async function optimizeImages() {
  console.log('Scanning public directory recursively for heavy PNG files...');
  const state = { savedBytes: 0 };
  await scanAndOptimize(publicDir, state);
  console.log(`\n🎉 Total savings: ${(state.savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
