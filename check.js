const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkData() {
  const jobs = await prisma.jobApplication.count();
  const requests = await prisma.partnershipSubmission.count();
  console.log('Job Applications count:', jobs);
  console.log('Partnership Submissions count:', requests);
}
checkData().finally(() => prisma.$disconnect());
