import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
  help?: string;
  required?: boolean;
  className?: string;
}

interface ConditionalFieldProps extends SmartFieldProps {
  condition: boolean;
  animation?: boolean;
}

export const SmartInput: React.FC<SmartFieldProps & { 
  type?: string; 
  placeholder?: string;
  validation?: (value: string) => string | null;
}> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text',
  placeholder,
  validation,
  error,
  help,
  required,
  className 
}) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (validation && value) {
      const validationError = validation(value);
      setLocalError(validationError);
      setIsValid(!validationError);
    } else {
      setLocalError(null);
      setIsValid(!!value);
    }
  }, [value, validation]);

  const displayError = error || localError;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
        {isValid && value && <CheckCircle2 className="h-3 w-3 text-green-500" />}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={cn(
            displayError && "border-destructive focus-visible:ring-destructive",
            isValid && value && "border-green-500"
          )}
          aria-describedby={help ? `${name}-help` : undefined}
          aria-invalid={!!displayError}
        />
        
        {displayError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
      
      {help && !displayError && (
        <p id={`${name}-help`} className="text-sm text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {help}
        </p>
      )}
    </div>
  );
};

export const SmartTextarea: React.FC<SmartFieldProps & { 
  placeholder?: string; 
  rows?: number;
  maxLength?: number;
}> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  rows = 3,
  maxLength,
  error,
  help,
  required,
  className 
}) => {
  const currentLength = value ? value.length : 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
        </span>
        {maxLength && (
          <Badge variant={isNearLimit ? "destructive" : "secondary"} className="text-xs">
            {currentLength}/{maxLength}
          </Badge>
        )}
      </Label>
      
      <Textarea
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive"
        )}
        aria-describedby={help ? `${name}-help` : undefined}
        aria-invalid={!!error}
      />

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {help && !error && (
        <p id={`${name}-help`} className="text-sm text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {help}
        </p>
      )}
    </div>
  );
};

export const SmartSelect: React.FC<SmartFieldProps & { 
  options: { value: string; label: string; description?: string }[];
  placeholder?: string;
}> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  placeholder = "Select an option",
  error,
  help,
  required,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
        {value && <CheckCircle2 className="h-3 w-3 text-green-500" />}
      </Label>
      
      <Select value={value} onValueChange={(newValue) => onChange(name, newValue)}>
        <SelectTrigger 
          className={cn(
            error && "border-destructive focus:ring-destructive"
          )}
          aria-describedby={help ? `${name}-help` : undefined}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {help && !error && (
        <p id={`${name}-help`} className="text-sm text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {help}
        </p>
      )}
    </div>
  );
};

export const SmartRadioGroup: React.FC<SmartFieldProps & { 
  options: { value: string; label: string; description?: string }[];
  layout?: 'vertical' | 'horizontal';
}> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  layout = 'vertical',
  error,
  help,
  required,
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
        {value && <CheckCircle2 className="h-3 w-3 text-green-500" />}
      </Label>
      
      <RadioGroup 
        value={value} 
        onValueChange={(newValue) => onChange(name, newValue)}
        className={cn(
          "space-y-2",
          layout === 'horizontal' && "flex flex-wrap gap-4 space-y-0"
        )}
        aria-describedby={help ? `${name}-help` : undefined}
        aria-invalid={!!error}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} className="mt-1" />
            <Label htmlFor={`${name}-${option.value}`} className="flex-1 cursor-pointer">
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {help && !error && (
        <p id={`${name}-help`} className="text-sm text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {help}
        </p>
      )}
    </div>
  );
};

export const ConditionalField: React.FC<ConditionalFieldProps & { children: React.ReactNode }> = ({
  condition,
  children,
  animation = true,
  className
}) => {
  return (
    <div 
      className={cn(
        "overflow-hidden transition-all duration-300",
        condition ? "opacity-100 max-h-screen" : "opacity-0 max-h-0",
        !animation && condition && "opacity-100",
        !animation && !condition && "hidden",
        className
      )}
    >
      {condition && children}
    </div>
  );
};

// Validation helpers
export const validationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },
  
  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s|-|\(|\)/g, ''))) {
      return "Please enter a valid phone number";
    }
    return null;
  },
  
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return "This field is required";
    }
    return null;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  website: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return "Please enter a valid website URL";
    }
  }
};