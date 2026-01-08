import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
export const ReviewTableAction = ({ row }: { row: any }) => {
  const performanceId = row.original._id;
  const navigate = useNavigate();
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
            <DropdownMenuItem
              onClick={() => navigate(`/review-appraisals/${performanceId}`)}
            >
              View Appraisal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
