// components/macro-element/BiometryDetails.tsx
import { Request } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function BiometryDetails({
  request,
  onValidate,
  onClose,
}: {
  request: Request;
  onValidate: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-slate-700 rounded-lg p-6 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4"
        onClick={onClose}
      >
        <X size={16} />
      </Button>

      <h2 className="text-xl font-bold text-slate-100 mb-4">
        Détails Biométrie
      </h2>

      <div className="space-y-3 mb-6">
        <DetailItem label="Nom" value={request.fullName} />
        <DetailItem label="CIN" value={request.cinNumber} />
        <DetailItem 
          label="Date prévue" 
          value={
            request.biometricdate 
              ? new Date(request.biometricdate).toLocaleString("fr-FR")
              : "Non spécifiée"
          } 
        />
        <DetailItem 
          label="Statut" 
          value={request.biometric_passed ? "✅ Effectuée" : "⏱ En attente"} 
        />
      </div>

      {!request.biometric_passed && (
        <Button
          onClick={() => onValidate(request.id)}
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          Valider la biométrie
        </Button>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-300">{label}:</span>
      <span className="text-slate-100 font-medium">{value}</span>
    </div>
  );
}