import Api from "@/api/api";
import CheckInQuestionAns from "./checkInQuestionAns";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthOptions, yearOptions } from "@/types/option";
import { useState } from "react";

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
  const PastCheckIns =
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
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
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
              {yearOptions.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {PastCheckIns}
    </div>
  );
}

export default PastCheckIn;
