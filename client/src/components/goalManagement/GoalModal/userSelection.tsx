import Api from "@/api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../ui/spinner";
import { Controller } from "react-hook-form";
import { IUser } from "@/types/user";

interface UserSelectionProps {
  control: any;
}
export const UserSelection = ({ control }: UserSelectionProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => Api.fetchAllUser(),
  });
  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  const users = data?.users;
  return (
    <Controller
      name={`owner`}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select owner" />
          </SelectTrigger>
          <SelectContent>
            {users &&
              users?.length > 0 &&
              users.map((user: IUser) => {
                return (
                  <SelectItem key={user._id} value={user._id}>
                    {user.fullName}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      )}
    />
  );
};
