export interface VideoTemplate {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  duration: string;
  ratio: "9:16" | "16:9";
  priceTier: "Standard" | "Premium" | "Signature";
  tags: string[];
  specs: {
    resolution: string;
    musicStyle: string;
    photoSlides: number;
    turnaround: string;
    colorPalette: string[];
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
  "Wedding",
  "Save the Date",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Festival & Other"
] as const;
