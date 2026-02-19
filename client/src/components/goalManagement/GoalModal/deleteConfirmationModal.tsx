import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete?: () => void;
  isPending?: boolean;
  goalTitle?: string;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmDelete,
  isPending = false,
  goalTitle,
}: DeleteConfirmationModalProps) => {
  const handleConfirmDelete = () => {
    onConfirmDelete?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Goal</DialogTitle>
          <DialogDescription>
            {goalTitle
              ? `Are you sure you want to delete "${goalTitle}"? This action cannot be undone.`
              : "Are you sure you want to delete this goal? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
