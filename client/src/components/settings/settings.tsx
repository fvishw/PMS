import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isEnabledOptions, quarterOptions } from "@/types/option";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";
import { queryClient } from "@/utils/queryClient";

export interface ISettingsForm {
  currentQuarter: string;
  currentYear: string;
  kpiStartDate: string;
  kpiEndDate: string;
  isKpiEnabled: string;
  appraisalStartDate: string;
  appraisalEndDate: string;
  isAppraisalEnabled: string;
}
export interface SettingsValue {
  currentQuarter: "Q1" | "Q2" | "Q3" | "Q4";
  currentYear: number;
  kpiStartDate: string | null;
  kpiEndDate: string | null;
  isKpiEnabled: boolean;
  appraisalStartDate: string | null;
  appraisalEndDate: string | null;
  isAppraisalEnabled: boolean;
}
function settingsDtoToForm(settings: any): ISettingsForm {
  console.log("backend Settings", settings);
  return {
    currentQuarter: settings.currentQuarter,
    currentYear: settings?.currentYear ? settings.currentYear.toString() : "",

    kpiStartDate: settings.kpiStartDate
      ? settings.kpiStartDate.slice(0, 10)
      : "",

    kpiEndDate: settings.kpiEndDate ? settings.kpiEndDate.slice(0, 10) : "",

    isKpiEnabled: settings.isKpiEnabled ? "enabled" : "disabled",

    appraisalStartDate: settings.appraisalStartDate
      ? settings.appraisalStartDate.slice(0, 10)
      : "",

    appraisalEndDate: settings.appraisalEndDate
      ? settings.appraisalEndDate.slice(0, 10)
      : "",

    isAppraisalEnabled: settings.isAppraisalEnabled ? "enabled" : "disabled",
  };
}

function formToSettingsDto(form: any): SettingsValue {
  return {
    currentQuarter: form.currentQuarter,
    currentYear: Number(form.currentYear),

    kpiStartDate: form.kpiStartDate
      ? new Date(form.kpiStartDate).toISOString()
      : null,

    kpiEndDate: form.kpiEndDate
      ? new Date(form.kpiEndDate).toISOString()
      : null,

    isKpiEnabled: form.isKpiEnabled === "enabled",

    appraisalStartDate: form.appraisalStartDate
      ? new Date(form.appraisalStartDate).toISOString()
      : null,

    appraisalEndDate: form.appraisalEndDate
      ? new Date(form.appraisalEndDate).toISOString()
      : null,

    isAppraisalEnabled: form.isAppraisalEnabled === "enabled",
  };
}

function Settings() {
  const {
    data,
    isLoading: getSettingsLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => Api.getSettings(),
  });

  const [currentYear] = useState<string>(new Date().getFullYear().toString());

  const yearOptions = [
    {
      label: currentYear,
      value: currentYear,
    },
    {
      label: (parseInt(currentYear) - 1).toString(),
      value: (parseInt(currentYear) - 1).toString(),
    },
  ];

  const { control, handleSubmit, reset } = useForm<ISettingsForm>({
    defaultValues: {
      currentQuarter: "Q1",
      currentYear: "",
      kpiStartDate: "",
      kpiEndDate: "",
      isKpiEnabled: "",
      appraisalStartDate: "",
      appraisalEndDate: "",
      isAppraisalEnabled: "",
    },
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (data: ISettingsForm) =>
      Api.updateSettings(formToSettingsDto(data)),
    onSuccess: () => {
      toast.success("Settings updated successfully", {
        position: "top-right",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  useEffect(() => {
    if (data && data?.settings && !getSettingsLoading) {
      const defaultValues = settingsDtoToForm(data.settings);
      // console.log(defaultValues);
      reset(defaultValues);
    }
  }, [data, getSettingsLoading, reset]);

  const onSubmit = (data: ISettingsForm) => {
    mutate(data);
  };

  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold">Settings</div>
              <div className="text-sm text-muted-foreground">
                Configure the current period and feature toggles.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <Controller
                control={control}
                name="currentQuarter"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {quarterOptions.map((quarterOption) => (
                          <SelectItem
                            key={quarterOption.value}
                            value={quarterOption.value}
                          >
                            {quarterOption.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="currentYear"
                render={({ field }) => {
                  console.log("current year", field.value);
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {yearOptions.map((yearOption) => (
                            <SelectItem
                              key={yearOption.value}
                              value={yearOption.value}
                            >
                              {yearOption.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-card">
            <div className="rounded-t-lg border-b bg-muted px-4 py-3 text-sm font-medium">
              KPI Settings
            </div>
            <div className="grid gap-5 p-4 sm:p-6">
              <div>
                <Label className="mb-2 block text-sm">KPI Start Date</Label>
                <Controller
                  control={control}
                  name="kpiStartDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="w-full sm:w-[250px]"
                    />
                  )}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">KPI End Date</Label>
                <Controller
                  control={control}
                  name="kpiEndDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="w-full sm:w-[250px]"
                    />
                  )}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Enable KPI</Label>
                <Controller
                  control={control}
                  name="isKpiEnabled"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isEnabledOptions.map((isEnabledOption) => (
                            <SelectItem
                              key={isEnabledOption.value}
                              value={isEnabledOption.value}
                            >
                              {isEnabledOption.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="rounded-t-lg border-b bg-muted px-4 py-3 text-sm font-medium">
              Appraisal Settings
            </div>
            <div className="grid gap-5 p-4 sm:p-6">
              <div>
                <Label className="mb-2 block text-sm">
                  Appraisal Start Date
                </Label>
                <Controller
                  control={control}
                  name="appraisalStartDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="w-full sm:w-[250px]"
                    />
                  )}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Appraisal End Date</Label>
                <Controller
                  control={control}
                  name="appraisalEndDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="w-full sm:w-[250px]"
                    />
                  )}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Enable Appraisal</Label>
                <Controller
                  control={control}
                  name="isAppraisalEnabled"
                  render={({ field }) => {
                    console.log("isAppraisal", field.value);
                    return (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isEnabledOptions.map((isEnabledOption) => (
                              <SelectItem
                                key={isEnabledOption.value}
                                value={isEnabledOption.value}
                              >
                                {isEnabledOption.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="ml-auto" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

export default Settings;
