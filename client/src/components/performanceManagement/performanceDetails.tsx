import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import ApiErrorMessage from "../ApiErrorMessage";
import { Spinner } from "../ui/spinner";
import { KpiScoreViewTable } from "../performanceFormView/kpiTableViewScore";
import CompetenciesView from "../performanceFormView/competencyView";

function PerformanceDetails() {
  const { performanceId } = useParams();
  const navigate = useNavigate();
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
        <Button variant="link" onClick={() => navigate(-1)}>
          <IconChevronLeft />
          Back to Performance
        </Button>
      </div>
      <div>
        <KpiScoreViewTable data={data?.performanceTemplate?.kpis || []} />
        <CompetenciesView
          data={data?.performanceTemplate?.competencies || []}
        />
      </div>
    </div>
  );
}

export default PerformanceDetails;
