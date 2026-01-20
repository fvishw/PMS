import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QuestionsModal } from "./QuestionsModal";
import { toast } from "sonner";
import Api from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import toasterPosition from "@/utils/toaster";

interface QuestionTableActionProps {
  version: string;
  designationId: string;
  isActive: boolean;
}

export const QuestionTableAction = ({
  version,
  designationId,
  isActive,
}: QuestionTableActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useMutation({
    mutationFn: ({
      version,
      designationId,
    }: {
      version: string;
      designationId: string;
    }) => Api.setActiveQuestionSet(version, designationId),
    onError: (error) => {
      toast.error(error.message || "Failed to set active question set", {
        position: "top-right",
      });
    },
    onSuccess: () => {
      toast.success("Active question set updated", toasterPosition);
    },
  });

  const handleVersionActivate = (version: string, designationId: string) => {
    mutate({ version, designationId });
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
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              View Questions
            </DropdownMenuItem>
            {
              <DropdownMenuItem
                onClick={() => handleVersionActivate(version, designationId)}
              >
                Set as Active
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isOpen && (
        <QuestionsModal
          version={version}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
