import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface RHFCheckboxGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

const RHFCheckboxGroup: React.FC<RHFCheckboxGroupProps> = ({
  name,
  label,
  options,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getErrorMessage = (name: string): string | undefined => {
    const error = errors[name];
    return error && typeof error.message === "string"
      ? error.message
      : undefined;
  };

  return (
    <div className="w-full">
      <Label htmlFor={name} className="ml-1">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="flex flex-wrap">
              {options.map((option) => (
                <div key={option.value} className="flex items-center mr-4 mb-2">
                  <Checkbox
                    id={`${name}_${option.value}`}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(field.value || []), option.value]
                        : field.value.filter((v: string) => v !== option.value);
                      field.onChange(newValue);
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`${name}_${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-red-500">
              &nbsp;{getErrorMessage(name)}
            </p>
          </>
        )}
      />
    </div>
  );
};

export default RHFCheckboxGroup;
