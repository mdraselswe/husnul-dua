export interface DuaSegment {
  arabic?: string;
  transliteration?: string;
  bengali?: string;
  source?: string;
}

export interface Dua {
  id: string;
  titleBengali: string;
  titleEnglish?: string;
  arabic?: string;
  transliteration?: string;
  bengali: string;
  english?: string;
  tags: string;
  category?: string;
  source?: string;
  times?: string;
  benefits?: string;
  fojilot?: string;
  rules?: string;
  context?: string;
  quranRef?: string;
  videoUrl?: string;
  articleUrl?: string;
  segments?: DuaSegment[];
  status?: string;
  rejectReason?: string;
  createdAt?: string;
}

export type DuaFormData = Omit<Dua, "id"> & { id?: string };
