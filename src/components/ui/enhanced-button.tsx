import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  success?: boolean;
  enhanced?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  loading = false,
  success = false,
  enhanced = true,
  className,
  disabled,
  ...props
}) => {
  const enhancedClasses = enhanced ? [
    "relative overflow-hidden",
    "transition-all duration-300 ease-out",
    "transform hover:scale-105 active:scale-95",
    "hover:shadow-lg hover:shadow-electric-300/25",
    "focus:ring-2 focus:ring-electric-300/50 focus:ring-offset-2",
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
    "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
    success && "bg-green-500 hover:bg-green-600",
    loading && "animate-pulse"
  ].filter(Boolean).join(" ") : "";

  return (
    <Button
      className={cn(enhancedClasses, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100 transition-opacity"}>
        {success ? "✓ Sikeres!" : children}
      </span>
    </Button>
  );
};