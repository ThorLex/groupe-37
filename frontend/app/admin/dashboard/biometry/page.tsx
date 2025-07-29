"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/macro-element/SearchBarAdmin"; 
import { DatePicker } from "@/components/macro-element/DatePicker";
import { BiometryTable } from "@/components/macro-element/BiometryTable";
import { BiometryDetails } from "@/components/macro-element/BiometryDetails";
import { EmptyState } from "@/components/macro-element/EmptyState";
import { Request } from "@/utils/types";
import { isSameDay, parseISO } from "date-fns";

// Mock data pour les demandes approuvées
const mockRequests: Request[] = [
  {
    id: "1",
    fullName: "Jean Dupont",
    cinNumber: "AB123456",
    status: "approved",
    biometryDate: new Date(2023, 10, 15).toISOString(),
    biometryDone: false,
    createdAt: new Date(2023, 9, 1).toISOString(),
    birthDate: new Date(1990, 5, 20).toISOString(),
    birthPlace: "Paris",
    address: "123 Rue de Paris, 75000 Paris",
    reason: "Renouvellement",
    documents: [],
  },
  {
    id: "2",
    fullName: "Marie Martin",
    cinNumber: "CD789012",
    status: "approved",
    biometryDate: new Date(2023, 10, 15).toISOString(),
    biometryDone: false,
    createdAt: new Date(2023, 9, 2).toISOString(),
    birthDate: new Date(1985, 3, 10).toISOString(),
    birthPlace: "Lyon",
    address: "45 Avenue des Fleurs, 69000 Lyon",
    reason: "Première demande",
    documents: [],
  },
  {
    id: "3",
    fullName: "Pierre Durand",
    cinNumber: "EF345678",
    status: "approved",
    biometryDate: new Date(2025, 6, 29).toISOString(),
    biometryDone: false,
    createdAt: new Date(2025, 6, 29).toISOString(),
    birthDate: new Date(1978, 11, 5).toISOString(),
    birthPlace: "Marseille",
    address: "78 Boulevard du Sud, 13000 Marseille",
    reason: "Renouvellement",
    documents: [],
  },
];

export default function BiometryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [loading] = useState(false);

  // Filtrer les demandes pour la date sélectionnée
  const filtered = useMemo(() => {
    return requests.filter(
      (r) =>
        (r.fullName.toLowerCase().includes(search.toLowerCase()) ||
         r.cinNumber.includes(search)) &&
        r.status === "approved" &&
        r.biometryDate && isSameDay(parseISO(r.biometryDate), selectedDate)
    );
  }, [requests, search, selectedDate]);

  // Valider la biométrie
  const handleValidateBiometry = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? {...req, biometryDone: true } : req
    ));
    setSelectedReq(null);
  };

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Gestion Biométrie
          </h1>
          <p className="text-slate-400">
            Rendez-vous du {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />
          <DatePicker
            date={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg bg-slate-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState type="no-results" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BiometryTable
              requests={filtered}
              selectedId={selectedReq?.id || null}
              onSelect={setSelectedReq}
            />
          </div>
          <div className="lg:col-span-1">
            {selectedReq ? (
              <BiometryDetails
                request={selectedReq}
                onValidate={handleValidateBiometry}
                onClose={() => setSelectedReq(null)}
              />
            ) : (
              <EmptyState type="no-selection" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}