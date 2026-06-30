"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddDuaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleBengali: "",
    titleEnglish: "",
    arabic: "",
    transliteration: "",
    bengali: "",
    english: "",
    tags: "",
    category: "",
    source: "",
    times: "",
    benefits: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.titleBengali ||
      !formData.bengali ||
      !formData.tags
    ) {
      alert("অনুগ্রহ করে আবশ্যকীয় ক্ষেত্রগুলো পূরণ করুন (শিরোনাম, বাংলা, ট্যাগ)");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/duas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("দুআ সফলভাবে যোগ করা হয়েছে!");
        router.push("/");
      } else {
        const error = await response.json();
        alert(`ত্রুটি: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding dua:", error);
      alert("দুআ যোগ করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-green-100 mb-4 font-bengali"
          >
            <ArrowLeft className="w-5 h-5" />
            ফিরে যান
          </button>
          <h1 className="text-3xl font-bold font-bengali">নতুন দুআ যোগ করুন</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold font-bengali mb-4 text-gray-900 dark:text-white">
              মূল তথ্য
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  শিরোনাম (বাংলা) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titleBengali"
                  value={formData.titleBengali}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="যেমন: মাথা ব্যথার দোয়া"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  শিরোনাম (ইংরেজি) - ঐচ্ছিক
                </label>
                <input
                  type="text"
                  name="titleEnglish"
                  value={formData.titleEnglish}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Dua for Headache"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  আরবি - ঐচ্ছিক
                </label>
                <textarea
                  name="arabic"
                  value={formData.arabic}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-arabic text-xl text-right"
                  placeholder="আরবি পাঠ এখানে লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  উচ্চারণ (ইংরেজিতে) - ঐচ্ছিক
                </label>
                <textarea
                  name="transliteration"
                  value={formData.transliteration}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white italic"
                  placeholder="Transliteration in English"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  বাংলা অনুবাদ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bengali"
                  value={formData.bengali}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="বাংলা অনুবাদ এখানে লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  ইংরেজি অনুবাদ - ঐচ্ছিক
                </label>
                <textarea
                  name="english"
                  value={formData.english}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="English translation (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  ট্যাগ (কমা দ্বারা পৃথক করুন) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="যেমন: মাথা ব্যথা, শরীর ব্যথা, যেকোন ব্যথা"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bengali">
                  একাধিক ট্যাগ কমা দিয়ে পৃথক করুন। একই দুআ অনেক কাজে ব্যবহার করা যাবে।
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold font-bengali mb-4 text-gray-900 dark:text-white">
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  বিষয়/বিভাগ
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="যেমন: স্বাস্থ্য, সুরক্ষা, রিযিক"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  উৎস
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="যেমন: সহীহ বুখারী, সহীহ মুসলিম"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  পড়ার সময়/সংখ্যা
                </label>
                <input
                  type="text"
                  name="times"
                  value={formData.times}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="যেমন: ৩ বার, ফজরের পর"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-bengali text-gray-700 dark:text-gray-300 mb-2">
                  ফায়েদা
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bengali"
                  placeholder="এই দুআ পড়ার ফায়েদা সম্পর্কে লিখুন"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-bengali font-semibold transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-bengali font-semibold transition-colors shadow-md"
            >
              <Save className="w-5 h-5" />
              {loading ? "সংরক্ষণ করা হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
