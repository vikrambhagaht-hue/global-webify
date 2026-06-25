import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const services = await prisma.servicePage.findMany({
      where: {
        slug: {
          contains: 'web-development'
        }
      }
    });
    console.log("Services matching web-development:", JSON.stringify(services, null, 2));
    
    const allServices = await prisma.servicePage.findMany({
        select: { slug: true, isActive: true }
    });
    console.log("All active slugs:", allServices.map(s => s.slug));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
