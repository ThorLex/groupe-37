import { format } from "date-fns";
import { Eye, FileText, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Request } from "@/utils/types";

interface RequestDetailsProps {
  request: Request;
  onClose: () => void;
}

export const RequestDetails = ({ request, onClose }: RequestDetailsProps) => (
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
        ["CIN", request.cinNumber],
        ["Naissance", format(new Date(request.birthDate), "dd/MM/yyyy")],
        ["Lieu", request.birthPlace],
        ["Adresse", request.address],
        ["Motif", request.reason],
      ].map(([label, value]) => (
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

      <div className="flex gap-3 pt-4">
        {request.status === "pending" && (
          <>
            <Button variant="destructive" className="flex-1">
              Rejeter
            </Button>
            <Button variant="success" className="flex-1">
              Approuver
            </Button>
          </>
        )}
        {request.status === "rejected" && (
          <Button variant="outline" className="flex-1">
            Voir motif de rejet
          </Button>
        )}
        <Button variant="secondary" className="flex-1">
          Télécharger dossier
        </Button>
      </div>
    </CardContent>
  </Card>
);