export type Step = 'url' | 'product' | 'script' | 'video';

export interface Product {
  title: string;
  image: string;
  images: string[];  // Array of additional product images
  price?: string;
  description: string;
  features: string[];
  url: string;
}

export interface GeneratedScript {
  script: string;
}

export interface VideoResult {
  videoUrl: string;
}

export interface AppState {
  step: Step;
  product: Product | null;
  script: string | null;
  videoUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_STEP'; payload: AppState['step'] }
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_SCRIPT'; payload: string }
  | { type: 'SET_VIDEO'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }; 