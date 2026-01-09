import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Goal = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  progress: number;
  status: "On Track" | "At Risk" | "Completed";
};

const statusStyles: Record<Goal["status"], string> = {
  "On Track": "bg-emerald-100 text-emerald-700",
  "At Risk": "bg-amber-100 text-amber-700",
  Completed: "bg-sky-100 text-sky-700",
};

function GoalsTable({ goals }: { goals: Goal[] }) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Goal</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell className="font-medium">{goal.title}</TableCell>
              <TableCell>{goal.owner}</TableCell>
              <TableCell>{goal.dueDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusStyles[goal.status]}>
                  {goal.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default GoalsTable;
