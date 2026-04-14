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

interface DesignationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStatusChange: () => void;
  isPending?: boolean;
  designationTitle?: string;
  nextStatus: "active" | "inactive";
}

export const DesignationStatusModal = ({
  isOpen,
  onClose,
  onConfirmStatusChange,
  isPending = false,
  designationTitle,
  nextStatus,
}: DesignationStatusModalProps) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const isActivating = nextStatus === "active";

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      setIsAcknowledged(false);
      onClose();
    }
  };

  const handleConfirm = () => {
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
            {isActivating ? "Activate Designation" : "Deactivate Designation"}
          </DialogTitle>
          <DialogDescription>
            {designationTitle
              ? `${isActivating ? "Activate" : "Deactivate"} "${designationTitle}".`
              : `${isActivating ? "Activate" : "Deactivate"} this designation.`}
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
                  This designation will become available again in admin
                  dropdowns and management flows.
                </p>
              ) : (
                <p>
                  This designation will be hidden from active admin dropdowns,
                  but existing users and records linked to it will stay intact.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-md border p-3">
          <Checkbox
            id="designation-status-acknowledgement"
            checked={isAcknowledged}
            onCheckedChange={(checked) => setIsAcknowledged(checked === true)}
            disabled={isPending}
          />
          <Label
            htmlFor="designation-status-acknowledgement"
            className="leading-5 font-normal"
          >
            {isActivating
              ? "I understand this designation will be available for use again."
              : "I understand this designation will be removed from active selections."}
          </Label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={isActivating ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending || !isAcknowledged}
          >
            {isPending
              ? isActivating
                ? "Activating..."
                : "Updating..."
              : isActivating
                ? "Activate Designation"
                : "Deactivate Designation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
