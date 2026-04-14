import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Api from "@/api/api";
import { Designation } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/utils/queryClient";
import toasterPosition from "@/utils/toaster";
import { AddDesignationModal } from "@/components/userManagement/addDesignationModal";
import { DesignationStatusModal } from "./designationStatusModal";

type DesignationActionModal = "status" | null;

export const DesignationTableAction = ({
  designation,
}: {
  designation: Designation;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modal, setModal] = useState<DesignationActionModal>(null);
  const isActive = designation.isActive !== false;

  const { mutate, isPending } = useMutation({
    mutationFn: () => Api.updateDesignationStatus(designation._id, !isActive),
    onSuccess: () => {
      setModal(null);
      toast.success(
        `Designation marked as ${isActive ? "inactive" : "active"} successfully`,
        toasterPosition,
      );
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
    onError: (error) => {
      toast.error(error.message, toasterPosition);
    },
  });

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
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Edit Designation
            </DropdownMenuItem>
            <DropdownMenuItem
              variant={isActive ? "destructive" : "default"}
              onClick={() => setModal("status")}
            >
              {isActive ? "Mark Inactive" : "Mark Active"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isEditOpen && (
        <AddDesignationModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          mode="edit"
          designation={designation}
        />
      )}
      {modal === "status" && (
        <DesignationStatusModal
          isOpen={modal === "status"}
          onClose={() => setModal(null)}
          onConfirmStatusChange={() => mutate()}
          isPending={isPending}
          designationTitle={designation.title}
          nextStatus={isActive ? "inactive" : "active"}
        />
      )}
    </>
  );
};
