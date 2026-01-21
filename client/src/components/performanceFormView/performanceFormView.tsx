import { useQuery } from "@tanstack/react-query";
import Competencies from "./competencyView";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/useAuthContext";
import ApiErrorMessage from "../ApiErrorMessage";
import { KpiScoreViewTable } from "./kpiTableViewScore";

export const PerformanceForm = () => {
  const { user } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceForm", user?._id],
    queryFn: () => Api.fetchUserPerformanceForm(),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  if (data) {
    const { hasUserAcceptedKpi, userPerformanceRecord } = data;

    if (hasUserAcceptedKpi && userPerformanceRecord) {
      return (
        <form>
          <KpiScoreViewTable data={userPerformanceRecord?.kpis || []} />
          <Competencies data={userPerformanceRecord?.competencies || []} />
        </form>
      );
    } else {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            You have not accepted the KPI yet. Please contact your manager.
          </p>
        </div>
      );
    }
  }
};
