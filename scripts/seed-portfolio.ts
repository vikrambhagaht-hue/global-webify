import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    id: 1,
    title: "Forte Migration Australia",
    category: "Web Development",
    image: "/portfolio/fortemigration.webp",
    desc: "A premium migration agency platform designed with custom onboarding workflows, interactive visa criteria checkers, and professional corporate branding.",
    link: "https://www.fortemigration.com.au/",
    displayUrl: "fortemigration.com.au",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Lead Capture"],
    isFeatured: false
  },
  {
    id: 3,
    title: "Pyoras Group",
    category: "Corporate",
    image: "/portfolio/pyoras.webp",
    desc: "Corporate marketing website for a leading sustainable group. Highlighted by crisp modern grids and showcases of eco-friendly hydration products.",
    link: "https://pyoras.com/",
    displayUrl: "pyoras.com",
    tags: ["Next.js", "Animations", "Responsive Design", "Green Tech"],
    isFeatured: false
  },
  {
    id: 4,
    title: "RSR Foodstuff",
    category: "B2B Portal",
    image: "/portfolio/rsrfoodstuff.webp",
    desc: "A dynamic B2B agriculture exporting portal. Includes comprehensive specifications for grains, pulses, and spices alongside custom lead inquiry features.",
    link: "https://rsrfoodstuff.com/",
    displayUrl: "rsrfoodstuff.com",
    tags: ["Web Design", "B2B Catalog", "Inquiry System", "SEO Optimized"],
    isFeatured: false
  },
  {
    id: 5,
    title: "FutureNxt Technologies",
    category: "Web Development",
    image: "/portfolio/futurenxt.webp",
    desc: "A futuristic enterprise tech agency web app, featuring high-tech visual cues and clean layouts highlighting AI and software engineering services.",
    link: "https://futurenxt.io/index.php",
    displayUrl: "futurenxt.io",
    tags: ["React", "Futuristic UI", "Dynamic Scripts", "Tech Agency"],
    isFeatured: false
  },
  {
    id: 6,
    title: "Veltrivo",
    category: "Informative",
    image: "/portfolio/veltrivo.webp",
    desc: "A premium product showcase platform featuring clean aesthetics and focus on service presentations.",
    link: "https://veltrivo.com/",
    displayUrl: "veltrivo.com",
    tags: ["Tailwind", "Responsive", "Modern design"],
    isFeatured: false
  },
  {
    id: 7,
    title: "Ethnoenviron Journal",
    category: "Informative",
    image: "/portfolio/ethnoenvironjournal.webp",
    desc: "Academic environmental sciences journal site built for accessibility and high reading readability.",
    link: "https://ethnoenvironjournal.com/public_html/index",
    displayUrl: "ethnoenvironjournal.com",
    tags: ["Academic", "CSS Grid", "Science Forum"],
    isFeatured: false
  },
  {
    id: 8,
    title: "Gangotri Steels",
    category: "Informative",
    image: "/portfolio/gangotristeels.webp",
    desc: "Corporate presence for a leading metal and steel manufacturer.",
    link: "https://gangotristeels.com/",
    displayUrl: "gangotristeels.com",
    tags: ["Industrial", "Steel", "Enterprise"],
    isFeatured: false
  },
  {
    id: 9,
    title: "Sara Group",
    category: "Informative",
    image: "/portfolio/saragroup.webp",
    desc: "A diversified business portfolio highlighting key commercial and industrial operations.",
    link: "https://saragroup.ind.in/",
    displayUrl: "saragroup.ind.in",
    tags: ["Corporate Portfolio", "Business", "Modern Layout"],
    isFeatured: false
  },
  {
    id: 10,
    title: "Tarot Card Reader",
    category: "Informative",
    image: "/portfolio/tarotcardreader.webp",
    desc: "A spiritual consultation landing page showing services, readings, and client feedback grids.",
    link: "https://tarotcardreaderhealerauthenticquinsoumya.com/",
    displayUrl: "tarotcardreader...",
    tags: ["Spiritual", "Service Listing", "Landing Page"],
    isFeatured: false
  },
  {
    id: 11,
    title: "Salt and Sea",
    category: "Informative",
    image: "/portfolio/saltandsea.webp",
    desc: "A premium travel and destination guide showcasing scenic coastal stays.",
    link: "https://saltandsea.co.in/",
    displayUrl: "saltandsea.co.in",
    tags: ["Resort", "Travel", "Media Grid"],
    isFeatured: false
  },
  {
    id: 12,
    title: "Arts and Projects",
    category: "Informative",
    image: "/portfolio/artsandprojects.webp",
    desc: "Creative architecture design agency and project portfolio showcase.",
    link: "https://artsandprojects.in/",
    displayUrl: "artsandprojects.in",
    tags: ["Creative Design", "CSS Flexbox", "Portfolio showcase"],
    isFeatured: false
  },
  {
    id: 13,
    title: "Jindal Teleservices",
    category: "Informative",
    image: "/portfolio/jindaltel.webp",
    desc: "High-speed broadband network provider corporate site.",
    link: "https://jindaltel.com/",
    displayUrl: "jindaltel.com",
    tags: ["Telecom", "Tech Layout", "Broadband Info"],
    isFeatured: false
  },
  {
    id: 14,
    title: "Deals on Profit",
    category: "Informative",
    image: "/portfolio/dealsonprofit.webp",
    desc: "Cashback directory page highlighting premium coupons and discounts.",
    link: "https://dealsonprofit.com/",
    displayUrl: "dealsonprofit.com",
    tags: ["Affiliate directory", "Deals", "Grid layout"],
    isFeatured: false
  },
  {
    id: 15,
    title: "Yembross",
    category: "Informative",
    image: "/portfolio/yembroos.webp",
    desc: "Professional strategy consulting firm corporate landing page.",
    link: "https://yembroos.com/",
    displayUrl: "yembroos.com",
    tags: ["Business consulting", "Clean typography", "Corporate design"],
    isFeatured: false
  },
  {
    id: 16,
    title: "South India Cabs",
    category: "Informative",
    image: "/portfolio/southindiacabs.webp",
    desc: "Intercity cab service provider with responsive route rate sheets.",
    link: "https://southindiacabs.info/",
    displayUrl: "southindiacabs.info",
    tags: ["Cab hire", "Travel routes", "Responsive rates"],
    isFeatured: false
  },
  {
    id: 17,
    title: "Bella Initiis",
    category: "Informative",
    image: "/portfolio/bellainitiis.webp",
    desc: "A boutique cosmetics e-commerce brand concept presenting luxury oils and botanical serums.",
    link: "https://bellainitiis.com/",
    displayUrl: "bellainitiis.com",
    tags: ["Skincare brand", "Luxury UI", "Wellness products"],
    isFeatured: false
  },
  {
    id: 18,
    title: "AM Nuts and Spices",
    category: "Informative",
    image: "/portfolio/amnutsandspices.webp",
    desc: "Exotic crop exporter and bulk nuts organic packaging directory.",
    link: "https://amnutsandspices.in/",
    displayUrl: "amnutsandspices.in",
    tags: ["Dry fruits", "Export catalog", "Organic spice"],
    isFeatured: false
  },
  {
    id: 19,
    title: "Gold Pe Cash",
    category: "Informative",
    image: "/portfolio/goldpecash.webp",
    desc: "Instant cash for gold buyer service landing page with live rate estimators.",
    link: "https://goldpecash.com/",
    displayUrl: "goldpecash.com",
    tags: ["Gold buying", "Fintech lead", "Trust rating"],
    isFeatured: false
  },
  {
    id: 20,
    title: "IIq Solutions",
    category: "Informative",
    image: "/portfolio/iiqsolutions.webp",
    desc: "Professional education academy portal listing career programs and database developer training.",
    link: "https://iiqsolutions.com/",
    displayUrl: "iiqsolutions.com",
    tags: ["IT Academy", "Courses directory", "Student intake"],
    isFeatured: false
  },
  {
    id: 21,
    title: "Reina Diamonds",
    category: "Informative",
    image: "/portfolio/reinadiamonds.webp",
    desc: "A luxury diamond designer digital boutique showing solitaire gold sets.",
    link: "https://reinadiamonds.com/",
    displayUrl: "reinadiamonds.com",
    tags: ["Jewelry showcase", "Luxury layout", "Diamonds"],
    isFeatured: false
  },
  {
    id: 22,
    title: "Healthi Lotus",
    category: "Informative",
    image: "/portfolio/healthilotus.webp",
    desc: "Holistic yoga classes and wellness wellness guide.",
    link: "https://healthilotus.com/",
    displayUrl: "healthilotus.com",
    tags: ["Yoga", "Meditation classes", "Organic healing"],
    isFeatured: false
  },
  {
    id: 23,
    title: "Signompliance",
    category: "Informative",
    image: "/portfolio/signompliance.webp",
    desc: "Corporate regulatory risk auditing framework corporate portal.",
    link: "https://signompliance.com/",
    displayUrl: "signompliance.com",
    tags: ["Compliance", "Corporate audit", "Legal advisor"],
    isFeatured: false
  },
  {
    id: 24,
    title: "Multithread",
    category: "Informative",
    image: "/portfolio/multithread.webp",
    desc: "Agile DevOps automation and cloud database consulting services.",
    link: "https://www.multithread.co.in/",
    displayUrl: "multithread.co.in",
    tags: ["DevOps consulting", "Software development", "CI/CD setups"],
    isFeatured: false
  },
  {
    id: 25,
    title: "Omni Overseas",
    category: "Informative",
    image: "/portfolio/omnioverseas.webp",
    desc: "International shipping cargo and logistics service listing.",
    link: "https://omnioverseas.com/",
    displayUrl: "omnioverseas.com",
    tags: ["Cargo handling", "Logistics export", "Global trade"],
    isFeatured: false
  },
  {
    id: 26,
    title: "Varanasi Mai",
    category: "Informative",
    image: "/portfolio/varanasimai.webp",
    desc: "Cultural tourism guide displaying regional art and holy city tour booking options.",
    link: "https://varanasimai.com/",
    displayUrl: "varanasimai.com",
    tags: ["Heritage walks", "Spiritual tours", "Banaras textile"],
    isFeatured: false
  },
  {
    id: 27,
    title: "Man Bhavan Seva Samiti",
    category: "Informative",
    image: "/portfolio/manbhavansevasamiti.webp",
    desc: "Non-profit social organization portal demonstrating local education initiatives.",
    link: "https://manbhavansevasamiti.in/",
    displayUrl: "manbhavansevasamiti.in",
    tags: ["Charity", "Social welfare", "Rural schooling"],
    isFeatured: false
  },
  {
    id: 28,
    title: "Digital Markethics",
    category: "Informative",
    image: "/portfolio/digitalmarkethics.webp",
    desc: "Digital SEO agency highlighting ethical transparency and marketing campaigns.",
    link: "https://digitechmarkethics.com/",
    displayUrl: "digitechmarkethics.com",
    tags: ["Ethical marketing", "SEO analytics", "Social growth"],
    isFeatured: false
  },
  {
    id: 29,
    title: "Indo-Kosovo",
    category: "Informative",
    image: "/portfolio/indokosovo.webp",
    desc: "Bilateral trade organization chamber of commerce interface.",
    link: "https://ikcoc.org/",
    displayUrl: "ikcoc.org",
    tags: ["Trade Chamber", "Investment board", "Foreign relations"],
    isFeatured: false
  },
  {
    id: 30,
    title: "Orbit Eyes",
    category: "Hospital And Diagnostics",
    image: "/portfolio/orbiteyes.webp",
    desc: "Advanced eye care hospital and diagnostic center website showcasing specialized treatment departments.",
    link: "https://orbiteyes.in/",
    displayUrl: "orbiteyes.in",
    tags: ["Eye Hospital", "Diagnostics", "Specialty Care"],
    isFeatured: false
  },
  {
    id: 31,
    title: "Dr Kumar Vishal",
    category: "Medical And Healthcare",
    image: "/portfolio/drkumarvishal.webp",
    desc: "Professional medical website for leading oncologist Dr. Kumar Vishal, detailing clinical expertise and consulting clinics.",
    link: "https://drkumarvishal.com/",
    displayUrl: "drkumarvishal.com",
    tags: ["Doctor Profile", "Healthcare Info", "Patient Portal"],
    isFeatured: false
  },
  {
    id: 32,
    title: "Health Point Hospital",
    category: "Medical And Healthcare",
    image: "/portfolio/healthpointranchi.webp",
    desc: "Multi-specialty hospital portal highlighting clinical services, doctor schedules, and online inquiries.",
    link: "https://healthpointranchi.com/",
    displayUrl: "healthpointranchi.com",
    tags: ["Multi-Specialty", "Hospital Site", "Online Booking"],
    isFeatured: false
  },
  {
    id: 33,
    title: "RPS Hospital",
    category: "Medical And Healthcare",
    image: "/portfolio/rpshospital.webp",
    desc: "Modern corporate hospital platform presenting trauma care, OPD departments, and quality healthcare facilities.",
    link: "https://rpshospital.com/",
    displayUrl: "rpshospital.com",
    tags: ["Medical Center", "OPD Vetting", "Emergency Care"],
    isFeatured: false
  },
  {
    id: 34,
    title: "ACS",
    category: "Food And Beverages",
    image: "/portfolio/acs.webp",
    desc: "Catering service and dining supply chain interface displaying bulk food ordering and delivery options.",
    link: "https://acs-jn.com/",
    displayUrl: "acs-jn.com",
    tags: ["Catering", "Food Supply", "Corporate Dining"],
    isFeatured: false
  },
  {
    id: 35,
    title: "Kaveri",
    category: "Food And Beverages",
    image: "/portfolio/kaveri.webp",
    desc: "Elegant restaurant menu website highlighting exquisite culinary spreads and quick table reservations.",
    link: "https://kaveri-nextjs.vercel.app/",
    displayUrl: "kaveri-nextjs.vercel.app",
    tags: ["Restaurant Menu", "Vercel Deploy", "Next.js UI"],
    isFeatured: false
  },
  {
    id: 36,
    title: "Kelvin Eco Products",
    category: "E-Commerce",
    image: "/portfolio/kelvinecoproducts.webp",
    desc: "Eco-friendly sustainable bio-degradable products e-commerce catalog.",
    link: "https://kelvinecoproducts.com/",
    displayUrl: "kelvinecoproducts.com",
    tags: ["E-Commerce", "Eco-friendly", "Green Tech Store"],
    isFeatured: false
  },
  {
    id: 37,
    title: "Elevate HR Services",
    category: "Corporate",
    image: "/portfolio/elevatehrservices.webp",
    desc: "Leading human resource placement portal showing staffing modules and career consultation services.",
    link: "https://elevate-hrservices.com/",
    displayUrl: "elevate-hrservices.com",
    tags: ["Recruiting", "Staffing", "HR Corporate"],
    isFeatured: false
  },
  {
    id: 38,
    title: "Documantraa",
    category: "Corporate",
    image: "/portfolio/documantraa.webp",
    desc: "Secure enterprise CRM and client document translation intake portal.",
    link: "https://documantraa.in/crm/login.php",
    displayUrl: "documantraa.in",
    tags: ["CRM System", "Document Portal", "Secure Login"],
    isFeatured: false
  },
  {
    id: 2,
    title: "Artival India",
    category: "E-Commerce",
    image: "/portfolio/artival.webp",
    desc: "An upscale luxury storefront for handcrafted rugs and artisanal carpets, focusing on high-fidelity image displays, robust filters, and frictionless checkout.",
    link: "https://artival.in/",
    displayUrl: "artival.in",
    tags: ["React", "Shopify", "Tailwind CSS", "Premium Design"],
    isFeatured: false
  },
  // Adding the 6 featured ones as well
  {
    id: 101,
    title: "Firayalal Public School",
    category: "Education Portal",
    image: "/Firayalal_Public_School_Ranchi.webp",
    desc: "Education Portal",
    link: "https://firayalalpublicschool.edu.in/",
    displayUrl: "firayalalpublicschool.edu.in",
    tags: "Education",
    isFeatured: true
  },
  {
    id: 102,
    title: "Health Point Ranchi",
    category: "Healthcare Website",
    image: "/Health_Point_Ranchi.webp",
    desc: "Healthcare",
    link: "https://healthpointranchi.com/",
    displayUrl: "healthpointranchi.com",
    tags: "Healthcare",
    isFeatured: true
  },
  {
    id: 103,
    title: "Dr. Kumar Vishal",
    category: "Healthcare Website",
    image: "/Dr_Kumar_Vishal.webp",
    desc: "Healthcare",
    link: "https://drkumarvishal.com/",
    displayUrl: "drkumarvishal.com",
    tags: "Healthcare",
    isFeatured: true
  },
  {
    id: 104,
    title: "Kaveri Restaurant",
    category: "Restaurant Website",
    image: "/Kaveri.webp",
    desc: "Restaurant",
    link: "https://kaveri-nextjs.vercel.app/",
    displayUrl: "kaveri-nextjs.vercel.app",
    tags: "Restaurant",
    isFeatured: true
  },
  {
    id: 105,
    title: "RPS Hospital",
    category: "Healthcare Website",
    image: "/RPS_Hospital.webp",
    desc: "Healthcare",
    link: "https://rpshospital.com/",
    displayUrl: "rpshospital.com",
    tags: "Healthcare",
    isFeatured: true
  },
  {
    id: 106,
    title: "ACS Ranchi",
    category: "Restaurant Website",
    image: "/ACS_Ranchi.webp",
    desc: "Restaurant",
    link: "https://acs-jn.com/",
    displayUrl: "acs-jn.com",
    tags: "Restaurant",
    isFeatured: true
  }
];

async function main() {
  console.log("Seeding portfolio items...");
  
  for (const project of projects) {
    // Check if it already exists by link to avoid duplicates
    const existing = await prisma.portfolioItem.findFirst({
      where: { link: project.link }
    });
    
    if (!existing) {
      await prisma.portfolioItem.create({
        data: {
          title: project.title,
          category: project.category,
          desc: project.desc || "",
          link: project.link,
          displayUrl: project.displayUrl,
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
          image: project.image,
          isFeatured: project.isFeatured
        }
      });
      console.log(`Added ${project.title}`);
    } else {
      console.log(`Skipped ${project.title} (already exists)`);
    }
  }
  
  console.log("Done!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
