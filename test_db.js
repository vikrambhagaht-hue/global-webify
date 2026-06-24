const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = await prisma.subdomainContent.findUnique({
    where: { pageType: 'seo-services' }
  });
  console.log(JSON.stringify(content, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
