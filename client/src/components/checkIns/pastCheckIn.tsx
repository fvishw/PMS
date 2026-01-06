import Api from "@/api/api";
import CheckInQuestionAns from "./checkInQuestionAns";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthOptions, yearOptions } from "@/types/option";
import { useState } from "react";
import ApiError from "../errorMessage";

function PastCheckIn() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());

  const { data, isLoading, error } = useQuery({
    queryKey: ["getPastCheckIns", year, month],
    queryFn: () => Api.getPastCheckIns(year, month),
    enabled: !!year && !!month,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiError message={error.message} />;
  }
  const pastCheckIns =
    data && data?.answers?.length === 0 ? (
      <div className="text-center text-gray-500">
        No check-in data available for the selected month and year.
      </div>
    ) : (
      <CheckInQuestionAns
        questions={data?.answers || null}
        isPastCheckIn={true}
      />
    );

  return (
    <div className="space-y-4 mt-2">
      <div className="flex space-x-3 justify-end">
        <Select onValueChange={(value) => setMonth(value)} value={month}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {monthOptions.map((monthOption) => (
                <SelectItem key={monthOption.value} value={monthOption.value}>
                  {monthOption.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setYear(value)} value={year}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {yearOptions.map((yearOption) => (
                <SelectItem key={yearOption.value} value={yearOption.value}>
                  {yearOption.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {pastCheckIns}
    </div>
  );
}

export default PastCheckIn;
