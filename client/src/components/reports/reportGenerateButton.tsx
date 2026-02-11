import Api from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { ReportModal } from "./reportModal";
import { useState } from "react";
import { queryClient } from "@/utils/queryClient";

function ReportGenerateButton() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentQuarterReportStatus"],
    queryFn: () => Api.getCurrentQuarterReportStatus(),
  });
  const [modal, setModal] = useState<{
    type: "current" | "generate" | "byId";
  } | null>(null);
  const {
    mutate: generateReport,
    isPending: isGeneratingReport,
    error: generateError,
    reset: resetGenerateState,
  } = useMutation({
    mutationKey: ["generateUserReport"],
    mutationFn: () => Api.generateUserReport(),
    onSuccess: (generatedReport) => {
      queryClient.setQueryData(["currentQuarterReport"], generatedReport);
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentQuarterReportStatus"],
      });
      setModal({ type: "current" });
    },
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-35" />;
  }
  if (error) {
    return <div>Error loading report status</div>;
  }
  const hasCurrentQuarterReport = data?.hasCurrentQuarterReport;
  const isAppraisalCompleted = data?.isAppraisalCompleted;
  
  const handleCloseModal = () => {
    queryClient.invalidateQueries({
      queryKey: ["reports"],
    });
    queryClient.invalidateQueries({
      queryKey: ["currentQuarterReportStatus"],
    });
    resetGenerateState();
    setModal(null);
  };

  const handleGenerateReport = () => {
    setModal({ type: "generate" });
    generateReport();
  };

  const button = isAppraisalCompleted ? (
    hasCurrentQuarterReport ? (
      <Button onClick={() => setModal({ type: "current" })}>
        View Current Report
      </Button>
    ) : (
      <Button onClick={handleGenerateReport}>
        Generate Report
      </Button>
    )
  ) : null;

  return (
    <>
      {button}
      {modal && (
        <ReportModal
          isOpen={modal !== null}
          type={modal!.type}
          isGeneratingReport={isGeneratingReport}
          generateError={generateError}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default ReportGenerateButton;
