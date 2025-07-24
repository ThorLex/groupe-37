// StatusFilter.tsx
import React from "react";
import { Filter } from "lucide-react";

interface StatusFilterProps {
  value: string;
  onChange: (v: string) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => (
  <div className="relative">
    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <select
      aria-label="Filtrer par statut"
      className="pl-3 pr-8 py-2 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">Tous statuts</option>
      <option value="pending">En attente</option>
      <option value="approved">Approuvé</option>
      <option value="processed">Traité</option>
      <option value="rejected">Rejeté</option>
    </select>
  </div>
);