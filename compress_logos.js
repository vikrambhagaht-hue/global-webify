const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(__dirname, 'public', 'digital-marketing-clients');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const filePath = path.join(directoryPath, file);
      const parsedPath = path.parse(filePath);
      const outputFilePath = path.join(directoryPath, `${parsedPath.name}.webp`);

      sharp(filePath)
        .webp({ quality: 80 }) // quality rehne dena (keeping good quality)
        .toFile(outputFilePath)
        .then(() => {
          console.log(`Converted: ${file} to ${parsedPath.name}.webp`);
          // optionally remove old file
          // fs.unlinkSync(filePath);
        })
        .catch(err => {
          console.error(`Error converting ${file}:`, err);
        });
    }
  });
});
