"use client";

import { format } from "date-fns";
import { Eye, FileText, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Request } from "@/utils/types";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

interface RequestDetailsProps {
  request: Request;
  onClose: () => void;
  onApprove: (id: string, biometryDate: Date) => void;
  onReject: (id: string, reason: string) => void;
}

export const RequestDetails = ({ 
  request, 
  onClose,
  onApprove,
  onReject
}: RequestDetailsProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [biometryDate, setBiometryDate] = useState<Date | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    if (biometryDate) {
      onApprove(request.id, biometryDate);
      setIsApproving(false);
      setBiometryDate(null);
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(request.id, rejectionReason);
      setIsRejecting(false);
      setRejectionReason("");
    }
  };

  return (
    <Card className="sticky top-6 bg-slate-800 border border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-slate-100">Détails</CardTitle>
            <p className="text-slate-400 text-sm">{request.id}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <XCircle className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-slate-200 space-y-4">
        {[
          ["Nom complet", request.fullName],
          ["Sexe", request.genre],
          ["Profession", request.profession],
          ["Naissance", format(new Date(request.birthdate), "dd/MM/yyyy")],
          ["Nom du Père", request.fathername],
          ["Profession du père", request.father_profession],
          ["Nom de la mère", request.mothername],
          ["Profession de la mère", request.mother_profession],
          ["Ville", request.city],
          ["Quartier", request.neighborhood],
          ["Numéro de téléphone", request.contact1],
          request.rejection_reason && ["Motif rejet", request.rejection_reason],
          request.biometricdate && [
            "Date biométrie", 
            format(new Date(request.biometricdate), "dd/MM/yyyy")
          ]
        ].filter((item): item is [string, string] => Array.isArray(item)).map(([label, value]) => (
          <div key={label}>
            <h3 className="text-sm text-slate-400">{label}</h3>
            <p className="font-medium">{value}</p>
          </div>
        ))}

        <div>
          <h3 className="text-sm text-slate-400 mb-2">Documents</h3>
          <div className="space-y-2">
            {request.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-400 mr-2" />
                  <span>{doc.type}</span>
                </div>
                <Eye className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {request.status === "pending" && !isApproving && !isRejecting && (
            <div className="flex gap-3">
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setIsRejecting(true)}
              >
                Rejeter
              </Button>
              <Button 
                variant="success" 
                className="flex-1"
                onClick={() => setIsApproving(true)}
              >
                Approuver
              </Button>
            </div>
          )}

          {isApproving && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-slate-400 mb-2">Date de biométrie</h3>
                <DatePicker 
                  date={biometryDate || new Date()} 
                  onChange={setBiometryDate} 
                  futureDisabled={false}
                  disablePast={true}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsApproving(false);
                    setBiometryDate(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={!biometryDate}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-slate-400 mb-2">Motif du rejet</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Saisissez le motif de rejet..."
                  className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectionReason("");
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          )}

          {(request.status === "rejected" || request.status === "approved") && (
            <Button variant="secondary" className="flex-1">
              Télécharger dossier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};