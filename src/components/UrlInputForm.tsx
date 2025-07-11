import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const { setLoading, setError, setProduct, setStep } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape product data');
      }

      const product = await response.json();
      setProduct(product);
      setStep('product');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate AI Video Ad</CardTitle>
        <CardDescription>
          Paste a product URL from Amazon or Shopify to generate a video ad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="url"
            placeholder="https://www.amazon.com/product-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Generate Video Ad
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 