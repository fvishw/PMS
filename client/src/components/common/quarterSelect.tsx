import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quarterOptions } from "@/types/option";

type UserSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowAllOption?: boolean;
};

export function QuarterSelect({
  value,
  onChange,
  placeholder = "Select quarter",
  allowAllOption,
}: UserSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {allowAllOption && <SelectItem value="ALL">All quarters</SelectItem>}

        {quarterOptions.map((q) => (
          <SelectItem key={q.value} value={q.value}>
            {q.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
