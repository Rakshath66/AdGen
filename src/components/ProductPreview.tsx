import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Product } from '@/types/product';

export function ProductPreview() {
  const { product, setLoading, setError, setScript, setStep } = useStore();

  if (!product) return null;

  const handleGenerateScript = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const { script } = await response.json();
      setScript(script);
      setStep('script');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-[400px]">
          <Image
            src={product.image.includes('360') || product.image.toLowerCase().includes('spin') 
              ? (product.images.find(img => !img.includes('360') && !img.toLowerCase().includes('spin')) || product.image)
              : product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={100}
            unoptimized
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          {product.price && (
            <p className="text-sm text-muted-foreground">Price: {product.price}</p>
          )}
          <p className="text-sm">{product.description}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium">Key Features:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateScript} className="w-full">
          Generate Ad Script
        </Button>
      </CardFooter>
    </Card>
  );
} 