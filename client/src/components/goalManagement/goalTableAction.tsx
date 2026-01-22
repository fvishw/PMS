import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { ViewGoalModal } from "./viewGoal/viewGoalModal";
export const GoalTableAction = ({ goalId }: { goalId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              View Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isOpen && (
          <ViewGoalModal
            goalId={goalId}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
};
