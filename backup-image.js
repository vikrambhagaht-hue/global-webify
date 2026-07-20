const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'public', 'bg-pattern-landing.avif');
const backup = path.join(__dirname, 'public', 'bg-pattern-landing-BACKUP.avif');

fs.copyFileSync(src, backup);
console.log('✅ Backup created successfully!');
console.log('Original size:', Math.round(fs.statSync(src).size / 1024) + ' KB');
console.log('Backup file:', backup);
console.log('\n🔄 To restore: Just rename bg-pattern-landing-BACKUP.avif back to bg-pattern-landing.avif');
