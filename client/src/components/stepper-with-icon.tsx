import {
  ClipboardCheck,
  UserCheck,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import * as React from "react";

import { defineStepper } from "@/components/ui/stepper";

const { Stepper } = defineStepper(
  {
    id: "kpi_acceptance",
    title: "KPI Acceptance",
    icon: <BadgeCheck className="h-5 w-5" />,
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
    icon: <BadgeCheck className="h-5 w-5" />,
  }
);

export function StepperWithIcon() {
  return (
    <Stepper.Provider className="space-y-4" variant="horizontal">
      {({ methods }) => (
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
      )}
    </Stepper.Provider>
  );
}
