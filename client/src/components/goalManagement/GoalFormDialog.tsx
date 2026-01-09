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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function GoalFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new goal</DialogTitle>
          <DialogDescription>
            Set a clear outcome, track progress, and align with performance
            reviews.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <span className="text-sm font-medium">Goal title</span>
            <Input placeholder="Increase customer retention to 92%" />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Description</span>
            <Textarea placeholder="Add context, success criteria, and scope." />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Owner</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ava">Ava Thompson</SelectItem>
                <SelectItem value="liam">Liam Parker</SelectItem>
                <SelectItem value="sophia">Sophia Lee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Success metric</span>
            <Input placeholder="Quarterly retention rate" />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Due date</span>
            <Input type="date" />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Status</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On track</SelectItem>
                <SelectItem value="at-risk">At risk</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GoalFormDialog;
