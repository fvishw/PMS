import { useState } from "react";
import { GoalCard } from "./goalCard";

import { ViewGoalModal } from "../goalManagement/viewGoal/viewGoalModal";
import { getTransformedGoals } from "../goalManagement/GoalManagement";
import { GoalRow } from "../goalManagement/goalTable.config";
import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";
import { useAuth } from "@/hooks/useAuthContext";

export type IGoal = GoalRow;

const MyGoals = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["goals", user?._id],
    queryFn: async () => Api.getGoalsByOwner(),
  });

  const goals: GoalRow[] = data ? getTransformedGoals(data?.goals) : [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleModalOpen = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsOpen(true);
  };

  let contentToRender;

  if (isLoading) {
    contentToRender = <Spinner />;
  }
  if (data) {
    contentToRender =
      goals.length > 0 ? (
        goals.map((goal) => (
          <GoalCard key={goal._id} goal={goal} onOpen={handleModalOpen} />
        ))
      ) : (
        <p className="text-center text-muted-foreground">No goals found.</p>
      );
  }
  if (error) {
    contentToRender = (
      <ApiErrorMessage message={error.message || "Unknown error"} />
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {contentToRender}
      {selectedGoalId && (
        <ViewGoalModal
          goalId={selectedGoalId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MyGoals;
