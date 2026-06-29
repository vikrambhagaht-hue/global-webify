import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const homepageProjects = [
  {
    title: "Firayalal Public School",
    category: "Education Portal",
    image: "/Firayalal_Public_School_Ranchi.webp",
    link: "https://firayalalpublicschool.edu.in/",
    displayUrl: "firayalalpublicschool.edu.in",
    tags: "Education, Portal",
    isFeatured: true,
    order: 1,
    desc: ""
  },
  {
    title: "Health Point Ranchi",
    category: "Healthcare Website",
    image: "/Health_Point_Ranchi.webp",
    link: "https://healthpointranchi.com/",
    displayUrl: "healthpointranchi.com",
    tags: "Healthcare, Hospital",
    isFeatured: true,
    order: 2,
    desc: ""
  },
  {
    title: "Dr. Kumar Vishal",
    category: "Healthcare Website",
    image: "/Dr_Kumar_Vishal.webp",
    link: "https://drkumarvishal.com/",
    displayUrl: "drkumarvishal.com",
    tags: "Healthcare, Doctor",
    isFeatured: true,
    order: 3,
    desc: ""
  },
  {
    title: "Kaveri Restaurant",
    category: "Restaurant Website",
    image: "/Kaveri.webp",
    link: "https://kaveri-nextjs.vercel.app/",
    displayUrl: "kaveri-nextjs.vercel.app",
    tags: "Restaurant, Food",
    isFeatured: true,
    order: 4,
    desc: ""
  },
  {
    title: "RPS Hospital",
    category: "Healthcare Website",
    image: "/RPS_Hospital.webp",
    link: "https://rpshospital.com/",
    displayUrl: "rpshospital.com",
    tags: "Healthcare, Hospital",
    isFeatured: true,
    order: 5,
    desc: ""
  },
  {
    title: "ACS Ranchi",
    category: "Restaurant Website",
    image: "/ACS_Ranchi.webp",
    link: "https://acs-jn.com/",
    displayUrl: "acs-jn.com",
    tags: "Restaurant, Food",
    isFeatured: true,
    order: 6,
    desc: ""
  }
];

async function main() {
  console.log("Seeding Homepage Portfolio Cards...");

  // Clear existing featured items
  await prisma.portfolioItem.deleteMany({
    where: { isFeatured: true }
  });

  for (const project of homepageProjects) {
    await prisma.portfolioItem.create({
      data: project
    });
    console.log(`Added: ${project.title}`);
  }

  console.log("Seeding complete! You now have 6 cards on your homepage.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
