import {
  ClipboardCheck,
  UserCheck,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { useEffect } from "react";
import React from "react";

import { defineStepper } from "@/components/ui/stepper";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "./ui/spinner";

const { Stepper, useStepper } = defineStepper(
  {
    id: "kpi_acceptance",
    title: "KPI Acceptance",
    icon: <ShieldCheck className="h-5 w-5" />,
  },

  {
    id: "self_review",
    title: "Self Assessment",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    id: "manager_review",
    title: "Manager Assessment",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    id: "admin_review",
    title: "Admin Review",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "user_final_review",
    title: "User Final Acknowledgement",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    id: "completed",
    title: "Completed",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
);

export function StepperWithIcon() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["performanceStatus"],
    queryFn: async () => Api.getPerformanceStatus(),
  });

  const stage = data?.stage;

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Stepper.Provider className="space-y-4" variant="horizontal">
      {({ methods }) => {
        // Move the effect logic here or use it directly
        useEffect(() => {
          if (stage && methods) {
            methods.goTo(stage);
          }
        }, [stage, methods]);

        return (
          <React.Fragment>
            <Stepper.Navigation>
              {methods.all.map((step) => (
                <Stepper.Step
                  key={step.id}
                  of={step.id}
                  onClick={() => methods.goTo(step.id)}
                  icon={step.icon}
                >
                  <Stepper.Title>{step.title}</Stepper.Title>
                </Stepper.Step>
              ))}
            </Stepper.Navigation>
          </React.Fragment>
        );
      }}
    </Stepper.Provider>
  );
}
