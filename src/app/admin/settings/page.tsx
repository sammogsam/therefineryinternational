"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Phone, 
  Mail, 
  Lock, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  PackagePlus,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings State
  const [bankSettings, setBankSettings] = useState({
    bankName: "First Bank of Nigeria",
    accountName: "Mogaji Samuel Damilola",
    accountNumber: "1432628624",
    primaryEmail: "therefineryinternational@gmail.com",
    primaryPhone: "+234 903 227 0825",
    secondaryPhone: "+234 706 523 1908",
  });

  // Password Update State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdStatus, setPwdStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Materials Manager State
  const [materials, setMaterials] = useState<{ id: string; name: string; is_active: boolean }[]>([]);
  const [newMaterialName, setNewMaterialName] = useState("");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);

      // Load Site Settings
      const { data: config } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "primary_config")
        .single();

      if (config) {
        setBankSettings({
          bankName: config.bank_name || "First Bank of Nigeria",
          accountName: config.account_name || "Mogaji Samuel Damilola",
          accountNumber: config.account_number || "1432628624",
          primaryEmail: config.primary_email || "therefineryinternational@gmail.com",
          primaryPhone: config.primary_phone || "+234 903 227 0825",
          secondaryPhone: config.secondary_phone || "+234 706 523 1908",
        });
      }

      // Load Materials
      const { data: mats } = await supabase
        .from("needed_materials")
        .select("*")
        .order("created_at", { ascending: true });

      if (mats) {
        setMaterials(mats);
      }

      setLoading(false);
    }

    loadSettings();
  }, []);

  // Save General & Bank Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const { error } = await supabase.from("site_settings").upsert({
      id: "primary_config",
      bank_name: bankSettings.bankName,
      account_name: bankSettings.accountName,
      account_number: bankSettings.accountNumber,
      primary_email: bankSettings.primaryEmail,
      primary_phone: bankSettings.primaryPhone,
      secondary_phone: bankSettings.secondaryPhone,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setStatus({ type: "error", text: error.message });
    } else {
      setStatus({ type: "success", text: "Settings saved and updated across public pages!" });
    }
    setSaving(false);
  };

  // Update Admin Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);

    if (newPassword.length < 6) {
      setPwdStatus({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: "error", text: "Passwords do not match." });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPwdStatus({ type: "error", text: error.message });
    } else {
      setPwdStatus({ type: "success", text: "Admin password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Add Needed Material
  const handleAddMaterial = async () => {
    if (!newMaterialName.trim()) return;
    const { data, error } = await supabase
      .from("needed_materials")
      .insert([{ name: newMaterialName.trim() }])
      .select()
      .single();

    if (!error && data) {
      setMaterials([...materials, data]);
      setNewMaterialName("");
    }
  };

  // Delete Needed Material
  const handleDeleteMaterial = async (id: string) => {
    const { error } = await supabase.from("needed_materials").delete().eq("id", id);
    if (!error) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-sm text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage donation placards, contact channels, needed material checklists, and security.
        </p>
      </div>

      {status && (
        <div className={`mt-6 rounded-2xl p-4 text-sm font-semibold ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {status.text}
        </div>
      )}

      {/* 1. BANK & GIVING PLACARD SETTINGS */}
      <form onSubmit={handleSaveConfig} className="mt-8 space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <Building2 className="text-orange-500" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Giving & Donation Placard Configuration</h2>
              <p className="text-xs text-gray-500">Publicly shown on the Support and Partnering pages.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Bank Name</label>
              <input
                type="text"
                value={bankSettings.bankName}
                onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Account Name</label>
              <input
                type="text"
                value={bankSettings.accountName}
                onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Account Number</label>
              <input
                type="text"
                value={bankSettings.accountNumber}
                onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-mono font-bold outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* 2. CONTACT INFORMATION SETTINGS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <Phone className="text-orange-500" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Official Ministry Contact Details</h2>
              <p className="text-xs text-gray-500">Used across contact cards, emails, and consultation modals.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Primary Email</label>
              <input
                type="email"
                value={bankSettings.primaryEmail}
                onChange={(e) => setBankSettings({ ...bankSettings, primaryEmail: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Primary Phone / WhatsApp</label>
              <input
                type="text"
                value={bankSettings.primaryPhone}
                onChange={(e) => setBankSettings({ ...bankSettings, primaryPhone: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Secondary Phone</label>
              <input
                type="text"
                value={bankSettings.secondaryPhone}
                onChange={(e) => setBankSettings({ ...bankSettings, secondaryPhone: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? "Saving Changes..." : "Save Public Settings"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. NEEDED MATERIALS CHECKLIST MANAGER */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <PackagePlus className="text-orange-500" size={24} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Needed Materials Checklist</h2>
            <p className="text-xs text-gray-500">Configure the item checklist supporters select on the Giving page.</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            placeholder="Add new material requirement (e.g. 50 Sleeping Mats)..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={handleAddMaterial}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Add Item
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {materials.map((mat) => (
            <span
              key={mat.id}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-800"
            >
              <span>{mat.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteMaterial(mat.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. ADMIN CREDENTIALS & SECURITY */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <ShieldCheck className="text-orange-500" size={24} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Security & Password</h2>
            <p className="text-xs text-gray-500">Change your authenticated admin dashboard password.</p>
          </div>
        </div>

        {pwdStatus && (
          <div className={`mt-4 rounded-xl p-3 text-xs font-semibold ${pwdStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {pwdStatus.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Lock size={16} />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}