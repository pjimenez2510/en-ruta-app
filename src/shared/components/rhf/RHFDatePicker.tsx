import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface RHFDatePickerProps {
  name: string;
  label: string;
}

const RHFDatePicker: React.FC<RHFDatePickerProps> = ({ name, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [date, setDate] = useState<Date | undefined>();

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
        render={({ field }) => {
          const handleDateChange = (selectedDate: Date | undefined) => {
            setDate(selectedDate);
            field.onChange(selectedDate ? selectedDate : undefined);
          };

          return (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              {getErrorMessage(name) && (
                <p className="mt-1 max-w-52 text-sm text-red-500">
                  {getErrorMessage(name)}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default RHFDatePicker;
