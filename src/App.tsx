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
  Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoTemplate, Inquiry, CATEGORIES } from "./types";
import { INITIAL_TEMPLATES } from "./data";
import VideoPlayer from "./components/VideoPlayer";

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
  const [newCategory, setNewCategory] = useState("Wedding");
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
  const [creatorError, setCreatorError] = useState("");
  const [creatorSuccess, setCreatorSuccess] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<VideoTemplate | null>(null);

  // --- INITIALIZATION & LOCALSTORAGE ---
  useEffect(() => {
    const storedTemplates = localStorage.getItem("invitation_templates");
    if (storedTemplates) {
      try {
        let parsed = JSON.parse(storedTemplates) as VideoTemplate[];
        // Auto-migrate to remove the old royal gold template and add the new teja-elegant template
        const hasRoyalGold = parsed.some(t => t.id === "wedding-royal-gold");
        if (hasRoyalGold) {
          parsed = parsed.filter(t => t.id !== "wedding-royal-gold");
          const hasTejaElegant = parsed.some(t => t.id === "wedding-teja-elegant");
          if (!hasTejaElegant) {
            const newTejaTemplate = INITIAL_TEMPLATES.find(t => t.id === "wedding-teja-elegant") || INITIAL_TEMPLATES[0];
            parsed.unshift(newTejaTemplate);
          }
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
    setNewCategory("Wedding");
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
    setCreatorError("");
    setCreatorSuccess("");
  };

  const handleAddTemplate = (e: FormEvent) => {
    e.preventDefault();
    setCreatorError("");
    setCreatorSuccess("");

    if (!newTitle.trim() || !newVideoUrl.trim() || !newDescription.trim()) {
      setCreatorError("Please fill out Title, Video URL, and Description.");
      return;
    }

    const templateData: VideoTemplate = {
      id: editingTemplate ? editingTemplate.id : "custom-" + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      videoUrl: newVideoUrl.trim(),
      description: newDescription.trim(),
      duration: newDuration,
      ratio: newRatio,
      priceTier: newPriceTier,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      specs: {
        resolution: newResolution,
        musicStyle: newMusicStyle,
        photoSlides: Number(newPhotoSlides) || 0,
        turnaround: newTurnaround,
        colorPalette: newColorPalette.split(",").map(c => c.trim()).filter(Boolean)
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
    setNewCategory("Wedding");
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
  };

  const handleDeleteTemplate = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this template from your portfolio?")) {
      const updated = templates.filter(t => t.id !== id);
      saveTemplates(updated);
      if (editingTemplate?.id === id) {
        handleCancelEdit();
      }
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
    if (window.confirm("Delete this inquiry log?")) {
      const updated = inquiries.filter(inq => inq.id !== id);
      saveInquiries(updated);
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
      alert("Passcode cannot be empty!");
      return;
    }
    localStorage.setItem("creator_workspace_key", newKeyInput.trim());
    setWorkspaceKey(newKeyInput.trim());
    setNewKeyInput("");
    setIsChangingKey(false);
    alert("Creator Workspace Access Key successfully updated!");
  };

  // --- FILTERED TEMPLATES ---
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower) ||
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

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-950/20 to-transparent py-12 sm:py-16 border-b border-zinc-850">
        {/* Violet ambient light sphere in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} className="text-violet-400" />
            <span>Premium Motion Invitations & Video Art</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 animate-fade-in">
            Bring Your Celebrations to Life with Custom Motion Invites
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            I craft cinematic, stunning invitation templates optimized for WhatsApp, Reels, email, and social media. Explore my live work below, view the design features, and let's craft the perfect visual card for your milestone.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-violet-500" />
              <span>9:16 Vertical & 16:9 Widescreen</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-violet-500" />
              <span>Custom Soundtracks & Photo Slides</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-violet-500" />
              <span>Full High-Definition Delivery</span>
            </div>
          </div>
        </div>
      </section>

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
                      <label className="block text-zinc-300 font-semibold mb-1">Category *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
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

                  <div className="grid grid-cols-3 gap-2">
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
        <div className="glass rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-zinc-800/85">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto justify-start pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "accent-gradient text-white shadow-lg shadow-violet-500/25"
                    : "bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search wedding, birthday, floral..."
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
                      <VideoPlayer 
                        url={template.videoUrl} 
                        autoplay={false}
                        muted={true}
                        controls={false}
                        loop={true}
                        className="w-full h-full object-cover"
                      />
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

                    {/* Click To Expand Floating Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-zinc-950/40 backdrop-blur-[2px] transition-all duration-300 z-20">
                      <div className="accent-gradient hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all">
                        <Maximize2 size={13} />
                        <span>Theater Play & Details</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Info Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between z-20">
                    <div>
                      <div className="flex justify-between items-start gap-1 mb-1.5">
                        <h4 className="font-bold text-white text-base tracking-tight leading-tight group-hover:text-violet-400 transition">
                          {template.title}
                        </h4>
                        
                        <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
                          template.priceTier === "Signature" 
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/30" 
                            : template.priceTier === "Premium" 
                            ? "bg-zinc-800 text-zinc-350 border-zinc-750"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}>
                          {template.priceTier}
                        </span>
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
              <p className="font-medium text-zinc-200 mb-1">Lumina Studios Location</p>
              <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
                <MapPin size={12} className="text-violet-400 shrink-0" />
                <span>Madison Avenue, Suite 14B, New York, NY 10016</span>
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
                    <VideoPlayer 
                      url={selectedTemplate.videoUrl} 
                      autoplay={true}
                      muted={false}
                      controls={true}
                      loop={true}
                      className="w-full h-full object-cover"
                    />
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
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Duration:</span>
                        <span className="font-semibold text-white">{selectedTemplate.duration}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Price Tier:</span>
                        <span className="font-semibold text-violet-400">{selectedTemplate.priceTier}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Photo Slides Slots:</span>
                        <span className="font-semibold text-white">{selectedTemplate.specs.photoSlides} slides</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Turnaround Delivery:</span>
                        <span className="font-semibold text-white">{selectedTemplate.specs.turnaround}</span>
                      </div>
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
                      <div className="col-span-2">
                        <span className="text-zinc-500 block text-[10px]">Soundtrack Style:</span>
                        <span className="font-semibold text-zinc-300 italic text-[13px] block mt-0.5">&ldquo;{selectedTemplate.specs.musicStyle}&rdquo;</span>
                      </div>
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
                </div>

                {/* Direct Action Link */}
                <div className="border-t border-zinc-800 pt-5 mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/918520884267?text=Hello%20Teja%20Studios%2C%20I%2520am%2520interested%2520in%252520ordering%2520the%2520"${encodeURIComponent(selectedTemplate.title)}"%2520video%2520invitation%2520template%2521`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold tracking-wide transition shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={14} className="fill-white/10" />
                    <span>Order via WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:tejaarts09@gmail.com?subject=Video%20Invitation%20Order:%20${encodeURIComponent(selectedTemplate.title)}&body=Hello%20Teja%20Studios%2C%0D%0A%0D%0AI%2520am%2520interested%2520in%252520ordering%2520your%2520"${encodeURIComponent(selectedTemplate.title)}"%2520video%2520invitation%2520template.%2520Please%2520let%2520me%2520know%2520the%2520next%2520steps.%0D%0A%0D%0AThank%2520you!`}
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold tracking-wide transition border border-zinc-700 shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Order via Email</span>
                  </a>
                </div>
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

    </div>
  );
}
