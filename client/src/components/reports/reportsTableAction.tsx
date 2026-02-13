import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { ReportGenerateModalType } from "./reportGenerateButton";
import { ReportModal } from "./reportModal";

interface ReportsTableActionProps {
  reportId: string;
}

const ReportsTableAction = ({ reportId }: ReportsTableActionProps) => {
  const [modal, setModal] = useState<ReportGenerateModalType>(null);
  const handleCloseModal = () => {
    setModal(null);
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
            <DropdownMenuItem onSelect={() => setModal({ type: "byId" })}>
              View Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {modal && (
          <ReportModal
            reportId={reportId}
            isOpen={modal !== null}
            type={modal!.type}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export default ReportsTableAction;
