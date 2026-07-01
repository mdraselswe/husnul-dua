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
  videoUrl?: string;
  articleUrl?: string;
  status?: string;
}

export type DuaFormData = Omit<Dua, "id"> & { id?: string };
