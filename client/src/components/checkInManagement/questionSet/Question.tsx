import { CustomDataTable } from "@/components/customTable";
import { Dialog } from "../../ui/dialog";
import { AddCheckInQuestionModal } from "../addQuestionModal/addCheckInQuestionModal";
import { columns } from "./questionSetTable.config";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@tanstack/react-table";

function QuestionManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["checkInQuestionsByVersion", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      Api.getAllQuestionByVersion({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <>
      <Dialog>
        <div className="w-full flex justify-end pb-4">
          {isOpen && (
            <AddCheckInQuestionModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          )}
          <Button onClick={() => setIsOpen(true)}>Add Question set</Button>
        </div>
      </Dialog>
      <CustomDataTable
        columns={columns}
        data={data?.questionSet || []}
        pagination={{
          ...pagination,
          totalItems: data?.pagination.totalItems || 0,
          onPaginationChange: setPagination,
        }}
      />
    </>
  );
}

export default QuestionManagement;
