import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { yearOptions } from "@/types/option";

type UserSelectProps = {
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
}: UserSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {allowAllOption && <SelectItem value="ALL">All years</SelectItem>}
        {yearOptions.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
