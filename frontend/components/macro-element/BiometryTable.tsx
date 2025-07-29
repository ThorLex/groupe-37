import { ColumnDef } from "@tanstack/react-table";
import { Request } from "@/utils/types";
import { DataTable } from "../ui/data-table";

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "fullName",
    header: "Nom Complet",
  },
  {
    accessorKey: "cinNumber",
    header: "CIN",
  },
  {
    accessorKey: "biometryDate",
    header: "Date Biométrie",
    cell: ({ row }) => 
      row.original.biometryDate 
        ? new Date(row.original.biometryDate).toLocaleDateString("fr-FR") 
        : "Non planifié"
  },
  {
    accessorKey: "biometryDone",
    header: "Statut",
    cell: ({ row }) => row.original.biometryDone ? "✅ Effectué" : "⏱ En attente"
  },
];

export function BiometryTable({
  requests,
  selectedId,
  onSelect,
}: {
  requests: Request[];
  selectedId: string | null;
  onSelect: (request: Request) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={requests}
      onRowClick={onSelect}
      selectedId={selectedId}
      rowClassName={(req) => 
        selectedId === req.id ? "bg-slate-700" : "hover:bg-slate-700"
      }
    />
  );
}