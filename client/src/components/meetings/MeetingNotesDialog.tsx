import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import LexicalEditor from "./LexicalEditor";

interface MeetingNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

function MeetingNotesDialog({
  isOpen,
  onClose,
  meetingId,
}: MeetingNotesDialogProps) {
  const [notesState, setNotesState] = useState<string>("");

  const { isLoading } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => Api.getMeetingById(meetingId),
    enabled: !!meetingId,
    select: (data) => {
      if (data.meeting.notes) {
        setNotesState(data.meeting.notes);
      }
      return data.meeting;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (notes: string) =>
      Api.updateMeeting(meetingId, { notes, status: "completed" }),
    onSuccess: () => {
      toast.success("Meeting notes saved.", { position: "top-right" });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save notes.");
    },
  });

  const handleSave = () => {
    mutate(notesState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Meeting Notes</DialogTitle>
          <DialogDescription>
            Write or edit meeting notes using the rich text editor below.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <LexicalEditor
            onChange={setNotesState}
            initialState={notesState || undefined}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Notes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingNotesDialog;
