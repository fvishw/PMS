import { ReviewAppraisalCard } from "./reviewAppraisalCard";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { CustomDataTable } from "../customTable";
import { columns } from "./reviewAppraisalTable.config";
import ApiErrorMessage from "../ApiErrorMessage";
import { useAuth } from "@/hooks/useAuthContext";
import { getReviewAppraisalApi } from "./reviewAppraisalApiMapper";

export const ReviewAppraisal = () => {
  const { user } = useAuth();
  const role = user?.role || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviewAppraisalData"],
    queryFn: getReviewAppraisalApi(role),
  });
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  if (data) {
    const performances = data?.performances || [];
    return (
      <>
        <ReviewAppraisalCard />
        <CustomDataTable data={performances} columns={columns} />
      </>
    );
  }
  return null;
};
