import { VideoTemplate } from "./types";

export const INITIAL_TEMPLATES: VideoTemplate[] = [
  {
    id: "wedding-teja-elegant",
    title: "Teja Studios Divine Gold Wedding",
    category: "Wedding Invitations",
    categories: ["Wedding Invitations", "AI Wedding Invitations"],
    videoUrl: "https://drive.google.com/file/d/1uFcS8rj3xM8mdv7Qxmf4nIXaSjKICbOw/view?usp=drive_link",
    description: "A premium wedding invitation designed with divine traditional details, ornate golden frames, shimmering light leaks, and elegant transition effects. Perfect for a grand and traditional celebration.",
    duration: "42s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Divine", "Traditional", "Gold Mandap", "Luxury", "Royal"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "",
      photoSlides: 4,
      turnaround: "1-2 Business Days",
      colorPalette: [],
      detailsNeeded: ["Bride Name", "Groom Name", "Wedding Date", "Wedding Time", "Venue Name & Address"]
    }
  },
  {
    id: "banner-wedding-reception",
    title: "Grand Golden Welcome Banner",
    category: "Banners",
    categories: ["Banners"],
    videoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    description: "Stunning high-resolution backdrop welcome banner design to place at your wedding stage or reception hall entrance. Fully customized with couple names, date, and colors, ready to print.",
    duration: "Static",
    ratio: "16:9",
    priceTier: "Premium",
    tags: ["Stage Backdrop", "Gold Luxury", "Welcome Banner", "Physical Print Setup"],
    specs: {
      resolution: "High-Res Vector PDF / PNG for Printing",
      musicStyle: "No soundtrack (Static Backdrop Design)",
      photoSlides: 0,
      turnaround: "1 Business Day",
      colorPalette: ["#D4AF37", "#FFFFFF", "#1E1E1E"],
      detailsNeeded: ["Couple Names", "Reception Date", "Venue Name", "Custom Welcome Quote"]
    }
  },
  {
    id: "banner-birthday-neon",
    title: "Birthday Photo Booth Backdrop",
    category: "Banners",
    categories: ["Banners"],
    videoUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200",
    description: "Vibrant high-resolution backdrop banner design ready to print. Perfect for a birthday photo booth area, custom balloons frame, or a main cake-cutting table backdrop.",
    duration: "Static",
    ratio: "16:9",
    priceTier: "Standard",
    tags: ["Photo Booth Setup", "Vibrant Balloon Backdrop", "Wall Banner", "Birthday Decor"],
    specs: {
      resolution: "High-Res Vector PDF / JPEG for Printing",
      musicStyle: "No soundtrack (Static Design)",
      photoSlides: 1,
      turnaround: "24 Hours",
      colorPalette: ["#E040FB", "#00E5FF", "#111111"],
      detailsNeeded: ["Birthday Child Name", "Age (Turning X)", "Party Date & Time", "Theme / Color Preference"]
    }
  },
  {
    id: "photo-wedding-classic",
    title: "Gold Floral Border Arch Digital Card",
    category: "photos",
    categories: ["photos"],
    videoUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1200",
    description: "Exquisite static invitation card image, custom designed for instant sharing on WhatsApp, Telegram, or for high-quality printing on texture paper.",
    duration: "Static",
    ratio: "9:16",
    priceTier: "Standard",
    tags: ["Floral Arch Border", "E-Card Still", "WhatsApp Shareable", "Traditional Print"],
    specs: {
      resolution: "Ultra HD (300 DPI for Print)",
      musicStyle: "No soundtrack (Static E-Card Photo)",
      photoSlides: 1,
      turnaround: "24 Hours",
      colorPalette: ["#FAFAF9", "#8B5CF6", "#D4AF37"],
      detailsNeeded: ["Bride & Groom Names", "Wedding Event Date", "Auspicious Timings", "Venue Details", "RSVP Contact Info"]
    }
  },
  {
    id: "photo-saree-ceremony-still",
    title: "Silk Pattern Saree Ceremony E-Card",
    category: "photos",
    categories: ["photos"],
    videoUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200",
    description: "Stunning high-resolution traditional Indian silk and jewelry themed digital card photo. Customized with your ceremony details, timing, and coordinates.",
    duration: "Static",
    ratio: "9:16",
    priceTier: "Standard",
    tags: ["Silk Fabric Pattern", "Traditional Indian Jewelry", "Saree Ceremony Still"],
    specs: {
      resolution: "Ultra HD JPEG / PNG",
      musicStyle: "No soundtrack (Static E-Card Photo)",
      photoSlides: 0,
      turnaround: "12 Hours",
      colorPalette: ["#880E4F", "#FFD54F", "#006064"],
      detailsNeeded: ["Daughter / Bride Name", "Ceremony Date & Time", "Host / Family Names", "Venue Address & Landmark"]
    }
  },
  {
    id: "photo-teja-studios-royal-floral",
    title: "Teja Studios Royal Floral Invitation Card",
    category: "photos",
    categories: ["photos"],
    videoUrl: "https://drive.google.com/file/d/1CoMkdoG59jHM4lLI-CS3vGv2eoriyx9y/view?usp=drive_link",
    description: "An elegant custom royal floral themed invitation card with divine traditional borders, premium typography, and customizable event details. Perfect for instant WhatsApp sharing.",
    duration: "Static",
    ratio: "9:16",
    priceTier: "Premium",
    tags: ["Teja Studios", "Royal Card", "E-Card Still", "WhatsApp Shareable", "Gold Floral"],
    specs: {
      resolution: "Ultra HD (300 DPI for Print)",
      musicStyle: "No soundtrack (Static E-Card Photo)",
      photoSlides: 1,
      turnaround: "1 Business Day",
      colorPalette: ["#D4AF37", "#4A0E17", "#FAFAF9"],
      detailsNeeded: ["Bride & Groom Names", "Wedding Date & Time", "Auspicious Timings", "Venue Details", "RSVP Contact Info"]
    }
  },
  {
    id: "birthday-magical-stars-ai",
    title: "Magical Stars Dream Birthday Video",
    category: "Birthday Invitations",
    categories: ["Birthday Invitations", "Special AI"],
    videoUrl: "https://drive.google.com/file/d/11P5EF6HUFIrGFP7ftBIDNEKWE3O8XVhE/view?usp=drive_link",
    description: "A gorgeous modern birthday invitation video decorated with colorful whimsical magical stars and smooth slide transition animations. Perfectly synthesized with advanced AI.",
    duration: "30s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Magical Stars", "Kids Birthday", "Colorful Sparkles", "Teja Studios", "Animated Video"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Upbeat & Joyful Synth Music",
      photoSlides: 2,
      turnaround: "2 hours",
      colorPalette: ["#E040FB", "#3F51B5", "#FFD54F"],
      detailsNeeded: ["Name", "Parents Name", "Date", "Time", "Venue"]
    }
  },
  {
    id: "birthday-jungle-adventure-ai",
    title: "Cute Jungle Safari Birthday Video",
    category: "Birthday Invitations",
    categories: ["Birthday Invitations", "Special AI"],
    videoUrl: "https://drive.google.com/file/d/1G4z9KhinbFVDf64R43zG1yeyO7_wGXEV/view?usp=drive_link",
    description: "A playful, lovely cartoon animal and jungle safari themed birthday invitation video featuring delightful transitions. High quality dynamic motion graphics.",
    duration: "35s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Jungle Safari", "Cute Cartoon", "Adventure Theme", "Special AI", "Animated Video"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Cheerful & Energetic Soundtrack",
      photoSlides: 3,
      turnaround: "2 hours",
      colorPalette: ["#4CAF50", "#FF9800", "#FFEB3B"],
      detailsNeeded: ["Name", "Parents Name", "Date", "Time", "Venue"]
    }
  },
  {
    id: "birthday-royal-gold-ai",
    title: "Royal Gold Sparkle Kids Birthday Video",
    category: "Birthday Invitations",
    categories: ["Birthday Invitations", "Special AI"],
    videoUrl: "https://drive.google.com/file/d/1fi39tZ9tK_pY2AcFUjhaMMM-KvvJm0vh/view?usp=drive_link",
    description: "Premium gold-flecked luxury birthday invitation video featuring beautiful glowing slow-motion particle effects, elegant scripts, and stylish transitions.",
    duration: "40s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Royal Sparkle", "Golden Glitter", "Luxury Birthday", "Special AI", "Animated Video"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Elegant & Majestic Orchestra",
      photoSlides: 2,
      turnaround: "2 hours",
      colorPalette: ["#D4AF37", "#1A1A1A", "#FFFFFF"],
      detailsNeeded: ["Name", "Parents Name", "Date", "Time", "Venue"]
    }
  },
  {
    id: "wedding-traditional-grand-ai",
    title: "Divine Traditional Grand Wedding Video",
    category: "Wedding Invitations",
    categories: ["Wedding Invitations", "AI Wedding Invitations", "Special AI"],
    videoUrl: "https://drive.google.com/file/d/1gc5Ub9XjLjlxvZwteTlgBYr8QGn3E7yT/view?usp=drive_link",
    description: "Elegant traditional wedding invitation video featuring gorgeous golden transition layouts, divine ornaments, and seamless pacing. Handcrafted with advanced AI synthesis.",
    duration: "10s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Divine Gold", "Traditional Wedding", "Special AI", "Animated Video", "Fast Turnaround"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Melodious Divine Shehnai Beats",
      photoSlides: 0,
      turnaround: "2 hours",
      colorPalette: ["#D4AF37", "#9E0B0F", "#FFFFFF"],
      detailsNeeded: ["Bride & Groom Names", "Date", "Time", "Venue"]
    }
  },
  {
    id: "wedding-royal-golden-ai",
    title: "Royal Golden Glitter Wedding Video",
    category: "Wedding Invitations",
    categories: ["Wedding Invitations", "AI Wedding Invitations", "Special AI"],
    videoUrl: "https://drive.google.com/file/d/1_82CD6L-JxieBBVaZl9AhKvYVfnAFj1a/view?usp=drive_link",
    description: "A luxury gold themed wedding invitation video showcasing premium animations, sparkling transitions, and sleek modern typography. Ideal for high-end celebrations.",
    duration: "10s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Royal Gold", "Sparkling Luxury", "Wedding Invite", "Special AI", "Fast Turnaround"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Majestic Grand Orchestra",
      photoSlides: 0,
      turnaround: "2 hours",
      colorPalette: ["#D4AF37", "#111111", "#FAFAF9"],
      detailsNeeded: ["Bride & Groom Names", "Date", "Time", "Venue"]
    }
  }
];

