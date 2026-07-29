const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching BlogPosts...');
  const blogs = await prisma.blogPost.findMany();
  let blogCount = 0;
  for (const blog of blogs) {
    if (blog.content.includes('rel="noopener noreferrer nofollow"')) {
      const newContent = blog.content.replace(/rel="noopener noreferrer nofollow"/g, 'rel="noopener noreferrer"');
      await prisma.blogPost.update({
        where: { id: blog.id },
        data: { content: newContent },
      });
      blogCount++;
    }
  }
  console.log(`Updated ${blogCount} BlogPosts.`);

  console.log('Fetching ServicePages...');
  const services = await prisma.servicePage.findMany();
  let serviceCount = 0;
  for (const service of services) {
    if (service.content.includes('rel="noopener noreferrer nofollow"')) {
      const newContent = service.content.replace(/rel="noopener noreferrer nofollow"/g, 'rel="noopener noreferrer"');
      await prisma.servicePage.update({
        where: { id: service.id },
        data: { content: newContent },
      });
      serviceCount++;
    }
  }
  console.log(`Updated ${serviceCount} ServicePages.`);

  console.log('Fetching SubdomainContents...');
  const subdomains = await prisma.subdomainContent.findMany();
  let subCount = 0;
  for (const sub of subdomains) {
    if (sub.content.includes('rel="noopener noreferrer nofollow"')) {
      const newContent = sub.content.replace(/rel="noopener noreferrer nofollow"/g, 'rel="noopener noreferrer"');
      await prisma.subdomainContent.update({
        where: { id: sub.id },
        data: { content: newContent },
      });
      subCount++;
    }
  }
  console.log(`Updated ${subCount} SubdomainContents.`);
  
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
