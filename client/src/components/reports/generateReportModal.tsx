import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GenerateReportModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Generate Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Add a new designation by selecting a role and entering a title.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3"></div>
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Software Engineer" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add Designation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
