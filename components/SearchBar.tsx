"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTagFilter: (tag: string) => void;
  selectedTag?: string;
}

export default function SearchBar({
  onSearch,
  onTagFilter,
  selectedTag,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch tags
    fetch("/api/duas/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="দুআ, ট্যাগ বা বিষয়বস্তু খুঁজুন..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bengali text-base"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-bengali transition-colors ${
              !selectedTag
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            সব
          </button>
          {tags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-bengali transition-colors ${
                selectedTag === tag
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
