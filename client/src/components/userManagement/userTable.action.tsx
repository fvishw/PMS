import { IUser } from "@/types/user";
import { useState } from "react";
import { AddUserModal } from "./addUserModal";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteUserConfirmationModal } from "./deleteUserConfirmationModal";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import toasterPosition from "@/utils/toaster";
import { queryClient } from "@/utils/queryClient";

type UserActionModal = "edit" | "status" | null;

export const UserTableAction = ({ user }: { user: IUser }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modal, setModal] = useState<UserActionModal>(null);
  const isActive = user.isActive !== false;

  const { mutate, isPending } = useMutation({
    mutationFn: () => Api.updateUserStatus(user._id, !isActive),
    onSuccess: () => {
      setModal(null);
      toast.success(
        `User marked as ${isActive ? "inactive" : "active"} successfully`,
        toasterPosition,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(
        `Failed to update user status: ${error.message}`,
        toasterPosition,
      );
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
              Edit User
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
        <AddUserModal
          mode="edit"
          user={user}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
      {modal === "status" && (
        <DeleteUserConfirmationModal
          isOpen={modal === "status"}
          onClose={() => setModal(null)}
          onConfirmStatusChange={() => mutate()}
          isPending={isPending}
          userName={user.fullName}
          nextStatus={isActive ? "inactive" : "active"}
        />
      )}
    </>
  );
};
