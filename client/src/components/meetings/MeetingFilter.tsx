import useUser from "@/hooks/useUser";
import { UserSelect } from "../common/userSelect";
import { QuarterSelect } from "../common/quarterSelect";
import { YearSelect } from "../common/yearOption";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MeetingFilterType = {
  employeeId: string | null;
  quarter: string | null;
  year: string | null;
  status: string | null;
};

type MeetingFilterProps = {
  filter: MeetingFilterType;
  onChange: (filter: MeetingFilterType) => void;
};

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const MeetingFilter = ({ filter, onChange }: MeetingFilterProps) => {
  const { data: users, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="flex justify-end mb-4 gap-4">
      <UserSelect
        users={users || []}
        value={filter.employeeId || undefined}
        onChange={(val) => onChange({ ...filter, employeeId: val })}
        placeholder="Filter by employee"
        isLoading={isLoading}
        allowAllOption
      />

      <QuarterSelect
        onChange={(value) => onChange({ ...filter, quarter: value })}
        value={filter.quarter || undefined}
        placeholder="Filter by quarter"
        allowAllOption
      />

      <YearSelect
        onChange={(value) => onChange({ ...filter, year: value })}
        value={filter.year || undefined}
        placeholder="Filter by year"
        allowAllOption
      />

      <Select
        value={filter.status || undefined}
        onValueChange={(value) => onChange({ ...filter, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MeetingFilter;
