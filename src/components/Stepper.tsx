import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'url', label: 'Enter URL' },
  { id: 'product', label: 'Product Details' },
  { id: 'script', label: 'Generate Script' },
  { id: 'video', label: 'Create Video' },
] as const;

export function Stepper() {
  const { step } = useStore();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                idx <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {idx + 1}
            </div>
            <div className="ml-2 text-sm hidden sm:block">
              {s.label}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'h-px w-12 sm:w-24 mx-2',
                  idx < currentStepIndex
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 