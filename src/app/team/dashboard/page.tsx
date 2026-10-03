"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Camera, 
  User as UserIcon, 
  LogOut, 
  KeyRound,
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ClipboardList,
  MapPin,
  Calendar,
  Menu,
  X,
  Users,
  Phone,
  FileSpreadsheet
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TeamDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"desk" | "article" | "media" | "profile">("desk");
  const [deskSubTab, setDeskSubTab] = useState<"forms" | "directory">("forms");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: "",
    role: "Team Contributor",
    bio: "",
    avatarUrl: "",
    isPublic: true,
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password Update State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Article State
  const [articleTitle, setArticleTitle] = useState("");
  const [articleDate, setArticleDate] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCoverFile, setArticleCoverFile] = useState<File | null>(null);

  // School & Camp Outreaches State
  const [schoolOutreaches, setSchoolOutreaches] = useState<any[]>([]);
  const [myResponses, setMyResponses] = useState<Record<string, any>>({});
  const [outreachFormData, setOutreachFormData] = useState<Record<string, { days: string[]; items: string }>>({});

  // Team Directory Records (Approved Members Only - Name and Phone only)
  const [teamDirectory, setTeamDirectory] = useState<any[]>([]);
  const [directorySearch, setDirectorySearch] = useState("");

  // Dynamic Admin Custom Forms State
  const [dynamicForms, setDynamicForms] = useState<any[]>([]);
  const [formResponses, setFormResponses] = useState<Record<string, Record<number, any>>>({});
  const [myFormSubmissions, setMyFormSubmissions] = useState<Record<string, boolean>>({});

  // Media Passcode State
  const [passcode, setPasscode] = useState("");
  const [isMediaUnlocked, setIsMediaUnlocked] = useState(false);
  const [validPasscode, setValidPasscode] = useState("medrefinery");

  // Media Upload State
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCategory, setMediaCategory] = useState("Camp Meeting");
  const [mediaEventName, setMediaEventName] = useState("");
  const [mediaDate, setMediaDate] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaCoverFile, setMediaCoverFile] = useState<File | null>(null);
  const [mediaGalleryFiles, setMediaGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    async function initUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/team/login");
        return;
      }
      setUser(session.user);

      // Load Profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (prof) {
        setProfile({
          fullName: prof.full_name || "",
          role: prof.role || "Team Contributor",
          bio: prof.bio || "",
          avatarUrl: prof.avatar_url || "",
          isPublic: prof.is_public ?? true,
        });
      }

      // Load Approved Team Directory Members Only (Name and Phone)
      const { data: membersData } = await supabase
        .from("team_membership_records")
        .select("full_name, phone_number, whatsapp_number, submitted_at")
        .eq("is_approved", true)
        .order("full_name", { ascending: true });

      if (membersData) {
        setTeamDirectory(membersData);
      }

      // Load School Outreaches
      const { data: outreachesData } = await supabase
        .from("school_outreaches")
        .select("*")
        .order("created_at", { ascending: false });

      if (outreachesData) setSchoolOutreaches(outreachesData);

      // Load Outreach Responses
      const { data: responsesData } = await supabase
        .from("school_outreach_responses")
        .select("*")
        .eq("user_id", session.user.id);

      if (responsesData) {
        const respMap: Record<string, any> = {};
        responsesData.forEach((r) => { respMap[r.outreach_id] = r; });
        setMyResponses(respMap);
      }

      // Load Custom Admin Forms
      const { data: formsData } = await supabase
        .from("admin_custom_forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (formsData) setDynamicForms(formsData);

      // Load Custom Form Submissions
      const { data: subData } = await supabase
        .from("admin_form_submissions")
        .select("*")
        .eq("user_id", session.user.id);

      if (subData) {
        const subMap: Record<string, boolean> = {};
        const savedAnswers: Record<string, Record<number, any>> = {};
        subData.forEach((s) => {
          subMap[s.form_id] = true;
          if (s.answers) savedAnswers[s.form_id] = s.answers;
        });
        setMyFormSubmissions(subMap);
        setFormResponses(savedAnswers);
      }

      // Load dynamic media passcode
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("media_passcode")
        .eq("id", "primary_config")
        .single();

      if (settingsData?.media_passcode) {
        setValidPasscode(settingsData.media_passcode.trim().toLowerCase());
      }

      setAuthLoading(false);
    }
    initUser();
  }, [router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Handle Avatar Upload
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploadingAvatar(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("resource-images")
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
      setProfile((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
      await supabase.from("profiles").upsert({ id: user.id, avatar_url: data.publicUrl });
    }
    setUploadingAvatar(false);
  }

  // Save Profile Info
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.fullName,
      role: profile.role,
      bio: profile.bio,
      avatar_url: profile.avatarUrl,
      is_public: profile.isPublic,
    });

    setLoading(false);
    if (!error) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: error.message });
    }
  }

  // Change Password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  // Submit Article
  async function handleSubmitArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;

    if (!articleTitle.trim()) {
      setMessage({ type: "error", text: "Please enter an article title." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const slug = `${createSlug(articleTitle)}-${Date.now()}`;
      let coverImageUrl: string | null = null;

      if (articleCoverFile) {
        const fileExt = articleCoverFile.name.split(".").pop();
        const filePath = `covers/${Date.now()}-${slug}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("resource-images")
          .upload(filePath, articleCoverFile, { cacheControl: "3600", upsert: false });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage.from("resource-images").getPublicUrl(filePath);
          coverImageUrl = publicUrlData.publicUrl;
        }
      }

      const { error: insertErr } = await supabase.from("resources").insert([
        {
          title: articleTitle,
          slug,
          type: "Article",
          category: "Articles",
          description: articleSummary || null,
          content: articleContent || null,
          cover_image: coverImageUrl,
          resource_date: articleDate || null,
          author_name: profile.fullName || user?.email,
          author_email: user?.email,
          author_id: user?.id,
          status: "Pending Approval",
          featured: false,
        },
      ]);

      if (insertErr) {
        setMessage({ type: "error", text: insertErr.message });
      } else {
        setMessage({ type: "success", text: "Article submitted successfully for leadership review!" });
        setArticleTitle("");
        setArticleDate("");
        setArticleSummary("");
        setArticleContent("");
        setArticleCoverFile(null);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred while saving." });
    }
    setLoading(false);
  }

  // Submit Outreach Availability
  async function handleSubmitOutreachAvailability(outreachId: string, availableDays: string[]) {
    if (!user?.id) return;
    if (!availableDays || availableDays.length === 0) {
      setMessage({ type: "error", text: "Please select at least one availability slot." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const formData = outreachFormData[outreachId] || { items: "" };

    const { error } = await supabase.from("school_outreach_responses").upsert({
      outreach_id: outreachId,
      user_id: user.id,
      member_name: profile.fullName || user?.email,
      member_email: user?.email,
      available_dates: availableDays,
      needed_items: formData.items || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "outreach_id,user_id" });

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Your availability and equipment requests have been submitted successfully!" });
      const { data: updatedResp } = await supabase.from("school_outreach_responses").select("*").eq("user_id", user.id);
      if (updatedResp) {
        const respMap: Record<string, any> = {};
        updatedResp.forEach((r) => { respMap[r.outreach_id] = r; });
        setMyResponses(respMap);
      }
    }
  }

  // Submit Dynamic Admin Custom Form (Locked after submission)
  async function handleSubmitCustomForm(formId: string) {
    if (!user?.id) return;
    const answers = formResponses[formId] || {};

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("admin_form_submissions").insert({
      form_id: formId,
      user_id: user.id,
      member_name: profile.fullName || user?.email,
      member_email: user?.email,
      answers: answers,
      submitted_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message || "You have already submitted this form." });
    } else {
      setMessage({ type: "success", text: "Form response submitted successfully and locked!" });
      setMyFormSubmissions((prev) => ({ ...prev, [formId]: true }));
    }
  }

  // Media Passcode Unlock Handler
  function handleUnlockMedia(e: React.FormEvent) {
    e.preventDefault();
    const entered = passcode.trim().toLowerCase();
    if (entered === "medrefinery" || entered === validPasscode) {
      setIsMediaUnlocked(true);
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Incorrect passcode. Contact leadership for media credentials." });
    }
  }

  // Submit Media Photo Album
  async function handleSubmitMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;

    if (!mediaTitle.trim()) {
      setMessage({ type: "error", text: "Please enter an album title." });
      return;
    }
    if (mediaGalleryFiles.length === 0 && !mediaCoverFile) {
      setMessage({ type: "error", text: "Please upload at least one photo for this event album." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const slug = `${createSlug(mediaTitle)}-${Date.now()}`;
      let coverImageUrl: string | null = null;
      const uploadedGalleryUrls: string[] = [];

      if (mediaCoverFile) {
        const fileExt = mediaCoverFile.name.split(".").pop();
        const filePath = `covers/${Date.now()}-${slug}.${fileExt}`;
        const { error: coverErr } = await supabase.storage.from("resource-images").upload(filePath, mediaCoverFile, { cacheControl: "3600", upsert: false });
        if (!coverErr) {
          const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
          coverImageUrl = data.publicUrl;
        }
      }

      for (let i = 0; i < mediaGalleryFiles.length; i++) {
        const image = mediaGalleryFiles[i];
        const fileExt = image.name.split(".").pop();
        const filePath = `galleries/${Date.now()}-${i}-${slug}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from("resource-images").upload(filePath, image, { cacheControl: "3600", upsert: false });
        if (!uploadErr) {
          const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
          uploadedGalleryUrls.push(data.publicUrl);
        }
      }

      if (!coverImageUrl && uploadedGalleryUrls.length > 0) coverImageUrl = uploadedGalleryUrls[0];
      const formattedCategory = mediaCategory === "Camp Meeting" ? "Camp Meetings" : "Outreaches";

      const { data: insertedResource, error: insertError } = await supabase.from("resources").insert([
        {
          title: mediaTitle,
          slug,
          type: "Gallery",
          category: formattedCategory,
          description: mediaDescription || null,
          content: null,
          cover_image: coverImageUrl,
          gallery_images: uploadedGalleryUrls,
          event_name: mediaEventName.trim() || mediaTitle.trim(),
          resource_date: mediaDate || null,
          author_name: profile.fullName || user?.email,
          author_email: user?.email,
          author_id: user?.id,
          status: "Pending Approval",
          featured: false,
        },
      ]).select().single();

      if (insertError) {
        setMessage({ type: "error", text: insertError.message });
        setLoading(false);
        return;
      }

      if (uploadedGalleryUrls.length > 0 && insertedResource) {
        const imageRows = uploadedGalleryUrls.map((url) => ({ resource_id: insertedResource.id, image_url: url }));
        await supabase.from("resource_images").insert(imageRows);
      }

      setMessage({ type: "success", text: "Event album uploaded and submitted for leadership review!" });
      setMediaTitle(""); setMediaEventName(""); setMediaDate(""); setMediaDescription(""); setMediaCoverFile(null); setMediaGalleryFiles([]);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred while saving." });
    }
    setLoading(false);
  }

  const filteredTeamDirectory = teamDirectory.filter((member) =>
    member.full_name?.toLowerCase().includes(directorySearch.toLowerCase())
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-white p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-orange-500 bg-slate-800">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={22} className="m-auto mt-2.5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold">{profile.fullName || user?.email}</h2>
            <p className="text-[11px] font-semibold text-orange-400">{profile.role}</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => { setActiveTab("desk"); setMessage(null); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === "desk" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ClipboardList size={16} /> Team Desk
          </button>
          <button
            onClick={() => { setActiveTab("article"); setMessage(null); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === "article" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BookOpen size={16} /> Write Article
          </button>
          <button
            onClick={() => { setActiveTab("media"); setMessage(null); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === "media" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Camera size={16} /> Media Uploads
          </button>
          <button
            onClick={() => { setActiveTab("profile"); setMessage(null); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === "profile" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <UserIcon size={16} /> Profile & Security
          </button>
        </nav>
      </div>

      <button
        onClick={() => supabase.auth.signOut().then(() => router.push("/team/login"))}
        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-gray-300 hover:text-white transition w-full justify-center"
      >
        <LogOut size={15} />
        <span>Sign Out</span>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 bg-slate-900 z-10 flex flex-col h-full shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden rounded-xl border border-gray-200 bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {activeTab === "desk" && "Team Desk & Central Hub"}
                {activeTab === "article" && "Write Article & Stories"}
                {activeTab === "media" && "Media Photo Uploads"}
                {activeTab === "profile" && "Profile & Account Security"}
              </h1>
              <p className="text-xs text-gray-500">The Refinery International Team Portal</p>
            </div>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
            {profile.role}
          </span>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto">
          {message && (
            <div className={`mb-6 flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold shadow-xs ${
              message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"
            }`}>
              {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TEAM DESK TAB */}
          {activeTab === "desk" && (
            <div className="space-y-6">
              
              {/* SUB-TABS */}
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setDeskSubTab("forms")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
                    deskSubTab === "forms"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Directives & Forms
                </button>
                <button
                  onClick={() => setDeskSubTab("directory")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
                    deskSubTab === "directory"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Team Directory
                </button>
              </div>

              {/* 1. DIRECTIVES & FORMS SUB-TAB */}
              {deskSubTab === "forms" && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">Active Directives & Questionnaires</h2>
                    <p className="mt-1 text-xs text-gray-500">Review leadership instructions and complete active custom questionnaires below.</p>
                  </div>

                  {dynamicForms.map((form) => {
                    const isSubmitted = myFormSubmissions[form.id];
                    const savedAnswers = formResponses[form.id] || {};

                    return (
                      <div key={form.id} className="rounded-3xl border border-orange-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <div>
                            <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                              Leadership Directive Form
                            </span>
                            <h3 className="text-xl font-bold mt-2 text-gray-900">{form.title}</h3>
                          </div>
                          {isSubmitted && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 px-3.5 py-1.5 text-xs font-semibold text-green-700">
                              <CheckCircle size={14} /> Submitted & Locked
                            </span>
                          )}
                        </div>

                        {form.description && <p className="text-sm text-gray-600">{form.description}</p>}
                        {form.deadline && <p className="text-xs font-semibold text-orange-600">Deadline: {form.deadline}</p>}

                        <div className="space-y-5 pt-2 border-t border-gray-100">
                          {form.questions.map((q: any, qIdx: number) => {
                            const qText = typeof q === "string" ? q : q.text;
                            const qType = typeof q === "string" ? "text" : q.type || "text";
                            const qOptions = typeof q === "string" ? [] : q.options || [];

                            return (
                              <div key={qIdx} className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-800">
                                  {qIdx + 1}. {qText}
                                </label>

                                {isSubmitted ? (
                                  <div className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 font-medium">
                                    {Array.isArray(savedAnswers[qIdx])
                                      ? (savedAnswers[qIdx].length > 0 ? savedAnswers[qIdx].join(", ") : "None selected")
                                      : (savedAnswers[qIdx] || "No response")}
                                  </div>
                                ) : (
                                  <>
                                    {qType === "text" && (
                                      <input
                                        type="text"
                                        required
                                        value={formResponses[form.id]?.[qIdx] || ""}
                                        onChange={(e) => {
                                          const currentFormAnswers = formResponses[form.id] || {};
                                          setFormResponses({
                                            ...formResponses,
                                            [form.id]: { ...currentFormAnswers, [qIdx]: e.target.value },
                                          });
                                        }}
                                        placeholder="Your answer..."
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                                      />
                                    )}

                                    {qType === "single" && (
                                      <div className="space-y-2 pt-1">
                                        {qOptions.map((opt: string, optIdx: number) => (
                                          <label key={optIdx} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`form-${form.id}-q-${qIdx}`}
                                              checked={formResponses[form.id]?.[qIdx] === opt}
                                              onChange={() => {
                                                const currentFormAnswers = formResponses[form.id] || {};
                                                setFormResponses({
                                                  ...formResponses,
                                                  [form.id]: { ...currentFormAnswers, [qIdx]: opt },
                                                });
                                              }}
                                              className="text-orange-500 focus:ring-orange-500"
                                            />
                                            <span>{opt}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}

                                    {qType === "multiple" && (
                                      <div className="space-y-2 pt-1">
                                        {qOptions.map((opt: string, optIdx: number) => {
                                          const currentSelected: string[] = formResponses[form.id]?.[qIdx] || [];
                                          const isChecked = currentSelected.includes(opt);

                                          return (
                                            <label key={optIdx} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                  const updatedSelected = isChecked
                                                    ? currentSelected.filter((item: string) => item !== opt)
                                                    : [...currentSelected, opt];

                                                  const currentFormAnswers = formResponses[form.id] || {};
                                                  setFormResponses({
                                                    ...formResponses,
                                                    [form.id]: { ...currentFormAnswers, [qIdx]: updatedSelected },
                                                  });
                                                }}
                                                className="rounded text-orange-500 focus:ring-orange-500"
                                              />
                                              <span>{opt}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {!isSubmitted && (
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleSubmitCustomForm(form.id)}
                              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition"
                            >
                              <Send size={15} /> <span>Submit Final Response</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {schoolOutreaches.length === 0 && dynamicForms.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
                      <FileSpreadsheet size={36} className="mx-auto mb-3 text-orange-500 opacity-60" />
                      <p className="text-sm font-semibold text-gray-800">No active directives or questionnaires have been published yet.</p>
                      <p className="mt-1 text-xs text-gray-500">Check back soon when leadership posts new instructions.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {schoolOutreaches.map((outreach) => {
                        const existingResponse = myResponses[outreach.id];
                        const currentFormData = outreachFormData[outreach.id] || {
                          days: existingResponse?.available_dates || [],
                          items: existingResponse?.needed_items || "",
                        };

                        return (
                          <div key={outreach.id} className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                              <div>
                                <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                                  {outreach.category || "Ministry Outreach"}
                                </span>
                                <h3 className="text-xl font-bold mt-2 text-gray-900">{outreach.title}</h3>
                              </div>
                              {existingResponse && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 px-3.5 py-1.5 text-xs font-semibold text-green-700 w-fit">
                                  <CheckCircle size={14} /> Submitted & Logged
                                </span>
                              )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-700">
                              {outreach.location && (
                                <div className="flex items-center gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                                  <MapPin size={16} className="text-orange-500 shrink-0" />
                                  <span><strong>Location:</strong> {outreach.location}</span>
                                </div>
                              )}
                              {outreach.event_date && (
                                <div className="flex items-center gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                                  <Calendar size={16} className="text-orange-500 shrink-0" />
                                  <span><strong>Date:</strong> {outreach.event_date}</span>
                                </div>
                              )}
                            </div>

                            {outreach.description && (
                              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-xs">
                                {outreach.description}
                              </p>
                            )}

                            <div className="space-y-4 pt-2 border-t border-gray-100">
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                                Select Your Available Days / Sessions
                              </label>

                              {outreach.available_days && outreach.available_days.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {outreach.available_days.map((day: string) => {
                                    const isSelected = currentFormData.days.includes(day);
                                    return (
                                      <button
                                        type="button"
                                        key={day}
                                        onClick={() => {
                                          const updatedDays = isSelected
                                            ? currentFormData.days.filter((d: string) => d !== day)
                                            : [...currentFormData.days, day];
                                          
                                          setOutreachFormData({
                                            ...outreachFormData,
                                            [outreach.id]: { ...currentFormData, days: updatedDays },
                                          });
                                        }}
                                        className={`rounded-2xl border p-4 text-left text-xs font-semibold transition flex items-center justify-between ${
                                          isSelected 
                                            ? "border-orange-500 bg-orange-50 text-orange-800 shadow-xs" 
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                      >
                                        <span>{day}</span>
                                        {isSelected && <CheckCircle size={16} className="text-orange-500" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">All general availability slots apply.</p>
                              )}

                              <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                  Items / Equipment / Needs for this Assignment
                                </label>
                                <textarea
                                  rows={2}
                                  value={currentFormData.items}
                                  onChange={(e) => {
                                    setOutreachFormData({
                                      ...outreachFormData,
                                      [outreach.id]: { ...currentFormData, items: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. 1 wireless mic, transport assistance, flashcards..."
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                                />
                              </div>

                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleSubmitOutreachAvailability(outreach.id, currentFormData.days)}
                                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
                              >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                <span>{existingResponse ? "Update Availability Response" : "Submit Availability"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. TEAM DIRECTORY SUB-TAB (APPROVED MEMBERS ONLY, NAME & PHONE ONLY) */}
              {deskSubTab === "directory" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Team Directory</h2>
                      <p className="mt-1 text-xs text-gray-500">Connect with approved co-workers and view phone numbers.</p>
                    </div>
                    <div className="w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Search approved member..."
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredTeamDirectory.length === 0 ? (
                      <div className="sm:col-span-2 rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-400 shadow-sm">
                        <Users size={36} className="mx-auto mb-3 text-orange-500 opacity-60" />
                        <p className="text-sm font-semibold">No approved team members found in the directory yet.</p>
                      </div>
                    ) : (
                      filteredTeamDirectory.map((member, idx) => (
                        <div key={idx} className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-bold">
                              {member.full_name?.charAt(0) || "T"}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 truncate">{member.full_name}</h3>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-orange-500 shrink-0" />
                              <span>Phone: {member.phone_number || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600 font-bold text-sm">💬</span>
                              <span>WhatsApp: {member.whatsapp_number || member.phone_number || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 2. ARTICLE TAB */}
          {activeTab === "article" && (
            <form onSubmit={handleSubmitArticle} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Write Article / Story</h2>
                <p className="mt-1 text-xs text-gray-500">Articles are reviewed by leadership before being published live.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700 text-sm">Article Title</label>
                  <input
                    type="text"
                    required
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="Lessons from the Fire: Raising Lights"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700 text-sm">Date of Article / Event</label>
                  <input
                    type="date"
                    value={articleDate}
                    onChange={(e) => setArticleDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700 text-sm">Summary / Reflection</label>
                  <textarea
                    rows={3}
                    value={articleSummary}
                    onChange={(e) => setArticleSummary(e.target.value)}
                    placeholder="A brief summary of what happened at this specific meeting or outreach..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700 text-sm">Article Content</label>
                  <textarea
                    rows={10}
                    required
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Write full article here..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700 text-sm">Primary Cover Photo</label>
                  <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setArticleCoverFile(e.target.files?.[0] || null)}
                      className="mx-auto block text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                    />
                    {articleCoverFile && (
                      <p className="mt-2 text-xs font-semibold text-orange-700">Selected: {articleCoverFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>{loading ? "Submitting..." : "Submit Article for Review"}</span>
              </button>
            </form>
          )}

          {/* 3. MEDIA TAB */}
          {activeTab === "media" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              {!isMediaUnlocked ? (
                <form onSubmit={handleUnlockMedia} className="mx-auto max-w-md py-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <KeyRound size={26} />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">Media Team Passcode Required</h2>
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the media authorization passcode provided by ministry leadership.
                  </p>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Passcode"
                    className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center font-mono text-sm tracking-widest text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600 shadow-md shadow-orange-500/20"
                  >
                    Unlock Uploader
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmitMedia} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[10px] font-bold text-orange-700">
                      Media Team Verified
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-gray-900">Upload Event Photos & Gallery</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Submit outreach albums and camp meeting photo collections for admin review.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Gallery Section</label>
                      <select
                        value={mediaCategory}
                        onChange={(e) => setMediaCategory(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      >
                        <option value="Camp Meeting">Camp Meeting (Separate Album)</option>
                        <option value="Outreach">Outreach (Separate Album)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Date of Event</label>
                      <input
                        type="date"
                        value={mediaDate}
                        onChange={(e) => setMediaDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">
                        {mediaCategory === "Camp Meeting" ? "Camp Meeting Edition" : "Outreach Location / Target"}
                      </label>
                      <input
                        type="text"
                        value={mediaEventName}
                        onChange={(e) => setMediaEventName(e.target.value)}
                        placeholder={
                          mediaCategory === "Camp Meeting"
                            ? "e.g. Ikere Ekiti Camp 2026"
                            : "e.g. EKSUTH Hospital Outreach"
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Album & Meeting Title *</label>
                      <input
                        type="text"
                        required
                        value={mediaTitle}
                        onChange={(e) => setMediaTitle(e.target.value)}
                        placeholder={
                          mediaCategory === "Camp Meeting"
                            ? "Ikere Children Camp Meeting 2026"
                            : "Community Outreach 2026"
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Summary / Reflection</label>
                      <textarea
                        rows={3}
                        value={mediaDescription}
                        onChange={(e) => setMediaDescription(e.target.value)}
                        placeholder="Brief note about the session or highlights..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">
                        Primary Cover Photo (Optional)
                      </label>
                      <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-5 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setMediaCoverFile(e.target.files?.[0] || null)}
                          className="mx-auto block text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                        />
                        {mediaCoverFile && (
                          <p className="mt-2 text-xs font-semibold text-orange-700">Cover chosen: {mediaCoverFile.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-700">
                        Pictures from this Meeting / Outreach *
                      </label>
                      <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setMediaGalleryFiles(Array.from(e.target.files || []))}
                          className="mx-auto block text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                        />
                        {mediaGalleryFiles.length > 0 && (
                          <p className="mt-2 text-xs font-semibold text-orange-700">
                            {mediaGalleryFiles.length} photo{mediaGalleryFiles.length > 1 ? "s" : ""} selected for this album
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      <span>{loading ? "Uploading & Submitting..." : "Submit Event Album"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMediaUnlocked(false);
                        setPasscode("");
                      }}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Lock Uploader
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 4. PROFILE & SECURITY TAB */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <form onSubmit={handleSaveProfile} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Team Member Profile</h2>

                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xs">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon size={40} className="m-auto mt-4 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs">
                    {uploadingAvatar ? "Uploading..." : "Upload Profile Photo"}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Role / Department</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="e.g. Outreach Coordinator / Media Lead"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Bio / Heart for Ministry</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Brief summary displayed across leadership records..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>

                <button type="submit" disabled={loading} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 shadow-md shadow-orange-500/20">
                  Save Profile
                </button>
              </form>

              <form onSubmit={handleChangePassword} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Account Security</h2>
                    <p className="text-xs text-gray-500">Update your account password</p>
                  </div>
                </div>

                {passwordMessage && (
                  <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold ${
                    passwordMessage.type === "success" 
                      ? "border border-green-200 bg-green-50 text-green-700" 
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}>
                    {passwordMessage.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 shadow-xs"
                >
                  {passwordLoading && <Loader2 size={15} className="animate-spin" />}
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}