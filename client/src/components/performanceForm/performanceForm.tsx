import { useQuery } from "@tanstack/react-query";
import Competencies from "./competency";
import FinalReview from "./finalReview";
import { KpiScoreTable } from "./kpiTableScore";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";

export const PerformanceForm = () => {
  const {
    isLoading,
    error,
    data: performanceFormData,
  } = useQuery({
    queryKey: ["performanceForm"],
    queryFn: () => Api.fetchUserPerformanceForm(),
  });
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  return (
    <>
      <KpiScoreTable data={performanceFormData?.kpis || []} />
      <Competencies data={performanceFormData?.competencies || []} />
      <FinalReview />
    </>
  );
};
