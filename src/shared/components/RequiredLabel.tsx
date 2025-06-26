import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RequiredLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  showAsterisk?: boolean;
  className?: string;
}

const RequiredLabel: React.FC<RequiredLabelProps> = ({
  htmlFor,
  children,
  required = false,
  showAsterisk = false,
  className,
}) => {
  return (
    <Label 
      htmlFor={htmlFor} 
      className={cn("ml-1", className)}
    >
      {children}
      {required && showAsterisk && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </Label>
  );
};

export default RequiredLabel; 