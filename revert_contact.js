const { execSync } = require('child_process');
const fs = require('fs');

try {
  const content = execSync('git show HEAD:src/features/company/components/ContactClient.tsx', { encoding: 'utf-8' });
  fs.writeFileSync('C:\\Users\\vikur\\Downloads\\GlobalWeblify\\src\\features\\company\\components\\ContactClient.tsx', content);
  console.log('Successfully reverted ContactClient.tsx');
} catch (e) {
  console.error(e.message);
}
