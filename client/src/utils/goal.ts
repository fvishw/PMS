import type { Goal as IGoal } from "@/types/goal";

function getDueDateDifference(goal: IGoal): number {
  const toLocalDateStart = (value: Date | string): Date => {
    if (typeof value === "string") {
      const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
      if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  };

  const currentDate = toLocalDateStart(new Date());
  const goalDueDate = toLocalDateStart(goal.dueDate);
  const timeDiff = goalDueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
export default getDueDateDifference;
