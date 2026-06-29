import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.portfolioItem.findMany({
    where: { title: { contains: "Health Point" } }
  });
  console.log(JSON.stringify(items, null, 2));
}

main().finally(() => prisma.$disconnect());
