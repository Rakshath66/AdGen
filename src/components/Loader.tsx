import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface LoaderProps {
  message: string;
}

export function Loader({ message }: LoaderProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-center text-sm text-muted-foreground">{message}</p>
        <Progress value={33} className="w-full" />
      </CardContent>
    </Card>
  );
} 