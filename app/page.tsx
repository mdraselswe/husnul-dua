"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import DuaCard from "@/components/DuaCard";

interface Dua {
  id: string;
  titleBengali: string;
  titleEnglish?: string;
  arabic: string;
  transliteration: string;
  bengali: string;
  english?: string;
  tags: string;
  category?: string;
  source?: string;
  times?: string;
  benefits?: string;
}

export default function Home() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const router = useRouter();

  const fetchDuas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedTag) params.append("tag", selectedTag);

      const response = await fetch(`/api/duas?${params.toString()}`);
      const data = await response.json();
      setDuas(data);
    } catch (error) {
      console.error("Error fetching duas:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTag]);

  useEffect(() => {
    fetchDuas();
  }, [fetchDuas]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTag(""); // Clear tag when searching
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(""); // Clear search when filtering by tag
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold font-bengali mb-2">
            হুসনুল দুআ
          </h1>
          <p className="text-green-100 font-bengali">
            ইসলামিক দুআ, আমল ও জিকিরের সংগ্রহ
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <SearchBar
          onSearch={handleSearch}
          onTagFilter={handleTagFilter}
          selectedTag={selectedTag}
        />

        {/* Add Dua Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/add")}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bengali font-semibold transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            নতুন দুআ যোগ করুন
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 font-bengali">
              লোড হচ্ছে...
            </p>
          </div>
        )}

        {/* Duas List */}
        {!loading && duas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 font-bengali text-lg">
              {searchQuery || selectedTag
                ? "কোনো দুআ পাওয়া যায়নি"
                : "এখনও কোনো দুআ যোগ করা হয়নি। নতুন দুআ যোগ করুন।"}
            </p>
          </div>
        )}

        {!loading && duas.length > 0 && (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400 font-bengali">
              মোট {duas.length}টি দুআ পাওয়া গেছে
            </p>
            {duas.map((dua) => (
              <DuaCard key={dua.id} dua={dua} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 mt-12 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400 font-bengali text-sm">
          আল্লাহ আমাদের সবাইকে সঠিক আমল করার তৌফিক দিন। আমীন।
        </p>
      </footer>
    </div>
  );
}