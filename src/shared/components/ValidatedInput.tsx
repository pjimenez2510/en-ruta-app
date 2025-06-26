import React from 'react';
import { Input } from '@/components/ui/input';
import RequiredLabel from './RequiredLabel';
import { cn } from '@/lib/utils';

interface ValidatedInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showAsterisk?: boolean;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  showAsterisk = false,
  disabled = false,
  className,
  error = false,
}) => {
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
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          error && "border-red-500",
          className
        )}
      />
    </div>
  );
};

export default ValidatedInput; 