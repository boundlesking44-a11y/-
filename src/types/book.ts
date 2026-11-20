export type ArtifactId =
  | 'uv_lens'
  | 'brass_key'
  | 'astro_compass'
  | 'echo_crystal'
  | 'luni_feather'
  | 'star_fuel';

export interface ArtifactInfo {
  id: ArtifactId;
  name: string;
  subtitle: string;
  description: string;
  foundOnPage: number;
}

export interface ConstellationStar {
  id: number;
  x: number;
  y: number;
}

export interface StoryPage {
  id: number; // 1..18
  chapterLabel: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  whisperHint: string;
  questTitle: string;
  questInstruction: string;
  rewardArtifact?: ArtifactId;
  isCover?: boolean;
  isFinale?: boolean;
}

export interface BookProgress {
  currentPage: number;
  nightGlow: boolean;
  soundEnabled: boolean;
  completedQuests: number[];
  artifacts: ArtifactId[];
  readerName: string;
  customConstellation: ConstellationStar[];
  constellationName: string;
  visitedPages: number[];
}
