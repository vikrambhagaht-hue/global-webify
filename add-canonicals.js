const fs = require('fs');
const path = require('path');

const pages = ["booking", "bookings", "cookie-policy", "delivery-policy", "portfolio", "privacy-policy", "refund-policy", "return-policy", "team", "terms-of-service"];

for (const page of pages) {
  const file = path.join(__dirname, 'src', 'app', '(company)', page, 'page.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('canonical')) {
      content = content.replace(/};\s*(export default function|const \w+ =)/, `,
  alternates: {
    canonical: '/${page}'
  }
};\n\n$1`);
      fs.writeFileSync(file, content);
      console.log('Added to', page);
    }
  }
}
