"use client";

import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    id: 1,
    title: "Forte Migration Australia",
    category: "Web Development",
    image: "/portfolio/fortemigration.webp",
    desc: "A premium migration agency platform designed with custom onboarding workflows, interactive visa criteria checkers, and professional corporate branding.",
    link: "https://www.fortemigration.com.au/",
    displayUrl: "fortemigration.com.au",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Lead Capture"]
  },
  {
    id: 2,
    title: "Artival India",
    category: "E-Commerce",
    image: "/portfolio/artival.webp",
    desc: "An upscale luxury storefront for handcrafted rugs and artisanal carpets, focusing on high-fidelity image displays, robust filters, and frictionless checkout.",
    link: "https://artival.in/",
    displayUrl: "artival.in",
    tags: ["React", "Shopify", "Tailwind CSS", "Premium Design"]
  },
  {
    id: 3,
    title: "Pyoras Group",
    category: "Corporate",
    image: "/portfolio/pyoras.webp",
    desc: "Corporate marketing website for a leading sustainable group. Highlighted by crisp modern grids and showcases of eco-friendly hydration products.",
    link: "https://pyoras.com/",
    displayUrl: "pyoras.com",
    tags: ["Next.js", "Animations", "Responsive Design", "Green Tech"]
  },
  {
    id: 4,
    title: "RSR Foodstuff",
    category: "B2B Portal",
    image: "/portfolio/rsrfoodstuff.webp",
    desc: "A dynamic B2B agriculture exporting portal. Includes comprehensive specifications for grains, pulses, and spices alongside custom lead inquiry features.",
    link: "https://rsrfoodstuff.com/",
    displayUrl: "rsrfoodstuff.com",
    tags: ["Web Design", "B2B Catalog", "Inquiry System", "SEO Optimized"]
  },
  {
    id: 5,
    title: "FutureNxt Technologies",
    category: "Web Development",
    image: "/portfolio/futurenxt.webp",
    desc: "A futuristic enterprise tech agency web app, featuring high-tech visual cues and clean layouts highlighting AI and software engineering services.",
    link: "https://futurenxt.io/index.php",
    displayUrl: "futurenxt.io",
    tags: ["React", "Futuristic UI", "Dynamic Scripts", "Tech Agency"]
  },
  {
    id: 6,
    title: "Veltrivo",
    category: "Informative",
    image: "/portfolio/veltrivo.webp",
    desc: "A premium product showcase platform featuring clean aesthetics and focus on service presentations.",
    link: "https://veltrivo.com/",
    displayUrl: "veltrivo.com",
    tags: ["Tailwind", "Responsive", "Modern design"]
  },
  {
    id: 7,
    title: "Ethnoenviron Journal",
    category: "Informative",
    image: "/portfolio/ethnoenvironjournal.webp",
    desc: "Academic environmental sciences journal site built for accessibility and high reading readability.",
    link: "https://ethnoenvironjournal.com/public_html/index",
    displayUrl: "ethnoenvironjournal.com",
    tags: ["Academic", "CSS Grid", "Science Forum"]
  },
  {
    id: 8,
    title: "Gangotri Steels",
    category: "Informative",
    image: "/portfolio/gangotristeels.webp",
    desc: "Corporate presence for a leading metal and steel manufacturer.",
    link: "https://gangotristeels.com/",
    displayUrl: "gangotristeels.com",
    tags: ["Industrial", "Steel", "Enterprise"]
  },
  {
    id: 9,
    title: "Sara Group",
    category: "Informative",
    image: "/portfolio/saragroup.webp",
    desc: "A diversified business portfolio highlighting key commercial and industrial operations.",
    link: "https://saragroup.ind.in/",
    displayUrl: "saragroup.ind.in",
    tags: ["Corporate Portfolio", "Business", "Modern Layout"]
  },
  {
    id: 10,
    title: "Tarot Card Reader",
    category: "Informative",
    image: "/portfolio/tarotcardreader.webp",
    desc: "A spiritual consultation landing page showing services, readings, and client feedback grids.",
    link: "https://tarotcardreaderhealerauthenticquinsoumya.com/",
    displayUrl: "tarotcardreader...",
    tags: ["Spiritual", "Service Listing", "Landing Page"]
  },
  {
    id: 11,
    title: "Salt and Sea",
    category: "Informative",
    image: "/portfolio/saltandsea.webp",
    desc: "A premium travel and destination guide showcasing scenic coastal stays.",
    link: "https://saltandsea.co.in/",
    displayUrl: "saltandsea.co.in",
    tags: ["Resort", "Travel", "Media Grid"]
  },
  {
    id: 12,
    title: "Arts and Projects",
    category: "Informative",
    image: "/portfolio/artsandprojects.webp",
    desc: "Creative architecture design agency and project portfolio showcase.",
    link: "https://artsandprojects.in/",
    displayUrl: "artsandprojects.in",
    tags: ["Creative Design", "CSS Flexbox", "Portfolio showcase"]
  },
  {
    id: 13,
    title: "Jindal Teleservices",
    category: "Informative",
    image: "/portfolio/jindaltel.webp",
    desc: "High-speed broadband network provider corporate site.",
    link: "https://jindaltel.com/",
    displayUrl: "jindaltel.com",
    tags: ["Telecom", "Tech Layout", "Broadband Info"]
  },
  {
    id: 14,
    title: "Deals on Profit",
    category: "Informative",
    image: "/portfolio/dealsonprofit.webp",
    desc: "Cashback directory page highlighting premium coupons and discounts.",
    link: "https://dealsonprofit.com/",
    displayUrl: "dealsonprofit.com",
    tags: ["Affiliate directory", "Deals", "Grid layout"]
  },
  {
    id: 15,
    title: "Yembross",
    category: "Informative",
    image: "/portfolio/yembroos.webp",
    desc: "Professional strategy consulting firm corporate landing page.",
    link: "https://yembroos.com/",
    displayUrl: "yembroos.com",
    tags: ["Business consulting", "Clean typography", "Corporate design"]
  },
  {
    id: 16,
    title: "South India Cabs",
    category: "Informative",
    image: "/portfolio/southindiacabs.webp",
    desc: "Intercity cab service provider with responsive route rate sheets.",
    link: "https://southindiacabs.info/",
    displayUrl: "southindiacabs.info",
    tags: ["Cab hire", "Travel routes", "Responsive rates"]
  },
  {
    id: 17,
    title: "Bella Initiis",
    category: "Informative",
    image: "/portfolio/bellainitiis.webp",
    desc: "A boutique cosmetics e-commerce brand concept presenting luxury oils and botanical serums.",
    link: "https://bellainitiis.com/",
    displayUrl: "bellainitiis.com",
    tags: ["Skincare brand", "Luxury UI", "Wellness products"]
  },
  {
    id: 18,
    title: "AM Nuts and Spices",
    category: "Informative",
    image: "/portfolio/amnutsandspices.webp",
    desc: "Exotic crop exporter and bulk nuts organic packaging directory.",
    link: "https://amnutsandspices.in/",
    displayUrl: "amnutsandspices.in",
    tags: ["Dry fruits", "Export catalog", "Organic spice"]
  },
  {
    id: 19,
    title: "Gold Pe Cash",
    category: "Informative",
    image: "/portfolio/goldpecash.webp",
    desc: "Instant cash for gold buyer service landing page with live rate estimators.",
    link: "https://goldpecash.com/",
    displayUrl: "goldpecash.com",
    tags: ["Gold buying", "Fintech lead", "Trust rating"]
  },
  {
    id: 20,
    title: "IIq Solutions",
    category: "Informative",
    image: "/portfolio/iiqsolutions.webp",
    desc: "Professional education academy portal listing career programs and database developer training.",
    link: "https://iiqsolutions.com/",
    displayUrl: "iiqsolutions.com",
    tags: ["IT Academy", "Courses directory", "Student intake"]
  },
  {
    id: 21,
    title: "Reina Diamonds",
    category: "Informative",
    image: "/portfolio/reinadiamonds.webp",
    desc: "A luxury diamond designer digital boutique showing solitaire gold sets.",
    link: "https://reinadiamonds.com/",
    displayUrl: "reinadiamonds.com",
    tags: ["Jewelry showcase", "Luxury layout", "Diamonds"]
  },
  {
    id: 22,
    title: "Healthi Lotus",
    category: "Informative",
    image: "/portfolio/healthilotus.webp",
    desc: "Holistic yoga classes and wellness wellness guide.",
    link: "https://healthilotus.com/",
    displayUrl: "healthilotus.com",
    tags: ["Yoga", "Meditation classes", "Organic healing"]
  },
  {
    id: 23,
    title: "Signompliance",
    category: "Informative",
    image: "/portfolio/signompliance.webp",
    desc: "Corporate regulatory risk auditing framework corporate portal.",
    link: "https://signompliance.com/",
    displayUrl: "signompliance.com",
    tags: ["Compliance", "Corporate audit", "Legal advisor"]
  },
  {
    id: 24,
    title: "Multithread",
    category: "Informative",
    image: "/portfolio/multithread.webp",
    desc: "Agile DevOps automation and cloud database consulting services.",
    link: "https://www.multithread.co.in/",
    displayUrl: "multithread.co.in",
    tags: ["DevOps consulting", "Software development", "CI/CD setups"]
  },
  {
    id: 25,
    title: "Omni Overseas",
    category: "Informative",
    image: "/portfolio/omnioverseas.webp",
    desc: "International shipping cargo and logistics service listing.",
    link: "https://omnioverseas.com/",
    displayUrl: "omnioverseas.com",
    tags: ["Cargo handling", "Logistics export", "Global trade"]
  },
  {
    id: 26,
    title: "Varanasi Mai",
    category: "Informative",
    image: "/portfolio/varanasimai.webp",
    desc: "Cultural tourism guide displaying regional art and holy city tour booking options.",
    link: "https://varanasimai.com/",
    displayUrl: "varanasimai.com",
    tags: ["Heritage walks", "Spiritual tours", "Banaras textile"]
  },
  {
    id: 27,
    title: "Man Bhavan Seva Samiti",
    category: "Informative",
    image: "/portfolio/manbhavansevasamiti.webp",
    desc: "Non-profit social organization portal demonstrating local education initiatives.",
    link: "https://manbhavansevasamiti.in/",
    displayUrl: "manbhavansevasamiti.in",
    tags: ["Charity", "Social welfare", "Rural schooling"]
  },
  {
    id: 28,
    title: "Digital Markethics",
    category: "Informative",
    image: "/portfolio/digitalmarkethics.webp",
    desc: "Digital SEO agency highlighting ethical transparency and marketing campaigns.",
    link: "https://digitechmarkethics.com/",
    displayUrl: "digitechmarkethics.com",
    tags: ["Ethical marketing", "SEO analytics", "Social growth"]
  },
  {
    id: 29,
    title: "Indo-Kosovo",
    category: "Informative",
    image: "/portfolio/indokosovo.webp",
    desc: "Bilateral trade organization chamber of commerce interface.",
    link: "https://ikcoc.org/",
    displayUrl: "ikcoc.org",
    tags: ["Trade Chamber", "Investment board", "Foreign relations"]
  },
  {
    id: 30,
    title: "Orbit Eyes",
    category: "Hospital And Diagnostics",
    image: "/portfolio/orbiteyes.webp",
    desc: "Advanced eye care hospital and diagnostic center website showcasing specialized treatment departments.",
    link: "https://orbiteyes.in/",
    displayUrl: "orbiteyes.in",
    tags: ["Eye Hospital", "Diagnostics", "Specialty Care"]
  },
  {
    id: 31,
    title: "Dr Kumar Vishal",
    category: "Medical And Healthcare",
    image: "/portfolio/drkumarvishal.webp",
    desc: "Professional medical website for leading oncologist Dr. Kumar Vishal, detailing clinical expertise and consulting clinics.",
    link: "https://drkumarvishal.com/",
    displayUrl: "drkumarvishal.com",
    tags: ["Doctor Profile", "Healthcare Info", "Patient Portal"]
  },
  {
    id: 32,
    title: "Health Point Hospital",
    category: "Medical And Healthcare",
    image: "/portfolio/healthpointranchi.webp",
    desc: "Multi-specialty hospital portal highlighting clinical services, doctor schedules, and online inquiries.",
    link: "https://healthpointranchi.com/",
    displayUrl: "healthpointranchi.com",
    tags: ["Multi-Specialty", "Hospital Site", "Online Booking"]
  },
  {
    id: 33,
    title: "RPS Hospital",
    category: "Medical And Healthcare",
    image: "/portfolio/rpshospital.webp",
    desc: "Modern corporate hospital platform presenting trauma care, OPD departments, and quality healthcare facilities.",
    link: "https://rpshospital.com/",
    displayUrl: "rpshospital.com",
    tags: ["Medical Center", "OPD Vetting", "Emergency Care"]
  },
  {
    id: 34,
    title: "ACS",
    category: "Food And Beverages",
    image: "/portfolio/acs.webp",
    desc: "Catering service and dining supply chain interface displaying bulk food ordering and delivery options.",
    link: "https://acs-jn.com/",
    displayUrl: "acs-jn.com",
    tags: ["Catering", "Food Supply", "Corporate Dining"]
  },
  {
    id: 35,
    title: "Kaveri",
    category: "Food And Beverages",
    image: "/portfolio/kaveri.webp",
    desc: "Elegant restaurant menu website highlighting exquisite culinary spreads and quick table reservations.",
    link: "https://kaveri-nextjs.vercel.app/",
    displayUrl: "kaveri-nextjs.vercel.app",
    tags: ["Restaurant Menu", "Vercel Deploy", "Next.js UI"]
  },
  {
    id: 36,
    title: "Kelvin Eco Products",
    category: "E-Commerce",
    image: "/portfolio/kelvinecoproducts.webp",
    desc: "Eco-friendly sustainable bio-degradable products e-commerce catalog.",
    link: "https://kelvinecoproducts.com/",
    displayUrl: "kelvinecoproducts.com",
    tags: ["E-Commerce", "Eco-friendly", "Green Tech Store"]
  },
  {
    id: 37,
    title: "Elevate HR Services",
    category: "Corporate",
    image: "/portfolio/elevatehrservices.webp",
    desc: "Leading human resource placement portal showing staffing modules and career consultation services.",
    link: "https://elevate-hrservices.com/",
    displayUrl: "elevate-hrservices.com",
    tags: ["Recruiting", "Staffing", "HR Corporate"]
  },
  {
    id: 38,
    title: "Documantraa",
    category: "Corporate",
    image: "/portfolio/documantraa.webp",
    desc: "Secure enterprise CRM and client document translation intake portal.",
    link: "https://documantraa.in/crm/login.php",
    displayUrl: "documantraa.in",
    tags: ["CRM System", "Document Portal", "Secure Login"]
  }
];

