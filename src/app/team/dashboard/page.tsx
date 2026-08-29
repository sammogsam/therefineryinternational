"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Camera, 
  CalendarCheck, 
  User as UserIcon, 
  LogOut, 
  Lock, 
  KeyRound,
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Trash2,
  Image as ImageIcon
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
  const [activeTab, setActiveTab] = useState<"article" | "profile" | "camp" | "media">("article");
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

  // Dynamic Camp / Outreach Availability State
  const [eventType, setEventType] = useState("Camp Meeting");
  const [formInstruction, setFormInstruction] = useState("");
  const [configuredDays, setConfiguredDays] = useState<string[]>([]);
  const [campData, setCampData] = useState({
    eventName: "Ikere Ekiti Camp Meeting 2026",
    availableDates: [] as string[],
    neededItems: "",
    notes: "",
  });

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

      // Load Dynamic Camp / Outreach Config from Admin Settings
      const { data: campConfig } = await supabase
        .from("camp_meeting_settings")
        .select("*")
        .eq("id", "current_camp")
        .single();

      if (campConfig) {
        setEventType(campConfig.event_type || "Camp Meeting");
        setCampData((prev) => ({
          ...prev,
          eventName: campConfig.event_name || prev.eventName,
        }));
        setFormInstruction(
          campConfig.form_instruction ||
          "This is to collect information about availability and needs for the upcoming camp meeting. kindly fill in your availability and include things you will probably need for the camp meeting."
        );
        setConfiguredDays(campConfig.available_days || []);
      } else {
        setConfiguredDays([
          "Day 1 - Arrival & Evening Vigil",
          "Day 2 - Morning & Outreach Sessions",
          "Day 3 - Word & Impartation",
          "Day 4 - Departure & Debrief",
        ]);
      }

      // Load dynamic media passcode from site_settings (fixed query)
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
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
      await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: data.publicUrl,
      });
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

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully! Use your new password on next login." });
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
          const { data: publicUrlData } = supabase.storage
            .from("resource-images")
            .getPublicUrl(filePath);
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
        fetch("/api/notify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: articleTitle,
            authorName: profile.fullName || user?.email,
            authorEmail: user?.email,
            type: "Article",
          }),
        }).catch(console.error);

        setMessage({
          type: "success",
          text: "Article submitted successfully! It has been placed in the leadership review queue.",
        });
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

  // Submit Availability & Needs
  async function handleSubmitCamp(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    if (campData.availableDates.length === 0) {
      setMessage({ type: "error", text: "Please select at least one session/day option." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("camp_availabilities").insert([
      {
        user_id: user?.id,
        member_name: profile.fullName || user?.email,
        member_email: user?.email,
        event_name: campData.eventName,
        available_dates: campData.availableDates,
        needed_items: campData.neededItems || null,
        notes: campData.notes || null,
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Your availability and equipment requests have been logged for leadership.",
      });
      setCampData({ ...campData, availableDates: [], neededItems: "", notes: "" });
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

      // 1. Cover Photo Upload
      if (mediaCoverFile) {
        const fileExt = mediaCoverFile.name.split(".").pop();
        const filePath = `covers/${Date.now()}-${slug}.${fileExt}`;

        const { error: coverErr } = await supabase.storage
          .from("resource-images")
          .upload(filePath, mediaCoverFile, { cacheControl: "3600", upsert: false });

        if (!coverErr) {
          const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
          coverImageUrl = data.publicUrl;
        }
      }

      // 2. Multi-photo gallery upload
      for (let i = 0; i < mediaGalleryFiles.length; i++) {
        const image = mediaGalleryFiles[i];
        const fileExt = image.name.split(".").pop();
        const filePath = `galleries/${Date.now()}-${i}-${slug}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("resource-images")
          .upload(filePath, image, { cacheControl: "3600", upsert: false });

        if (!uploadErr) {
          const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
          uploadedGalleryUrls.push(data.publicUrl);
        }
      }

      if (!coverImageUrl && uploadedGalleryUrls.length > 0) {
        coverImageUrl = uploadedGalleryUrls[0];
      }

      const formattedCategory =
        mediaCategory === "Camp Meeting" ? "Camp Meetings" : "Outreaches";

      // 3. Insert Resource Record
      const { data: insertedResource, error: insertError } = await supabase
        .from("resources")
        .insert([
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
        ])
        .select()
        .single();

      if (insertError) {
        setMessage({ type: "error", text: insertError.message });
        setLoading(false);
        return;
      }

      // 4. Sync with resource_images table
      if (uploadedGalleryUrls.length > 0 && insertedResource) {
        const imageRows = uploadedGalleryUrls.map((url) => ({
          resource_id: insertedResource.id,
          image_url: url,
        }));
        await supabase.from("resource_images").insert(imageRows);
      }

      // 5. Trigger Email Alert
      fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mediaTitle,
          authorName: profile.fullName || user?.email,
          authorEmail: user?.email,
          type: "Media Photo Album",
        }),
      }).catch(console.error);

      setMessage({
        type: "success",
        text: "Event album uploaded and submitted for leadership review!",
      });

      setMediaTitle("");
      setMediaEventName("");
      setMediaDate("");
      setMediaDescription("");
      setMediaCoverFile(null);
      setMediaGalleryFiles([]);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred while saving." });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Top bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-orange-500 bg-slate-800">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={26} className="m-auto mt-3 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.fullName || user?.email}</h1>
              <p className="text-xs font-semibold text-orange-400">{profile.role}</p>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/team/login"))}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => { setActiveTab("article"); setMessage(null); }}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
              activeTab === "article" ? "bg-orange-500 text-white" : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen size={15} /> Write Article
          </button>
          <button
            onClick={() => { setActiveTab("profile"); setMessage(null); }}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
              activeTab === "profile" ? "bg-orange-500 text-white" : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            <UserIcon size={15} /> Profile & Security
          </button>
          <button
            onClick={() => { setActiveTab("camp"); setMessage(null); }}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
              activeTab === "camp" ? "bg-orange-500 text-white" : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            <CalendarCheck size={15} /> Availability & Needs
          </button>
          <button
            onClick={() => { setActiveTab("media"); setMessage(null); }}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
              activeTab === "media" ? "bg-orange-500 text-white" : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            <Camera size={15} /> Media Uploads
          </button>
        </div>

        {message && (
          <div className={`mt-6 flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
            message.type === "success" ? "border border-green-500/30 bg-green-500/10 text-green-400" : "border border-red-500/30 bg-red-500/10 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. PROFILE & SECURITY TAB */}
        {activeTab === "profile" && (
          <div className="mt-8 space-y-8">
            <form onSubmit={handleSaveProfile} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-xl font-bold">Team Member Profile</h2>

              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon size={40} className="m-auto mt-4 text-gray-500" />
                  )}
                </div>
                <label className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700">
                  {uploadingAvatar ? "Uploading..." : "Upload Profile Photo"}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Role / Department</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    placeholder="e.g. Outreach Coordinator / Media Lead"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Bio / Heart for Ministry</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Brief summary displayed across leadership records..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button type="submit" disabled={loading} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600">
                Save Profile
              </button>
            </form>

            <form onSubmit={handleChangePassword} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Account Security</h2>
                  <p className="text-xs text-gray-400">Update your account password</p>
                </div>
              </div>

              {passwordMessage && (
                <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold ${
                  passwordMessage.type === "success" 
                    ? "border border-green-500/30 bg-green-500/10 text-green-400" 
                    : "border border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  {passwordMessage.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-400">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                {passwordLoading && <Loader2 size={15} className="animate-spin" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. ARTICLE TAB */}
        {activeTab === "article" && (
          <form onSubmit={handleSubmitArticle} className="mt-8 space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div>
              <h2 className="text-xl font-bold">Write Article / Story</h2>
              <p className="mt-1 text-xs text-gray-400">Articles are reviewed by leadership before being published live.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-300 text-sm">Article Title</label>
                <input
                  type="text"
                  required
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="Lessons from the Fire: Raising Lights"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-300 text-sm">Date of Article / Event</label>
                <input
                  type="date"
                  value={articleDate}
                  onChange={(e) => setArticleDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-300 text-sm">Summary / Reflection</label>
                <textarea
                  rows={3}
                  value={articleSummary}
                  onChange={(e) => setArticleSummary(e.target.value)}
                  placeholder="A brief summary of what happened at this specific meeting or outreach..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-300 text-sm">Article Content</label>
                <textarea
                  rows={10}
                  required
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="Write full article here..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-300 text-sm">Primary Cover Photo</label>
                <div className="rounded-2xl border-2 border-dashed border-orange-500/30 bg-orange-500/5 p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setArticleCoverFile(e.target.files?.[0] || null)}
                    className="mx-auto block text-xs text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                  />
                  {articleCoverFile && (
                    <p className="mt-2 text-xs font-semibold text-orange-400">Selected: {articleCoverFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{loading ? "Submitting..." : "Submit Article for Review"}</span>
            </button>
          </form>
        )}

        {/* 3. DYNAMIC AVAILABILITY & NEEDS TAB */}
        {activeTab === "camp" && (
          <form onSubmit={handleSubmitCamp} className="mt-8 space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div>
              <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[10px] font-bold text-orange-400">
                {eventType} Logistics
              </span>
              <h2 className="text-xl font-bold mt-2">{campData.eventName || "Availability & Materials"}</h2>
              
              {/* Dynamic Admin Instruction Notice */}
              <div className="mt-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-xs leading-relaxed text-orange-200">
                {formInstruction}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Target Gathering</label>
              <input
                type="text"
                readOnly
                value={campData.eventName}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-gray-300 font-semibold cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase text-gray-400">Select Availability</label>
              {configuredDays.length === 0 ? (
                <p className="text-xs text-gray-500">No session options have been published by admin yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {configuredDays.map((day) => {
                    const isSelected = campData.availableDates.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          setCampData({
                            ...campData,
                            availableDates: isSelected
                              ? campData.availableDates.filter((d) => d !== day)
                              : [...campData.availableDates, day],
                          });
                        }}
                        className={`rounded-xl border p-3.5 text-left text-xs font-semibold transition ${
                          isSelected 
                            ? "border-orange-500 bg-orange-500/10 text-orange-400" 
                            : "border-slate-800 bg-slate-950 text-gray-400 hover:border-slate-700"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-400">
                Items/Needs for the {eventType}
              </label>
              <textarea
                rows={3}
                value={campData.neededItems}
                onChange={(e) => setCampData({ ...campData, neededItems: e.target.value })}
                placeholder="e.g. 1 wireless mic, ministry flashcards, logistics support..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button type="submit" disabled={loading} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition">
              Submit Availability & Needs
            </button>
          </form>
        )}

        {/* 4. MEDIA TAB (GATED WITH 'medrefinery') */}
        {activeTab === "media" && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            {!isMediaUnlocked ? (
              <form onSubmit={handleUnlockMedia} className="mx-auto max-w-md py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                  <Lock size={26} />
                </div>
                <h2 className="mt-4 text-xl font-bold">Media Team Passcode Required</h2>
                <p className="mt-2 text-xs text-gray-400">
                  Enter the media authorization passcode provided by ministry leadership.
                </p>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Passcode"
                  className="mt-6 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center font-mono text-sm tracking-widest text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Unlock Uploader
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitMedia} className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[10px] font-bold text-orange-400">
                    Media Team Verified
                  </span>
                  <h2 className="mt-2 text-xl font-bold">Upload Event Photos & Gallery</h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Submit outreach albums and camp meeting photo collections for admin review.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Gallery Section */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Gallery Section</label>
                    <select
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Camp Meeting">Camp Meeting (Separate Album)</option>
                      <option value="Outreach">Outreach (Separate Album)</option>
                    </select>
                  </div>

                  {/* Date of Event */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Date of Event</label>
                    <input
                      type="date"
                      value={mediaDate}
                      onChange={(e) => setMediaDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Event Identifier */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">
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
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Album Title */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Album & Meeting Title *</label>
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
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Summary / Reflection</label>
                    <textarea
                      rows={3}
                      value={mediaDescription}
                      onChange={(e) => setMediaDescription(e.target.value)}
                      placeholder="Brief note about the session or highlights..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Primary Cover Photo */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">
                      Primary Cover Photo (Optional - first gallery picture used if empty)
                    </label>
                    <div className="rounded-2xl border-2 border-dashed border-orange-500/30 bg-orange-500/5 p-5 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setMediaCoverFile(e.target.files?.[0] || null)}
                        className="mx-auto block text-xs text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                      />
                      {mediaCoverFile && (
                        <p className="mt-2 text-xs font-semibold text-orange-400">Cover chosen: {mediaCoverFile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Multiple Pictures for Event */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase text-gray-400">
                      Pictures from this Meeting / Outreach *
                    </label>
                    <div className="rounded-2xl border-2 border-dashed border-orange-500/30 bg-orange-500/5 p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setMediaGalleryFiles(Array.from(e.target.files || []))}
                        className="mx-auto block text-xs text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                      />
                      {mediaGalleryFiles.length > 0 && (
                        <p className="mt-2 text-xs font-semibold text-orange-400">
                          {mediaGalleryFiles.length} photo{mediaGalleryFiles.length > 1 ? "s" : ""} selected for this album
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
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
                    className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-semibold text-gray-400 hover:text-white"
                  >
                    Lock Uploader
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}