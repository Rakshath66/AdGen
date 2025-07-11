import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Player } from '@remotion/player';
import { AdVideo } from './video/AdVideo';

export function VideoPlayer() {
  const { videoUrl, script, product } = useStore();

  if (!videoUrl || !script || !product) return null;

  const handleDownload = async () => {
    try {
      // Create a unique filename based on timestamp and product name
      const timestamp = new Date().getTime();
      const sanitizedProductName = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50); // Limit length
      const filename = `${sanitizedProductName}-${timestamp}.mp4`;

      // Fetch the video data
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Create a link to download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(link.href);

      // Save to downloads directory using the API
      const formData = new FormData();
      formData.append('video', blob, filename);
      
      await fetch('/api/save-video', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Generated Video Ad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative">
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
              maxHeight: 'calc(100vh - 300px)',
              imageRendering: '-webkit-optimize-contrast',
              WebkitFontSmoothing: 'antialiased'
            }}
            inputProps={{
              script,
              product,
            }}
            controls
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDownload} className="w-full">
          Download Video
        </Button>
      </CardFooter>
    </Card>
  );
} 