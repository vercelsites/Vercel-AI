export enum Sender {
  User = 'User',
  AI = 'AI'
}

export enum AspectRatio {
  Square = '1:1',
  Landscape = '16:9',
  Portrait = '9:16',
  StandardLandscape = '4:3',
  StandardPortrait = '3:4'
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text?: string;
  images?: GeneratedImage[];
  timestamp: number;
  isError?: boolean;
}

export interface ImageGenerationOptions {
  aspectRatio: AspectRatio;
  numberOfVariations: number;
}
