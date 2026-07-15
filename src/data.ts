import { VideoTemplate } from "./types";

export const INITIAL_TEMPLATES: VideoTemplate[] = [
  {
    id: "wedding-teja-elegant",
    title: "Teja Studios Divine Gold Wedding",
    category: "Wedding",
    videoUrl: "https://drive.google.com/file/d/1uFcS8rj3xM8mdv7Qxmf4nIXaSjKICbOw/view?usp=drive_link",
    description: "A premium wedding invitation designed with divine traditional details, ornate golden frames, shimmering light leaks, and elegant transition effects. Perfect for a grand and traditional celebration.",
    duration: "42s",
    ratio: "9:16",
    priceTier: "Signature",
    tags: ["Divine", "Traditional", "Gold Mandap", "Luxury", "Royal"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Classical Shehnai & Cinematic Strings Fusion",
      photoSlides: 4,
      turnaround: "1-2 Business Days",
      colorPalette: ["#D4AF37", "#800020", "#FFFFFF"] // Gold, Maroon, White
    }
  },
  {
    id: "wedding-garden-watercolor",
    title: "Whimsical Garden Watercolor",
    category: "Wedding",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40030-large.mp4",
    description: "An elegant, romantic showcase featuring soft watercolor flowers blooming gracefully as details unfold on screen. Highly customizable text styling makes it perfect for rustic, garden, or destination weddings.",
    duration: "45s",
    ratio: "16:9",
    priceTier: "Premium",
    tags: ["Floral", "Watercolor", "Acoustic", "Chic", "Pastel Theme"],
    specs: {
      resolution: "1920x1080 (Full HD)",
      musicStyle: "Acoustic Guitar & Gentle Cello Duo",
      photoSlides: 4,
      turnaround: "1-2 Business Days",
      colorPalette: ["#FADADD", "#E2F0CB", "#5C5C5C"] // Pale Pink, Sage Green, Charcoal
    }
  },
  {
    id: "save-date-sunset-beach",
    title: "Sunset Coast Countdown",
    category: "Save the Date",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-strolling-on-the-beach-at-sunset-40019-large.mp4",
    description: "Announce your special day with an atmospheric golden-hour beach aesthetic. Features elegant modern serif overlays, a live-animated countdown clock, and smooth parallax image movements.",
    duration: "15s",
    ratio: "9:16",
    priceTier: "Standard",
    tags: ["Beach", "Countdown", "Romantic", "Modern Serif", "Reels Ready"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Uplifting Acoustic Indie & Folk",
      photoSlides: 1,
      turnaround: "24 Hours",
      colorPalette: ["#FF7F50", "#FFE4B5", "#2C3E50"] // Coral, Sunset Gold, Slate
    }
  },
  {
    id: "birthday-neon-sparks",
    title: "Midnight Neon Glow Party",
    category: "Birthday",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-friends-celebrating-with-sparklers-43306-large.mp4",
    description: "Inject energy into your milestone birthday invitation! Perfect for 18th, 21st, 30th, or VIP night celebrations. Designed with glowing neon highlights, vibrant fonts, and beat-synced sparkler effects.",
    duration: "20s",
    ratio: "9:16",
    priceTier: "Standard",
    tags: ["Vibrant", "Sparkler", "Upbeat", "Neon", "Milestone Birthday"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Upbeat Modern Pop & Electronic Beats",
      photoSlides: 2,
      turnaround: "24 Hours",
      colorPalette: ["#39FF14", "#FF007F", "#121212"] // Neon Green, Neon Pink, Deep Obsidian
    }
  },
  {
    id: "anniversary-candlelight-memories",
    title: "Elegant Candlelight Toast",
    category: "Anniversary",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-couple-toasting-with-champagne-glasses-40004-large.mp4",
    description: "Honor a lifetime of love with this timeless silver or golden anniversary highlight reel. Includes a beautifully animated photo timeline tracking your journey together with classy jazz overlays.",
    duration: "40s",
    ratio: "16:9",
    priceTier: "Premium",
    tags: ["Intimate", "Candlelight", "Timeline", "Classy Jazz", "Anniversary"],
    specs: {
      resolution: "1920x1080 (Full HD)",
      musicStyle: "Warm Acoustic Jazz Trio (Piano, Bass, Sax)",
      photoSlides: 6,
      turnaround: "2-3 Business Days",
      colorPalette: ["#C0C0C0", "#800020", "#3E2723"] // Silver, Deep Burgundy, Chestnut
    }
  },
  {
    id: "baby-shower-pastel-sky",
    title: "Sweet Floating Clouds",
    category: "Baby Shower",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-baby-feet-moving-gently-41527-large.mp4",
    description: "Welcome your baby with this adorable pastel sky invitation. Features hand-illustrated balloons drifting gently past fluffy white clouds, custom ultrasound picture slots, and cute baby-foot motifs.",
    duration: "25s",
    ratio: "9:16",
    priceTier: "Standard",
    tags: ["Cute", "Baby Shower", "Pastel Blue & Pink", "Lullaby", "Whimsical"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Sweet Glockenspiel Lullaby & Acoustic Guitar",
      photoSlides: 2,
      turnaround: "24 Hours",
      colorPalette: ["#BFFCC6", "#FFC6FF", "#E8F0FE"] // Mint Green, Soft Pink, Baby Blue
    }
  },
  {
    id: "other-diwali-lights",
    title: "Sparkling Diwali Homecoming",
    category: "Festival & Other",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-birthday-cake-with-burning-candles-42934-large.mp4", // Multi-purpose burning lights
    description: "A sparkling festive invitation with elegant traditional clay lamps (Diyas) and cascading marigold garlands. Perfect for Diwali gatherings, Housewarmings (Griha Pravesh), or cultural events.",
    duration: "30s",
    ratio: "9:16",
    priceTier: "Premium",
    tags: ["Traditional", "Festive", "Clay Lamps", "Marigold", "Housewarming"],
    specs: {
      resolution: "1080x1920 (HD Vertical)",
      musicStyle: "Festive Instrumental Sitar & Tabla Fusion",
      photoSlides: 1,
      turnaround: "1-2 Business Days",
      colorPalette: ["#FF9933", "#D4AF37", "#4A0E17"] // Saffron Orange, Gold, Deep Maroon
    }
  }
];
