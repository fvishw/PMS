import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";

import ApiErrorMessage from "../ApiErrorMessage";
import KpiDetails from "./kpiDetails";

function Kpis() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["userKpiDetails"],
    queryFn: () => Api.fetchUserKpiDetails(),
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

  if (data) {
    const { criteria, hasKpiTemplate, hasUserAccepted, isKpiEnabled } = data;
    if (!isKpiEnabled) {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            KPI Feature is currently disabled. Please contact your administrator
            for more information.
          </p>
        </div>
      );
    }
    if (hasKpiTemplate && !hasUserAccepted) {
      return <KpiDetails criteria={criteria} />;
    } else if (hasUserAccepted) {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            You Already Submitted Your KPIs. please visit Appraisal Section for
            further process.
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            No KPI Template assigned to you yet. Please contact your manager.
          </p>
        </div>
      );
    }
  }
  return null;
}

export default Kpis;
