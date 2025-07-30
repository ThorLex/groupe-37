"use client";

import { useState, useMemo, useEffect } from "react";
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
    fullName: "Pierre Durand",
    cinNumber: "EF345678",
    status: "approved",
    biometricdate: new Date(2025, 6, 29).toISOString(),
    biometric_passed: false,
    createdAt: new Date(2025, 6, 29).toISOString(),
    birthdate: new Date(1978, 11, 5).toISOString(),
    city: "Marseille",
    neighborhood: "78 Boulevard du Sud, 13000 Marseille",
    reason: "Renouvellement",
    documents: [],
    fathername: "Jean Durand",
    father_profession: "Ingénieur",
    mothername: "Sophie Durand",
    mother_profession: "Professeur",
    genre: "M",
    contact1: "666666666",
    profession: "Médecin",
  },
  {
    id: "2",
    fullName: "Pierre Durand",
    cinNumber: "EF345678",
    status: "approved",
    biometricdate: new Date(2025, 6, 29).toISOString(),
    biometric_passed: false,
    createdAt: new Date(2025, 6, 29).toISOString(),
    birthdate: new Date(1978, 11, 5).toISOString(),
    city: "Marseille",
    neighborhood: "78 Boulevard du Sud, 13000 Marseille",
    reason: "Renouvellement",
    documents: [],
    fathername: "Jean Durand",
    father_profession: "Ingénieur",
    mothername: "Sophie Durand",
    mother_profession: "Professeur",
    genre: "M",
    contact1: "666666666",
    profession: "Médecin",
  },
  {
    id: "3",
    fullName: "Pierre Durand",
    cinNumber: "EF345678",
    status: "approved",
    biometricdate: new Date(2025, 6, 29).toISOString(),
    biometric_passed: false,
    createdAt: new Date(2025, 6, 29).toISOString(),
    birthdate: new Date(1978, 11, 5).toISOString(),
    city: "Marseille",
    neighborhood: "78 Boulevard du Sud, 13000 Marseille",
    reason: "Renouvellement",
    documents: [],
    fathername: "Jean Durand",
    father_profession: "Ingénieur",
    mothername: "Sophie Durand",
    mother_profession: "Professeur",
    genre: "M",
    contact1: "666666666",
    profession: "Médecin",
  },
];

export default function BiometryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // Filtrer les demandes pour la date sélectionnée
  const filtered = useMemo(() => {
    return requests.filter(
      (r) =>
        (r.fullName.toLowerCase().includes(search.toLowerCase()) ||
         r.cinNumber.includes(search)) &&
        r.status === "approved" &&
        r.biometricdate && isSameDay(parseISO(r.biometricdate), selectedDate)
    );
  }, [requests, search, selectedDate]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        const res = await fetch(`/api/biometry?date=${dateStr}`);
        
        if (!res.ok) throw new Error('Erreur de chargement des données');
        
        const data = await res.json();
        setRequests(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Valider la biométrie
  const handleValidateBiometry = async (id: string) => {
    try {
      const res = await fetch('/api/biometry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error('Échec de validation');

      // Mettre à jour l'état local
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, biometric_passed: true } : req
      ));
      setSelectedReq(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la validation de la biométrie");
    }
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
            futureDisabled={true}
            disablePast={false}
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