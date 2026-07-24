export type Surah = {
  id: number;
  name: string;
  totalVerses: number;
};

export type RootTabParamList = {
  Home: undefined;
  'Surah Ascend': undefined;
  About: undefined;
};

export type QuranProgress = {
  tappedVerse: number | null;
  selectedSurahName: string | null;
  selectedSurahId: number | null;
  surahScrollPosition: number;
  verseScrollPosition: number;
};
