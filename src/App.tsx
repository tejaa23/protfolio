import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { 
  Search, 
  Sparkles, 
  Film, 
  Heart, 
  Calendar, 
  Clock, 
  Maximize2, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Plus, 
  Trash, 
  X, 
  ChevronRight, 
  Palette, 
  CheckCircle, 
  TrendingUp, 
  Tv, 
  Settings, 
  MessageSquare, 
  Send,
  PlusCircle,
  Video,
  FileText,
  Pencil,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoTemplate, Inquiry, CATEGORIES } from "./types";
import { INITIAL_TEMPLATES } from "./data";
import VideoPlayer from "./components/VideoPlayer";

// Helper to convert Google Drive sharing links into direct high-speed thumbnail/image embed links
const getImageUrl = (url: string) => {
  if (!url) return "";
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([^/?#&\s]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    // /thumbnail?id=...&sz=w1600 is highly optimized, bypasses anti-bot virus checking screens, and handles parallel requests beautifully
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  }
  return url;
};

// Backup URL for Google Drive files if the primary thumbnail endpoint hits any issue
const getBackupImageUrl = (url: string) => {
  if (!url) return "";
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([^/?#&\s]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};

export default function App() {
  // --- STATE ---
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Navigation & Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  
  // Forms & Interactive panels
  const [isCreatorMode, setIsCreatorMode] = useState<boolean>(false);
  const [showInquirySuccess, setShowInquirySuccess] = useState<boolean>(false);
  const [activeInquiry, setActiveInquiry] = useState<Partial<Inquiry> | null>(null);

  // Creator Access Key Lock & Custom Passcode
  const [workspaceKey, setWorkspaceKey] = useState<string>(() => localStorage.getItem("creator_workspace_key") || "1234");
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);
  const [enteredKey, setEnteredKey] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");
  const [isChangingKey, setIsChangingKey] = useState<boolean>(false);
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  
  // Customer Inquiry form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [inquiryError, setInquiryError] = useState("");

  // New Template creation state (for Creator Workspace)
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Wedding Invitations");
  const [newCategories, setNewCategories] = useState<string[]>(["Wedding Invitations"]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("30s");
  const [newRatio, setNewRatio] = useState<"9:16" | "16:9">("9:16");
  const [newPriceTier, setNewPriceTier] = useState<"Standard" | "Premium" | "Signature">("Premium");
  const [newTags, setNewTags] = useState("");
  const [newResolution, setNewResolution] = useState("1080x1920 (HD Vertical)");
  const [newMusicStyle, setNewMusicStyle] = useState("Instrumental");
  const [newPhotoSlides, setNewPhotoSlides] = useState(3);
  const [newTurnaround, setNewTurnaround] = useState("2 Business Days");
  const [newColorPalette, setNewColorPalette] = useState("#D4AF37,#0C2340,#FFFFFF");
  const [newDetailsNeeded, setNewDetailsNeeded] = useState("Bride Name, Groom Name, Wedding Date, Wedding Time, Venue Name & Address");
  const [creatorError, setCreatorError] = useState("");
  const [creatorSuccess, setCreatorSuccess] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<VideoTemplate | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null);
  const [inquiryToDeleteId, setInquiryToDeleteId] = useState<string | null>(null);

  const [clientCustomDetails, setClientCustomDetails] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedTemplate) {
      const initial: Record<string, string> = {};
      const fields = selectedTemplate.specs.detailsNeeded || [];
      fields.forEach(field => {
        initial[field] = "";
      });
      setClientCustomDetails(initial);
    } else {
      setClientCustomDetails({});
    }
  }, [selectedTemplate]);

  // --- INITIALIZATION & LOCALSTORAGE ---
  useEffect(() => {
    const storedTemplates = localStorage.getItem("invitation_templates");
    if (storedTemplates) {
      try {
        let parsed = JSON.parse(storedTemplates) as VideoTemplate[];
        
        // Migrate and clean default videos (keeping only wedding-teja-elegant among videos)
        let migrated = false;
        
        // Remove all other original default videos
        const initialVideoIds = [
          "wedding-garden-watercolor",
          "birthday-neon-sparks",
          "birthday-kids-safari",
          "saree-traditional-silk",
          "cradle-sweet-arrival",
          "ai-wedding-avatar",
          "voiceover-grand-story",
          "special-ai-multiverse",
          "other-diwali-lights",
          "anniversary-candlelight"
        ];
        
        const hasOtherDefaultVideos = parsed.some(t => initialVideoIds.includes(t.id));
        if (hasOtherDefaultVideos) {
          parsed = parsed.filter(t => !initialVideoIds.includes(t.id));
          migrated = true;
        }

        // Ensure all default templates from INITIAL_TEMPLATES are present in local storage list
        INITIAL_TEMPLATES.forEach(initialT => {
          const hasTemplate = parsed.some(t => t.id === initialT.id);
          if (!hasTemplate) {
            parsed.push(initialT);
            migrated = true;
          }
        });

        // Clean up any old default templates that have been deleted from INITIAL_TEMPLATES in the code
        const initialTemplateIds = INITIAL_TEMPLATES.map(t => t.id);
        const beforePruneCount = parsed.length;
        parsed = parsed.filter(t => {
          if (t.id.startsWith("custom-")) {
            return true; // Keep user-generated custom templates
          }
          return initialTemplateIds.includes(t.id); // Keep built-in templates only if they still exist in INITIAL_TEMPLATES
        });
        if (parsed.length !== beforePruneCount) {
          migrated = true;
        }

        // Auto-migrate each template to make sure it has the `categories` field
        parsed = parsed.map(t => {
          if (!t.categories) {
            t.categories = [t.category];
            migrated = true;
          }
          return t;
        });

        if (migrated) {
          localStorage.setItem("invitation_templates", JSON.stringify(parsed));
        }
        setTemplates(parsed);
      } catch (e) {
        setTemplates(INITIAL_TEMPLATES);
      }
    } else {
      setTemplates(INITIAL_TEMPLATES);
      localStorage.setItem("invitation_templates", JSON.stringify(INITIAL_TEMPLATES));
    }

    const storedInquiries = localStorage.getItem("invitation_inquiries");
    if (storedInquiries) {
      try {
        setInquiries(JSON.parse(storedInquiries));
      } catch (e) {
        setInquiries([]);
      }
    }
    // Set default clean search
    setSearchQuery("");
  }, []);

  // Sync templates to localStorage
  const saveTemplates = (newTemplates: VideoTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("invitation_templates", JSON.stringify(newTemplates));
  };

  // Sync inquiries to localStorage
  const saveInquiries = (newInquiries: Inquiry[]) => {
    setInquiries(newInquiries);
    localStorage.setItem("invitation_inquiries", JSON.stringify(newInquiries));
  };

  // --- HANDLERS ---
  const handleEditTemplate = (template: VideoTemplate, e: MouseEvent) => {
    e.stopPropagation();
    setEditingTemplate(template);
    setNewTitle(template.title);
    setNewCategory(template.category);
    setNewCategories(template.categories || [template.category]);
    setNewVideoUrl(template.videoUrl);
    setNewDescription(template.description);
    setNewDuration(template.duration);
    setNewRatio(template.ratio);
    setNewPriceTier(template.priceTier);
    setNewTags(template.tags.join(", "));
    setNewResolution(template.specs.resolution);
    setNewMusicStyle(template.specs.musicStyle);
    setNewPhotoSlides(template.specs.photoSlides);
    setNewTurnaround(template.specs.turnaround);
    setNewColorPalette(template.specs.colorPalette.join(","));
    setNewDetailsNeeded((template.specs.detailsNeeded || []).join(", "));
    setCreatorError("");
    setCreatorSuccess("");

    // Smooth scroll up to the Creator Workspace form
    const formElement = document.getElementById("creator-workspace-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setNewTitle("");
    setNewCategory("Wedding Invitations");
    setNewCategories(["Wedding Invitations"]);
    setNewVideoUrl("");
    setNewDescription("");
    setNewDuration("30s");
    setNewRatio("9:16");
    setNewPriceTier("Premium");
    setNewTags("");
    setNewResolution("1080x1920 (HD Vertical)");
    setNewMusicStyle("Instrumental");
    setNewPhotoSlides(3);
    setNewTurnaround("2 Business Days");
    setNewColorPalette("#D4AF37,#0C2340,#FFFFFF");
    setNewDetailsNeeded("Bride Name, Groom Name, Wedding Date, Wedding Time, Venue Name & Address");
    setCreatorError("");
    setCreatorSuccess("");
  };

  const handleCopyExportCode = () => {
    const dataTsCode = `import { VideoTemplate } from "./types";

export const INITIAL_TEMPLATES: VideoTemplate[] = ${JSON.stringify(templates, null, 2)};
`;
    navigator.clipboard.writeText(dataTsCode)
      .then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      })
      .catch(() => {
        // Fallback if clipboard API fails
        const textarea = document.getElementById("export-code-textarea") as HTMLTextAreaElement;
        if (textarea) {
          textarea.select();
          document.execCommand("copy");
          setCopiedCode(true);
          setTimeout(() => setCopiedCode(false), 2500);
        }
      });
  };

  const handleAddTemplate = (e: FormEvent) => {
    e.preventDefault();
    setCreatorError("");
    setCreatorSuccess("");

    if (!newTitle.trim() || !newVideoUrl.trim() || !newDescription.trim()) {
      setCreatorError("Please fill out Title, Video URL, and Description.");
      return;
    }

    if (newCategories.length === 0) {
      setCreatorError("Please select at least one category.");
      return;
    }

    const isVideo = !newCategories.includes("Banners") && !newCategories.includes("photos");

    const templateData: VideoTemplate = {
      id: editingTemplate ? editingTemplate.id : "custom-" + Date.now(),
      title: newTitle.trim(),
      category: newCategories[0] || "other",
      categories: newCategories,
      videoUrl: newVideoUrl.trim(),
      description: newDescription.trim(),
      duration: newDuration,
      ratio: newRatio,
      priceTier: isVideo ? "Standard" : newPriceTier,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      specs: {
        resolution: newResolution,
        musicStyle: isVideo ? "" : newMusicStyle,
        photoSlides: Number(newPhotoSlides) || 0,
        turnaround: newTurnaround,
        colorPalette: isVideo ? [] : newColorPalette.split(",").map(c => c.trim()).filter(Boolean),
        detailsNeeded: newDetailsNeeded.split(",").map(d => d.trim()).filter(Boolean)
      }
    };

    let updated: VideoTemplate[];
    if (editingTemplate) {
      updated = templates.map(t => t.id === editingTemplate.id ? templateData : t);
      setCreatorSuccess("Successfully updated template details!");
    } else {
      updated = [templateData, ...templates];
      setCreatorSuccess("Successfully added template to portfolio!");
    }

    saveTemplates(updated);
    
    // Reset Form
    setEditingTemplate(null);
    setNewTitle("");
    setNewCategory("Wedding Invitations");
    setNewCategories(["Wedding Invitations"]);
    setNewVideoUrl("");
    setNewDescription("");
    setNewDuration("30s");
    setNewRatio("9:16");
    setNewPriceTier("Premium");
    setNewTags("");
    setNewResolution("1080x1920 (HD Vertical)");
    setNewMusicStyle("Instrumental");
    setNewPhotoSlides(3);
    setNewTurnaround("2 Business Days");
    setNewColorPalette("#D4AF37,#0C2340,#FFFFFF");
    setNewDetailsNeeded("Bride Name, Groom Name, Wedding Date, Wedding Time, Venue Name & Address");
  };

  const handleDeleteTemplate = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setTemplateToDeleteId(id);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDeleteId) {
      const updated = templates.filter(t => t.id !== templateToDeleteId);
      saveTemplates(updated);
      if (editingTemplate?.id === templateToDeleteId) {
        handleCancelEdit();
      }
      setTemplateToDeleteId(null);
    }
  };

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    setInquiryError("");

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setInquiryError("Please fill in your name, email, and phone number.");
      return;
    }

    const templateId = selectedTemplate ? selectedTemplate.id : "general";
    const templateTitle = selectedTemplate ? selectedTemplate.title : "General Custom Design";

    const newInquiry: Inquiry = {
      id: "inquiry-" + Date.now(),
      templateId,
      templateTitle,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      eventDate: eventDate || "TBD",
      customNotes: customNotes.trim(),
      status: "Pending",
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);

    // Setup success visual state
    setActiveInquiry(newInquiry);
    setShowInquirySuccess(true);
    
    // Clear Form fields
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setEventDate("");
    setCustomNotes("");
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: "Pending" | "Contacted" | "Completed") => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    saveInquiries(updated);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiryToDeleteId(id);
  };

  const confirmDeleteInquiry = () => {
    if (inquiryToDeleteId) {
      const updated = inquiries.filter(inq => inq.id !== inquiryToDeleteId);
      saveInquiries(updated);
      setInquiryToDeleteId(null);
    }
  };

  const handleVerifyPasscode = (e: FormEvent) => {
    e.preventDefault();
    if (enteredKey === workspaceKey) {
      sessionStorage.setItem("is_creator_authenticated", "true");
      setIsCreatorMode(true);
      setIsPasscodeModalOpen(false);
      setEnteredKey("");
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid access key. Please try again.");
    }
  };

  const handleChangePasscode = (e: FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) {
      setCreatorError("Passcode cannot be empty!");
      return;
    }
    localStorage.setItem("creator_workspace_key", newKeyInput.trim());
    setWorkspaceKey(newKeyInput.trim());
    setNewKeyInput("");
    setIsChangingKey(false);
    setCreatorSuccess("Creator Workspace Access Key successfully updated!");
  };

  // --- FILTERED TEMPLATES ---
  const filteredTemplates = templates.filter(t => {
    let matchesCategory = false;
    const templateCategories = t.categories || [t.category];
    
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "All AI Invitations") {
      matchesCategory = templateCategories.some(cat => [
        "AI Wedding Invitations",
        "Wedding Voiceover Invitations",
        "Special AI",
        "other"
      ].includes(cat));
    } else {
      matchesCategory = templateCategories.includes(selectedCategory);
    }
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      templateCategories.some(cat => cat.toLowerCase().includes(searchLower)) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* HEADER & BRANDING */}
      <header className="glass sticky top-0 z-40 transition-all duration-300 border-b border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo / Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <Film size={20} className="stroke-[2]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  TEJA <span className="text-zinc-500 font-medium">STUDIOS</span>
                </h1>
                <p className="text-[9px] text-violet-400 font-bold tracking-widest uppercase">
                  Invitation Videos
                </p>
              </div>
            </div>

            {/* Quick Contacts & Mode Toggle */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-5 text-xs text-zinc-400 font-medium mr-2">
                <div className="flex items-center gap-1.5 hover:text-violet-400 transition">
                  <Phone size={14} className="text-violet-400" />
                  <span>+91 85208 84267</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-violet-400 transition">
                  <Mail size={14} className="text-violet-400" />
                  <span>tejaarts09@gmail.com</span>
                </div>
              </div>

              {/* Creator Toggle Button */}
              <button
                onClick={() => {
                  if (isCreatorMode) {
                    setIsCreatorMode(false);
                  } else {
                    const isAuth = sessionStorage.getItem("is_creator_authenticated") === "true";
                    if (isAuth) {
                      setIsCreatorMode(true);
                    } else {
                      setEnteredKey("");
                      setPasscodeError("");
                      setIsPasscodeModalOpen(true);
                    }
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer ${
                  isCreatorMode 
                    ? "accent-gradient text-white hover:opacity-90 shadow-violet-500/20" 
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title="Toggle Creator Studio Dashboard"
              >
                <Settings size={14} className={isCreatorMode ? "animate-spin" : ""} />
                <span>{isCreatorMode ? "Exit Creator Workspace" : "Creator Workspace"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>




      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* IF CREATOR MODE IS ACTIVE, SHOW THE WORKSPACE DRAWER / SECTION */}
        {isCreatorMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 sm:p-8 bg-zinc-900 text-white rounded-2xl shadow-xl border border-zinc-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-lg font-extrabold tracking-tight">Creator Studio Workspace</h3>
                </div>
                <p className="text-zinc-400 text-xs mt-1">
                  Manage your public invitation templates portfolio and view incoming prospective client inquiries.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs items-center">
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-md border border-zinc-700 font-mono">
                  {templates.length} Templates Live
                </span>
                <span className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-md border border-violet-500/30 font-mono">
                  {inquiries.filter(i => i.status === "Pending").length} New Inquiries
                </span>
                <button
                  onClick={() => setIsChangingKey(!isChangingKey)}
                  className={`px-3 py-1 rounded-md border text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                    isChangingKey 
                      ? "bg-violet-600 border-violet-500 text-white" 
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  }`}
                  title="Change Workspace Access Passcode"
                >
                  <Settings size={12} className={isChangingKey ? "animate-spin" : ""} />
                  <span>Key Settings</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                  title="Export template database code to make changes live for all visitors"
                >
                  <Send size={12} />
                  <span>Sync/Export Live Code</span>
                </button>
              </div>
            </div>

            {/* INLINE ACCESS KEY PASSWORD CHANGE PANEL */}
            <AnimatePresence>
              {isChangingKey && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleChangePasscode}
                  className="mb-6 p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row gap-3 items-end overflow-hidden"
                >
                  <div className="flex-grow w-full sm:w-auto">
                    <label className="block text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Update Workspace Access Key (Current Key: <span className="text-violet-400 font-mono font-bold">{workspaceKey}</span>)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter new workspace passcode"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Save Key
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsChangingKey(false); setNewKeyInput(""); }}
                      className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form to add templates */}
              <div id="creator-workspace-form" className="lg:col-span-5 bg-zinc-950 p-5 rounded-xl border border-zinc-800 scroll-mt-6">
                <h4 className="text-sm font-bold text-violet-400 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                  {editingTemplate ? <Pencil size={15} /> : <PlusCircle size={15} />}
                  {editingTemplate ? `Edit Sample Video` : "Add New Sample Video"}
                </h4>
                {editingTemplate && (
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-3">
                    Editing: <span className="text-violet-400 font-mono">{editingTemplate.title}</span>
                  </p>
                )}
                
                <form onSubmit={handleAddTemplate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Video Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Classic Royal Wedding Roll"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Categories (Select all that apply) *</label>
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                      {CATEGORIES.filter(c => c !== "All" && c !== "All AI Invitations").map(cat => {
                        const isChecked = newCategories.includes(cat);
                        return (
                          <label key={cat} className="flex items-center gap-2 text-zinc-300 hover:text-white text-xs cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCategories([...newCategories, cat]);
                                } else {
                                  setNewCategories(newCategories.filter(c => c !== cat));
                                }
                              }}
                              className="rounded border-zinc-700 bg-zinc-950 text-violet-500 focus:ring-violet-500 h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{cat}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Format *</label>
                    <select
                      value={newRatio}
                      onChange={(e) => setNewRatio(e.target.value as "9:16" | "16:9")}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="9:16">Vertical (9:16)</option>
                      <option value="16:9">Widescreen (16:9)</option>
                    </select>
                  </div>
                </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Video URL (Direct MP4, YouTube, Vimeo, or Google Drive) *</label>
                    <input
                      type="text"
                      placeholder="e.g. https://drive.google.com/file/d/... or YouTube link"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono placeholder:font-sans focus:outline-none focus:border-violet-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Supports direct .mp4 links, standard YouTube watch links, Vimeo links, and shared Google Drive files (ensure Google Drive link is set to "Anyone with the link can view").</p>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Detailed Description *</label>
                    <textarea
                      placeholder="Describe the styling details, transitions, typography vibe, and recommended events..."
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {(() => {
                    const formIsVideo = !newCategories.includes("Banners") && !newCategories.includes("photos");
                    return (
                      <>
                        <div className={`grid ${formIsVideo ? "grid-cols-2" : "grid-cols-3"} gap-2`}>
                          <div>
                            <label className="block text-zinc-300 font-semibold mb-1">Duration</label>
                            <input
                              type="text"
                              placeholder="30s"
                              value={newDuration}
                              onChange={(e) => setNewDuration(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>
                          {!formIsVideo && (
                            <div>
                              <label className="block text-zinc-300 font-semibold mb-1">Price Tier</label>
                              <select
                                value={newPriceTier}
                                onChange={(e) => setNewPriceTier(e.target.value as "Standard" | "Premium" | "Signature")}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                              >
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                                <option value="Signature">Signature</option>
                              </select>
                            </div>
                          )}
                          <div>
                            <label className="block text-zinc-300 font-semibold mb-1">Photos Slots</label>
                            <input
                              type="number"
                              placeholder="3"
                              value={newPhotoSlides}
                              onChange={(e) => setNewPhotoSlides(Number(e.target.value))}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-zinc-300 font-semibold mb-1">Resolution Specs</label>
                            <input
                              type="text"
                              placeholder="1080x1920 (Vertical)"
                              value={newResolution}
                              onChange={(e) => setNewResolution(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-300 font-semibold mb-1">Turnaround Time</label>
                            <input
                              type="text"
                              placeholder="2 Business Days"
                              value={newTurnaround}
                              onChange={(e) => setNewTurnaround(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>

                        {!formIsVideo && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-zinc-300 font-semibold mb-1">Music Vibe / Genre</label>
                              <input
                                type="text"
                                placeholder="Classical Cinematic Violin"
                                value={newMusicStyle}
                                onChange={(e) => setNewMusicStyle(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
                              />
                            </div>
                            <div>
                              <label className="block text-zinc-300 font-semibold mb-1">Color Palette (Hex-csv)</label>
                              <input
                                type="text"
                                placeholder="#D4AF37,#0C2340,#FFFFFF"
                                value={newColorPalette}
                                onChange={(e) => setNewColorPalette(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Required Client Text Details (Comma-separated) *</label>
                    <input
                      type="text"
                      placeholder="Bride Name, Groom Name, Wedding Date, Wedding Time, Venue Name & Address"
                      value={newDetailsNeeded}
                      onChange={(e) => setNewDetailsNeeded(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Specify which custom text inputs the customer must provide when ordering (e.g. Names, Date, Venue, Age).</p>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Royal, Gold, Orchestral, Elegant"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {creatorError && (
                    <p className="text-rose-400 font-medium">{creatorError}</p>
                  )}
                  {creatorSuccess && (
                    <p className="text-emerald-400 font-medium">{creatorSuccess}</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className={`py-2.5 px-4 rounded-lg font-bold hover:opacity-90 transition cursor-pointer flex-grow text-white text-center ${
                        editingTemplate ? "bg-violet-600 border border-violet-500" : "accent-gradient"
                      }`}
                    >
                      {editingTemplate ? "Save Changes" : "Publish to Public Live Portfolio"}
                    </button>
                    {editingTemplate && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="py-2.5 px-3.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Inquiries inbox log */}
              <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col h-[520px]">
                <h4 className="text-sm font-bold text-violet-400 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                  <MessageSquare size={15} /> Incoming Booking Inquiries ({inquiries.length})
                </h4>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                  {inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10">
                      <FileText size={40} className="stroke-[1] mb-2" />
                      <p className="text-xs">No client inquiries received yet.</p>
                      <p className="text-[10px] text-zinc-600 mt-1">Submit inquiries using public forms to see them log here.</p>
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div 
                        key={inq.id} 
                        className={`p-4 rounded-lg border text-xs transition duration-200 ${
                          inq.status === "Pending" 
                            ? "bg-zinc-900 border-violet-500/30" 
                            : inq.status === "Contacted"
                            ? "bg-zinc-900/60 border-indigo-500/20"
                            : "bg-zinc-900/30 border-zinc-800"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                              Received: {inq.createdAt}
                            </span>
                            <h5 className="font-bold text-zinc-200 text-sm mt-0.5">{inq.clientName}</h5>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as "Pending" | "Contacted" | "Completed")}
                              className={`p-1 rounded text-[10px] font-bold focus:outline-none ${
                                inq.status === "Pending" 
                                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" 
                                  : inq.status === "Contacted"
                                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Completed">Completed</option>
                            </select>
                            
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-rose-400 transition"
                              title="Delete inquiry entry"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Event template title & details */}
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800/80 mb-3 text-zinc-300">
                          <p className="font-medium text-violet-400 flex items-center gap-1">
                            <Video size={10} /> {inq.templateTitle}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Event Date: <span className="text-white font-medium">{inq.eventDate}</span>
                          </p>
                        </div>

                        {/* Client details info */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 mb-2">
                          <p>Email: <span className="text-zinc-200 select-all font-mono">{inq.clientEmail}</span></p>
                          <p>Phone: <span className="text-zinc-200 select-all font-mono">{inq.clientPhone}</span></p>
                        </div>

                        {/* Custom notes */}
                        {inq.customNotes && (
                          <div className="bg-zinc-900/80 p-2 rounded text-zinc-400 italic">
                            &ldquo;{inq.customNotes}&rdquo;
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PORTFOLIO CATALOG FILTER BAR & SEARCH */}
        <div className="glass rounded-2xl p-5 mb-8 border border-zinc-800/85">
          <div className="flex flex-col gap-5">
            {/* Search and General Status row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Film size={15} className="text-violet-400" />
                  Portfolio Gallery
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Explore our premium video invites, voiceover creations, banners, and digital cards.</p>
              </div>
              
              {/* Search Box */}
              <div className="relative w-full lg:w-80">
                <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search wedding, birthday, banners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-800/50 focus:bg-zinc-900 border border-zinc-850 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-zinc-200 placeholder:text-zinc-500 transition-all outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categorized Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Reset/All filter button */}
              <div className="md:col-span-12 flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                    selectedCategory === "All"
                      ? "accent-gradient text-white shadow-lg shadow-violet-500/25"
                      : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/60"
                  }`}
                >
                  ✨ View All Designs
                </button>
              </div>

              {/* Group 1: VIDEO INVITATIONS */}
              <div className="md:col-span-4 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/40">
                <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Tv size={10} /> Video Invitations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Wedding Invitations",
                    "Birthday Invitations",
                    "saree ceremony invitation",
                    "cradle ceremony invitation"
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-violet-600 text-white shadow-sm font-semibold"
                          : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 2: AI INCLUDED */}
              <div className="md:col-span-5 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/40">
                <h4 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles size={10} /> AI Included
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "All AI Invitations",
                    "AI Wedding Invitations",
                    "Wedding Voiceover Invitations",
                    "Special AI",
                    "other"
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-fuchsia-600 text-white shadow-sm font-semibold"
                          : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                      }`}
                    >
                      {cat === "All AI Invitations" ? "✨ All AI" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 3: IMAGES */}
              <div className="md:col-span-3 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/40">
                <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <ImageIcon size={10} /> IMAGES (Prints & Cards)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Banners",
                    "photos"
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-teal-600 text-white shadow-sm font-semibold"
                          : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAMPLE VIDEOS PORTFOLIO GRID */}
        {filteredTemplates.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center border border-zinc-800 max-w-xl mx-auto shadow-sm">
            <Film size={48} className="text-zinc-500 mx-auto mb-4 stroke-[1.2]" />
            <h3 className="text-lg font-bold text-zinc-100 mb-1">No samples match your search</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Try clicking another category tab or clearing the search input to discover more templates.
            </p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold hover:bg-zinc-700 transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const isVertical = template.ratio === "9:16";
              
              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedTemplate(template)}
                  className="group glass-interactive rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
                  id={`card-${template.id}`}
                >
                  {/* Aspect Ratio Box Wrapper */}
                  <div className="relative overflow-hidden bg-zinc-950 aspect-video flex items-center justify-center">
                    
                    {/* Media representation */}
                    <div className="absolute inset-0 w-full h-full opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105">
                      {template.category === "Banners" || template.category === "photos" ? (
                        <img 
                          src={getImageUrl(template.videoUrl)} 
                          alt={template.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const backup = getBackupImageUrl(template.videoUrl);
                            if (backup && e.currentTarget.src !== backup) {
                              e.currentTarget.src = backup;
                            }
                          }}
                        />
                      ) : (
                        <VideoPlayer 
                          url={template.videoUrl} 
                          autoplay={false}
                          muted={true}
                          controls={false}
                          loop={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Dark gradient shadow inside card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-transparent z-10" />

                    {/* Format Indicator Tag */}
                    <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-zinc-250 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border border-white/10 z-20 flex items-center gap-1 uppercase">
                      {isVertical ? <Tv size={10} className="text-violet-400 rotate-90" /> : <Tv size={10} className="text-violet-400" />}
                      {template.ratio} Format
                    </span>

                    {/* Category Label */}
                    <span className="absolute top-3 right-3 bg-violet-600 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full z-20 uppercase">
                      {template.category}
                    </span>

                    {/* Duration / Clock indicator */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md text-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-md z-20">
                      <Clock size={10} className="text-violet-400" />
                      <span>{template.duration}</span>
                    </div>
                  </div>

                  {/* Card Info Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between z-20">
                    <div>
                      <div className="flex justify-between items-start gap-1 mb-1.5">
                        <h4 className="font-bold text-white text-base tracking-tight leading-tight group-hover:text-violet-400 transition">
                          {template.title}
                        </h4>
                        
                        {!(template.categories?.includes("Banners") || template.category === "Banners" || template.categories?.includes("photos") || template.category === "photos") ? null : (
                          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
                            template.priceTier === "Signature" 
                              ? "bg-violet-500/10 text-violet-400 border-violet-500/30" 
                              : template.priceTier === "Premium" 
                              ? "bg-zinc-800 text-zinc-350 border-zinc-750"
                              : "bg-zinc-900 text-zinc-400 border-zinc-800"
                          }`}>
                            {template.priceTier}
                          </span>
                        )}
                      </div>

                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                        {template.description}
                      </p>
                    </div>

                    {/* Specifications footer */}
                    <div className="border-t border-zinc-800/80 pt-3 mt-2">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-zinc-900 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-800/60">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-zinc-400 font-medium">
                        {(template.categories?.includes("Banners") || template.category === "Banners" || template.categories?.includes("photos") || template.category === "photos") && template.specs.colorPalette && template.specs.colorPalette.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Palette size={12} className="text-violet-400" />
                            <div className="flex gap-1">
                              {template.specs.colorPalette.map((col, idx) => (
                                <span 
                                  key={idx} 
                                  className="w-2.5 h-2.5 rounded-full border border-zinc-800 shadow-sm block" 
                                  style={{ backgroundColor: col }}
                                  title={col}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Creator-only Edit & Delete actions */}
                        {isCreatorMode && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleEditTemplate(template, e)}
                              className="text-violet-400 hover:text-violet-300 transition p-1 hover:bg-zinc-800 rounded-md"
                              title="Edit template details"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteTemplate(template.id, e)}
                              className="text-rose-400 hover:text-rose-300 transition p-1 hover:bg-zinc-800 rounded-md"
                              title="Delete template"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        )}
                        
                        <span className="text-violet-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          Inquire Details <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* GENERAL CONTACT & FAQ SECTION */}
        <section className="mt-16 glass rounded-3xl border border-zinc-800/85 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* FAQ Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-violet-950/20 to-zinc-900/40 p-8 sm:p-10 border-r border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4 border border-violet-500/20">
                <CheckCircle size={12} className="text-violet-400" />
                <span>Ordering Process</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white mb-6">Frequently Asked Questions</h3>

              <div className="space-y-6 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-zinc-100 mb-1.5">1. How do I order an invitation?</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Simply click on any video template above to review the details and watch the sample video. Then, tap either "Order via WhatsApp" or "Order via Email". This immediately generates a pre-filled order inquiry with the template name so we can coordinate your event details and photos!
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-100 mb-1.5">2. Can I change the music or language?</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Yes! You can choose any custom song or supply your own high-quality audio file. I can translate the templates to accommodate bilingual weddings and multi-cultural traditional phrases.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-100 mb-1.5">3. What is the typical turnaround time?</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Most standard video templates are fully completed and delivered to you via high-definition Drive or WhatsApp download links within 24 to 48 hours after your text and images are provided.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-400">
              <p className="font-medium text-zinc-200 mb-1">Teja Studios Location</p>
              <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
                <MapPin size={12} className="text-violet-400 shrink-0" />
                <span>Chevella, Hyderabad, Telangana, 501503</span>
              </div>
            </div>
          </div>

          {/* General Booking/Inquiry Form Column Replacement */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-zinc-900/10">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold tracking-tight text-white">Direct Custom Orders</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                To provide a fast and streamlined customer experience, we have removed complex text forms and registration screens. Simply browse our styles, choose the design you like, and reach out to us directly through WhatsApp or Email. There are absolutely no inputs required from you!
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Direct Chat Button */}
              <a
                href="https://wa.me/918520884267?text=Hello%20Teja%20Studios%2C%20I%20saw%20your%20amazing%20video%20invitation%20portfolio%20and%20would%20like%20to%20order%20a%20custom%20video!"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold tracking-wide transition duration-300 shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2.5 cursor-pointer text-center animate-fade-in"
              >
                <MessageSquare size={18} className="fill-white/10" />
                <span>Order Instantly on WhatsApp (+91 85208 84267)</span>
              </a>

              {/* Email Direct Button */}
              <a
                href="mailto:tejaarts09@gmail.com?subject=Custom%20Invitation%20Video%20Inquiry&body=Hello%20Teja%20Studios%2C%0D%0A%0D%0AI%20explored%20your%20video%20invitations%20portfolio%20and%20would%20like%20to%20discuss%20crafting%20a%20custom%20design%20for%20my%20upcoming%20event.%0D%0A%0D%0AThank%20you!"
                className="w-full py-4 px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-bold tracking-wide transition duration-300 border border-zinc-700/65 flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <Mail size={18} />
                <span>Email Us: tejaarts09@gmail.com</span>
              </a>

              {/* Direct Call / Contact Info Card */}
              <div className="mt-6 p-4 bg-zinc-950/70 border border-zinc-850 rounded-xl flex items-center gap-4 text-xs text-zinc-400">
                <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-lg shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">How we customize your invitation:</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed">Send us your text details, event photos, and optional custom music. We will send you a high-definition preview draft within 24-48 hours for your final approval.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 text-xs py-10 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 accent-gradient rounded flex items-center justify-center text-white font-bold text-xs">T</div>
                <span className="font-bold text-zinc-100 text-sm tracking-wide">Teja Studios</span>
              </div>
              <p className="text-zinc-500 text-[11px]">Cinematic, custom motion invitations. Designed and animated individually.</p>
            </div>

            <div className="flex gap-8 text-zinc-500 font-medium">
              <span className="hover:text-violet-400 transition cursor-pointer">Privacy Policy</span>
              <span className="hover:text-violet-400 transition cursor-pointer">Terms of Service</span>
              <span className="hover:text-violet-400 transition cursor-pointer">Creator Agreement</span>
            </div>

            <div>
              <p className="text-zinc-600 text-[10px]">© 2026 Teja Studios. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* DETAILED THEATER OVERLAY & INFORMATION MODAL */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-zinc-900 rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] lg:max-h-[85vh] shadow-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-12 text-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* VIDEO PLAYER COLUMN (Left/Top) */}
              <div className="md:col-span-6 bg-zinc-950 flex flex-col justify-between relative p-4 lg:p-6 min-h-[300px] md:min-h-0">
                {/* Close Button on top inside video side */}
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="absolute top-4 left-4 z-30 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-900/95 text-white/90 border border-white/10 transition cursor-pointer md:hidden"
                >
                  <X size={16} />
                </button>

                <div className="flex-grow flex items-center justify-center">
                  {/* Aspect Ratio Box Wrapper for Player */}
                  <div className={`w-full ${selectedTemplate.ratio === "9:16" ? "max-w-[310px] aspect-[9/16]" : "aspect-video"} rounded-xl overflow-hidden shadow-2xl relative`}>
                    {selectedTemplate.category === "Banners" || selectedTemplate.category === "photos" ? (
                      <img 
                        src={getImageUrl(selectedTemplate.videoUrl)} 
                        alt={selectedTemplate.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-zinc-950"
                        onError={(e) => {
                          const backup = getBackupImageUrl(selectedTemplate.videoUrl);
                          if (backup && e.currentTarget.src !== backup) {
                            e.currentTarget.src = backup;
                          }
                        }}
                      />
                    ) : (
                      <VideoPlayer 
                        url={selectedTemplate.videoUrl} 
                        autoplay={true}
                        muted={false}
                        controls={true}
                        loop={true}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Vertical format hint overlay */}
                <div className="text-center mt-3 text-zinc-500 text-[10px] font-mono tracking-wide hidden md:block">
                  {selectedTemplate.ratio === "9:16" ? "✦ Mobile portrait format (Perfect for smartphone screens) ✦" : "✦ Widescreen cinematic format (Perfect for emails & web players) ✦"}
                </div>
              </div>

              {/* SPECIFICATIONS & ACTION COLUMN (Right/Bottom) */}
              <div className="md:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-[90vh] lg:max-h-[85vh] border-l border-zinc-800/80">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <span className="text-[10px] bg-violet-500/10 text-violet-350 border border-violet-500/20 font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                        {selectedTemplate.category}
                      </span>
                      <h3 className="text-2xl font-extrabold tracking-tight text-white mt-2">
                        {selectedTemplate.title}
                      </h3>
                    </div>
                    
                    {/* Desktop Close Button */}
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer hidden md:block"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {selectedTemplate.description}
                  </p>

                  {/* Vibe Specs */}
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/80 mb-6">
                    <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">
                      Template Information & Specs
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs text-zinc-300">
                      {(() => {
                        const isVideo = !(selectedTemplate.categories?.includes("Banners") || selectedTemplate.category === "Banners" || selectedTemplate.categories?.includes("photos") || selectedTemplate.category === "photos");
                        return (
                          <>
                            <div>
                              <span className="text-zinc-500 block text-[10px]">Duration:</span>
                              <span className="font-semibold text-white">{selectedTemplate.duration}</span>
                            </div>
                            {!isVideo && (
                              <div>
                                <span className="text-zinc-500 block text-[10px]">Price Tier:</span>
                                <span className="font-semibold text-violet-400">{selectedTemplate.priceTier}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-zinc-500 block text-[10px]">Photo Slides Slots:</span>
                              <span className="font-semibold text-white">{selectedTemplate.specs.photoSlides} slides</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[10px]">Turnaround Delivery:</span>
                              <span className="font-semibold text-white">{selectedTemplate.specs.turnaround}</span>
                            </div>
                            {selectedTemplate.specs.detailsNeeded && selectedTemplate.specs.detailsNeeded.length > 0 && (
                              <div className="col-span-2 border-t border-zinc-800/80 pt-2.5">
                                <span className="text-zinc-500 block text-[10px] mb-1.5">Required Event Details:</span>
                                <div className="flex flex-wrap gap-1">
                                  {selectedTemplate.specs.detailsNeeded.map((det, idx) => (
                                    <span key={idx} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                      {det}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {!isVideo && selectedTemplate.specs.colorPalette && selectedTemplate.specs.colorPalette.length > 0 && (
                              <div className="col-span-2">
                                <span className="text-zinc-500 block text-[10px] mb-1">Recommended Vibe Palette:</span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {selectedTemplate.specs.colorPalette.map((col, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 py-0.5 px-2 rounded-full">
                                      <span 
                                        className="w-2.5 h-2.5 rounded-full border border-zinc-750 block" 
                                        style={{ backgroundColor: col }}
                                      />
                                      <span className="font-mono text-[9px] text-zinc-400 uppercase">{col}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {!isVideo && selectedTemplate.specs.musicStyle && (
                              <div className="col-span-2">
                                <span className="text-zinc-500 block text-[10px]">Soundtrack Style:</span>
                                <span className="font-semibold text-zinc-300 italic text-[13px] block mt-0.5">&ldquo;{selectedTemplate.specs.musicStyle}&rdquo;</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Core Features */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Included in personalization
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-violet-400" />
                        <span>Add couple photos / countdown</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-violet-400" />
                        <span>Swap songs with any preference</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-violet-400" />
                        <span>Bilingual / translation support</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-violet-400" />
                        <span>Free digital RSVP link inclusion</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Details Input Section */}
                  {selectedTemplate.specs.detailsNeeded && selectedTemplate.specs.detailsNeeded.length > 0 && (
                    <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 mb-4 animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-violet-400" />
                        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                          Fill Customization Details (Optional)
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        {selectedTemplate.specs.detailsNeeded.map((field) => (
                          <div key={field}>
                            <label className="block text-[10px] text-zinc-400 font-semibold mb-1 uppercase tracking-wider">
                              {field}
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter ${field.toLowerCase()}...`}
                              value={clientCustomDetails[field] || ""}
                              onChange={(e) => {
                                setClientCustomDetails(prev => ({
                                  ...prev,
                                  [field]: e.target.value
                                }));
                              }}
                              className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2.5 italic">
                        * Values typed here will instantly pre-fill your order message on WhatsApp/Email!
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Action Link */}
                {(() => {
                  const getWhatsAppUrl = () => {
                    let text = `Hello Teja Studios, I am interested in ordering the "${selectedTemplate.title}" video invitation template!\n\n`;
                    const fields = selectedTemplate.specs.detailsNeeded || [];
                    const filledFields = fields.filter(f => clientCustomDetails[f]?.trim());
                    
                    if (filledFields.length > 0) {
                      text += `Here are my customization details:\n`;
                      fields.forEach(f => {
                        const val = clientCustomDetails[f]?.trim() || "Not provided yet";
                        text += `- ${f}: ${val}\n`;
                      });
                    }
                    return `https://wa.me/918520884267?text=${encodeURIComponent(text)}`;
                  };

                  const getEmailUrl = () => {
                    const subject = `Video Invitation Order: ${selectedTemplate.title}`;
                    let body = `Hello Teja Studios,\n\nI am interested in ordering your "${selectedTemplate.title}" video invitation template.\n\n`;
                    const fields = selectedTemplate.specs.detailsNeeded || [];
                    const filledFields = fields.filter(f => clientCustomDetails[f]?.trim());
                    
                    if (filledFields.length > 0) {
                      body += `Here are my customization details:\n`;
                      fields.forEach(f => {
                        const val = clientCustomDetails[f]?.trim() || "Not provided yet";
                        body += `- ${f}: ${val}\n`;
                      });
                      body += `\n`;
                    }
                    body += `Please let me know the next steps.\n\nThank you!`;
                    return `mailto:tejaarts09@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  };

                  return (
                    <div className="border-t border-zinc-800 pt-5 mt-4 grid grid-cols-2 gap-3">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold tracking-wide transition shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare size={14} className="fill-white/10" />
                        <span>Order via WhatsApp</span>
                      </a>
                      <a
                        href={getEmailUrl()}
                        className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold tracking-wide transition border border-zinc-700 shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail size={14} />
                        <span>Order via Email</span>
                      </a>
                    </div>
                  );
                })()}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP FOR SUCCESSFUL INQUIRY SUBMISSION */}
      <AnimatePresence>
        {showInquirySuccess && activeInquiry && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center text-zinc-200 border border-zinc-800"
            >
              <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                <CheckCircle size={28} />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">Inquiry Submitted Successfully!</h3>
              <p className="text-zinc-400 text-xs mb-6">
                Thank you, <span className="font-semibold text-white">{activeInquiry.clientName}</span>! Your request has been recorded. I will contact you via <span className="font-semibold text-white">{activeInquiry.clientEmail}</span> or WhatsApp within 24 hours to begin customization.
              </p>

              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-left text-xs mb-6 space-y-1 text-zinc-300">
                <p className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-2">Request receipt details:</p>
                <p><span className="text-zinc-500">Selected:</span> <span className="font-semibold text-zinc-200">{activeInquiry.templateTitle}</span></p>
                <p><span className="text-zinc-500">Event Date:</span> <span className="font-semibold text-zinc-200">{activeInquiry.eventDate}</span></p>
                <p><span className="text-zinc-500">Your Phone:</span> <span className="font-semibold text-zinc-200">{activeInquiry.clientPhone}</span></p>
                {activeInquiry.customNotes && (
                  <p className="pt-2 italic text-zinc-400 border-t border-zinc-850 mt-2">&ldquo;{activeInquiry.customNotes}&rdquo;</p>
                )}
              </div>

              <button
                onClick={() => { setShowInquirySuccess(false); setActiveInquiry(null); }}
                className="w-full py-2.5 accent-gradient text-white hover:opacity-95 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Return to Gallery
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATOR ACCESS PASSCODE MODAL */}
      <AnimatePresence>
        {isPasscodeModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-800 text-center"
            >
              <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                <Settings size={22} className="animate-spin" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Creator Studio Lock</h3>
              <p className="text-zinc-400 text-xs mb-5">
                Please enter the Creator Access Key to access the dashboard and manage portfolio templates.
              </p>

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    placeholder="Enter Access Key (Default: 1234)"
                    value={enteredKey}
                    onChange={(e) => setEnteredKey(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-violet-500 text-center font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                    autoFocus
                  />
                  {passcodeError && (
                    <p className="text-rose-400 text-xs font-semibold mt-2">{passcodeError}</p>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                    💡 Note: The default access key is <span className="text-zinc-400 font-mono">1234</span>. You can change this key inside the workspace settings tab anytime.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasscodeModalOpen(false);
                      setEnteredKey("");
                      setPasscodeError("");
                    }}
                    className="w-1/2 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 accent-gradient text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Enter Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYNCHRONIZATION / CODE EXPORT MODAL */}
      <AnimatePresence>
        {isExportModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsExportModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-800 text-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Send size={18} />
                    <h3 className="text-lg font-bold text-white">Save Changes Permanently</h3>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">
                    Export your custom templates and make them visible to visitors on your live website.
                  </p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Informative Help Box */}
              <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/80 mb-5 text-xs text-zinc-300 space-y-2.5 text-left">
                <p className="font-semibold text-amber-400 flex items-center gap-1">
                  💡 How static persistence works:
                </p>
                <p className="leading-relaxed text-zinc-400">
                  Because this website runs directly inside your browser without a custom SQL database, any template modifications, new additions, or deletions are temporarily stored inside your computer's local browser memory (<code className="bg-zinc-900 px-1 py-0.5 rounded text-[11px] text-violet-400 font-mono">localStorage</code>).
                </p>
                <div className="pt-2 border-t border-zinc-850 space-y-2">
                  <p className="font-semibold text-zinc-200">To make these updates permanent for everyone online:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                    <li>Click the <span className="text-emerald-400 font-bold">"Copy Updated Code"</span> button below.</li>
                    <li>Paste the code into <code className="bg-zinc-900 px-1 py-0.5 rounded text-[11px] text-violet-400 font-mono">src/data.ts</code> file in the developer workbench to rewrite the database file, or copy-paste it into the AI Chat, and I will update it for you!</li>
                    <li>Re-deploy to GitHub Pages or Cloud Run. Done!</li>
                  </ol>
                </div>
              </div>

              {/* Textarea containing generated code */}
              <div className="relative mb-5 text-left">
                <textarea
                  id="export-code-textarea"
                  readOnly
                  rows={8}
                  value={`import { VideoTemplate } from "./types";\n\nexport const INITIAL_TEMPLATES: VideoTemplate[] = ${JSON.stringify(templates, null, 2)};\n`}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-[11px] text-zinc-300 font-mono outline-none focus:border-zinc-700 resize-none"
                />
                <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-zinc-600 bg-zinc-900/80 px-2 py-1 rounded">
                  {templates.length} templates
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyExportCode}
                  className={`w-1/2 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    copiedCode 
                      ? "bg-emerald-600 text-white shadow-lg animate-pulse" 
                      : "accent-gradient text-white hover:opacity-95"
                  }`}
                >
                  <CheckCircle size={15} className={copiedCode ? "block" : "hidden"} />
                  <span>{copiedCode ? "Code Copied!" : "📋 Copy Updated Code"}</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="w-1/2 py-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* CUSTOM CONFIRMATION MODAL - TEMPLATE DELETE */}
      <AnimatePresence>
        {templateToDeleteId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-800 text-center"
            >
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <Trash size={22} />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Delete Template?</h3>
              <p className="text-zinc-400 text-xs mb-6">
                Are you sure you want to delete this video invitation template from your portfolio? This action cannot be undone.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTemplateToDeleteId(null)}
                  className="w-1/2 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTemplate}
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRMATION MODAL - INQUIRY DELETE */}
      <AnimatePresence>
        {inquiryToDeleteId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-800 text-center"
            >
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <Trash size={22} />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Delete Inquiry Log?</h3>
              <p className="text-zinc-400 text-xs mb-6">
                Are you sure you want to remove this client booking inquiry from your list? This action cannot be undone.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInquiryToDeleteId(null)}
                  className="w-1/2 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteInquiry}
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
