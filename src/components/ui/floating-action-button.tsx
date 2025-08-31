import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'destructive';
  className?: string;
}

export const FloatingActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  disabled = false,
  variant = 'default',
  className 
}: FloatingActionButtonProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={cn(
        "mobile-fab",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "shadow-xl hover:shadow-2xl",
        "transition-all duration-200",
        "active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={label}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
};