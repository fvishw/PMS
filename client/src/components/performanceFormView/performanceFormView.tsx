import { useQuery } from "@tanstack/react-query";
import Competencies from "./competencyView";
import { KpiScoreTable } from "./kpiTableScore";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/useAuthContext";
import ApiError from "../errorMessage";
import { Button } from "../ui/button";

export const PerformanceForm = () => {
  const { user } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceForm", user?.id],
    queryFn: () => Api.fetchUserPerformanceForm(),
  });
  const { control, handleSubmit, reset, register, setValue } =
 
  const { user: currentUser } = useAuth();
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return <ApiError message={error.message} />;
  }

  if (data) {
    const { hasUserAcceptedKpi, userPerformanceRecord, user } = data;
    // console.log("currentUser", currentUser);
    // console.log("performanceUser", user);
    const permissions: EditPermissions = getPerformancePermission({
      stage: userPerformanceRecord?.stage || "",
      currentUser: currentUser,
      employee: user,
    });
    // console.log("permissions", permissions);

    const performanceId = userPerformanceRecord._id;

    if (hasUserAcceptedKpi && userPerformanceRecord && performanceId !== "") {
      setValue("userPerformanceId", performanceId);
      return (
        <form onSubmit={handleSubmit(console.log)}>
          <KpiScoreTable
            data={userPerformanceRecord?.kpis || []}
            permissions={permissions}
            register={register}
          />
          <Competencies
            data={userPerformanceRecord?.competencies || []}
            permissions={permissions}
            register={register}
          />
          <FinalReview
            permissions={permissions}
            register={register}
            control={control}
          />
          <div className="flex justify-end my-4">
            <Button type="submit">Submit Review</Button>
          </div>
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
