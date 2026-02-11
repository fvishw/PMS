import { ColumnDef } from "@tanstack/react-table";

interface CompetencyHighlightTableColumn {
  title: string;
  note: string;
}

export const CompetencyTableColumn: ColumnDef<CompetencyHighlightTableColumn>[] =
  [
    {
      accessorKey: "title",
      header: () => <div className="text-center">Title</div>,
      cell: ({ row }) => (
        <div className="capitalize text-center">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "note",
      header: () => <div className="text-center">Note</div>,
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("note")}</div>
      ),
    },
  ];
