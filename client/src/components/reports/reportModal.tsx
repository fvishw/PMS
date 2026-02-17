import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportModalSkeleton from "./reportModalSkeleton";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import ApiErrorMessage from "../ApiErrorMessage";
import { KPITableColumn } from "./kpiHighlightTable.config";
import { DataTable } from "./reportTable";

export type ReportModal = "current" | "generate" | "byId";

interface ReportModalProps {
  isOpen: boolean;
  type: ReportModal;
  reportId?: string;
  isGeneratingReport?: boolean;
  generateError?: Error | null;
  onClose: () => void;
}

export function ReportModal({
  isOpen,
  type,
  reportId,
  isGeneratingReport = false,
  generateError = null,
  onClose,
}: ReportModalProps) {
  const isFetchById = type === "byId";
  const isFetchCurrent = type === "current";
  const isGenerate = type === "generate";

  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = useQuery({
    enabled: isFetchById && !!reportId,
    queryKey: ["reportById", reportId],
    queryFn: () => Api.getReportById(reportId!),
  });

  const {
    data: currentReportData,
    isLoading: currentReportLoading,
    error: currentReportError,
  } = useQuery({
    enabled: isFetchCurrent,
    queryKey: ["currentQuarterReport"],
    queryFn: () => Api.getCurrentQuarterReport(),
  });

  const isLoading =
    reportLoading || currentReportLoading || (isGenerate && isGeneratingReport);
  const error =
    reportError || currentReportError || (isGenerate ? generateError : null);
  const data =
    type === "current"
      ? currentReportData?.report
      : type === "byId"
        ? reportData?.report
        : null;
  const contentToRender = (() => {
    if (isLoading) {
      return <ReportModalSkeleton />;
    }

    if (error) {
      return <ApiErrorMessage message={error.message} />;
    }

    if (!data) {
      return (
        <div className="text-sm text-muted-foreground">
          No report data available.
        </div>
      );
    }

    const hasStrengths = data.strengths && data.strengths.length > 0;
    const hasImprovements = data.improvements && data.improvements.length > 0;
    const hasKpis = data.kpiHighlights && data.kpiHighlights.length > 0;
    const hasCompetencies =
      data.competencyHighlights && data.competencyHighlights.length > 0;
    const hasRiskFlags = data.riskFlags && data.riskFlags.length > 0;
    const hasRecommendedActions =
      data.recommendedActions && data.recommendedActions.length > 0;

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border bg-card p-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Report Summary</h2>
            <div className="text-sm text-muted-foreground">
              {data.quarter} {data.year}
            </div>
            {data.performance ? (
              <div className="text-sm text-muted-foreground">
                Performance: {data.performance}
              </div>
            ) : null}
          </div>
          <div className="rounded-full border bg-muted px-3 py-1 text-sm font-semibold">
            Overall Score: {data.overAllScore}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="mt-2 text-sm text-muted-foreground">{data.summary}</p>
        </div>

        {hasStrengths ? (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Strengths</h3>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {data.strengths.map((item, index) => (
                <li key={`strength-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasImprovements ? (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Improvements</h3>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {data.improvements.map((item, index) => (
                <li key={`improvement-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Alignment</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                Self vs Manager Gap: {data.alignment?.selfVsManagerGap ?? 0}
              </div>
              <p>{data.alignment?.note}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Recommended Actions</h3>
            {hasRecommendedActions ? (
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {data.recommendedActions.map((item, index) => (
                  <li key={`action-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">None</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold">KPI Highlights</h3>
          <div className="mt-3">
            {hasKpis ? (
              <DataTable columns={KPITableColumn} data={data.kpiHighlights} />
            ) : (
              <div className="text-sm text-muted-foreground">None</div>
            )}
          </div>
        </div>

        {hasCompetencies ? (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Competency Highlights</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {data.competencyHighlights.map((item, index) => (
                <div
                  key={`competency-${index}`}
                  className="rounded-lg border bg-muted/50 p-3"
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold">Risk Flags</h3>
          {hasRiskFlags ? (
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {data.riskFlags.map((item, index) => (
                <li key={`risk-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-muted-foreground">None</div>
          )}
        </div>
      </div>
    );
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-screen overflow-y-auto sidebar-scroll">
        <DialogHeader>
          <DialogTitle>Report Card</DialogTitle>
          <DialogDescription>
            AI generated report card based on your performance in the current
            quarter.
          </DialogDescription>
        </DialogHeader>
        {contentToRender}
      </DialogContent>
    </Dialog>
  );
}
