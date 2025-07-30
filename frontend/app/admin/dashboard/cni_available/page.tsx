"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Check, Send, Search } from "lucide-react";

interface AvailableCni {
  id: string;
  fullName: string;
  cinNumber: string;
  email: string;
  biometricDate: string;
  locationcni: string | null;
  cniPicked: boolean;
}

export default function AvailableCniPage() {
  const [cniList, setCniList] = useState<AvailableCni[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locationcni, setLocationCni] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // --- Fetch list ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/available-cni');
      if (!response.ok) throw new Error('Erreur de chargement des données');
      const data: AvailableCni[] = await response.json();
      setCniList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Filters & selection ---
  const filtered = useMemo(
    () => cniList.filter(c =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cinNumber.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [cniList, searchTerm]
  );

  const selectedCni = useMemo(
    () => cniList.find(c => c.id === selectedId) || null,
    [selectedId, cniList]
  );

  // --- Actions ---
  const updateLocation = async () => {
    if (!selectedId || !locationcni.trim()) return;
    setIsProcessing(true);
    setProcessingIds(ids => [...ids, selectedId]);
    try {
      const res = await fetch('/api/available-cni', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, locationcni: locationcni.trim() })
      });
      if (!res.ok) throw new Error('Échec de la mise à jour du lieu de retrait');
      setCniList(list => list.map(i => i.id === selectedId ? { ...i, locationcni: locationcni.trim() } : i));
      setLocationCni("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setProcessingIds(ids => ids.filter(i => i !== selectedId));
    }
  };

  const markPicked = async () => {
    if (!selectedId) return;
    setIsProcessing(true);
    setProcessingIds(ids => [...ids, selectedId]);
    try {
      const res = await fetch('/api/available-cni', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, markAsPicked: true })
      });
      if (!res.ok) throw new Error('Échec de la mise à jour du statut');
      setCniList(list => list.map(i => i.id === selectedId ? { ...i, cniPicked: true } : i));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setProcessingIds(ids => ids.filter(i => i !== selectedId));
    }
  };

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Gestion des CNI Disponibles</h1>
          <p className="text-slate-400">Liste des cartes nationales d&apos;identité prêtes à être retirées</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom, CIN ou email..."
              className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-100 flex justify-between items-center">
                <span>CNI Prêtes à Être Retirées</span>
                <span className="text-sm font-normal text-slate-400">
                  {filtered.length} {filtered.length === 1 ? 'résultat' : 'résultats'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg bg-slate-600" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400">Aucune CNI disponible pour le moment</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-slate-700">
                      <TableHead className="text-slate-300">Nom Complet</TableHead>
                      <TableHead className="text-slate-300">ID Demande</TableHead>
                      <TableHead className="text-slate-300">Lieu de Retrait</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((cni) => {
                      const isRowSelected = selectedId === cni.id;
                      return (
                        <TableRow
                          key={cni.id}
                          onClick={() => {
                            if (cni.cniPicked) {
                              setSelectedId(null);
                              return;
                            }
                            setSelectedId(cni.id); 
                          }}
                          className={`cursor-pointer transition-colors ${
                            isRowSelected ? "bg-blue-900/30 border-l-4 border-blue-500" : "hover:bg-slate-600"
                          } ${cni.cniPicked ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          <TableCell className="font-medium text-slate-100">
                            <div>{cni.fullName}</div>
                          </TableCell>
                          <TableCell className="text-slate-100">{cni.id}</TableCell>
                          <TableCell>
                            {cni.locationcni ? (
                              <span className="text-slate-100">{cni.locationcni}</span>
                            ) : (
                              <span className="text-slate-400 italic">Non spécifié</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cni.cniPicked ? (
                              <span className="text-green-400 font-medium flex items-center">
                                <Check className="h-4 w-4 mr-1" /> Retirée
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium">
                                {processingIds.includes(cni.id) ? "Mise à jour..." : "En attente"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side panel actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-100">Action CNI Sélectionnée</CardTitle>
                {selectedId && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCni ? (
                <>
                  <div className="text-slate-300 text-sm">
                    <span className="font-medium">Sélection :</span>
                    <div className="mt-2 p-3 bg-slate-800 rounded-lg">
                      <p className="text-slate-100 truncate">{selectedCni.fullName}</p>
                      <p className="text-slate-400 text-sm">{selectedCni.id}</p>
                    </div>
                  </div>

                  {/* 1) Définir le lieu si non défini et pas encore retirée */}
                  {!selectedCni.locationcni && !selectedCni.cniPicked && (
                    <>
                      <Input
                        placeholder="Lieu de retrait"
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        value={locationcni}
                        onChange={(e) => setLocationCni(e.target.value)}
                      />
                      <Button
                        onClick={updateLocation}
                        disabled={!locationcni.trim() || isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isProcessing && selectedId !== null && processingIds.includes(selectedId) ? (
                          <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> Traitement...</span>
                        ) : (
                          <span className="flex items-center"><Send className="mr-2 h-4 w-4" /> Définir le lieu</span>
                        )}
                      </Button>
                    </>
                  )}

                  {/* 2) Marquer retirée si un lieu existe et pas encore retirée */}
                  {selectedCni.locationcni && !selectedCni.cniPicked && (
                    <Button
                      onClick={markPicked}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing && selectedId !== null && processingIds.includes(selectedId) ? (
                        <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> Traitement...</span>
                      ) : (
                        <span className="flex items-center"><Check className="mr-2 h-4 w-4" /> Marquer retirée</span>
                      )}
                    </Button>
                  )}

                  {/* 3) Déjà retirée */}
                  {selectedCni.cniPicked && (
                    <p className="text-green-400 font-medium flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Déjà retirée
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>Sélectionnez une demande dans la liste</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-100">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-3 text-slate-300">
                <li>Cliquez sur une demande dans le tableau pour la sélectionner.</li>
                <li>Si le lieu n&apos;est pas défini, renseignez-le et validez.</li>
                <li>Si le lieu est défini, validez le retrait effectif.</li>
                <li>Une seule sélection à la fois ; pas d&apos;actions en ligne dans le tableau.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
