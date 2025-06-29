import { useFormContext, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import CalendarPicker from "./CaledarPicker";

interface RHFDatePickerProps {
  name: string;
  label: string;
  fromDate?: Date;
  toDate?: Date;
}

const RHFDatePicker: React.FC<RHFDatePickerProps> = ({ name, label, toDate, fromDate }) => {
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
      <Label htmlFor={name} className="mb-1 ml-1 ">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <CalendarPicker field={field} fromDate={fromDate} toDate={toDate} />
            <p className="mt-1 max-w-52 text-sm text-red-500">
              &nbsp; {getErrorMessage(name)}
            </p>
          </>
        )}
      />
    </div>
  );
};

export default RHFDatePicker;
