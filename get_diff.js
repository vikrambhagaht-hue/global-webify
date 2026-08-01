const { execSync } = require('child_process');
const fs = require('fs');
try {
  const diff = execSync('git log -p -n 2 src/features/company/components/ContactClient.tsx', { encoding: 'utf-8' });
  fs.writeFileSync('C:\\Users\\vikur\\Downloads\\GlobalWeblify\\contact_diff.txt', diff);
  console.log('Diff written to contact_diff.txt');
} catch (e) {
  fs.writeFileSync('C:\\Users\\vikur\\Downloads\\GlobalWeblify\\contact_diff.txt', 'Error: ' + e.message);
}
