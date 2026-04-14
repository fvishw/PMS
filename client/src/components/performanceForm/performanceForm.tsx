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
import { useNavigate } from "react-router";
import { UserDetailsCard } from "./userDetailsCard";
import { useFieldArray } from "react-hook-form";
import SectionWrapper from "./sectionWrapper";
import { ProjectSection } from "./projectSection";

const createProjectRow = () => ({
  name: "",
  achievements: [{ achievement: "", difficulty: "" }],
});

interface PerformanceFormProps {
  performanceId?: string;
}
export const PerformanceForm = ({ performanceId }: PerformanceFormProps) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceForm", performanceId, currentUser?._id],
    enabled: !!performanceId || !!currentUser?._id,
    queryFn: getPerformanceApi(performanceId),
  });

  const { control, handleSubmit, reset, register } =
    useForm<PerformanceFormValue>({
      defaultValues: {
        userPerformanceId: "",
        areaOfImprovement: "",
        areaOfStrength: "",
        criteria: [],
        competencies: [],
        projects: [createProjectRow()],
        finalComments: {},
      },
    });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });
  const stage = data?.userPerformanceRecord?.stage || "";
  const isCompleted = stage === "completed";

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

      if (currentUser?.role === "employee") {
        navigate("/dashboard");
        return;
      }

      if (currentUser?.role === "manager" || currentUser?.role === "admin") {
        navigate("/review-appraisals");
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  const onsubmit = (formData: PerformanceFormValue) => {
    const normalizedProjects = formData.projects.map((project) => ({
      name: project.name.trim(),
      achievements: project.achievements.map((achievement) => ({
        achievement: achievement.achievement.trim(),
        difficulty: achievement.difficulty.trim(),
      })),
    }));

    if (
      permissions.canEditSelf &&
      !normalizedProjects.some(
        (project) =>
          project.name &&
          project.achievements.some((a) => a.achievement && a.difficulty),
      )
    ) {
      toast.error(
        "Add at least one project with complete achievement details before submitting.",
        {
          position: "top-right",
        },
      );
      return;
    }

    mutate({
      ...formData,
      projects: normalizedProjects.filter(
        (project) =>
          project.name &&
          project.achievements.some((a) => a.achievement && a.difficulty),
      ),
    });
  };

  const record = data?.userPerformanceRecord;

  const getEntityId = (entity?: string | { _id: string } | null): string => {
    if (!entity) return "";
    return typeof entity === "string" ? entity : entity._id;
  };

  const permissions: EditPermissions = record
    ? getPerformancePermission({
        stage: record?.stage || "",
        currentUser: currentUser as unknown as IUser,
        parentReviewer: getEntityId(record?.parentReviewer),
        adminReviewer: getEntityId(record?.adminReviewer),
        employeeId: getEntityId(record?.user),
      })
    : {
        canEditSelf: false,
        canEditManager: false,
        canEditAdmin: false,
        canEditUserFinalComments: false,
      };

  useEffect(() => {
    if (record?._id) {
      reset({
        userPerformanceId: record._id,
        criteria: record.kpis || [],
        areaOfImprovement: record.areaOfImprovement || "",
        areaOfStrength: record.areaOfStrength || "",
        competencies: record.competencies || [],
        projects:
          record.projects?.length > 0
            ? record.projects
            : permissions.canEditSelf
              ? [createProjectRow()]
              : [],
        finalComments: record.finalReview || {},
      });
    }
  }, [permissions.canEditSelf, record, reset]);

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

    if (
      isAppraisalEnabled &&
      hasUserAcceptedKpi &&
      record &&
      record._id !== ""
    ) {
      return (
        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          {(currentUser?.role === "manager" ||
            currentUser?.role === "admin") && (
            <UserDetailsCard
              user={record?.user}
              stage={record?.stage}
              parentReviewer={record?.parentReviewer}
              adminReviewer={record?.adminReviewer}
            />
          )}
          <KpiScoreTable
            data={record?.kpis || []}
            permissions={permissions}
            register={register}
          />
          <SectionWrapper title="Section B: Project Achievements">
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Project Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    Add projects with their achievements and difficulties you
                    faced.
                  </p>
                </div>
                {permissions.canEditSelf ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendProject(createProjectRow())}
                  >
                    Add Project
                  </Button>
                ) : null}
              </div>

              {projectFields.length === 0 && !permissions.canEditSelf ? (
                <p className="text-sm text-muted-foreground">
                  No projects were submitted for this appraisal.
                </p>
              ) : null}

              <div className="space-y-4">
                {projectFields.map((project, projectIndex) => (
                  <ProjectSection
                    key={project.id}
                    projectIndex={projectIndex}
                    control={control}
                    register={register}
                    permissions={permissions}
                    removeProject={removeProject}
                    projectFieldsLength={projectFields.length}
                  />
                ))}
              </div>
            </div>
          </SectionWrapper>
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
            <Button type="submit" disabled={isPending || isCompleted}>
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
