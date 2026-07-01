const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'team_members_list' }
    });
    console.log(setting ? setting.value : 'No team_members_list found');
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
