import { ColumnDef } from "@tanstack/react-table";

interface KPIHighlightTableColumn {
  objective: string;
  note: string;
}

export const KPITableColumn: ColumnDef<KPIHighlightTableColumn>[] = [
  {
    accessorKey: "objective",
    header: () => <div className="text-center ">Objective</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center  whitespace-pre-wrap">
        {row.getValue("objective")}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: () => <div className="text-center">Note</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center  whitespace-pre-wrap">
        {row.getValue("note")}
      </div>
    ),
  },
];

export const kpiHighlightTableData: KPIHighlightTableColumn[] = [
  {
    objective: "Timely Delivery of Assigned Tasks",
    note: "Excellent time management and reliability across all assigned tasks.",
  },
  {
    objective: "Code Quality & Maintainability",
    note: "High-quality code with minimal rework and strong adherence to standards.",
  },
  {
    objective: "Collaboration and Team Participation",
    note: "Strong team player who contributes positively in all team interactions.",
  },
  {
    objective: "Technical Skill Growth",
    note: "Demonstrates consistent learning mindset and applies new skills effectively.",
  },
  {
    objective: "System Reliability & Performance",
    note: "Maintains system stability and quickly resolves production issues.",
  },
  {
    objective: "Innovation & Initiative",
    note: "Shows strong ownership and regularly brings valuable improvement ideas.",
  },
  {
    objective: "Customer/Stakeholder Satisfaction",
    note: "Received positive feedback from stakeholders for professionalism and delivery.",
  },
];
