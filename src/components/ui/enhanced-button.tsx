
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  success?: boolean;
  enhanced?: boolean;
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  buttonVariant?: 'primary' | 'secondary' | 'ghost';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  loading = false,
  success = false,
  enhanced = true,
  buttonSize = 'md',
  buttonVariant = 'primary',
  className,
  disabled,
  ...props
}) => {
  const enhancedClasses = enhanced ? cn(
    "btn-base",
    {
      'btn-primary': buttonVariant === 'primary',
      'btn-secondary': buttonVariant === 'secondary', 
      'btn-ghost': buttonVariant === 'ghost',
    },
    {
      'btn-size-sm': buttonSize === 'sm',
      'btn-size-md': buttonSize === 'md',
      'btn-size-lg': buttonSize === 'lg',
      'btn-size-xl': buttonSize === 'xl',
    },
    "focus-ring relative overflow-hidden",
    success && "!bg-green-500 hover:!bg-green-600",
    loading && "animate-pulse cursor-not-allowed",
    className
  ) : className;

  return (
    <Button
      className={enhancedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="loading-spinner" />
      )}
      {!loading && (
        <span className={cn(
          "transition-all duration-200",
          success && "flex items-center gap-2"
        )}>
          {success ? (
            <>
              <span className="text-lg">✓</span>
              <span>Sikeres!</span>
            </>
          ) : (
            children
          )}
        </span>
      )}
    </Button>
  );
};
