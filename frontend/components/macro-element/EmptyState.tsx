import { Card } from "@/components/ui/card";
import { FileText, User } from "lucide-react";

interface EmptyStateProps {
  type: "no-results" | "no-selection";
}

export const EmptyState = ({ type }: EmptyStateProps) => (
  <Card className={`py-12 bg-slate-800 border border-slate-700 text-center ${
    type === "no-selection" ? "flex flex-col items-center justify-center h-full" : ""
  }`}>
    {type === "no-results" ? (
      <>
        <FileText className="mx-auto h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-100 mb-1">
          Aucune demande
        </h3>
        <p className="text-slate-400">Aucun résultat pour ces filtres.</p>
      </>
    ) : (
      <>
        <User className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-slate-100">Sélectionnez une demande</p>
      </>
    )}
  </Card>
);