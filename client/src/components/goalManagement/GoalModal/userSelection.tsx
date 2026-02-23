import { Spinner } from "../../ui/spinner";
import { Controller } from "react-hook-form";
import { UserSelect } from "@/components/common/userSelect";
import useUser from "@/hooks/useUser";

interface UserSelectionProps {
  control: any;
  disabled?: boolean;
}
export const UserSelection = ({ control, disabled }: UserSelectionProps) => {
  const { data: users, isLoading } = useUser();
  if (!users || isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <Controller
      name={`owner`}
      control={control}
      render={({ field }) => {
        console.log(field.value);
        return (
          <UserSelect
            users={users}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select owner"
            isLoading={isLoading}
            disabled={disabled}
          />
        );
      }}
    />
  );
};
