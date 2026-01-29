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
import { useState } from "react";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";

interface ISettingsForm {
  quarter: string;
  year: string;
  kpiStartDate: string;
  kpiEndDate: string;
  enableKPI: string;
  appraisalStartDate: string;
  appraisalEndDate: string;
  enableAppraisal: string;
}
function Settings() {
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
  const { control, handleSubmit } = useForm<ISettingsForm>({
    defaultValues: {
      quarter: "",
      year: currentYear,
      kpiStartDate: "",
      kpiEndDate: "",
      enableKPI: "",
      appraisalStartDate: "",
      appraisalEndDate: "",
      enableAppraisal: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4">
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
                name="quarter"
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
                name="year"
                render={({ field }) => (
                  <Select
                    defaultValue={currentYear}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
                )}
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
                  name="enableKPI"
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
                  name="enableAppraisal"
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
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="ml-auto">
          Save Settings
        </Button>
      </div>
    </form>
  );
}

export default Settings;
