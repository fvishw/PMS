import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { IconPlus } from "@tabler/icons-react";
import { AddUserModal } from "./addUserModal";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";

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
    <div className="px-4 lg:px-6">
      <div className="flex  py-4 items-end">
        <AddUserModal />
      </div>
      <div className=" overflow-hidden rounded border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 lg:px-6">Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parent Reviewer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="px-4 lg:px-6">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="">
                  {user?.parentReviewer?.fullName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
