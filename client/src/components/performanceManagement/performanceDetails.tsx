import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Button } from "../ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import ApiErrorMessage from "../ApiErrorMessage";
import { Spinner } from "../ui/spinner";
import { KpiScoreViewTable } from "../performanceFormView/kpiTableViewScore";
import CompetenciesView from "../performanceFormView/competencyView";
import { AddPerformanceFormModal } from "./addPerformanceFormModal";
import { useEffect, useState } from "react";

function PerformanceDetails() {
  const { performanceId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "edit") {
      setIsEditOpen(true);
    }
  }, [searchParams]);

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    if (searchParams.get("mode") === "edit") {
      setSearchParams({});
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["performanceDetails", performanceId],
    queryFn: (performanceId) =>
      Api.fetchMasterPerformanceById(performanceId.queryKey[1] as string),
    enabled: !!performanceId,
  });
  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  if (!data?.performanceTemplate) {
    return <ApiErrorMessage message="Performance template data is missing." />;
  }

  return (
    <div className="space-y-4">
      <div>
        <Button variant="link" onClick={() => navigate("/manage-performance")}>
          <IconChevronLeft />
          Back to Performance
        </Button>
        {performanceId ? (
          <Button onClick={() => setIsEditOpen(true)}>Edit Template</Button>
        ) : null}
      </div>
      <div>
        <KpiScoreViewTable data={data?.performanceTemplate?.kpis || []} />
        <CompetenciesView
          data={data?.performanceTemplate?.competencies || []}
        />
      </div>
      {performanceId ? (
        <AddPerformanceFormModal
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          performanceId={performanceId}
        />
      ) : null}
    </div>
  );
}

export default PerformanceDetails;
