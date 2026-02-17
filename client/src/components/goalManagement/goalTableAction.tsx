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
import { DeleteConfirmationModal } from "./GoalModal/deleteConfirmationModal";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";

type GoalModalType = "view" | "delete" | null;
export const GoalTableAction = ({ goalId }: { goalId: string }) => {
  const [modal, setModal] = useState<GoalModalType>(null);
  const handleCloseModal = () => {
    setModal(null);
  };
  const { mutate } = useMutation({
    mutationFn: (goalId: string) => Api.deleteGoalById(goalId),
    onSuccess: () => {
      handleCloseModal();
      toast.success("Goal deleted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: () => {
      toast.error("Failed to delete goal", {
        position: "top-right",
      });
    },
  });
  const handleConfirmDelete = () => {
    mutate(goalId);
  };

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
            <DropdownMenuItem onClick={() => setModal("view")}>
              View Goal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModal("delete")}>
              Delete Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {modal === "view" && (
          <ViewGoalModal
            goalId={goalId}
            isOpen={modal === "view"}
            onClose={handleCloseModal}
          />
        )}
        {modal === "delete" && (
          <DeleteConfirmationModal
            isOpen={modal === "delete"}
            onClose={handleCloseModal}
            onConfirmDelete={handleConfirmDelete}
          />
        )}
      </div>
    </>
  );
};
