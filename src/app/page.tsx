'use client';

import { useStore } from '@/lib/store';
import { Stepper } from '@/components/Stepper';
import { UrlInputForm } from '@/components/UrlInputForm';
import { ProductPreview } from '@/components/ProductPreview';
import { ScriptPreview } from '@/components/ScriptPreview';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Loader } from '@/components/Loader';

const loadingMessages: Record<'url' | 'product' | 'script' | 'video', string> = {
  url: 'Analyzing product page...',
  product: 'Generating ad script...',
  script: 'Creating video...',
  video: 'Processing video...',
};

export default function Home() {
  const { step, isLoading, error } = useStore();

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Video Ad Generator</h1>
          <p className="text-xl text-muted-foreground">
            Transform any product page into a compelling video ad in minutes
          </p>
        </div>

        <Stepper />

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <Loader message={loadingMessages[step]} />
        ) : (
          <>
            {step === 'url' && <UrlInputForm />}
            {step === 'product' && <ProductPreview />}
            {step === 'script' && <ScriptPreview />}
            {step === 'video' && <VideoPlayer />}
          </>
        )}
      </div>
    </main>
  );
}
