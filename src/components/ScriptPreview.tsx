import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Player } from '@remotion/player';
import { AdVideo } from './video/AdVideo';

export function ScriptPreview() {
  const { script, product, setLoading, setError, setVideo, setStep } = useStore();

  if (!script || !product) return null;

  const handleGenerateVideo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const { videoUrl, renderConfig } = await response.json();
      
      // Set up the video player with the script
      setVideo(videoUrl);
      setStep('video');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generated Ad Script</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm">
          <p className="whitespace-pre-wrap">{script}</p>
        </div>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <Player
            component={AdVideo}
            durationInFrames={450}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 400px)',
              imageRendering: '-webkit-optimize-contrast',
              WebkitFontSmoothing: 'antialiased'
            }}
            inputProps={{
              script,
              product,
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateVideo} className="w-full">
          Generate Video
        </Button>
      </CardFooter>
    </Card>
  );
} 