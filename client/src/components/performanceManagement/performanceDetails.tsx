import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { KpiScoreTable } from "../performanceForm/kpiTableScore";
import Competencies from "../performanceForm/competency";
import Error from "../Error";
import { Spinner } from "../ui/spinner";

function PerformanceDetails() {
  const { performanceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["performanceDetails", performanceId],
    queryFn: () => Api.fetchPerformanceById(performanceId),
    enabled: !!performanceId,
  });
  console.log(data?.performanceTemplate);
  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return <Error message={error.message} />;
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
        <KpiScoreTable data={data?.performanceTemplate.kpis} />
        <Competencies data={data?.performanceTemplate.competencies} />
      </div>
    </div>
  );
}

export default PerformanceDetails;
