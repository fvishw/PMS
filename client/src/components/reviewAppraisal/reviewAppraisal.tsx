import { ReviewAppraisalCard } from "./reviewAppraisalCard";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";
import { CustomDataTable } from "../customTable";
import { columns } from "./reviewAppraisalTable.config";
import ApiError from "../errorMessage";
import { useAuth } from "@/hooks/useAuthContext";
import { getReviewAppraisalApi } from "./reviewAppraisalApiMapper";

export const ReviewAppraisal = () => {
  const { user } = useAuth();
  const role = user?.role || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviewAppraisalData"],
    queryFn: getReviewAppraisalApi(role),
  });
  console.log(data);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiError message={error.message} />;
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
