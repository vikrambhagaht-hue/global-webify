const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const portfolioDir = path.join(__dirname, 'public', 'portfolio');

async function optimizePortfolio() {
  console.log('🔍 Scanning public/portfolio for heavy images...\n');
  
  const entries = fs.readdirSync(portfolioDir, { withFileTypes: true });
  let totalSaved = 0;
  let optimizedCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

    const fullPath = path.join(portfolioDir, entry.name);
    const stats = fs.statSync(fullPath);

    // Only optimize files larger than 150KB
    if (stats.size <= 150 * 1024) {
      continue;
    }

    const sizeBefore = stats.size;
    const baseName = path.basename(entry.name, ext);
    const outputPath = path.join(portfolioDir, baseName + '.optimized.webp');

    try {
      await sharp(fullPath)
        .resize({ width: 1200, withoutEnlargement: true }) // max 1200px wide
        .webp({ quality: 75, effort: 6 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const saved = sizeBefore - newStats.size;

      if (saved > 0 && newStats.size < sizeBefore) {
        // Delete original and rename optimized
        fs.unlinkSync(fullPath);
        const finalPath = path.join(portfolioDir, baseName + '.webp');
        fs.renameSync(outputPath, finalPath);
        
        totalSaved += saved;
        optimizedCount++;
        console.log(`✅ ${entry.name}: ${(sizeBefore / 1024).toFixed(0)}KB → ${(newStats.size / 1024).toFixed(0)}KB (saved ${(saved / 1024).toFixed(0)}KB)`);
      } else {
        fs.unlinkSync(outputPath);
        console.log(`⏭️  ${entry.name}: already optimal, skipped`);
      }
    } catch (e) {
      console.error(`❌ ${entry.name}: failed -`, e.message);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }

  console.log(`\n🎉 Done! Optimized ${optimizedCount} images.`);
  console.log(`💾 Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimizePortfolio();
