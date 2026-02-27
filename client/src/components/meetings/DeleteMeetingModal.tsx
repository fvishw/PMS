import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  isPending?: boolean;
}

export const DeleteMeetingModal = ({
  isOpen,
  onClose,
  onConfirmDelete,
  isPending = false,
}: DeleteMeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Meeting</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this meeting? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
