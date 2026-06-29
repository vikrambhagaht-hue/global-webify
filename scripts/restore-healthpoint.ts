import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Restoring Health Point Ranchi's original local image...");

  // Update ALL health point entries to use the original perfect screenshot
  const result = await prisma.portfolioItem.updateMany({
    where: { 
      title: { contains: "Health Point" }
    },
    data: { 
      // The user provided this perfect screenshot in the public folder
      image: "/Health_Point_Ranchi.webp",
      link: "https://healthpointranchi.com/"
    }
  });

  console.log(`Successfully updated ${result.count} records!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
