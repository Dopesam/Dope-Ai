export enum AppMode {
  IMAGE = 'IMAGE',
  THUMBNAIL = 'THUMBNAIL',
  VOICEOVER = 'VOICEOVER'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16'
}

export enum ImageSize {
  LOW = '1K',
  MID = '2K',
  HIGH = '4K'
}

export enum VoiceName {
  Puck = 'Puck',     // Male, Energetic
  Charon = 'Charon', // Male, Deep
  Kore = 'Kore',     // Female, Calm
  Fenrir = 'Fenrir', // Male, Intense
  Zephyr = 'Zephyr'  // Female, Soft
}

export type Theme = 'light' | 'dark' | 'system';

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedAudio {
  url: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
}

export interface SocialPreset {
  name: string;
  icon: string;
  ratio: AspectRatio;
  description: string;
}