const categories = ["All", "Web Development", "E-Commerce", "Corporate", "B2B Portal", "Informative", "Hospital And Diagnostics", "Medical And Healthcare", "Food And Beverages"];

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerHeight, setContainerHeight] = useState(320);
  const [imageHeight, setImageHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const updateHeights = () => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  };

  useEffect(() => {
    updateHeights();
    
    // Ensure height is captured even if image is cached or loads instantly
    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        updateHeights();
      }
      img.addEventListener('load', updateHeights);
      return () => img.removeEventListener('load', updateHeights);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateHeights();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100 transition-all duration-500"
    >
      {/* Browser Header Mockup */}
      <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center gap-2 rounded-t-3xl">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 bg-gray-100/80 border border-gray-200/30 rounded-lg py-1 px-3 text-[11px] text-gray-400 truncate max-w-[220px] mx-auto text-center font-mono select-none flex items-center justify-center gap-1.5">
          <Globe size={10} className="text-gray-400" />
          <span>{project.displayUrl}</span>
        </div>
      </div>

      {/* Scrollable Screenshot Area - Clickable to Live Site */}
      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer block"
      >
        <div
          className="absolute top-0 left-0 w-full will-change-transform"
          style={{
            transform: isHovered && imageHeight > containerHeight 
              ? `translateY(-${imageHeight - containerHeight}px)` 
              : 'translateY(0px)',
            transitionProperty: 'transform',
            transitionDuration: isHovered 
              ? `${Math.max(0.1, (imageHeight - containerHeight) / 250)}s` 
              : '0.6s',
            transitionTimingFunction: isHovered ? 'linear' : 'ease-out'
          }}
        >
          <Image 
            ref={imageRef}
            src={project.image} 
            alt={project.title}
            title={project.title}
            width={600}
            height={1000}
            className="w-full h-auto block"
            priority={project.id <= 6}
            onLoad={updateHeights}
          />
        </div>

        {/* Quick Hover Guidance Overlay */}
        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none transition-opacity duration-300 hover:opacity-0" />
      </a>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a8b4c] bg-green-50 px-2.5 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <h3 className="text-[19px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1a8b4c] transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-900/10 hover:shadow-md hover:shadow-green-900/20"
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </m.div>
  );
};

export default function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-0 sm:pt-1 pb-16 sm:pb-24 bg-[#f8fafc] font-sans relative overflow-hidden min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 blur-[130px] rounded-full -mr-72 -mt-72" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-100/20 blur-[120px] rounded-full -ml-64" />

      <div className="relative z-10 container-custom">
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">


          <m.h1 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-4 leading-tight"
          >
            Our <span className="text-[#2CA65A] underline decoration-green-200 decoration-4 sm:decoration-8 underline-offset-4">Portfolio</span>
          </m.h1>
          
          <m.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 leading-relaxed"
          >
            Discover our best website projects showcasing performance, UX, and reliability.
          </m.p>

          {/* Filtering buttons */}
          <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-1.5 sm:gap-2 py-1.5 px-4 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-bold font-lexend transition-all duration-300 md:flex-shrink-0 ${
                  activeCategory === cat 
                  ? "bg-[#2CA65A] text-white border border-[#2CA65A] shadow-lg shadow-green-900/10" 
                  : "bg-white text-[#2CA65A] border border-[#2CA65A]/40 hover:bg-[#2CA65A] hover:text-white hover:border-[#2CA65A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid layout */}
        <m.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-[1400px] mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </div>
  );
}
