import { MoreVertical } from "lucide-react";
import { UserPastCheckInModal } from "./userPastCheckInModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const CheckInTableAction = ({ checkInId }: { checkInId: string }) => {
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
              View CheckIns
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isOpen && (
        <UserPastCheckInModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          checkInId={checkInId}
        />
      )}
    </>
  );
};
