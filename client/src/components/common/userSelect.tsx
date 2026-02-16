import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser } from "@/types/user";
import { Spinner } from "../ui/spinner";

type UserSelectProps = {
  users: IUser[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  allowAllOption?: boolean;
};

export function UserSelect({
  users,
  value,
  onChange,
  placeholder = "Select user",
  isLoading,
  allowAllOption,
}: UserSelectProps) {
  if (isLoading) return <Spinner />;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {allowAllOption && <SelectItem value="ALL">All users</SelectItem>}

        {users.map((u) => (
          <SelectItem key={u._id} value={u._id}>
            {u.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
