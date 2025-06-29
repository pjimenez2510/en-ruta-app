import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar1 } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface CalendarPicker {
  field: ControllerRenderProps<FieldValues, string>;
  fromDate?: Date
  toDate?: Date
}

const CalendarPicker = ({ field, fromDate, toDate }: CalendarPicker) => {
  const extractDatePartsString = (isoDate: string) => {
    if (!isoDate) return undefined;
    const [datePart] = isoDate.split("T");
    const [año, mes, dia] = datePart.split("-").map(Number);
    return new Date(año, mes - 1, dia);
  };

  const [date, setDate] = useState<Date | undefined>(
    typeof field.value === "string"
      ? extractDatePartsString(field.value)
      : field.value
  );

  // Estado para controlar el mes y año visible en el calendario
  const [currentMonth, setCurrentMonth] = useState<Date>(date || new Date());

  const handleDateChange = (selectedDate: Date | undefined | string) => {
    setDate(
      typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate
    );
    field.onChange(selectedDate);
  };

  // Generar array de años (desde hace 100 años hasta dentro de 10 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  // Array de meses en español
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      parseInt(monthIndex),
      1
    );
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "mt-1 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Calendar1 className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: es })
          ) : (
            <span>Selecciona una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          {/* Header con selectores de mes y año */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              {/* Selector de mes */}
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selector de año */}
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendario */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            initialFocus
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarPicker;
