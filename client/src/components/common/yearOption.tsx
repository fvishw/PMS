import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { yearOptions } from "@/types/option";

type YearSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowAllOption?: boolean;
};

export function YearSelect({
  value,
  onChange,
  placeholder = "Select year",
  allowAllOption,
}: YearSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {allowAllOption && <SelectItem value="ALL">All years</SelectItem>}
        {yearOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
