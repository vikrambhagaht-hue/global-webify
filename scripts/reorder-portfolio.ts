import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing order so new items correctly appear FIRST...");

  // We are going to put ALL items into the past (year 2020) so that 
  // any NEW item you add today (year 2026) will ALWAYS correctly be #1!

  // Default: put everything in 2020
  await prisma.portfolioItem.updateMany({
    data: { createdAt: new Date("2020-01-01T00:00:00Z") }
  });

  // Top Items: We put them in 2021 (Newer than 2020, but older than today)
  // This means they stay at the top compared to old ones, but new ones will beat them!
  const topItems = [
    "Firayalal Public School",
    "RPS Hospital",
    "Pyoras Group",
    "Forte Migration Australia"
  ];

  for (let i = 0; i < topItems.length; i++) {
    // Need to pad the day with 0 (e.g. "09" instead of "9")
    const day = String(10 - i).padStart(2, '0');
    const date = new Date(`2021-01-${day}T00:00:00Z`);
    await prisma.portfolioItem.updateMany({
      where: { title: { contains: topItems[i] } },
      data: { createdAt: date }
    });
  }

  // Bottom Items: We put them in 1999 (Absolute oldest)
  const bottomItems = [
    "Documantraa",
    "Artival India" 
  ];

  for (let i = 0; i < bottomItems.length; i++) {
    // 1999-01-03, 1999-01-02, 1999-01-01
    const oldDate = new Date(`1999-01-0${9 - i}T00:00:00Z`); 
    await prisma.portfolioItem.updateMany({
      where: { title: { contains: bottomItems[i] } },
      data: { createdAt: oldDate }
    });
  }

  console.log("Fixed! All your existing items are now properly sorted, and ANY new item you add will appear at the absolute top left!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
