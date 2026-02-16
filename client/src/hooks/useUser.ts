import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => Api.getAllUser(),
    select: (data) => data?.users ?? [],
    staleTime: 5 * 60 * 1000,
  });
};
export default useUser;
