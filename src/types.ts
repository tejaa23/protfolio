export interface VideoTemplate {
  id: string;
  title: string;
  category: string;
  categories: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  duration: string;
  ratio: "9:16" | "16:9";
  priceTier: "Standard" | "Premium" | "Signature";
  tags: string[];
  pinned?: boolean;
  specs: {
    resolution: string;
    musicStyle: string;
    photoSlides: number;
    turnaround: string;
    colorPalette: string[];
    detailsNeeded?: string[];
  };
}

export interface Inquiry {
  id: string;
  templateId: string;
  templateTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  customNotes: string;
  status: "Pending" | "Contacted" | "Completed";
  createdAt: string;
}

export const CATEGORIES = [
  "All",
  "Wedding Invitations",
  "Birthday Invitations",
  "saree ceremony invitation",
  "cradle ceremony invitation",
  "All AI Invitations",
  "AI Wedding Invitations",
  "Wedding Voiceover Invitations",
  "Special AI",
  "other",
  "Banners",
  "photos"
] as const;
