import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import GoalFormDialog from "@/components/goalManagement/GoalFormDialog";
import GoalsFilters from "@/components/goalManagement/GoalsFilters";
import GoalsSummary from "@/components/goalManagement/GoalsSummary";
import GoalsTable, { Goal } from "@/components/goalManagement/GoalsTable";
import { Button } from "@/components/ui/button";

function MyGoalLayout() {
  const goals: Goal[] = [
    {
      id: "goal-1",
      title: "Increase customer retention to 92%",
      owner: "Ava Thompson",
      dueDate: "Dec 20, 2024",
      progress: 72,
      status: "On Track",
    },
    {
      id: "goal-2",
      title: "Launch performance feedback hub",
      owner: "Liam Parker",
      dueDate: "Nov 08, 2024",
      progress: 54,
      status: "At Risk",
    },
    {
      id: "goal-3",
      title: "Reduce onboarding time to 3 weeks",
      owner: "Sophia Lee",
      dueDate: "Oct 01, 2024",
      progress: 90,
      status: "On Track",
    },
    {
      id: "goal-4",
      title: "Publish manager enablement playbook",
      owner: "Noah Garcia",
      dueDate: "Sep 05, 2024",
      progress: 100,
      status: "Completed",
    },
  ];

  const summary = goals.reduce(
    (counts, goal) => {
      if (goal.status === "On Track") {
        counts.onTrack += 1;
      }
      if (goal.status === "At Risk") {
        counts.atRisk += 1;
      }
      if (goal.status === "Completed") {
        counts.completed += 1;
      }
      counts.total += 1;
      return counts;
    },
    { total: 0, onTrack: 0, atRisk: 0, completed: 0 }
  );

  return (
    <>
      <SiteHeader headerName="Goal Management" />
      <OutletWrapper>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Track team goals and outcomes
              </h2>
              <p className="text-sm text-muted-foreground">
                Keep goals aligned with performance cycles and progress updates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Export</Button>
              <GoalFormDialog />
            </div>
          </div>

          <GoalsSummary {...summary} />

          <GoalsFilters />

          <GoalsTable goals={goals} />
        </div>
      </OutletWrapper>
    </>
  );
}

export default MyGoalLayout;
