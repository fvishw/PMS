import { ReviewAppraisalCard } from "./reviewAppraisalCard";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";
import { CustomDataTable } from "../customTable";
import { columns } from "./reviewAppraisalTable.config";
import ErrorMessage from "../errorMessage";

export const ReviewAppraisal = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviewAppraisalData"],
    queryFn: () => Api.getReviewAppraisalData(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  if (data) {
    const { performances } = data;
    return (
      <>
        <ReviewAppraisalCard />
        <CustomDataTable data={performances} columns={columns} />
      </>
    );
  }
  return null;
};
