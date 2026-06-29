import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary manually for the script
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function main() {
  const link = "https://healthpointranchi.com/";
  console.log(`Taking new screenshot for ${link}... (This may take 10 seconds)`);

  // 1. Capture new screenshot
  const screenshotUrl = `https://image.thum.io/get/width/1200/crop/2000/noanimate/${encodeURI(link)}`;
  
  // 2. Upload to cloudinary
  console.log("Uploading to Cloudinary...");
  const uploadResponse = await cloudinary.uploader.upload(screenshotUrl, {
    folder: "portfolio",
    format: "webp",
    resource_type: "image",
  });
  console.log(`New image URL: ${uploadResponse.secure_url}`);

  // 3. Update Database
  const result = await prisma.portfolioItem.updateMany({
    where: { link: { contains: "healthpointranchi" } },
    data: { image: uploadResponse.secure_url }
  });

  console.log(`Successfully updated ${result.count} records with the new screenshot!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
