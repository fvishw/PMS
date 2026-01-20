import { useMutation, useQuery } from "@tanstack/react-query";
import Competencies from "./competency";
import FinalReview from "./finalReview";
import { KpiScoreTable } from "./kpiTableScore";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/useAuthContext";
import ApiError from "../errorMessage";
import { Button } from "../ui/button";
import getPerformancePermission from "./performancePermission";
import { useForm } from "react-hook-form";
import { EditPermissions, PerformanceFormValue } from "@/types/performance";
import { toast } from "sonner";
import {
  getPerformanceApi,
  getPostPerformanceApi,
} from "./performanceApiMapper";
import { queryClient } from "@/utils/queryClient";
import { IUser } from "@/types/user";
interface PerformanceFormProps {
  performanceId?: string;
}
export const PerformanceForm = ({ performanceId }: PerformanceFormProps) => {
  const { user } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceForm", performanceId || user?._id],
    queryFn: getPerformanceApi(performanceId),
  });
  const { control, handleSubmit, reset, register, setValue } =
    useForm<PerformanceFormValue>({
      defaultValues: {
        userPerformanceId: "",
        criteria: [],
        competencies: [],
        finalComments: {},
      },
    });
  const { user: currentUser } = useAuth();
  const stage = data?.userPerformanceRecord?.stage || "";

  const { mutate, isPending } = useMutation<
    unknown,
    Error,
    PerformanceFormValue
  >({
    mutationFn: (performanceData: PerformanceFormValue) =>
      getPostPerformanceApi(stage, performanceData),
    onSuccess: () => {
      reset();
      toast.success("Performance review submitted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["performanceForm", user?._id],
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  const onsubmit = (formData: PerformanceFormValue) => {
    mutate(formData);
  };

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
    const { hasUserAcceptedKpi, userPerformanceRecord } = data;

    const permissions: EditPermissions = getPerformancePermission({
      stage: userPerformanceRecord?.stage || "",
      currentUser: currentUser as unknown as IUser,
      parentReviewer: userPerformanceRecord?.parentReviewer || "",
      adminReviewer: userPerformanceRecord?.adminReviewer || "",
      employeeId: userPerformanceRecord?.user || "",
    });

    if (
      hasUserAcceptedKpi &&
      userPerformanceRecord &&
      userPerformanceRecord._id !== ""
    ) {
      const performanceId = userPerformanceRecord._id;
      setValue("userPerformanceId", performanceId);
      return (
        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          <KpiScoreTable
            data={userPerformanceRecord?.kpis || []}
            permissions={permissions}
            register={register}
          />
          <Competencies
            data={userPerformanceRecord?.competencies || []}
            permissions={permissions}
            register={register}
            control={control}
          />
          <FinalReview
            data={userPerformanceRecord?.finalReview || {}}
            permissions={permissions}
            register={register}
            control={control}
          />
          <div className="flex justify-end my-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
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
