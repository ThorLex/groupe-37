import { Request } from "@/utils/types"; 
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface RequestTableProps {
  requests: Request[];
  selectedId: string | null;
  onSelect: (r: Request) => void;
}

export const RequestTable = ({ requests, selectedId, onSelect }: RequestTableProps) => (
  <Card className="overflow-x-auto bg-slate-700 border border-slate-600">
    <table className="min-w-full">
      <thead className="bg-slate-800">
        <tr>
          {["ID", "Nom", " ", "Statut", "Actions"].map((h) => (
            <th
              key={h}
              className="py-3 px-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => {
          const isActive = r.id === selectedId;
          return (
            <tr
              key={r.id}
              onClick={() => onSelect(r)}
              className={`cursor-pointer ${
                isActive
                  ? "bg-slate-600"
                  : "hover:bg-slate-600/50 transition-colors"
              }`}
            >
              <td className="py-3 px-4 text-sm text-slate-100">{r.id}</td>
              <td className="py-3 px-4 text-sm text-slate-100">{r.fullName}</td>
              <td className="py-3 px-4 text-sm text-slate-100">{r.cinNumber}</td>
              <td className="py-3 px-4">
                <Badge variant={
                  r.status === "approved"
                    ? "success"
                    : r.status === "rejected"
                    ? "destructive"
                    : r.status === "pending"
                    ? "secondary"
                    : "default"
                }>
                  {r.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect(r)}
                >
                  <Eye className="w-4 h-4 mr-1" /> Voir
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </Card>
);