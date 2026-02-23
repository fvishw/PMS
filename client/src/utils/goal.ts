function getDueDateDifference(goal: IGoal): number {
  const currentDate = new Date();
  const goalDueDate = new Date(goal.dueDate);
  const timeDiff = goalDueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
export default getDueDateDifference;
