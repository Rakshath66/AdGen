import { create } from 'zustand';
import { AppState, Product } from '@/types/product';

type Step = 'url' | 'product' | 'script' | 'video';

const initialState: AppState = {
  step: 'url' as Step,
  product: null,
  script: null,
  videoUrl: null,
  isLoading: false,
  error: null,
};

export const useStore = create<AppState & {
  setStep: (step: Step) => void;
  setProduct: (product: Product) => void;
  setScript: (script: string) => void;
  setVideo: (videoUrl: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setProduct: (product) => set({ product }),
  setScript: (script) => set({ script }),
  setVideo: (videoUrl) => set({ videoUrl }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
})); 