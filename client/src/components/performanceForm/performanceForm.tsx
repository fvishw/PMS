import { useMutation, useQuery } from "@tanstack/react-query";
import Competencies from "./competency";
import FinalReview from "./finalReview";
import { KpiScoreTable } from "./kpiTableScore";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/useAuthContext";
import ApiErrorMessage from "../ApiErrorMessage";
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
import { useEffect } from "react";
interface PerformanceFormProps {
  performanceId?: string;
}
export const PerformanceForm = ({ performanceId }: PerformanceFormProps) => {
  const { user: currentUser } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceForm", performanceId, currentUser?._id],
    enabled: !!performanceId || !!currentUser?._id,
    queryFn: getPerformanceApi(performanceId),
  });
  console.log("component rerenders", data);

  const {
    control,
    handleSubmit,
    reset,
    register,
    // formState: { errors },
  } = useForm<PerformanceFormValue>({
    defaultValues: {
      userPerformanceId: "",
      areaOfImprovement: "",
      areaOfStrength: "",
      criteria: [],
      competencies: [],
      finalComments: {},
    },
  });
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
        queryKey: ["performanceForm", performanceId, currentUser?._id],
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

  const record = data?.userPerformanceRecord;

  useEffect(() => {
    if (record?._id) {
      reset({
        userPerformanceId: record._id,
        areaOfImprovement: record.areaOfImprovement || "",
        areaOfStrength: record.areaOfStrength || "",
        competencies: record.competencies || [],
        finalComments: record.finalReview || {},
      });
    }
  }, [record?._id, reset]);

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
    const { hasUserAcceptedKpi, isAppraisalEnabled } = data;
    if (!isAppraisalEnabled) {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            Appraisal process is currently disabled. Please contact your admin.
          </p>
        </div>
      );
    }

    if (!record) {
      return (
        <div>
          <p className="text-center  text-muted-foreground">
            No performance record found. Please Accept KPI first.
          </p>
        </div>
      );
    }

    const permissions: EditPermissions = getPerformancePermission({
      stage: record?.stage || "",
      currentUser: currentUser as unknown as IUser,
      parentReviewer: record?.parentReviewer || "",
      adminReviewer: record?.adminReviewer || "",
      employeeId: record?.user || "",
    });

    if (
      isAppraisalEnabled &&
      hasUserAcceptedKpi &&
      record &&
      record._id !== ""
    ) {
      return (
        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          <KpiScoreTable
            data={record?.kpis || []}
            permissions={permissions}
            register={register}
          />
          <Competencies
            competenciesData={record?.competencies || []}
            permissions={permissions}
            register={register}
            control={control}
          />
          <FinalReview
            data={record?.finalReview || {}}
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
      return null;
    }
  }
};
