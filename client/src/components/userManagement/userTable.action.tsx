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

type UserActionModal = "edit" | "delete" | null;

export const UserTableAction = ({ user }: { user: IUser }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modal, setModal] = useState<UserActionModal>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (userId: string) => Api.deleteUserById(userId),
    onSuccess: () => {
      setModal(null);
      toast.success("User deleted successfully", toasterPosition);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`, toasterPosition);
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
              variant="destructive"
              onClick={() => setModal("delete")}
            >
              Delete User
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
      {modal === "delete" && (
        <DeleteUserConfirmationModal
          isOpen={modal === "delete"}
          onClose={() => setModal(null)}
          onConfirmDelete={() => mutate(user._id)}
          isPending={isPending}
          userName={user.fullName}
        />
      )}
    </>
  );
};
