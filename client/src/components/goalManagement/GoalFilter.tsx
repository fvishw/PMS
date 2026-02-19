import useUser from "@/hooks/useUser";
import { UserSelect } from "../common/userSelect";
import { GoalFilterType } from "./GoalManagement";
import { QuarterSelect } from "../common/quarterSelect";
import { YearSelect } from "../common/yearOption";

type GoalFilterProps = {
  filter: GoalFilterType;
  onChange: (filter: GoalFilterType) => void;
};
const GoalFilter = ({ filter, onChange }: GoalFilterProps) => {
  const { data: users, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="flex justify-end mb-4 gap-4">
      <UserSelect
        users={users || []}
        value={filter.userId || undefined}
        onChange={(val) => onChange({ ...filter, userId: val })}
        placeholder="Filter by user"
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
    </div>
  );
};

export default GoalFilter;
export type { GoalFilter };
