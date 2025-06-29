import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RequiredLabel from './RequiredLabel';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedPasswordInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showAsterisk?: boolean;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const ValidatedPasswordInput: React.FC<ValidatedPasswordInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  showAsterisk = false,
  disabled = false,
  className,
  error = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <RequiredLabel
          htmlFor={id}
          required={required}
          showAsterisk={showAsterisk}
        >
          {label}
        </RequiredLabel>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            error && "border-red-500",
            className
          )}
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ValidatedPasswordInput; 