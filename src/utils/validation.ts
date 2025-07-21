
// Validation utilities for forms and user inputs

export const emailValidation = {
  validate: (email: string): { isValid: boolean; error?: string } => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email cím megadása kötelező' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Kérjük, adjon meg egy érvényes email címet' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Az email cím túl hosszú' };
    }
    
    return { isValid: true };
  },
  
  suggestions: (email: string): string[] => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const [localPart, domain] = email.split('@');
    
    if (!domain) return [];
    
    return commonDomains
      .filter(commonDomain => 
        commonDomain.startsWith(domain.toLowerCase()) && 
        commonDomain !== domain.toLowerCase()
      )
      .map(suggestion => `${localPart}@${suggestion}`)
      .slice(0, 3);
  }
};

export const formValidation = {
  required: (value: any): { isValid: boolean; error?: string } => {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: 'Ez a mező kötelező' };
    }
    return { isValid: true };
  },
  
  minLength: (value: string, min: number): { isValid: boolean; error?: string } => {
    if (value.length < min) {
      return { isValid: false, error: `Legalább ${min} karakter szükséges` };
    }
    return { isValid: true };
  },
  
  maxLength: (value: string, max: number): { isValid: boolean; error?: string } => {
    if (value.length > max) {
      return { isValid: false, error: `Maximum ${max} karakter engedélyezett` };
    }
    return { isValid: true };
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
