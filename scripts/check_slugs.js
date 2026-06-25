const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const services = await prisma.servicePage.findMany({
    select: { id: true, slug: true, title: true }
  });
  console.log(services);
}

check().finally(() => prisma.$disconnect());
