import { ColumnDef } from "@tanstack/react-table";
import { Request } from "@/utils/types";
import { DataTable } from "../ui/data-table";

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "fullName",
    header: "Nom Complet",
  },
  {
    accessorKey: "iddemande",
    header: "ID Demande",
  },
  {
    accessorKey: "biometricdate",
    header: "Date Biométrie",
    cell: ({ row }) => 
      row.original.biometricdate 
        ? new Date(row.original.biometricdate).toLocaleDateString("fr-FR") 
        : "Non planifié"
  },
  {
    accessorKey: "biometric_passed",
    header: "Statut Biométrie",
    cell: ({ row }) => row.original.biometric_passed ? "✅ Effectué" : "⏱ En attente"
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