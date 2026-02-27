import { useQuery } from "@tanstack/react-query";
import { CustomDataTable } from "../customTable";
import MeetingFormDialog from "./MeetingFormDialog";
import { columns, MeetingRow } from "./meetingTable.config";
import Api from "@/api/api";
import { useMemo, useState } from "react";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";
import { Button } from "../ui/button";
import MeetingFilter, { MeetingFilterType } from "./MeetingFilter";

export const MeetingManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<MeetingFilterType>({
    employeeId: null,
    quarter: null,
    year: null,
    status: null,
  });

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meetings", filter],
    queryFn: async () => Api.getAllMeetings(filter),
  });

  const meetings: MeetingRow[] = useMemo(() => {
    if (!data?.meetings) return [];
    return data.meetings.map((m) => ({
      _id: m._id,
      title: m.title,
      employeeName: m.employeeName,
      meetingDate: m.meetingDate,
      status: m.status,
      notes: m.notes,
    }));
  }, [data]);

  let contentToDisplay;

  if (isLoading) {
    return (
      <div className="w-full rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error?.message} />;
  }
  if (data) {
    contentToDisplay = (
      <div className="space-y-6">
        <MeetingFilter
          filter={filter}
          onChange={(newFilter) => setFilter(newFilter)}
        />
        <CustomDataTable columns={columns} data={meetings} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>Schedule Meeting</Button>
        {isOpen && (
          <MeetingFormDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
      {contentToDisplay}
    </div>
  );
};
