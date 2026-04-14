import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconPlus } from "@tabler/icons-react";
import Api from "@/api/api";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import { CustomDataTable } from "@/components/customTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AddDesignationModal } from "@/components/userManagement/addDesignationModal";
import { columns } from "./designationTable.config";

export function DesignationTable() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["designations", "all"],
    queryFn: () => Api.fetchAllDesignations(undefined, true),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Designation Directory</h2>
          <p className="text-muted-foreground text-sm">
            Add, update, or deactivate designations used across users, goals,
            performance templates, and check-ins.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <IconPlus className="size-4" />
          Add Designation
        </Button>
      </div>
      <CustomDataTable data={data?.designations || []} columns={columns} />
      {isAddOpen && (
        <AddDesignationModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </>
  );
}
