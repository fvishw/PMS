import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { KpiScoreTable } from "../performanceForm/kpiTableScore";
import Competencies from "../performanceForm/competency";

function PerformanceDetails() {
  const { performanceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["performanceDetails", performanceId],
    queryFn: () => Api.fetchPerformanceById(performanceId),
    enabled: !!performanceId,
  });
  console.log(data?.performanceTemplate);

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
