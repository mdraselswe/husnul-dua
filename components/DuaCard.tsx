"use client";

interface DuaCardProps {
  dua: {
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
  };
}

export default function DuaCard({ dua }: DuaCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      {/* Title */}
      <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
        {dua.titleBengali}
      </h2>
      {dua.titleEnglish && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {dua.titleEnglish}
        </p>
      )}

      {/* Arabic Text */}
      <div className="mb-4">
        <p className="text-2xl font-arabic text-right leading-relaxed text-gray-900 dark:text-white">
          {dua.arabic}
        </p>
      </div>

      {/* Transliteration */}
      <div className="mb-4 bg-gray-50 dark:bg-gray-900 p-4 rounded">
        <p className="text-lg italic text-gray-700 dark:text-gray-300">
          {dua.transliteration}
        </p>
      </div>

      {/* Bengali Translation */}
      <div className="mb-4">
        <p className="text-base font-bengali text-gray-700 dark:text-gray-300 leading-relaxed">
          {dua.bengali}
        </p>
      </div>

      {/* English Translation (if available) */}
      {dua.english && (
        <div className="mb-4">
          <p className="text-base text-gray-600 dark:text-gray-400 italic">
            {dua.english}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dua.tags.split(",").map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-bengali"
          >
            {tag.trim()}
          </span>
        ))}
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        {dua.source && (
          <p>
            <span className="font-semibold font-bengali">উৎস:</span> {dua.source}
          </p>
        )}
        {dua.times && (
          <p>
            <span className="font-semibold font-bengali">পড়ার সময়/সংখ্যা:</span>{" "}
            <span className="font-bengali">{dua.times}</span>
          </p>
        )}
        {dua.benefits && (
          <p>
            <span className="font-semibold font-bengali">ফায়েদা:</span>{" "}
            <span className="font-bengali">{dua.benefits}</span>
          </p>
        )}
      </div>
    </div>
  );
}
