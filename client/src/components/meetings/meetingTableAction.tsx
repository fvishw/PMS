import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { DeleteMeetingModal } from "./DeleteMeetingModal";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import MeetingFormDialog from "./MeetingFormDialog";
import MeetingNotesDialog from "./MeetingNotesDialog";
import type { MeetingRow } from "./meetingTable.config";

type MeetingModalType = "edit" | "delete" | "notes" | null;

export const MeetingTableAction = ({ meeting }: { meeting: MeetingRow }) => {
  const [modal, setModal] = useState<MeetingModalType>(null);

  const handleCloseModal = () => {
    setModal(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (meetingId: string) => Api.deleteMeeting(meetingId),
    onSuccess: () => {
      handleCloseModal();
      toast.success("Meeting deleted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: () => {
      toast.error("Failed to delete meeting", {
        position: "top-right",
      });
    },
  });

  const handleConfirmDelete = () => {
    mutate(meeting._id);
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
            <DropdownMenuItem onClick={() => setModal("notes")}>
              Edit Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModal("edit")}>
              Edit Meeting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModal("delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {modal === "notes" && (
          <MeetingNotesDialog
            isOpen={modal === "notes"}
            onClose={handleCloseModal}
            meetingId={meeting._id}
          />
        )}
        {modal === "edit" && (
          <MeetingFormDialog
            isOpen={modal === "edit"}
            onClose={handleCloseModal}
            editData={{
              _id: meeting._id,
              title: meeting.title,
              employee: "",
              meetingDate: meeting.meetingDate,
            }}
          />
        )}
        {modal === "delete" && (
          <DeleteMeetingModal
            isOpen={modal === "delete"}
            onClose={handleCloseModal}
            onConfirmDelete={handleConfirmDelete}
            isPending={isPending}
          />
        )}
      </div>
    </>
  );
};
