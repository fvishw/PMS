import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { AddUserModal } from "./addUserModal";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { columns } from "./userTable.config";

const invoices = [
  {
    id: 1,
    fullName: "John Doe",
    email: "johndoe.@example.com",
    status: "Active",
    parentReviewer: "Jane Smith",
  },
  {
    id: 2,
    fullName: "Alice Johnson",
    email: "alice@gnaik.com",
    status: "Inactive",
    parentReviewer: "Bob Brown",
  },
];

export function UserTable() {
  const { data, error, isLoading } = useQuery({
    queryFn: () => Api.fetchAllUser(),
    queryKey: ["users"],
  });
  const users = data?.users;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <AddUserModal />
      </div>
      <CustomDataTable data={users} columns={columns} />
    </>
  );
}
