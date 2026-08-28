"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminExplorePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "Article")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchArticles();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore & Teachings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage published spiritual teachings, articles, and lessons.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-bold text-orange-800">
          {articles.length} Articles
        </span>
      </div>

      <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
        {loading ? "Loading articles..." : "No articles published yet."}
      </div>
    </div>
  );
}