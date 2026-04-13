import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DeleteUserConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStatusChange: () => void;
  isPending?: boolean;
  userName?: string;
  nextStatus: "active" | "inactive";
}

export const DeleteUserConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmStatusChange,
  isPending = false,
  userName,
  nextStatus,
}: DeleteUserConfirmationModalProps) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const isActivating = nextStatus === "active";

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      setIsAcknowledged(false);
      onClose();
    }
  };

  const handleConfirmDelete = () => {
    if (!isAcknowledged || isPending) {
      return;
    }
    onConfirmStatusChange();
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }
    setIsAcknowledged(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>
            {isActivating ? "Activate User" : "Deactivate User"}
          </DialogTitle>
          <DialogDescription>
            {userName
              ? `${isActivating ? "Activate" : "Deactivate"} "${userName}" account.`
              : `${isActivating ? "Activate" : "Deactivate"} this user account.`}
          </DialogDescription>
        </DialogHeader>
        <div
          className={
            isActivating
              ? "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
              : "rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          }
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold">Warning</p>
              {isActivating ? (
                <p>
                  This will restore the user’s access so they can sign in and
                  appear in active user selections again.
                </p>
              ) : (
                <p>
                  This will mark the user as inactive. They will no longer be
                  able to sign in or appear in active user selections, but
                  their historical records will be preserved.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-md border p-3">
          <Checkbox
            id="delete-user-acknowledgement"
            checked={isAcknowledged}
            onCheckedChange={(checked) => setIsAcknowledged(checked === true)}
            disabled={isPending}
          />
          <Label
            htmlFor="delete-user-acknowledgement"
            className="leading-5 font-normal"
          >
            {isActivating
              ? "I understand this user will regain system access."
              : "I understand this user will lose system access until reactivated."}
          </Label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={isActivating ? "default" : "destructive"}
            onClick={handleConfirmDelete}
            disabled={isPending || !isAcknowledged}
          >
            {isPending
              ? isActivating
                ? "Activating..."
                : "Updating..."
              : isActivating
                ? "Activate User"
                : "Deactivate User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
