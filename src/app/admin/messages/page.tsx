"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Trash2, CheckCircle } from "lucide-react";
import SectionTitle from "@/components/admin/SectionTitle";
import { supabase } from "@/lib/supabase";

type MessageItem = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    async function checkAdminAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !admin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setCheckingAccess(false);
      fetchMessages();
    }

    checkAdminAccess();
  }, [router]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setMessageList(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setMessageList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (!error) {
      setMessageList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (checkingAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  const filteredMessages = messageList.filter((item) =>
    filterStatus === "all" ? true : item.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          title="Contact & Enquiries"
          subtitle="Review incoming messages, speaking invitations, and general enquiries."
        />

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Statuses ({messageList.length})</option>
            <option value="unread">Unread</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={fetchMessages}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                      {item.phone && (
                        <div className="text-xs text-gray-400">{item.phone}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        {item.subject}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-xs text-gray-600 whitespace-normal leading-relaxed">
                      {item.message}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={item.status || "unread"}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium focus:outline-none ${
                          item.status === "replied"
                            ? "bg-green-100 text-green-800"
                            : item.status === "archived"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => deleteRecord(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}