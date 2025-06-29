import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const RHFInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
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
    <div className=" w-full space-y-1">
      {label && (
        <Label htmlFor={name} className="ml-1 ">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={field?.value || ""}
          />
        )}
      />
      <p className="text-sm text-red-500">&nbsp; {getErrorMessage(name)}</p>
    </div>
  );
};

export default RHFInput;
